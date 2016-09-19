'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */


const assert = require('chai').assert;
const testHelper = require('../../test/test-helper');
const api = testHelper.api;
const apiVersion = testHelper.apiVersion;
const data = testHelper.data;


describe('Email functions', () => {
  const apiPath = `${apiVersion}/emails`;
  let emailId = 1;

  it('send email', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.emailNew)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'id');
        assert.isNumber(res.body.id);
        assert.property(res.body, 'result');
        const result = res.body.result;
        assert.property(result, 'success');
        assert.equal(result.success, true);
        assert.property(result, 'code');
        assert.equal(result.code, 200);

        emailId = res.body.id;

        done();
      });
  });

  it('get email', (done) => {
    api
      .get(`${apiPath}/${emailId}`)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'sender');
        assert.equal(res.body.sender, 'thkang91@gmail.com');
        assert.property(res.body, 'recipients');
        assert.property(res.body, 'subject');
        assert.equal(res.body.subject, 'test email');
        assert.property(res.body, 'html_body');
        assert.equal(res.body.html_body, '<div>test</div>');
        assert.property(res.body, 'text_body');
        assert.equal(res.body.text_body, 'test-test-test');
        assert.property(res.body, 'headers');
        assert.property(res.body, 'attachments');
        assert.property(res.body, 'delivery_time');

        done();
      });
  });


  it('email api access with bad token', (done) => {
    api
      .get(`${apiPath}/${emailId}`)
      .set({
        authorization: '123'
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');

        done();
      });
  });

  it('get Mailgun statistics', (done) => {
    api
      .get(`${apiPath}/stats`)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'delivered');
        assert.isNumber(res.body.delivered);

        done();
      });
  });

  it('send email with image attachment', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.emailNewWithImage)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'id');
        assert.isNumber(res.body.id);
        assert.property(res.body, 'result');
        const result = res.body.result;
        assert.property(result, 'success');
        assert.equal(result.success, true);
        assert.property(result, 'code');
        assert.equal(result.code, 200);

        done();
      });
  });

  it('send email scheduled', (done) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    data.emailNewScheduled.email.delivery_time = date.toISOString();

    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.emailNewScheduled)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'id');
        assert.isNumber(res.body.id);
        assert.property(res.body, 'result');
        const result = res.body.result;
        assert.property(result, 'success');
        assert.equal(result.success, true);
        assert.property(result, 'code');
        assert.equal(result.code, 200);

        done();
      });
  });

  it('get delivery status', (done) => {
    api
      .get(apiPath + '/' + data.emailIdDeliveried + '/deliveryStatus')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'delivered');
        assert.equal(res.body.delivered, true);
        assert.property(res.body, 'delivery_time');

        done();
      });
  });


  it('get delivery status with not exist id', (done) => {
    api
      .get(`${apiPath}/99999/deliveryStatus`)
      .set({
        authorization: testHelper.token
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'code');
        assert.equal(res.body.code, 404);
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Could not find emails by id 99999');

        done();
      });
  });

  it('delete email', (done) => {
    api
      .delete(`${apiPath}/${emailId}`)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'id');
        assert.equal(res.body.id, emailId);
        assert.property(res.body, 'result');
        const result = res.body.result;
        assert.property(result, 'success');
        assert.equal(result.success, true);
        assert.property(result, 'message');
        assert.equal(result.message, `email id ${emailId} successfully deleted.`);

        done();
      });
  });
});
