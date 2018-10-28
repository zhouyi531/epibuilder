import React from "react";
import MuiTreeView from "material-ui-treeview";

function TreeView(props) {
  return (
    <MuiTreeView
      defaultExpanded={false}
      onLeafClick={node => {
        props.handleClick(node);
        console.log(node);
      }}
      tree={props.fileTree}
    />
  );
}
export default TreeView;
