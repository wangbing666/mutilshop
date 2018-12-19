/**
 * Created by nipeng on 2017/7/8.
 * 登陆container
 */


import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router-dom'
import PPLoginManage from '../views/PPLoginManage/PPLoginManage';
import * as LoginAction from '../actions/PPLoginAction';
import * as contants from '../../common/Apis/constants'
class PPLoginContainer extends React.Component{
    render(){
        return (
            <PPLoginManage {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
    }
}


const mapStateToProps = (state) =>{
    const PPLoginReducer = state.get('PPLoginReducer').toJS();
    return {
        PPLoginReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPLoginAction = bindActionCreators(LoginAction,dispatch);
    return{
        PPLoginAction
    }
}


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PPLoginContainer))





