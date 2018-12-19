/**
 * Created by Song on 2018/06/27
 * 店铺介绍
 */

import * as types from '../actions/actionTypes';
import { Map, merge } from 'immutable';

const initialState = Map({
    isShowLoading: false,
    shopBrief: {
        logoId: '', //店铺logo
        shopName: '',
        shopType: 0, //店铺类型
        createTime: '',
        mobile: '',
        describes: '',
        isCollection: 0,
        goodsNums: 0,
    },
})

let shopBriefReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case types.SHOPINFO: {
            return state.merge(Map({
                shopBrief: actions.shopBrief
            }))
        }
        case types.FOCUS: {
            return state.merge(Map({
                isFocused: actions.isFocused,
            }))
        }
        case types.UNFOCUS: {
            return state.merge(Map({
                isFocused: actions.isFocused
            }))
        }
        default:
            return state;
    }
}

export default shopBriefReducer;
