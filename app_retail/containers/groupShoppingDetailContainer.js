/**
 * Created by fantiantian on 2017/11/20.
 * 拼团详情
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import GroupShoppingDetail from '../views/groupShoppingDetail/groupShoppingDetail.js';
import * as actionCreators from '../actions/groupShoppingDetailAction.js';
import * as contants from '../../common/Apis/constants'
class groupShoppingDetailContainer extends React.Component {
    render() {
        return (
            <GroupShoppingDetail {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

}

const mapStateToProps = (state) => {
    const groupShoppingDetail = state.get('GroupShoppingDetail').toJS();
    return {
        groupShoppingDetail
    };
};

const mapDispatchToProps = (dispatch) => {
    const groupDetailsActions = bindActionCreators(actionCreators, dispatch);
    return {
        groupDetailsActions
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(groupShoppingDetailContainer));