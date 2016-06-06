'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This configuration of passport for express App.
 */
const glob = require('glob');
const path = require('path');
const passport = require('passport');

/**
 * Configure passport for express
 * @param app the express app
 */
module.exports = (app) => {
  // Init passport
  app.use(passport.initialize());

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });


  // load all passport strategies in passports folder.
  glob.sync(path.join(__dirname, './passports/*.js'))
    .forEach((strategy) => require(path.resolve(strategy))(passport));
};
