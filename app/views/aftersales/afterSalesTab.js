/**
 * Created by chengjiabing on 17/7/7.
 */
import React, { Component } from 'react';
import './aftersales.less'
import HandleSale from './handleSale'
import SaleRecord from './saleRecord'
import * as db from '../../../common/Apis/Utils';
import { wxShare } from '../../../common/Apis/wxJsApis'
import * as contants from '../../../common/Apis/constants'
import * as weidudb from '../../../common/Apis/weiduInteractive';
import { getValueFromUrl } from '../../../common/Apis/Utils'
import Header from '../components/header';

export default class afterSalesTab extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      height: 0,
      activeIndex: 1,
    }
    let request = getValueFromUrl(location.search)
    this.shopId = request['shopId']

  }

  callback(key) {
    const { afterSalesAction, afterSale } = this.props;
    afterSalesAction.selectTabWithIndex(key)
  }

  componentDidMount() {
    weidudb.userAuthorization();
    wxShare([], {});
    this.setState({ height: 168 });
    document.title = '我的售后';
    let userInfo = db.readUserInfo()
    if (userInfo === null) {//用户没有登陆
      let url = contants.commonUrl + '/login/?path=afterSale'
      this.props.history.push({
        pathname: url,
      });
    }
    $('.am-tabs-bar').on("touchmove", function (e) {//取消滑动手势
      var e = e || event;
      e.preventDefault();
    });
  }

  routerWillLeave(nextLocation) {
    const { afterSalesAction, afterSale } = this.props;
    if (nextLocation.pathname === contants.commonUrl + '/orderHome') {
      afterSalesAction.selectTabWithIndex('1')
    }
  }

  render() {
    const { afterSalesAction, afterSale } = this.props;
    return (
      <div className="tabContainer">
        {/* <Header titleTxt="我的售后"></Header> */}
        <div className="afterSaleContent">
          <div className="navModule afterSaleNav">
            <div className="handleSale" onClick={this.changeTab.bind(this, 1)} style={{ color: this.state.activeIndex === 1 ? '#D00510' : '#373737' }}><span>当前售后</span></div>
            <div className="saleRecord" onClick={this.changeTab.bind(this, 2)} style={{ color: this.state.activeIndex === 2 ? '#D00510' : '#373737' }}><span>申请记录</span></div>
          </div>
          <div className="salesListContainer">
            {
              this.state.activeIndex === 1 ? <HandleSale {...this.props} height={this.state.height} shopId={this.shopId}></HandleSale> :
                <SaleRecord className="tabView" {...this.props} height={this.state.height} shopId={this.shopId}></SaleRecord>
            }
          </div>
        </div>
      </div>
    )
  }

  //tab的切换操作
  changeTab(index) {
    var acIndex = this.state.activeIndex;
    if (acIndex !== index) {
      this.setState({
        activeIndex: index
      });
      if (document.documentElement.scrollTop)
        document.documentElement.scrollTop = 0;
      if (window.pageYOffset)
        window.pageYOffset = 0;
      if (document.body.scrollTop)
        document.body.scrollTop = 0
    }
  }
}
