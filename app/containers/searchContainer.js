/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import Search from '../views/search/search';
import * as action1Creators from '../actions/searchAction.js';
import * as constant from '../../common/Apis/constants'
class AppContainer extends React.Component {
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }
    render() {
        console.log('search container')

        console.log(this.props)
        return (
            <Search {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  Search  = state.get('Search').toJS();
    return {
        Search
    };
};

const mapDispatchToProps = (dispatch) => {
    const SearchActions = bindActionCreators(action1Creators, dispatch);
    return {
        SearchActions
    };
};
export default withRouter (connect(mapStateToProps,mapDispatchToProps)(AppContainer));

