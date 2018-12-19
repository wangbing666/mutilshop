/**
 * Created by chengjiabing on 17/11/24.
 */
import * as types from './actionTypes';
import * as db from '../../common/Apis/Utils';
import {post} from '../../common/Apis/Fetch'
import {Modal,} from 'antd-mobile';
const alert = Modal.alert;
let showAlert = null;
export let getCommentListPost = (array,pageSize,type,lastId,storyId,callBack) => { //获取数组列表
    let data = {
        pageSize:pageSize,
        lastId:lastId,
        type:type,
        storyId:storyId
    }
    return dispatch => {
        dispatch(showLoading(true));
        return post('/goodsStory/queryGoodsStoryComments', data, (data) => {
            dispatch(showLoading(false));
            if (data.status === 0) {
                let dataAry = data.body.comments;
                let allComNum = data.body.commentNumber;
                dataAry.map((item,i)=>{
                    array.push(item)
                })
                if(callBack){
                    if(dataAry.length>0){
                        console.log(dataAry.length)
                        callBack(dataAry[dataAry.length-1],array.length)
                    }
                    else{
                        callBack(null,array.length)
                    }
                }
                dispatch(getCommentList(array))
                dispatch(getCommentNumber(allComNum))
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

export let getCommentList=(ary)=>{
    return {
        type: types.COMMENTLIST,
        commentList: ary
    }
}
export let getCommentNumber=(allNumber)=>{//评价数量
    return {
        type: types.COMMENTNUMBER,
        allNumber: allNumber
    }
}


export const writeCommontPost = (dicData,callBack)=>{//写评论
    let  url = "/goodsStory/commentGoodsStory"
    return dispatch =>{
        return  post(url,dicData,(response)=>{
            if (response.status===0){
                callBack();
            }else {
                showAlert = alert('提示', data.msg, [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
        },(error)=>{
            showAlert = alert('提示', '网络失败', [
                {
                    text: '确定', onPress: () => {
                }, style: {color: '#000000'}
                },
            ]);
        })
    }
}




export let showLoading=(show)=>{
    return {
        type: types.SHOWLOADING,
        show: show
    }
}