/**
 * Created by Song on 2018/06/27
 * 投诉 提交反馈
 */
import * as types from "./actionTypes";
import * as db from "../../common/Apis/Utils";
import { post, get } from "../../common/Apis/Fetch";
import * as constants from "../../common/Apis/constants";
import { Modal } from "antd-mobile";

//获取投诉原因列表
export let getReasons = (url, callback) => {
  return dispatch => {
    get(
      url,
      res => {
 
        dispatch({
          type: types.REASON,
          reasons: res.body.result
        });
      },
      err => {
       
      }
    );
  };
};

//选择投诉对象
export let selectReason = (data) => {
  return dispatch => {
    dispatch({
      type: types.SELECTREASON,
      data
    })
  }
}

//提交投诉原因
export let addReason = (url, data, callback) => {
  return dispatch => {
    post(
      url,
      data,
      res => {
        console.log(res);
        dispatch({
          type: types.ADDREASON
        });
      },
      err => {
        console.log(err);
      }
    );
  };
};