const express = require("express");
const Promise = require("bluebird");

const router = express.Router();

const handlerWrapper = handler => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
      if (!res.headersSent) {
        res.status(200).send(`default output in ${req.route.path}`);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

router.get("/test-error-handler", handlerWrapper((req,res)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            reject(new Error("test delayed global error handler"));
        }, 3000);
    });
}));

module.exports = router;
