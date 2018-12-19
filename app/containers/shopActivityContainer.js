/**
 * Created by chengjiabing on 17/11/28.
 * 店铺活动
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import ShopActivity from '../views/shopActivity/shopActivity';
import * as shopActivityAction1 from '../actions/shopActivityAction';
import * as constant from '../../common/Apis/constants'

class shopActivityContainer extends React.Component {
    render() {
        return (
            < ShopActivity {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  shopActivity  = state.get('shopActivity').toJS();
    return {
        shopActivity
    };
};

const mapDispatchToProps = (dispatch) => {
    const shopActivityAction= bindActionCreators(shopActivityAction1, dispatch);
    return {
        shopActivityAction
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(shopActivityContainer));