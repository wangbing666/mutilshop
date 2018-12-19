/**
 * Created by nipeng on 2017/7/8.
 * 登陆action
 */

import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import * as db from '../../common/Apis/Utils';
import {Modal} from 'antd-mobile';
const alert = Modal.alert;

let setUserId =(userId)=>{
    return{
        type:types.LOGINBUITON,
        userId:userId
    }
}

/*点击登陆*/
export let loginButtonPost = (url,body,phone,successCallBack,failCallBack)=>{
    console.log('切尔奇无')
    return dispatch =>{
        dispatch(showLoading(true))
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false))
            console.log(response);
            if(response.status==0){
                let tempDic = response.body;
                tempDic.user_id = tempDic.userId;
                tempDic['moblie'] = phone;
                tempDic.userId = tempDic.wedoId;// cheng
                db.saveUserId(tempDic);
                console.log(db.readUserInfo()+'登陆')
                successCallBack(response.body.wedoId);
                dispatch(setUserId(response.body.userId))
            }else {
                alert(response.msg);
                failCallBack();
            }
        },(error)=>{
            dispatch(showLoading(false));
            alert('登录失败');
            failCallBack();
        })


    }
};

/*点击验证码*/
export let geterificationPost = (url,body,successCallBack,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true));
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false));
            console.log(response);
            if (response.status==0){
                successCallBack();
                //alert(response.msg);//待删
                dispatch(setCodeString(response))
            }else {
                alert(response.msg);
                failCallBack();
            }
        },(error)=>{
            console.log(error);
            failCallBack();
            alert("获取验证码失败");
            dispatch(showLoading(false))
        })

    }
}
//加入购物袋
export let addShopCart = (url,body,successCallback,FailCallBack)=> {
    return dispatch => {

        dispatch(showLoading(true));

        return Util.post(url,body, (response) => {
            console.log(response)
            dispatch(showLoading(false));
            if(response.status===0){
                successCallback();
            }else{
                FailCallBack(response.msg);
            }
        }, (error) => {

            FailCallBack(error);
            dispatch(showLoading(false))
        });
    }
};

// 加载动画
let showLoading=(bool)=>{
    return{
        type:types.LOGINBUITONLOADING,
        isShowLoading:bool
    }
}



let setCodeString=(code)=>{
    return {
        type:types.SETCODESTRING,
        checkCode:code
    }
}
// 收藏/取消商品  body={userId:用户id,goodsId:商品id,isCollection:收藏操作:1收藏 0取消} url =/goods/collectGoods
export let collectOrcancel = (url,body,successCallback,failCallBack)=>{
    return dispatch =>{
        dispatch(showLoading(true));
        return Util.post(url,body,(response)=>{
            dispatch(showLoading(false));
            if (response.status == 0){
                console.log(response)
                successCallback()
            }else {
                failCallBack()
            }
            alert(showAlert(body.isCollection,response.status));
        },(error) =>{
            failCallBack(error)
            dispatch(showLoading(false));
        });
    }
};

let showAlert = (int_Status,status)=>{
    let alertStr = "";
    if (int_Status == 1){
        if(status==0){
            alertStr = "收藏成功";
        }else {
            alertStr = "收藏失败";
        }
    }else {
        if(status==0){

            alertStr = "取消收藏成功";
        }else {
            alertStr = "取消收藏失败";
        }

    }
    return alertStr;
}




