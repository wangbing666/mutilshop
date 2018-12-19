/**
 * Created by Song on 2018/07/11
 * 投诉 提交反馈
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import FeedBack from "../views/complaint/feedBack";
import * as feedBackActionCreator from "../actions/feedBackAction";
import * as constant from "../../common/Apis/constants";

class feedBackContainer extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <FeedBack {...this.props} />;
  }
}

const mapStateToProps = (state) => {

  const feedBackReducer = state.get("feedBackReducer").toJS();
  
  return { feedBackReducer };
};

const mapDispatchToProps = dispatch => {
  const feedBackAction = bindActionCreators(feedBackActionCreator, dispatch);
  return { feedBackAction };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(feedBackContainer)
)
