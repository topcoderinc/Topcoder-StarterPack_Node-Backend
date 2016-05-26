'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes reset database REST action.
 */
const DemoService = require('../services/DemoService');

/**
 * Resets database for objects
 * @param req the request
 * @param res the response
 */
function* reset(req, res) {
  yield DemoService.reset();
  res.status(200).end();
}

module.exports = {
  reset
};
