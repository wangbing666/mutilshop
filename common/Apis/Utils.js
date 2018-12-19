/**
 * Created by chengjiabing on 17/7/11.
 * 工具类
 */

import { Toast } from 'antd-mobile';
import * as Util from './Fetch';
import * as contants from './constants';

//行内样式 px转成rem 
export const pxChangeRem = (pxValue) => {
  if (pxValue) {
    return parseInt(pxValue) / 75 + "rem";
  }
  return 0;
}
//通过原生app跳转
export const goToPageForApp = (url, isShow) => {
  // console.log("isShow",isShow);
  const data = {
    isShow: isShow,
    goodsUrl: url
  };
  //console.log("跳转----",JSON.stringify(data));
  //  alert(url);
  let ua = navigator.userAgent.toLowerCase();
  if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
    //在微度里面打开
    if (userAgent() === 'IOS') {
      // 判断是否分享到朋友后在微度浏览器中打开还是通过原生APP打开
      try {
        window.webkit.messageHandlers.toGoodsDetailPage.postMessage(JSON.stringify(data));
      } catch (err) {
        window.location.href = url;
      }
    } else {
      // 判断是否分享到朋友后在微度浏览器中打开还是通过原生APP打开
      try {
        window.business.toGoodsDetailPage(JSON.stringify(data));
      } catch (err) {
        window.location.href = url;
      }
    }
  } else {
    //不在纬度里面打开,
    window.location.href = url;
  }
}

//通过原生app实现，返回上一页
export const goBackPrevPage = () => {
  if (userAgent() === 'IOS') {
    window.webkit.messageHandlers.jumpToAppOfYunCang.postMessage(JSON.stringify(1));
  } else {
    window.business.jumpToAppOfYunCang(JSON.stringify(1));
  }
}

//商品的浏览量
export const goodsViewNum = (goodsId, goodDetailUrl, isSecond) => {
  Util.post("/goods/addGoodsViewValues", { goodsId: goodsId }, (response) => {
    //  console.log("增加浏览量....",response);
    if (response.status === 0) {
      // if(isSecond){
      //    window.location = goodDetailUrl;
      // }else{
      //    goToPageForApp(goodDetailUrl,false);
      // } 
      //  window.location = goodDetailUrl;
      // alert(goodDetailUrl);

      // window.location = goodDetailUrl;
      goToPageForApp(goodDetailUrl, false);

    } else {
      Toast.info('服务器异常', 1);
    }
  }, (error) => {
    Toast.info('网络失败', 2);
  });
}


//统计店铺的浏览量
export const shopViewNum = (shopId, shopDetailUrl, isSecond) => {
  //店铺的浏览量
  Util.post("/goods/addShopViewValues", { shopId: shopId }, (response) => {
    if (response.status === 0) {
      // goToPageForApp(shopDetailUrl, false);
    } else {
      Toast.info('服务器异常', 1);
    }
  }, (error) => {
    Toast.info('网络失败', 2);
  });

}

export const getShopStyleInfo = (shopId) => {
  //获取店铺的装饰信息
  let url = '/shopPartition/getShopSpecialBanner';
  let body = {
    shopId: shopId
  }
  Util.post(url, body, (response) => {
    // console.log("店铺装修的response",JSON.stringify(response));
    if (response.status === 0) {
      let shopDic = response.body.shopInfo;
      if (shopDic) {
        if (shopDic.SHOPWORKWORK.indexOf('a') > -1) {
          shopDic.showBanner = true;
        }
        else {
          shopDic.showBanner = false;
          shopDic.SHOPWORKWORK = shopDic.SHOPWORKWORK + 'a'
        }
        if (shopDic.SHOPWORKWORK.indexOf('b') > -1) {
          shopDic.showCategory = true;
        }
        else {
          shopDic.showCategory = false;
          shopDic.SHOPWORKWORK = shopDic.SHOPWORKWORK + 'b'
        }
        if (shopDic.SHOPWORKWORK.indexOf('c') > -1) {
          shopDic.showPartion = true;
        }
        else {
          shopDic.showPartion = false;
          shopDic.SHOPWORKWORK = shopDic.SHOPWORKWORK + 'c'
        }
        contants.viewStyDic = shopDic;
      }
    } else {
      Toast.info(response.msg, 2);
    }
    console.log("contants.viewStyDic-----", JSON.stringify(contants.viewStyDic));
  }, (error) => {
    Toast.info('获取店铺样式失败', 2);
  });
}

//截取字符串...
export const cutOutStr = (oriStr, len) => {
  if (typeof (oriStr) != "string") return "";
  return oriStr.length > len ? oriStr.substring(0, len) + "..." : oriStr;

}


//处理选择的标签类型
export const dealSelectType = (typeStr, len) => {
  let typeArr = Array.from(new Array(len)).map(() => (0));
  if (typeStr == null || typeof (typeStr) == "undefined" || typeStr == 0) return typeArr;
  if (typeof (typeStr) == "number") typeStr = typeStr + "";
  // [0,0,0,0] [1,0]
  let typeStrArr = typeStr.split("");
  let strLen = typeStrArr.length;
  if (len > strLen) {
    typeArr.length = len - strLen;
    let newStrArr = typeArr.concat(typeStrArr);
    return newStrArr;
  } else {
    typeStrArr.length = len;
    return typeStrArr;
  }
}

export const readGoods = () =>//获取购物袋缓存
{
  let str = localStorage.getItem("shoppingCart");
  let goods = JSON.parse(localStorage.getItem("shoppingCart"));
  return goods;
}
export const saveGoods = (goodsAry, isUpdate) => {//向购物袋添加商品 isUpdate true 代表更新,fales 增加
  // goodId:100,
  //     zoomUrl:'www.baidu.com',
  // goodNam:'龙虾',//	商品名称	String
  // AnotherName:'胜多负少发',//	商品别名	String
  // goodPrice:'33',//	商品价格	double
  // goodNum:1,
  //goodSpecification
  // param1
  //param2
  // param3
  let readGoods = JSON.parse(localStorage.getItem("shoppingCart"));
  if (readGoods === null) {
    localStorage.setItem("shoppingCart", JSON.stringify(goodsAry));
  }
  else {
    for (let i = 0; i < goodsAry.length; i++) {
      let dic = goodsAry[i]
      let haveExsit = false;
      for (let j = 0; j < readGoods.length; j++) {
        let read = readGoods[j]
        if (dic.goodsId === read.goodsId && parseInt(dic.param1) === parseInt(read.param1) && parseInt(dic.param2) === parseInt(read.param2) && parseInt(dic.param3) === parseInt(read.param3))//商品已经存在
        {
          if (isUpdate && isUpdate === true) {
            read.number = dic.number;
            haveExsit = true;
            if (dic.number === 0) // 0 代表删除
              readGoods.splice(j, 1)
          }
          else {
            read.number = read.number + dic.number;
            haveExsit = true;
          }
          break
        }
      }
      if (haveExsit === false)//新商品
      {
        readGoods.push(dic)
      }
    }
    localStorage.setItem("shoppingCart", JSON.stringify(readGoods));
  }
}

export const deleteGoods = (goodsAry) => {//更新购物袋添加商品
  //console.log(goodsAry + 'haha')
  let readGoods = JSON.parse(localStorage.getItem("shoppingCart"));
  if (readGoods === null)
    return;
  else {
    for (let i = 0; i < goodsAry.length; i++) {
      let dic = goodsAry[i]
      for (let j = 0; j < readGoods.length; j++) {
        let read = readGoods[j]
        if (dic.goodsId === read.goodsId && parseInt(dic.param1) === parseInt(read.param1) && parseInt(dic.param2) === parseInt(read.param2) && parseInt(dic.param3) === parseInt(read.param3))//商品已经存在
        {
          readGoods.splice(j, 1)
          break
        }
      }
    }
    localStorage.setItem("shoppingCart", JSON.stringify(readGoods));
  }
}


export const readUserInfo = () => { // 获取用户信息
  let user = JSON.parse(localStorage.getItem("userInfo"));
  return user;
};


export const saveUserId = (userInfo) => { // 存储用户信息
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
}




// 对时间戳进行格式化
export const format = (time, format) => {
  var t = new Date(time);
  var tf = function (i) { return (i < 10 ? '0' : '') + i };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}





export const userAgent = () => {
  const u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 'Android'
  } else if (isiOS) {
    return 'IOS'
  } else {
    return 'wedu';
  }
}

//去除字符串前后空格
export const trim = (param) => {
  if ((vRet = param) == '') { return vRet; }
  if ((vRet = param) == null) { return ''; }

  while (true) {
    if (vRet.indexOf(' ') == 0) {
      vRet = vRet.substring(1, parseInt(vRet.length));
    } else if ((parseInt(vRet.length) != 0) && (vRet.lastIndexOf(' ') == parseInt(vRet.length) - 1)) {
      vRet = vRet.substring(0, parseInt(vRet.length) - 1);
    } else {
      return vRet;
    }
  }
}

window.setPageTitleWindow = function (title) { //iframe 设置
  var body = document.getElementsByTagName('body')[0];
  document.title = title;
  var iframe = document.createElement("iframe");

  iframe.style.display = "none";

  var d = function () {
    setTimeout(function () {
      iframe.removeEventListener('load', d);

      document.body.removeChild(iframe);

    }, 0);

  };
  iframe.addEventListener('load', d);
  document.body.appendChild(iframe);

}

//设置页面标题
export const setPageTitle = (title) => {// 设置标题 ios 或者安卓卡宝
  //通知ios 设置title
  let data = {
    type: "2",
    contentMsg: {
      title: title
    }
  }
  const u = navigator.userAgent;
  let agent = userAgent()
  if (userAgent() === 'IOS') {
    let isWeidu = u.indexOf('wedo') > -1; //是否是维度
    if (isWeidu) {//通知ios设置标题
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.sendParamMessageToApp) {
        window.webkit.messageHandlers.sendParamMessageToApp.postMessage(JSON.stringify(data));
      }
    }
    else {
      setPageTitleWindow(title)
    }
  }
  else {
    document.title = title;
  }
}

export const getValueByName = (routerStr) => {
  // console.log(routerStr);
  // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let paramStr = "";
  let paramArr = [];
  let theRequest = new Object();
  if (routerStr.indexOf("?") != -1) {
    paramStr = routerStr.split("?")[1];
  }
  if (paramStr.indexOf("&") != -1) {
    paramArr = paramStr.split("&");
  } else {
    paramArr.push(paramStr);
  }
  for (var i = 0; i < paramArr.length; i++) {
    theRequest[paramArr[i].split("=")[0]] = unescape(paramArr[i].split("=")[1]);
  }
  return theRequest;
}

//根据url获取参数
export const getValueFromUrl = (localUrl) => {
  let url = window.location.href.split("?");
  let strs = []
  let theRequest = new Object();
  if (url[1]) {
    var str = url[1].substr(0);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}


//访问量处理
export const addShopHitHand = (shopId) => {
  let hitUrl = '/shopPartition/addShopHits';
  let date = new Date();
  let userInfo = readUserInfo();
  let hitPost = (userId) => {
    Util.post(hitUrl, { shopId: shopId }, (response) => {
      if (response.status === 0) {
        let dic = {
          userId: userId,
          time: date.getTime()
        };
        localStorage.setItem("hitTime", JSON.stringify(dic));

      } else {
        Toast.info(response.msg, 2);
      }
    }, (error) => {
      Toast.info('网络失败', 2);
    });
  };
  if (userInfo) {//用户登录了
    console.log(userInfo)
    let lastHit = JSON.parse(localStorage.getItem("hitTime"))
    if (lastHit) {
      if (lastHit.userId != userInfo.wedoId) {
        hitPost(userInfo.wedoId);
      }
      else {
        if (date.getTime() - lastHit.time > 24 * 3600 * 1000) {//超过一天
          console.log('未登录,点击量加1')
          hitPost(userInfo.wedoId);
        }
      }
    }
    else {
      hitPost(userInfo.wedoId);
      console.log('登录,点击量加1')
    }
  }
  else {//用户未登陆
    let lastHit = JSON.parse(localStorage.getItem("hitTime"))
    if (lastHit) {//
      console.log(lastHit)
      let lastTime = lastHit.time;
      if (date.getTime() - lastTime > 24 * 3600 * 1000) {//超过一天
        console.log('未登录,点击量加1')
        hitPost(-1);
      }
    }
    else {
      hitPost(-1);
      console.log('未登录,点击量加1')
    }
  }
}

//猜你喜欢
export const likeGoodsList = () => {
  let likeUrl = '/goods/getLikeGoods';
  // console.log("你喜欢的列表");
  Util.get(likeUrl, (response) => {
    //  console.log("你喜欢的列表",response);
    if (response.status === 0) {
      response.body.likeGoods;
    } else {
      Toast.info(response.msg, 2);
    }
  }, (error) => {
    Toast.info('网络失败', 2);
  });
};
// 获取店铺基本信息接口 type ==1 旗舰店 2分消店
export const getShopBasic = (shopId, type) => {
  let subUrl = '/cloudShop/getDisShopInfo';
  Util.post(subUrl, { shopId: shopId }, (response) => {
    if (response.status === 0) {
      contants.shopInfo = response.body.shopBaseInfo;
      contants.shopInfo.shopId = shopId;
      contants.shareShopImgUrl = response.body.shopBaseInfo.logoUrl;
      contants.shopInfo.shareUrl = type === 1 ? contants.commonServerUrl + '/?shopId=' + shopId : contants.commonServerRetailUrl + '/?shopId=' + shopId;
      contants.shopInfo.shopId = shopId;
    } else {
      Toast.info(response.msg, 2);
    }
  }, (error) => {
    // 获取店铺装修报错
    //Toast.info('网络失败', 2);
  });
};




