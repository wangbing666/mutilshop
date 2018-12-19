/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Payment from '../views/payment/payment';
import * as action1Creators from '../actions/paymentAction.js';
import * as constant from '../../common/Apis/constants'

class AppContainer extends React.Component {
    render() {
        return (
            <Payment {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  Payment  = state.get('Payment').toJS();
    return {
        Payment
    };
};

const mapDispatchToProps = (dispatch) => {
    const PaymentActions = bindActionCreators(action1Creators, dispatch);
    return {
        PaymentActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));