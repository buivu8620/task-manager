const taskRouter = require("./task");
const userRouter = require("./user");

function router(app) {
  app.use("/task", taskRouter);
  app.use("/user", userRouter);
}

module.exports = router;
