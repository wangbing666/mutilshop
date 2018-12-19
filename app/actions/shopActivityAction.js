/**
 * Created by chengjiabing on 17/11/28.
 *
 * 店铺活动
 */
import * as types from './actionTypes';
import * as db from '../../common/Apis/Utils';
import {post} from '../../common/Apis/Fetch'
import *as constants from '../../common/Apis/constants'
import {Modal} from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;
export let getShopActivityListPost = (array,index,pageSize,activityId,callBack) => { //获取店铺活动列表
    let data = {
        activityId:activityId,
        pageSize:pageSize,
        pageNow:index
    }
    return dispatch => {
        dispatch(showLoading(true));
        return post('/activity/activityGoodsGroups', data, (data) => {
            dispatch(showLoading(false));
            if (data.status === 0) {
                let dataList = data.body.groups;
                if(callBack){
                    callBack(dataList)
                }
                dispatch(getShopActivityList(array.concat(dataList)))
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
export let getShopActivityBannerPost = (activityId,callback) => { //获取店铺活动banner 活动id
    let data = {
        activityId:activityId
    }
    return dispatch => {
        dispatch(showLoading(true));
        return post('/activity/activityBanners', data, (data) => {
            dispatch(showLoading(false));
            if (data.status === 0) {
                constants.activityInfo={
                    title:data.body.title,
                    content:data.body.content,
                    imgUrl:data.body.fileUrl
                }
                let dic ={
                    templateId:data.body.templateId,
                    banners:data.body.banners
                }
                if(callback){
                    callback(data.body.title)
                }
                dispatch(getShopActivityBanner(dic))
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

export const showLoading = (isShow) => {

    return {
        type: types.SHOWLOADING,
        isShowLoading: isShow
    }
}

export const getShopActivityList = (list) => {
    return {
        type: types.SHOPACTIVITYLIST,
        list: list
    }
}
export const getShopActivityBanner = (dic) => {

    return {
        type: types.SHOPACTIVITYBANNER,
        dic: dic
    }
}
