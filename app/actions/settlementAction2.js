/**
 * Created by AndyWang on 2017/7/8.
 */
//获取商品规格组合
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import { Modal } from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
const alert = Modal.alert;
export let goToPay = (url,body,successCallback,FailCallBack)=> {
    url=Util.commonUrl+"/webOrder/createOrder";
    return dispatch => {
        dispatch(showLoading(true));

    return  $.ajax({
                type: "POST",
                url: url,
                data: body,
                dataType: "json",
                contentType:'application/json',
                timeout: 5000, // 设置超时时间
                cache: false,
                beforeSend: function(xhr) {},
                success: function(response) {
                    if(response.status==0){
                        successCallback(response.body);
                        dispatch(receivePayResult(response.body))
                    }else{
                        contants.alertInstance=alert('提示', response.msg, [
                            { text: '确定', onPress: () =>{}, style: 'default' },
                        ]);
                        FailCallBack(response.msg);
                    }
                    dispatch(showLoading(false));
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                let responseDic = XMLHttpRequest.responseJSON;
                dispatch(showLoading(false));
                },
                complete: function(XMLHttpRequest, status) {
                if (status == "timeout") {
                    xhr.abort(); // 超时后中断请求
                    failCallback("网络失败");
                }
                }
          });

        // return Util.post(url,body,(response) => {
            
        //     dispatch(showLoading(false));
        //     if(response.status==0){
        //         successCallback(response.body);
        //         dispatch(receivePayResult(response.body))
        //     }else{
        //         contants.alertInstance=alert('提示', response.msg, [
        //             { text: '确定', onPress: () =>{}, style: 'default' },
        //         ]);
        //         FailCallBack(response.msg);
        //     }
        // }, (error) => {
        //     contants.alertInstance=alert('提示', '网络失败', [
        //         { text: '确定', onPress: () =>{}, style: 'default' },
        //     ]);
        //     FailCallBack(error);
        //     dispatch(showLoading(false))
        // },a,b,'application/json');
    }
};

let showLoading=(bool)=>{
    return{
        type:types.ORDER_IS_SHOW_LOADING,
        isShowLoading:bool
    }
};

let receivePayResult=(orderInfo)=>{
    return{
        type:types.RECEIVE_PAY_RESULT,
        orderInfo:orderInfo
    }
}
//获取默认地址
export let defaultAddress= (url,body,successCallback,failCallBack)=> {
    return dispatch => {
        return Util.post(url,body, (response) => {
            
            if(response.status===0){
                if(response.body.listadress.length===0){
                    
                    dispatch(defaultAddressData(null));
                }else {
                    for(let i=0;i<response.body.listadress.length;i++){
                        if(response.body.listadress[i].isdefault===1){
                            dispatch(defaultAddressData(response.body.listadress[i]));
                        }
                    }
                }
            }else {
                
                dispatch(defaultAddressData(null));
            }
        }, (error) => {

        });
    }
};
//默认地址
export let defaultAddressData=(data)=>{
    return{
        type:types.SETTLEMENT_DEFAULT_ADDRESS,
        defaultAddress:data
    }
};
//选择地址
export let selectAddress=(data)=>{
    return{
        type:types.SETTLEMENT_SELECT_ADDRESS,
        selectAddress:data
    }
};

