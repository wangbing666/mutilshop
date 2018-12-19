/**
 * Created by nipeng on 2017/11/28.
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
        type:types.PPSTORYDETAILSLOADING,
        isShowLoading:bool
    }
}

let getStoryDetails=(list)=>{
    return{
        type:types.PPSTORYDETAILSDIC,
        storyDetails:list
    }
}



// 获取商品故事详情接口
export const getStoryDetailsPost = (dicData,callBack)=>{

    let  url = "/goodsStory/getGoodsStory"
    console.log('1');
    return dispatch =>{
        dispatch(showLoading(true))
        return  Util.post(url,dicData,(response)=>{
            dispatch(showLoading(false))
            if (response.status===0){
                console.log(response);
                dispatch(getStoryDetails(response.body.response))
                callBack(response.body.response)
                dispatch(setStoryDetailsArray(response.body.response.details))
                dispatch(setCommontNumber(response.body.response.commentNumber))
                dispatch(setLoveStatus(response.body.response.islike===0?false:true,Number(response.body.response.likeNumber)))
            }else {
                dispatch(getStoryDetails({}))
                dispatch(setStoryDetailsArray([]))
            }
        },(error)=>{
            dispatch(showLoading(false))
            console.log(error)
            dispatch(getStoryDetails({}))
            dispatch(setStoryDetailsArray([]))
        })
    }
}

let setCommontNumber = (commontNumber)=>{
    return{
        type:types.PPSTORYCOMMONTNUMBER,
        commontNumber:commontNumber
    }
}


// 改变喜欢状态
let setLoveStatus =(bool,likeNumber)=>{
    return{
        type:types.PPSTORYSETLOVE,
        isLove:bool,
        isLikeNumber:likeNumber
    }
}


let setStoryDetailsArray = (list)=>{
    return{
        type:types.PPSTORYDETAILSARRAY,
        storyDetailsArray:list
    }
}

// 喜欢接口
export const getLovePost = (dicData,isLikeNumber,callBack)=>{

    let  url = "/goodsStory/likeGoodsStory"
    console.log('2');
    return dispatch =>{
        // dispatch(showLoading(true))
        return  Util.post(url,dicData,(response)=>{
            // dispatch(showLoading(false))
            if (response.status===0){

                console.log(response);
                callBack(true);
                if(dicData.type===1){
                    dispatch(setLoveStatus(true,isLikeNumber+1));
                }else {
                    dispatch(setLoveStatus(false,isLikeNumber-1));
                }
            }else {


                console.log(response)

            }
        },(error)=>{
            // dispatch(showLoading(false))
            console.log(error)

        })

    }
}





// 评价接口


export const getCommontPost = (dicData,commontNumber,callBack)=>{

    let  url = "/goodsStory/commentGoodsStory"
    // console.log('3');
    return dispatch =>{
        dispatch(showLoading(true))
        return  Util.post(url,dicData,(response)=>{
            dispatch(showLoading(false))
            if (response.status===0){

                dispatch(setCommontNumber(commontNumber+1))
                callBack(true)
                console.log(response.body.commentId) // 评论id


            }else {

                console.log(response)

            }
        },(error)=>{

            dispatch(showLoading(false))
            console.log(error)



        })

    }
}



