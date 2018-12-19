/**
 * Created by Song on 2018/7/25
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Collection from "../views/Collection";
import * as actionCreators from "../actions/collectionAction.js";
import * as constant from "../../common/Apis/constants";

class CollectionContainer extends Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <Collection {...this.props} />;
  }
}

const mapStateToProps = state => {
  const Collection = state.get("Collection").toJS();
  return {
    Collection
  };
};

const mapDispatchToProps = dispatch => {
  const CollectionActions = bindActionCreators(actionCreators, dispatch);
  return {
    CollectionActions
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CollectionContainer)
);