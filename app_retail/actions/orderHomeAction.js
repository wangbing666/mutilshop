/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';

//请求获取订单状态个数
export let orderNumber= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            if(response.status===0){
                dispatch(orderNumberData(response.body));
            }
        }, (error) => {

        });
    }
};
//订单状态个数
let orderNumberData=(data)=>{
    return{
        type:types.ORDER_GET_NUMBER,
        orderStatusNumber:data
    }
};