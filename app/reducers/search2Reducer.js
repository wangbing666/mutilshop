/**
 * Created by Song on 2018/7/5.
 */

import * as types from "../actions/actionTypes";
import { Map, merge } from "immutable";

const initialState = Map({
  historicalS: [], //历史记录
  keyWord: '', //搜索关键字
});

let SearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SEARCH_HISTORY_LIST: {
      return state.merge({
        historicalS: action.historicalS
      });
    }
    case types.SET_KEY_WORD: {
      return state.merge({
        keyWord: action.keyWord
      })
    }
    default:
      return state;
  }
};

export default SearchReducer;
