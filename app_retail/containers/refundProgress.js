/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */
import React, { Component } from 'react';
import '../views/refunds/refundsDetailList.less';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import RefundProgress from "../views/aftersales/refundProgress";
import { withRouter } from 'react-router-dom'
import * as afterSalesActions from '../actions/afterSalesAction';
import * as constant from '../../common/Apis/constants'


/**
 * 退货退款详情
 */

class refundProgressContainer extends Component {
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }
    render() {
        return (
            <RefundProgress {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  afterSale  = state.get('afterSale').toJS();
    return {
        afterSale
    };
};

const mapDispatchToProps = (dispatch) => {
    const afterSalesAction = bindActionCreators(afterSalesActions, dispatch);
    return {
        afterSalesAction
    };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(refundProgressContainer));

