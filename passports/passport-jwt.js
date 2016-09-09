'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * Register JWT passport strategy.
 */
const jwt = require('jsonwebtoken');
const config = require('config');
const constants = require('../constants');
const BearerStrategy = require('passport-http-bearer');
const UnauthorizedError = require('../common/errors').UnauthorizedError;

/**
 * Export jwt passport strategy
 * @param passport the passport
 */
module.exports = (passport) => {
  passport.use(constants.Passports.jwt, new BearerStrategy((token, done) => {
    jwt.verify(token, config.authSecret, (err, decoded) => {
      if (err) {
        done(new UnauthorizedError('Failed to authenticate jwt token.', err));
      } else if (decoded) {
        done(null, decoded);
      } else {
        done(null, false);
      }
    });
  }));
};
