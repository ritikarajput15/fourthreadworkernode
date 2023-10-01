const mongoose = require("mongoose");
const { PRIORITY_TASK ,TASK} = require("../../utils/constants");
const _ = require("lodash");
const Schema = mongoose.Schema;
const PriorityTaskSchema = Schema({
  _id: mongoose.Schema.Types.ObjectId,
  taskIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: TASK,
  }]
});
 PriorityTaskSchema.methods.toJSON = function () {
  var priorityTask = this;
  var priorityTaskObj = priorityTask.toObject();
  return _.pick(priorityTaskObj, [
    "_id",
    "taskIds"
  ]);
};

const PriorityTask = mongoose.model(PRIORITY_TASK, PriorityTaskSchema);
module.exports = { PriorityTask };
