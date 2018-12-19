/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, { Component } from 'react';
import { ActivityIndicator, Tabs, Icon } from 'antd-mobile';
import './myOrderListEmpty.less';
import OrderList from './orderListData';
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';
import SvgImg from '../../../common/svgImage/svgImg';
import * as weidudb from '../../../common/Apis/weiduInteractive';

const tabs = [
  { title: '待付款', sub: '1' },
  { title: '待收货', sub: '2' },
  { title: '已完成', sub: '3' },
  { title: '全部订单', sub: '4' },
];

export default class OrderTab extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      height: 0,
      focused: false,
      keyWord: '',
      showInput: false,
      isWeidu: true,
    };
    this.orderStatus = 0;
    this.isReturn = true;
    this.pageNow = 1;
    this.pageSize = 5;
    this.curIndex = 0;
    this.theRequest = db.getValueFromUrl();
    // this.isInitPage=true;//设置loading的状态，上拉刷新，下拉加载不出现大的loading图，切换、刚进入页面时出现
  }

  //reader前
  componentWillMount() {
    wxShare([], {});
    this.isReturn = true;
    let { history } = this.props;
    let userInfo = db.readUserInfo();
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == 'kabao_uu_wedo') {
      weidudb.getUserInfo();
    } else {
      if (!userInfo) {
        history.replace({
          pathname: contants.commonUrl + '/login',
        });
      }
    }
    if (db.userAgent() === 'Android') {
      document.title = '我的订单';
    } else {
      db.setPageTitle('我的订单');
    }
    let theRequest = {};
    let strs = [];
    theRequest = db.getValueFromUrl();
    this.orderStatus = theRequest.orderStatus;
  }

  componentDidMount() {
    var intervalId;
    this.setState({ height: $('.am-tabs-tab-bar-wrap').height() });
    const { OrderTab, OrderListAction } = this.props;
    if (OrderTab.myTabType === -1) {
      OrderListAction.setType(this.orderStatus);
    }
    //先注释掉----
    //  wxShare( [], {});
    $('.am-tabs-bar').on('touchmove', function (e) {
      var e = e || event;
      e.preventDefault();
    });
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == 'kabao_uu_wedo') {
      intervalId = setInterval(() => {
        let userInfo = db.readUserInfo();
        if (userInfo) {
          let userID = userInfo.wedoId;
          this.curIndex = (Number(this.orderStatus) + 1) % 4;
          //请求相应的订单列表
          OrderListAction.getOrderList(
            [],
            userID,
            this.curIndex,
            this.pageSize,
            this.pageNow,
            "",
            this.theRequest['shopId'],
          );
          clearInterval(intervalId);
        }
      }, 500);
    } else {
      this.setState({
        isWeidu: false,
      })
      let userInfo = db.readUserInfo();
      if (!userInfo) {
        history.replace({
          pathname: contants.commonUrl + '/login/?path=orderList',
        });
      } else {
        let userID = userInfo.wedoId;
        this.curIndex = (Number(this.orderStatus) + 1) % 4; 
        OrderListAction.getOrderList(
          [],
          userID,
          this.curIndex,
          this.pageSize,
          this.pageNow,
          "",
          this.theRequest['shopId'],
        );
      }
    }
  }

  //页面销毁
  componentWillUnmount() {
    const { OrderTab, OrderListAction } = this.props;
    if (this.isReturn) {
      OrderListAction.setType(-1);
      OrderListAction.clearn(6);
    }
  }

  setKeyword(e) {
    let keyWord = e.target.value.trim();
    this.setState({
      keyWord: keyWord,
    });
  }

  onFocus() {
    this.setState({
      focused: true,
    });
  }
  onBlur() {
    setTimeout(() => {
      this.setState({
        focused: false,
      });
    }, 200);
  }

  //返回上一页
  goBack() {
    // history.back()
    db.goBackPrevPage();
  }

  //清空输入框
  clearInputValue() {
    this.setState({
      keyWord: '',
    });
  }

  toggleInput() {
    this.setState({
      showInput: !this.state.showInput,
    });
  }

  confirm(e) {
    document.activeElement.blur(); //软盘消失
    e.preventDefault();
    const { OrderTab, OrderListAction } = this.props;
    let key = this.state.keyWord.trim();
    let userID = db.readUserInfo()['wedoId'];
    OrderListAction.getOrderList(
      [],
      userID,
      this.curIndex,
      this.pageSize,
      this.pageNow,
      this.state.keyWord,
      this.theRequest['shopId']
    );
  }

  render() {
    //  const {keyWord} = this.state;
    const { OrderTab, OrderListAction } = this.props;
    // let keyWord = OrderTab.keyWord;
    let keyWord = this.state.keyWord;
    let key = OrderTab.myTabType == -1 ? this.orderStatus : OrderTab.myTabType;
    let userID = 0;
    //  db.readUserInfo?db.readUserInfo()['wedoId']:0;
    let userInfo = db.readUserInfo();
    if (userInfo) {
      userID = userInfo['wedoId'];
    } else {
      return null;
    }
    return (
      <div className="tabContaiCheng">
        {this.state.isWeidu ?
          <div
            className={
              db.userAgent() !== 'IOS'
                ? 'public-top-status-bar clear'
                : userInfo.bang
                  ? 'navPad48 public-top-status-bar clear'
                  : 'navPad22 public-top-status-bar clear'
            }
          >
            <Icon
              type="left"
              className="header-back-btn"
              onClick={this.goBack.bind(this)}
            />
            {this.state.showInput ? (
              <form
                className="form-input clear"
                action="javascript:return true;"
                onSubmit={(e) => this.confirm(e)}
              >
                {keyWord ? null : (
                  <SvgImg
                    style={{ fill: '#B6B6B8' }}
                    className="search-icon"
                    xlinkHref="#wedo-wedoicon-32"
                  />
                )}
                <input
                  ref="input"
                  type="search"
                  placeholder="商品名称/订单号"
                  onChange={(e) => this.setKeyword(e)}
                  onFocus={() => this.onFocus()}
                  onBlur={() => this.onBlur()}
                  value={keyWord}
                  maxLength="27"
                  // autoFocus="autofocus"
                  className={keyWord ? 'padding-1' : ''}
                />
                {this.state.focused && this.state.keyWord ? (
                  <Icon
                    className="clear-icon"
                    onClick={() => this.clearInputValue()}
                    type="cross-circle-o"
                    color="#B6B6B8"
                  />
                ) : null}

                <div className="cancel" onClick={this.toggleInput.bind(this)}>
                  取消
              </div>
              </form>
            ) : (
                <div className="icon-wrap clear">
                  <div className="page-title">订单管理</div>
                  <div className="btn-wrap" onClick={this.toggleInput.bind(this)}>
                    <SvgImg
                      className="icon"
                      style={{ fill: '#000000' }}
                      xlinkHref="#wedo-wedoicon-32"
                    />
                  </div>
                </div>
              )}
          </div> : null}
        <div className={!this.state.isWeidu ? 'searchNav' : 'mapTop111 searchNav'}>
          <Tabs
            className="tab"
            swipeable={false}
            tabBarUnderlineStyle={{ backgroundColor: '#B4282D' }}
            tabBarActiveTextColor={'#B4282D'}
            tabBarInactiveTextColor={'#6D6D72'}
            tabs={tabs}
            initialPage={parseInt(key)}
            animated={true}
            page={parseInt(key)}
            prerenderingSiblingsNumber={4}
            onChange={(tab, index) => {
              if (document.documentElement.scrollTop)
                document.documentElement.scrollTop = 0;
              if (window.pageYOffset) window.pageYOffset = 0;
              if (document.body.scrollTop) document.body.scrollTop = 0;
              OrderListAction.setType(index);
              this.curIndex = (index + 1) % 4;
              OrderListAction.setInitPage(true);
              OrderListAction.getOrderList(
                [],
                userID,
                this.curIndex,
                this.pageSize,
                this.pageNow,
                this.state.keyWord,
              );
            }}
          >
            <OrderList
              index={1}
              {...this.props}
              keyWord={this.state.keyWord}
              curIndex={this.curIndex}
              height={this.state.height}
              onBack={(isReturn) => {
                this.isReturn = isReturn;
              }}
            />

            <OrderList
              index={2}
              {...this.props}
              keyWord={this.state.keyWord}
              curIndex={this.curIndex}
              height={this.state.height}
              onBack={(isReturn) => {
                this.isReturn = isReturn;
              }}
            />

            <OrderList
              index={3}
              {...this.props}
              keyWord={this.state.keyWord}
              curIndex={this.curIndex}
              height={this.state.height}
              onBack={(isReturn) => {
                this.isReturn = isReturn;
              }}
            />

            <OrderList
              index={0}
              {...this.props}
              keyWord={this.state.keyWord}
              curIndex={this.curIndex}
              height={this.state.height}
              onBack={(isReturn) => {
                this.isReturn = isReturn;
              }}
            />
          </Tabs>
        </div>
        {OrderTab.isShow ? (
          <div className="loadingView">
            <div className="loadingImg" />
          </div>
        ) : null}
      </div>
    );
  }
}
