'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This service will provide reset database operation.
 */
const path = require('path');
const config = require('config');
const pgp = require('pg-promise')();
const logger = require('../../../common/logger');
const QueryFile = pgp.QueryFile;

// set the pool size
pgp.pg.defaults.poolSize = config.dbConfig.poolSize;
pgp.pg.defaults.poolIdleTimeout = config.dbConfig.poolIdleTimeout;

// the folder for sql files.
const relativePath = '../../../../test_files/sql/';

/**
 * Build sql file
 * @param file the sql file
 * @returns {QueryFile} the query file
 */
function sql(file) {
  return new QueryFile(path.join(__dirname, relativePath + file));
}


/**
 * Resets database for objects
 */
function* reset() {
  const db = pgp(config.dbConfig.db_url);

  // create games and prepare seed data.
  try {
    yield db.none('DROP TABLE games');
  } catch (e) {
    // ignore
  }

  yield db.none(sql('ddl.sql'));

  const games = require('../../../../test_files/games.json');

  yield db.tx((t) => {
    const inserts = [];
    games.forEach(x => {
      const keys = Object.keys(x).map((key) => `"${key}"`);
      const values = Object.keys(x).map((key) => `\${${key}}`);
      inserts.push(t.none(`INSERT INTO games (${keys.join(', ')}) values(${values.join(', ')})`, x));
    });
    return t.batch(inserts);
  });

  yield db.one(sql('after.sql'));

  // create table demo
  try {
    yield db.none('DROP TABLE demo');
  } catch (e) {
    // ignore
  }

  yield db.none(sql('demo.sql'));
}

module.exports = {
  reset
};

logger.buildService(module.exports);
