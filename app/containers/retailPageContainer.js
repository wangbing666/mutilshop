/**
 * Created by AndyWang on 2017/7/7.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import RetailPage from '../views/retailPage/homePage';
import * as action1Creators from '../actions/retailPageAction.js';
import * as contants from '../../common/Apis/constants'

class AppContainer extends React.Component {
    render() {
        return (
            <RetailPage {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }
}
const mapStateToProps = (state) => {
    // const { App }=state;不使用immutable,这个解构的App在rootReducer中绑定的，不使用combineReducer就直接赋值const App=state;
    const  RetailPage  = state.get('RetailPage').toJS();
    return {
        RetailPage
    };
};

const mapDispatchToProps = (dispatch) => {
    const RetailPageActions = bindActionCreators(action1Creators, dispatch);
    return {
        RetailPageActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));