/**
 * Created by nipeng on 2017/7/10.
 * 购物袋reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';


const initialState = Map({
    recommendList:[],
    isShowLoading:false,
    isEmpty: false,
    priceString:0,
    cashBack: 0,
    allSelectImag:false,
    numberShopCart:0,
    shopCartLit:[],
    isLoading: false,
    hasMore: true,
})

let PPShoppingCartReducer = (state = initialState,actions)=>{
    switch (actions.type){
        case types.SETSHOPPINGCARTLIST:{
            return state.merge({
                shopCartLit:actions.shopCartLit,
                hasMore:actions.hasMore,
                priceString:actions.priceString,
                cashBack: actions.cashBack,
                allSelectImag:actions.allSelectImag,
                numberShopCart:actions.numberShopCart
            })
        }
        case types.SETRECOMMENDLIST:{
            return state.merge({
                recommendList:actions.recommendList
            })
        }
        
        case types.SHOPPINGCARTLOADING:{
            return state.merge({
                isShowLoading:actions.isShowLoading
            })
        }

        case types.SHOPPINGCARTEMPATY:{
          return state.merge({
            isEmpty:actions.isEmpty
          })
      }
        
        case types.SETALLSELECTIMAGE:{
            return state.merge({
                allSelectImag:actions.allSelectImag
            })
        }
        case types.SETDELECTSTATUSLIST:{
            return state.merge({
                shopCartLit:actions.shopCartList,
                priceString:actions.priceString,
                cashBack: actions.cashBack,
                allSelectImag:actions.allSelectImag,
                numberShopCart:actions.numberShopCart
            })
        }
        case types.SETNUMBERACTION:{
            return state.merge({
                shopCartLit:actions.shopCartLit,
                priceString:actions.priceString,
                cashBack: actions.cashBack,
                numberShopCart:actions.numberShopCart
            })
        }
        default:
            return state;
    }
}

export default PPShoppingCartReducer;





