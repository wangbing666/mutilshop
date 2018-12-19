/**
 * Created by Song on 2018/06/27
 * 店铺介绍
 */
import * as types from './actionTypes';
import * as db from '../../common/Apis/Utils';
import { post, get } from '../../common/Apis/Fetch'
import * as constants from '../../common/Apis/constants'
import { Modal } from 'antd-mobile';

const isFocused = 0; //模拟后台返回数据

export let getShopInfo = (url, data, callback) => {
  return dispatch => {
    get(url, (res) => {
      callback(res.body.result);
      dispatch({
        type: types.SHOPINFO,
        shopBrief: res.body.result
      })
    }, (err) => {
      // console.log(err)
    })
  }
}

export let focus = (url, data, callback) => {
  return dispatch => {
    post(url, data, (res) => {
      // console.log(res)
      if(res.status === 0){
        callback()
      }
    })
  }
}

export let unfocus = (url, data, callback) => {
  return dispatch => {
    post(url, data, (res) => {
      // console.log(res)
      if(res.status === 0){
        callback()
      }
    })
  }
}

export const showLoading = (isShow) => {
  return {
    type: types.SHOWLOADING,
    isShowLoading: isShow
  }
}
