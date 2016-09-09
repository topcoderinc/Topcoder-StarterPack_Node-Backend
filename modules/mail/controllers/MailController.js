'use strict';

const MailService = require('../services/MailService');

/**
 * Send an email
 * @param req the request
 * @param res the response
 */
function* sendMail(req, res) {
  const result = yield MailService.sendMail(req.body.email);
  // code is only set when MailService failed to receive 200 ok from Mailgun API
  res.status(result.code || 200).json(result);
}

/**
 * Track an email's delivery status
 * @param req the request
 * @param res the response
 */
function* getMailStatus(req, res) {
  const result = yield MailService.getMailStatus(req.params.id);
  // code is only set when MailService failed to receive 200 ok from Mailgun API
  res.status(result.code || 200).json(result);
}

/**
 * Fetch an email
 * @param req the request
 * @param res the response
 */
function* getMail(req, res) {
  res.json(yield MailService.getMail(req.params.id));
}

/**
 * Delete an email
 * @param req the request
 * @param res the response
 */
function* deleteMail(req, res) {
  res.json(yield MailService.deleteMail(req.params.id));
}

/**
 * get mailgun stats for last month
 * @param req the request
 * @param res the response
 */
function* getMailStatistics(req, res) {
  res.json(yield MailService.getMailStatistics());
}

module.exports = {
  sendMail,
  getMailStatus,
  getMail,
  deleteMail,
  getMailStatistics
};
