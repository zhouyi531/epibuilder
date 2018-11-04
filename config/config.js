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
    : `http://localhost:${process.env.PORT || 8085}/`,
  localEpiTemplateFolder:
    process.env.TEMPLATE_DIRECTORY ||
    "/Users/austinzhou/Code/github/glg/epiquery-templates",
  epiqueryServerConns: JSON.parse(
    process.env.EPIQUERY_SERVER_CONN_STR_JSON ||
      '{"devdb":"http://localhost:9090/epiquery1/glglive","datahub":"http://localhost:9090/epiquery1/datahub"}'
  )
};
