/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShowLoading:true,
    groupingNameData:[], //分组名称
    shopName:'购物板块首页',//店铺名称
    calssifyActIndex:0,
});
let shopHomeReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.HOMEPAGE_IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading,
                calssifyActIndex:action.calssifyActIndex
            })
        }
        default:
            return state;
    }
};

export default shopHomeReducer;