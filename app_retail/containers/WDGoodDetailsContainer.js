/**
 * Created by jiazhenwang on 2017/12/1.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import GoodDetails from '../views/WDGoodDetails/goodDetails.js';
import * as actionCreators from '../actions/goodDetailsAction.js';
import * as contants from '../../common/Apis/constants'

class goodDetailsContainer extends React.Component {
    render() {
        return (
            <GoodDetails {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    // const { App }=state;不使用immutable,这个解构的App在rootReducer中绑定的，不使用combineReducer就直接赋值const App=state;
    const  goodDetails  = state.get('GoodDetails').toJS();
    return {
        goodDetails
    };
};

const mapDispatchToProps = (dispatch) => {
    const goodDetailsActions = bindActionCreators(actionCreators, dispatch);
    return {
        goodDetailsActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(goodDetailsContainer));