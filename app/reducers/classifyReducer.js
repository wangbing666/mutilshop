/**
 * Created by ysy on 18/8/30.
 * 分类
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';
const initialState = Map({
    showLoading: false,
});
let classifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOWLOADING:
            return state.merge({
                showLoading: action.isShowLoading
            })
        default:
            return state;
    }
};

export default classifyReducer;