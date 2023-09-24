const express = require("express");
const tasksData = require("../tasks.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const { addTaskSchema } = require("./helpers/utility");
const Joi = require("joi");
const path = require("path");
const PORT = 1972;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const addTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  flag: Joi.boolean().required(),
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.get("/tasks", (req, res) => {
  res.status(200).json(tasksData);
});

app.get("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  let task = tasksData.allTasks.filter((item) => item.id == taskId);
  if (task.length == 0) {
    return res.status(404).send("No appropriate task found for this task id");
  } else {
    return res.status(200).json(task);
  }
});

app.post("/tasks", (req, res) => {
  const newTaskDetails = req.body;
  let writePath = path.join(__dirname, "..", "tasks.json");
  const { error, value } = addTaskSchema?.validate(newTaskDetails);
  if (error) {
    console.log(error);
    return res
      .status(400)
      .send("Task field info is invalid, please provide the correct info");
  } else {
    let tasksModifiedData = JSON.parse(JSON.stringify(tasksData));
    console.log("heelo", tasksModifiedData);
    let itemToAdd = {
      id: uuidv4(),
      ...value,
    };
    tasksModifiedData.allTasks.push(itemToAdd);
    console.log("mod", tasksModifiedData.allTasks);
    fs.writeFile(
      writePath,
      JSON.stringify(tasksModifiedData),
      { encoding: "utf8", flag: "w" },
      (err, data) => {
        if (err) {
          return res
            .status(500)
            .send("Something went wront while creating the task");
        } else {
          return res.status(200).send("Task created successfully");
        }
      }
    );
  }
});

app.put("/tasks/:taskId", (req, res) => {
  const { taskId } = req.params;
  const newTaskDetails = req.body;
  let writePath = path.join(__dirname, "..", "tasks.json");
  const { error, value } = addTaskSchema?.validate(newTaskDetails);
  if (error) {
    console.log(error);
    return res
      .status(400)
      .send("Task field info is invalid, please provide the correct info");
  } else {
    let tasksModifiedData = JSON.parse(JSON.stringify(tasksData));
    console.log("heelo", tasksModifiedData);
    let itemToAdd = {
      id: uuidv4(),
      ...value,
    };
    tasksModifiedData.allTasks.push(itemToAdd);
    console.log("mod", tasksModifiedData.allTasks);
    fs.writeFile(
      writePath,
      JSON.stringify(tasksModifiedData),
      { encoding: "utf8", flag: "w" },
      (err, data) => {
        if (err) {
          return res
            .status(500)
            .send("Something went wront while creating the task");
        } else {
          return res.status(200).send("Task created successfully");
        }
      }
    );
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Something went wrong while starting the server");
  } else {
    console.log("Server is running on port 1972");
  }
});
