/**
 * Created by Song on 2018/07/12
 * 投诉 上传证据
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import UploadProof from "../views/complaint/uploadProof";
import * as uploadProofActionCreator from "../actions/uploadProofAction";
import * as constant from "../../common/Apis/constants";

class uploadProofContainer extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <UploadProof {...this.props} />;
  }
}

const mapStateToProps = (state) => {
  const uploadProofReducer = state.get("uploadProofReducer").toJS();
  return { uploadProofReducer };
};

const mapDispatchToProps = dispatch => {
  const uploadProofAction = bindActionCreators(uploadProofActionCreator, dispatch);
  return { uploadProofAction };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(uploadProofContainer)
)
