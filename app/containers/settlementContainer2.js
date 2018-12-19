/**
 * Created by AndyWang on 2017/7/8.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import Settlement from '../views/settlement2/settlement';
import * as action1Creators from '../actions/settlementAction2.js';
import * as constant from '../../common/Apis/constants'

class Settlement2Container extends React.Component {
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }
    render() {
        return (
            <Settlement {...this.props} />
        )
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
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Settlement2Container));