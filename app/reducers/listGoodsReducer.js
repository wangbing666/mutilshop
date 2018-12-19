/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    commodityList:[],
    groupingDetailsData:null,
    partitionInfo:null,//分区信息接口
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.COMMODITY_LIST:{
            return state.merge({
                commodityList:action.commodityList
            })
        }
        case types.GROUPING_DETAILS:{
            return state.merge({
                groupingDetailsData:action.groupingDetailsData
            })
        }
        case types.CLOUND_DEPARTION:{
            return state.merge({
                partitionInfo:action.partitionInfo
            })

        }
        default:
            return state;
    }
};
export default MainReducer;