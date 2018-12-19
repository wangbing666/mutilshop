/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';


//请求商品列表接口
export let getHomepageList = (homePageList, body, successCallback, failCallBack) => {
  // console.log('shopPartition/listPartition')
  let url = "/shopPartition/listPartitions";
  return dispatch => {
    return Util.post(url, body, (response) => {
      // console.log("首页商品列表");
      dispatch(showLoading(false));
      if (response.status === 0) {
        successCallback(response.status, response.body.shopPartitionList.list);
        let goods = response.body.shopPartitionList.list;
        if (goods.length === 0) {
        } else {
          for (let i = 0; i < goods.length; i++) {
            homePageList.push(goods[i]);
          }
        }
        dispatch(listOfGoods(body.pageIndex == 1 ? goods : homePageList));
      } else {

      }
    }, (error) => {
      dispatch(showLoading(false));
      failCallBack(error);
    });
  }
};
//加载动画
let showLoading = (bool) => {
  return {
    type: types.HOMEPAGE_IS_SHOW_LOADING,
    isShowLoading: bool
  }
};
//首页列表数据
export let listOfGoods = (data) => {
  return {
    type: types.HOMEPAGE_LIST_OF_GOODS,
    listOfGoods: data
  }
};
//q请求获取首页banner图
export let bannerData = (shopId, body, successCallback, failCallBack) => {
  let url = '/dict/getbanners'
  let dic = {
    shopId: shopId
  }
  return dispatch => {
    return Util.post(url, dic, (response) => {
      dispatch(showLoading(false));
      if (response.status === 0) {
        dispatch(banner(response.body.shopbannerjson))
        dispatch(getShopName(response.body.shopName))
      }
    }, (error) => {
      dispatch(showLoading(false));
    })
  }
};
let getShopName = (shopName) => {
  return {
    type: types.SHOP_NAME,
    shopName: shopName
  }

}
//banner图data
let banner = (data) => {
  return {
    type: types.HOMEPAGE_BANNER_DATA,
    bannerDataList: data
  }
};
//获取分组名称列表
export let groupingNameList = (shopId, successCallback, failCallBack) => {
  let url = "/shopPartition/listShopGroupName";
  let dic = {
    shopId: shopId
  }
  return dispatch => {
    return Util.post(url, dic, (response) => {
      //console.log();
      dispatch(showLoading(false));
      if (response.status === 0) {
        dispatch(groupingName(response.body.shopGroupList));
      }
    }, (error) => {
      dispatch(showLoading(false));
    })
  }
};
//分组名称Data
let groupingName = (data) => {
  return {
    type: types.GROUPING_NAME_LIST,
    groupingNameData: data
  }
};

//店铺是否冻结
export let isShopFrozen = (url, callback) => {
  return dispatch => {
    Util.get(url, (res) => {
      // console.log(res)
      dispatch(showLoading(false));
      dispatch({
        type: types.IS_SHOP_FROZEN,
        isShopFrozen: res.body.result
      })
    }, (err) => {
      // console.log(err)
      dispatch(showLoading(false));
    })
  }
}
