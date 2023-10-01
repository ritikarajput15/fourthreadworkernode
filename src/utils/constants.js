const CRON_JOB_TIME = `* * * * * *`; // every 6 hours
const TASK = "Task";
const PRIORITY_TASK = "PriorityTask";
const TASK_STATUS = {
    INCOMPLETE: "incomplete",
    COMPLETED: "completed",
  };
module.exports={
    CRON_JOB_TIME,
    TASK,
    PRIORITY_TASK,
    TASK_STATUS
}