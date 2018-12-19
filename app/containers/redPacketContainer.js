import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import RedPacket from '../views/redPacket/redPacket';
import * as redPacketAction from '../actions/redPacketAction.js';
import * as constant from '../../common/Apis/constants'
class AppContainer extends React.Component {
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }
    render() {
        return (
            <RedPacket {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    // const  RedPacket  = state.get('RedPacket').toJS();
    // return {
    //   RedPacket
    // };
};

const mapDispatchToProps = (dispatch) => {
    const RedPacketActions = bindActionCreators(redPacketAction, dispatch);
    return {
      RedPacketActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));