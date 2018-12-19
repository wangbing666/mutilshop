/**
 * Created by chengjiabing on 17/11/24.
 * 商品故事评论列表
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import CommentList from '../views/comment/commentList';
import * as commentListActions from '../actions/commentListAction';
import * as constant from '../../common/Apis/constants'

class CommentListContainer extends React.Component {
    render() {
        return (
            <CommentList {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  commentList = state.get('commentList').toJS();
    return {
        commentList
    };
};

const mapDispatchToProps = (dispatch) => {
    const commentListAction = bindActionCreators(commentListActions, dispatch);
    return {
        commentListAction
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CommentListContainer));