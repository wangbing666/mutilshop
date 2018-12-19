/**
 * Created by JieLi on 2017/7/6.
 */
import * as types from './actionTypes';
import {post} from '../../common/Apis/Fetch';
export let getAddressListAct = (result)=>{
    return {
        type: types.GET_ADDRESS_LIST,
        addressList: result
    }
};


export let defultAddress = (data)=>{

    return{
        type:types.CHANGE_DETAIL_ADDRESS,
        addressList:data
    }
}

export let showActivityIndicator = (isShow)=>{

    return{
        type:types.ISSHOWACTIVITY,
        isShow:isShow
    }

}

export let deleteAddress = (data)=>{
    return{
        type:types.DELETE_RECEIPT_ADDRESS,
        addressList:data
    }
}

//获取地址列表
export const getAddressListData=(url,data)=>{
    return dispatch=>{
        dispatch(showActivityIndicator(true))
        return post(url,data,(response)=>{
            dispatch(showActivityIndicator(false))
            dispatch(getAddressListAct(response.body.listadress));
            console.log(response)
        },(error)=>{
            dispatch(showActivityIndicator(false))
            console.log(error)
        });
    }
}
//更改默认地址
export const changeDetailAddress=(url,requireData,data)=>{
    return dispatch=>{
        dispatch(showActivityIndicator(true))
        return post(url,requireData,(response)=>{
            dispatch(showActivityIndicator(false))
            console.log(response)
            dispatch(defultAddress(data));
        },(error)=>{
            dispatch(showActivityIndicator(false))
            console.log(error)
        });
    }
}

//删除地址
export const deleteReceiptAddress=(url,requireData,data)=>{

    return dispatch=>{
        dispatch(showActivityIndicator(true))
        return post(url,requireData,(response)=>{
                dispatch(showActivityIndicator(false))
            console.log(response)
            dispatch(deleteAddress(data));
        },(error)=>{
            dispatch(showActivityIndicator(false))
            console.log(error)
        });
    }
}

