/**
 * Created by chengjiabing on 17/8/8.
 */
import * as types from './actionTypes';
import * as db from '../../common/Apis/Utils';
import {post} from '../../common/Apis/Fetch'
import {Modal,} from 'antd-mobile';
const alert = Modal.alert;
let showAlert = null;

import {format} from '../../common/Apis/Utils'

export const applyChatWithSalerPost=(userId,status,mobileId,shopId)=>{ //申请客服
    let data = {
        userId: userId,
        queueState:status,
        // mobile:mobileId,
        shopId:shopId
    }

    return dispatch => {
        if(status===1){
            dispatch(showLoading(true));
        }
        return post('/customer/applyByShopId', data, (data) => {
            // dispatch(showLoading(false));
            if (data.status === 0) {
                dispatch(applyChatWithSaler(status))
            }
            else {
                showAlert = alert('提示', data.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#FE007E'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#FE007E'}
                },
            ]);
        });
    }
}

export const applyChatWithSaler=(applyStatus)=>{//申请客服
    return {
        type: types.APPLYCUSTOMERSERVICE,
        applyStatus:applyStatus
    }
}

export const getCurrentPersonNumberPost=(userId,postNumber,mobile,goodsId,callBack,shopId)=>{ //获取排队人数
    let data = {
        userId: userId,
        mobile:mobile,
        goodId:goodsId,
        shopId:shopId
    }
    return dispatch => {
        // dispatch(showLoading(true));
        return post('/customer/getQueueCount', data, (data) => {
            // dispatch(showLoading(false));
            if (data.status === 0) {
                if(data.body.customerId!=0&&data.body.customerId!=-1){
                    dispatch(showLoading(false));
                }
                let dic ={
                    customerId:data.body.customerId,
                    currentCount:data.body.queueSize,
                    postNumber:++postNumber,
                    kaBaoId:data.body.kaBaoId

                }
                callBack(dic)
                dispatch(getCurrentPersonNumber(dic))
            }
            else {
                showAlert = alert('提示', data.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#FE007E'}
                    },
                ]);
            }
        }, (error) => {
            dispatch(showLoading(false));
            if(showAlert){
                showAlert.close();
            }
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#FE007E'}
                },
            ]);
        });
    }
}

export const getCurrentPersonNumber=(dic)=>{//获取排队人数
    return {
        type: types.GETPERSONINQUEUE,
        queueStatus:dic
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
        showLoading: isShow
    }
}
export let hideAlert = () => {//弹框消失
    if (showAlert)
        showAlert.close();
    return {
        type: types.SHOWLOADING,
        isShowLoading: false
    }
}
