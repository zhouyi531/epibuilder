import React, { Component, PropTypes } from "react";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Drawer from "@material-ui/core/Drawer";
import { MuiTreeList } from "react-treeview-mui";

const listItems = [
  {
    // Each list item is tracked by its index in the master array
    depth: 0, // Used to style the list item. Items with 0 depth will not be rendered and act as the root parent
    title: "hello world",
    children: [1] // Indexes for child list items. If undefined, list item will be treated as leaf
  },
  {
    depth: 1,
    title: "sub title",
    parentIndex: 0, // Index of parent list item
    disabled: false // false by default, disables click event listeners for disabled list items
  }
];

function getAllParents(listItem, listItems, parents = []) {
    if (listItem.parentIndex) {
        return getAllParents(listItems[listItem.parentIndex], listItems, parents.concat([listItem.parentIndex]))
    } else {
        return parents
    }
}

class App2 extends Component {
  constructor(props) {
    super(props);

    this.setState({
      expandedListItems: listItems,
      activeListItem: listItems[0],
      listItemIsEnabled: true,
      listItems: listItems,
      searchTerm: ""
    });
    this.collapseAll = this.collapseAll.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleTouchTapInSearchMode = this.handleTouchTapInSearchMode.bind(
      this
    );
  }

  collapseAll() {
    this.setState({ expandedListItems: [] });
  }

  handleSearch(searchTerm) {
    this.setState({ searchTerm });
  }

  handleTouchTap(listItem, index) {
    if (listItem.children) {
      const indexOfListItemInArray = this.state.expandedListItems.indexOf(
        index
      );
      if (indexOfListItemInArray === -1) {
        this.setState({
          expandedListItems: this.state.expandedListItems.concat([index])
        });
      } else {
        let newArray = [].concat(this.state.expandedListItems);
        newArray.splice(indexOfListItemInArray, 1);
        this.setState({
          expandedListItems: newArray
        });
      }
    } else {
      this.setState({
        activeListItem: index
      });
    }
  }

  handleTouchTapInSearchMode(listItem, index) {
    if (!listItem.children) {
      const expandedListItems = getAllParents(listItem, listItems);

      this.setState({
        activeListItem: index,
        expandedListItems,
        searchTerm: ""
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeListItem, listItems } = this.state;
    if (activeListItem !== prevState.activeListItem) {
      const expandedListItems = getAllParents(
        listItems[activeListItem],
        listItems
      );
      this.setState({
        expandedListItems: expandedListItems
      });
    }
  }

  render() {
    const {
      listItems,
      listItemIsEnabled,
      expandedListItems,
      activeListItem,
      searchTerm
    } = this.state;
    console.log(this.state);

    const icons = {
      leftIconCollapsed: (
        <i
          style={{ height: 16, width: 16, color: "#CCCCCC" }}
          className="fa fa-caret-right"
        />
      ),
      leftIconExpanded: (
        <i
          style={{ height: 16, width: 16, color: "#CCCCCC" }}
          className="fa fa-caret-down"
        />
      )
    };

    let treeListJSX;
    treeListJSX = (
      <MuiTreeList
        listItems={listItems}
        contentKey={"title"}
        useFolderIcons={true}
        haveSearchbar={true}
        listItemIsEnabled={listItemIsEnabled}
        expandedListItems={expandedListItems}
        activeListItem={activeListItem}
        handleTouchTap={this.handleTouchTap}
        handleTouchTapInSearchMode={this.handleTouchTapInSearchMode}
        handleSearch={this.handleSearch}
        searchTerm={searchTerm}
      />
    );

    return (
      <MuiThemeProvider>
        <div>
          <Drawer open={true} width={400}>
            {treeListJSX}
          </Drawer>
          <div style={{ paddingLeft: 400 }}>
            <div style={{ width: 600, height: 400, margin: "20px auto" }}>
              <div style={{ marginTop: 20 }} />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App2;
