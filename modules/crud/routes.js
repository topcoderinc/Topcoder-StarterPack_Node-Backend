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
  '/objects/:objectType': {
    get: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'CRUDController',
      method: 'search'
    },
    post: {
      auth: jwtAuth,
      access: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'CRUDController',
      method: 'create'
    }
  },
  '/objects/:objectType/:id': {
    get: {
      auth: jwtAuth,
      access: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'CRUDController',
      method: 'getOne'
    },
    put: {
      auth: jwtAuth,
      access: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'CRUDController',
      method: 'updateOne'
    },
    delete: {
      auth: jwtAuth,
      access: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      controller: 'CRUDController',
      method: 'deleteOne'
    }
  }
};
