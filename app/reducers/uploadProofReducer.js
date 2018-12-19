/**
 * Created by Song on 2018/07/12
 * 投诉 上传证据
 */

import * as types from "../actions/actionTypes";
import { Map, merge } from "immutable";

const initialState = Map({
  isShowLoading: false,
  orderNumber: "", //订单编号
  imgList: [], //图片列表
  text: '', //投诉文字
});

let uploadProofReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case types.ADDIMG: {
      return state.merge({
        imgList: [...imgList, action.data]
      });
    }
    case types.DELETEIMG: {
      return state.merge({
        imgList: [...imgList, action.data]
      })
    }
    case types.ADDTEXT: {
      return state.merge({
        text: actions.data,
      })
    }
    case types.SUBMITPROOF: {
      return state.merge({
      })
    }
    default:
      return state;
  }
};

export default uploadProofReducer;
