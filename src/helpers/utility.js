const Joi = require("joi");

const addTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  flag: Joi.boolean().required(),
});

const sortFunction = (sortBy, tasksData) => {
  if (sortBy === "createdBy") {
    return tasksData.sort((task1, task2) => {
      // Assuming each task object has a "createdBy" property
      return task1.createdDate.localeCompare(task2.createdDate);
    });
  } else {
    return tasksData;
  }
};

module.exports = { addTaskSchema, sortFunction };
