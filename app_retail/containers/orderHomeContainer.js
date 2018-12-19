/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import OrderHome from '../views/orderHome/orderHome';
import * as action1Creators from '../actions/orderHomeAction.js';
import * as contants from '../../common/Apis/constants'
class AppContainer extends React.Component {
    render() {
        return (
            <OrderHome {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  OrderHome  = state.get('OrderHome').toJS();
    return {
        OrderHome
    };
};

const mapDispatchToProps = (dispatch) => {
    const OrderHomeActions = bindActionCreators(action1Creators, dispatch);
    return {
        OrderHomeActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));