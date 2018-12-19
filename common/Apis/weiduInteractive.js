/**
 * Created by andyWang on 2017/10/30.
 */
import * as constants from './constants'
import * as Utils from './Utils'
import * as Fetch from './Fetch';
import { Modal } from 'antd-mobile';
//const alert = Modal.alert;

//获取用户信息
export const getUserInfo = async () => {
  await getParamsFromApp();
  window.sendMessageToJS = function (data) {
    let infoData = JSON.parse(data);
    let userData = {
      enterpriseName: infoData.contentMsg.enterpriseName,
      kabaoId: infoData.contentMsg.kabaoId,//
      enterpriseId: infoData.contentMsg.enterpriseId,//商户id
      moblie: infoData.contentMsg.moblie,//手机号码
      headUrl: infoData.contentMsg.headUrl,
      bang: infoData.contentMsg.bang ? infoData.contentMsg.bang : false
    };
    let body = {
      kabaoId: infoData.contentMsg.kabaoId,
      mobile: infoData.contentMsg.moblie
    };
    // alert(JSON.stringify(body))
    Fetch.post('/user/getUserId', body, (response) => {
      if (response.status === 0) {
        let userInfo = {
          enterpriseName: response.body.enterpriseName,
          kabaoId: infoData.contentMsg.kabaoId,//卡宝用户id
          enterpriseId: response.body.enterpriseId,//商户id
          moblie: infoData.contentMsg.moblie,//手机号码
          userId: infoData.contentMsg.kabaoId,//商户id
          wedoId: infoData.contentMsg.kabaoId,
          headUrl: infoData.contentMsg.headUrl,
          bang: infoData.contentMsg.bang ? infoData.contentMsg.bang : false,
          checkCode: infoData.contentMsg.checkCode, //app内 使用
          userNickname: response.body.userNickname, // 用户昵称
        };
        Utils.saveUserId(userInfo);
        constants.isGetUserInfo = true;
      }
    }, (error) => {
      alert('获取用户信息失败');
    }, infoData.contentMsg.kabaoId, infoData.contentMsg.checkCode);
  };
}

let getParamsFromApp = () => {
  //在微度app中
  let pla = ismobile(1);
  let data = {
    type: "1"
  };
  if (pla === 1) {
    window.business.toGetParamMessageFromApp(JSON.stringify(data));
  } else if (pla === 0) {
    if (window.webkit) {
      window.webkit.messageHandlers.toGetParamMessageFromApp.postMessage(JSON.stringify(data));
    }
  }
}

//授权登录调用原生方法
export const userAuthorization = () => {
  // getUserInfo();
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
    //在微度app中
    let data = {
      type: "1"
    };
    let pla = ismobile(1);
    if (pla === 1) {
      window.business.toGetParamMessageFromApp(JSON.stringify(data));
    } else if (pla === 0) {
      if (window.webkit) {
        window.webkit.messageHandlers.toGetParamMessageFromApp.postMessage(JSON.stringify(data));
      }
    }
  } else {
    //不在微度app中
  }
};

//原生调用H5方法返回s
// alert("开始调用原生H5");
window.sendMessageToJS = function (data) {
  let userInfoData = JSON.parse(data);
  // alert(JSON.stringify(userInfoData));
  let userInfo = {
    enterpriseName: userInfoData.contentMsg.enterpriseName,
    kabaoId: userInfoData.contentMsg.kabaoId,//
    enterpriseId: userInfoData.contentMsg.enterpriseId,//商户id
    moblie: userInfoData.contentMsg.moblie,//手机号码
    headUrl: userInfoData.contentMsg.headUrl,
    bang: userInfoData.contentMsg.bang ? userInfoData.contentMsg.bang : false
  };

  let body = {
    kabaoId: userInfoData.contentMsg.kabaoId,
    mobile: userInfoData.contentMsg.moblie
  };
  Fetch.post('/user/getUserId', body, (response) => {
    //  alert(JSON.stringify(response));
    // alert(JSON.stringify(response));
    if (response.status === 0) {
      let userInfo = {
        enterpriseName: response.body.enterpriseName,
        kabaoId: userInfoData.contentMsg.kabaoId,//卡宝用户id
        enterpriseId: response.body.enterpriseId,//商户id
        moblie: userInfoData.contentMsg.moblie,//手机号码
        userId: userInfoData.contentMsg.kabaoId,//商户id
        wedoId: userInfoData.contentMsg.kabaoId,
        headUrl: userInfoData.contentMsg.headUrl,
        bang: userInfoData.contentMsg.bang ? userInfoData.contentMsg.bang : false,
        checkCode: userInfoData.contentMsg.checkCode,//app内 使用
        userNickname: response.body.userNickname, // 用户昵称
      };
      Utils.saveUserId(userInfo);
      constants.isGetUserInfo = true;
    }
  }, (error) => {
     alert('获取用户信息失败');
  }, userInfoData.contentMsg.kabaoId, userInfoData.contentMsg.checkCode);

};

//判断手机机型0:iPhone 1:Android
export const ismobile = (test) => {
  let u = navigator.userAgent,
    app = navigator.appVersion;
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
    if (window.location.href.indexOf("?mobile") < 0) {
      try {
        if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
          return 0;
        } else {
          return 1;
        }
      } catch (e) { }
    }
  } else if (u.indexOf('iPad') > -1) {
    return 0;
  } else {
    return 1;
  }
};
//分享
//原生调用H5 分享
window.notiJSToGetParameter = function () {
  let userInfo = Utils.readUserInfo();
  let ua = navigator.userAgent.toLowerCase();
  const title = document.title;
  if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo" || true) {
    //在微度app中
    let data;
    let localUrl = location.href;
    if (localUrl.indexOf('goodDetails') > -1) {//分享商品详情
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.shopInfo.shopId,
          goodsId: constants.groupShoppingDetailInfo.goodsId,//没有商品id写0
          title: constants.groupShoppingDetailInfo.title,//商品
          content: constants.groupShoppingDetailInfo.content,//分享center
          picture: constants.groupShoppingDetailInfo.imgUrl,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "9",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: 0,
          shareTypeMessage: '微度商品'
        }
      }
    } else if (localUrl.indexOf('shopActivity') > -1) {//活动
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.shopInfo.shopId,
          goodsId: "0",//没有商品id写0
          title: constants.activityInfo.title,//商品
          content: constants.activityInfo.content,//分享center
          picture: constants.activityInfo.imgUrl,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "11",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: 0,
          shareTypeMessage: '商品活动'
        }
      };
    } else if (localUrl.indexOf('groupShoppingDetail') > -1) {//团购详情
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.shopInfo.shopId,
          goodsId: constants.groupShoppingDetailInfo.goodsId,//没有商品id写0
          title: constants.groupShoppingDetailInfo.title,//商品
          content: constants.groupShoppingDetailInfo.content,//分享center
          picture: constants.groupShoppingDetailInfo.imgUrl,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "9",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: 0,
          shareTypeMessage: '微度商品'
        }
      }
    } else if (localUrl.indexOf('storyDetailsBuyerManage') > -1 || localUrl.indexOf('storyDetailsBuyerManages') > -1) {
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.storyDetails.shopId,
          goodsId: "0",//没有商品id写0
          title: constants.storyDetails.title,//商品
          content: constants.storyDetails.content,//分享center
          picture: constants.storyDetails.picture,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "12",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: constants.storyDetails.storyId,
          shareTypeMessage: '商品故事'
        }
      };
    } else if (localUrl.indexOf('shopDetail') > -1) {
      //分享店铺旗舰店
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.shopInfo.shopId,
          goodsId: "0",//没有商品id写0
          title: constants.shopInfo.shopName,//商品
          content: constants.shopInfo.describes,//分享center
          picture: constants.shopInfo.logoUrl,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "8",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: 0,
          shareTypeMessage: '微度店铺'
        }
      };
    } else if (localUrl.indexOf('retailPage') > -1) {
      //分享店铺分销店
      data = {
        type: "1",
        contentMsg: {
          shopId: constants.shopInfo.shopId,
          goodsId: "0",//没有商品id写0
          title: constants.shopInfo.shopName,//商品
          content: constants.shopInfo.describes,//分享center
          picture: constants.shopInfo.logoUrl,//商品或店铺图片
          enterpriseId: userInfo.enterpriseId,
          url: localUrl,
          shareType: "8",//8 店铺 9 商品 12 商品故事,
          sourceType: 1,
          storyId: 0
        }
      };
    } else {
      let obj = JSON.parse(localStorage.getItem("shareInfo"));
      let userInfo = JSON.parse(localStorage.getItem("userInfo"))
      let url;
      if (localUrl.indexOf('?') > -1) {
        url = localUrl + '&userId=' + userInfo.userId
      } else {
        url = localUrl + '?userId=' + userInfo.userId
      }
      data = {
        type: "1",
        contentMsg: {
          pageId: obj.pageId || '',
          title: obj.shareTitle || '',//商品
          content: obj.shareDesc || '',//分享center
          picture: obj.zoomUrl || '',//商品或店铺图片
          url: encodeURI(url),
          shareType: "8",//多店,
          sourceType: 1,
          goodsId: '0',
          shareTypeMessage: title,
        }
      }
    }
    let pla = ismobile(1);
    //alert(JSON.stringify(data));
    if (pla === 1) {
      //alert(33333);
      window.business.sendParamMessageToApp(JSON.stringify(data));
    } else if (pla === 0) {
      // alert("qqqqq");
      window.webkit.messageHandlers.sendParamMessageToApp.postMessage(JSON.stringify(data));
    }
  } else {
    //不在微度app中
  }
};
//在纬度中打开应用
export const weiduOpenUrl = (paymentData) => {
  // console.log("伽马",paymentData);
  let config = {
    /*scheme:必须*/
    scheme_IOS: "ubar://?type=" + 10 + "&token=" + paymentData,
    scheme_Adr: "ubar://splash/openwith?type=" + 10 + "&token=" + paymentData,
    adr_download_url: "http://sj.qq.com/myapp/detail.htm?apkName=com.uns.uu",
    ios_download_url: "https://itunes.apple.com/cn/app/u-ba/id1115165868?l=en&mt=8",
    timeout: 6000,
    //externalOpen:"http://192.168.9.82:8080/UU/browserOpen.html?token="+paymentData
    externalOpen: "http://uu.wedo77.com/UU/browserOpen.html?token=" + paymentData
  };
  let browser = browserType();
  let isMobile = browserRedirect();
  if (isMobile) {
    if (browser === 0) {
      let pla = ismobile(1);
      //console.log(pla);
      //  alert(pla);
      if (pla === 0) {
        // alert("打开ios支付");
        window.location = config.scheme_IOS;
        let t = setTimeout(function () {
          window.location = config.ios_download_url;
        }, config.timeout);
        window.onblur = function () {
          clearTimeout(t);
        };
      } else if (pla === 1) {//android
        // alert("打开android支付");
        window.location = config.scheme_Adr;
        //$('body').append("<iframe src='"+config.scheme_Adr+"' style='display:none' target='' ></iframe>");
        let t = setTimeout(function () {
          // $('body').append("<iframe src='"+config.adr_download_url+"' style='display:none' target='' ></iframe>");
          window.location = config.adr_download_url;
        }, config.timeout);
        window.onblur = function () {
          clearTimeout(t);
        };
      }
    } else {
      window.location = config.externalOpen;
    }
  } else {
    alert('请在手机端打开!!!!')
  }


};

//判断是在什么浏览器中打开
export const browserType = () => {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
    return 0;
    //微度浏览器
  } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return 1;
    //微信浏览器
  } else if (ua.match(/Mqqbrowser/i) == "mqqbrowser") {

    //android手机
    if (ua.match(/Mobile Mqqbrowser/i) == "mobile mqqbrowser") {
      // alert("androidqq内置");
      return 1;
      //ios手机
    } else if (ua.indexOf('os') > 0) {
      // alert("qq浏览器");
      return 0;
    } else {
      // alert("qq浏览器");
      return 0;
    }
    //在QQ内置浏览器 qq浏览器
  } else if (ua.match(/WeiBo/i) == "weibo") {
    return 1;
    //在微博中打开
  } else if (ua.match(/QQ/i) == "qq") {
    return 1;
    //iOSQQ内置
  } else {
    return 0;
  }
};

//判断移动端还是PC端
export const browserRedirect = () => {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsNT = sUserAgent.match(/windows nt/) == "windows nt";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsNT || bIsWM) {
    return true;//移动端
  } else {
    return false;//PC端
  }
}

