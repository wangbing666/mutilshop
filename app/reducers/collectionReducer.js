/**
 * Created by Song on 2018/7/25.
 *
 */

import * as types from "../actions/actionTypes";
import { Map, merge } from "immutable";

const initialState = Map({
  isLoading: false,
  hasMorePro: true, //商品
  hasMoreShop: true, //店铺
  keyWord: '', //搜索关键字
  searchType: 1, //1 商品 2 店铺
  productList: [], //商品列表
  shopList: [], //店铺列表
  proPageNow: 1, //商品当前页
  proPageSize: 10,
  shopPageNow: 1,
  shopPageSize: 10,
  goodsTotal:null,
  shopTotal:null,
  delStatus:0,
  hasMore:true,
});

let CollectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_COLLECT_KEYWORD: {
      return state.merge({
        keyWord: action.keyWord
    })
    }
    
    case types.SET_COLLECT_DELSTATUS: {
      return state.merge({
        delStatus: action.delStatus
    })
    }
    case types.SET_COLLECT_PRODUCT:{
     // console.log("收藏商品...",action.productList);
      return state.merge(Map({
        //  productList: [...state.get('productList'), ...action.productList],
          productList: action.productList,
          pageSize: action.pageSize,
          pageNow: action.pageNow,
          hasMore: action.hasMore,
         // hasMorePro: !([...state.get('productList'), ...action.productList].length >= action.goodsTotal),
         // hasMorePro: !([...action.productList].length >= action.goodsTotal),
          goodsTotal: action.productList.length
        }))
    }
     
    case types.SET_COLLECT_SHOP:{
      return state.merge(Map({
        //shopList: [...state.get('shopList'), ...action.shopList],
        shopList: action.shopList,
        pageSize: action.pageSize,
        pageNow: action.pageNow,
        hasMore: action.hasMore,
       // hasMoreShop: !([...state.get('shopList'), ...action.shopList].length >= action.shopTotal),
        // hasMoreShop: !([...action.shopList].length >= action.shopTotal), 
        shopTotal:action.shopList.length
      }))
    }
    case types.SET_COLLECT_TYPE:{
        return state.merge({
          delStatus: action.delStatus
      })
    }
    case types.SHOWLOADING:{
      return state.merge({
        isLoading: action.isLoading
    })
    }
    case types.CLEAR_COLLECT_PRODUCT:{
        return state.merge({
          productList: []
      })
    }
    case types.CLEAR_COLLECT_SHOP:{
      return state.merge({
        shopList: []
    })
    }
     
    default:
      return state;
  }
}

export default CollectionReducer;
