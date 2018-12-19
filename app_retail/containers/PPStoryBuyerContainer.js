/**
 * Created by nipeng on 2017/11/23.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import PPStoryBuyerManage from '../views/PPStoryBuyerManage/PPStoryBuyerManage';
import * as StoryAction from '../actions/PPStoryAction';
import * as contants from '../../common/Apis/constants'


class PPStoryContainer extends React.Component{
    render(){
        return(
            <PPStoryBuyerManage {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }


}


const mapStateToProps = (state) =>{
    const PPStoryReducer = state.get('StoryReducer').toJS();
    return {
        PPStoryReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPStoryAction = bindActionCreators(StoryAction,dispatch);
    return{
        PPStoryAction
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PPStoryContainer));



