/**
 * Created by nipeng on 2017/7/10.
 * 购物袋reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';


const initialState = Map({
    goodsList:[],
    recommendList:[],
    isShowLoading:false,
    priceString:0,
    allSelectImag:false,
    numberShopCart:0

})

let PPShoppingCartReducer = (state = initialState,actions)=>{
    switch (actions.type){
        case types.SETSHOPPINGCARTLIST:{
            return state.merge({
                goodsList:actions.goodsList,
                priceString:actions.priceString,
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
        case types.SETALLSELECTIMAGE:{
            return state.merge({
                allSelectImag:actions.allSelectImag
            })
        }
        case types.SETDELECTSTATUSLIST:{
            return state.merge({
                goodsList:actions.goodsList,
                priceString:actions.priceString,
                allSelectImag:actions.allSelectImag,
                numberShopCart:actions.numberShopCart
            })
        }
        case types.SETNUMBERACTION:{
            return state.merge({
                goodsList:actions.goodsList,
                priceString:actions.priceString,
                numberShopCart:actions.numberShopCart
            })
        }
        default:
            return state;
    }
}

export default PPShoppingCartReducer;





