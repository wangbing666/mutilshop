/**
 * Created by XiaYongjie on 2017/7/12.
 *
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import { Modal } from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;

let orderList = [
  {
    orderId: 12800,
    orderNo: '20180322102316477',
    status: 1,
    amount: '11.0',
    orderNum: 1,
    transportNo: null,
    logisticsId: null,
    logisticsName: null,
    logisticsCode: null,
    createTime: '2018-3-22 09:10:27',
    userId: 12491959,
    userHeadFile:
      'http://192.168.9.81/resources/QmUhMvGfLJ8q2ue2sCzuir9FZ8dKo7pRQCXK6rEkkyiXB1.jpeg',
    userNickName: '汪小明',
    proxyMoney: 0.1,
    isProxySale: 1,
    proxyUserId: 12491959,
    proxyUserName: '汪小明',
    proxyUserLogo:
      'http://192.168.9.81/resources/QmUhMvGfLJ8q2ue2sCzuir9FZ8dKo7pRQCXK6rEkkyiXB1.jpeg',
    orderSonId: 2210,
    orderSonIdStr: '2210',
    shopId: 1084,
    remark: null,
    billType: null,
    payAmount: 1,
    proxyUserNo: 'U10000169',
    orderSonStatus: null,
    saletype: null,
    groupOrder: 1,
    orderType: 1,
    groupOrderStatus: null,
    goods: [
      {
        goodsId: 10249,
        goodsName: '表情包一号',
        anotherName: '11',
        combinationId: 4199,
        param1: null,
        param2: null,
        param3: null,
        goodsPrice: 11,
        goodsNum: 1,
        fileId: 11584,
        hostUrl: 'http://192.168.9.81',
        fileUrl:
          '/resources/QmPPwdyN47BkwgB6CpGVd3YVUon77H9RK6z1e3r9WxVt9d.jpeg',
        zoomUrl: null,
        goodStatus: 1,
        transportNo: null,
        logisticsId: null,
        logisticsName: null,
        logisticsCode: null,
        shareMoney: 0.1,
        transportType: 1,
        enterpriseShopId: 1119,
        status: 4,
        saleType: null,
        groupOrder: 1,
        specifications: [
          {
            type: '2',
            name: '质量（克）',
          },
          {
            type: '大小',
            name: '大小',
          },
          {
            type: '颜色',
            name: '蓝色',
          },
        ],
        name1: '质量（克）',
        name2: '大小',
        name3: '蓝色',
        type1: '2',
        type2: '大小',
        type3: '颜色',
        fileId1: 11584,
        fileId2: 11586,
        fileId3: 11587,
        goodFile: null,
        backGoods: null,
      },
    ],
  },
];
//获取订单列表
/**
 *
 * @param array 当前数组
 * @param userId 用户id
 * @param type   获取类型
 * @param pageSize
 * @param pageIndex
 * @param successCallback
 * @param failCallBack
 * @returns {function(*)}
 */
export let getOrderList = (
  array,
  userId,
  type,
  pageSize,
  pageIndex,
  keyWord,
  shopId,
) => {
  let body = {
    userId: userId,
    type: type,
    pageSize: pageSize,
    pageIndex: pageIndex,
    roleType: 3,
    orderNo: keyWord,
    goodsName: keyWord,
    shopId: shopId
  };
  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/webOrder/getWebOrderList',
      body,
      (response) => {
        if (response.status == 0) {
          let resList = [];
          if (
            response.body.orderList !== null &&
            response.body.orderList instanceof Array
          ) {
            resList = response.body.orderList;
          }
          let getAry = [...array, ...resList];
          let total = response.body.totalNum;
          let hasMore = pageSize * pageIndex >= total ? false : true;
          if (type === 1) {
            dispatch(getPendPaymentList(getAry, hasMore, pageIndex));
          } else if (type === 2) {
            dispatch(getToBeReceivedList(getAry, hasMore, pageIndex));
          } else if (type === 3) {
            dispatch(getCompletedList(getAry, hasMore, pageIndex));
          } else {
            dispatch(getAllList(getAry, hasMore, pageIndex));
          }
        } else {
          console.log('请求订单列表error', response);
        }
        dispatch(showLoading(false));
      },
      (error) => {
        dispatch(showLoading(false));
        console.log('请求订单列表error', error);
      },
    );
  };
};

/**
 *
 * @param orderId
 * @param operation
 * @param userId
 * @param ary1（删除订单ary1 只代表已完成订单，取消订单 ary1只代表待支付列表）
 * @param ary2 （只代表已完成订单）
 * @param type （1待支付，2待收货，3已完成，4，全部）
 * @returns {function(*)}
 */
export let deleteOrCancelOrderPost = (
  orderId,
  rowIndex,
  operation,
  userId,
  ary1,
  ary2,
  callBack,
) => {
  //删除 取消 订单 operation (1:删除，2：取消)

  let body = {
    orderId: orderId,
    operation: operation,
  };
  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/webOrder/cancelOrDeleteOrder',
      body,
      (response) => {
        dispatch(showLoading(false));
        if (response.status == 0) {
          if (callBack !== undefined && callBack !== null) {
            callBack();
          }
          if (operation === 1) {
            //删除订单之后
            if (rowIndex > -1) ary1.splice(rowIndex, 1);
            dispatch(getCompletedList(ary1));
            if (ary2 && ary2.length > 0) {
              for (let i = 0; i < ary2.length; i++) {
                let des = ary2[i];
                if (des.orderId === orderId) {
                  ary2.splice(i, 1);
                  dispatch(getAllList(ary2));
                  break;
                }
              }
            }
          } else if (operation === 2) {
            //取消订单后 改变响应数据源 （取消订单统一传值，）
            let i = 0;
            let dic = null;
            ary1.splice(rowIndex, 1);
            dispatch(getPendPaymentList(ary1));
            if (ary2 && ary2.length > 0) {
              for (let j = 0; j < ary2.length; j++) {
                let order = ary2[j];
                if (order.orderId === orderId) {
                  ary2[j].status = '6';
                  dispatch(getAllList(ary2));
                }
              }
            }
          }
        } else {
          showAlert = alert('提示', response.msg, [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
      },
      (error) => {
        dispatch(showLoading(false));
        showAlert = alert('提示', '网络失败', [
          {
            text: '确定',
            onPress: () => {},
            style: { color: '#9B885F' },
          },
        ]);
      },
    );
  };
};

export let makeSureReceptPost = (
  orderId,
  userId,
  ary,
  completedAry,
  allAry,
  orderDetail,
  successBack,
  cancleBack,
) => {
  //确认收货
  let body = {
    orderId: orderId,
    userId: userId,
  };

  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/webOrder/confirmReceive',
      body,
      (response) => {
        dispatch(showLoading(false));
        if (response.status === 0) {
          //成功
          showAlert = alert('提示', '确认收货成功', [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
          if (successBack !== undefined) {
            successBack();
          }
          if (orderDetail !== null) {
            for (let i = 0; i < orderDetail.orderSonList.length; i++) {
              if (orderDetail.orderSonList[i].orderId === orderId) {
                orderDetail.orderSonList[i].status = 4;
                break;
              }
            }

            dispatch(orderDetailRec(orderDetail));
          }
          // //改变数组中 订单状态
          // let i = 0;
          // let dic = null;
          // for (i = 0; i < ary.length; i++) {
          //     dic = ary[i];
          //     if (dic.orderId === orderId) {
          //         ary.splice(i, 1)
          //         dispatch(getToBeReceivedList(ary));
          //         break;
          //     }
          // }
          //确认收货添加已完成
          // dic.status = 4;
          // console.log('dic', dic)
          // if (completedAry && completedAry.length > 0) {
          //     completedAry.push(dic);
          //     dispatch(getCompletedList(completedAry))
          //     console.log('all ary' + completedAry.length)
          // }
          // let dix = null
          // //确认收货添加全部订单
          // let isHas = true;
          // if (allAry && allAry.length > 0) {
          //     for (let j = 0; j < allAry.length; j++) {
          //         if (allAry[j].orderId === orderId) {
          //             allAry[j].status = 4;
          //             dispatch(getAllList(allAry));
          //             isHas = false;
          //             break;
          //         }
          //     }
          //     if (isHas) {
          //         allAry.push(dic);
          //         dispatch(getAllList(allAry))
          //         console.log('all ary' + allAry.length)
          //     }
          //}
        } else {
          if (cancleBack) {
            cancleBack();
          }
          showAlert = alert('提示', response.msg, [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
      },
      (error) => {
        if (cancleBack) {
          cancleBack();
        }
        dispatch(showLoading(false));
        showAlert = alert('提示', '网络失败', [
          {
            text: '确定',
            onPress: () => {},
            style: { color: '#9B885F' },
          },
        ]);
      },
    );
  };
};

/**
 *
 * @param orderId
 * @param operation
 * @param userId
 * @param ary1（删除订单ary1 只代表已完成订单，取消订单 ary1只代表待支付列表）
 * @param ary2 （只代表已完成订单）
 * @param type （1待支付，2待收货，3已完成，4，全部）
 * @returns {function(*)}
 */
export let deleteOrCancelOrder = (
  orderId,
  operation,
  userId,
  ary1,
  ary2,
  callBack,
) => {
  //删除 取消 订单 operation (1:删除，2：取消)
  let body = {
    orderId: orderId,
    operation: operation,
    userId: userId,
  };

  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/webOrder/cancelOrDeleteOrder',
      body,
      (response) => {
        dispatch(showLoading(false));

        if (response.status == 0) {
          if (callBack !== undefined && callBack !== null) {
            callBack();
          }
          if (operation === 1) {
            //删除订单之后
            for (let i = 0; i < ary1.length; i++) {
              let dic = ary1[i];
              if (dic.orderId === orderId) {
                ary1.splice(i, 1);
                dispatch(getCompletedList(ary1));
                break;
              }
            }
            if (ary2 && ary2.length > 0) {
              for (let i = 0; i < ary2.length; i++) {
                let des = ary2[i];
                if (des.orderId === orderId) {
                  ary2.splice(i, 1);
                  dispatch(getAllList(ary2));
                  break;
                }
              }
            }
          } else if (operation === 2) {
            //取消订单后 改变响应数据源 （取消订单统一传值，）
            let i = 0;
            let dic = null;
            for (i = 0; i < ary1.length; i++) {
              dic = ary1[i];
              if (dic.orderId === orderId) {
                ary1.splice(i, 1);
                dispatch(getPendPaymentList(ary1));
                break;
              }
            }
            if (ary2 && ary2.length > 0) {
              for (let j = 0; j < ary2.length; j++) {
                let order = ary2[j];
                if (order.orderId === orderId) {
                  ary2[j].status = '6';
                  dispatch(getAllList(ary2));
                }
              }
            }
          }
        } else {
          showAlert = alert('提示', response.msg, [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
      },
      (error) => {
        dispatch(showLoading(false));
        showAlert = alert('提示', '网络失败', [
          {
            text: '确定',
            onPress: () => {},
            style: { color: '#9B885F' },
          },
        ]);
      },
    );
  };
};
//获取订单详情
export let getOrderDetail = (
  userId,
  orderId,
  orderSonId,
  successCallback,
  failCallBack,
) => {
  let body = {
    userId: userId,
    orderId: orderId,
    roleType: 3,
    orderSonId: orderSonId,
  };

  // console.log("获取订单详情",JSON.stringify(body));
  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/webOrder/getWebOrderDetail',
      body,
      (response) => {
        dispatch(showLoading(false));

        if (response.returnStatus == 0) {
          dispatch(orderDetailRec(response));
          successCallback(response);
        } else {
          failCallBack(response);
          showAlert = alert('提示', response.msg, [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
      },
      (error) => {
        failCallBack(error);
        dispatch(showLoading(false));
        showAlert = alert('提示', '网络失败', [
          {
            text: '确定',
            onPress: () => {},
            style: { color: '#9B885F' },
          },
        ]);
      },
    );
  };
};
//再次购买post
export let buyAgainWithOrder = (userId, goodsAry, shopId, callBack) => {
  let shopList = [];
  for (let i = 0; i < goodsAry.length; i++) {
    let dic = {
      goodsId: goodsAry[i].goodsId,
      shopId: shopId,
      number: goodsAry[i].goodsNum,
      param1: goodsAry[i].param1,
      param2: goodsAry[i].param2,
      param3: goodsAry[i].param3,
    };
    shopList[i] = dic;
  }
  let body = {
    userId: userId,
    shopList: JSON.stringify(shopList),
  };

  return (dispatch) => {
    dispatch(showLoading(true));
    return Util.post(
      '/shopping/insertshop',
      body,
      (response) => {
        dispatch(showLoading(false));
        if (response.status == 0) {
          //加入购物袋成功
          if (callBack) callBack();
        } else {
          showAlert = alert('提示', response.msg, [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
      },
      (error) => {
        dispatch(showLoading(false));
        showAlert = alert('提示', '网络失败', [
          {
            text: '确定',
            onPress: () => {},
            style: { color: '#9B885F' },
          },
        ]);
      },
    );
  };
};
//设置Tab的type
export let setType = (type) => {
  return (dispatch) => {
    dispatch(tabType(type));
  };
};
/**
 * 清除Reducer的值
 * @param index （1 待付款，2，待收货，3，已完成，4，全部，5详情，6，ALL）
 * @returns {function(*)}
 */

export let clearn = (index) => {
  return (dispatch) => {
    dispatch(clearnData(index));
  };
};
export let hideAlert = () => {
  //弹框消失
  if (showAlert !== null) {
    showAlert.close();
  }
  return {
    type: types.CLEAR_ORDER_DETAIL_DATA,
    isShow: false,
  };
};
let clearnData = (index) => {
  return {
    type: types.CLEAR_ORDER_DETAIL_DATA,
    index: index,
  };
};

//设置initPage
export let setInitPage = (bool) => {
  return (dispatch) => {
    dispatch({
      type: types.IS_INIT_PAGE,
      isInit: bool,
    });
  };
};

export let isCanReFunds = (
  userId,
  orderId,
  orderStatus,
  sonOrderId,
  successCallback,
  errorCallback,
) => {
  let body = {
    orderId: sonOrderId,
    userId: userId,
  };

  let sonData = {
    orderId: sonOrderId,
  };

  return (dispatch) => {
    dispatch(showLoading(true));
    Util.post('/webOrder/isAfterSaleOverdue', sonData, (res) => {
      console.log(res, '返回数据');
      if (res.status === 0) {
        //商品未过保质期
        console.log(orderStatus);
        /* if(orderStatus === 4) {
                    return successCallback()
                }*/
        return Util.post(
          '/afterSale/applyReturn',
          body,
          (response) => {
            //可以申请退款
            dispatch(showLoading(false));

            if (response.status == 0) {
              //可以申请退款
              successCallback(response.body);
            } else {
              errorCallback();
              showAlert = alert('提示', response.msg, [
                {
                  text: '确定',
                  onPress: () => {},
                  style: { color: '#9B885F' },
                },
              ]);
            }
          },
          (error) => {
            errorCallback();
            dispatch(showLoading(false));
            showAlert = alert('提示', '网络失败', [
              {
                text: '确定',
                onPress: () => {},
                style: { color: '#9B885F' },
              },
            ]);
          },
        );
      } else {
        //商品已过保质期
        alert('您的订单已过售后保障日期，如有疑问，可联系平台客服。', '', [
          {
            text: '确定',
            onPress: () => {},
          },
        ]);
      }
    });
  };
};

let tabType = (type) => {
  return {
    type: types.TAB_TYPE,
    myTabType: type,
  };
};

let orderDetailRec = (detail) => {
  return {
    type: types.GET_ORDER_DETAIL_REACIVED,
    detail: detail,
  };
};

//加载动画
let showLoading = (bool) => {
  return {
    type: types.HOMEPAGE_IS_SHOW_LOADING,
    isShow: bool,
  };
};

let getPendPaymentList = (pendPaymentList, hasMore, pageIndex) => {
  return {
    type: types.GET_PEND_PAYMENT_LIST,
    pendPaymentList: pendPaymentList,
    hasMore: hasMore,
    pendPayIndex: pageIndex,
  };
};

let getToBeReceivedList = (toBeReceivedList, hasMore, pageIndex) => {
  return {
    type: types.GET_TO_BE_RECEIVED_LIST,
    toBeReceivedList: toBeReceivedList,
    hasMore: hasMore,
    toBeReceiveIndex: pageIndex,
  };
};
let getCompletedList = (completedList, hasMore, pageIndex) => {
  return {
    type: types.GET_COMPLETETED_LIST,
    completedList: completedList,
    hasMore: hasMore,
    completedIndex: pageIndex,
  };
};
let getAllList = (allList, hasMore, pageIndex) => {
  return {
    type: types.GET_ALL_LIST,
    allList: allList,
    hasMore: hasMore,
    allIndex: pageIndex,
  };
};
