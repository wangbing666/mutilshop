/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, { Component } from "react"
import './orderDetail.less';
import DetailPublic from "./detailPublic";
import * as db from '../../../common/Apis/Utils';
import { post } from '../../../common/Apis/Fetch';
import { Modal, Icon, Toast } from 'antd-mobile';
import { wxShare } from "../../../common/Apis/wxJsApis";
import * as contants from '../../../common/Apis/constants'
import SvgImg from "../../../common/svgImage/svgImg";
import * as weidudb from '../../../common/Apis/weiduInteractive';
const alert = Modal.alert;

import { isJumpToPayment } from '../../../common/Apis/constants'

class MyOrderDetail extends Component {
  //在页面被渲染成功之后
  constructor(props) {
    super(props);
    this.state = {
      type: 5,
      timeOut: false,
      showModal: false,
      showModalBg: false,
      logisticsList: [], //物流信息列表
      orderStatus: 0,
      btnBoolean: null,
      moreExpress: null
    }
    this.orderId = 0;
    this.orderNum = 0;
    this.orderSonId = 0;
    this.leaveMsg = "";

    let theRequest = {};
    let strs = [];
    // let urls = location.search; //获取url中"?"符后的字串
    // if (urls.indexOf("?") !== -1) {
    //     let str = urls.substr(1);
    //     strs = str.split("&");
    //     for (let i = 0; i < strs.length; i++) {
    //         theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    //     }
    // }
    theRequest = db.getValueFromUrl();
    this.request = theRequest;
    this.orderId = theRequest.orderId;
    this.orderNum = theRequest.orderNum;
    this.orderSonId = theRequest.orderSonId;
  }


  /**
   *
   * @param orders
   * @returns {number}  1.待付款，2其他状态，3. 订单已完成
   */
  getOrderType(orders) {
    if (orders instanceof Array) {
      let length = orders.length;
      for (let i = 0; i < length; i++) {
        if (orders[i].status === 1) {
          return 1; //子订单中有一个是待付款的，应该全部都是待付款
        } else if (orders[i].status === 2 || orders[i].status === 3 || orders[i].status === 5 || orders[i].status === 6 || orders[i].status === 7) {
          return 2 //子订单中有一个是订单是没有完成的，母订单不可能是完成状态
        }
      }
    }
    return 3;//当所有子订单都是取消或者已完成状态 ，订单是结束状态

  }

  //reader前
  componentWillMount() {
    // orderId:res.orderId,
    //     sonOrderId:res.sonOrderId,
    //     shopId:goodInfo[0].shopId,
    //     buyType:buyType,
    //     money:this.getPrice(1)
    const userInfo = db.readUserInfo()
    if (isJumpToPayment === true) {//直接跳转订单详情界面
      // console.log(this.props.location.state.appNeedData)
      // const params = this.props.location.state.appNeedData;
      // let queryParams = '';
      // Object.keys(params).forEach(key => {
      //   if (key == 'paymentItemList') {
      //     params[key] = JSON.stringify(params[key])
      //   }
      //   queryParams += `${key}=${params[key]}&`
      // })
      this.props.history.push({
        pathname: contants.commonUrl + '/payment',
        state: {
          orderId: this.props.location.state.orderId,
          sonOrderId: this.props.location.state.sonOrderId,
          buyType: this.props.location.state.buyType,
          money: this.props.location.state.money,
          shopId: this.props.location.state.shopId,
          orderNumber: this.props.location.state.orderNumber,
          shopType: this.props.location.state.shopType,
          appNeedData: this.props.location.state.appNeedData
        }
      });
    } else {
      document.title = '订单详情';
      db.setPageTitle('订单详情');
      if (!userInfo) {
        this.props.history.replace({
          pathname: contants.commonUrl + '/login/' + this.props.location.search + '&path=orderDetail'
        })
      }
      if (userInfo && this.request['userId'] && this.request['userId'] != userInfo.userId) { // 判断分享出去的页面是否本人登录
        alert('您无权查看此交易');
        setTimeout(() => {
          this.props.history.replace({
            pathname: contants.commonUrl + '/index'
          })
        }, 3000)
      }
      console.log(this.props.location.search)
      try {
        weidudb.userAuthorization();//调用原生方法获取用户信息
      }
      catch (e) {
        alert(JSON.stringify(e))
      }
    }
  }

  componentDidMount() {
    const { location } = this.props;
    db.getShopBasic(this.request.shopId, 1);
    if (location.state && location.state.hasOwnProperty("next_leaveMsg") && location.state.next_leaveMsg !== "") {

      this.leaveMsg = this.props.location.state.next_leaveMsg;
    }
    this.setState({
      orderStatus: this.request.orderStatus
    })
    if (isJumpToPayment === false) {
      const { OrderListAction } = this.props;
      // let userID = db.readUserInfo()['wedoId'];
      let userID = db.readUserInfo()['userId'];//(此处原来写的为wedoId)
      OrderListAction.getOrderDetail(userID, this.orderId, this.orderSonId, (orderDetail) => {
        // 成功回调
        this.goodsDetail_allData = orderDetail;
        this.expressInfo = orderDetail.orderSonList[0];

        if (orderDetail.orderSonList && orderDetail.orderSonList.length > 0) {

          for (let j = 0; j < orderDetail.orderSonList.length; j++) {
            if (orderDetail.orderSonList[j].status == 3 || orderDetail.orderSonList[j].status == 4 || (orderDetail.orderSonList[j].status == 5 && orderDetail.orderSonList[j].transportNo != null) || orderDetail.orderSonList[j].status == 6) {//已关闭查看物流(orderDetail.orderSonList[j].status == 8 && orderDetail.orderType != 2 ) || 
              this.setState({
                btnBoolean: true
              })
            } else {
              this.setState({
                btnBoolean: false
              })
            }
          }

        }

        if (this.getOrderType(orderDetail.orderSonList) === 1) {
          let createT = new Date(orderDetail.createTime.replace('-', '/').replace('-', '/')).getTime();
          let timeLeave = 0;

          if (orderDetail.orderType == 1) {
            timeLeave = 3600 - parseInt((orderDetail.nowDate - createT) / 1000);
          } else {
            timeLeave = 1800 - parseInt((orderDetail.nowDate - createT) / 1000)
          }

          if (timeLeave <= 0) {
            this.setState({ timeOut: true });
          } else {
            this.setState({ expiredTime: ((Math.floor(timeLeave / 60)) + "分" + (timeLeave - Math.floor(timeLeave / 60) * 60) + "秒") });
            //有时间限制开启定时器
            if (timeLeave != 0) {
              this.state.timer = setInterval(() => {
                timeLeave--;
                if (timeLeave == 0) {
                  this.setState({ timeOut: true });
                  clearInterval(this.state.timer);
                  return;
                }
                this.setState({ expiredTime: ((Math.floor(timeLeave / 60)) + "分" + (timeLeave - Math.floor(timeLeave / 60) * 60) + "秒") });
              }, 1000);
            }
          }
        }

      }, () => {
        //失败回调

      });
      // debugger;
      wxShare([], {});
      //回退监听
      // window.addEventListener("popstate", function (e) {
      //     if (isReturn) {
      //         OrderListAction.clearn(5);
      //     }
      //
      // }, false);
    }
  }

  //页面销毁
  componentWillUnmount() {
    if (this.state.timer != null) {
      clearInterval(this.state.timer);
    }
    const { OrderTab, OrderListAction } = this.props;
    OrderListAction.hideAlert()
    if (this.alertInstance) {
      this.alertInstance.close();
    }

  }

  getGoods(orderSonlist) {
    //orderSonlist[i].goods[j].goodStatus商品状态：1：上架，2：下架，3：库存为0
    let newGoods = [];
    if (orderSonlist instanceof Array) {
      for (let i = 0; i < orderSonlist.length; i++) {
        for (let j = 0; j < orderSonlist[i].goods.length; j++) {
          if (orderSonlist[i].goods[j].goodStatus == 1) {
            newGoods.push(orderSonlist[i].goods[j])
          }
        }

      }
    }
    return newGoods;
  }

  onClick(key) {
    const { OrderListAction, history, OrderTab } = this.props;
    let array = OrderTab.pendPaymentList;
    let detail = OrderTab.orderDetail;
    let completedList = OrderTab.completedList;
    let allAry = OrderTab.allList;
    // let userID = db.readUserInfo()['wedoId'];
    let userID = db.readUserInfo()['userId'];
    //  console.log("下单详情页面...",JSON.stringify(detail));
    switch (key) {
      case 1:
        //删除订单
        this.alertInstance = alert('确定删除该订单?', '', [
          { text: '取消', onPress: () => console.log('cancel'), style: { color: '#9B885F' } },
          {
            text: '确定', onPress: () => {
              OrderListAction.deleteOrCancelOrder(detail.orderId, 1, userID, completedList, allAry, () => {
                history.goBack();
              });//传相应的数组
            }, style: { color: '#9B885F' }
          },
        ]);
        break;
      case 2:
        //再次购买
        let goods = this.getGoods(detail.orderSonList);
        //orderSonlist[i].goods[j].goodStatus商品状态：1：上架，2：下架，3：库存为0
        if (goods.length > 0) {
          OrderListAction.buyAgainWithOrder(userID, goods, detail.shopId, () => { //10000 用户id
            this.props.history.push({
              pathname: contants.commonUrl + '/PPShoppingCart' + "/?shopId=" + detail.shopId + "&userId=" + userID
            });
          })
        } else {
          this.alertInstance = alert('订单中的商品还未上架，不能购买', '', [
            {
              text: '确定', onPress: () => {
              }, style: { color: '#9B885F' }
            },
          ]);
        }
        break;
      case 3:
        //取消订单
        this.alertInstance = alert('确定放弃该订单?', '', [
          { text: '取消', onPress: () => console.log('cancel'), style: { color: '#9B885F' } },
          {
            text: '确定', onPress: () => {
              OrderListAction.deleteOrCancelOrder(detail.orderId, 2, userID, array, allAry, () => {
                contants.createOrderData = {}//
                history.goBack();
              });//传相应的数组 orderId, operation, userId
            }, style: { color: '#9B885F' }
          },
        ]);
        break;
      case 4:
        //立即付款
        let newPayMapSon = {};
        newPayMapSon["orderNumber"] = this.goodsDetail_allData.orderNo;
        let newPayMap = Object.assign({}, this.goodsDetail_allData.payMap, newPayMapSon);

        this.props.history.push({
          pathname: contants.commonUrl + '/payment' + '/?orderId=' + detail.orderId + '&money=' + detail.amount + '&orderNumber=' + detail.orderNo,
          state: {
            secondPayMap: newPayMap,
            orderId: detail.orderId,
            money: detail.amount,
            shopId: detail.shopId,
            buyType: detail.orderType == 2 ? 1 : 0,
            sonOrderId: this.orderSonId,
            orderNumber: detail.orderNo
          }
        });
        OrderListAction.clearn(1);
        break;
    }
  }

  getPayType(type) {
    switch (parseInt(type)) {
      case 1:
        return "银行卡(快捷)"
        break;
      case 2:
        return "信用卡(快捷)"
        break;
      case 3:
        return "微信"
        break;
      case 4:
        return "支付宝"
        break;
      case 5:
        return "零钱"
        break;
      case 6:
        return "银行卡"
        break;
      case 7:
        return "信用卡"
        break;
      case 8:
        return "企业钱包"
        break;
      case 9:
        return "公务钱包"
        break;
      case 10:
        return "福利钱包"
        break;
    }
  }

  contactService() {//联系客服
    const { OrderTab } = this.props;
    let userInfo = db.readUserInfo();
    let shopId = this.request['shopId'];
    const { history } = this.props;
    if (userInfo === null) {
      history.push({
        pathname: contants.commonUrl + '/login/?shopId=' + this.shopId,
        state: {
          pathname: contants.commonUrl + '/chatV?shopId=' + this.shopId,
          type: 5
        }
      });
    } else {
      let userChartInfo = {
        userId: userInfo["userId"],
        userHeadUrl: userInfo["headUrl"],
        shopId: shopId,
        userName: userInfo["userNickname"],
      };
      let query = '';
      if (OrderTab && OrderTab.orderDetail && OrderTab.orderDetail.isProxySale == 0) { // 旗舰店客服
        userChartInfo['forwardScene'] = 10003;
        userChartInfo['shopLogoUrl'] = contants.shareShopImgUrl;
        userChartInfo['enterpriseId'] = contants.shopInfo.enterpriseId;
        userChartInfo['shopName'] = contants.shopInfo.shopName;
      }
      Object.keys(userChartInfo).forEach((key) => {
        query += `${key}=${userChartInfo[key]}&`
      })
      window.location.href = contants.customerServiceUrl + query;
    }
  }

  queryExpressInfo() {
    const { OrderTab, history } = this.props;
    let detail = OrderTab.orderDetail;
    let orderListFather = detail.orderSonList;
    let ruleId = [];
    for (let i = 0; i < orderListFather.length; i++) {
      for (let j = 0; j < orderListFather[i].goods.length; j++) {
        console.log(orderListFather[i].goods[j])
        if (orderListFather[i].goods[j].combinationId !== null) {

          ruleId.push(orderListFather[i].goods[j].combinationId)
        }
      }
    }

    if (ruleId.length == 0) {
      return Toast.info("数据错误，暂无物流信息", 1)
    }
    post(`/transportInfo/getTransportInfo`, { //查看商家物流

      orderId: this.expressInfo.orderId,
      combinationIdList: ruleId
    }, (res) => {
      if (JSON.stringify(res.body) !== "{}") {
        let resultData = null;

        if (!res.body.hasOwnProperty("result")) {
          resultData = res.body.data;
        } else {
          resultData = res.body.result.list;
        }
        if (resultData.length > 1 && Number(detail.isMultiTran) === 1) {
          this.setState({
            showModalBg: true,
            logisticsList: resultData,
          })
          setTimeout(() => {
            this.setState({
              showModal: true
            })
          }, 20)

        } else {
          //  history.push(`${contants.commonUrl}/logistics?totalNum=${resultData.goodsNum}&url=${resultData.hostUrl + resultData.zoomUrl}&status=${this.expressInfo.sonOrderStatus}&orderId=${this.expressInfo.orderId}&deliverCompanyName=${resultData.transportName}&deliverCompanyNo=${resultData.deliverCompanyNo}&transportNo=${resultData.transportNo}`)

          history.push({
            pathname: contants.commonUrl + '/logistics',
            query: {
              totalNum: resultData.goodsNum, //商品数量
              url: resultData.hostUrl + resultData.zoomUrl,//商品缩略图
              status: this.expressInfo.sonOrderStatus, //订单状态
              orderId: this.expressInfo.orderId, //订单id
              deliverCompanyName: resultData.transportName, // 物流公司名称
              deliverCompanyNo: resultData.deliverCompanyNo,  // 物流公司对应码
              transportNo: resultData.transportNo, //运单号
            }
          });
        }

      } else {
        Toast.info("暂无物流信息", 1)
      }


    }, (err) => {
      Toast.info(err.msg, 2)
    })
  }

  queryLogistics() { //查看物流,暂时先不用

    const { OrderTab, history } = this.props;
    let detail = OrderTab.orderDetail;

    //如果发了多家快递公司，下方弹出窗口
    if (Number(detail.isMultiTran) === 1) {

      this.setState({
        showModalBg: true,
        // logisticsList: this.state.moreExpress,
        logisticsList: detail.orderSonList[0].goods,

      })
      setTimeout(() => {
        this.setState({
          showModal: true
        })
      }, 20)

    } else {
      let orderListFather = detail.orderSonList;
      let ruleId = [];
      for (let i = 0; i < orderListFather.length; i++) {
        for (let j = 0; j < orderListFather[i].goods.length; j++) {
          if (orderListFather[i].goods[j].combinationId !== null) {

            ruleId.push(orderListFather[i].goods[j].combinationId)
          }
        }
      }

      post(`/transportInfo/getTransportInfo`, { //查看商家物流

        orderId: this.expressInfo.orderId,
        combinationIdList: ruleId
      }, (res) => {
        console.log(res)
        const { history } = this.props;
        // const data = res.body.result.list;

        // history.push(`${contants.commonUrl}/logistics?totalNum=${orderListFather[0].goods[0].goodsNum}&url=${orderListFather[0].goods[0].goodsFile}&status=${this.expressInfo.sonOrderStatus}&orderId=${this.expressInfo.orderId}&deliverCompanyName=${orderListFather[0].logisticsName}&deliverCompanyNo=${orderListFather[0].logisticsCode}&transportNo=${orderListFather[0].transportNo}`)

        history.push({
          pathname: contants.commonUrl + '/logistics',
          query: {
            totalNum: orderListFather[0].goods[0].goodsNum, //商品数量
            url: orderListFather[0].goods[0].goodsFile,//商品缩略图
            status: this.expressInfo.sonOrderStatus, //订单状态
            orderId: this.expressInfo.orderId, //订单id
            deliverCompanyName: orderListFather[0].logisticsName, // 物流公司名称
            deliverCompanyNo: orderListFather[0].logisticsCode,  // 物流公司对应码
            transportNo: orderListFather[0].transportNo, //运单号
          }
        });

      }, (err) => {
        Toast.info(err.msg, 2)

      })

    }
  }

  logisticsDetail(data, bigdata) {//物流详情
    const { history, OrderTab } = this.props;
    let detail = OrderTab.orderDetail;
    // history.push(`${contants.commonUrl}/logistics?totalNum=${data.goodsNum}&url=${data.goodsFile}&status=${bigdata.status}&orderId=${bigdata.orderId}&deliverCompanyName=${data.logisticsName}&deliverCompanyNo=${data.logisticsCode}&transportNo=${data.transportNo}`)
    //  history.push(`${contants.commonUrl}/logistics?totalNum=${data.goodsNum}&url=${data.hostUrl + data.zoomUrl}&status=${this.expressInfo.sonOrderStatus}&orderId=${this.expressInfo.orderId}&deliverCompanyName=${data.transportName}&deliverCompanyNo=${data.deliverCompanyNo}&transportNo=${data.transportNo}`)
    history.push({
      pathname: contants.commonUrl + '/logistics',
      query: {
        totalNum: data.goodsNum, //商品数量
        url: data.hostUrl + data.zoomUrl,//商品缩略图
        status: this.expressInfo.sonOrderStatus, //订单状态
        orderId: this.expressInfo.orderId, //订单id
        deliverCompanyName: data.transportName, // 物流公司名称
        deliverCompanyNo: data.deliverCompanyNo,  // 物流公司对应码
        transportNo: data.transportNo, //运单号
      }
    });

  }

  hideModal() {
    this.setState({
      showModal: false
    })
    setTimeout(() => {
      this.setState({
        showModalBg: false
      })
    }, 200)
  }

  getUnpackageList() {//未打包商品列表
    const { history } = this.props;
    history.push({
      pathname: contants.commonUrl + '/unpackageList',
      state: {
        packageId: 11, //TODO
        packageType: 0, //0未打包
        unPackageGoodsList: this.state.unPackageGoodsList
      }
    })
  }

  // showLogistics() {

  //         console.log(this.btnBoolean)
  //         let status = this.state.orderStatus;//母订单状态
  //         if(status == 3 || status == 4 || status == 5 || status == 6 || status == 7) {
  //             //3已发货 4已完成 5退款中 6已取消 7退款已完成
  //             //已发货、已完成、已关闭、已发货_退款中(原型图中给出的显示“查看物流”可显状态！)
  //             //已关闭：15退货退款完成，16待付款取消订单，17待发货退款成功
  //             //已发货_退款中：6已发货申请退款，7同意买家退款，13申请退货已寄件，14申请退货确认收货
  //             // return true;
  //             return true;
  //         }else{
  //             return false;
  //         }

  // }

  render() {

    let buttonStyle1 = "detail_order_bottom_button_style_2";
    let buttonStyle2 = "detail_order_bottom_button_2";
    if (contants.commonUrl.indexOf("flagship") != -1) {
      if (contants.viewStyDic.SHAPE === 1) {
        buttonStyle1 = "detail_order_bottom_button_style_1"
        buttonStyle2 = "detail_order_bottom_button_1"
      } else if (contants.viewStyDic.SHAPE === 2) {
        buttonStyle1 = "detail_order_bottom_button_style_2"
        buttonStyle2 = "detail_order_bottom_button_2"
      } else {
        buttonStyle1 = "detail_order_bottom_button_style_3"
        buttonStyle2 = "detail_order_bottom_button_3"
      }
    }


    const { OrderTab } = this.props;

    let detail = OrderTab.orderDetail;
    if (detail !== null) {
      return (
        <div className="order_list">
          {(this.getOrderType(detail.orderSonList) === 1 && !this.state.timeOut) &&
            <div className="tipOn"
              style={{ color: "#FF8B2D", background: "#FFF7E0" }}>
              <SvgImg className="svgImg" xlinkHref="#wedo-wedoicon-17" style={{ fill: "#FF8B2D" }} />
              <div className="text">你于<span>{detail.createTime}</span>&nbsp;&nbsp;
                            下的订单,请在<span>{this.state.expiredTime}</span>内付款，超时订单将取消
                        </div>
            </div>}

          {(this.getOrderType(detail.orderSonList) === 1 && this.state.timeOut) &&
            < div className="tipOff" style={{ color: "#1A1A1A", background: "#E3E5E9" }}>
              <SvgImg className="svgImg" xlinkHref="#wedo-wedoicon-17" style={{ fill: contants.viewStyDic.COLOR3 }} />
              <div className="text">你于<span>{detail.createTime}</span>下的订单已超过时间未付款，订单已自动取消</div>
            </div>}
          {detail.receiveTime && detail.receiveTime <= 3 ? <div className="broadcast">
            <img src={require('../../images/order/broadcast.png')} />
            <span>您有订单将于{detail.receiveTime}天内自动确认收货，请尽快确认。</span>
          </div> : null}
          {/* <div className="detail_order_item_line"/> */}
          <DetailPublic data={detail} {...this.props} shopId={detail.shopId} createTime={detail.createTime} contactService={this.contactService.bind(this)} />
          {detail.bileType && <div className="detail_order_item_line" />}
          {detail.bileType &&
            <div className="order_detail_number_pp">
              <div className="detail_left">支付方式</div>
              <div
                className="detail_right_2">{this.getPayType(detail.bileType)}</div>
            </div>

          }

          <div className="detail_order_item_line" />
          <div className="order_detail_number_pp">
            <div className="detail_left">送货时间</div>
            <div
              className="detail_right_2">{detail === null ? '' : (detail.sendType === 1 ? '随时' : (detail.sendType === 2 ? '工作日' : '非工作日'))}</div>
          </div>
          {
            detail.leaveMsg && <div className="order_detail_number_pp" style={{ borderTop: "0.0134rem solid #e9e9e9" }}>
              <div className="detail_left">留言</div>
              <div
                className="detail_right_2">{detail.length > 20 ? detail.leaveMsg.substring(0, 20) + "..." : detail.leaveMsg}</div>
            </div>
          }
          <div className="detail_order_item_line" />
          <div className="detail_money">
            <div className="detail_order_money">
              <div className="detail_left pd0">商品金额</div>
              <div
                className="detail_right">{detail !== null ? '￥' + detail.goodsMoney : ''}</div>
            </div>
            {/* <div className="detail_line"></div> */}
            <div className="detail_order_real_money_p">
              <div className="detail_order_real_money"> 合计:<span
                color="#00000"><i>￥</i>{detail !== null ? detail.amount : ''}</span></div>
            </div>
          </div>
          <div className="detail_order_item_line" />

          {/* 订单详情最下方不再有 以下两个按钮*/}
          {/* {(Number(this.getOrderType(detail.orderSonList)) === 3 || detail.groupStatus ==1) && <div className="detail_order_bottom">
                        <div className="detail_order_bottom_button_p">
                            <button className={buttonStyle2}
                                    style={{background: contants.viewStyDic.COLOR2, color: contants.viewStyDic.COLOR1}}
                                    onClick={() => {
                                        this.onClick(1)
                                    }}>删除订单
                            </button>
                            <button className={buttonStyle1}
                                    style={{background: contants.viewStyDic.COLOR1, color: contants.viewStyDic.COLOR3}}
                                    onClick={() => {
                                        this.onClick(2)
                                    }}>再次购买
                            </button>
                        </div>
                    </div>
                    } */}
          {this.getOrderType(detail.orderSonList) === 1 &&
            <div className="detail_order_bottom">
              <div className="detail_order_bottom_button_p">
                <button className={buttonStyle2}
                  style={{ background: contants.viewStyDic.COLOR2, color: contants.viewStyDic.COLOR1 }}
                  onClick={() => {
                    this.onClick(3)
                  }}>取消订单
                            </button>
                <button className={buttonStyle1}
                  style={{ background: contants.viewStyDic.COLOR1, color: contants.viewStyDic.COLOR3 }}
                  onClick={() => {
                    this.onClick(4)
                  }}>立即付款
                            </button>
              </div>
            </div>
          }

          {
            // this.showLogistics()?<div className="space"></div>:null
            this.state.btnBoolean ? <div className="space"></div> : null

          }
          {

            this.state.btnBoolean ? <div className="logistics-btn" style={{ color: contants.viewStyDic.COLOR1 }} onClick={this.queryExpressInfo.bind(this)}>查看物流</div> : null
          }


          <div className={this.state.showModalBg ? "modal active" : "modal"}>
            <div className={this.state.showModal ? "modal-bg active" : "modal-bg"} onClick={this.hideModal.bind(this)}></div>
            <div className={this.state.showModal ? "modal-content active" : "modal-content"}>
              <h2>查看物流<Icon type="cross" color="#556481" onClick={this.hideModal.bind(this)} /></h2>
              <div className="scroll-view">
                {this.state.logisticsList.map((item, index) => {
                  return (<div key={index} className="package-list" onClick={this.logisticsDetail.bind(this, item, this.expressInfo)}>
                    <h3>
                      <a>包裹{index + 1}</a>
                      <Icon type="right" color="#D1D1D3" />
                      <span>物流详情</span>
                    </h3>
                    <div className="info">
                      <div className="img-wrap">
                        <img src={item.hostUrl + item.zoomUrl} />
                        <b>{item.goodsNum}件商品</b>
                      </div>
                      <div className="txt">
                        <div>承运来源：{item.transportName}</div>
                        <p>运单编号：{item.transportNo}</p>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
              <h5 style={{ color: contants.viewStyDic.COLOR1 }} onClick={this.state.hasUnpackageGoods && this.getUnpackageList.bind(this)}>{this.state.hasUnpackageGoods ? '未打包商品' : '所有商品均已发货'}</h5>
            </div>
          </div>
          {/* <div className={this.state.showModalBg?"modal active":"modal"}>
                        <div className={this.state.showModal?"modal-bg active":"modal-bg"} onClick={this.hideModal.bind(this)}></div>
                        <div className={this.state.showModal?"modal-content active":"modal-content"}>
                            <h2>查看物流<Icon type="cross" color="#556481" onClick={this.hideModal.bind(this)} /></h2>
                            <div className="scroll-view">
                                {this.state.logisticsList.map((item, index) => {
                                    return (<div key={index} className="package-list" onClick={this.logisticsDetail.bind(this, item,this.expressInfo)}>
                                        <h3>
                                            <a>包裹{index+1}</a>
                                            <Icon type="right" color="#D1D1D3" />
                                            <span>物流详情</span>
                                        </h3>
                                        <div className="info">
                                            <div className="img-wrap">
                                                <img src={item.goodsFile} />
                                                <b>{item.goodsNum}件商品</b>
                                            </div>
                                            <div className="txt">
                                                <div>承运来源：{item.logisticsName}</div>
                                                <p>运单编号：{item.transportNo}</p>
                                            </div>
                                        </div>
                                    </div>)
                                })}
                            </div>
                            <h5 style={{color: contants.viewStyDic.COLOR1}} onClick={this.state.hasUnpackageGoods && this.getUnpackageList.bind(this)}>{this.state.hasUnpackageGoods ? '未打包商品' : '所有商品均已发货'}</h5>
                        </div>
                    </div> */}
        </div>);
    } else {
      return (<div />);

    }
  }
}

export default MyOrderDetail;
