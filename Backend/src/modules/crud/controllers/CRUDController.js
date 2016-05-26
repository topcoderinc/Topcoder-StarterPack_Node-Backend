'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes CRUD REST actions.
 */
const CRUDService = require('../services/CRUDService');

/**
 * Create an object
 * @param req the request
 * @param res the response
 */
function* create(req, res) {
  const id = yield CRUDService.create(req.params.objectType, req.body);
  res.status(201).json(id);
}

/**
 * Search Objects
 * @param req the request
 * @param res the response
 */
function* search(req, res) {
  const result = yield CRUDService.search(req.params.objectType, req.query);
  res.json(result);
}


/**
 * Update an object.
 * @param req the request
 * @param res the response
 */
function* updateOne(req, res) {
  yield CRUDService.updateOne(req.params.objectType, req.params.id, req.body);
  res.status(200).end();
}


/**
 * Get an object by object type and ID.
 * @param req the request
 * @param res the response
 */
function* getOne(req, res) {
  const result = yield CRUDService.getOne(req.params.objectType, req.params.id, req.query.fieldNames);
  res.json(result);
}


/**
 * Delete an object by object type and ID.
 * @param req the request
 * @param res the response
 */
function* deleteOne(req, res) {
  yield CRUDService.deleteOne(req.params.objectType, req.params.id);
  res.status(200).end();
}

module.exports = {
  create,
  search,
  updateOne,
  getOne,
  deleteOne
};
