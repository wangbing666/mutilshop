/**
 * Created by AndyWang on 2017/7/8.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';

//请求红包明细接口
export let redPacketDetail = (url, body, successCallback, failCallBack) => {
  return (dispatch) => {
    return Util.post(
      url,
      body,
      (response) => {
        if (response.status === 0) {
          dispatch(redPacketDetailData(response.body));
        }
      },
      (error) => {},
    );
  };
};

let redPacketDetailData = (data) => {
  return {
    type: types.RED_PACKET_DETAIL,
    orderStatusNumber: data,
  };
};

