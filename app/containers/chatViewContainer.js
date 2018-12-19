/**
 * Created by chengjiabing on 17/8/7.
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ChatView from '../views/chatView/chatView';
import * as chatViewAction1 from '../actions/chatViewAction';
import * as contants from '../../common/Apis/constants'
import { withRouter } from 'react-router-dom'

class ChatViewContainer extends React.Component {


    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;

    }

    render() {
        return (
            <ChatView {...this.props} />
        )
    }
}
const mapStateToProps = (state) => {
    const  chat  = state.get('Chat').toJS();
    return {
        chat
    };
};
const mapDispatchToProps = (dispatch) => {
    const chatViewAction = bindActionCreators(chatViewAction1, dispatch);
    return {
        chatViewAction
    };
};
// export default connect(mapStateToProps,mapDispatchToProps)(ChatViewContainer);
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ChatViewContainer));