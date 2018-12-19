/**
 * Created by Song on 2018/07/12
 * 投诉 上传证据
 */

import * as types from "./actionTypes";
import * as db from "../../common/Apis/Utils";
import { post } from "../../common/Apis/Fetch";
import * as constants from "../../common/Apis/constants";
import { Modal } from "antd-mobile";

// 添加图片
export let addImg = (url, data, callback) => {
  return dispatch => {
    post(
      url,
      data,
      res => {
        console.log(res);
        dispatch({
          type: types.ADDIMG
        });
      },
      err => {
        console.log(err);
      }
    );
  };
};

// 删除图片
export let deleteImg = (data) => {
  return dispatch => {
    dispatch({
      type: types.DELETEIMG
    });
  };
};

// 添加说明文字
export let addText = (data) => {
  return dispatch => {
    dispatch({
      type: types.ADDTEXT
    });
  };
};

//上传图片
export let uploadImg = (url, data, callback) => {
  return dispatch => {
    post(
      url,
      data,
      res => {
        console.log(res);
        dispatch({
          type: types.UPLOADIMG
        });
      },
      err => {
        console.log(err);
      }
    );
  };
};

// 提交证据
export let submitProof = (url, data, callback) => {
  return dispatch => {
    post(
      url,
      data,
      res => {
        console.log(res);
        dispatch({
          type: types.SUBMITPROOF
        });
      },
      err => {
        console.log(err);
      }
    );
  };
};
