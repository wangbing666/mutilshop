/**
 * Created by nipeng on 2017/7/8.
 * 登陆view
 */

import React, { Component } from 'react';
import './PPLoginManage.less';
import { Toast, WhiteSpace, WingBlank, Button, Icon } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as db from '../../../common/Apis/Utils';
import { Carousel, ActivityIndicator, Modal } from 'antd-mobile';
import { wxShare } from '../../../common/Apis/wxJsApis';
var wait = 60;//时间
var t;//计时器

import * as Util from '../../../common/Apis/Utils';


export default class PPLoginManage extends Component {

  constructor(props) {
    super(props);
    var localUrl = location.search;
    let theRequest = Util.getValueFromUrl(localUrl)
    this.state = {
      authMas: true,
      timeStr: "获取验证码",
      phoneStr: '',
      isFocus: true,
      isAretLogin: false,
      statusString: '',
      shopId: theRequest['shopId'],
    }
    this.shopId = theRequest['shopId']
    this.goodsId = theRequest['goodsId']
    this.theRequest = theRequest
  }
  componentWillMount() {
    document.title = '登录';
    db.setPageTitle('登录');
  }
  componentDidMount() {
    wxShare([], {});
  }
  render() {
    const { PPLoginReducer, PPLoginAction } = this.props;
    return (//enterpriseIcon@1x
      <div className="containerBody login-wrap">
        <div className="enterpriseStyleLogin">
          <img src={require('../../images/loginPage/wedo_text.png')} />
          {/* <label>手机号直接登录</label> */}
        </div>
        <div className="loginBodyManage">
          <div className="phoneDiv">
            <input className="phoneInputStyle" ref="phoneInput" id="mobileId" required="required" type="tel" onFocus={() => this.focusAction()} placeholder="请输入手机号" maxLength={11} value={this.state.phoneStr} onChange={(e) => { this.setState({ phoneStr: e.target.value }) }} />
            {this.state.phoneStr && this.state.isFocus ?
              <img className="clearButton" src={require('../../images/loginPage/a3@1x.png')} onClick={() => { this.clearButtonAction() }}>
              </img> : null}
          </div>


          <div className="passwordDiv" >
            <input className="passwordInputStyle" ref="passwordInput" id="passwordInput" onFocus={() => this.blurAction()} onChange={(e) => { this.verificationCode(e.target.value) }} placeholder="请输入验证码" maxLength={6} />
            <button id="auth_id" onFocus={() => this.blurAction()} className="authMaStyle" onClick={this.state.authMas ? () => { this.time(wait) } : null}>
              {this.state.timeStr}
            </button>
          </div>

          <button className="loginBtnStyleRed" id="loginBtn" onFocus={() => this.blurAction()} onClick={() => { this.gotoLogin() }}>
            登录
                    </button>
        </div>
        {PPLoginReducer.isShowLoading ? <div className="loadingView">
          <div className="loadingImg"></div>
        </div> : null}

        <div className={this.state.isAretLogin ? "alertLoginShow" : "alertLoginHide"}>
          <div className="loginBackViewStyles">
          </div>
          <div>
            <img src={require('../../images/goodDetails/d14.png')} />
            <p>{this.state.statusString}</p>
          </div>
        </div>
      </div>
    )
  }

  verificationCode(e) {
    // console.log(e.length);
    // if(e.length>0){
    //     document.getElementById("loginBtn").className="loginBtnStyleRed";
    // }else {
    //     document.getElementById("loginBtn").className="loginBtnStyle";
    // }
  };

  focusAction() {
    this.setState({
      isFocus: true
    })

  }
  blurAction() {
    this.setState({
      isFocus: false
    })
  }


  time(wait) {// 获取验证码
    if (wait === 60) {
      if (this.refs.phoneInput.value === '') {
        // Toast.fail('请输入手机号', 1);
        this.alertLoginAction('请输入手机号');
        return;
      }

      if (this.refs.phoneInput.value.length < 11 || isNaN(this.refs.phoneInput.value)) {
        // Toast.fail('请输入正确的手机号', 1);
        this.alertLoginAction('请输入正确的手机号');
        return;
      }

    }
    if (wait === 0) {
      this.setState({
        authMas: true,
        timeStr: "获取验证码"
      })
      wait = 60;
    } else {

      this.setState({
        authMas: false,
        timeStr: wait + 's'
      })
      wait--;
      t = setTimeout(() => {
        this.time(wait);
      }, 1000)

    }

    if (wait === 59) {
      const { PPLoginReducer, PPLoginAction } = this.props;
      let url = "/user/sendCode";
      const bodyDate = {
        mobile: this.refs.phoneInput.value,

      }
      var that = this;
      PPLoginAction.geterificationPost(url, bodyDate, function (data) {

      }, function (err) {
        {
          that.stopTime()
          wait = 60;
          that.setState({
            authMas: true,
            timeStr: "获取验证码"
          })
        }
      });
    }



  }

  stopTime() {
    clearTimeout(t);
  }


  pushView(router, location) {

    let pageType = location.type ? location.type : location.state.type
    switch (pageType) {
      case -1: { //需要权限验证
        router.goBack();
        break;
      }
      case 1: {// 收藏
        router.goBack();
        break;
      }
      case 2: {// 购物袋
        router.replace({
          pathname: contants.commonUrl + '/settlement' + '/?shopId=' + this.state.shopId,
          state: {
            goodInfo: location.goodInfo ? location.goodInfo : location.state.goodInfo
          }
        });
        break;
      }
      case 3: {//订单结算
        router.replace({
          pathname: contants.commonUrl + '/settlement' + '/?shopId=' + this.state.shopId,
          state: {
            goodInfo: location.goodInfo ? location.goodInfo : location.state.goodInfo
          }
        });
        break;
      }
      case 4: {// 我的订单
        router.replace({
          pathname: contants.commonUrl + '/orderHome' + '/?shopId=' + this.state.shopId,
        });
        break;
      }
      case 5: {// 客服聊天
        let userChartInfo = {
          userId: db.readUserInfo()["userId"],
          userHeadUrl: db.readUserInfo()["headUrl"],
          shopId: this.shopId,
          userName: db.readUserInfo()["userNickname"],
        };
        let query = '';

        Object.keys(userChartInfo).forEach((key) => {
          query += `${key}=${userChartInfo[key]}&`
        });
        window.location.href = contants.customerServiceUrl + query;
        /* router.replace({
             pathname:contants.commonUrl+'/chatV/?goodsId='+this.goodsId+'&shopId='+this.shopId
         });*/
        break;
      }
      case 6: { // 故事评论
        router.goBack();
        break;
      }
      case 7: { // 评论列表
        router.goBack();
        break;
      }
      case 8: {  // 喜欢
        router.goBack();
        break;
      }
      default: {
        router.goBack();
        break;
      }


    }


  }
  alertLoginAction(statusString) {
    this.setState({ isAretLogin: true, statusString: statusString });
    setTimeout(() => {
      this.setState({
        isAretLogin: false
      })
    }, 1000);

  }

  gotoLogin() {
    let that = this;
    document.getElementById('loginBtn').disabled = true;
    const { PPLoginReducer, PPLoginAction, history, location } = this.props;
    if (this.refs.phoneInput.value === '') {
      // Toast.fail('请输入手机号', 1);
      this.alertLoginAction('请输入手机号');
      document.getElementById('loginBtn').disabled = false;
      return;
    }

    if (this.refs.phoneInput.value.length < 11 || isNaN(this.refs.phoneInput.value)) {

      // Toast.fail('请输入正确的手机号', 1);
      this.alertLoginAction('请输入正确的手机号');
      document.getElementById('loginBtn').disabled = false;
      return;
    }

    if (this.refs.passwordInput.value === '') {
      // Toast.fail('请输入验证码', 1);
      this.alertLoginAction('请输入验证码');
      document.getElementById('loginBtn').disabled = false;
      return;
    }

    this.stopTime()
    wait = 60;
    this.setState({
      authMas: true,
      timeStr: "获取验证码"
    })
    //alert("登录")ƒ

    let url = "/user/login";
    const bodyDate = {
      userName: this.refs.phoneInput.value,
      checkCode: this.refs.passwordInput.value,
      loginType: 2,
    }
    PPLoginAction.loginButtonPost(url, bodyDate, this.refs.phoneInput.value, function (data) {
      document.getElementById('loginBtn').disabled = false;
      if (that.theRequest.path) {
        if (that.theRequest['goodInfo']) { // 分享出去的订单结算页面
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path + '/?goodInfo=' + encodeURI(that.theRequest['goodInfo']) + '&userId=' + that.theRequest['userId']
          });
          return;
        } else if (that.theRequest['orderSonId']) { // 分享出去的订单详情页面
          let query = `/?orderNum=${that.theRequest['orderNum']}&orderId=${that.theRequest['orderId']}&orderSonId=${that.theRequest['orderSonId']}&shopId=${that.theRequest['shopId']}&orderStatus=${that.theRequest['orderStatus']}&userId=${that.theRequest['userId']}`
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path + query
          });
          return;
        } else if (that.theRequest['aftersaleId']) { // 分享出去的售后详情页面
          let query = `/?orderId=${that.theRequest['orderId']}&aftersaleId=${that.theRequest['aftersaleId']}&orderNum=${that.theRequest['orderNum']}&createTime=${that.theRequest['createTime']}&saleType=${that.theRequest['saleType']}&userId=${that.theRequest['userId']}`
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path + query
          });
          return;
        } else if (that.theRequest['type'] && that.theRequest['type'] == 1 || that.theRequest['type'] == 2) { // 分享出去的个人中心和店铺介绍
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path + '/?shopId=' + that.theRequest['shopId']
          });
        } else if (that.theRequest['type'] && that.theRequest['type'] == 3) { // 分享出去的商品详情
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path + '/?shopId=' + that.theRequest['shopId'] + '&goodsId=' + that.theRequest['goodsId']
          });
        } else {
          history.push({
            pathname: contants.commonUrl + '/' + that.theRequest.path
          });
        }
      } else {
        history.push({
          pathname: contants.commonUrl + '/index'
        });
      }
    }, function (err) {
      document.getElementById('loginBtn').disabled = false;
    })
  }

  clearButtonAction() {
    this.refs.phoneInput.value = '';
    document.getElementById("mobileId").focus();
    this.setState({
      phoneStr: '',
    })
    // alert('清除手机号')
  }
}


