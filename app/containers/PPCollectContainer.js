/**
 * Created by nipeng on 2017/7/7.
 * 收藏container
 */

import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import PPCollectManage from '../views/PPCollectManage/PPCollectManage';
import * as CollectAction from '../actions/PPCollectAction';

import * as constant from '../../common/Apis/constants'


class PPCollectContainer extends React.Component {
    render(){
        return (
            <PPCollectManage {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}

const mapStateToProps = (state) =>{
    const PPCollectReducer = state.get('PPCollectReducer').toJS();
    return {
        PPCollectReducer
    };
};

const mapDispatchToProps = (dispatch) =>{
    const PPCollectAction = bindActionCreators(CollectAction,dispatch);
    return{
        PPCollectAction
    };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PPCollectContainer));





