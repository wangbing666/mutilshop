/**
 * Created by nipeng on 2017/7/7.
 * 收藏reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState = Map({
    collectList:[],
    isShowLoading:false
})

let PPCollectReducer = (state = initialState,action)=>{
    switch (action.type){
        case types.COLLECT_LIST:{
            return state.merge({
                collectList:action.collectList
            })
        }
        case types.COLLECTLOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        default:
            return state;
    }
}

export default PPCollectReducer;







