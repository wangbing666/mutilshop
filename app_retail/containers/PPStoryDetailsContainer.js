/**
 * Created by nipeng on 2017/11/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import PPStoryDetailsManage from '../views/PPStoryManage/PPStoryDetailsManage';
import * as StoryDetailsAction from '../actions/PPStoryDetailsAction';
import * as contants from '../../common/Apis/constants'


class PPStoryDetailsContainer extends React.Component{
    render(){
        return(
            <PPStoryDetailsManage {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }

}


const mapStateToProps = (state) =>{
    const PPStoryDetailsReducer = state.get('storyDetails').toJS();
    return {
        PPStoryDetailsReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPStoryDetailsAction = bindActionCreators(StoryDetailsAction,dispatch);
    return{
        PPStoryDetailsAction
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PPStoryDetailsContainer));