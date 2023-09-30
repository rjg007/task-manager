const express = require("express");
const tasksData = require("../tasks.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const { addTaskSchema } = require("./helpers/utility");
const Joi = require("joi");
const path = require("path");
const { sortFunction } = require("./helpers/utility");
const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const addTaskSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),
  description: Joi.string().min(5).required().messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
  }),
  flag: Joi.boolean().required().messages({
    "any.required": "Flag is required",
  }),
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.get("/tasks", (req, res) => {
  const sortBy = req.query.sortBy;
  let sortedItems = [...tasksData.allTasks];
  const filterBy = req.query.filterBy;
  let filteredItems = sortedItems;

  if (filterBy) {
    let flagToCheck = filterBy === "true";
    filteredItems = filteredItems.filter((task) => task.flag === flagToCheck);
  }

  const finalResult = sortFunction(sortBy, filteredItems);
  res.status(200).json({ allTasks: finalResult });
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
    const errorMessage = error.details.map((d) => d.message).join(", ");
    return res.status(400).send(errorMessage);
  } else {
    fs.readFile(writePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading tasks file");
      } else {
        // let tasksModifiedData = JSON.parse(JSON.stringify(tasksData));
        let tasksModifiedData = JSON.parse(data);
        let itemToAdd = {
          id: uuidv4(),
          createdDate: new Date(),
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
  }
});

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTaskDetails = req.body;
  let writePath = path.join(__dirname, "..", "tasks.json");
  const { error, value } = addTaskSchema?.validate(updatedTaskDetails);

  if (error) {
    console.log(error);
    const errorMessage = error.details.map((d) => d.message).join(", ");
    return res.status(400).send(errorMessage);
  } else {
    let tasksModifiedData = JSON.parse(JSON.stringify(tasksData));

    // Find the index of the task with the given ID
    const taskIndex = tasksModifiedData.allTasks.findIndex(
      (task) => task.id === taskId
    );

    if (taskIndex === -1) {
      return res.status(404).send("Task not found");
    } else {
      tasksModifiedData.allTasks[taskIndex] = {
        id: taskId,
        ...value,
      };

      fs.writeFile(
        writePath,
        JSON.stringify(tasksModifiedData),
        { encoding: "utf8", flag: "w" },
        (err, data) => {
          if (err) {
            return res
              .status(500)
              .send("Something went wrong while updating the task");
          } else {
            return res.status(200).send("Task updated successfully");
          }
        }
      );
    }
  }
});

app.delete("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  let writePath = path.join(__dirname, "..", "tasks.json");
  let tasks = [...tasksData.allTasks];

  // Find the task to be deleted.
  const taskIndex = tasks.findIndex((task) => task.id == taskId);
  console.log(taskIndex);

  if (taskIndex === -1) {
    return res.status(404).send("Task not found");
  } else {
    let tasksModifiedData = JSON.parse(JSON.stringify(tasks));

    // Remove the task from the array
    tasksModifiedData.splice(taskIndex, 1);
    tasksModifiedData;

    // Write the modified data back to the file
    fs.writeFile(
      writePath,
      JSON.stringify(tasksModifiedData),
      { encoding: "utf8", flag: "w" },
      (err, data) => {
        if (err) {
          return res
            .status(500)
            .send("Something went wrong while deleting the task");
        } else {
          return res.status(200).send("Task deleted successfully");
        }
      }
    );
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Something went wrong while starting the server");
  } else {
    console.log("Server is running on port 3000");
  }
});
