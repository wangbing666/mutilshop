/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';

//支付接口
export let payment= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            console.log(response);
            if(response.status===0){
                //successCallback(response.body);
                alert("付款成功");
            }
        }, (error) => {

        });
    }
};

export let transactionNumber= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            console.log(response);
            successCallback(response);
        }, (error) => {
            failCallBack(error);
        });
    }
};
//调用银生宝接口
export let CallPayment= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
           // console.log(response);
            successCallback(response);
        }, (error) => {
            failCallBack(error);
        });
    }
};
//加密
export const encryption= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            // console.log(response);
            successCallback(response);
        }, (error) => {
            failCallBack(error);
        });
    }
};

