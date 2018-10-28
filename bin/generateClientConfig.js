const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

const dest = path.resolve("./client/src/config.js");
const template = path.resolve("./client/config/config.mustache");
const config = require("../config/config.js");

fs.readFile(template, "utf8", (err, data) => {
  if (err) {
    console.log("failed to read template:", err);
    return;
  }

  fs.writeFile(dest, Mustache.render(data, config), err => {
    if (err) {
      console.log(err);
      return;
    }
  });
});

console.log("client config generated");
