const Joi = require("joi");

const addTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  flag: Joi.boolean().required(),
});

module.exports = addTaskSchema;
