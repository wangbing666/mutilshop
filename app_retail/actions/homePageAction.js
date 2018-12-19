/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
//请求单分类列表接口
export let getHomepageList = (homePageList,body,successCallback,failCallBack)=> {
    let url="/goods/getSingleGroupGoodsList";
    return dispatch => {
        return Util.post(url,body, (response) => {
            if(response.status===0){
                successCallback(response.status,response.body.goodsList);
                let goods=response.body.goodsList;
                if(goods.length===0){

                }else {
                    for(let i=0;i<goods.length;i++){
                        homePageList.push(goods[i]);
                    }
                }
                dispatch(listOfGoods(body.pageNow==1?goods:homePageList));
            }else{

            }
        }, (error) => {
            failCallBack(error);
        });
    }
};
//加载动画
let showLoading=(bool)=>{
    return{
        type:types.HOMEPAGE_IS_SHOW_LOADING,
        isShowLoading:bool
    }
};
//首页列表数据
export let listOfGoods=(data)=>{
    return{
        type:types.HOMEPAGE_LIST_OF_GOODS,
        listOfGoods:data
    }
};
//
export let getShopSubInfoPost=(shopId,successCallback,failCallBack)=>{//获取分销店简要信息
    let dic={
        shopId:shopId
    }
    let url = '/cloudShop/getDisShopInfo'
    return dispatch => {
        return Util.post(url,dic,(response) => {
            
            if(response.status===0){
                dispatch(getShopSubInfo(response.body.shopBaseInfo))
            }
        },(error) => {

        })
    }
};
let getShopSubInfo =(data)=>{
    return{
        type:types.HOMEPAGE_SHOPDES,
        shopData:data
    }
};
//获取分组名称列表
export let groupingNameList=(shopId,successCallback,failCallBack)=>{
    let body = {
        shopId:shopId
    }
    let url = '/shopPartition/listShopGroupName'
    return dispatch => {
        return Util.post(url,body,(response) => {
            if(response.status===0){
                let list = response.body.shopGroupList;
                list.splice(0,0,{groupId:null, groupName: "全部"})
                dispatch(groupingName(list));
            }
        },(error) => {

        })
    }
};
//分组名称Data
let groupingName =(data)=>{
    return{
        type:types.GROUPING_NAME_LIST,
        groupingNameData:data
    }
};

//店铺是否冻结
export let isShopFrozen = (url, callback) => {
    return dispatch => {
        Util.get(url, (res) => {
            // console.log(res)
            dispatch({
                type: types.IS_SHOP_FROZEN,
                isShopFrozen: res.body.result
            })
        }, (err) => {
            console.log(err)
        })
    }
}
