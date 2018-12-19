/**
 * Created by nipeng on 2017/7/10.
 * 购物袋container
 */

import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {bindActionCreators} from 'redux';
import PPShoppingCartManage from '../views/PPShoppingCartManage/PPShoppingCartManage';
import * as ShoppingAction from '../actions/PPShoppingCartAction';
import * as constant from '../../common/Apis/constants'


class PPShoppingCartContainer extends React.Component{
    render(){
        return(
            <PPShoppingCartManage {...this.props}/>
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}


const mapStateToProps = (state) =>{
    const PPShoppingCartReducer = state.get('PPShoppingCartReducer').toJS();
    return {
        PPShoppingCartReducer
    };
};


const mapDispatchToProps = (dispatch) =>{
    const PPShoppingCartAction = bindActionCreators(ShoppingAction,dispatch);
    return{
        PPShoppingCartAction
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PPShoppingCartContainer));






