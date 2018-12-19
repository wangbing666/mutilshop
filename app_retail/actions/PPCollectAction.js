/**
 * Created by nipeng on 2017/7/7.
 * 收藏列表action
 */

import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import { Modal } from 'antd-mobile';
const alert = Modal.alert;
/*收藏list*/
export let changeCollectList = (list)=>{
    return{
        type:types.COLLECT_LIST,
        collectList:list
    }
}

// 获取收藏列表
export let getCollectPost = (url,body,successCallBack,failCallBack)=> {
    console.log('获取收藏列表')
    return dispatch => {
        dispatch(showLoading(true))
        return Util.post(url, body, (response) => {
            dispatch(showLoading(false))
            if (response.status == 0) {
                successCallBack();
                console.log("dadada")
                console.log(response)
                dispatch(changeCollectList(response.body.result));
            } else {
                alert(response.msg);
                failCallBack();
            }
        }, (error) => {
            dispatch(showLoading(false))
            failCallBack();
            alert("获取收藏列表失败");

        })


    }
}


// 加载动画
let showLoading=(bool)=>{
    return{
        type:types.COLLECTLOADING,
        isShowLoading:bool
    }
}








