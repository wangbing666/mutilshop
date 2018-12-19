/**
 * Created by chenmao on 2016/11/29.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShow:null,
    openType:0,
    isShowLoading:false,
    goodInfo:null,
    groupGoods:null,
    goodSpecification:null,
    showPictureBrowse:0,
    grayArr:[]
});
let goodDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_GOOD_DETAILS:{
            return state.merge({
                isShow:action.isShow,
                openType:action.openType
            })
        }
        case types.IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.RECEIVE_GOOD_DETAILS:{
            return state.merge({
                goodInfo:action.goodInfo
            })
        }
        case types.IS_GROUP_GOODS:{
            return state.merge({
                groupGoods:action.groupGoods
            })
        }
        case types.RECEIVE_GOOD_SPECIFICATION:{
            return state.merge({
                goodSpecification:action.goodSpecification
            })
        }
        case types.GET_GOODTYPE_SERVER:{
            return state.merge({
                grayArr:action.grayArr
            })
        }
        case types.SHOW_PICTURE_BROWSE:{
            return state.merge({
                showPictureBrowse:action.showPictureB
            })
        }
        default:
            return state;
    }
};

export default goodDetailsReducer;
