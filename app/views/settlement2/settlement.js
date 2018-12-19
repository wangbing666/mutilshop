/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './settlement.less';
import SCommodity from './settlementCommodity';//商品列表
import { Picker, Button, Modal } from 'antd-mobile';
import { wxShare } from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
let repetitionClick = false;//重复点击
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
  // <div onClick={props.onClick} className="settmentAddress">
  //     <label className="addressText">{props.children}</label>
  //     <div className="addressRight">
  //         <label>{props.extra}</label>
  //         <img src={require('../../images/settlement/arrowRight.png')}/>
  //     </div>
  // </div>
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
export default class Settlement2 extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      district: district,
      isLoading: true,
      pickerText: contants.createOrderData.lastCreateOrderRequestData ? [contants.createOrderData.lastCreateOrderRequestData.sendType.toString()] : '',
      pickerValue: null,
      unsaved: true,
      isShow: false,
      selectAddress: null,
      Msg: contants.createOrderData.lastCreateOrderRequestData ? contants.createOrderData.lastCreateOrderRequestData.leaveMsg : '',
    };
    this.colorDic = contants.viewStyDic;
    this.theRequest = db.getValueFromUrl();
  }
  //页面渲染前
  componentWillMount() {
    const { history } = this.props
    wxShare([], {});
    let userInfo = db.readUserInfo();
    if (!userInfo) {
      history.replace({
        pathname: contants.commonUrl + '/login/?path=settlement2&userId=' + this.theRequest['userId'] + '&goodInfo=' + this.theRequest['goodInfo']
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
    document.title = '订单结算';
    db.setPageTitle('订单结算');
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
    const { SettlementActions } = this.props;
    let userInfo = db.readUserInfo();
    let data = {
      userId: userInfo ? userInfo.userId : ''
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
  }
  //是否回到上个页面
  goPreviousPage() {
    this.props.history.goBack();
  };
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
      goodInfo.map((val, i) => {
        if (param == 2) {
          price += Number(val.oriPrice) * Number(val.number);
        } else {
          price += Number(val.price) * Number(val.number);
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
    if (this.theRequest['goodInfo']) {
      goodInfo = this.getGoodsInfo(JSON.parse(decodeURI(this.theRequest['goodInfo'])));
    }

    let that = this;
    let AddressData = contants.addressInfo ? contants.addressInfo : Settlement.defaultAddress;
    return (
      <div className="settlementBody">
        <div className="dressModule">
          {AddressData === null ? <div className="addressSet settlementList" onClick={() => { this.goAddress() }}>
            <label className="addressText">收货地址</label>
            <div className="addressRight">
              <label>请添加收获地址</label>
              <img src={require('../../images/settlement/arrowRight.png')} />
            </div>
          </div> : <div className="addressSet settlementList" onClick={() => { this.goAddress() }}>
              <lable className="addressText">
                <span >{AddressData.receiveName}</span><span>{AddressData.phone}</span>
                <div className="ad_dress overTxtOne">{AddressData.shopAdress}</div>
              </lable>
              <div className="addressRight">
                <label style={{ color: "#B6B6B8" }}>默认</label>
                <img src={require('../../images/settlement/arrowRight.png')} />
              </div>
            </div>}
          <div className="dressIcon"><img src={require('../../images/settlement/dressIcon.png')} /></div>
        </div>

        <div className="commodityList">
          <div className="commodityListTitle">
            {goodInfo ? <label className="titleTxt">{db.cutOutStr(decodeURI(goodInfo[0].shopName), 12)}</label> : null}
          </div>
          {goodInfo ? goodInfo.map((val, i) => {
            return (
              <SCommodity goodInfo={val} key={i} />
            )
          }) : null}

          <div className="settlementList">
            <div className="setItem">
              <p className="txt">留言：</p>
              <input type="text" ref="inp" placeholder="请输入留言信息" onFocus={(e) => e.target.placeholder = ''} maxLength="20" onChange={(e) => this.setMsg(e)} value={this.state.Msg} />
            </div>
            <div className="setItem">
              <p className="txt">小计：</p>
              <p className="priceRight"><icon>￥</icon><span>{this.getPrice(1)}</span></p>
            </div>
          </div>
        </div>

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
        <div className="settlementbottrom bottom">
          <div className="Sleft">
            <span className="heji">合计：</span><span className="allPrice"><icon>￥</icon>{this.getPrice(1)}</span>
          </div>
          <button onClick={() => { this.goPayment() }} className={AddressData ? "ablePayBtn" : "unAblePayBtn"}>去支付</button>
        </div>
        {Settlement.isShowLoading ? <div className="loadingView"><div className="loadingImg"></div></div> : null}
      </div>
    )
  }
  setMsg(e) {
    this.setState({
      Msg: e.target.value
    });
  }
  removeText() {
    this.refs.inp.focus();
    this.setState({
      Msg: ''
    })
  }
  goPayment() { //去支付按钮事件

    if (repetitionClick) {//初始值为false
      return;
    }
    repetitionClick = true;

    const { SettlementActions, Settlement, location } = this.props;

    let goodInfo = this.getGoodsInfo(JSON.parse(decodeURI(this.theRequest['goodInfo'])));
    let userInfo = db.readUserInfo();

    let AddressData = contants.addressInfo ? contants.addressInfo : Settlement.defaultAddress;
    if (!AddressData) {
      contants.alertInstance = alert('提示', '请选择收货地址', [
        { text: '确定', onPress: () => { }, style: 'default' }
      ]);
      repetitionClick = false;
      return;
    }
    let GoodsJson = [];
    goodInfo.map((val, i) => {
      let goodDes = {
        goodsId: val.goodsId,
        goodsNum: val.number,
        param1: val.param1,
        param2: val.param2,
        param3: val.param3,
        flagShip: val.flagshipId,
        isInCart: val.isInCart,
        isIngroup: val.buyType ? 0 : 1,
        groupActId: val.groupId ? val.groupId : 1,
        pictureUrl: val.zoomUrl,
        shouldMoney: val.oriPrice ? val.oriPrice : val.price,
        factMoney: val.price
      };
      GoodsJson.push(goodDes);
    });
    let goodsAllCount = 0;
    goodInfo.map((val, i) => {
      goodsAllCount += Number(val.number);
    });
    let requestData = {
      'userId': userInfo.userId,
      //'userId':"12497415",//测试
      'addressId': AddressData.receiveId,
      'sendType': this.state.pickerText[0] ? Number(this.state.pickerText[0]) : 1,
      'shoppingInfo': [{
        'shopId': goodInfo[0].shopId,
        'shopType': goodInfo[0].shopType,//0旗舰店  1分销店 
        'amount': this.getPrice(2), //原价
        'payAmount': this.getPrice(1), //实际价格
        'goodsAllCount': goodsAllCount,//订单商品总数量
        'goods': GoodsJson,
        'leaveMsg': this.state.Msg,
      }]
    };

    let lastCreateOrderRequestData = contants.createOrderData.lastCreateOrderRequestData;
    let lastAddressData = contants.createOrderData.AddressData;


    // 以下为多个判断条件，防止产生重复订单（SH）
    if (lastCreateOrderRequestData && lastCreateOrderRequestData.addressId === requestData.addressId && lastCreateOrderRequestData.leaveMsg === requestData.leaveMsg
      && lastCreateOrderRequestData.sendType === requestData.sendType && lastAddressData.shopAdress === AddressData.shopAdress &&
      lastAddressData.adress === AddressData.adress && lastAddressData.phone == AddressData.phone
      && lastAddressData.receiveName == AddressData.receiveName

    ) {//不产生新订单

      repetitionClick = false;
      let res = contants.createOrderData.lastOrder;//上次订单信息
      let orderSonId = res.payMap.paymentItemList[0].itemNo ? res.payMap.paymentItemList[0].itemNo : 0;
      // console.log(res)

      let orderDetailUrl = contants.commonUrl + '/orderDetail/?orderId=' + res.orderId + '&orderSonId=' +
        orderSonId + '&shopId=' + goodInfo[0].shopId
      let buyType = 0;
      if (goodInfo.length == 1 && goodInfo[0].buyType) {
        buyType = 1;
      }
      contants.isJumpToPayment = true;
      // console.log(orderDetailUrl)

      this.props.history.push({ //路由传参(path,state)（SH）
        pathname: orderDetailUrl,
        state: {
          orderId: res.orderId,
          sonOrderId: orderSonId,
          shopId: goodInfo[0].shopId,
          buyType: buyType,
          money: this.getPrice(1),
          orderNumber: res.orderNumber,
        }
      });

    }
    else {
      let buyType = 0;
      if (goodInfo.length == 1 && goodInfo[0].buyType) {
        buyType = 1;
      }
      SettlementActions.goToPay('/webOrder/createOrder', JSON.stringify(requestData), (res) => {
        if (res.status == -1) {
          alert(res.msg);
          return false;
        }
        // console.log("开始生成订单")
        contants.createOrderData.lastOrder = res;
        contants.createOrderData.lastCreateOrderRequestData = requestData;
        contants.createOrderData.AddressData = AddressData;//地址是否变化

        let orderId = res.orderInfo[0].orderId;

        contants.isJumpToPayment = true;
        let orderSonId = res.payMap.paymentItemList[0].itemNo ? res.payMap.paymentItemList[0].itemNo : 0;//团购订单相关
        let orderDetailUrl = contants.commonUrl + '/orderDetail/?orderId=' + orderId + '&orderSonId=' +
          orderSonId + '&shopId=' + goodInfo[0].shopId;
        // console.log(contants.commonServerUrl+orderDetailUrl)
        repetitionClick = false;
        // let resData = res.orderInfo[0];
        let resData = res.payMap;// 订单数据

        if (orderId) {
          db.deleteGoods(goodInfo);
          // console.log("当前resData为",resData)
          this.props.history.push({
            pathname: orderDetailUrl,
            state: {
              // amount:resData.amount,
              // fee:resData.fee,
              orderId: orderId,
              // orderNumber:resData.orderNumber,
              // paymentItemList:resData.paymentItemList,
              // platformNo:resData.platformNo,
              // userId:resData.userId,

              appNeedData: resData,//加入新字段的一个对象（SH）
              //shopType:res.orderInfo[0].shopType,
              // 以下字段为之前老字段，暂时不删除
              sonOrderId: orderSonId,
              shopId: goodInfo[0].shopId,
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
  // selectAddress(address){
  //     const {SettlementActions}=this.props;
  //     SettlementActions.selectAddress(address);
  // }
}
