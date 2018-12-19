/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import Settlement from '../views/settlement/settlement';
import * as action1Creators from '../actions/settlementAction.js';
import * as contants from '../../common/Apis/constants'

class AppContainer extends React.Component {
    render() {
        return (
            <Settlement {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  Settlement  = state.get('Settlement').toJS();
    return {
        Settlement
    };
};

const mapDispatchToProps = (dispatch) => {
    const SettlementActions = bindActionCreators(action1Creators, dispatch);
    return {
        SettlementActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));