/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShowLoading:false,
    orderInfo:null,
    defaultAddress:null,//默认地址
    selectAddress:null
});

let settleMentReducer = (state = initialState, action) => {
    // console.log(action)
    switch (action.type) {
        case types.ORDER_IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.RECEIVE_PAY_RESULT:{
            return state.merge({
                orderInfo: action.orderInfo
            })
        }
        case types.SETTLEMENT_DEFAULT_ADDRESS:{
            return state.merge({
                defaultAddress:action.defaultAddress
            })
        }
        case types.SETTLEMENT_SELECT_ADDRESS:{
            return state.merge({
                selectAddress:action.selectAddress
            })
        }
        default:
            return state;
    }
};

export default settleMentReducer;