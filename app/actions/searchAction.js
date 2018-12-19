/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';


//请求商品列表接口
export let popularSearches = (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            //console.log(response);
            if(response.status===0){
                dispatch(popularSearchesData(response.body.lists))
            }
        }, (error) => {

        });
    }
};
//热门搜索列表
let popularSearchesData=(data)=>{
    return{
        type:types.SEARCH_POPULAR_SEARCHES,
        popularSearches:data
    }
};
//搜索商品列表
export let searchForProducts = (searchForData,url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            
            if(response.status===0){
                dispatch(searchResults(true));
                console.log(searchForData);
                successCallback(response.body.list);
                if(response.body.list.length===0){

                }else {
                    for(let i=0;i<response.body.list.length;i++){
                        searchForData.push(response.body.list[i]);
                    }
                    dispatch(searchForProductsData(searchForData))
                }
            }
        }, (error) => {
            failCallBack(error);
        });
    }
};
//商品列表
export let searchForProductsData=(data)=>{
    console.log('search data is '+data.length)
    return{
        type:types.SEARCH_FOR_PRODUCTS,
        searchForProducts:data
    }
};
//商品列表
export let searchResults=(bool)=>{
    return{
        type:types.SEARCH_RESULTS,
        searchResults:bool
    }
};
//添加搜索历史
export let addSearchCommodity=(searchText,successCallback)=>{
    return dispatch => {
        let historicalS=JSON.parse(localStorage.getItem("historicalSearch"));
        let search=[];
        if(historicalS==null){
            // console.log("1");
            let searchName={"searchName":searchText};
            search.push(searchName);
        }else {
            let searchName={"searchName":searchText};
            search.push(searchName);
            console.log(historicalS);
            var Snumber=8;
            for (let i=0;i<historicalS.length;i++){
                if(historicalS[i].searchName==searchText||i>Snumber){
                    Snumber=Snumber+1;
                }else {
                    search.push(historicalS[i]);
                }
            }
        }
        localStorage.setItem("historicalSearch", JSON.stringify(search));
        successCallback();
    }
};
//获取历史搜索记录
export let historyList=()=>{
    return dispatch => {
        let historicalS=JSON.parse(localStorage.getItem("historicalSearch"));
        if(historicalS===null){
            dispatch(historicalSData([]));
        }else {
            dispatch(historicalSData(historicalS));
        }
    }
};
//历史记录列表
let historicalSData=(data)=>{
    return{
        type:types.SEARCH_HISTORY_LIST,
        historicalS:data
    }
};