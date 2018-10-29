const config = require("../config/config");
const dirTree = require("directory-tree");
const tree = dirTree(config.localEpiTemplateFolder, {
  exclude: [/\.DS_Store/, /\.git/],
  extensions: /(mustache|sql)/
});

const stack = [];

function transformTree(stack) {
  const node = stack.pop();

  if (!node) {
    return;
  }

  node.path = node.path.split("epiquery-templates")[1];

  if (!node.children || node.children.length == 0) {
    node.children = null;
  } else {
    node.children.map(n => {
      stack.push(n);
    });
  }
  return;
}

exports.loadTree = function() {
  if (stack.length === 0) {
    stack.push(tree);
  }

  while (stack.length > 0) {
    transformTree(stack);
  }

  return tree;
};
