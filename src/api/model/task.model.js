const mongoose = require("mongoose");
const { TASK } = require("../../utils/constants");
const _ = require("lodash");
const Schema = mongoose.Schema;
const TaskSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  taskInformation: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Number,
    required: true,
  },
  taskStatus: {
    type: String,
  },
  taskResult: {
    type: String,
  },
});

TaskSchema.methods.toJSON = function () {
  var task = this;
  var taskObj = task.toObject();
  return _.pick(taskObj, [
    "_id",
    "taskInformation",
    "priority",
    "expiryDate",
    "taskStatus",
    "taskResult",
  ]);
};

const Task = mongoose.model(TASK, TaskSchema);
module.exports = { Task };
