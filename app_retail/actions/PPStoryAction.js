/**
 * Created by nipeng on 2017/11/23.
 */

import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import * as db from '../../common/Apis/Utils';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import { Modal } from 'antd-mobile';
const alert = Modal.alert;


// 加载动画
let showLoading=(bool)=>{
    return{
        type:types.PPSTORYLOADING,
        isShowLoading:bool
    }
}

let setStoryList =(list)=>{
    return{
        type:types.PPSTORYLIST,
        storyList:list
    }
}



// 获取商品故事列表
export const getStoryListPost = (dicData,callBack)=>{

    let  url = "/goodsStory/queryGoodsStorys"
    return dispatch =>{
        dispatch(showLoading(true))
        return  Util.post(url,dicData,(response)=>{
            dispatch(showLoading(false))
            if (response.status===0){
                console.log(response);

                callBack(true);
                dispatch(setStoryList(response.body.response))
            }else {
                dispatch(setStoryList([]))
            }
        },(error)=>{
            dispatch(showLoading(false))
            console.log(error)
            dispatch(setStoryList([]))
        })
    }
}


















