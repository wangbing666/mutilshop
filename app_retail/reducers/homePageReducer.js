/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState =Map({
    isShowLoading:true,
    homePageList:[],
    shopData:{
        "shopName": "",
        "describes": "",
        "logoUrl": "",
        "backgroundUrl": "",
        "fitmentId": 5

    },
    groupingNameData:[], //分组名称
    isShopFrozen: 0,// 0未冻结 -1 冻结
});
let MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.HOMEPAGE_IS_SHOW_LOADING:{
            return state.merge({
                isShowLoading:action.isShowLoading
            })
        }
        case types.HOMEPAGE_LIST_OF_GOODS:{
            return state.merge({
                homePageList:action.listOfGoods
            })
        }
        case types.HOMEPAGE_SHOPDES:{
            return state.merge({
                shopData:action.shopData
            })
        }
        case types.GROUPING_NAME_LIST:{
            return state.merge({
                groupingNameData:action.groupingNameData
            })
        }
        case types.IS_SHOP_FROZEN:
            return state.merge(Map({
                isShopFrozen: action.isShopFrozen
            }))
        default:
            return state;
    }
};

export default MainReducer;