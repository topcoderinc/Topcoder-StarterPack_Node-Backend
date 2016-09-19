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


describe('GET /objects/games/:id', () => {
  const apiPath = `${apiVersion}/objects/games/`;

  it('get with id', (done) => {
    api
      .get(apiPath + '2609')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.deepEqual(res.body, data.game2609);
        done();
      });
  });

  it('get with single field name', (done) => {
    api
      .get(apiPath + '2609?fieldNames=name')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.length, 1);
        const item = res.body[0];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'name');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"10 Days in Africa"');
        done();
      });
  });

  it('get with fields', (done) => {
    api
      .get(apiPath + '2609?fieldNames=name&fieldNames=image')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.length, 2);
        let item = res.body[0];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'name');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"10 Days in Africa"');
        item = res.body[1];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'image');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"http://cf.geekdo-images.com/images/pic1229634.jpg"');
        done();
      });
  });

  it('get with fields []', (done) => {
    api
      .get(apiPath + '2609?fieldNames[]=name&fieldNames[]=image')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.length, 2);
        let item = res.body[0];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'name');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"10 Days in Africa"');
        item = res.body[1];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'image');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"http://cf.geekdo-images.com/images/pic1229634.jpg"');
        done();
      });
  });

  it('get with fields [index]', (done) => {
    api
      .get(apiPath + '2609?fieldNames[1]=name&fieldNames[0]=image')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.length, 2);
        let item = res.body[0];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'image');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"http://cf.geekdo-images.com/images/pic1229634.jpg"');
        item = res.body[1];
        assert.property(item, 'fieldName');
        assert.equal(item.fieldName, 'name');
        assert.property(item, 'fieldValue');
        assert.equal(item.fieldValue, '"10 Days in Africa"');
        done();
      });
  });

  it('get with invalid id (too small)', (done) => {
    api
      .get(apiPath + '-1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be larger than or equal to 1');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('get with invalid id (too large)', (done) => {
    api
      .get(apiPath + '9999999999999999999')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be less than or equal to 9223372036854776000');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('get with invalid id (not integer)', (done) => {
    api
      .get(apiPath + '1.1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be an integer');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('get with not exist id', (done) => {
    api
      .get(apiPath + '999999')
      .set({
        authorization: testHelper.token
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Could not find games by id 999999');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 404);
        done();
      });
  });

  it('get with not exist field', (done) => {
    api
      .get(apiPath + '2609?fieldNames=notexist')
      .set({
        authorization: testHelper.token
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'column "notexist" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('get with not exist table', (done) => {
    api
      .get(`${apiVersion}/objects/notexist/2609`)
      .set({
        authorization: testHelper.token
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'relation "notexist" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('get with none roles token', (done) => {
    api
      .get(apiPath + '2609')
      .set({
        authorization: testHelper.noRolesToken
      })
      .expect(403)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'You are not allowed to perform this action!');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 403);
        done();
      });
  });

  it('get with no token', (done) => {
    api
      .get(apiPath + '2609')
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });

  it('get with invalid token', (done) => {
    api
      .get(apiPath + '2609')
      .set({
        authorization: testHelper.invalidToken
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Failed to authenticate jwt token.');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });
});


describe('GET /objects/games/', () => {
  const apiPath = `${apiVersion}/objects/games`;

  it('searh all games', (done) => {
    api
      .get(apiPath)
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 507);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 1);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 507);
        _.each(res.body.items, (item) => {
          assert.property(item, 'objectType');
          assert.equal(item.objectType, 'games');
          assert.property(item, 'id');
          assert.property(item, 'fields');

          if (item.id === 2609) {
            assert.deepEqual(item.fields, data.game2609);
          } else if (item.id === 2611) {
            assert.deepEqual(item.fields, data.game2611);
          }
        });
        done();
      });
  });

  it('search with pageSize and pageNumber', (done) => {
    api
      .get(apiPath + '?pageSize=2&pageNumber=2')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 507);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 254);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 2);
        _.each(res.body.items, (item) => {
          assert.property(item, 'objectType');
          assert.equal(item.objectType, 'games');
          assert.property(item, 'id');
          assert.property(item, 'fields');

          if (item.id === 2611) {
            assert.deepEqual(item.fields, data.game2611);
          }
        });
        done();
      });
  });

  it('search with sortBy and sortOrder', (done) => {
    api
      .get(apiPath + '?sortOrder=Descending&sortBy=name')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 507);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 1);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 507);

        let item = res.body.items[0];
        assert.property(item, 'objectType');
        assert.equal(item.objectType, 'games');
        assert.property(item, 'id');
        assert.equal(item.id, 3115);
        assert.property(item, 'fields');
        assert.deepEqual(item.fields, data.game3115);

        item = res.body.items[506];
        assert.property(item, 'objectType');
        assert.equal(item.objectType, 'games');
        assert.property(item, 'id');
        assert.equal(item.id, 2609);
        assert.property(item, 'fields');
        assert.deepEqual(item.fields, data.game2609);

        done();
      });
  });

  it('search with ExactMatching', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=name&matchCriteria[][value]="7 Wonders"&matchCriteria[][matchType]=ExactMatching')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 1);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 1);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 1);

        const item = res.body.items[0];
        assert.property(item, 'objectType');
        assert.equal(item.objectType, 'games');
        assert.property(item, 'id');
        assert.equal(item.id, 2616);
        assert.property(item, 'fields');
        assert.deepEqual(item.fields, data.game2616);

        done();
      });
  });

  it('search with PartialMatching', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=name&matchCriteria[][value]="ab"&matchCriteria[][matchType]=PartialMatching&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 10);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 2);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2617, 2623, 2624, 2740, 2823];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with Greater', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="1"&matchCriteria[][matchType]=Greater&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 332);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 67);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2609, 2610, 2611, 2612, 2614];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with GreaterOrEqual', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="1"&matchCriteria[][matchType]=GreaterOrEqual&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 333);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 67);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2609, 2610, 2611, 2612, 2614];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with Equal number', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="1"&matchCriteria[][matchType]=Equal&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 1);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 1);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 1);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2921];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with Equal bool true', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=owned&matchCriteria[][value]="true"&matchCriteria[][matchType]=Equal&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 380);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 76);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2609, 2610, 2611, 2612, 2613];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with Equal bool Y', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=owned&matchCriteria[][value]="Y"&matchCriteria[][matchType]=Equal&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 380);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 76);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2609, 2610, 2611, 2612, 2613];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with Less', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="1"&matchCriteria[][matchType]=Less&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 174);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 35);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2613, 2617, 2618, 2620, 2621];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with LessOrEqual', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="1"&matchCriteria[][matchType]=Less&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 174);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 35);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 5);

        const itemsIds = _.map(res.body.items, 'id').sort();
        const expect = [2613, 2617, 2618, 2620, 2621];
        assert.deepEqual(itemsIds, expect);

        done();
      });
  });

  it('search with complex criteria', (done) => {
    api
      .get(apiPath + '?matchCriteria[0][fieldName]=owned&matchCriteria[0][value]="Y"&matchCriteria[0][matchType]=Equal&pageSize=5&pageNumber=1'
        + '&matchCriteria[1][fieldName]=name&matchCriteria[1][value]="10 Days in Africa"&matchCriteria[1][matchType]=ExactMatching')
      .set({
        authorization: testHelper.token
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'totalRecords');
        assert.equal(res.body.totalRecords, 1);
        assert.property(res.body, 'totalPages');
        assert.equal(res.body.totalPages, 1);

        assert.property(res.body, 'items');
        assert.equal(res.body.items.length, 1);

        const item = res.body.items[0];
        assert.property(item, 'objectType');
        assert.equal(item.objectType, 'games');
        assert.property(item, 'id');
        assert.equal(item.id, 2609);
        assert.property(item, 'fields');
        assert.deepEqual(item.fields, data.game2609);

        done();
      });
  });

  it('search with invalid json value', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=name&matchCriteria[][value]=a&matchCriteria[][matchType]=ExactMatching&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Invalid json string field value for \'name\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid match type for string', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=name&matchCriteria[][value]="a"&matchCriteria[][matchType]=GreaterOrEqual&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Invalid matchType for \'name\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid match type for not string', (done) => {
    api
      .get(apiPath + '?matchCriteria[][fieldName]=rank&matchCriteria[][value]="3"&matchCriteria[][matchType]=ExactMatching&pageSize=5&pageNumber=1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Invalid matchType for \'rank\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid pageSize', (done) => {
    api
      .get(apiPath + '?pageSize=0&pageNumber=2')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'query.pageSize');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"pageSize" must be larger than or equal to 1');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid pageNumber', (done) => {
    api
      .get(apiPath + '?pageSize=2&pageNumber=-2')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'query.pageNumber');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"pageNumber" must be larger than or equal to 0');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid sortBy', (done) => {
    api
      .get(apiPath + '?sortOrder=Descending&sortBy=notexist')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'There is no such column called \'notexist\' for \'games\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search with invalid sortOrder', (done) => {
    api
      .get(apiPath + '?sortOrder=invalid&sortBy=name')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'query.sortOrder');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"sortOrder" must be one of [Ascending, Descending]');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);

        done();
      });
  });

  it('search without token', (done) => {
    api
      .get(apiPath)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);

        done();
      });
  });

  it('search with invalid token', (done) => {
    api
      .get(apiPath)
      .set({
        authorization: testHelper.invalidToken
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Failed to authenticate jwt token.');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);

        done();
      });
  });

  it('search with non roles token', (done) => {
    api
      .get(apiPath)
      .set({
        authorization: testHelper.noRolesToken
      })
      .expect(403)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'You are not allowed to perform this action!');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 403);

        done();
      });
  });
});


describe('POST /objects/games', () => {
  let newId;
  const apiPath = `${apiVersion}/objects/games/`;

  beforeEach((done) => {
    newId = undefined;
    done();
  });

  afterEach((done) => {
    if (newId) {
      // Removed item with new id);
      api
        .delete(apiPath + newId)
        .set({
          authorization: testHelper.token
        })
        .end(() => {
          done();
        });
    } else {
      done();
    }
  });

  it('create new game', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.gameNew)
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        newId = res.body;
        done();
      });
  });

  it('create with double-quotes', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: '"gameId"', fieldValue: '8888' }])
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        newId = res.body;
        done();
      });
  });

  it('create with invalid json in field value', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'invalidjson', fieldValue: 'a' }])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Invalid json string field value for \'invalidjson\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('create with not exist field', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'notexist', fieldValue: '"a"' }])
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'column "notexist" of relation "games" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('create with user role', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.userToken
      })
      .send(data.gameNew)
      .expect(403)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'You are not allowed to perform this action!');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 403);
        done();
      });
  });

  it('create with empty fields', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send([])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must contain at least 1 items');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('create with not exist table', (done) => {
    api
      .post(`${apiVersion}/objects/notexist/`)
      .set({
        authorization: testHelper.token
      })
      .send(data.gameNew)
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'relation "notexist" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('create with wrong body', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send({ wrong: true })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must be an array');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('create with unexpected fields object', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'notexist', fieldValue: '"a"', wrong: 2 }])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields.0.wrong');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"wrong" is not allowed');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('create with no fields', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must be an array');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('create without token', (done) => {
    api
      .post(apiPath)
      .send(testHelper.gameNew)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });

  it('create without invalid token', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.invalidToken
      })
      .send(testHelper.gameNew)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Failed to authenticate jwt token.');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });
});


describe('PUT /objects/games/:id', () => {
  let newId;
  const apiPath = `${apiVersion}/objects/games/`;

  before((done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.gameNew)
      .end((err, res) => {
        newId = res.body;
        done();
      });
  });

  after((done) => {
    api
      .delete(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .end(() => {
        done();
      });
  });

  it('update game', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send(data.gameUpdate)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('update with double-quotes', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: '"gameId"', fieldValue: '99999' }])
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('update and set null', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'gameId', fieldValue: '"null"' }])
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('update with not exist id', (done) => {
    api
      .put(apiPath + '999999999')
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: '"gameId"', fieldValue: '99999' }])
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Could not find games by id 999999999');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 404);
        done();
      });
  });

  it('update with not exist table', (done) => {
    api
      .put(apiVersion + '/objects/notexist/1')
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: '"gameId"', fieldValue: '99999' }])
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'relation "notexist" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('update with invalid json', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'invalidjson', fieldValue: 'a' }])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Invalid json string field value for \'invalidjson\'');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('update with not exist field', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'notexist', fieldValue: '"a"' }])
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'column "notexist" of relation "games" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('update with user role', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.userToken
      })
      .send(data.gameUpdate)
      .expect(403)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'You are not allowed to perform this action!');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 403);
        done();
      });
  });

  it('update with empty fields', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must contain at least 1 items');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('update with wrong body', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send({ wrong: true })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must be an array');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('update with unexpected fields object', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .send([{ fieldName: 'notexist', fieldValue: '"a"', wrong: 2 }])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields.0.wrong');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"wrong" is not allowed');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('update with no fields', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'fields');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"fields" must be an array');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('update without token', (done) => {
    api
      .put(apiPath + newId)
      .send(data.gameUpdate)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });

  it('update with invalid token', (done) => {
    api
      .put(apiPath + newId)
      .set({
        authorization: testHelper.invalidToken
      })
      .send(data.gameUpdate)
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Failed to authenticate jwt token.');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });
});


describe('DELETE /objects/games/:id', () => {
  const apiPath = `${apiVersion}/objects/games/`;

  it('delete a game', (done) => {
    api
      .post(apiPath)
      .set({
        authorization: testHelper.token
      })
      .send(data.gameNew)
      .end((err, res) => {
        const newId = res.body;
        api
          .delete(apiPath + newId)
          .set({
            authorization: testHelper.token
          })
          .expect(200)
          .end((err2) => {
            if (err2) {
              return done(err2);
            }
            done();
          });
      });
  });

  it('delete with invalid id (too small)', (done) => {
    api
      .delete(apiPath + '-1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be larger than or equal to 1');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('delete with invalid id (too large)', (done) => {
    api
      .delete(apiPath + '9999999999999999999')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be less than or equal to 9223372036854776000');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('delete with invalid id (not integer)', (done) => {
    api
      .delete(apiPath + '1.1')
      .set({
        authorization: testHelper.token
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'fields');
        assert.equal(res.body.fields, 'id');
        assert.property(res.body, 'message');
        assert.equal(res.body.message, '"id" must be an integer');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 400);
        done();
      });
  });

  it('delete with not exist id', (done) => {
    api
      .delete(apiPath + '999999')
      .set({
        authorization: testHelper.token
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Could not find games by id 999999');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 404);
        done();
      });
  });

  it('delete with not exist table', (done) => {
    api
      .delete(`${apiVersion}/objects/notexist/2609`)
      .set({
        authorization: testHelper.token
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'relation "notexist" does not exist');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 500);
        done();
      });
  });

  it('delete with none roles token', (done) => {
    api
      .delete(apiPath + '2609')
      .set({
        authorization: testHelper.noRolesToken
      })
      .expect(403)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'You are not allowed to perform this action!');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 403);
        done();
      });
  });

  it('delete with no token', (done) => {
    api
      .delete(apiPath + '2609')
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'UnauthorizedError');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });

  it('delete with invalid token', (done) => {
    api
      .delete(apiPath + '2609')
      .set({
        authorization: testHelper.invalidToken
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.property(res.body, 'message');
        assert.equal(res.body.message, 'Failed to authenticate jwt token.');
        assert.property(res.body, 'code');
        assert.equal(res.body.code, 401);
        done();
      });
  });
});

