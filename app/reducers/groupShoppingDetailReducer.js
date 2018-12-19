/**
 * Created by fantiantian on 2017/11/20.
 * 拼团详情 Reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    groupStatus: 2,
    groupText: '正在拼团',
    groupDetailData: null
});
let groupDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GROUPDETAILDATA: {
            return state.merge({
                groupDetailData: action.groupDetailData,
            })
        }
        case types.GROUPSTATUS:{
            return state.merge({
                groupStatus: action.groupStatus,
                groupText: action.groupText
            })
        }
        default:
            return state;
    }
};

export default groupDetailsReducer;