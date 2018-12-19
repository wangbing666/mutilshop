/**
 * Created by Song on 2018/7/19.
 */

import * as types from "../actions/actionTypes";
import { Map, merge } from "immutable";

const initialState = Map({
  isLoading: false,
  hasMore: true,
  searchType: 1, // 1 商品 2 店铺
  keyWord: '',
  listStyle: 2, // 商品列表样式 1 单列 2 双列
  productType: 1, //商品分类id
  rankType: 1, //排序类型
  startPrice: 0,
  endPrice: 0, //搜索价格区间
  searchResult: [], //搜索结果
  shopRankType: 1, //店铺排序方式
  pageNow: 1,
  pageSize: 10,
  productTypeArr: [], //商品大类
  productSubType: [], //商品子类
});

let SearchResultReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PRODUCT_TYPE:
      return state.merge(Map({
        productTypeArr: action.data.productTypeArr,
      //  productSubType: action.data.productSubType
      }))
      case types.GET_SUBPRODUCT_TYPE:
      return state.merge(Map({
      //  productTypeArr: action.data.productTypeArr,
        productSubType: action.data.resProductSubType
      }))
    case types.SET_KEY_WORD:
      return state.merge({
        keyWord: action.keyWord
      })
    case types.SET_SEARCH_TYPE:
      return state.merge({
        searchType: action.searchType
      })
    case types.TOGGLE_LIST_STYLE:
      return state.merge({
        listStyle: state.get('listStyle') === 1 ? 2 : 1
      })
    case types.SET_PRODUCT_TYPE:
      return state.merge({
        productType: action.productType
      })
    case types.SET_RANK_TYPE:
      return state.merge({
        rankType: action.rankType
      })
    case types.SET_START_PRICE:
      return state.merge({
        startPrice: action.startPrice
      })
    case types.SET_END_PRICE:
      return state.merge({
        endPrice: action.endPrice
      })
    case types.SET_SEARCH_RESULT:
      return state.merge(Map({
       // searchResult: [...state.get('searchResult'), ...action.searchResult.data],
        searchResult: [...action.searchResult.data],
        pageSize: action.searchResult.pageSize,
        pageNow: action.searchResult.pageNow,
        hasMore: action.searchResult.hasMore
      }))
    case types.SET_PRODUCT_MAIN_TYPE:
      return state.merge(Map({
        productTypeArr: action.productTypeArr
      }))
    case types.SET_SHOP_RANK_TYPE:
      return state.merge({
        shopRankType: action.shopRankType
      })
    case types.SHOWLOADING:
      return state.set('isLoading', action.isLoading)
    case types.CLEAR_SEARCH:
      return state.set('searchResult', [])
    default:
      return state;
  }
};

export default SearchResultReducer;