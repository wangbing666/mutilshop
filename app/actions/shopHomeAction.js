/**
 * Created by AndyWang on 2017/7/7.
 */
import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import * as contants from '../../common/Apis/constants';
import { Modal, } from 'antd-mobile';

const alert = Modal.alert;
let showAlert = null;
let promiseFnArr = [];
let secPromiseArr = [];
let ornamentInfoList = [];

//1:Banner组件 2：图文导航组件 3：商品列表组件 4：店铺列表组件 5：标题组件  6：富文本组件 7：分类列表组件  8：拼团活动组件 9：导航栏组件',
//0：banner :1：图文导航信息:2：查询商品列表控件信息，3：店铺列表控件信息，4：标题控件信息:5：富文本控件信息:6：查询分类列表控件信息:7：查询拼团控件数据信息:8：查询导航数据信息，（查询标签信息，查询标签下拉）
const controlUrls = [{ url: '/cloudBanner/queryDecorateBannerInfo', paramName: 'bannerId' },
{ url: '/cloudBanner/queryDecorateGraphicInfo', paramName: 'graphicId' },
{ url: '/cloudGoodsList/queryDecorateGoodsListInfo', paramName: 'goodslistId' },
{ url: '/cloudShoplist/queryDecorateShoplistInfo', paramName: 'shoplistId' },
{ url: '/cloudTitle/queryDecorateTitleInfo', paramName: 'titleId' },
{ url: '/cloudRichtext/queryDecorateRichtextInfo', paramName: 'textId' },
{ url: '/cloudClassifyList/queryDecorateClassifyListInfo', paramName: 'classifyId' },
{ url: '/cloudGrouponCampaign/queryDecorateGrouponCampaignInfo', paramName: 'grouponId' },
{ url: '/cloudNavigation/queryDecorateNavigationInfo', paramName: 'navigationId' }
];

//获取购物首页控件信息
export let getPageLayoutById = (url) => {
  // let url="/cloud-web/cloudPage/queryHomePageLayout?pageType=1";
  //let url = "/cloud-web/cloudPage/queryPageLayoutById?pageId=41";
  return dispatch => {
    dispatch(showLoading(true));
    return Util.get(url, (response) => {
      //console.log(22222,response);
      if (response.status === 0) { //0 为返回成功了
        let shareInfo = response.body.tDecoratePageLayout;
        dealShareInfo(shareInfo);
        let tPageLayout = response.body.tPageLayoutUnionComponentList;
        let len = tPageLayout.length;
        let finishCount = 0;
        tPageLayout.map((item) => {
          let type = item.componentType;
          let contorlUrl = controlUrls[type - 1].url + "?" + controlUrls[type - 1].paramName + "=" + item.componentId;
          ornamentInfoList = [];
          var p = new Promise(function (resolve, reject) {
            Util.get(contorlUrl, (response) => {
              dealResControlDecoration(response, type);//执行返回结果处理 函数
              resolve(response);//这行很重要哦
              finishCount++;//记录第一层异步请求完成的 个数，不能使用当前index（无法知道异步函数哪个先执行）
              if (finishCount == len) {
                Promise.all([...promiseFnArr, ...secPromiseArr]).then(function (result) {
                  //console.log("所有的异步完成...",result); //如果有问题，放开这行测试一下
                  dispatch(showLoading(false));
                }
                );
              }
            }, (error) => {
              console.log(error);
              reject();
            });
          })
          promiseFnArr.push(p);
        })
      } else {
        // console.log("获取店铺的装饰设置失败");
        dispatch(showLoading(false));
        showAlert = alert('提示', "服务器异常", [
          {
            text: '确定', onPress: () => {
            }, style: { color: '#000000' }
          },
        ]);
      }
    }, (error) => {
      dispatch(showLoading(false));
      showAlert = alert('提示', '网络失败', [
        {
          text: '确定', onPress: () => {
          }, style: { color: '#000000' }
        },
      ]);
    });
  }
};

export let hideAlert = () => {//弹框消失
  if (showAlert)
    showAlert.close();
  return {
    type: types.SHOWLOADING,
    isShowLoading: false
  }
}

//保存首页的分享信息
let dealShareInfo = (shareInfo) => {
  let sharePbj = {
    fileUrl: shareInfo.fileUrl,
    pageId: shareInfo.pageId,
    shareDesc: shareInfo.shareDesc,
    shareTitle: shareInfo.shareTitle,
    zoomUrl: shareInfo.zoomUrl,
    shareUrl: contants.multishopUrl + "/index",
    pageName: shareInfo.pageName
  }
  //contants.homePageShareInfo = sharePbj;
  //alert(JSON.stringify(contants.homePageShareInfo))
  localStorage.setItem("shareInfo", JSON.stringify(sharePbj));
}
//设置Tab的type
export let setTabCurIndex = (type) => {
  return dispatch => {
    dispatch(tabType(type));
  }
}
//加载动画
let showLoading = (bool) => {
  return {
    type: types.HOMEPAGE_IS_SHOW_LOADING,
    isShowLoading: bool
  }
};

//各控件装饰的返回结果的处理
let dealResControlDecoration = (response, type) => {
  switch (type) {
    case 1:
      dealBannerRes(response);
      break;
    case 2:
      dealGraphicRes(response);
      break
    case 3:
      dealGoodsListRes(response);
      break;
    case 4:
      dealShoplistRes(response);
      break;
    case 5:
      dealTitleRes(response);
      break;
    case 6:
      dealRichtextRes(response);
      break;
    case 7:
      dealClassifyListRes(response);
      break;
    case 8:
      dealGrouponCampaignRes(response);
      break;
    case 9:
      dealNavigationRes(response);
      break;
  }
}
//1:Banner组件
let dealBannerRes = (result) => {
  if (result.status === 0) {
    let bannerData = result.data;
    let deBanner = bannerData.tdecorateBanner;
    //  let pictureList = bannerData.tdecoratePictureVoList;
    let ornamentObj = {
      orSort: deBanner.componentSort,
      orName: "banner",
      orInfo: {
        bannareStyle: deBanner.bannareStyle,
        distance: deBanner.distance,
        interval: deBanner.pictureInterval,
        picWidth: deBanner.pictureWidth,
        pictureList: bannerData.tdecoratePictureVoList
      }
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  } else {
    console.log("获取banner控件信息失败");
  }
}
//2：图文导航组件
let dealGraphicRes = (result) => {
  if (result.status === 0) {
    let graphicNav = result.data.tdecorateGraphicNavigation;
    let graphicVoList = result.data.tdecoratePictureVoList;
    let ornamentObj = {
      orSort: graphicNav.componentSort,
      orName: "graphic",
      orInfo: {
        graphicNav: graphicNav,
        voList: graphicVoList
      }
    }
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  } else {
    console.log("获取图文导航装饰信息失败");
  }
}
//3：商品列表组件
let dealGoodsListRes = (result) => {
  if (result.status === 0) {
    let deGoodsList = result.data;
    let ornamentObj = {
      orSort: deGoodsList.componentSort,
      orName: "goodsList",
      orInfo: deGoodsList,
      goodsList: []
    };
    //获取商品列表
    getGoodsList(ornamentObj, deGoodsList.goodslistId, 0, "", deGoodsList.sortRule);
  } else {
    console.log("获取商品列表组件信息失败");
  }
}
//4：店铺列表组件 
let dealShoplistRes = (result) => {
  if (result.status === 0) {
    let deShopList = result.data;
    let ornamentObj = {
      orSort: deShopList.componentSort,
      orName: "shopList",
      orInfo: deShopList,
      shopList: []
    };
    //获取店铺列表
    getShopList(ornamentObj, deShopList.shoplistId, 1, "", deShopList.sortRule);
  } else {
    console.log("获取店铺列表组件信息失败");
  }
}
//5：标题组件 
let dealTitleRes = (result) => {
  if (result.status === 0) {
    let ornamentObj = {
      orSort: result.data.componentSort,
      orName: "title",
      orInfo: result.data
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  } else {
    console.log("获取标题组件信息失败");
  }
}
//6：富文本组件
let dealRichtextRes = (result) => {
  if (result.status === 0) {
    let ornamentObj = {
      orSort: result.data.componentSort,
      orName: "richTxt",
      orInfo: result.data
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  } else {
    console.log("获取富文本组件信息失败");
  }
}
//7：分类列表组件
let dealClassifyListRes = (result) => {
  if (result.status === 0) {
    let deClassify = result.body.tDecorateClassifyList;
    let classifyList = result.body.tDecorateClassifyTitleList;
    let ornamentObj = {
      orSort: deClassify.componentSort,
      orName: "classifyList",
      orInfo: deClassify,
      classList: classifyList,
      goodsList: [],
      shopList: [],
    };
    if (classifyList.length != 0) {
      if (deClassify.classifyType == 0) { //商品分类  获取分类商品列表
        getGoodsList(ornamentObj, deClassify.classifyId, 2, classifyList[0].classifyTitleId, deClassify.sortRule);
      } else {  //店铺分类 获取分类店铺列表
        getShopList(ornamentObj, deClassify.classifyId, 2, classifyList[0].classifyTitleId, deClassify.sortRule);
      }
    } else {
      ornamentInfoList.push(ornamentObj);
      contants.ornameInfo = ornamentInfoList;
    }
  } else {
    console.log("获取列表控件信息失败");
  }
}
//8:拼团活动组件
let dealGrouponCampaignRes = (result) => {
  if (result.status === 0) {
    let collageObj = result.data;
    let ornamentObj = {
      orSort: collageObj.componentSort,
      orName: "group",
      orInfo: collageObj,
      goodsList: []
    };
    getGoodsList(ornamentObj, collageObj.grouponId, 3, "", 0);
  } else {
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  }
}
//9:导航栏组件
let dealNavigationRes = (result) => {
  if (result.status === 0) {
    let navData = result.data;
    let ornamentObj = {
      orSort: navData.decorateNavigation.componentSort,
      orName: "navgation",
      orInfo: navData.decorateNavigation,
      navList: navData.tdecoratePictureVoList
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList;
  } else {
    console.log("获取富文本组件信息失败");
  }
}


//获取商品列表
let getGoodsList = (ornamentObj, linkId, linkType, classId, sortRule) => {
  let url = "/cloudGoods/getHomePageGoodsList?linkId=" + linkId + "&linkType=" + linkType + "&classifyTitleId=" + classId + "&sortRule=" + sortRule;
  ornamentObj.goodsList = [];
  let goodsP = new Promise(function (resolve, reject) {
    Util.get(url, (response) => {
      resolve(response);
      if (response.status === 0) {
        ornamentObj.goodsList = response.body.goodsListInfo;
        ornamentInfoList.push(ornamentObj);
        contants.ornameInfo = ornamentInfoList;
        //console.log("看看这里是什么",ornamentObj,ornamentInfoList);
      }
    }, (error) => {
      console.log("获取商品列表失败", error);
    });
  }, (error) => {
    console.log(error);
    reject();
  })
  secPromiseArr.push(goodsP);
}


//获取店铺列表
let getShopList = (ornamentObj, linkId, linkType, classifyId, sortRule) => {
  let url = "/cloudShop/getHomePageShopList?linkId=" + linkId + "&linkType=" + linkType + "&classifyTitleId=" + classifyId + "&sortRule=" + sortRule;
  let shopP = new Promise(function (resolve, reject) {
    Util.get(url, (response) => {
      resolve(response);
      if (response.status === 0) {
        ornamentObj.shopList = response.body.shopListInfo;
        ornamentInfoList.push(ornamentObj);
        contants.ornameInfo = ornamentInfoList;
      }
    }, (error) => {
      console.log("获取店铺列表失败", error);
    });
  }, (error) => {
    console.log(error);
    reject();
  })
  secPromiseArr.push(shopP);
}

