/**
 * Created by Song on 2018/06/26
 * 店铺介绍
 */

import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router-dom'
import ShopBrief from '../views/shopBrief/shopBrief';
import * as shopBriefActionCreator from '../actions/shopBriefAction';
import * as constant from "../../common/Apis/constants";

class shopBriefContainer extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    constant.currentHistory = history;
  }
  render() {
    return <ShopBrief {...this.props} />;
  }
}

const mapStateToProps = (state) =>{
    const shopBriefReducer = state.get('shopBriefReducer').toJS();
    return {
        shopBriefReducer
    };
};

const mapDispatchToProps = (dispatch) =>{
    const shopBriefAction = bindActionCreators(shopBriefActionCreator, dispatch);
    return{
        shopBriefAction
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(shopBriefContainer))
