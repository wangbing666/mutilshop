/**
 * Created by chengjiabing on 17/7/7.
 * 售后
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import AfterSalesTab from '../views/aftersales/afterSalesTab';
import * as afterSalesAction1 from '../actions/afterSalesAction';

class afterSaleContainer extends React.Component {
    render() {
        return (
            <AfterSalesTab {...this.props} />
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
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(afterSaleContainer));