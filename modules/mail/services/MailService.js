
'use strict';

// imports
const _ = require('lodash');
const Joi = require('joi');
const config = require('config');
const Promise = require('bluebird');

const mailgun = require('mailgun-js')({
  apiKey: config.mailConfig.mailgunKey,
  domain: config.mailConfig.mailgunDomain
});

// local imports
const logger = require('../../../common/logger');
const CRUDService = require('../../crud/services/CRUDService');

const attachment = Joi.object().keys({
  file_name: Joi.string().required(),
  file_type: Joi.string().required(),
  content_bytes: Joi.binary().encoding('base64').required()
});

const image = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
  content_bytes: Joi.binary().encoding('base64').required()
});

const emailSchema = Joi.object().keys({
  sender: Joi.string().email().required(),
  recipients: Joi.array().items(Joi.string().email()).required(),
  cc_recipients: Joi.array().items(Joi.string().email()),
  bcc_recipients: Joi.array().items(Joi.string().email()),
  subject: Joi.string(),
  html_body: Joi.string(),
  text_body: Joi.string(),
  attachments: Joi.array().items(attachment),
  images: Joi.array().items(image),
  headers: Joi.array().items(Joi.string().regex(/^([^:]+?):(.+)$/)),
  delivery_time: Joi.date().iso() // ISO 8601 date format.
});

const status = {
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  FAILED: 'failed'
};

/**
 * toAttachment convert image/attachment to mailgun attachment format
 * @param  {object} attach Image/Attachment, refer to emailApi.yaml
 * @return {object}        mailgun.Attachment
 */
function toAttachment(attach) {
  return new mailgun.Attachment({
    data: Buffer.from(attach.content_bytes, 'base64'),
    contentType: attach.file_type || attach.type,
    filename: attach.file_name || attach.name
  });
}

/**
 * send email using mailgun API
 * @param {object} email Email object, refer to emailApi.yaml
 * @yield {object} Response/Error, refer to emailApi.yaml
 */
function* sendMail(email) {
  /*
   Sample Email Object
   {
    "email": {
        "sender": "{{address}}",
        "recipients": ["{{address}}"],
        "subject": "test email",
        "html_body": "<div>test</div>",
        "text_body": "test-test-test",
        "headers": ["x-test-header:1234"]
    }
   }
   headers should be in "headerName:headerValue" format
   attachment content_bytes should be base64 encoded.
   delivery_time in format of ISO 8601 date format
   */

  /** @type {Object} data  data to be sent to mailgun API */
  const data = {
    from: email.sender,
    to: email.recipients.join(',')
  };

  // add cc_recipients if exist
  if (_.has(email, 'cc_recipients')) {
    data.cc = email.cc_recipients.join(',');
  }

  // add bcc_recipients if exist
  if (_.has(email, 'bcc_recipients')) {
    data.bcc = email.bcc_recipients.join(',');
  }

  // add subject if exist
  if (_.has(email, 'subject')) {
    data.subject = email.subject;
  }

  // add text_body if exist
  if (_.has(email, 'text_body')) {
    data.text = email.text_body;
  }

  // add html_body if exist
  if (_.has(email, 'html_body')) {
    data.html = email.html_body;
  }

  // add attachments if exist
  if (_.has(email, 'attachments')) {
    data.attachment = _.map(email.attachments, toAttachment);
  }

  // add inline images if exist
  if (_.has(email, 'images')) {
    data.inline = _.map(email.images, toAttachment);
  }

  // add headers if exist
  if (_.has(email, 'headers')) {
    _.map(email.headers, (h) => {
      const match = /^([^:]+?):(.+)$/.exec(h); // split first colon
      if (match) {
        const headerName = match[1];
        const headerValue = match[2];
        data['h:' + headerName] = headerValue;
      }
    });
  }

  // schedule delivery if exist
  let deliverytime; // because mailgun only understand timezone info in 4 digits, not like "GMT "
  if (_.has(email, 'delivery_time') && new Date(email.delivery_time) > _.now()) {
    deliverytime = new Date(email.delivery_time).toUTCString();
    deliverytime = deliverytime.slice(0, deliverytime.length - 4) + ' 0000';
    data['o:deliverytime'] = email.delivery_time = deliverytime;
  } else {
    // send it directly and record it.
    email.delivery_time = new Date().toUTCString();
  }

  /** @type {Array} crudData - data to be saved to postgres for tracking api */
  const crudData = [
    { fieldName: 'data', fieldValue: JSON.stringify(email) }
  ];

  /** @type {string} mailgunId -  id returned from mailgun api call */
  let mailgunId = null;
  /** @type {Boolean} delivered - flag for delivery status */
  let delivered = false;

  // request mailgun to send the mail
  logger.info('request mailgun with: ', data);
  /** @type {Object} response - object that will be sent to the client */
  const response = yield new Promise((resolve) => {
    mailgun.messages().send(data, (err, body) => {
      if (!err) {
        logger.info('response mailgun success:', body);

        mailgunId = body.id;
        delivered = true;
        resolve({
          result: {
            success: true,
            code: 200
          }
        });
      } else {
        logger.info('response mailgun error:', err);

        resolve({
          code: err.statusCode,
          message: err.message
        });
      }
    });
  });

  // save mail record to postgres
  if (delivered) {
    crudData.push({ fieldName: 'mgid', fieldValue: JSON.stringify(mailgunId) });
    response.id = yield CRUDService.create('emails', crudData);
  }

  return response;
}
sendMail.schema = {
  email: emailSchema
};

/**
 * track email delivery information
 * @param {Number} id    id of email
 * @yield {object} DeliveryStatus/Error. refer to emailApi.yaml
 */
function* getMailStatus(id) {
  const result = yield CRUDService.getOne('emails', id, ['mgid']);
  const mgId = JSON.parse(result[0].fieldValue);

  const response = yield new Promise((resolve) => {
    // query mailgun for delivery information
    mailgun.events().get({
      // mailgun message-id saved enclosed in brackets
      'message-id': mgId.slice(1, mgId.length - 1)
    }, (err, body) => {
      // error response from mailgun
      if (err) {
        logger.info('response mailgun error:', err);
        resolve({
          code: err.statusCode,
          message: err.message
        });
        return;
      }

      logger.info('response mailgun success:', body);

      // pick latest delivery information
      const deliverEvent = _.chain(body.items)
                            .sortBy('timestamp')
                            .last()
                            .value();

      if (!deliverEvent) {
        resolve({
          code: 404,
          message: 'mail id ' + id + ' not found from mailgun event logs. could be deleted from mailgun event logs.'
        });
        return;
      }

      if (deliverEvent.event === status.DELIVERED) {
        resolve({
          delivered: true,
          // because mailgun returns unix timestamp in seconds for delivery_time
          delivery_time: new Date(deliverEvent.timestamp * 1000).toISOString()
          // may or may not return delivery_status on sucessful delivery
          // ,delivery_status: status.DELIVERED
        });
      } else {
        // not yet delivered
        resolve({
          delivered: false,
          delivery_status: deliverEvent.event
        });
      }
    });
  });
  return response;
}
getMailStatus.schema = {
  id: Joi.id().required()
};

/**
 * getMail get mail information from database
 * @param {Number} id  id of email
 * @yield {object} Email/Error. refer to emailApi.yaml
 */
function* getMail(id) {
  const result = yield CRUDService.getOne('emails', id, ['data']);
  const email = JSON.parse(result[0].fieldValue);
  return email;
}
getMail.schema = {
  id: Joi.id().required()
};

/**
 * deleteMail delete an email
 * @param {Number} id      id of email
 * @yield {object} Response/Error. refer to emailApi.yaml
 */
function* deleteMail(id) {
  yield CRUDService.deleteOne('emails', id);
  return {
    id,
    result: {
      success: true,
      message: `email id ${id} successfully deleted.`
    }
  };
}
deleteMail.schema = {
  id: Joi.id().required()
};

/**
 * get mailgun stats for the last month
 * @yield {object} MailgunStatistics/Error mailgun stat information refer to emailApi.yaml
 */
function* getMailStatistics() {
  const result = yield new Promise((resolve) => {
    mailgun.stats().list({
      event: [status.ACCEPTED, status.FAILED, status.DELIVERED],
      duration: '1m' }, (err, body) => {
      // error response from mailgun
      if (err) {
        logger.info('response mailgun error:', err);
        resolve({
          code: err.statusCode,
          message: err.message
        });
        return;
      }

      logger.info('response mailgun success:', body);

      /** @type {array} items - get latest status for each kind of event */
      const items = _.chain(body.items)
                     .sortBy((i) => new Date(i.created_at))
                     .reverse()
                     .value();

      /** @type {Object} response - response to return. some attributes are optional as mailgun may not return them */
      const response = {};

      const delivered = _.find(items, (i) => i.event === status.DELIVERED);
      if (delivered) {
        response.delivered = delivered.total_count;
      }
      const failed = _.find(items, (i) => i.event === status.FAILED);
      if (failed) {
        response.failed = failed.total_count;
      }
      const accepted = _.find(items, (i) => i.event === status.ACCEPTED);
      if (accepted) {
        response.accepted = accepted.total_count;
      }

      resolve(response);
    });
  });
  return result;
}

module.exports = {
  sendMail,
  getMailStatistics,
  getMail,
  deleteMail,
  getMailStatus
};

logger.buildService(module.exports);
