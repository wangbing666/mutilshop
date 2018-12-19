/**
 * Created by AndyWang on 2017/7/7.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import HomePage from '../views/homePage/homePage';
import * as action1Creators from '../actions/homePageAction.js';
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
    const  HomePage  = state.get('HomePage').toJS();
    return {
        HomePage
    };
};

const mapDispatchToProps = (dispatch) => {
    const HomePageActions = bindActionCreators(action1Creators, dispatch);
    return {
        HomePageActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));