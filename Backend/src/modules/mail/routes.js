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
  '/emails': {
    post: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'MailController',
      method: 'sendMail'
    }
  },
  '/emails/:id/deliveryStatus': {
    get: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'MailController',
      method: 'getMailStatus'
    }
  },
  '/emails/stats': {
    get: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'MailController',
      method: 'getMailStatistics'
    }
  },
  '/emails/:id': {
    get: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'MailController',
      method: 'getMail'
    },
    delete: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'MailController',
      method: 'deleteMail'
    }
  }
};
