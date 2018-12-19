/**
 * Created by chenmao on 2016/11/29.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import GoodDetails from '../views/goodDetails/goodDetails.js';
import * as actionCreators from '../actions/goodDetailsAction.js';
import * as constant from '../../common/Apis/constants'
class goodDetailsContainer extends React.Component {
    render() {
        return (
            <GoodDetails {...this.props}/>
        )
    }
    componentDidMount() {
        
        const {history} = this.props;
        constant.currentHistory = history;
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