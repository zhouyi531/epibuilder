module.exports = function(app) {
  const router = require("./routes");
  app.use("/", router);
};
