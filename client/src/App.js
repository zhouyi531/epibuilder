import React, { Component } from "react";
import PropTypes from "prop-types";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import config from "./config";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";

const theme = createMuiTheme();

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing.unit
  }
});

const prefixArray = [];

function renderHTML(rawHTML) {
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: rawHTML }
  });
}

class ParentItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="parent">
        <li>
          <span>{this.props.name}</span>
          {this.props.children &&
            this.props.children.map(child => {
              return (
                <ChildItem
                  path={child.path}
                  name={child.name}
                  children={child.children}
                  type={child.type}
                  onClick={this.props.onClick}
                />
              );
            })}
        </li>
      </ul>
    );
  }
}

class ChildItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="submenu">
        <li>
          {this.props.type === "file" && (
            <span>
              <a
                href="#"
                onClick={async () => {
                  await this.props.onClick(this.props.path);
                }}
              >
                {this.props.name}
              </a>
            </span>
          )}
          {this.props.type === "directory" && <span>{this.props.name}</span>}

          {this.props.children &&
            this.props.children.map(child => {
              return (
                <ChildItem
                  path={child.path}
                  name={child.name}
                  children={child.children}
                  type={child.type}
                  onClick={this.props.onClick}
                />
              );
            })}
        </li>
      </ul>
    );
  }
}

class JsonPanel extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.runCodePrettify();
  }

  runCodePrettify() {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;

    script.src =
      "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js";
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(script);
  }
  render() {
    return (
      <pre
        className="prettyprint lang-js"
        style={{ border: "none!important;" }}
      >
        {JSON.stringify(this.props.JSONContent, null, "\t")}
      </pre>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      diagnostic: {},
      fileTree: {},
      currentParamObj: null
    };
    this.timer = null;
  }

  componentDidMount = async () => {
    try {
      const fileTreeData = (await axios.get(
        `${config.serverBaseUrl}fileTreeData`
      )).data;
      await this.setState({ fileTree: fileTreeData });

      console.log(`fetch data at ${new Date()}`);
    } catch (err) {
      console.log("error in 'componentDidMount':", err);
    }
  };

  handleClick = async fileName => {
    const { content, path, params } = (await axios.get(
      `${config.serverBaseUrl}fileContent?fileName=${fileName}`
    )).data;

    await this.setState({ currentParamObj: null });
    await this.setState({
      currentFilePath: path,
      currentContent: content.replace(/(?:\r\n|\r|\n)/g, "<br/>") || "",
      currentParamObj: params || {},
      currentResult: null
    });
    console.log(this.state.currentFilePath);
  };

  doQuery = async () => {
    await this.setState({ currentParamObj: this.state.currentParamObj });
    const invocationUrl = `${config.serverBaseUrl}epicall`;
    let callResult = (await axios.post(invocationUrl, {
      fileName: this.state.currentFilePath,
      params: this.state.currentParamObj
    })).data;
    try {
      await this.setState({ currentResult: callResult });
    } catch (err) {
      console.log(err);
    }
  };

  getTreeView = () => {
    return (
      <ParentItem
        name={this.state.fileTree.name}
        path={this.state.fileTree.path}
        children={this.state.fileTree.children}
        onClick={this.handleClick}
      />
    );
  };

  parseCurrentParamsToInputs = () => {
    const jsxArray = [];
    const stack = [];
    const { classes } = this.props;

    if (stack.length === 0 && this.state.currentParamObj) {
      stack.push(this.state.currentParamObj);
    }

    loopMark: while (stack.length > 0) {
      const currentObj = stack.pop();
      for (let key of Object.keys(currentObj)) {
        switch (typeof currentObj[key]) {
          case "object":
            if (Array.isArray(currentObj[key])) {
              jsxArray.push(
                <li>
                  <span>{key}</span>
                  <ul>
                    {currentObj[key].map((item, index) => {
                      if (typeof item === "object") {
                        return null; // TODO: object array is not handled at this time.
                      }
                      return (
                        <li>
                          <TextField
                            id="outlined-{key}-input"
                            label={key}
                            className={classes.textField}
                            name={key}
                            margin="normal"
                            variant="outlined"
                            onChange={event => {
                              const source = event.target;
                              if (this.timer) {
                                clearTimeout(this.timer);
                              }

                              this.timer = setTimeout(async () => {
                                currentObj[key][index] = source.value;
                                await this.setState({
                                  currentParamObj: this.state.currentParamObj
                                });
                              }, 500);
                            }}
                            onMouseLeave={event => {
                              if (this.timer) {
                                clearTimeout(this.timer);
                              }
                              const source = event.target;
                              currentObj[key][index] = source.value;
                            }}
                          />
                          <a href="#" onClick={async ()=>{
                            if (this.timer) {
                              clearTimeout(this.timer);
                            }
                            currentObj[key].splice(index, 1);
                            await this.setState({
                              currentParamObj: this.state.currentParamObj
                            });
                          }}>[x]</a>
                        </li>
                      );
                    })}
                    <Button
                      variant="outlined"
                      color="primary"
                      className={classes.button}
                      onClick={async () => {
                        currentObj[key].push("");
                        await this.setState({
                          currentParamObj: this.state.currentParamObj
                        });
                        console.log(this.state.currentParamObj);
                      }}
                    >
                      Add Item
                    </Button>
                  </ul>
                </li>
              );
            } else {
              jsxArray.push(<span>{key}</span>);
              stack.push(currentObj[key]);
              continue loopMark;
            }
            break;
          default:
            jsxArray.push(
              <li>
                <TextField
                  id="outlined-{key}-input"
                  label={key}
                  className={classes.textField}
                  name={key}
                  margin="normal"
                  variant="outlined"
                  onChange={event => {
                    const source = event.target;
                    if (this.timer) {
                      clearTimeout(this.timer);
                    }

                    this.timer = setTimeout(async () => {
                      currentObj[key] = source.value;
                      await this.setState({
                        currentParamObj: this.state.currentParamObj
                      });
                    }, 500);
                  }}
                  onMouseLeave={event => {
                    if (this.timer) {
                      clearTimeout(this.timer);
                    }
                    const source = event.target;
                    currentObj[key] = source.value;
                  }}
                />
              </li>
            );
        }
      }
    }
    console.log(this.state.currentParamObj);

    console.log(jsxArray);
    return jsxArray;
  };

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <div style={{ height: "900px", overflowY: "scroll" }}>
              <ParentItem
                name={this.state.fileTree.name}
                path={this.state.fileTree.path}
                children={this.state.fileTree.children}
                onClick={this.handleClick}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid item xs={12}>
              <Paper
                className={classes.paper}
                style={{ height: "10px", overflowY: "scroll" }}
              >
                <span>
                  {this.state.currentFilePath && (
                    <a
                      href={`https://github.com/glg-core/epiquery-templates/tree/master${
                        this.state.currentFilePath
                      }`}
                      target="_blank"
                    >
                      View [{this.state.currentFilePath}] on github
                    </a>
                  )}
                </span>
              </Paper>
              <Paper
                className={classes.paper}
                style={{ height: "500px", overflowY: "scroll" }}
              >
                <span>{renderHTML(this.state.currentContent)}</span>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {this.parseCurrentParamsToInputs()}

                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={async () => {
                    await this.doQuery();
                  }}
                >
                  Submit
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              style={{ height: "200px", overflowY: "scroll" }}
            >
              <h2>Parameters</h2>
              {this.state.currentParamObj && (
                <JsonPanel JSONContent={this.state.currentParamObj} />
              )}
            </Paper>
            <Paper
              className={classes.paper}
              style={{ height: "800px", overflowY: "scroll" }}
            >
              <h2>Result</h2>
              {this.state.currentResult && (
                <JsonPanel JSONContent={this.state.currentResult} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
