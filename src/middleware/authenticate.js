const apiAuthentication = (req, res, next) => {
    const { USER_ONE, USER_TWO } = process.env;
    const user_one = req.header("user_one");
    const user_two = req.header("user_two");
    if (USER_ONE === user_one && USER_TWO === user_two) {
      next();
    } else {
      res.status(401).json({
        error: "Not authroised",
      });
      return;
    }
  };
  module.exports={apiAuthentication}