/**
 * Created by XiaYongjie on 2017/7/5.
 *
 */
/* tslint:disable:no-console */
import React from 'react';
import {connect} from 'react-redux';
import OrderTab from "../views/order/orderTab";
import {bindActionCreators} from "redux";
import * as orderListAction from '../actions/orderListAction.js';
import { withRouter } from 'react-router-dom'
import * as contants from '../../common/Apis/constants'

class OrderTabList extends React.Component {
    render() {
        return (<OrderTab{...this.props}/>);
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

};
const mapStateToProps = (state) => {
    const OrderTab = state.get('OrderTab').toJS();
    return {
        OrderTab
    };
};

const mapDispatchToProps = (dispatch) => {
    const OrderListAction = bindActionCreators(orderListAction, dispatch);
    return {
        OrderListAction
    };
};
export default withRouter( connect(mapStateToProps, mapDispatchToProps)(OrderTabList));