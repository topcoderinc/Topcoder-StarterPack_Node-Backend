'use strict';
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * Init app and register custom Joi type
 */

const Joi = require('joi');

Joi.int64 = () => Joi.number().integer()
  .min(-Math.pow(2, 63))
  .max(Math.pow(2, 63) - 1);
Joi.int32 = () => Joi.number().integer()
  .min(-Math.pow(2, 31))
  .max(Math.pow(2, 31) - 1);
Joi.objectType = () => Joi.string().required();
Joi.id = () => Joi.int64().min(1).required();

Joi.sortOrder = () => Joi.string().valid('Ascending', 'Descending');

Joi.fields = () => Joi.array().items(Joi.object().keys({
  fieldName: Joi.string().required(),
  fieldValue: Joi.string().required()
}));

