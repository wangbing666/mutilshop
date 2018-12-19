/**
 * Created by XiaYongjie on 2017/7/12.
 *
 */
import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState = Map({
    isShow: true,
    hasMore:true,
    pendPaymentList: [],//待付款
    toBeReceivedList: [], //待收货
    completedList: [],//完成
    pendPayIndex:1,
    toBeReceiveIndex:1,
    completedIndex:1,
    allIndex:1,
    allList: [],
    orderDetail:{},
    myTabType: -1,
    isInit:true,
});
let myOrderListReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.IS_INIT_PAGE: {
            return state.merge({
                isInit: action.isInit
            })
        }
        case types.HOMEPAGE_IS_SHOW_LOADING: {
            return state.merge({
                isShow: action.isShow
            })
        }
        case types.GET_PEND_PAYMENT_LIST: {
            return state.merge({
                pendPaymentList: action.pendPaymentList,
                hasMore:action.hasMore,
                pendPayIndex:action.pendPayIndex
            })
        }
        case types.GET_TO_BE_RECEIVED_LIST: {
            return state.merge({
                toBeReceivedList: action.toBeReceivedList,
                hasMore:action.hasMore,
                toBeReceiveIndex:action.toBeReceiveIndex
            })
        }
        case types.GET_COMPLETETED_LIST: {
            return state.merge({
                completedList: action.completedList,
                hasMore:action.hasMore,
                completedIndex:action.completedIndex
            })
        }
        case types.GET_ALL_LIST: {
            return state.merge({
                allList: action.allList,
                hasMore:action.hasMore,
                allIndex:action.allIndex
            })
        }
        case types.GET_ORDER_DETAIL_REACIVED: {
            return state.merge({
                orderDetail: action.detail
            })
        }
        case types.TAB_TYPE: {
            return state.merge({
                myTabType: action.myTabType
            })
        }
        case types.CLEAR_ORDER_DETAIL_DATA: {
            switch (action.index) {
                case 1:
                    return state.merge({
                        pendPaymentList: [],//待付款

                    })
                case 2:
                    return state.merge({
                        toBeReceivedList: [],//待收货

                    })
                case 3:
                    return state.merge({

                        completedList: [],//完成
                    })
                case 4:
                    return state.merge({


                        allList: [],//全部
                    })
                case 5:
                    return state.merge({

                        orderDetail: null, //订单详情
                    })
                case 6:
                    return state.merge({

                        orderDetail: null, //订单详情
                        pendPaymentList: [],//待付款
                        toBeReceivedList: [],//待收货
                        completedList: [],//完成
                        allList: [],//全部
                    })
            }

        }
        default:
            return state;
    }
};

export default myOrderListReducer;