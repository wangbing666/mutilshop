/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';

//获取商品列表
export let getGoodsList = (linkId, linkType, classId, sortRule) => {
  let url =
    '/cloudGoods/getHomePageGoodsList?linkId=' +
    linkId +
    '&linkType=' +
    linkType +
    '&classifyTitleId=' +
    classId +
    '&sortRule=' +
    sortRule;
  return (dispatch) => {
    return Util.get(
      url,
      (response) => {
        if (response.status === 0) {
          dispatch(commodityListData(response.body.goodsListInfo));
        }
      },
      (error) => {
        console.log('获取商品列表失败', error);
      },
    );
  };
};

//获取店铺列表
export let getShopList = (linkId, linkType, classifyId, sortRule) => {
  let url =
    '/cloudShop/getHomePageShopList?linkId=' +
    linkId +
    '&linkType=' +
    linkType +
    '&classifyTitleId=' +
    classifyId +
    '&sortRule=' +
    sortRule;
  return (dispatch) => {
    return Util.get(
      url,
      (response) => {
        //   console.log("------",response);
        if (response.status === 0) {
          dispatch(commodityListData(response.body.shopListInfo));
        }
      },
      (error) => {
        console.log('获取店铺列表失败', error);
      },
    );
  };
};

// export let commodityListData=(data)=>{
//         return{
//             type:types.COMMODITY_LIST,
//             commodityList:data
//         }
//     };

//请求获取单类商品列表
export let commodityList = (GoodsList, body, successCallback, failCallBack) => {
  //GoodsList数组list
  let url = '/shopping/btaingroup';
  return (dispatch) => {
    return Util.post(
      url,
      body,
      (response) => {
        successCallback(response.body.goodsList.list);
        if (response.status === 0) {
          if (response.body.goodsList.list.length === 0) {
          } else {
            for (let i = 0; i < response.body.goodsList.list.length; i++) {
              GoodsList.push(response.body.goodsList.list[i]);
            }
            dispatch(
              commodityListData(
                body.pageIndex == 1 ? response.body.goodsList.list : GoodsList,
              ),
            );
          }
        }
      },
      (error) => {},
    );
  };
};
export let commodityListData = (data) => {
  return {
    type: types.COMMODITY_LIST,
    commodityList: data,
  };
};
//分组详情
export const groupingDetails = (url, body, successCallback, failCallBack) => {
  return (dispatch) => {
    return Util.post(
      url,
      body,
      (response) => {
        dispatch(groupingDetailsData(response.body.shopPartitionList));
      },
      (error) => {},
    );
  };
};
export let groupingDetailsData = (data) => {
  return {
    type: types.GROUPING_DETAILS,
    groupingDetailsData: data,
  };
};

//获取云仓分区信息
export const getPartionInfoPost = (
  partitionId,
  successCallback,
  failCallBack,
) => {
  let dic = {
    partitionId: partitionId,
  };
  return (dispatch) => {
    let url = '/shopPartition/partiontionInfo';
    return Util.post(
      url,
      dic,
      (response) => {
        dispatch(getPartionInfo(response.body.partitionInfo));
      },
      (error) => {},
    );
  };
};
export let getPartionInfo = (data) => {
  return {
    type: types.CLOUND_DEPARTION,
    partitionInfo: data,
  };
};

//获取云仓分区列表接口
export const getPartionListPost = (
  GoodsList,
  partitionId,
  pageNow,
  pageSize,
  successCallback,
  failCallBack,
) => {
  let dic = {
    partitionId: partitionId,
    pageNow: pageNow,
    pageSize: pageSize,
  };
  let url = '/shopPartition/listEnterprisePartitionGoods';
  return (dispatch) => {
    return Util.post(
      url,
      dic,
      (response) => {
        successCallback(response.body.goodsList);
        if (response.status === 0) {
          if (response.body.goodsList.length === 0) {
          } else {
            for (let i = 0; i < response.body.goodsList.length; i++) {
              GoodsList.push(response.body.goodsList[i]);
            }
            dispatch(commodityListData(GoodsList));
          }
        }
      },
      (error) => {},
    );
  };
};
