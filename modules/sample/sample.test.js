'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */


const assert = require('chai').assert;
const _ = require('lodash');
const testHelper = require('../../test/test-helper');
const api = testHelper.api;
const apiVersion = testHelper.apiVersion;
const data = testHelper.data;


describe('Demo', () => {
  const apiPath = `${apiVersion}/objects/demo`;
  let demoId = undefined;

  it('create with complex fields(json,array)', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.demo)
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        demoId = res.body;

        done();
      });
  });

  it('get item', (done) => {
    api
      .get(`${apiPath}/${demoId}`)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.equal(res.body.length, 5);
        _.each(res.body, (item) => {
          if (item.fieldName === 'id') {
            assert.equal(item.fieldValue, '' + demoId);
          } else if (item.fieldName === 'name') {
            assert.equal(item.fieldValue, 'null');
          }
        });

        done();
      });
  });

  it('reset', (done) => {
    api
      .post(`${apiVersion}/reset`)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }

        done();
      });
  });
});
