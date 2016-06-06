'use strict';
/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This service will provide CRUD operations for postgres database.
 */
const _ = require('lodash');
const Joi = require('joi');
const config = require('config');
const ValidationError = require('../../../common/errors').ValidationError;
const NotFoundError = require('../../../common/errors').NotFoundError;
const logger = require('../../../common/logger');

const pgp = require('pg-promise')();
const db = pgp(config.dbConfig.db_url);

// set the pool size
pgp.pg.defaults.poolSize = config.dbConfig.poolSize;
pgp.pg.defaults.poolIdleTimeout = config.dbConfig.poolIdleTimeout;

/**
 * Check exist of object by id.
 * @param {String} objectType the type of object
 * @param {Number} id the id of object
 * @param {Object} result the result to check
 * @param {bool} checkRowCount the flag to check row count
 * @private
 */
function _checkExist(objectType, id, result, checkRowCount) {
  if (!result || (checkRowCount && !result.rowCount)) {
    throw new NotFoundError(`Could not find ${objectType} by id ${id}`);
  }
}


/**
 * Wrap name with double-quotes to work with keyword properly
 * see
 * http://www.postgresql.org/docs/9.5/static/sql-syntax-lexical.html
 * @param {String} name the name to escape
 * @param {bool} remove the flag to remove double-quotes
 * @returns {String} the escaped name
 * @private
 */
function _escapeName(name, remove) {
  if (/".*"/.test(name)) {
    return remove ? name.substring(1, name.length - 1) : name;
  }
  return remove ? name : `"${name}"`;
}

/**
 * Parse parameters
 * @param {Array} values the array with field name/value to insert
 * @private
 */
function _getParameters(values) {
  return _.chain(values)
    .keyBy(x => _escapeName(x.fieldName, true))
    .mapValues(x => {
      try {
        return JSON.parse(x.fieldValue);
      } catch (e) {
        throw new ValidationError(`Invalid json string field value for '${x.fieldName}'`, e);
      }
    })
    .value();
}


/**
 * Prepare SQL query to create an object
 * @param {String} tableName the table name
 * @param {Array} values the array with field name/value to insert
 * @returns {Object} the SQL query with parameters
 * @private
 */
function _createQuery(tableName, values) {
  const columnNames = _.chain(values).map(x => _escapeName(x.fieldName)).value();
  const parameters = _getParameters(values);
  const paramNames = _.keys(parameters).map((key) => `\${${key}}`);
  return {
    sql: `INSERT INTO ${_escapeName(tableName)} (${columnNames.join(', ')}) values(${paramNames.join(', ')}) returning id`,
    parameters
  };
}

/**
 * Prepare SQL query to get one object
 * @param {String} tableName the table name
 * @param {Number} id the id
 * @param {Array} fields the array with fields to return
 * @private
 */
function _getOneQuery(tableName, id, fields) {
  const columnNames = fields && fields.length > 0 ? fields.map(_escapeName).join(', ') : '*';
  return {
    sql: `SELECT ${columnNames} FROM ${_escapeName(tableName)} WHERE id = $1`,
    parameters: id
  };
}

/**
 * Prepare SQL query to delete an object by object type and ID
 * @param {String} tableName the table name
 * @param {Number} id the id
 * @private
 */
function _deleteOneQuery(tableName, id) {
  return {
    sql: `DELETE FROM ${_escapeName(tableName)} WHERE id = $1`,
    parameters: id
  };
}

/**
 * Prepare SQL query to update an object
 * @param {String} tableName the table name
 * @param {Number} id the id
 * @param {Array} values the array with field name/value to insert
 * @private
 */
function _updateOneQuery(tableName, id, values) {
  const columnNames = _.chain(values).map(x => `${_escapeName(x.fieldName)}=\${${_escapeName(x.fieldName, true)}}`).value();
  const parameters = _getParameters(values);
  parameters.id = id;
  return {
    sql: `UPDATE ${_escapeName(tableName)} SET ${columnNames.join(', ')} WHERE id = \${id}`,
    parameters
  };
}

/**
 * The sql operators with match type
 */
const searchOperators = {
  PartialMatching: 'ILIKE',
  ExactMatching: '=',
  Greater: '>',
  GreaterOrEqual: '>=',
  Equal: '=',
  Less: '<',
  LessOrEqual: '<='
};

/**
 * Prepare SQL query to search objects
 * @param {String} tableName the table name
 * @param {Object} criteria the search criteria
 * @param {Array} columns the columns of table
 * @private
 */
function _searchQuery(tableName, criteria, columns) {
  criteria.matchCriteria = criteria.matchCriteria || [];
  const parameters = _.chain(criteria.matchCriteria)
    .keyBy(x => _escapeName(x.fieldName, true))
    .mapValues(x => {
      const column = _.find(columns, c => c.name === x.fieldName);
      if (!column) {
        throw new ValidationError(`There is no such column called '${x.fieldName}' for '${tableName}'`);
      }
      const columnType = column.type.toLowerCase();
      // http://www.postgresql.org/docs/9.5/static/datatype-character.html
      const isStringType = columnType === 'text' || columnType.indexOf('char') !== -1;

      if (isStringType && ['PartialMatching', 'ExactMatching'].indexOf(x.matchType) === -1) {
        throw new ValidationError(`Invalid matchType for '${x.fieldName}'`);
      } else if (!isStringType && ['PartialMatching', 'ExactMatching'].indexOf(x.matchType) !== -1) {
        throw new ValidationError(`Invalid matchType for '${x.fieldName}'`);
      }
      try {
        const val = JSON.parse(x.value);
        return x.matchType === 'PartialMatching' ? `%${val}%` : val;
      } catch (e) {
        throw new ValidationError(`Invalid json string field value for '${x.fieldName}'`, e);
      }
    })
    .value();
  if (criteria.pageNumber) {
    parameters.limit = criteria.pageSize;
    parameters.offset = (criteria.pageNumber - 1) * criteria.pageSize;
  }
  let where = '';
  let orderBy = '';
  const limitOffset = criteria.pageNumber ? 'LIMIT ${limit} OFFSET ${offset}' : '';

  const filterKeys = criteria.matchCriteria
    .map(x => `${_escapeName(x.fieldName)} ${searchOperators[x.matchType]} \${${_escapeName(x.fieldName, true)}}`);
  if (filterKeys.length > 0) {
    where = `WHERE ${filterKeys.join(' AND ')}`;
  }
  if (criteria.sortBy) {
    if (!_.find(columns, c => c.name === criteria.sortBy)) {
      throw new ValidationError(`There is no such column called '${criteria.sortBy}' for '${tableName}'`);
    }
    orderBy = `ORDER BY ${_escapeName(criteria.sortBy)} `;
    if (criteria.sortOrder) {
      orderBy += criteria.sortOrder === 'Descending' ? 'DESC' : 'ASC';
    }
  }

  return {
    sql: `SELECT * FROM ${_escapeName(tableName)} ${where} ${orderBy} ${limitOffset}`,
    totalSql: `SELECT COUNT(*) AS COUNT FROM ${_escapeName(tableName)} ${where}`,
    parameters
  };
}

/**
 * Run SQL query
 * @param {String} methodName the method name
 * @param {Array} params the sql with  params
 * @private
 */
function* _runSql(methodName, params) {
  return yield db[methodName](params.sql, params.parameters);
}

/**
 * Create an object
 * @param {String} objectType the type of object
 * @param {Array} fields the array with field name/value to insert
 */
function* create(objectType, fields) {
  const result = yield _runSql('one', _createQuery(objectType, fields));
  return result.id;
}

create.schema = {
  objectType: Joi.objectType(),
  fields: Joi.fields().min(1)
};


/**
 * Search Objects
 * @param {String} objectType the type of object
 * @param {Object} query the search criteria
 */
function* search(objectType, query) {
  const columns = yield _runSql('manyOrNone', {
    sql: `SELECT COLUMN_NAME AS NAME, DATA_TYPE AS TYPE from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${_escapeName(objectType, true)}'`
  });
  const parmas = _searchQuery(objectType, query, columns);
  const result = yield _runSql('manyOrNone', parmas);
  parmas.sql = parmas.totalSql;
  const totalResult = yield _runSql('one', parmas);
  let totalPages = 0;
  if (query.pageNumber && query.pageSize) {
    totalPages = Math.ceil(totalResult.count / query.pageSize);
  } else {
    totalPages = totalResult.count > 0 ? 1 : 0;
  }
  return {
    totalRecords: Number(totalResult.count),
    totalPages,
    items: _.map(result, (x) => ({
      objectType,
      id: x.id,
      fields: _.map(x, (v, k) => ({
        fieldName: k,
        fieldValue: JSON.stringify(v)
      }))
    }))
  };
}

search.schema = {
  objectType: Joi.objectType(),
  query: Joi.object().keys({
    pageSize: Joi.int32().min(1),
    pageNumber: Joi.int32().min(0),
    sortBy: Joi.string(),
    sortOrder: Joi.sortOrder(),
    matchCriteria: Joi.array().items(Joi.object().keys({
      fieldName: Joi.string().required(),
      value: Joi.string().required(),
      matchType: Joi.string().valid('PartialMatching', 'ExactMatching',
        'Greater', 'GreaterOrEqual', 'Equal', 'Less', 'LessOrEqual')
    })).single()
  })
};

/**
 * Get an object by object type and ID.
 * @param {String} objectType the type of object
 * @param {Number} id the id
 * @param {Array} fields the array with fields to return
 */
function* getOne(objectType, id, fields) {
  const result = yield _runSql('oneOrNone', _getOneQuery(objectType, id, fields));
  _checkExist(objectType, id, result, false);
  return _.map(result, (v, k) => ({
    fieldName: k,
    fieldValue: JSON.stringify(v)
  }));
}

getOne.schema = {
  objectType: Joi.objectType(),
  id: Joi.id(),
  fields: Joi.array().items(Joi.string()).single()
};

/**
 * Delete an object by object type and ID.
 * @param {String} objectType the type of object
 * @param {Number} id the id of object
 */
function* deleteOne(objectType, id) {
  const result = yield _runSql('result', _deleteOneQuery(objectType, id));
  _checkExist(objectType, id, result, true);
  return result;
}

deleteOne.schema = {
  objectType: Joi.objectType(),
  id: Joi.id()
};

/**
 * Update an object.
 * @param {String} objectType the type of object
 * @param {Number} id the id
 * @param {Array} fields the array with field name/value to update
 */
function* updateOne(objectType, id, fields) {
  const result = yield _runSql('result', _updateOneQuery(objectType, id, fields));
  _checkExist(objectType, id, result, true);
}

updateOne.schema = {
  objectType: Joi.objectType(),
  id: Joi.id(),
  fields: Joi.fields().min(1)
};

module.exports = {
  create,
  search,
  getOne,
  updateOne,
  deleteOne
};

logger.buildService(module.exports);

