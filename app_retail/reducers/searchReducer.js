/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    popularSearches:[],//热门搜索列表
    historicalS:[],//历史记录
    searchForProducts:[],//搜索结果商品列表
    searchResults:false
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SEARCH_POPULAR_SEARCHES:{
            return state.merge({
                popularSearches:action.popularSearches
            })
        }
        case types.SEARCH_HISTORY_LIST:{
            return state.merge({
                historicalS:action.historicalS
            })
        }
        case types.SEARCH_FOR_PRODUCTS:{
            return state.merge({
                searchForProducts:action.searchForProducts
            })
        }
        case types.SEARCH_RESULTS:{
            return state.merge({
                searchResults:action.searchResults
            })
        }
        default:
            return state;
    }
};

export default MainReducer;