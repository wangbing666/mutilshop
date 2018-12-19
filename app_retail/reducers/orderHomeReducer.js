/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    orderNumber:null
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ORDER_GET_NUMBER:{
            return state.merge({
                orderNumber:action.orderStatusNumber
            })
        }
        default:
            return state;
    }
};

export default MainReducer;