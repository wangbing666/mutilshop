/**
 * Created by chenmao on 2017/7/6.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import { Modal } from 'antd-mobile';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import React,{Component} from 'react';
import * as contants from '../../common/Apis/constants'
const alert = Modal.alert;
export let showDialog = (result,type)=>{
    return {
        type:types.GET_GOOD_DETAILS,
        isShow:result,
        openType:type
    }
};

//请求商品详情
export let getGoodDetailsFromServer = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            // console.log('商品详情',response);
            if(response.status==0){
                successCallback(response.body);
                dispatch(receiveGoodDetails(response.body.goodsDetail))
                dispatch(isGroupGoods(response.body))
            }else{
                FailCallBack(response.msg);
            }
        }, (error) => {
            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

//代理该商品
export let agencyGoods = (url,body,successCallback,failCallback)=>{
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            successCallback(response)
        }, (error) => {
            dispatch(showLoading(false))
            failCallback(error)
        });
    }
}
//一键上架
export let putawayGoods = (url,body,successCallback,failCallback)=>{
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            successCallback(response)
        }, (error) => {
            dispatch(showLoading(false))
            failCallback(error)
        });
    }
}

//商品下架
export let soldOutGoods = (url,body,successCallback,failCallback)=>{
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            successCallback(response)
        }, (error) => {
            dispatch(showLoading(false))
            failCallback(error)
        });
    }
}

//取消商品代理
export let cancelAgencyGoods = (url,body,successCallback,failCallback)=>{
    return dispatch => {
        dispatch(showLoading(true));
        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            successCallback(response)
        }, (error) => {
            dispatch(showLoading(false))
            failCallback(error)
        });
    }
}

let showLoading=(bool)=>{
    return{
        type:types.IS_SHOW_LOADING,
        isShowLoading:bool
    }
};

export let receiveGoodDetails=(goodInfo)=>{
    return{
        type:types.RECEIVE_GOOD_DETAILS,
        goodInfo:goodInfo
    }
};

export let isGroupGoods=(groupGoods)=>{
    return{
        type:types.IS_GROUP_GOODS,
        groupGoods:groupGoods
    }
}



//获取商品规格组合价格
export let getGoodSpecificationPrice = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {
        dispatch(showLoading(true));

        return Util.post(url,body,(response) => {
            dispatch(showLoading(false));
            if(response.status==0){
                successCallback(response.body);
                dispatch(receiveGoodSpecification(response.body))
            }else{
                contants.alertInstance=alert('提示', response.msg, [
                    { text: '确定', onPress: () =>{}, style: 'default' },
                ]);
                FailCallBack(response.msg);
            }
        }, (error) => {
            contants.alertInstance=alert('提示', '网络失败', [
                { text: '确定', onPress: () =>{}, style: 'default' },
            ]);
            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

let receiveGoodSpecification=(data)=>{
    return{
        type:types.RECEIVE_GOOD_SPECIFICATION,
        goodSpecification:data
    }
};

export let showPictureBrowse=(data)=>{
    return{
        type:types.SHOW_PICTURE_BROWSE,
        showPictureB:data
    }
}


//加入购物袋
export let addCart = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {

        dispatch(showLoading(true));

        return Util.post(url,body, (response) => {
            // console.log(response)
            dispatch(showLoading(false));
            if(response.status==0){
                successCallback();
            }else{
                contants.alertInstance=alert('提示', response.msg, [
                    { text: '确定', onPress: () =>{}, style: 'default' },
                ]);
                FailCallBack(response.msg);
            }
        }, (error) => {
            contants.alertInstance=alert('提示', '网络失败', [
                { text: '确定', onPress: () =>{}, style: 'default' },
            ]);
            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

// 收藏/取消商品  body={userId:用户id,goodsId:商品id,isCollection:收藏操作:1收藏 0取消} url =/goods/collectGoods
export let collectOrcancel = (url,body,successCallback,failCallBack)=>{
    return dispatch =>{

        return Util.post(url,body,(response)=>{

            // if (response.status == 0){
            //     console.log(response)
                successCallback(body.isCollection,response.status)
            // }else {
            //     failCallBack(body.isCollection,response.status)
            // }
            // Toast.info(<div className="alertStyleS">{body.isCollection===1?<img src={require('../images/goodDetails/collectIcon.png')}/>:<img src={require('../images/goodDetails/canceCollectIcon.png')}/>}<p>{showAlert(body.isCollection,response.status)}</p></div>, 1000)

        },(error) =>{
            failCallBack(error)
            
        });
    }
};

export let getGoodTypeServer = (url,body,successCallback,failCallBack)=>{
    return dispatch =>{
        return Util.post(url,body,(response)=>{
            if (response.status == 0){
                dispatch(getGoodType(response.body));
                successCallback(response.body)
            }else {
                failCallBack(response.msg)
            }
        },(error) =>{
            failCallBack(error)
        });
    }
};

let getGoodType=(data)=>{
    return{
        type:types.GET_GOODTYPE_SERVER,
        grayArr:data
    }
};



