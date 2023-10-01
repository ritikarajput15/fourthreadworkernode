const { DB_HOST, DB_PORT, DB_THREE } = process.env;
const mongoose = require("mongoose");
const initDB = () => {
  mongoose.Promise = global.Promise;
  let dbPath = `mongodb://${DB_HOST}:${DB_PORT}/${DB_THREE}`
  mongoose.set("strictQuery", false);
  mongoose
    .connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      // useCreateIndex: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log("MongoDB Connection Error:" + err);
    });
};

module.exports = { initDB };
