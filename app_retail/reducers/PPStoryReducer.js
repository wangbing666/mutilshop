/**
 * Created by nipeng on 2017/11/23.
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';


const initialState = Map({
    isShowLoading:false,
    storyList:[]
})


let PPStoryReducer = (state = initialState,actions)=> {
    switch (actions.type) {
        case types.PPSTORYLOADING:{
            return state.merge({
                isShowLoading:actions.isShowLoading
            })
        }
        case types.PPSTORYLIST:{
            return state.merge({
                storyList:actions.storyList
            })
        }
        default:
            return state;
    }
}


export default PPStoryReducer;


