/**
 * Created by ysy on 18/8/30.
 * 分类列表
 */

import * as types from './actionTypes';
import * as db from '../../common/Apis/Utils';
import {post} from '../../common/Apis/Fetch'
import {Modal,} from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;
export let getHandleSaleListPost = (array, pageNow, pageSize,shopId, sucCallbak) => { //获取当前售后列表
    let userID=0
    if(db.readUserInfo())
    {
        userID = db.readUserInfo()['wedoId'];
    }
    let data = {
        userId: "12491959",
        pageSize: pageSize,
        pageNow: pageNow,
    }
    return dispatch => {
        dispatch(showLoading(true));
        return post('/afterSale/getMultiInProgressAfterSaleMList', data, (data) => {
            dispatch(showLoadingERROR(null));
            dispatch(showLoading(false));
            if (data.status === 0) {
                let getAry = [];
                for (let i = 0; i < array.length; i++)
                    getAry.push(array[i])
                for (let j = 0; j < data.body.result.list.length; j++)
                    getAry.push(data.body.result.list[j])
                if (sucCallbak)
                    sucCallbak(data.body.result.list.length);
                    console.log('我的售后的列表', getAry);
                    dispatch(getHandleSaleList(getAry))
            }
            else {
                // dispatch(showLoadingERROR(data.error));
                showAlert = alert('提示', data.error(), [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);

            }
        }, (error) => {
            dispatch(showLoading(false));
            // dispatch(showLoadingERROR('网络失败'));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
};
export let getSaleRecordListPost = (array, pageNow, pageSize,shopId,sucCallbak) => { //获取申请记录列表
    let userID=0
    if(db.readUserInfo())
    {
        userID = db.readUserInfo()['wedoId'];
    }
    userID = "12491959";
    let data = {
        userId: userID,
        pageNow: pageNow,
        pageSize: pageSize,
    }

    return dispatch => {
        dispatch(showLoading(true));
        return post('/afterSale/getAfterSaleMList', data, (data) => {
            console.log('申请记录', data);
            dispatch(showLoading(false));
            if (data.status === 0) {
                let getAry = [];
                for (let i = 0; i < array.length; i++)
                    getAry.push(array[i])
                for (let j = 0; j < data.body.result.list.length; j++)
                    getAry.push(data.body.result.list[j])
                if (sucCallbak)
                    sucCallbak(data.body.result.list.length);
                dispatch(getSaleRecordList(getAry))
                dispatch(showLoadingERROR(null));
            }
            else {
                // dispatch(showLoadingERROR(data.error));
                showAlert = alert('提示', data.error(), [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            // dispatch(showLoadingERROR('网络失败'));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
};
/**
 * 获取退货退款详情
 * @param array
 * @param pageNow
 * @param pageSize
 * @param sucCallbak
 * @returns {function(*)}
 */
export let getSaleDetail = (userId, aftersaleId, orderId) => { //获取申请记录列表
    let data = {
        userId: userId,
        aftersaleId: aftersaleId,
        orderId: orderId,
    }
    console.log('data', data)
    return dispatch => {
        dispatch(showLoading(true));
        return post('/afterSale/getReturnGoodsInfo', data, (data) => {
            dispatch(showLoading(false));
            console.log('----------物流信息----------------->', data)
            if (data.status === 0) {
                dispatch(getSaleDetailInfo(data.body.refundInfo));
            }
            else {
                showAlert = alert('提示', data.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
};

/**
 * 我要寄件
 * @param userId  用户id
 * @param aftersaleId 售后id
 * @param logisticsName    承运商名称
 * @param transportNo   运单号
 * @returns {function(*)}
 */
export let sendExpressInfo = (userId, aftersaleId, logisticsName, logisticsId, transportNo, refundInfo, orderId) => { //获取申请记录列表
    let data = {
        userId: userId,
        aftersaleId: aftersaleId,
        logisticsName: logisticsName,
        logisticsId: logisticsId,
        transportNo: transportNo,
        orderId: orderId
    }
    console.log('我要寄件', data)
    return dispatch => {
        dispatch(showLoading(true));
        return post('/afterSale/postGoods', data, (data) => {
            console.log(data)
            dispatch(showLoading(false));
            if (data.status === 0) {
                refundInfo.isCancelAS = 0
                refundInfo.logisticsName = logisticsName,
                    refundInfo.logisticsId = logisticsId,
                    refundInfo.transportNo = transportNo,
                    dispatch(sendExpressMsg(true));
                dispatch(getSaleDetailInfo(refundInfo));
            }
            else {
                showAlert = alert('提示', data.msGridColumn, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
};
export let hideAlert = () => {//弹框消失
    if (showAlert)
        showAlert.close();
    return {
        type: types.SHOWLOADING,
        isShowLoading: false
    }
}

export let getHandleSaleList = (ary) => {//获取当前售后列表
    return {
        type: types.GETHANDLESALELIST,
        handerSaleList: ary
    }
}
export let getSaleRecordList = (ary) => {//获取申请记录列表
    return {
        type: types.GETSALEORDERLIST,
        saleRecordList: ary
    }
}
export let cancelApplyPost = (userId, aftersaleId, refundInfo, orderId) => {//撤销申请
    let data = {
        userId: userId,
        aftersaleId: aftersaleId
    }
    console.log('撤销申请', data)
    return dispatch => {
        dispatch(showLoading(true));
        return post('/afterSale/cancelAfterSale', data, (data) => {
            dispatch(showLoading(false));
            console.log('撤销申请', data)
            if (data.status == 0) {
                let d = {
                    userId: userId,
                    aftersaleId: aftersaleId,
                    orderId: orderId,
                }
                return post('/afterSale/getReturnGoodsInfo', d, (res) => {
                    dispatch(showLoading(false));
                    console.log('----------物流信息----------------->', res)
                    if (res.status === 0) {
                        dispatch(getSaleDetailInfo(res.body.refundInfo));
                    }
                    else {
                        showAlert = alert('提示', res.msg, [
                            {
                                text: '确定', onPress: () => {
                            }, style: {color: '#000000'}
                            },
                        ]);
                    }
                }, (error) => {
                    dispatch(showLoading(false));
                    showAlert = alert('提示', '网络失败', [
                        {
                            text: '确定', onPress: () => {
                        }, style: {color: '#000000'}
                        },
                    ]);
                });
            }
            else {
                showAlert = alert('提示', '撤销失败', [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
}

export let selectTabWithIndex = (index) => {//选择某个 tab
    return {
        type: types.SELECTTABINAFTERSALE,
        index: index
    }
}
/**
 * 获取物流公司列表
 * @returns {function(*)}
 */
export let getExpressList = (userId) => {

    return dispatch => {
        dispatch(showLoading(true));
        return post('/dict/companyList', [], (data) => {
            dispatch(showLoading(false));
           // console.log('物流公司列表', data);
            if (data.status === 0) {
                let array = [];
                let values = [];
                for (let i = 0; i < data.body.lists.length; i++) {
                    let myData = {
                        label: data.body.lists[i].companyName,
                        value: data.body.lists[i].companyId,
                    }
                    let valueArray = {
                        value: data.body.lists[i].companyId,
                    }
                    values.push(valueArray)
                    array.push(myData)
                }
                dispatch(expressList(array));
                dispatch(expressValueList(values));
            }
            else {
                showAlert = alert('提示', '', [
                    {
                        text: data.msg, onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
}
export let getSaleDetailInfo = (refundInfo) => {
    return {
        type: types.GET_REFUND_DETAIL,
        refundInfo: refundInfo
    }
}
export let sendExpressMsg = (bool) => {
    return {
        type: types.SEND_EXPRESS_MSG,
        sendExpressMsgSuccess: bool
    }
}
export let expressList = (lists) => {
    return {
        type: types.GET_EXPRESS_LIST,
        expressList: lists
    }
}
export let expressValueList = (array) => {
    return {
        type: types.GET_EXPRESS_VALUE_LIST,
        expressValueList: array
    }
}
export const showLoadingERROR = (errorMsg) => {
    return {
        type: types.SHOWLOADINGERROR,
        errorMsg: errorMsg
    }
}
export const showLoading = (isShow) => {

    return {
        type: types.SHOWLOADING,
        isShowLoading: isShow
    }
}
