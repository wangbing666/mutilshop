/**
 * Created by Song on 2018/06/27
 * 店铺介绍
 */

import React, { Component } from 'react';
import './shopBrief.less';
import { post, get } from '../../../common/Apis/Fetch.js';
import { Toast } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as db from '../../../common/Apis/Utils';
import { wxShare } from '../../../common/Apis/wxJsApis';
import SvgImg from "../../../common/svgImage/svgImg";

import * as Util from '../../../common/Apis/Utils';

export default class shopBrief extends Component {
  constructor(props) {
    super(props);
    let theRequest = db.getValueFromUrl(location.search); // url search字段对象
    this.shopId = theRequest['shopId'];
    // this.userId = db.readUserInfo()['wedoId'];
    // this.user_id = db.readUserInfo()['user_id'];
    this.user_id = db.readUserInfo()['userId'];
    this.state = {
      cllectOrNo: this.props.shopBriefReducer.shopBrief.isCollection
    }
  }

  componentDidMount() {
    // console.log(this.props.shopBriefReducer.shopBrief.isCollection)

    if (db.userAgent() === 'Android') {
      document.title = '店铺介绍';
    } else {
      db.setPageTitle('店铺介绍');
    }
    const { shopBriefAction } = this.props;
    shopBriefAction.getShopInfo(`/shop/getShopDetail?shopId=${this.shopId}&userId=${this.user_id}`, {}, (res) => {
      this.setState({
        cllectOrNo: res.isCollection
      })
    });
  }

  focus() { // 关注
    const { shopBriefAction } = this.props;
    this.props.shopBriefReducer.shopBrief.isCollection = 1;
    let data = {
      shopId: this.shopId,
      userId: this.user_id,
      status: 0
    }
    shopBriefAction.focus('/shop/doShopFavourite', data, () => {
      shopBriefAction.getShopInfo(`/shop/getShopDetail?shopId=${this.shopId}&userId=${this.user_id}`, {}, (res) => { });
      Toast.info('已关注', 0.5)
      this.setState({
        cllectOrNo: 1
      });
    })
  }

  unfocus() { // 取消关注
    this.props.shopBriefReducer.shopBrief.isCollection = 0;
    const { shopBriefAction } = this.props;
    let data = {
      shopId: this.shopId,
      userId: this.user_id,
      status: 1
    }
    shopBriefAction.unfocus('/shop/doShopFavourite', data, () => {
      shopBriefAction.getShopInfo(`/shop/getShopDetail?shopId=${this.shopId}&userId=${this.user_id}`, {}, (res) => { });
      this.setState({
        cllectOrNo: 0
      });
      Toast.info('已取消关注', 0.5)
    })
  }

  goHome() { // 返回首页
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      db.goBackPrevPage()
    } else {
      this.props.history.push({
        pathname: contants.commonUrl + '/shopDetail/?shopId=' + this.shopId,
      })
    }
  }

  contact() { // 在线客服
    let userInfo = db.readUserInfo();
    let that = this;
    get(`/shop/isShopMaster?shopId=${this.shopId}&userId=${userInfo.userId}`, function (res) {
      if (res.body.result !== 0) {
        Toast.info('不可和自己聊天', 2);
      } else {
        const { history } = that.props;
        if (userInfo === null) {
          history.push({
            pathname: contants.commonUrl + '/login/?shopId=' + that.shopId,
            state: {
              pathname: contants.commonUrl + '/chatV?shopId=' + that.shopId,
              type: 5
            }
          });
        } else {
          that.props.history.push({
            pathname: contants.commonUrl + '/chatV/?shopId=' + that.shopId
          })
        }
      }
    }, function (err) {
      console.log(err.responseJSON);
      Toast.info(err.responseJSON.message, 2);
    });
  }

  render() {
    const { shopBrief, isFocused } = this.props.shopBriefReducer;

    return <div className="container name-space-shop-breif">
      <div className="header clear">
        <div className="logoWrap">
          <img className="logo" src={shopBrief.logoId} />
        </div>
        <div className="center">
          <div className="name">
            {shopBrief.shopName.length > 30
              ? `${shopBrief.shopName.substr(0, 30)}...`
              : shopBrief.shopName}
          </div>
          {shopBrief.shopType === 0 ? <div className="tag">
            企业店
                  </div> : <div className="tag tag2">个人店</div>}
        </div>
        {this.state.cllectOrNo === 1 ? <div className="right" onClick={() => this.unfocus()}>
          已关注
                </div> : <div className="right focus clear" onClick={() => this.focus()}>
            <SvgImg className="icon" style={{ fill: "#D00510" }} xlinkHref="#wedo-wedoicon-21" />
            <span>关注</span>
          </div>}
      </div>
      <div className="list clear">
        <div className="left">在售商品</div>
        <div className="right">{shopBrief.goodsNums}件</div>
      </div>
      <div className="list clear">
        <div className="left">开店时间</div>
        <div className="right">{shopBrief.createTime}</div>
      </div>
      <div className="list clear">
        <div className="left">联系电话</div>
        <div className="right">{shopBrief.mobile}</div>
      </div>
      <div className="list clear paragraph">
        <div className="clear">
          <div className="left">店铺简介</div>
          <div className="right">
            {shopBrief.describes ? shopBrief.describes.substr(0, 12) : ''}
          </div>
        </div>
        <p>{shopBrief.describes ? shopBrief.describes.substr(12) : ''}</p>
      </div>
      <div className="bottom">
        <div className="left" onClick={() => this.goHome()}>
          返回首页
        </div>
      </div>
    </div>;
  }
}
