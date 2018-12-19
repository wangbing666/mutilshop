/**
 * Created by chengjiabing on 17/8/8.
 */
/**
 * Created by chengjiabing on 17/7/7.
 * 售后
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';
const initialState = Map({
    showLoading: false,
    showError: null,
    applyStatus:0,//1 申请排队 0 不在队列
    queueStatus:{
        customerId:'', //目标id'12491959'
        currentCount:0, //排队人数
        postNumber:0,//请求次数
        kaBaoId:'',
    }
});
let chatViewReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOWLOADING:
            return state.merge({
                showLoading: action.showLoading
            })
        case types.SHOWLOADINGERROR:
            return state.merge({
                showError: action.errorMsg
            })
        case types.APPLYCUSTOMERSERVICE:
            return state.merge({
                applyStatus: action.applyStatus
            })
        case types.GETPERSONINQUEUE:
            return state.merge({
                queueStatus: action.queueStatus
            })

        default:
            return state;
    }
};
export default chatViewReducer;