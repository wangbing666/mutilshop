/**
 * Created by nipeng on 2017/11/28.
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';


const initialState = Map({
    isShowLoading:false,
    isLove:false,
    storyDetails:{},
    storyDetailsArray:[],
    isLikeNumber:0,
    commontNumber:0,

})


let PPStoryDetailsReducer = (state = initialState,actions)=> {
    switch (actions.type) {
        case types.PPSTORYDETAILSLOADING:{
            return state.merge({
                isShowLoading:actions.isShowLoading
            })
        }
        case types.PPSTORYSETLOVE:{
            return state.merge({
                isLove:actions.isLove,
                isLikeNumber:actions.isLikeNumber
            })
        }
        case types.PPSTORYDETAILSDIC:{
            return state.merge({
                storyDetails:actions.storyDetails
            })
        }
        case types.PPSTORYDETAILSARRAY:{
            return state.merge({
                storyDetailsArray:actions.storyDetailsArray
            })
        }
        case types.PPSTORYCOMMONTNUMBER:{
            return state.merge({
                commontNumber:actions.commontNumber
            })
        }
        default:
            return state;
    }
}


export default PPStoryDetailsReducer;





