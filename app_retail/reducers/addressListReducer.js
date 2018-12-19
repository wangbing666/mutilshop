/**
 * Created by JieLi on 2017/7/6.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShow:false,
    addressList:[]
});
let addressListRedecer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ADDRESS_LIST:{
            return state.merge({
                addressList:action.addressList
            })
        }
        case types.CHANGE_DETAIL_ADDRESS:{
            return state.merge({
                addressList:action.addressList,

            })
        }
        case types.DELETE_RECEIPT_ADDRESS:{
            return state.merge({
                addressList:action.addressList
            })
        }
        case types.ISSHOWACTIVITY:{
            return state.merge({
                isShow:action.isShow
            })
        }

        default:
            return state;
    }
};

export default addressListRedecer;
