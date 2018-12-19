/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */
import React, { Component } from 'react';
import { ListView, Modal, ActivityIndicator, PullToRefresh } from 'antd-mobile';
import './orderList.less';
import Empty from '../../../common/components/empty';

const alert = Modal.alert;
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';

function getType(type, OBJ) {
  if (OBJ.orderType == 2) {
    if (OBJ.groupOrderStatus == 0) {
      return '组团成功';
    } else if (
      OBJ.groupOrderStatus == 1 ||
      (OBJ.groupOrderStatus === null && OBJ.status == 8)
    ) {
      return '组团失败';
    } else if (OBJ.groupOrderStatus == 2) {
      return '等待成团';
    } else if (type == 1) {
      return '待付款';
    }
  } else if (type == 1) {
    return '待付款';
  } else if (type == 2) {
    return '待发货';
  } else if (type == 3) {
    return '已发货';
  } else if (type == 4) {
    return '已完成';
  } else if (type == 5) {
    return '退款中';
  } else if (type == 6) {
    return '已取消';
  } else if (type == 7) {
    return '待成团'; //退过款已完成
  } else if (type == 8) {
    return '已关闭';
  } else {
    return '未知订单类型';
  }
}

class OrderListData extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.initData = [];
    this.state = {
      key: this.props.data,
      dataSource: dataSource,
      refreshing: false,
      isLoading: false,
      hasMore: false,
      requestCompleted: true,
      onTouch: false,
      type: 0,
      height: document.documentElement.clientHeight - 89,
      damping: 50,
      empty: [
        {
          name: 'xiaxie',
        },
      ],
    };
    // this.pageNow = 1;
    this.pageSize = 5;
    // this.getMoreData = true;
    this.type = this.props.index;
  }

  //reader前
  componentWillMount() {
    if (db.userAgent() === 'Android') {
      document.title = '我的订单';
    } else {
      db.setPageTitle('我的订单');
    }
  }

  //在页面被渲染成功之后
  componentDidMount() {
    if (db.userAgent() === 'IOS') {
      this.setState({
        height: document.documentElement.clientHeight - 115,
      });
    }
  }

  //页面销毁
  componentWillUnmount() {
    const { OrderTab, OrderListAction } = this.props;
    OrderListAction.hideAlert();
    if (this.alertInstance) {
      this.alertInstance.close();
    }
  }
  onRefresh() {
    const { OrderListAction } = this.props;
    let key = this.props.keyWord;
    let activeIndex = this.props.curIndex;
    this.setState({ refreshing: true });
    let userID = db.readUserInfo()['wedoId'];
    OrderListAction.getOrderList(
      [],
      userID,
      activeIndex,
      (this.pageSize = 5),
      1,
      key,
    );

    // OrderListAction.getOrderList([], userID, 2, this.pageSize = 5, this.pageNow = 1,key);

    // OrderListAction.getOrderList([], userID, 3, this.pageSize = 5, this.pageNow = 1, key);

    // OrderListAction.getOrderList([], userID,0, this.pageSize = 5, this.pageNow = 1,key);
  }

  getGoods(goods) {
    let newGoods = [];
    if (goods instanceof Array) {
      for (let i = 0; i < goods.length; i++) {
        if (goods[i].goodStatus === 1) {
          //上架中
          newGoods.push(goods[i]);
        }
      }
    }
    return newGoods;
  }

  onClick(key, rowData, rowIndex, shopId) {
    this.state.onTouch = true;
    const { OrderTab, OrderListAction, history } = this.props;
    let array = OrderTab.pendPaymentList;
    let completedList = OrderTab.completedList;
    let allAry = OrderTab.allList;
    //先暂时注释掉这个
    let userID = db.readUserInfo()['wedoId'];
    //测试----
    // let userID = "12497395";
    switch (key) {
      case 1:
        //取消订单
        this.alertInstance = alert('', '确定放弃该订单?', [
          { text: '取消', onPress: () => console.log('cancel') },
          {
            text: '确定',
            onPress: () => {
              OrderListAction.deleteOrCancelOrderPost(
                rowData.orderId,
                rowIndex,
                2,
                userID,
                array,
                allAry,
              ); //传相应的数组 orderId, operation, userId
            },
          },
        ]);
        break;
      case 2:
        //立即付款
        let newPayMapSon = {};
        newPayMapSon['orderNumber'] = rowData.orderNo;
        let newPayMap = Object.assign({}, rowData.payMap, newPayMapSon);
        let penPayState = {
          secondPayMap: newPayMap,
          orderId: rowData.orderId,
          money: rowData.payAmount,
          shopId: rowData.shopId,
          buyType: rowData.orderType == 2 ? 1 : 0,
          sonOrderId: rowData.orderSonId,
          orderNumber: rowData.orderNo,
        };
        localStorage.setItem('penPayState', JSON.stringify(penPayState));
        let url =
          contants.multishopUrl +
          '/payment' +
          '/?orderId=' +
          rowData.orderId +
          '&money=' +
          rowData.payAmount +
          '&orderNumber=' +
          rowData.orderNo +
          '&entryType=1';
        db.goToPageForApp(url, false);
        break;
      case 3:
        //删除订单
        this.alertInstance = Modal.alert('', '确定删除该订单?', [
          { text: '取消', onPress: () => null },
          {
            text: '确定',
            onPress: () => {
              OrderListAction.deleteOrCancelOrderPost(
                rowData.orderId,
                rowIndex,
                1,
                userID,
                completedList,
                allAry,
              ); //传相应的数组
            },
          },
        ]);

        break;
      case 4:
        //再次购买
        let goods = this.getGoods(rowData.goods);
        if (goods.length > 0) {
          OrderListAction.buyAgainWithOrder(userID, goods, shopId, () => {
            //10000 用户id
            this.props.onBack(false);
            let url =
              contants.multishopUrl +
              '/PPShoppingCart' +
              '/?shopId=' +
              shopId +
              '&userId=' +
              userID;
            db.goToPageForApp(url, false);
          });
        } else {
          this.alertInstance = alert('', '订单中的商品还未上架，不能购买', [
            {
              text: '确定',
              onPress: () => {},
              style: { color: '#9B885F' },
            },
          ]);
        }
        break;
    }
  }

  onEndReached() {
    const { OrderTab, OrderListAction } = this.props;
    if (OrderTab.hasMore === true && OrderTab.isShow === false) {
      //alert(1111);
      let userID = db.readUserInfo()['wedoId'];
      let key = this.props.keyWord;
      let array = [];
      let pageNow = 1;
      if (this.props.index === 1) {
        array = OrderTab.pendPaymentList;
        pageNow = OrderTab.pendPayIndex;
      } else if (this.props.index === 2) {
        array = OrderTab.toBeReceivedList;
        pageNow = OrderTab.toBeReceiveIndex;
      } else if (this.props.index === 3) {
        array = OrderTab.completedList;
        pageNow = OrderTab.completedIndex;
      } else if (this.props.index === 0) {
        array = OrderTab.allList;
        pageNow = OrderTab.allIndex;
      }
      OrderListAction.getOrderList(
        array,
        userID,
        this.props.curIndex,
        (this.pageSize = 5),
        pageNow + 1,
        key,
      );
    }
  }

  onItemClick(rowData) {
    if (rowData === this.state.empty[0]) {
      return;
    }
    if (this.state.onTouch) {
      this.state.onTouch = false;
    } else {
      this.goMyOrderDetail(rowData);
    }
  }

  //跳转我的订单详情
  goMyOrderDetail(rowData) {
    const { history } = this.props;
    const { OrderListAction } = this.props;
    OrderListAction.clearn(5);
    this.props.onBack(false);
    let orderDetail =
      contants.multishopUrl +
      '/orderDetail' +
      '/?orderNum=' +
      rowData.orderNum +
      '&orderId=' +
      rowData.orderId +
      '&orderSonId=' +
      (rowData.orderSonId || 0) +
      '&shopId=' +
      rowData.shopId +
      '&orderStatus=' +
      rowData.status;
    // alert("跳转到订单详情页面")
    db.goToPageForApp(orderDetail, false);
  }

  getItem(obj, dates) {
    //  console.log(dates);
    return dates.map((goods, index) => {
      return (
        <li className="shop_li" key={index}>
          <div
            className={index === dates.length - 1 ? 'shop_item_2' : 'shop_item'}
          >
            <div className="shop_icon_p">
              {goods.goodStatus === 0 && (
                <img
                  className="shop_icon_state"
                  src={require('../../images/order/o6@1.5x.png')}
                />
              )}{' '}
              {/*已失效*/}
              {goods.goodStatus === 2 && (
                <img
                  className="shop_icon_state"
                  src={require('../../images/order/o5@1.5x.png')}
                />
              )}{' '}
              {/*已下架*/}
              {goods.goodStatus === 3 && (
                <img
                  className="shop_icon_state"
                  src={require('../../images/order/o4@1.5x.png')}
                />
              )}
              {/*已告罄*/}
              <img className="shop_icon" src={goods.goodsFile} />
            </div>
            <div className="goodsInfo">
              <div className="goodsName">
                {goods.goodsName !== null
                  ? goods.goodsName.length > 12
                    ? goods.goodsName.split(0, 12) + '...'
                    : goods.goodsName
                  : ''}
              </div>
              {/* <div className="goodsName">{db.cutOutStr(goods.goodsName,12)}</div> */}
              <div className="goodsType">
                {Array.isArray(goods.specifications)
                  ? goods.specifications.map((specItem, specIndex) => {
                      return specItem.name ? (
                        <span key={specIndex}>
                          {specItem.type}：{specItem.name}
                        </span>
                      ) : '';
                    })
                  : null}
                {/* <span> {this.getDes(shop.specifications)}</span> */}
              </div>
              {obj.orderType == 2 ? <div className="groupIcon">团</div> : ''}
              <div className="goodsOther">
                {goods.goodsSinglePrice ? (
                  <div className="goodsPrice">
                    <icon>￥</icon>
                    <span>{goods.goodsSinglePrice}</span>
                  </div>
                ) : 0}
                {goods.goodsNum ? (
                  <div className="shop_count">{'x' + goods.goodsNum}</div>
                ) : 1}
              </div>
            </div>
          </div>
        </li>
      );
    });
  }

  render() {
    const { OrderTab, OrderListAction } = this.props;
    let array = [];
    let datas = [];
    if (this.props.index === 1) {
      array = OrderTab.pendPaymentList;
      datas = OrderTab.pendPaymentList;
    } else if (this.props.index === 2) {
      array = OrderTab.toBeReceivedList;
      datas = OrderTab.toBeReceivedList;
    } else if (this.props.index === 3) {
      array = OrderTab.completedList;
      datas = OrderTab.completedList;
    } else if (this.props.index === 0) {
      array = OrderTab.allList;
      datas = OrderTab.allList;
    }
    if (array.length === 0) {
      array = this.state.empty;
    }
    // let hei = document.documentElement.clientHeight - $(".searchNav").height;
    // console.log("hei:",(document.documentElement.clientHeight-131);
    let buttonStyle1 = 'order_button_refunds_2';
    let buttonStyle2 = 'order_button_insure_2';
    if (contants.commonUrl.indexOf('flagship') != -1) {
      if (contants.viewStyDic.SHAPE === 1) {
        buttonStyle1 = 'order_button_refunds_1';
        buttonStyle2 = 'order_button_insure_1';
      } else if (contants.viewStyDic.SHAPE === 2) {
        buttonStyle1 = 'order_button_refunds_2';
        buttonStyle2 = 'order_button_insure_2';
      } else {
        buttonStyle1 = 'order_button_refunds_3';
        buttonStyle2 = 'order_button_insure_3';
      }
    }
    let docHeight = Math.max(
      document.documentElement.clientHeight,
      contants.docHeight,
    );
    const row = (rowData, sectionID, rowId) => {
      let obj = rowData;
      if (obj === this.state.empty[0]) {
        // return (<OrderListEmpty {...this.props} height = {height } shopId={this.props.shopId}/>);
        return <Empty message={'很抱歉！没有找到相关的订单~'} />;
      } else if (obj.goods === null) {
        return null;
      } else {
        return (
          <div
            className="order_list_item"
            onClick={() => this.onItemClick(rowData)}
          >
            <div className="order_list_between" />
            <div className="orderItem">
              <div className="head clear">
                <div className="img-wrap">
                  <img
                    src={
                      obj.shopImg
                        ? obj.shopImg
                        : require('../../images/search/@1xGroup.png')
                    }
                  />
                </div>
                <div className="info">
                  <div className="name ellipsis">
                    {db.cutOutStr(obj.shopName, 12)}
                  </div>
                  <div className="sales">{'下单时间:' + obj.createTime}</div>
                </div>
                <p className="link">{getType(obj.status, obj)}</p>
              </div>
              {obj.goods === null ? (
                <div />
              ) : (
                <ul className="shop_list">{this.getItem(obj, obj.goods)}</ul>
              )}
              <div className="order_list_item_bottom">
                <div className="orderBt">
                  <div className="orderBtLeft">
                    {' '}
                    共计
                    {obj.orderNum}
                    件商品
                  </div>
                  <div className="orderBtRight">
                    {' '}
                    <span className="bPriceTxt">合计:</span>
                    <icon>￥</icon>
                    <span className="bPrice">{obj.payAmount}</span>
                  </div>
                </div>

                {/*待支付*/}
                {obj.status == 1 && (
                  <div className=" order_bottom_btn">
                    <div style={{ float: 'right', display: 'flex' }}>
                      <button
                        name="reimburse"
                        className="bottmBtn btnLeft"
                        onClick={() => {
                          this.onClick(1, rowData, rowId, rowData.shopId);
                        }}
                      >
                        取消订单
                      </button>
                      <button
                        name="receipt"
                        className="bottmBtn btnRight"
                        onClick={() => {
                          this.onClick(2, rowData, rowId, rowData.shopId);
                        }}
                      >
                        立即付款
                      </button>
                    </div>
                  </div>
                )}
                {(obj.status == 4 ||
                  obj.status == 6 ||
                  obj.status == 7 ||
                  obj.status == 8) && (
                  <div className=" order_bottom_btn">
                    <div style={{ float: 'right', display: 'flex' }}>
                      <button
                        name="reimburse"
                        className="bottmBtn btnLeft"
                        onClick={() => {
                          this.onClick(3, rowData, rowId, rowData.shopId);
                        }}
                      >
                        删除订单
                      </button>
                      <button
                        name="receipt"
                        className="bottmBtn btnRight"
                        onClick={() => {
                          this.onClick(4, rowData, rowId, rowData.shopId);
                        }}
                      >
                        再次购买
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    };
    if (OrderTab.isShow && OrderTab.isInit) {
      //请求中和切换tab或者初次进入时loading
      // return <div className="loadingView" style={{minHeight:docHeight/75+"rem"}}><div className="loadingImg"></div></div>
      return null;
    } else {
      OrderListAction.setInitPage(false);
      return (
        <div className="order_list">
          <ListView
            ref="list"
            dataSource={this.state.dataSource.cloneWithRows(array)}
            renderRow={row}
            scrollRenderAheadDistance={200}
            scrollEventThrottle={20}
            initialListSize={5}
            pageSize={5}
            style={{
              height: this.state.height,
            }}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={10}
            pullToRefresh={
              <PullToRefresh
                refreshing={this.state.isShow}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            renderFooter={datas.length > 0 ? this.getFooter.bind(this) : null}
            // renderFooter={() => (datas.length > 0 ?
            //     <div>
            //         <div className="my_listViewFoot">
            //             <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
            //             <span>
            //             {OrderTab.isShow ? '加载中...' : OrderTab.hasMore ? '加载更多' : '没有更多内容了'}
            //         </span>
            //             <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
            //         </div>
            //     </div> : null)}
          />
        </div>
      );
    }
  }

  getFooter() {
    const { OrderTab } = this.props;
    return (
      <div className="listViewFootC">
        <img
          className="imgLeft"
          src={require('../../images/homePage/wuLeft.png')}
        />
        <span>
          {OrderTab.isShow
            ? '加载中...'
            : OrderTab.hasMore
              ? '加载更多'
              : '没有更多内容了'}
        </span>
        <img
          className="imgRight"
          src={require('../../images/homePage/wuRight.png')}
        />
      </div>
    );
  }
}

export default OrderListData;
