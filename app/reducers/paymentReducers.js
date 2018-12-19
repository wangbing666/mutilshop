/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShow:true
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_HOME_LIST:{
            return state.merge({
                isShow:action.isShow
            })
        }
        default:
            return state;
    }
};

export default MainReducer;