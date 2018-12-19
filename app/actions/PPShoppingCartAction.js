/**
 * Created by nipeng on 2017/7/10.
 * 购物袋action
 */

import * as types from './actionTypes';
import * as Util from '../../common/Apis/Fetch';
import * as db from '../../common/Apis/Utils';
import { Toast, WhiteSpace, WingBlank, Button, Icon, Modal } from 'antd-mobile';
const alert = Modal.alert;

let data1 = [
  {
    shopId: 1, shopName: '自己造的数据',
    goodsList: [
      { goodsId: 11, goodsName: '自己造的商品1', price: 8, stock: 80, number: 2, isJoin: 0, status: 3, zoomUrl: require('../images/goodsType/f1.png'), bodyType: [{ name: "S", type: "尺码" }, { name: "黑/灰", type: "颜色" }] },
      { goodsId: 12, goodsName: '自己造的商品2', price: 10, stock: 10, number: 12, isJoin: 1, status: 3, linePrice: 88, zoomUrl: require('../images/goodsType/f2.png'), bodyType: [{ name: "S", type: "尺码" }, { name: "黑/灰", type: "颜色" }] }
    ]
  }, {
    shopId: 2, shopName: '造的店铺',
    goodsList: [
      { goodsId: 21, goodsName: '至少商品3', price: 80.90, stock: 8, number: 1, isJoin: 0, status: 3, zoomUrl: require('../images/goodsType/f3.png'), bodyType: [{ name: "S", type: "尺码" }, { name: "黑/灰", type: "颜色" }] },
      { goodsId: 22, goodsName: '至少商品4', price: 0.99, stock: 5, number: 2, isJoin: 0, status: 3, zoomUrl: require('../images/goodsType/f4.png'), bodyType: [{ name: "S", type: "尺码" }, { name: "黑/灰", type: "颜色" }] }
    ]
  }
]

/*购物袋商品*/
export let setShoppingCartList = (list) => {
  let tempAry = [];
  for (let i = 0; i < list.length; i++) {
    let tempDic = list[i];
    tempDic['shopSelected'] = false;
    if (tempDic.goodsList && Array.isArray(tempDic.goodsList)) {
      for (let j = 0; j < tempDic.goodsList.length; j++) {
        let goodsObj = tempDic.goodsList[j];
        goodsObj['goodsSelected'] = false;
      }
    }
    tempAry.push(tempDic);
  }
  return {
    type: types.SETSHOPPINGCARTLIST,
    shopCartLit: tempAry,
    priceString: 0,
    cashBack: 0,
    allSelectImag: false,
    numberShopCart: 0
  }
}

//修改购物车 选中店铺或者选中商品 1:商品 2：店铺 3、全选
export let setChangeShopCart = (list, selectBoolen, shopIndex, goodsIndex, type, totalPrice, cashBack, allSelect) => {
  let tempDic = list[shopIndex];
  let allPrice = parseFloat(totalPrice);
  let allCashBack = parseFloat(cashBack);
  // let allPrice = 0;
  let selectNum = 0;
  let allShopCartNum = 0;
  if (type === 2) { //点击店铺
    if (tempDic.shopSelected) tempDic.shopSelected = !selectBoolen; //1、店铺选中状态，点击变成没有选中
    for (let i = 0; i < list.length; i++) {
      if (Array.isArray(list[i].goodsList)) {
        for (let j = 0; j < list[i].goodsList.length; j++) {
          allShopCartNum++;//统计总的购物车中商品数量
          let goodsObj = list[i].goodsList[j];
          if (shopIndex == i) { //当前店铺为选中的店铺或商品
            if (goodsObj.isJoin != 1 && goodsObj.status != 4 && goodsObj.status != 2) {
              goodsObj.goodsSelected = !selectBoolen;
              if (goodsObj.goodsSelected && !tempDic.shopSelected) { //2.店铺未选中状态，有商品选中了，才选中店铺
                tempDic.shopSelected = !selectBoolen;
              }
              if (!selectBoolen) { // 商品价格的处理
                if (goodsObj.price && goodsObj.number)
                  allPrice += parseFloat(goodsObj.price) * goodsObj.number;
                  // allCashBack += parseFloat(goodsObj.consumerRebate) * goodsObj.number
              } else {
                if (parseFloat(allPrice) > 0) {
                  let price = parseFloat(goodsObj.price) * goodsObj.number;
                  allPrice = parseFloat(allPrice) >= price ? parseFloat(allPrice) - price : 0.00;
                }
              }
            }
          }
          //下面是判断是否全部选中的处理
          if (goodsObj.isJoin == 1 || goodsObj.status == 4) {
            selectNum++;
          } else {
            if (goodsObj.goodsSelected) selectNum++;
          }
        }
      }
    }
    if (selectNum != 0 && selectNum === allShopCartNum) {
      allSelect = true;
    } else {
      allSelect = false;
    }
  } else if (type === 1) { //点击商品
    //1.商品选中、取消 2、商品全部选中则店铺选中
    let selectGoodsNum = 0;
    let goodsLen = 0;
    for (let i = 0; i < list.length; i++) {
      if (Array.isArray(list[i].goodsList)) {
        for (let j = 0; j < list[i].goodsList.length; j++) {
          allShopCartNum++;//统计总的购物车中商品数量
          let goodsObj = list[i].goodsList[j];
          if (shopIndex == i && goodsIndex == j) { //当前店铺为选中的店铺或商品
            if (goodsObj.isJoin != 1 && goodsObj.status != 4) {
              list[i].goodsList[j].goodsSelected = !selectBoolen;
              // if(!selectBoolen && ) list[i].shopSelected = selectBoolen;
              if (!selectBoolen) { // 商品价格的处理
                if (!list[i].shopSelected) list[i].shopSelected = true;
                if (goodsObj.price && goodsObj.number)
                  allPrice += parseFloat(goodsObj.price) * goodsObj.number;
              } else {
                if (parseFloat(allPrice) > 0) {
                  let price = parseFloat(goodsObj.price) * goodsObj.number;
                  allPrice = parseFloat(allPrice) >= price ? parseFloat(allPrice) - price : 0.00;
                }
              }
            }
          }
          //下面是判断当前店铺是否选中
          if (shopIndex == i) {
            goodsLen = list[i].goodsList.length;
            if (goodsObj.isJoin == 1 || goodsObj.status == 4) {
              selectGoodsNum++;
            } else {
              if (!goodsObj.goodsSelected) selectGoodsNum++;
            }
          }
          //下面是判断是否全部选中的处理
          if (goodsObj.isJoin == 1 || goodsObj.status == 4) {
            selectNum++;
          } else {
            if (goodsObj.goodsSelected) selectNum++;
          }
        }
      }
    }
    if (selectGoodsNum == goodsLen && list[shopIndex].shopSelected) {
      list[shopIndex].shopSelected = false;
    }
    if (selectNum != 0 && selectNum === allShopCartNum) {
      allSelect = true;
    } else {
      allSelect = false;
    }
  } else if (type == 3) { //全选与取消全选
    allPrice = 0;
    allSelect = !selectBoolen;
    for (let i = 0; i < list.length; i++) {
      if (!allSelect && list[i].shopSelected) list[i].shopSelected = false; //取消全选的店铺操作
      if (Array.isArray(list[i].goodsList)) {
        for (let j = 0; j < list[i].goodsList.length; j++) {
          let goodsObj = list[i].goodsList[j];
          if (goodsObj.isJoin != 1 && goodsObj.status != 4 && goodsObj.status != 2) { //可选的情况
            goodsObj.goodsSelected = allSelect;
            if (allSelect && !list[i].shopSelected) list[i].shopSelected = allSelect;
            //合计价格的变化，此部分可抽离
            if (!selectBoolen) {
              if (goodsObj.price && goodsObj.number)
                allPrice += parseFloat(goodsObj.price) * goodsObj.number;
            } else {
              if (parseFloat(allPrice) > 0) {
                let price = parseFloat(goodsObj.price) * goodsObj.number;
                allPrice = parseFloat(allPrice) >= price ? parseFloat(allPrice) - price : 0.00;
              }
            }
          }
        }
      }
    }
  }

  // allPrice = 1999999999;
  if (Number(allPrice) > 999999999.00) {
    Toast.info("你选择的商品金额已超出上线，请求重新选择")
    // return ;
  }
  return {
    type: types.SETSHOPPINGCARTLIST,
    shopCartLit: list,
    priceString: allPrice.toFixed(2),
    cashBack: allCashBack,
    allSelectImag: allSelect,
    numberShopCart: 0
  }
}

/*购物袋推荐*/
export let setRecommendList = (recommendList) => {
  return {
    type: types.SETRECOMMENDLIST,
    recommendList: recommendList
  }
}

// 获取热门推荐
export let getHotShoppingCartPost = (url, body, sucessCallBack, failCallBack) => {
  return dispatch => {
    dispatch(showLoading(true))
    return Util.post(url, body, (response) => {
      dispatch(showLoading(false))
      if (response.status == 0) {
        sucessCallBack();
        dispatch(setRecommendList(response.body.goodsResponses))
      } else {
        failCallBack();
        alert(response.msg);
      }
    }, (error) => {
      dispatch(showLoading(false))
      failCallBack();
    })
  }
}

// 获取购物袋列表
export let getShoppingCartPost = (url, body) => {
  return dispatch => {
    //  dispatch(setShoppingCartList(data1));
    //  return;
    //以上是测试的
    //alert(body.userId)
    // body.userId = "12499315";
    // body.userId = "12498934";
    return Util.post(url, body, (response) => {
      if (response.status === 0) {
        let tempAry = [];
        if (response.body && response.body.shoppingCartInfo && Array.isArray(response.body.shoppingCartInfo))
          tempAry = response.body.shoppingCartInfo;
        dispatch(setShoppingCartList(tempAry))
      } else {
        dispatch(setShoppingCartList([]));
        dispatch(isEmpty(true))
      }
    }, (error) => {
      // dispatch(setShoppingCartList([]));
      console.log("获取购物车列表失败", error);
    })
  }
}

// 加载动画
let showLoading = (bool) => {
  return {
    type: types.SHOPPINGCARTLOADING,
    isShowLoading: bool
  }
}

// 购物车是否为空
let isEmpty = (bool) => {
  return {
    type: types.SHOPPINGCARTEMPATY,
    isEmpty: bool,
  }
}
// 删除action 删除单个商品
export let setDelectList = (data, list, shopIndex, goodsIndex, tempPrice, allSelectImag, isUserId, numberShopCart) => {
  if (data.goodsSelected) {
    tempPrice = tempPrice - parseFloat(data.price) * data.number;
    // numberShopCart = numberShopCart - data.number;
    if (isDot(tempPrice)) {
      tempPrice = Number(tempPrice.toFixed(2));
    }
  }
  data.goodsSelected = !data.goodsSelected;
  list[shopIndex].goodsList.splice(goodsIndex, 1);
  if (list[shopIndex].goodsList.length > 0) {//改店铺下无选中的商品了
    let goodsList = list[shopIndex].goodsList;
    let selectedNum = 0;
    for (let i = 0; i < goodsList.length; i++) {
      selectedNum = goodsList[i].goodsSelected ? selectedNum + 1 : selectedNum;
    }
    if (selectedNum === 0) list[shopIndex].shopSelected = false;
  } else {
    list.splice(shopIndex, 1);
  }
  // if(list[shopIndex].goodsList.length === 0) 
  return {
    type: types.SETSHOPPINGCARTLIST,
    shopCartLit: list,
    priceString: tempPrice,
    cashBack: 1,
    allSelectImag: allSelectImag,
    numberShopCart: numberShopCart
  }
}
// 删除某个店铺下选中的商品
//(data,list,shopIndex,priceStr,allSelectImg,isUserId,numberShopCart)
export let setDeleAllList = (list, shopIndex, tempPrice, allSelectImag, isUserId, numberShopCart) => {
  // let allStatus = false;
  // let tempArr = list;
  for (let i = 0; i < list.length; i++) {
    let tempDic = list[i];
    if (tempDic.shopSelected) {
      if (shopIndex == i) {
        if (list[i].goodsList) {
          for (let j = 0; j < list[i].goodsList.length; j++) {
            let goodsObj = list[i].goodsList[j];
            if (goodsObj.goodsSelected) {
              tempPrice = tempPrice - parseFloat(goodsObj.price) * goodsObj.number;
              //   numberShopCart = numberShopCart - tempDic.number;
              if (isDot(tempPrice)) {
                tempPrice = Number(tempPrice.toFixed(2));
              }
              list[shopIndex].goodsList.splice(j, 1);
              j--;//上面的操作是的，数组改变了
            } else { //取消店铺的选中
              list[shopIndex].shopSelected = false;
            }
          }
        }
      }
    }
  }
  if (list[shopIndex].goodsList.length === 0) list.splice(shopIndex, 1);

  return {
    type: types.SETSHOPPINGCARTLIST,
    shopCartLit: list,
    priceString: tempPrice,
    allSelectImag: allSelectImag,
    numberShopCart: numberShopCart
  }
}


// 改变商品数量
export let setNumberAction = (data, rowIndex, goodsIndex, numberString, list, isUserId, stock, priceString, tag, numberShopCart) => {
  if (isUserId) {
    if (stock < numberString) {
      Toast.info('已达库存上限', 1);
      return;
    } else {
      data.number = numberString;
    }
  } else {
    if (stock < numberString) {
      Toast.info('已达库存上限', 1);
      return;
    } else {
      data.number = numberString;
    }
  }
  if (data.goodsSelected) {
    if (tag === 1) {
      priceString = priceString - parseFloat(data.price);
      numberShopCart = numberShopCart - 1;
    } else {
      priceString = priceString + parseFloat(data.price);
      numberShopCart = numberShopCart + 1;
    }
    if (isDot(priceString)) {
      priceString = Number(priceString.toFixed(2));
    }
  }

  list[rowIndex].goodsList[goodsIndex] = data;
  // // 下面是更新缓存 (分有无userid)
  // if(isUserId){
  //     let temp = [];
  //     for(let i =0;i<list.length;i++){
  //         let tempDic = {};
  //         let listDic = list[i];
  //         let goodType = '';
  //         listDic.bodyType.map((content,i)=>{
  //             if (i===0){
  //                 goodType = content.type+':'+content.name
  //             }else {
  //                 goodType+=' '+content.type+':'+content.name
  //             }
  //         })
  //         tempDic['goodNam'] = listDic.goodsName;
  //         tempDic['goodsId'] = listDic.goodsId;
  //         tempDic['number'] = listDic.number;
  //         tempDic['goodSpecification'] = goodType;
  //         tempDic['param1'] = listDic.param1;
  //         tempDic['param2'] = listDic.param2;
  //         tempDic['param3'] = listDic.param3;
  //         tempDic['zoomUrl']= listDic.zoomUrl;
  //         tempDic['price'] = listDic.price;
  //         tempDic['stock'] = listDic.stock;
  //         temp.push(tempDic);
  //     }
  //     db.saveGoods(temp,true)
  // }else {
  //     db.saveGoods(list,true)
  // }
  return {
    type: types.SETNUMBERACTION,
    shopCartLit: list,
    priceString: priceString,
    numberShopCart: numberShopCart
  }
}
// 更改购物袋商品数量
export let setShoppingNuberPost = (url, body, numberStr, data, rowIndex, goodsIndex, list, isUserId, priceString, tag, setShoppingNuberPost) => {
  return dispatch => {
    // dispatch(setNumberAction(data,rowIndex,goodsIndex,numberStr,list,isUserId,12,priceString,tag,setShoppingNuberPost));
    // return;
    // //测试专用
    dispatch(showLoading(true))
    return Util.post(url, body, (response) => {
      dispatch(showLoading(false));
      if (response.status == 0) {
        // let stock = 1;
        // if(response.body){
        //     stock = response.body.stock ? response.body.stock : stock;
        // }
        dispatch(setNumberAction(data, rowIndex, goodsIndex, numberStr, list, isUserId, response.body.stock, priceString, tag, setShoppingNuberPost));
        // dispatch(setNumberAction(data,rowIndex,numberStr,list,isUserId,response.body.stock,priceString,tag,setShoppingNuberPost));
      } else {
        alert(response.msg);
      }
    }, (error) => {
      console.log(error);
    })
  }
}


// 删除购物袋
export let deletaShoppingCartPost = (url, body, data, shopIndex, goodsIndex, list, priceStr, allSelectImg, isUserId, numberShopCart, type) => {
  return dispatch => {
    // dispatch(setDeleAllList(list,shopIndex,priceStr,allSelectImg,isUserId,numberShopCart))
    // return false;
    dispatch(showLoading(true))
    return Util.post(url, body, (response) => {
      dispatch(showLoading(false));
      if (response.status == 0) {
        if (type === 1) { // 删除单个商品
          dispatch(setDelectList(data, list, shopIndex, goodsIndex, priceStr, allSelectImg, isUserId, numberShopCart))
        }
        if (type === 2) {  //删除店铺下的商品
          dispatch(setDeleAllList(list, shopIndex, priceStr, allSelectImg, isUserId, numberShopCart))
        }
        Toast.info('删除成功', 1);
      } else {
        Toast.info(response.msg, 1);
        failCallBack();
      }
    }, (error) => {
      dispatch(showLoading(false))
      // failCallBack();
      Toast.info("删除商品失败", 1);
    })
  }
}



let isDot = (num) => { // 修改是否含有小数点
  var result = (num.toString()).indexOf(".");
  if (result != -1) {
    return true;
  } else {
    return false;
  }
}
// 改变商品选择状态
export let setSelectImg = (data, list, i, priceStr, allSelectImg, numberShopCart, isUserId) => {
  data.selected = !data.selected;
  list[i] = data;
  let tempPrice = 0, cashBack = 0;
  if (isUserId) {
    if (data.status == 1 && data.isdelete == 0 && data.isJoin === 0) {
      if (data.selected) {
        tempPrice = priceStr + (parseFloat(data.price) * data.number);
        cashBack = 
        numberShopCart = numberShopCart + data.number;
      } else {
        tempPrice = priceStr - (parseFloat(data.price) * data.number);
        numberShopCart = numberShopCart - data.number;
      }
      if (isDot(tempPrice)) {
        tempPrice = Number(tempPrice.toFixed(2));
      }
    }
  } else {
    if (data.selected) {
      tempPrice = priceStr + (parseFloat(data.price) * data.number);
      numberShopCart = numberShopCart + data.number;
    } else {

      tempPrice = priceStr - (parseFloat(data.price) * data.number);
      numberShopCart = numberShopCart - data.number;

    }
    if (isDot(tempPrice)) {

      tempPrice = Number(tempPrice.toFixed(2));
    }
  }

  let allStatus = false;
  for (let i = 0; i < list.length; i++) {
    let allImag = list[i];
    if (isUserId) {
      if (allImag.status == 1 && allImag.isdelete == 0 && allImag.isJoin === 0) {
        if (data.selected) {
          if (allImag.selected === false) {
            allStatus = true;
            break;
          }
        }
      } else {


      }
    } else {
      if (data.selected) {
        if (allImag.selected === false) {
          allStatus = true;
          break;
        }
      }
    }

  }
  if (data.selected) {
    if (allStatus === false) {
      allSelectImg = !allSelectImg
    }
  } else {
    allSelectImg = false
  }

  return {
    type: types.SETSHOPPINGCARTLIST,
    goodsList: list,
    priceString: tempPrice,
    cashBack: cashBack,
    allSelectImag: allSelectImg,
    numberShopCart: numberShopCart,
  }
}

export let setAllSelectImg = (list, status, isUserId) => {
  let tempAry = [];
  let priceStr = 0;
  let allSelect = false;
  let numberStr = 0;
  for (let i = 0; i < list.length; i++) {
    let tempDic = list[i];
    if (isUserId) {
      if (tempDic.status == 1 && tempDic.isdelete == 0 && tempDic.isJoin === 0) {
        allSelect = true;
        tempDic.selected = status;
        tempAry.push(tempDic);

        if (status) {
          priceStr = priceStr + (parseFloat(tempDic.price) * tempDic.number);
          numberStr = numberStr + tempDic.number;
        } else {
          priceStr = 0;
          numberStr = 0;
        }

        if (isDot(priceStr)) {

          priceStr = Number(priceStr.toFixed(2));
        }

      } else {
        tempAry.push(tempDic);

      }
    } else {
      allSelect = true;
      tempDic.selected = status;
      tempAry.push(tempDic);
      if (status) {
        priceStr = priceStr + (parseFloat(tempDic.price) * tempDic.number);
        numberStr = numberStr + tempDic.number;
      } else {
        priceStr = 0;
        numberStr = 0;
      }

      if (isDot(priceStr)) {
        priceStr = Number(priceStr.toFixed(2));
      }
    }

  }


  return {
    type: types.SETSHOPPINGCARTLIST,
    shopCartLit: tempAry,
    priceString: Number(priceStr),
    allSelectImag: allSelect ? status : !status,
    numberShopCart: numberStr
  }
}
























