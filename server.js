const express = require("express");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const config = require("./config/config.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const moment = require("moment");
const Promise = require("bluebird");
const epiTemplatesLoader = require("./lib/epiTemplatesLoader");
const { parseMustache } = require("./lib/mustacheParser");
const { parseSQL } = require("./lib/sqlParser");

const app = express();

app.use(
  "/static/js",
  express.static(path.join(__dirname, "client/build/static/js"))
);
app.use(
  "/static/css",
  express.static(path.join(__dirname, "client/build/static/css"))
);
app.use(
  "/static/media",
  express.static(path.join(__dirname, "client/build/static/media"))
);

if (config.serverEnv !== "production") {
  app.use((req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type,Access-Token",
      "Access-Control-Expose-Headers": "*"
    });
    next();
  });
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

require("./routes")(app);

const tree = epiTemplatesLoader.loadTree();

//app.set("fileTree", result);
app.set("fileTree", tree);

app.get("/diagnostic", (req, res) => {
  res.status(200).json({ status: "ok" });
  return;
});

app.get("/fileTreeData", (req, res) => {
  res.status(200).json(app.get("fileTree"));
  return;
});

app.get("/fileContent", async (req, res) => {
  //const fileName = req.body["fileName"];
  const fileName = req.query["fileName"];
  if (!fileName) {
    res.status(404).json({ errMsg: "no file name specified" });
  }
  const absolutePath = `${config.localEpiTemplateFolder}${fileName}`;
  const content = await new Promise((resolve, reject) => {
    return fs.readFile(absolutePath, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });

  res.status(200).json({
    content: content,
    params: fileName.toLowerCase().includes(".mustache")
      ? parseMustache(content)
      : parseSQL(content),
    path: absolutePath.split("epiquery-templates")[1]
  });
});

app.post("/epicall", async (req, res, next) => {
  const fileName = req.body["fileName"];
  const params = req.body["params"];

  console.log(`${config.epiQueryServer}${fileName}`);
  console.log(params);

  try {
    const result = (await axios.post(
      `${config.epiQueryServer}${fileName}`,
      params
    )).data;
    if (!result) {
      next(new Error("epi call failed"));
    }
    res.status(200).send(result);
  } catch (err) {
    if (err) {
      next(err);
    }
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err);
    if (!res.headersSent) {
      res.status(500).send(err.message);
    }
  }

  next();
});

app.listen(config.serverPort, () => {
  console.log(`Listening on port ${config.serverPort}`);
});
