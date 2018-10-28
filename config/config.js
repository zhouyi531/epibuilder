/*eslint no-void: "off"*/
"use strict";

/********************************************************************
 * Configuration
 ********************************************************************/

/*eslint no-process-env: "off"*/
module.exports = {
  serverPort: process.env.PORT || 8080,
  serverEnv: process.env.NODE_ENV || "development",
  serverBaseUrl: ["production", "uat"].includes(process.env.NODE_ENV)
    ? "./"
    : `http://localhost:${process.env.PORT || 8080}/`,
  epiQueryServer:
    process.env.EPIQUERY_SERVER || "http://127.0.0.1:9090/epiquery1/glglive",
  localEpiTemplateFolder: "/Users/austinzhou/Code/github/glg/epiquery-templates"
};
