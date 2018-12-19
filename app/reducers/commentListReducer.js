/**
 * Created by chengjiabing on 17/11/24.
 */
import * as types from '../actions/actionTypes';

import {Map} from 'immutable';
const initialState = Map({
    show:false,
    commentListAry:[
    ],
    allNumber:0
});
let commentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.COMMENTLIST:{
            console.log('reducer')
            return state.merge({
                commentListAry: action.commentList
            })
        }
        case types.SHOWLOADING:{
            return state.merge({
                show: action.show
            })
        }
        case types.COMMENTNUMBER:{
            return state.merge({
                allNumber: action.allNumber
            })
        }
        default:
            return state;
    }
};

export default commentListReducer;