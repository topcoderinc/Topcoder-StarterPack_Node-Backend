'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * Contains all routes.
 */

const constants = require('../../constants');
const UserRole = constants.UserRole;
const jwtAuth = constants.Passports.jwt;

module.exports = {
  '/reset': {
    post: {
      auth: jwtAuth,
      access: [UserRole.SUPER_ADMIN],
      controller: 'DemoController',
      method: 'reset'
    }
  }
};
