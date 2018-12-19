/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import { readUserInfo } from '../../../common/Apis/Utils';
import SvgImg from '../../../common/svgImage/svgImg'
import * as db from '../../../common/Apis/Utils';

export default class Navigation extends Component {
  constructor(props) {
    super(props)
    {
      this.state = {
      }
    }
  }


  componentDidMount() {
    // console.log(this.props)
  }
  render() {
    let viewStyDic = contants.viewStyDic;
    return (
      <div className="Navigation" style={viewStyDic ? { backgroundColor: viewStyDic.COLOR1 } : null}>
        <div className="homeOrder" onClick={() => { this.goOrderHome() }} >
          <SvgImg className="icon" xlinkHref="#wedo-wedoicon-12" style={viewStyDic ? { fill: viewStyDic.COLOR3 } : null} >
          </SvgImg>
        </div>
        {/*调用原生方法onClick={()=>{this.TowGoSearch()}}*/}
        <div className="title" onClick={() => { this.toShopBrief() }} style={viewStyDic ? { color: viewStyDic.COLOR3 } : null}>
          {this.props.title.length > 8 ? `${this.props.title.substr(0, 8)}...` : this.props.title}
        </div>
        <div className="search" onClick={() => { this.goSearch() }} style={viewStyDic ? { fill: viewStyDic.COLOR3 } : null}>
          <SvgImg className="icon" xlinkHref="#wedo-wedoicon-8" style={viewStyDic ? { fill: viewStyDic.COLOR3 } : null}>
          </SvgImg>
        </div>
        <div className="shoppongCat" onClick={() => { this.goShoppingCart() }} >
          <SvgImg className="icon" xlinkHref="#wedo-wedoicon-6" style={viewStyDic ? { fill: viewStyDic.COLOR3 } : null}>
          </SvgImg>
        </div>
      </div>
    )
  }
  toShopBrief() { // 店铺介绍
    if (contants.shopPreView != 1) {
      let userInfo = readUserInfo();

      const { history } = this.props;
      if (userInfo === null) {
        let url = contants.commonUrl + '/login' + '/?path=shopBrief' + '&type=' + 2 + '&shopId=' + this.props.shopId
        history.push({
          pathname: url,
          type: 4
        });
      } else {
        const url = contants.multishopUrl + '/shopBrief' + '/?shopId=' + this.props.shopId
        db.goToPageForApp(url, false);
      }
    }

  };
  //搜索页面
  goSearch() {
    if (contants.shopPreView != 1) {
      const { history } = this.props;
      let url = contants.multishopUrl + '/search' + '/?shopId=' + this.props.shopId
      db.goToPageForApp(url, false)
    }
  };
  //订单首页
  goOrderHome() {
    if (contants.shopPreView != 1) {
      let userInfo = readUserInfo();
      const { history } = this.props;
      if (userInfo === null) {
        let url = contants.commonUrl + '/login' + '/?path=orderHome' + '&type=' + 1 + '&shopId=' + this.props.shopId;
        history.push({
          pathname: url,
          type: 4
        });
      } else {
        let url = contants.multishopUrl + '/orderHome' + '/?shopId=' + this.props.shopId;
        db.goToPageForApp(url, false);
      }
    }
  };
  //购物袋
  goShoppingCart() {
    if (contants.shopPreView != 1) {
      const url = contants.multishopUrl + '/PPShoppingCart' + '/?shopId=' + this.props.shopId
      db.goToPageForApp(url, false);
    }
  };
}