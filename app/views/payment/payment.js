/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './payment.less';
//import {readUserInfo} from '../../../common/Apis/Utils';//获取用户信息
import { hex_md5 } from './md5';
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';//全局配置信息
import { Toast } from 'antd-mobile';
import * as weiduInteractive from '../../../common/Apis/weiduInteractive';
import * as fetch from '../../../common/Apis/Fetch'


export default class Payment extends Component {
  constructor(...args) {
    super(...args);
    //1 微信 2 支付宝 3 快捷支付 4 微度支付
    this.state = {
      paymentMethod: 4,
      weixinPayment: false,
      paybtn: false,
    }
    this.colorDic = contants.viewStyDic;
    this.entryType = 0;
    this.intervalObj = null;
    this.payment = null;
    this.theRequest = db.getValueFromUrl(location.search);
  }
  componentDidMount() {
    contants.isJumpToPayment = false;
    wxShare([], {});
    const { Payment, PaymentActions } = this.props;
    let ua = navigator.userAgent.toLowerCase();
    // 微信支付，暂时隐藏
    // if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
    //   this.setState({ weixinPayment: true, paymentMethod: 1 });
    // }
  }
  componentWillMount() {
    let userInfo = db.readUserInfo();
    if (!userInfo) {
      this.props.history.replace({
        pathname: contants.commonUrl + '/index'
      })
    }
    document.title = '确认支付';
    if (db.userAgent() === 'Android') {
      document.title = '确认支付';
    } else {
      db.setPageTitle('确认支付');
    }
    let theRequest = db.getValueFromUrl();
    this.entryType = theRequest.entryType;
    if (this.entryType == 1) {
      let paymentObj = localStorage.getItem("penPayState");
      if (paymentObj) {
        this.payment = JSON.parse(paymentObj);
      }
    }

  }
  render() {
    let borderR;
    if (this.colorDic['SHAPE'] == 3) {
      borderR = 'btnSemicircle';
    } else if (this.colorDic['SHAPE'] == 2) {
      borderR = 'btnCircular';
    } else {
      borderR = 'btnNoCircular';
    }
    let payment = null;
    if (this.props.location.state) { //正常进入
      payment = this.props.location.state;
      // contants.payMentData = payment;
      localStorage.setItem("paymentData", JSON.stringify(payment));
    }
    if (this.entryType == 1) { //立即付款进入
      payment = this.payment;
      localStorage.setItem("paymentData", JSON.stringify(payment));
    }

    if (!payment) { //返回上一页进入
      let payParse = localStorage.getItem("paymentData");
      payment = JSON.parse(payParse);
    }
    return (
      <div className="payment">
        <div className="amountsPayable">
          <span className="amountsPayableText">应付金额:</span>
          <span className="moneyText">￥{payment ? payment.money : null}</span>
        </div>
        <div className="theWay">
          {this.state.weixinPayment ? <div className="theWayList" onClick={() => { this.choosePaymentMethods(1) }}>
            <div className="theWayLeft">
              <img src={require('../../images/payment/weixin.png')} />
              <span>微信支付</span>
            </div>
            <div className="theWayRight">
              <img src={this.state.paymentMethod === 1 ? require('../../images/payment/b31@1x.png') : require('../../images/payment/b32@1x.png')} />
            </div>
          </div> : null}

          <div className="theWayList" onClick={() => { this.choosePaymentMethods(4) }}>
            <div className="theWayLeft">
              <img src={require('../../images/payment/CombinedShape.png')} />
              <span>微度支付</span>
            </div>
            <div className="theWayRight">
              <img src={this.state.paymentMethod === 4 ? require('../../images/payment/b31@1x.png') : require('../../images/payment/b32@1x.png')} />
            </div>
          </div>


          {/* 原来被注释的地方 */}

          {/* <div className="theWayList" onClick={()=>{this.choosePaymentMethods(2)}}>
                        <div className="theWayLeft">
                            <img src={require('../../images/payment/zhifubao@1x.png')}/>
                                <span>支付宝支付</span>
                            </div>
                            <div className="theWayRight">
                            <img src={this.state.paymentMethod===2?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                        </div>
                     </div>
                */}
          {/* <div className="theWayList" onClick={()=>{this.choosePaymentMethods(3)}}>
                        <div className="theWayLeft">
                            <img src={require('../../images/payment/kuaijie.png')}/>
                            <span>快捷支付</span>
                            </div>
                            <div className="theWayRight">
                            <img src={this.state.paymentMethod===3?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                        </div>
                     </div>
                */}

          {/* ------------------------------ */}


        </div>
        {/*<div>
                 <input type="text" id="orderNo" style={{height:'90px',width:'200px'}} />
                 </div>*/}
        <div className="paymentBottom">
          <button style={{ backgroundColor: this.colorDic['COLOR1'], color: this.colorDic['COLOR3'] }} className={borderR} onClick={() => { this.choicePayment() }}>确定</button>
        </div>
        <div id="PAscreenBody" className="PAscreenBody hide">
          <div className="loadingView">
            <div className="loadingImg"></div>
          </div>
        </div>
      </div>
    )
  }

  //获取商品信息
  getPayMentInfo(state) {
    let info;
    if (state) {
      info = this.props.location.state;
      info = info.goodInfo;
    } else {
      info = contants.cartData;
    }
    return info;
  }
  callPayment() {
    const { Payment, PaymentActions } = this.props;
    let url = "/webOrder/payResult";
    let data = {
      orderId: this.props.location.state.orderId
    };
    PaymentActions.payment(url, data, () => { }, () => { });
  };
  //选择支付方式支付
  choicePayment() {
    // 1:微信支付  2：支付宝支付   3：快捷支付  4：微度支付
    window.sessionStorage.removeItem('top');

    if (this.state.paymentMethod === 1) {
      this.transactionNumber();
    } else if (this.state.paymentMethod === 2) {
      this.twoCodePayment();
    } else if (this.state.paymentMethod === 3) {
      this.quickPayment();
    } else {
      this.weiduPayment();
    }
  };
  //获取订单编号接口微信支付
  transactionNumber() {
    let payment = this.props.location.state;
    const { Payment, PaymentActions } = this.props;
    let url = "/wallet/createTradeOrderNo";
    let userInfo = db.readUserInfo();
    let data = {
      userId: userInfo.userId,
      orderId: this.props.location.state.orderId,//订单编号
      amount: payment.money,//金额
      //amount:0.01,//金额
      billType: 3//付款方式
    };
    document.getElementById("PAscreenBody").className = "PAscreenBody show";


    let shopId = this.props.location.state.shopId;
    let orderId = this.props.location.state.orderId;
    let orderSonId = this.props.location.state.sonOrderId;
    let shopUrl = contants.flagshipUrl + '/index';
    // if(this.props.location.state.buyType==0) {
    //     shopUrl = contants.commonServerUrl + '/groupShoppingDetail/?shopId=' + shopId + '~orderId=' + orderId + '~orderSonId=' + orderSonId;
    // }
    // console.log(shopUrl)
    PaymentActions.transactionNumber(url, data, (data) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
      //2120161014152406001
      if (data.status === 0) {//         测试商户 2120160922184756001  1qaz2wsx   正式商户   2120161014152406001  kb201610171300#!!!
        window.sessionStorage.setItem('orderNo', data.body.orderNo);
        //window.sessionStorage.setItem('top',2000);
        let Mac = hex_md5("accountId=2120161014152406001&orderId=" + data.body.orderNo +
          "&commodity=DianBaoShop&amount=" + payment.money + "&responseUrl=" + data.body.callbackAddress +
          "&subject=DianBaoShop&wechatappid=wx7a6fefa54a1dfe06&wechatappidpwd=b2720b3f4c5cccb8f40ba877da9030c6" +//微信公众号信息
          "&returnPage=" + shopUrl + "&key=kb201610171300#!!!").toUpperCase();
        let weixiUrl = contants.wechatPayUrl + "applyWXCodePayKabao?accountId=2120161014152406001&orderId=" + data.body.orderNo +
          "&commodity=DianBaoShop&amount=" + payment.money + "&responseUrl=" + data.body.callbackAddress +
          "&subject=DianBaoShop&wechatappid=wx7a6fefa54a1dfe06&wechatappidpwd=b2720b3f4c5cccb8f40ba877da9030c6" +
          "&returnPage=" + shopUrl + "&mac=" + Mac;
        window.location.href = weixiUrl;
      } else {
        Toast.info(data.msg, 2);
      }
    }, (err) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
    });
  };
  //选择支付方式
  choosePaymentMethods(paymentMethod) {
    this.setState({ paymentMethod: paymentMethod });
  };
  //二维码支付支付宝支付
  twoCodePayment() {
    let payment = this.props.location.state;
    const { Payment, PaymentActions } = this.props;
    let userInfo = db.readUserInfo();
    let url = "/wallet/applyScanCode";
    let paymentData = {
      userId: userInfo.userId,
      payType: 1,//支付类型1:支付宝;2:微信;3:银联
      orderId: this.props.location.state.orderId,
      commodity: "MOYAHEE",//商品信息
      amount: payment.money//金额
    };
    document.getElementById("PAscreenBody").className = "PAscreenBody show";
    PaymentActions.CallPayment(url, paymentData, (response) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
      if (response.body.resultCode === "0000") {
        window.location.href = response.body.qrcode;
      } else {
        Toast.info(response.body.resultMsg, 2);
      }
    }, (err) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
      Toast.info("请求失败", 2);
    });
  };
  //快捷支付
  quickPayment() {
    let payment = this.props.location.state;
    const { Payment, PaymentActions } = this.props;
    let url = "/wallet/createTradeOrderNo";
    let userInfo = db.readUserInfo();
    let data = {
      userId: userInfo.userId,
      orderId: this.props.location.state.orderId,//订单编号
      amount: payment.money,//金额
      billType: 1//1：快捷支付
    };
    document.getElementById("PAscreenBody").className = "PAscreenBody show";
    PaymentActions.transactionNumber(url, data, (data) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
      // console.log(data.status);
      if (data.status === 0) {
        let Mac = hex_md5("accountId=2120161014152406001&customerId=" + userInfo.userId + "&orderNo=" + data.body.orderNo
          + "&commodityName=MOYAHEE&amount=" + payment.money + "&responseUrl=" + data.body.callbackAddress + "&pageResponseUrl=http://myh.unspay.com&key=kb201610171300#!!!").toUpperCase();
        let quickPayment = "http://wap.unspay.com:8082/quickpay-front/quickPayWap/prePay?accountId=2120161014152406001&customerId=" + userInfo.userId + "&orderNo=" + data.body.orderNo +
          "&commodityName=MOYAHEE&amount=" + payment.money + "&responseUrl=" + data.body.callbackAddress + "&pageResponseUrl=http://myh.unspay.com&mac=" + Mac;
        window.location.href = quickPayment;
      } else {
        Toast.info(data.msg, 2);
      }
    }, (err) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
    });
  };

  //微度支付
  weiduPayment() {
    let payment = null;
    let ua = navigator.userAgent.toLowerCase();
    if (this.props.location.state) {
      payment = this.props.location.state;
    }
    if (this.entryType == 1) {
      let paymentObj = localStorage.getItem("penPayState");
      payment = JSON.parse(paymentObj);
    }
    if (!payment) { //返回上一页进入
      let payParse = localStorage.getItem("paymentData");
      payment = JSON.parse(payParse);
    }
    const { Payment, PaymentActions } = this.props;
    let userInfo = db.readUserInfo();
    let Appneeddata = null;
    if (!payment.secondPayMap) {//如果不是 第二次下单
      Appneeddata = payment.appNeedData
    } else {
      Appneeddata = payment.secondPayMap;
      // alert(JSON.stringify(Appneeddata));
    }
    // let Appneeddata = payment.appNeedData;
    // 测试测试
    //  userInfo.userId = "12497395";
    //  console.log("支付信息....",JSON.stringify(Appneeddata));
    let data = {
      userId: userInfo.userId,
      orderId: payment.orderId,//订单编号
      amount: payment.money,//金额
      billType: 5//付款方式   5：微度支付
    };
    document.getElementById("PAscreenBody").className = "PAscreenBody show";//loading效果
    let shopId = payment.shopId;
    // console.log(this.props)
    let orderId = payment.orderId;

    let orderSonId = payment.sonOrderId;
    let shopUrl = contants.multishopUrl + '/index';
    let goodType = 0; //0 普通商品  1 团购商品

    let orderDetailUrl = contants.commonServerUrl + '/orderDetail/?orderId=' + orderId + '&orderSonId=' +
      orderSonId ////订单详情url

    // console.log("orderDetailUrl is" +orderDetailUrl)
    let orderListUrl = contants.multishopUrl + '/orderList/?orderStatus=3';

    // console.log('buy type is '+this.props.location.state.buyType)
    if (payment.buyType == 1) {//组团
      shopUrl = contants.multishopUrl + '/groupShoppingDetail/?shopId=' + shopId + '&orderId=' + orderId + '&orderSonId=' + orderSonId;
      //测试测试----
      // window.location = "http://172.22.200.109:8080/multiShop"+'/groupShoppingDetail/?shopId='+shopId+'&orderId='+orderId+'&orderSonId='+orderSonId;
      goodType = 1;
    }
    for (let i = 0; i < Appneeddata.paymentItemList.length; i++) {
      if (Appneeddata.paymentItemList[i].remark == null) {
        Appneeddata.paymentItemList[i].remark = '';
      }
    }
    document.getElementById("PAscreenBody").className = "PAscreenBody hide";
    let paymentData = {
      shopUrl: shopUrl,
      platformNo: Appneeddata.platformNo,
      orderNo: Appneeddata.orderNumber,//订单编号
      amount: Appneeddata.amount,
      fee: Appneeddata.fee,//手续费
      remark: "",//主订单备注
      goodsName: Appneeddata.goodsName,//商品名称
      goodsCategory: Appneeddata.goodsCategory,//商品类别
      paymentItemList: Appneeddata.paymentItemList,//支付项目（子订单）列表
      goodType: goodType,//0普通商品，1团购商品
      chcode: userInfo.checkCode || '',
      isShow: true,
      enterPage: 1,//1、多店
      orderDetailUrl: orderListUrl,//订单列表
      userId: userInfo.userId,//userID
    };
    // console.log(paymentData);
    if (ua.match(/kaBao_UU_Wedo/i) == 'kabao_uu_wedo') {
      this.weiduPaymentTow(paymentData);
    } else {
      window.location.href = contants.wechatPayUrl + '?payment=' + JSON.stringify(paymentData);
    }
  };

  weiduPaymentTow(paymentData) { //判断手机中是否有微度（SH）
    // alert(JSON.stringify(paymentData));
    let pla = weiduInteractive.ismobile(1);
    let ua = navigator.userAgent.toLowerCase();

    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      // console.log("在微度外");
      if (pla === 1) {
        window.business.shoppingInJSToPayMoney(JSON.stringify(paymentData));
      } else if (pla === 0) {
        window.webkit.messageHandlers.shoppingInJSToPayMoney.postMessage(JSON.stringify(paymentData));
      }
    } else {
      // console.log("有微度")
      const { Payment, PaymentActions } = this.props;
      let Url = "/wallet/encryption";
      // console.log(JSON.stringify(paymentData));
      PaymentActions.encryption(Url, { code: JSON.stringify(paymentData) }, (data) => {
        // console.log(data.body.desCode);
        weiduInteractive.weiduOpenUrl(data.body.desCode);
      }, (err) => {
        this.setState({
          paybtn: false,
        })
        // console.log(err);
      });

    }
  }

}