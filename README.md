
# Task Manager API

This is a simple Task Manager API built with Express.js. It allows you to perform CRUD (Create, Read, Update, Delete) operations on tasks.

## Prerequisites

 - Node.js installed on your machine
 - npm package manager



## Installation

Clone the repository

```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
Start the server
```

The server will start on http://localhost:3000.


    
## API Reference

#### Get all tasks
Retrieve a list of all tasks.
```http
  GET /tasks
```

#### Get Task by ID
Retrieve a specific task by its ID.
```http
  GET /tasks/:taskId
```

#### Create a New Task
Create a new task.
```http
  POST /tasks
```

#### Update Task

Update an existing task.
```http
  PUT /tasks/:taskId
```

#### Delete Task

Delete a task by its ID.
```http
  DELETE /tasks/:taskId
```

#### Get Tasks by Priority Level

Retrieve tasks by their priority level.
```http
  GET /tasks/priority/:level
```
