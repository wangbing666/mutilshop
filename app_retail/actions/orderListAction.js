/**
 * Created by XiaYongjie on 2017/7/12.
 *
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch'
import {Modal,} from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;
//获取订单列表
/**
 *
 * @param array 当前数组
 * @param userId 用户id
 * @param type   订单类型
 * @param pageSize
 * @param pageIndex
 * @param roleType  1.旗舰店2 是分销店 3消费者
 * @param shopId  店铺id
 * @param successCallback
 * @param failCallBack
 * @returns {function(*)}
 */
export let getOrderList = (array, userId, type, pageSize, pageIndex, roleType, shopId,successCallback, failCallBack) => {
    let body = {
        userId: userId,
        type: type,
        pageSize: pageSize,
        pageIndex: pageIndex,
        roleType:roleType,
        shopId:shopId
    }
    console.log(body);
    return dispatch => {
        return Util.post('/webOrder/getWebOrderList', body, (response) => {
            console.log(response);
            if (response.status == 0) {
                let getAry = [];
                if (array instanceof Array) {
                    for (let i = 0; i < array.length; i++)
                        getAry.push(array[i])
                }
                if (response.body.orderList !== null && response.body.orderList instanceof Array) {
                    for (let j = 0; j < response.body.orderList.length; j++)
                        getAry.push(response.body.orderList[j])
                }
                if (response.body.orderList !== null && response.body.orderList instanceof Array && successCallback)
                    successCallback(response.body.orderList);
                if (type === 1) {
                    dispatch(getPendPaymentList(getAry));
                } else if (type === 2) {
                    dispatch(getToBeReceivedList(getAry))
                } else if (type === 3) {
                    dispatch(getCompletedList(getAry))
                } else {
                    dispatch(getAllList(getAry))
                }
            } else {
                failCallBack(response.msg);
            }
        }, (error) => {
            failCallBack(error);
        });
    }
};
/**
 *
 * @param orderId
 * @param operation
 * @param userId
 * @param ary1（删除订单ary1 只代表已完成订单，取消订单 ary1只代表待支付列表）
 * @param ary2 （只代表已完成订单）
 * @param type （1待支付，2待收货，3已完成，4，全部）
 * @returns {function(*)}
 */
export let deleteOrCancelOrderPost = (orderId, operation, userId, ary1, ary2, callBack) => {//删除 取消 订单 operation (1:删除，2：取消)
    let body = {
        orderId: orderId,
        operation: operation,
        userId: userId,
    }
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/webOrder/cancelOrDeleteOrder', body, (response) => {
            dispatch(showLoading(false));
            console.log('response', response);
            if (response.status == 0) {

                if (callBack !== undefined && callBack !== null) {
                    callBack();
                }
                if (operation === 1)//删除订单之后
                {
                    for (let i = 0; i < ary1.length; i++) {
                        let dic = ary1[i];
                        if (dic.orderId === orderId) {
                            ary1.splice(i, 1)
                            dispatch(getCompletedList(ary1));
                            break;
                        }
                    }
                    if (ary2 && ary2.length > 0) {
                        for (let i = 0; i < ary2.length; i++) {
                            let des = ary2[i];
                            if (des.orderId === orderId) {
                                ary2.splice(i, 1)
                                dispatch(getAllList(ary2));
                                break;
                            }
                        }
                    }
                }
                else if (operation === 2)//取消订单后 改变响应数据源 （取消订单统一传值，）
                {
                    let i = 0;
                    let dic = null;
                    for (i = 0; i < ary1.length; i++) {
                        dic = ary1[i];
                        if (dic.orderId === orderId) {
                            ary1.splice(i, 1)
                            dispatch(getPendPaymentList(ary1));
                            break;
                        }
                    }
                    if (ary2 && ary2.length > 0) {
                        for (let j = 0; j < ary2.length; j++) {
                            let order = ary2[j]
                            if (order.orderId === orderId) {
                                ary2[j].status = '8'
                                dispatch(getAllList(ary2))
                            }
                        }
                    }
                }
            } else {
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#9B885F'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false))
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#9B885F'}
                },
            ]);

        });
    }
};

export let makeSureReceptPost = (orderId, userId, ary, completedAry, allAry, orderDetail, successBack) => {//确认收货
    let body = {
        orderId: orderId,
        userId: userId,
    }
    console.log('body', body);
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/webOrder/confirmReceive', body, (response) => {
            console.log('response', response);
            dispatch(showLoading(false));
            if (response.status === 0) {//成功
                if (successBack !== undefined) {
                    successBack();
                }
                if (orderDetail !== null) {
                    orderDetail.status = 4;
                    dispatch(orderDetailRec(orderDetail))
                }
                //改变数组中 订单状态
                let i = 0;
                let dic = null;
                for (i = 0; i < ary.length; i++) {
                    dic = ary[i];
                    if (dic.orderId === orderId) {
                        ary.splice(i, 1)
                        dispatch(getToBeReceivedList(ary));
                        break;
                    }
                }
                //确认收货添加已完成
                dic.status = 4;
                console.log('dic', dic)
                if (completedAry && completedAry.length > 0) {
                    completedAry.push(dic);
                    dispatch(getCompletedList(completedAry))
                    console.log('all ary' + completedAry.length)
                }
                let dix = null
                //确认收货添加全部订单
                let isHas = true;
                if (allAry && allAry.length > 0) {
                    for (let j = 0; j < allAry.length; j++) {
                        if (allAry[j].orderId === orderId) {
                            allAry[j].status = 4;
                            dispatch(getAllList(allAry));
                            isHas = false;
                            break;
                        }
                    }
                    if (isHas) {
                        allAry.push(dic);
                        dispatch(getAllList(allAry))
                        console.log('all ary' + allAry.length)
                    }

                }

            } else {
                console.log(response.msg)
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#9B885F'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false))
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#9B885F'}
                },
            ]);

        });
    }
};
//获取退货退款详情
export let getOrderDetail = (userId,roleType, orderId,orderSonId,successCallBack,cancleCallBack) => {
    let body = {
        userId: userId,
        roleType: roleType,
        orderId: orderId,
        orderSonId:orderSonId,
    }

    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/webOrder/getWebOrderDetail', body, (response) => {
       
            dispatch(showLoading(false));
       
            if (response.returnStatus == 0) {
                dispatch(orderDetailRec(response))
                successCallBack(response);
            } else {
                dispatch(showLoading(false));
                cancleCallBack(response);
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#9B885F'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            cancleCallBack(response);
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#9B885F'}
                },
            ]);
        });
    }
};
//再次购买post
export let buyAgainWithOrder = (userId, goodsAry, callBack) => {
    let shopList = []
    for (let i = 0; i < goodsAry.length; i++) {
        let dic = {
            "goodsId": goodsAry[i].goodsId,
            "number": goodsAry[i].goodsNum,
            "param1": goodsAry[i].param1,
            "param2": goodsAry[i].param2,
            "param3": goodsAry[i].param3
        }
        shopList[i] = dic;
    }
    let body = {
        userId: userId,
        shopList: JSON.stringify(shopList)
    }
    console.log('xia', body)
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/shopping/insertshop', body, (response) => {
            dispatch(showLoading(false));
            if (response.status == 0) {//加入购物袋成功
                if (callBack)
                    callBack();
            } else {
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#9B885F'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#9B885F'}
                },
            ]);
        });
    }
};
//设置Tab的type
export let setType = (type) => {
    console.log('action修改', type)
    return dispatch => {
        dispatch(tabType(type));
    }
}
/**
 * 清除Reducer的值
 * @param index （1 待付款，2，待收货，3，已完成，4，全部，5详情，6，ALL）
 * @returns {function(*)}
 */

export let clearn = (index) => {
    return dispatch => {
        dispatch(clearnData(index));
    }
}
export let hideAlert = () => {//弹框消失
    if (showAlert !== null) {
        showAlert.close();
    }
    return {
        type: types.CLEAR_ORDER_DETAIL_DATA,
        isShow: false
    }
}
let clearnData = (index) => {
    console.log('清除', index);
    return {
        type: types.CLEAR_ORDER_DETAIL_DATA,
        index: index,
    }
}
export let isCanReFunds = (userId, orderId, successCallback, errorCallback) => {
    let body = {
        orderId: orderId,
        userId:userId

    }
    console.log(body)
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post('/afterSale/applyReturn', body, (response) => {
            dispatch(showLoading(false));
            console.log("可以申请退款", response)
            if (response.status == 0) {//可以申请退款
                successCallback(response.body);
            } else {
                errorCallback();
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#9B885F'}
                    },
                ]);
            }
        }, (error) => {
            errorCallback();
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#9B885F'}
                },
            ]);
        });
    }
}
let tabType = (type) => {
    return {
        type: types.TAB_TYPE,
        myTabType: type
    }
}

let orderDetailRec = (detail) => {
    console.log('赋值');
    return {
        type: types.GET_ORDER_DETAIL_REACIVED,
        detail: detail
    }
}

//加载动画
let showLoading = (bool) => {
    return {
        type: types.HOMEPAGE_IS_SHOW_LOADING,
        isShow: bool
    }
};

let getPendPaymentList = (pendPaymentList) => {
    return {
        type: types.GET_PEND_PAYMENT_LIST,
        pendPaymentList: pendPaymentList
    }
}

let getToBeReceivedList = (toBeReceivedList) => {
    return {
        type: types.GET_TO_BE_RECEIVED_LIST,
        toBeReceivedList: toBeReceivedList
    }
}
let getCompletedList = (completedList) => {
    return {
        type: types.GET_COMPLETETED_LIST,
        completedList: completedList
    }
}
let getAllList = (allList) => {
    return {
        type: types.GET_ALL_LIST,
        allList: allList
    }
}
