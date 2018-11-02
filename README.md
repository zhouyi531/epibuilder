### Epi Builder

All configurations are stored in `{projectRoot}/config/config.js`

Either modify it or apply a `.env` file before you start.

A typical `local.env` may look like this:

``` bash
export NODE_ENV=development
export PORT=8080
export EPIQUERY_SERVER="http://localhost:9090/epiquery1/datahub"
export TEMPLATE_DIRECTORY="/Users/austinzhou/Code/github/glg/epiquery-templates"
```
Then

``` bash
npm start
```


#### ver 1.0 2018-11-02

1. Browse template files in your epiquery template folder
2. Show the template content
3. Parse the template and list all parameters in text boxes
4. Show current parameters in JSON format
5. Render the SQL script by the template and current parameters
6. Make epiquery call and show the results or errors


