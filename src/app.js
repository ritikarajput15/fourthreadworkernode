const express = require("express");
const { Worker } = require("worker_threads");
const { apiAuthentication } = require("./middleware/authenticate");
const { initDB } = require("./config/db.config");
const cron = require("node-cron");
const axios = require("axios");
const { CRON_JOB_TIME, TASK, TASK_STATUS } = require("./utils/constants");
const { PriorityTask } = require("./api/model/priority.task.model");
const { Task } = require("./api/model/task.model");
const { isEmpty } = require("lodash");

// initialize db
initDB();

const app = express();

// json parser middleware
app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: "50mb" })
);
app.use(
  express.json({
    parameterLimit: 100000,
    limit: "50mb",
    type: "application/json",
  })
);

const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;

app.get("/", (req, res) => {
  res.status(200).send("base_url got hit");
});

function createWorker(taskIds) {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./src/workers/four-workers.js", {
      workerData: {
        thread_count: THREAD_COUNT,
        taskIds
      },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

app.post("/executepriorityTask", apiAuthentication, async function (req, res) {
  let taskIdsArray = req.body.taskIds;
  let priorityTaskId = req.body.priorityTaskId;
  if (taskIdsArray.length < THREAD_COUNT) {
    for (let i = 0; i < taskIdsArray.length; i++) {
      let taskDoc = await Task.findOne({ _id: taskIdsArray[i] })
        .select({ taskInformation: 1, taskStatus: 1 })
        .lean({});
      // execute task as per task information and update the status of task as completed 
      await Task.findOneAndUpdate(
        { _id: taskIdsArray[i] },
        { taskStatus: TASK_STATUS.COMPLETED }
      );
     // remove task id from priority queue
      await PriorityTask.findOneAndUpdate(
        { _id: priorityTaskId },
        {
          $pull: { taskIds: { $in: [taskIdsArray[i]] } },
        }
      );
    }
  } else {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
      workerPromises.push(createWorker(taskIdsArray));

    }
    const thread_results = await Promise.all(workerPromises);
    for (let i = 0; i < thread_results; i++) {
      for (let j = 0; j < thread_results[i].length; j++) {
        let taskDoc = await Task.findOne({ _id: thread_results[i][j] })
          .select({ taskInformation: 1, taskStatus: 1 })
          .lean({});
        // execute task as per task information and update the status of task as completed
        await Task.findOneAndUpdate(
          { _id: thread_results[i][j] },
          { taskStatus: TASK_STATUS.COMPLETED }
        );
        // remove task id from priority queue
        await PriorityTask.findOneAndUpdate(
          { _id: priorityTaskId },
          {
            $pull: { taskIds: { $in: [thread_results[i][j]] } },
          }
        );
      }

    }
  }
  return res.status(200).send("api hit by central server");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
