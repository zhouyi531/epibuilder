const fs = require("fs");
const _ = require("lodash");

async function main() {
  try {
    const path = "../etc/testtemplate.mustache";
    const content = await new Promise((resolve, reject) => {
      return fs.readFile(path, "utf8", (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
    let result = parseFile(content);
    console.log(JSON.stringify(result));
  } catch (err) {
    console.log(err);
  }
}

function parseFile(text) {
  const keyNameArray = [];
  const nodeTree = {};
  text.replace(/\{\{([\^#/!&]?)([^{\n]+?)\}\}/g, (all, flag, keyname) => {
    switch (flag) {
      case "^": //if not
        parseKeyName(nodeTree, keyNameArray, keyname);
        break;
      case "#": // if exist
        console.log("find key", keyname);
        parseKeyName(nodeTree, keyNameArray, keyname);
        break;
      case "/": // close
        // TODO: ?
        break;
      default:
        //display
        parseKeyName(nodeTree, keyNameArray, keyname);
        break;
    }
  });

  console.log(keyNameArray);

  return nodeTree;
}

function findNodeByName(nodeTree, fullKeyName) {
  const nodeNameArray = fullKeyName.split(".");
  let nodeTraverser = nodeTree;
  let nodeParent = null;
  let lastNodeKeyName = "";
  const result = {};

  if (nodeNameArray.length === 1) {
    lastNodeKeyName = nodeNameArray[0];

    result.keyName = nodeNameArray[0];
    result.parentNode = nodeTree;
    return result;
  }

  for (let i = 0; i < nodeNameArray.length - 1; i++) {
    if (nodeTraverser[nodeNameArray[i]]) {
      nodeParent = nodeTraverser;
      nodeTraverser = nodeTraverser[nodeNameArray[i]];
    } else {
      throw new Error(`Node ${nodeNameArray[i]} can't be found on the path`);
    }
  }
  if (nodeNameArray[nodeNameArray.length - 1] === "length") {
    lastNodeKeyName = nodeNameArray[nodeNameArray.length - 2];
  } else {
    nodeParent = nodeTraverser;
    lastNodeKeyName = nodeNameArray[nodeNameArray.length - 1];
  }
  result.keyName = lastNodeKeyName;
  result.parentNode = nodeParent;
  return result;
}

function parseKeyName(nodeTree, keyNameArray, fullKeyName) {
  const nodeNameArray = fullKeyName.split(".");
  let keyName = null;
  let parentNode = null;

  if (nodeTree && keyNameArray && keyNameArray.length > 0) {
    ({ keyName, parentNode } = findNodeByName(
      nodeTree,
      keyNameArray[keyNameArray.length - 1]
    ));
  }

  if (fullKeyName === ".") {
    if (!keyName || !parentNode) {
      throw new Error("structure error. no parent node found");
    }
    parentNode[keyName] = [];
    return;
  }

  if (nodeNameArray.length === 1) {
    if (!nodeTree[nodeNameArray[0]]) {
      nodeTree[nodeNameArray[0]] = "";
    }
    keyNameArray.push(fullKeyName);
    return;
  } else {
    let nodeTraverser = nodeTree;
    let nodeParent = null;
    for (let i = 0; i < nodeNameArray.length - 1; i++) {
      if (nodeTraverser[nodeNameArray[i]]) {
        nodeParent = nodeTraverser;
        nodeTraverser = nodeTraverser[nodeNameArray[i]];
      } else {
        nodeTraverser[nodeNameArray[i]] = {};
        nodeParent = nodeTraverser;
        nodeTraverser = nodeTraverser[nodeNameArray[i]];
      }
    }
    if (nodeNameArray[nodeNameArray.length - 1] == "length") {
      nodeParent[nodeNameArray[nodeNameArray.length - 2]] = [];
      keyNameArray.push(fullKeyName);
    } else {
      nodeParent = nodeTraverser;
      nodeParent[nodeNameArray[nodeNameArray.length - 1]] = "";
      keyNameArray.push(fullKeyName);
    }
  }
}

main();
