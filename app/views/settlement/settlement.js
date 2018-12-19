/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './settlement.less';
import SCommodity from './settlementCommodity';//商品列表
import { Picker, Button, Modal, Icon } from 'antd-mobile';
import { wxShare } from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';
import Header from '../components/header';
import { isAbsolute } from 'path';
let repetitionClick = false;
const alert = Modal.alert;
//送货时间
let district = [{
  label: '随时',
  value: '1'
}, {
  label: '工作日',
  value: '2'
}, {
  label: '非工作日',
  value: '3'
}];
const CustomChildren = props => (
  <div onClick={props.onClick} className="settmentAddress">
    <div className="setAddress">
      <label className="addressText" className="timeLabel">{props.children}</label>
      <div className="addressRight" style={{ marginRight: '0' }}>
        <label className="timeLabel">{props.extra}</label>
        <img src={require('../../images/settlement/arrowRight.png')} />
      </div>
    </div>
  </div>
);
export default class Settlement extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      district: district,
      isLoading: true,
      pickerText: contants.createOrderData.lastCreateOrderRequestData ? [contants.createOrderData.lastCreateOrderRequestData.sendType.toString()] : '',
      pickerValue: 1,
      unsaved: true,
      isShow: false,
      selectAddress: null,
      leveMsg: '',
      Msg: contants.createOrderData.lastCreateOrderRequestData ? contants.createOrderData.lastCreateOrderRequestData.leaveMsg : '',
      settlementList: [],
    };
    this.colorDic = contants.viewStyDic;
    this.theRequest = db.getValueFromUrl();
  }
  //页面渲染前
  componentWillMount() {
    const { history } = this.props;
    if (db.userAgent() === 'Android') {
      document.title = '订单结算';
    } else {
      db.setPageTitle('订单结算');
    }
    wxShare([], {});
    let userInfo = db.readUserInfo();
    if (!userInfo) {
      history.replace({
        pathname: contants.commonUrl + '/login/?path=settlement&userId=' + this.theRequest['userId'] + '&goodInfo=' + this.theRequest['goodInfo']
      })
    }
    if (userInfo && this.theRequest['userId'] && this.theRequest['userId'] != userInfo.userId) { // 判断分享出去的页面是否本人登录
      alert('您无权查看此交易');
      setTimeout(() => {
        history.replace({
          pathname: contants.commonUrl + '/index'
        })
      }, 3000)
    }
  }
  componentWillUnmount() {
    repetitionClick = false;
    // contants.addressInfo=null;
    this.props.SettlementActions.defaultAddressData(null);
    if (contants.alertInstance) {
      contants.alertInstance.close();
    }
  }
  componentDidMount() {
    //console.log(this.props);
    const { SettlementActions } = this.props;
    let userInfo = db.readUserInfo();
    //测试---
    // userInfo = {
    //     userId:'12497395',
    //     wedoId:'12497395',
    // }
    let data = {
      userId: userInfo.userId
    };
    wxShare([], {});
    if (!contants.addressInfo) {
      SettlementActions.defaultAddress("/adress/getAddress", data, () => { }, () => { });
    }
    let h = $(window).height();
    $(window).resize(function () {
      if ($(window).height() < h) {
        $('.settlementbottrom').hide();
      }
      if ($(window).height() >= h) {
        $('.settlementbottrom').show();
      }
    });

    let goodInfo = this.getGoodsInfo(JSON.parse(decodeURI(this.theRequest['goodInfo'])));
    // console.log("下单信息----",goodInfo);

    this.setState({
      settlementList: goodInfo
    })

  }
  //是否回到上个页面
  goPreviousPage() {
    this.props.history.goBack();
  };
  //获取商品信息
  getGoodsInfo(state) {
    let info;
    if (!state) {
      info = contants.goodsDetailData;
    } else {
      info = state;
    }
    return info;
  }
  getPrice(param) {
    if (this.theRequest['goodInfo']) {
      let goodInfo = this.getGoodsInfo(JSON.parse(decodeURI(this.theRequest['goodInfo'])));
      let price = 0;
      goodInfo.map((item, i) => {
        if (item.goodsList) {
          for (let i = 0; i < item.goodsList.length; i++) {
            let goodsObj = item.goodsList[i];
            if (param == 2) {
              price += Number(goodsObj.oriPrice) * Number(goodsObj.number);
            } else {
              price += Number(goodsObj.price) * Number(goodsObj.number);
            }
          }
        }
      });
      let priceArr = String(price).split('.');
      return priceArr.length > 1 ? price.toFixed(2) : price;
    }
  }
  render() {
    let borderR;
    let goodInfo;
    if (this.colorDic['SHAPE'] == 3) {
      borderR = 'btnSemicircle';
    } else if (this.colorDic['SHAPE'] == 2) {
      borderR = 'btnCircular';
    } else {
      borderR = 'btnNoCircular';
    }
    const { Settlement } = this.props;
    //  console.log("this.props.location里面的内容...",this.props.location);
    if (this.theRequest['goodInfo']) {
      goodInfo = this.getGoodsInfo(JSON.parse(decodeURI(this.theRequest['goodInfo'])));
    }

    let that = this;
    let AddressData = contants.addressInfo ? contants.addressInfo : Settlement.defaultAddress;
    // console.log("goodInfo信息",this.props.location.state.goodInfo);
    return (
      <div className="settlementBody">
        {/* <Header titleTxt="订单结算"></Header> */}
        <div className="dressModule">
          {AddressData === null ? <div className="addressSet settlementList" onClick={() => { this.goAddress() }}>
            <label className="addressText">收货地址</label>
            <div className="addressRight">
              <label className="titleTxt">请添加收获地址</label>
              <img src={require('../../images/settlement/arrowRight.png')} />
            </div>
          </div> : <div className="addressSet settlementList" onClick={() => { this.goAddress() }}>
              {/* <div className="chooseAddress"> */}
              <lable className="addressText">
                {/* <img src={require('../../images/settlement/b24@1x.png')} /> */}
                <span >{AddressData.receiveName}</span><span>{AddressData.phone}</span>
                <div className="ad_dress overTxtOne">{AddressData.shopAdress}</div>
              </lable>
              <div className="addressRight">
                <label style={{ color: "#B6B6B8" }}>默认</label>
                <img src={require('../../images/settlement/arrowRight.png')} />
              </div>
              {/* </div> */}
            </div>}
          <div className="dressIcon"><img src={require('../../images/settlement/dressIcon.png')} /></div>
        </div>

        {goodInfo.length === 0 ? <div> 请先选中你要购买的商品....</div> :
          goodInfo.map((shopItem, shopIndex) => {
            return (
              <div className="commodityList" key={shopIndex}>
                <div className="commodityListTitle">
                  <label className="titleTxt">{db.cutOutStr(shopItem.shopName, 12)}</label>
                </div>

                {shopItem.goodsList.map((goodsItem, goodsIndex) => {
                  return (
                    <SCommodity goodInfo={goodsItem} key={goodsIndex} />
                  )
                })}

                <div className="settlementList">
                  <div className="setItem">
                    <p className="txt">留言：</p>
                    <input type="text" ref="inp" placeholder="工作日无人在家，务必安排周末送货！" data-msg={shopItem.leaveMsg} maxLength="20" onChange={(e) => this.setLeveMsg(e)} onBlur={(e) => this.getLeveMsg(e, shopIndex)} value={this.stateMsg} />
                    {/* {this.state.Msg?
                                            <span onClick={()=>{this.removeText()}} style={{background:'white'}}>
                                                <img src={require('../../images/shippingAddress/n6@1x.png')} />
                                            </span>:null
                                        } */}
                  </div>
                  <div className="setItem">
                    <p className="txt">小计：</p>
                    <p className="priceRight"><icon>￥</icon><span>{shopItem.payAmount}</span></p>
                  </div>
                </div>
              </div>
            )
          })
        }
        <Picker
          data={this.state.district}
          extra="随时"
          cols={1}
          onOk={(val) => { this.setState({ pickerValue: val[0] }); console.log(val[0]) }}
          value={this.state.pickerText}
          onChange={v => this.setState({ pickerText: v })}
          onDismiss={() => { this.setState({ pickerText: "", pickerValue: null }) }}
        >
          <CustomChildren>送货时间</CustomChildren>
        </Picker>
        <div className="spaceDiv"></div>
        <div className="settlementbottrom bottom">
          <div className="Sleft">
            <span className="heji">合计：</span><span className="allPrice"><icon>￥</icon>{this.getPrice(1)}</span>
          </div>
          <button onClick={() => { this.goPayment() }} onClick={() => { this.goPayment() }} className={AddressData ? "ablePayBtn" : "unAblePayBtn"}>去支付</button>
        </div>
        {Settlement.isShowLoading ? <div className="loadingView"><div className="loadingImg"></div></div> : null}
      </div>
    )
  }
  //留言。。。。
  setLeveMsg(e) {
    let inputValue = e.target.value;
    e.target.dataset.msg = inputValue;
  }
  getLeveMsg(e, shopIndex) {
    // alert(e.target.dataset.msg);
    let msgStr = e.target.dataset.msg;
    let settlementList = this.state.settlementList;
    settlementList[shopIndex].leaveMsg = msgStr;
    this.setState({
      settlementList: settlementList
    })
  }

  goBack() {
    history.back();
  }
  removeText() {
    this.refs.inp.focus();
    this.setState({
      Msg: ''
    })
  }
  //下单-----
  goPayment() {
    if (repetitionClick) {
      return;
    }
    repetitionClick = true;
    const { SettlementActions, Settlement, location } = this.props;
    const goodInfo = this.state.settlementList;
    let userInfo = db.readUserInfo();
    //测试----
    let AddressData = contants.addressInfo ? contants.addressInfo : Settlement.defaultAddress;
    if (!AddressData) {
      contants.alertInstance = alert('提示', '请选择收货地址', [
        { text: '确定', onPress: () => { }, style: 'default' }
      ]);
      repetitionClick = false;
      return;
    }
    let shopList = [];
    goodInfo.map((shopItem) => {
      let goodsList = [];
      if (shopItem.goodsList) {
        shopItem.goodsList.map((goodsItem) => {
          let goodsObj = {
            goodsId: goodsItem.goodsId,
            groupActId: goodsItem.groupId ? goodsItem.groupId : 1,
            param1: goodsItem.param1,
            param2: goodsItem.param2,
            param3: goodsItem.param3,
            goodsNum: goodsItem.number,
            flagShip: goodsItem.flagShip,
            factMoney: goodsItem.price,
            isInCart: goodsItem.isInCart,
            isIngroup: goodsItem.isIngroup,
            pictureUrl: goodsItem.zoomUrl,
            shouldMoney: goodsItem.oriPrice ? goodsItem.oriPrice : goodsItem.price,
          }
          goodsList.push(goodsObj);
        })
      }
      //goodsAllCount+=Number(val.number);
      let shopsInfo = {
        shopId: shopItem.shopId,
        shopType: shopItem.shopType,
        amount: shopItem.payAmount,
        payAmount: shopItem.payAmount,
        goodsAllCount: shopItem.goodsAllCount,
        leaveMsg: shopItem.leaveMsg,
        goods: goodsList
      }
      shopList.push(shopsInfo);
    });

    let requestData = {
      userId: userInfo.wedoId,
      addressId: AddressData.receiveId,
      sendType: this.state.pickerText[0] ? Number(this.state.pickerText[0]) : 1,
      shoppingInfo: shopList,
    };

    let lastCreateOrderRequestData = contants.createOrderData.lastCreateOrderRequestData;
    let lastAddressData = contants.createOrderData.AddressData;
    if (lastCreateOrderRequestData && lastCreateOrderRequestData.addressId === requestData.addressId && lastCreateOrderRequestData.leaveMsg === requestData.leaveMsg
      && lastCreateOrderRequestData.sendType === requestData.sendType && lastAddressData.shopAdress === AddressData.shopAdress &&
      lastAddressData.adress === AddressData.adress && lastAddressData.phone == AddressData.phone
      && lastAddressData.receiveName == AddressData.receiveName
    ) {//不产生新订单
      repetitionClick = false;
      let res = contants.createOrderData.lastOrder;//上次订单信息
      let orderSonId = res.sonOrderId ? res.sonOrderId : 0
      let orderDetailUrl = contants.commonUrl + '/orderDetail/?orderId=' + res.orderId + '&orderSonId=' +
        orderSonId + '&shopId=' + goodInfo[0].shopId
      let buyType = 0;
      if (goodInfo.length == 1 && goodInfo[0].goodsList.length == 1 && goodInfo[0].goodsList[0].buyType == 1) {
        buyType = 1;
      }
      contants.isJumpToPayment = true;

      console.log('buy type is ' + buyType)
      this.props.history.push({
        pathname: orderDetailUrl,
        state: {
          orderId: res.orderId,
          sonOrderId: res.sonOrderId,
          shopId: goodInfo[0].shopId,
          buyType: buyType,
          money: this.getPrice(1),
          orderNumber: res.orderNumber,
        }
      });
    }
    else {
      let buyType = 0;
      if (goodInfo.length == 1 && goodInfo[0].goodsList.length == 1 && goodInfo[0].goodsList[0].buyType == 1) {
        buyType = 1;
      }
      let webOrderUrl = contants.reqUrl + "/webOrder/createOrder";
      SettlementActions.goToPay(webOrderUrl, JSON.stringify(requestData), (res) => {
        if (res.status == -1) {
          alert(res.msg);
          return false;
        }
        contants.createOrderData.lastOrder = res;
        contants.createOrderData.lastCreateOrderRequestData = requestData;
        contants.createOrderData.AddressData = AddressData;//地址是否变化
        contants.isJumpToPayment = true;
        // let orderSonId=res.body.sonOrderId?res.sonOrderId:0
        let orderSonId = 0;
        let orderInfo = res.orderInfo[0];
        let payInfo = res.payMap;
        // console.log("下单返回",requestData);
        // let orderDetailUrl = contants.commonUrl+'/orderDetail/?orderId='+orderInfo.orderId+'&orderSonId=' + orderSonId;
        // return;
        let paymentUrl = contants.commonUrl + '/payment';
        repetitionClick = false;
        if (orderInfo.orderId) {
          db.deleteGoods(goodInfo);
          this.props.history.push({
            pathname: paymentUrl,
            state: {
              orderId: orderInfo.orderId,
              appNeedData: payInfo,//加入新字段的一个对象（SH）
              sonOrderId: orderSonId,
              //shopType:orderInfo.shopType,
              buyType: buyType,
              money: this.getPrice(1),
            }
          });
        }
      }, (err) => {
        repetitionClick = false;
      });
    }
  }
  //跳转地址页面
  goAddress() {
    // let addressUrl= contants.flagshipUrl+'/addressList';
    // db.goToPageForApp(addressUrl);
    const { history } = this.props;
    history.push({
      pathname: contants.commonUrl + '/addressList',
      state: {
        pageType: "settlement",
        // selectAddress:(address)=>{
        //     this.selectAddress(address)
        // }
        newAdress_sh: "add_new_adress"
      }
    });
  };
  //计算小计
  confirm(e) {
    e.preventDefault();
    const { SearchResultActions, SearchResult } = this.props;
    let key = SearchResult.keyWord.trim();
    if (key.length === 0) {
      return
    }
    let history = JSON.parse(localStorage.getItem("historicalSearch") || JSON.stringify([]));
    let index = -1;
    for (let i = 0; i < history.length; i++) {
      if (history[i].searchName === SearchResult.keyWord) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      history.splice(index, 1);
    }
    history.unshift({ searchName: SearchResult.keyWord });
    if (history.length > 10) {
      history.length = 10;
    }
    localStorage.setItem('historicalSearch', JSON.stringify(history))
    //  this.search();

    if (SearchResult.searchType === 1) {
      let goodsData = {
        keyword: SearchResult.keyWord,
        shopId: '',
        platformType: 2,
        sortType: params && params.rankType > -1 ? params.rankType : SearchResult.rankType,
        minPrice: this.state.startPrice,
        maxPrice: this.state.endPrice,
        currentPage: 1
      }
      SearchResultActions.search('/search/searchCloudGoods', goodsData)
    } else {
      let shopData = {
        platformType: 2,
        keyword: SearchResult.keyWord,
        sortType: 1,
        currentPage: 1
      }
      SearchResultActions.search('/search/searchCloudShop', shopData)
    }

  }
}