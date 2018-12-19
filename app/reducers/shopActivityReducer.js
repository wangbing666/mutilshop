/**
 * Created by chengjiabing on 17/11/28.
 * 店铺活动
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShowLoading:false,
    list: [
    ],
    barnnerAndTemplateId:{
        templateId:null,
        banners:[]
    }
    }
);
let shopActivityReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOWLOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.SHOPACTIVITYLIST:{
            return state.merge({
                list: action.list
            })
        }
        case types.SHOPACTIVITYBANNER:{
            return state.merge({
                barnnerAndTemplateId: action.dic
            })
        }

        default:
            return state;
    }
};

export default shopActivityReducer;