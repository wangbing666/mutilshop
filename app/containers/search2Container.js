/**
 * Created by Song on 2018/7/5
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Search2 from "../views/search2/search";
import * as actionCreators from "../actions/search2Action.js";
import * as constant from "../../common/Apis/constants";

class SearchContainer extends Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <Search2 {...this.props} />;
  }
}

const mapStateToProps = state => {
  const Search2 = state.get("Search2").toJS();
  return {
    Search2
  };
};

const mapDispatchToProps = dispatch => {
  const Search2Actions = bindActionCreators(actionCreators, dispatch);
  return {
    Search2Actions
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchContainer)
);
