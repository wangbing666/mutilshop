/**
 * Created by AndyWang on 2017/7/7.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import HomePage from '../views/shopHome/homePage';
import * as action1Creators from '../actions/shopHomeAction';
import * as contants from '../../common/Apis/constants'
class AppContainer extends React.Component {
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }
    render() {
        return (
            <HomePage {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    // const { App }=state;不使用immutable,这个解构的App在rootReducer中绑定的，不使用combineReducer就直接赋值const App=state;
    const  IndexPage  = state.get('shopHomeReducer').toJS();
    return {
        IndexPage
    };
};

const mapDispatchToProps = (dispatch) => {
    const ShopHomeActions = bindActionCreators(action1Creators, dispatch);
    return {
        ShopHomeActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));