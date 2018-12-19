/**
 * Created by Song on 2018/06/27
 * 投诉 提交反馈
 */

import * as types from "../actions/actionTypes";
import { Map, merge } from "immutable";

const initialState = Map({
  isShowLoading: false,
  orderNumber: "29876688765789", //订单编号
  reasons: [], //投诉原因列表
  select: false
});

let feedBackReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case types.REASON: {
      return state.merge({
        reasons: actions.reasons,
        select: false
      });
    }
    case types.SELECTREASON: {
      return state.merge({
        reasons: actions.data,
        select: true
      })
    }
    default:
      return state;
  }
};

export default feedBackReducer;
