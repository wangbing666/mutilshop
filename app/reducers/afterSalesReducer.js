/**
 * Created by chengjiabing on 17/7/7.
 * 售后
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';
const initialState = Map({
    handerSaleList: [
        // {
        //     "goodsId": 1,
        //     "orderNo": "2",
        //     "refundAmount": 100,
        //     "afterSaleStatus": 1,
        //     "afterSaleId": 121212,
        //     "afterSaleCreateTime": 1499675431000,
        //     "goodsZoomURL": "https://www.baidu.com/img/bd_logo1.png",
        //     "goodsNo": "111",
        //     "goodsNum": 1,
        //     "orderStatus": 1,
        //     "goodsName": "笔记本",
        //     "orderId": 2
        // },
        // {
        //     "goodsId": 1,
        //     "orderNo": "2",
        //     "refundAmount": 100,
        //     "afterSaleStatus": 1,
        //     "afterSaleId": 121212,
        //     "afterSaleCreateTime": 1499675431000,
        //     "goodsZoomURL": "https://www.baidu.com/img/bd_logo1.png",
        //     "goodsNo": "111",
        //     "goodsNum": 1,
        //     "orderStatus": 1,
        //     "goodsName": "笔记本",
        //     "orderId": 2
        // },
        // {
        //     "goodsId": 1,
        //     "orderNo": "2",
        //     "refundAmount": 100,
        //     "afterSaleStatus": 1,
        //     "afterSaleId": 121212,
        //     "afterSaleCreateTime": 1499675431000,
        //     "goodsZoomURL": "https://www.baidu.com/img/bd_logo1.png",
        //     "goodsNo": "111",
        //     "goodsNum": 1,
        //     "orderStatus": 1,
        //     "goodsName": "笔记本",
        //     "orderId": 2
        // }
    ],
    saleList: [ ///记录
        // {
        //     "goodsId": 1,
        //     "orderNo": "2",
        //     "refundAmount": 100,
        //     "afterSaleStatus": 1,
        //     "afterSaleId": 2,
        //     "afterSaleCreateTime": 1499675431000,
        //     "goodsZoomURL": "https://www.baidu.com/img/bd_logo1.png",
        //     "goodsNo": "111",
        //     "goodsNum": 1,
        //     "orderStatus": 1,
        //     "goodsName": "笔记本",
        //     "orderId": 2
        // },
        // {
        //     "goodsId": 4,
        //     "orderNo": "3",
        //     "refundAmount": 45,
        //     "afterSaleStatus": 6,
        //     "afterSaleId": 3,
        //     "goodsZoomURL": "sina.com.pic",
        //     "goodsNo": "345",
        //     "goodsNum": 2,
        //     "orderStatus": 1,
        //     "goodsName": "篮球",
        //     "orderId": 3
        // }
    ],
    showLoading: false,
    showError: null,
    refundInfo: null,
    hasMore:true,
    sendExpressMsgSuccess: false,
    expressList: null,
    expressValueList: null,
    index:'1'
});
let afterSalesReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GETHANDLESALELIST: {
            return state.merge({
                handerSaleList: action.handerSaleList,
                hasMore:action.hasMore
            })
        }
        case types.GETSALEORDERLIST: {
            return state.merge({
                saleList: action.saleRecordList,
                hasMore:action.hasMore
            })
        }
        case types.SHOWLOADING:
            return state.merge({
                showLoading: action.isShowLoading
            })
        case types.SHOWLOADINGERROR:
            return state.merge({
                showError: action.errorMsg
            })
        case types.GET_REFUND_DETAIL:
            console.log("------ action.refundInfo---------", action.refundInfo)
            return state.merge({
                refundInfo: action.refundInfo
            })
        case types.SEND_EXPRESS_MSG:
            return state.merge({
                sendExpressMsgSuccess: action.sendExpressMsgSuccess
            })
        case types.GET_EXPRESS_LIST:
            return state.merge({
                expressList: action.expressList
            })
        case types.GET_EXPRESS_VALUE_LIST:
            return state.merge({
                expressValueList: action.expressValueList
            })
        case types.SELECTTABINAFTERSALE:
            return state.merge({
                index: action.index
            })

        default:
            return state;
    }
};

export default afterSalesReducer;