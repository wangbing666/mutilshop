/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './orderHome.less';
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import SvgImg from "../../../common/svgImage/svgImg";
import * as weidudb from '../../../common/Apis/weiduInteractive';
import * as contants from '../../../common/Apis/constants'
import { Modal } from 'antd-mobile';
const alert = Modal.alert;

export default class OrderHome extends Component {
  constructor(...args) {
    super(...args);
    this.shopId = 0;
    this.intervalFn = null;
    this.userInfo = {};
    this.theRequest = db.getValueFromUrl();
  }

  componentWillMount() {
    // weidudb.userAuthorization();
    let { history } = this.props;
    let userInfo = db.readUserInfo();
    // alert(JSON.stringify(userInfo))
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      weidudb.getUserInfo();
    } else {
      if (!userInfo) {
        history.replace({
          pathname: contants.commonUrl + '/login/?path=orderHome' + '&type=' + 1 + '&shopId=' + this.theRequest['shopId']
        })
      }
    }
    document.title = '个人中心';
    const u = navigator.userAgent;
    let isWeidu = u.indexOf('wedo') > -1;
    this.setState({ isWeidu }) //判断是否在app中，不在则不显示退出登录按钮
    // alert(contants.isGetUserInfo);
  }
  //在页面被渲染成功之后
  componentDidMount() {
    let theRequest = new Object();
    let strs = [];
    theRequest = db.getValueFromUrl();
    this.shopId = theRequest.shopId;
    wxShare([], {});
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      this.intervalFn = setInterval(() => {
        // alert(contants.isGetUserInfo);
        if (contants.isGetUserInfo) {
          this.getOrderNumber();
          clearInterval(this.intervalFn);
        }
      }, 500)
    } else {
      this.getOrderNumber();
    }
    window.removeEventListener("popstate", function () {
    }, true)
  }

  getOrderNumber() {
    const { OrderHomeActions } = this.props;
    let userInfo = db.readUserInfo();
    let url = "/webOrder/getNumber";
    let data = {
      userId: userInfo.wedoId,
      shopId: this.theRequest['shopId'] || '',
    };
    OrderHomeActions.orderNumber(url, data, () => { }, () => { });
  }
  //页面销毁
  componentWillUnmount() {
    //  const {OrderHome,OrderHomeActions}=this.props;
    if (this.intervalFn)
      clearInterval(this.intervalFn);
  }
  //1,待付款,2,待收货,3售后
  orderStatusNumber(status, orderNumber) {
    if (orderNumber === null) {
      return (
        <div></div>
      )
    } else if (status === 1 && orderNumber.ispayment > 0) {
      return (
        <div className="statusNumber" style={{ color: contants.viewStyDic.COLOR3, backgroundColor: contants.viewStyDic.COLOR1 }}>{orderNumber.ispayment}</div>
      )
    } else if (status === 2 && orderNumber.isgoods > 0) {
      return (
        <div className="statusNumber" style={{ color: contants.viewStyDic.COLOR3, backgroundColor: contants.viewStyDic.COLOR1 }}>{orderNumber.isgoods}</div>
      )
    } else if (status === 3 && orderNumber.issales > 0) {
      return (
        <div className="statusNumber" style={{ color: contants.viewStyDic.COLOR3, backgroundColor: contants.viewStyDic.COLOR1 }}>{orderNumber.issales}</div>
      )
    } else {
      return (
        <div></div>
      )
    }
  };
  render() {
    const { OrderHome, OrderHomeActions } = this.props;
    let userInfo = db.readUserInfo();
    return (
      <div className="orderHome">
        {/* <Header titleTxt="个人中心"></Header> */}
        <div className="orderHomeTop">
          <div className="userInfo">
            {userInfo ? <img src={userInfo.headUrl ? userInfo.headUrl : require("../../images/search/@1xGroup.png")} /> : null}
            {userInfo ? <span className="mobile">ID:{userInfo.moblie}</span> : null}
            <div className="red_packet">红包余额：88元 <span onClick={() => this.props.history.push({pathname: contants.commonUrl + '/redPacket'})}>?</span></div>
          </div>
        </div>
        <div className="order-wrap">
          <div className="myOrder" onClick={() => { this.goMyOrder(3) }}>
            <div className="myOrderLeft">
              {/*<img className="jiantouImg" src={require('../../images/orderHome/orderTow.png')}/>*/}
              <span className="orderListText">我的订单</span>
            </div>
            <div className="myOrderRight">
              <span>查看全部订单</span>
              <img className="jiantouImg" src={require('../../images/orderHome/jiantouLift.png')} />
            </div>
          </div>
        </div>
        <div className="orderStatus">
          <div className="statusBody" onClick={() => { this.goMyOrder(0) }}>
            <SvgImg className="img" xlinkHref="#wedo-wedoicon-26" style={{ fill: "#7F7F7F" }} />
            <span>待付款</span>
            {this.orderStatusNumber(1, OrderHome.orderNumber)}
          </div>
          <div className="statusBody" onClick={() => { this.goMyOrder(1) }}>
            <SvgImg className="img" xlinkHref="#wedo-wedoicon-27" style={{ fill: "#7F7F7F" }} />
            <span>待收货</span>
            {this.orderStatusNumber(2, OrderHome.orderNumber)}
          </div>
          <div className="statusBody" onClick={() => { this.goAfterSale() }}>
            <SvgImg className="img" xlinkHref="#wedo-wedoicon-28" style={{ fill: "#7F7F7F" }} />
            <span>我的售后</span>
            {this.orderStatusNumber(3, OrderHome.orderNumber)}
          </div>
          <div className="statusBody" onClick={() => { this.goMyOrder(2) }}>
            <SvgImg className="img" xlinkHref="#wedo-wedoicon-29" style={{ fill: "#7F7F7F" }} />
            <span>已完成</span>
          </div>
        </div>
        <div className="myOList">
          <div className="myCollectionBody" onClick={() => this.goCollection()}>
            <div className="myCollection">
              <div className="myCLeft">
                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-4" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                <span className="orderListText">我的收藏</span>
              </div>
              <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')} />
            </div>
          </div>
          <div className="myCollectionBody" onClick={() => this.goShoppingCart()}>
            <div className="myCollection">
              <div className="myCLeft">
                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-6" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                <span className="orderListText">我的购物车</span>
              </div>
              <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')} />
            </div>
          </div>
          <div className="myCollectionBody" onClick={() => this.goAddress()}>
            <div className="myCollection">
              <div className="myCLeft">
                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-10" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                <span className="orderListText">我的收货地址</span>
              </div>
              <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')} />
            </div>
          </div>
          {
            !this.state.isWeidu ?
              <div className="myCollectionBody" onClick={() => this.logout()}>
                <div className="myCollection">
                  <div className="myCLeft">
                    {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-10" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                    <span className="orderListText">退出登录</span>
                  </div>
                  <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')} />
                </div>
              </div>
              : null
          }
        </div>
      </div>
    )
  }
  //跳转我的订单页面
  goMyOrder(orderStatus) {
    // const {history}=this.props;
    // history.push({
    //     pathname:contants.commonUrl+'/orderList/?orderStatus='+orderStatus
    // });
    let shopId = '';
    if (this.theRequest['shopId']) {
      shopId = this.theRequest['shopId']
    }
    let url = contants.multishopUrl + '/orderList/?orderStatus=' + orderStatus + '&shopId=' + shopId
    db.goToPageForApp(url, true);
  };
  //跳转我的售后页面
  goAfterSale() {
    //    const {history}=this.props;
    //     history.push({
    //      pathname:contants.commonUrl+'/afterSale'
    //      });
    let url = contants.multishopUrl + '/afterSale';
    db.goToPageForApp(url, false);
  };
  //跳转我的收藏页面
  goCollection() {
    // return;
    // const {history}=this.props;
    // history.push({
    //  pathname:contants.commonUrl+'/collection'
    //  });
    let url = contants.multishopUrl + '/collection';
    db.goToPageForApp(url, true);
  };
  //跳转购物袋页面
  goShoppingCart() {
    // const {history}=this.props;
    // history.push({
    //  pathname:contants.commonUrl+'/PPShoppingCart'
    //  });
    let url = contants.multishopUrl + '/PPShoppingCart';
    db.goToPageForApp(url, false);
  };
  //跳转地址页面
  goAddress() {
    //window.location = contants.flagshipUrl+'/addressList';
    // let addressUrl = contants.flagshipUrl+'/addressList';
    // db.goToPageForApp(addressUrl,false);
    const { history } = this.props;
    history.push({
      pathname: contants.commonUrl + '/addressList'
    });
  }
  //退出登录
  logout() {
    let { OrderHomeActions, history, OrderHome } = this.props;
    let data = {
      userId: db.readUserInfo().wedoId
    }
    alert('', '确定退出登录吗？', [
      { text: '取消', onPress: () => null },
      {
        text: '确定', onPress: () => {
          localStorage.removeItem('userInfo');
          document.cookie = 'CASTGC=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          let url = "/user/loginout";
          OrderHomeActions.logout(url, data, () => {
            history.replace({
              pathname: contants.commonUrl + '/login'
            })
          });
        }
      }
    ])
  }
}
