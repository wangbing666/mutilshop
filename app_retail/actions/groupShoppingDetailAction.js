/**
 * Created by fantiantian on 2017/11/20.
 * 拼团详情 Action
 */


import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import {Modal} from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;
//status  0: 正在拼团  1：拼团成功  2： 拼团过期
//修改拼团状态
export let changeGroupStatus = (status) => {
    //0: 拼团成功
    if (status === 0) {
        return {
            type: types.GROUPSTATUS,
            groupStatus: status,
            groupText: '拼团成功'
        }
    } else if (status === 1) {// 1：拼团过期
        return {
            type: types.GROUPSTATUS,
            groupStatus: status,
            groupText: '已失效'
        }
    } else if (status === 2) { //2： 正在拼团
        return {
            type: types.GROUPSTATUS,
            groupStatus: status,
            groupText: '正在拼团'
        }
    }

}

//获得团购详情信息
export let getGroupDetailData = (data) => {
    return {
        type: types.GROUPDETAILDATA,
        groupDetailData: data
    };
}

//接口返回团购详情信息
export let getGroupDetailDataFromSever = (url, userId, orderId, sucessCallBack, failCallBack) => {
    let body = {
        userId: userId,
        orderId: orderId
    }
    return dispatch => {
        return Util.post(url, body, (response) => {
            if (response.status === 0) {
                sucessCallBack(response);
                var goodsActDetail = response.body.goodsActDetail;
                if (goodsActDetail != null) {
                    //处理精度丢失问题
                    Math.formatFloat = function (f, digit) {
                        var m = Math.pow(10, digit);
                        return Math.round(f * m, 10) / m;
                    }
                    let beatRate = Math.formatFloat(goodsActDetail.beatRate * 100, 2);   //计算打败值
                    var data = {
                        goodsId: goodsActDetail.goodsId,
                        goodsName: goodsActDetail.goodsName,
                        goodsUrl: goodsActDetail.goodsUrl,
                        personNum: goodsActDetail.personNum,
                        amount: goodsActDetail.amount,
                        price: goodsActDetail.price,
                        nowPerson: goodsActDetail.nowPerson,
                        status: goodsActDetail.status,
                        startTime: goodsActDetail.startTime,
                        time: goodsActDetail.time,
                        headList: goodsActDetail.headList == null ? [] : goodsActDetail.headList,
                        beatRate: beatRate + '%',
                        joinUsers: goodsActDetail.joinUsers == null ? 0 : goodsActDetail.joinUsers,
                        groupBuyId: goodsActDetail.groupBuyId,
                        isExist: response.body.isExist
                    }
                    dispatch(changeGroupStatus(data.status));
                    dispatch(getGroupDetailData(data));
                } else {
                    failCallBack();
                    showAlert = alert('提示', '数据为空', [
                        {
                            text: '确定', onPress: () => {
                        }, style: {color: '#000000'}
                        },
                    ]);
                }

            } else {
                failCallBack();
                showAlert = alert('提示', response.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        }, (error) => {
            failCallBack();
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        });
    }
}

