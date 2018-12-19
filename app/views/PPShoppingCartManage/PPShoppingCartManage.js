/**
 * Created by nipeng on 2017/7/10.
 * 购物袋view
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './PPShoppingCardManage.less';
import '../../../common/styles/common.less'
import { SwipeAction, List, Toast, ListView, Modal } from 'antd-mobile';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import PopularRecommendation from '../SearchResult/popularRecommendation';//热门推荐
import { wxShare } from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg';
import * as weidudb from '../../../common/Apis/weiduInteractive';
import Header from '../components/header';
// import LikeList from '../components/likeGoods';
const alert = Modal.alert;
// import * as Util from '../../../common/Apis/Utils';

export default class PPShoppingCartManage extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    var localUrl = location.search;
    let theRequest = db.getValueFromUrl(localUrl)
    this.colorDic = contants.viewStyDic;
    this.state = {
      height: document.documentElement.clientHeight,
      repertoryStr: '',
      isUserId: true,
      goodsNumber: 0,
      userId: '',
      shopCartLit: [],
      shopId: theRequest['shopId'],
      dataSource: ds.cloneWithRows([])
    }
  }

  componentWillMount() {
    const { history } = this.props;
    let userInfo = db.readUserInfo();
    weidudb.userAuthorization();//调用原生方法获取用户信息 
    document.title = '购物车';
    if (!userInfo) {
      let url = contants.commonUrl + '/login/?path=PPShoppingCart'
      history.replace({
        pathname: url,
      })
    }
  }

  componentWillUnmount() {
    if (this.alertObject) {
      this.alertObject.close();
    }
  }

  stopDrop() {
    var lastY;//最后一次y坐标点
    $(document.body).on('touchstart', function (event) {
      lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
    });
    $(document.body).on('touchmove', function (event) {
      var y = event.originalEvent.changedTouches[0].clientY;
      var st = $(this).scrollTop(); //滚动条高度
      if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
        lastY = y;
        event.preventDefault();
      }
      lastY = y;

    });
  }

  componentDidMount() {
    //获取推荐的猜你喜欢
    if (this.lv) {
      let hei = document.getElementsByClassName('am-list-view-scrollview-content')[0].style.height;
      this.setState({
        height: hei,
      });
    }
    this.stopDrop()
    wxShare([], {});
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    let userInfo = db.readUserInfo();
    //测试----
    userInfo = {
      // wedoId:"12499315",
      wedoId: userInfo ? userInfo.wedoId : '',
    };
    if (userInfo === null) {
      let shopCartList = db.readGoods()
      let tempAry = [];
      if (shopCartList !== null) {
        tempAry = shopCartList;
        tempAry = tempAry.reverse();
      }
      this.setState({
        isUserId: false,
      })
      //  PPShoppingCartAction.setShoppingCartList(tempAry);
    } else {
      this.setState({
        isUserId: true,
        userId: userInfo.wedoId
      })
      let url = '/shopping/getShoppingCartInfo';
      //测试++++
      let data = {
        // userId:"12497395",
        userId: userInfo.wedoId
      }
      //初始化加载购物车列表
      PPShoppingCartAction.getShoppingCartPost(url, data);
    }

  }

  listCell(row, rowIndex) {
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    let that = this;
    if (row.goodsList.length == 0) return null;//防止只出现店铺没有商品
    return (
      <div className="shopListModule" key={rowIndex}>
        <div className="themeStyle">
          <div className="selectIcons" onClick={this.changeSelectState.bind(this, PPShoppingCartReducer.shopCartLit, row.shopSelected, rowIndex, 0, 2)}>
            {row.shopSelected ? <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon" />
              : <img src={require('../../images/shippingAddress/k11.png')} />}
          </div>
          {/* <div className="shopName" onClick={this.toShopDeatail(this,row.shopId)}> */}
          <p className="storyTextStyle" onClick={this.toShopPage.bind(this, row.shopId, row.shopType)}>{db.cutOutStr(row.shopName, 12)}</p>
          <SvgImg xlinkHref="#wedo-wedoicon-20" onClick={this.toShopPage.bind(this, row.shopId, row.shopType)} className="rightIcon" />
          {/* </div>  */}
          <div className="shanchuDicStyle" onClick={() => { this.deleShoppingAction(row, rowIndex, 0, PPShoppingCartReducer.shopCartLit, 2) }}>
            <SvgImg xlinkHref="#wedo-wedoicon-22" className="deleteIcon" />
          </div>
        </div>
        {
          row.goodsList.map((item, index) => {
            if (item) {
              //  console.log(index,item.goodsName);
              return (
                <SwipeAction
                  autoClose
                  right={[
                    {
                      text: '取消',
                      style: { backgroundColor: '#E9E9E9', color: '#6D6D72', width: '1.6rem', fontSize: '0.373rem' },
                    },
                    {
                      text: '删除',
                      onPress: () => this.deleShoppingAction(item, rowIndex, index, PPShoppingCartReducer.shopCartLit, 1),
                      style: { backgroundColor: '#B4282D', color: '#fff', width: '1.6rem', fontSize: '0.373rem' },
                    },
                  ]}
                  onOpen={() => console.log('global open')}
                  onClose={() => console.log('global close')}
                  key={index}
                >
                  <div className="liMainStyle" key={index}>
                    <div className="cellDivStyle">
                      {item.status == 4 || item.status == 2 || item.isJoin == 1 ? <div className="selectIcons" onClick={() => { }}><img src={require('../../images/shoppingCardPage/Oval@1x.png')} /></div> :
                        <div className="selectIcons" onClick={this.changeSelectState.bind(this, PPShoppingCartReducer.shopCartLit, item.goodsSelected, rowIndex, index, 1)}>
                          {item.goodsSelected ? <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon" />
                            : <img src={require('../../images/shippingAddress/k11.png')} />}
                        </div>
                      }

                      <div className="shopImages" onClick={this.toDetail.bind(this, row.shopId, item.goodsId)}>
                        <img src={item.zoomUrl} />
                        {item.status == 4 ? <img className="loseImagess" src={require('../../images/goodDetails/o1@1x.png')} /> : null}
                      </div>

                      <div className="contentStyles" onClick={this.toDetail.bind(this, row.shopId, item.goodsId)}>
                        <div className="nameDivStyle">
                          <p className="themeStyless">{db.cutOutStr(item.goodsName, 12)}</p>
                        </div>
                        <p className="pColorStyles">
                          {
                            item.bodyType ?
                              item.bodyType.map((typeItem, index) => {
                                return typeItem.name ? <span key={index}>{typeItem.type}:{typeItem.name}</span> : null
                              })
                              : null
                          }
                        </p>
                        <div className="priceAndRepertorys">
                          <div className="priceModule">
                            <div className="price clear">
                              {item.isJoin == 1 ? <span className="joinIcon">团</span> : <span></span>}
                              <i><b>￥</b>{item.price}</i>
                              {item.isJoin == 1 ? <a>￥{item.linePrice}</a> : null}
                            </div>
                          </div>
                          <div className="repertoryStyleps">
                            <button className="minusStyle" onClick={(e) => {
                              let ee = e || window.event;
                              ee.stopPropagation(); that.changeNumberAction(item, rowIndex, index, PPShoppingCartReducer.shopCartLit, item.shopId, item.number, 1)
                            }}>-</button>
                            <input className="numStyle" onClick={(e) => {
                              let ee = e || window.event; ee.stopPropagation();
                            }} value={item.number} type="number" />
                            {/* <input className="numStyle" data-number={item.number} value={item.number} onFocus={(e)=>this.changeNumberBefore(this,e,item.number)} onClick={(e)=>{
                                                        let ee = e||window.event;ee.stopPropagation(); }} onChange={(e)=>this.setGoodsNumber(e)}
                                                        onBlur={(e) => this.getGoodsNumber.bind(this,e,item,rowIndex,index,PPShoppingCartReducer.shopCartLit,item.shopId,item.number,3)} type="number" /> */}
                            <button className="plusSignStyle" onClick={(e) => {
                              let ee = e || window.event; ee.stopPropagation(); that.changeNumberAction(item, rowIndex, index, PPShoppingCartReducer.shopCartLit, item.shopId, item.number, 2)
                            }}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwipeAction>
              )
            }
          }
          )
        }
      </div>
    )
  };

  render() {
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    let tempStyle = PPShoppingCartReducer.shopCartLit.length === 0 ? "containerTwo" : "containerOne";
    //const dataSource = this.state.dataSource.cloneWithRows(PPShoppingCartReducer.shopCartLit);
    let that = this;
    let shopList = PPShoppingCartReducer.shopCartLit;
    console.log(PPShoppingCartReducer)
    return (
      <div className="containerShop">
        {/* <Header titleTxt="购物车"></Header> */}
        <div className="rebate_envelopes">本单可返现红包金额：￥{PPShoppingCartReducer.cashBack}</div>
        <div className={tempStyle}>
          {PPShoppingCartReducer.shopCartLit.length === 0 && PPShoppingCartReducer.isEmpty ?
            <div className="PPnoAddress">
              <img className="whiteImgStyle" src={require('../../images/shoppingCardPage/noShopCart_Icon.png')} />
              {/*<p>暂无商品</p>*/}
              <p className="whiteTitleStyle">您的购物车没有商品，去商城看看~</p>
              {/* <p className={"goShopStyle"+' '+specialR} style={{background:this.colorDic['COLOR1'],color:this.colorDic['COLOR3']}} onClick={()=>{this.addShopCartAction()}}>去购物</p> */}
              <p className="goShopStyle" onClick={() => { this.addShopCartAction() }}>去购物</p>
              {/* <div className="whiteViewStyle"></div> */}
            </div> :
            <div>
              {shopList.length > 0 ? shopList.map((shopItme, index) => {
                return this.listCell(shopItme, index);
              }) : null}
            </div>
          }
        </div>
        <PopularRecommendation {...this.props} shopId={this.state.shopId} titleType="1" />
        {PPShoppingCartReducer.shopCartLit.length === 0 ? null : <div className="bottemView">
          <div onClick={this.changeSelectState.bind(this, PPShoppingCartReducer.shopCartLit, PPShoppingCartReducer.allSelectImag, 0, 0, 3)}>
            {PPShoppingCartReducer.allSelectImag ? <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon" /> :
              <img src={require('../../images/shippingAddress/k11.png')} />}
          </div>

          <p className="allSelect">全选</p>
          <p className="allTotal"><span className="heji">合计：</span><icon>￥</icon><span className="payedMoney">{PPShoppingCartReducer.priceString}</span></p>
          {PPShoppingCartReducer.priceString == 0 || PPShoppingCartReducer.priceString > contants.maxPrice ? <button className="PPaccountButtons" style={{ background: "#ddd" }}>去结算</button>
            : <button className="PPaccountButtons" onClick={() => { this.accountAction() }}>去结算</button>}

        </div>}
        {/* {PPShoppingCartReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div> :null} */}

      </div>

    )
  }

  addShopCartAction() {
    // 去添加商品
    const { history } = this.props;
    history.push({
      pathname: contants.commonUrl + '/index'
    });
  }

  onEndReached() {
    const { SearchResult } = this.props;
    console.log("下拉加载更多....");
    // if (SearchResult.isLoading || !SearchResult.hasMore) {
    //   return;
    // }
    // console.log('reach end');
    // this.search()
  }

  bottomCellView() {
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    var that = this;
    return (
      PPShoppingCartReducer.recommendList.map(function (data, i) {
        return (
          <li key={i} onClick={() => { that.selectCellRemond(data, 2) }}>
            <img src={data.hostUrl + data.fileUrl} />
            <p className="itmeName">{data.goodName}</p>
            <p className="itmeMoney">￥{data.price}</p>
          </li>
        )
      })
    )
  }

  //跳转到结算页面
  accountAction() {
    contants.createOrderData = {}//清空本地订单数据
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    let shopList = [];
    //  let temp = []
    for (let i = 0; i < PPShoppingCartReducer.shopCartLit.length; i++) {
      let shopTempDic = PPShoppingCartReducer.shopCartLit[i];
      let tempDic = {};
      let shopCount = 0;
      let shopPay = 0;
      if (this.state.isUserId) { //登录过
        if (shopTempDic.shopSelected) { //该店铺选中了
          let shopTemp = {
            shopId: shopTempDic.shopId,
            shopName: shopTempDic.shopName,
            shopType: shopTempDic.shopType,
            amount: 0,
            goodsAllCount: 0,
            payAmount: 0,
            leaveMsg: '',
            goodsList: [],
          }
          if (shopTempDic.goodsList) {
            for (let j = 0; j < shopTempDic.goodsList.length; j++) {
              let goodsTempDic = shopTempDic.goodsList[j];
              if (goodsTempDic.goodsSelected && goodsTempDic.isJoin == 0) { // 选中了该商品
                shopCount += goodsTempDic.number;
                let goodsTemp = {
                  goodNam: goodsTempDic.goodsName,
                  goodsId: goodsTempDic.goodsId,
                  number: goodsTempDic.number,
                  param1: goodsTempDic.param1,
                  param2: goodsTempDic.param2,
                  param3: goodsTempDic.param3,
                  zoomUrl: goodsTempDic.zoomUrl,
                  price: goodsTempDic.price,
                  oriPrice: goodsTempDic.linePrice, //原价
                  flagShip: goodsTempDic.flagshipId,
                  isInCart: 1,
                  groupActId: goodsTempDic.combinationId,
                  isIngroup: goodsTempDic.isJoin,
                  //stock:goodsTempDic.stock,
                  shopId: goodsTempDic.shopId,
                  bodyType: goodsTempDic.bodyType,
                  // shopName:goodsTempDic.shopName, 
                  // goodSpecification:tempDic.sizeString, 
                  buyType: 0,   //购买类型,1团购,0普通商品
                  // groupId:1
                }
                shopTemp.goodsList.push(goodsTemp);
                shopPay += Number(goodsTempDic.price) * Number(goodsTempDic.number)
              }
            }
          }
          // shopTemp.goodsList = goodsList;
          shopTemp.amount = shopPay;
          shopTemp.payAmount = shopPay;
          shopTemp.goodsAllCount = shopCount;
          shopList.push(shopTemp);
        }
      } else {
        shopList.push(tempDic);
      }
    }
    if (shopList.length === 0) { // 未选中商品
      alert("未选中商品");
    }
    if (!this.state.isUserId) {
      const { history } = this.props;
      history.push({
        pathname: contants.commonUrl + '/login' + '/?shopId=' + this.state.shopId,
        state: {
          type: 2,
          goodInfo: shopList
        }
      });
    } else {
      // 去结算
      this.props.history.push({
        pathname: contants.commonUrl + '/settlement/?goodInfo=' + JSON.stringify(shopList),
        state: {
          goodInfo: shopList
        }
      });
      contants.cartData = shopList;
    }
  }

  // changeNumberBefore(e,number){
  //     e.target.value = "";
  // }
  // //手动修改 商品的数量
  // setGoodsNumber(e){
  //     let inputValue = e.target.value;
  //     e.target.dataset.number = inputValue;
  // }
  // getGoodsNumber(e,item,rowIndex,index,shopCartLit,shopId,number,changeType){
  //     alert(2323);
  //     number =  e.target.dataset.number;
  //     this.changeNumberAction(item,rowIndex,index,shopCartLit,shopId,number,changeType);
  // }
  //更改商品的数量 type 1：减少 2：增加 3:手动修改
  changeNumberAction(data, rowIndex, goodsIndex, shopCartLit, shopId, number, changeType) {
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    //   if(data.status === 4) return; //已售罄 和 团购的商品 是否可更改数量 ，待确认
    if (changeType === 1) { // 商品数
      if (number === 1) {
        return;
      }
      number = number - 1;
    } else if (changeType === 2) {
      number = number + 1;
    } else if (changeType === 3) {
      number = number;
      return;
    } else {
      return;
    }

    if (this.state.isUserId) {
      let url = '/shopping/shopnumber';
      let body = {
        userId: this.state.userId,
        combinationId: data.combinationId,
        number: number,
        goodsId: data.goodsId,
        shopId: shopId,
      }
      PPShoppingCartAction.setShoppingNuberPost(url, body, number, data, rowIndex, goodsIndex, shopCartLit, this.state.isUserId, Number(PPShoppingCartReducer.priceString), changeType, Number(PPShoppingCartReducer.numberShopCart));
    } else {
      PPShoppingCartAction.setNumberAction(data, rowIndex, number, shopCartLit, this.state.isUserId, data.stock, Number(PPShoppingCartReducer.priceString), changeType, Number(PPShoppingCartReducer.numberShopCart));
    }
  }


  //弹出是否删除弹出框
  deleShoppingAction(data, shopIndex, goodsIndex, list, type) {
    this.alertObject = alert('', '确认要删除商品?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.dodDeleShoppingAction(data, shopIndex, goodsIndex, list, type) },
    ])
  }

  //删除店铺、商品
  dodDeleShoppingAction(data, shopIndex, goodsIndex, list, type) {
    const { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    let userInfo = db.readUserInfo();
    let tempData = data;
    let priceStr = Number(PPShoppingCartReducer.priceString);
    if (this.state.isUserId) {  // 登录删网络
      let url = '/shopping/deleteshop';
      let body = {};
      if (type === 1) { // 删除单个商品
        body = {
          userId: userInfo.wedoId,
          goodsId: JSON.stringify([{
            goodsId: data.goodsId,
            combinationId: data.combinationId
          }])
        }
      }

      if (type === 2) { // 删除店铺下选中的一个或者多个商品
        let deleDate = [];
        if (data.goodsList) {
          let goods = data.goodsList;
          for (let i = 0; i < goods.length; i++) {
            if (goods[i].goodsSelected) {
              let deleDic = {}
              deleDic.goodsId = goods[i].goodsId;
              deleDic.combinationId = goods[i].combinationId;
              deleDate.push(deleDic)
            }
          }
        }
        // console.log("删除的goods",deleDate);
        if (deleDate.length === 0) {
          Toast.info('请先选择商品，可批量删除哦~', 1);
          return;
        }
        tempData = deleDate;
        body = {
          userId: userInfo.wedoId,
          goodsId: JSON.stringify(deleDate)
        }
      }

      PPShoppingCartAction.deletaShoppingCartPost(url, body, tempData, shopIndex, goodsIndex, list, priceStr, PPShoppingCartReducer.allSelectImag, this.state.isUserId, Number(PPShoppingCartReducer.numberShopCart), type);
    } else {   // 没登录删缓存
      if (type === 2) {
        let deleDate = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].selected) {
            let deleDic = {}
            deleDic.goodsId = data[i].goodsId;
            deleDic.combinationId = data[i].combinationId;
            deleDate.push(deleDic)
          }
        }

        if (deleDate.length === 0) {
          Toast.info('请先选择商品，可批量删除哦~', 1);
          return;
        }

      }

      PPShoppingCartAction.setDelectList(data, list, i, priceStr, allSelectImg, this.state.isUserId, Number(PPShoppingCartReducer.numberShopCart))
    }

  }

  selectCellRemond(data, type) {
    // 点击了cell 跳转到商品详情
    let shopId = this.state.shopId;
    let goodId = data.goodsId;
    // 需要传用户id 店铺id 商品id
    const { history } = this.props;
    let url = contants.commonUrl + '/goodDetails' + '/?shopId=' + shopId + '&goodsId=' + goodId
    // console.log(url)
    history.push({
      pathname: url,
      state: {
      }
    });
  }

  //店铺的选中 函数  1、商品 2、店铺 3、全选
  changeSelectState(shopCartList, selectBoolen, shopIndex, goodsIndex, type) {
    let { PPShoppingCartReducer, PPShoppingCartAction } = this.props;
    PPShoppingCartAction.setChangeShopCart(shopCartList, selectBoolen, shopIndex, goodsIndex, type, PPShoppingCartReducer.priceString, PPShoppingCartReducer.cashBack, PPShoppingCartReducer.allSelectImag);
  }

  //返回上一级
  goBack() {
    history.back()
  }

  //商品详情
  toDetail(shopId, productId) {
    //alert("这里缺少店铺是哪个....");
    let goodDetailUrl = contants.multishopUrl + `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    db.goodsViewNum(productId, goodDetailUrl, true);
  }

  //调转到店铺详情
  toShopPage(shopId, shopType) {
    let shopDetailUrl = "";
    //let shopType = 1;
    if (shopType == 1) {
      //alert(contants.fenXiaoUtl+`/retail/?shopId=${shopId}`);
      shopDetailUrl = contants.multishopUrl + `/retailPage/?shopId=${shopId}`;
    } else {
      shopDetailUrl = contants.multishopUrl + `/shopDetail/?shopId=${shopId}`;
    }
    db.goToPageForApp(shopDetailUrl, false);
  }
}



