/**
 * Created by Song on 2018/7/19
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import SearchResult from "../views/searchResult/index";
import * as actionCreators from "../actions/searchResultAction.js";
import * as constant from "../../common/Apis/constants";

class SearchResultContainer extends Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <SearchResult {...this.props} />;
  }
}

const mapStateToProps = state => {
  const SearchResult = state.get("SearchResult").toJS();
  return {
    SearchResult
  };
};

const mapDispatchToProps = dispatch => {
  const SearchResultActions = bindActionCreators(actionCreators, dispatch);
  return {
    SearchResultActions
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchResultContainer)
);
