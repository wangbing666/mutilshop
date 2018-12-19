/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */
import React from 'react';
import '../views/refunds/refundsDetailList.less';
import {Component} from "react";
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import RefundsDetailList from "../views/refunds/refundsDetailList";
import { withRouter } from 'react-router-dom'

import * as afterSalesAction1 from '../actions/afterSalesAction';
import * as contants from '../../common/Apis/constants'


/**
 * 退货退款详情
 */

class refundsDetailList extends Component {
    render() {
        return (<RefundsDetailList {...this.prop}/>);
    }
}

class refundsDetailListContainer extends React.Component {
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }
    render() {
        return (
            <RefundsDetailList {...this.props} />
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
    const afterSalesAction = bindActionCreators(afterSalesAction1, dispatch);
    return {
        afterSalesAction
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(refundsDetailListContainer));

