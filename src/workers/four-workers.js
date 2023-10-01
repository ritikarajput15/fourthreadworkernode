const { workerData, parentPort } = require("worker_threads");

let executedTaskIds = [];
let taskIdsArray = workerData.taskIds;
for (let i = 0; i < taskIdsArray.length / workerData.thread_count; i++) {
  executedTaskIds.push(taskIdsArray[i]);
}
parentPort.postMessage(executedTaskIds);
