/**
 * Created by fantiantian on 2017/11/20.
 * 拼团详情
 */

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import './groupShoppingDetail.less';
import { wxShare } from '../../../common/Apis/wxJsApis'
import InGroupShopping from './inGroupShopping';
import * as constants from '../../../common/Apis/constants';
import * as db from '../../../common/Apis/Utils';
import * as weidudb from '../../../common/Apis/weiduInteractive';

export default class GroupShoppingDetail extends Component {
  //需要订单id、子订单id 、shopId
  constructor(...args) {
    super(...args);
    this.state = {
      showMaskModal: false,
      isShowQRCodModal: false,
      QRUrl: '',
      orderId: null,        //订单id，
      orderSonId: null,  //子订单id,
      shopId: null,
      isShowLoading: true
    }
  }

  componentWillMount() {

    weidudb.userAuthorization();    //调用原生方法获取用户信息

    if (db.userAgent() === 'Android') {
      document.title = '拼团详情';
    } else {
      db.setPageTitle('拼团详情');
    }

    let theRequest = {};
    let strs = [];
    theRequest = db.getValueFromUrl(location.search)

    this.setState({
      orderId: theRequest.orderId,
      orderSonId: theRequest.orderSonId,
      shopId: theRequest.shopId
    })
  }

  componentDidMount() {

    let isWeido = this._getIsWeido();
    if (isWeido) {
      this.timer = setInterval(() => {
        var userInfo = db.readUserInfo();

        if (userInfo) {
          this._getData(userInfo.userId);
        }
      }, 500);

    } else {
      var userInfo = db.readUserInfo();
      if (userInfo === null) {   //未登陆
        this._getData(null);
      } else {
        this._getData(userInfo.userId);
      }
    }
  }

  _getIsWeido() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      //console.log("在微度内");
      return true;
    } else {
      return false;
      //console.log("在微度外");
    }
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  _getData(wedoId) {
    this.timer && clearInterval(this.timer);
    const { groupDetailsActions } = this.props;

    groupDetailsActions.getGroupDetailDataFromSever('/groupActBuy/getGroupActBuyDetail', wedoId, this.state.orderSonId, (response) => {
      this.setState({
        isShowLoading: false
      })
      let url = db.userAgent() === 'Android' ? encodeURIComponent(window.location.href.split('#')[0]) : encodeURIComponent(constants.url);
      if (response.body.goodsActDetail != null) {
        //微度分享所需参数
        var goodsActDetail = response.body.goodsActDetail;
        var goodsUrl = constants.commonServerUrl + '/goodDetails' + '/?shopId=' + this.state.shopId + '&groupId=' + goodsActDetail.groupBuyId;
        constants.groupShoppingDetailInfo = {
          title: goodsActDetail.goodsName,
          content: goodsActDetail.describes,
          imgUrl: goodsActDetail.goodsUrl,
          goodsId: goodsActDetail.goodsId,
          shareUrl: goodsUrl
        }

        //微信分享所需参数
        let dic = {
          title: goodsActDetail.goodsName,
          desc: '我参加了一个团购，快和我一起拼团吧!',//goodsActDetail.describes,
          imgUrl: goodsActDetail.goodsUrl,
          linkUrl: constants.multishopUrl + '/groupShoppingDetail' + '/?shopId=' + this.state.shopId + '&orderId=' + this.state.orderId + '&orderSonId=' + this.state.orderSonId//goodsUrl + '&goodsId=' + goodsActDetail.goodsId
        };
        wxShare([], dic, true);
        //二维码URL
        this.setState({
          QRUrl: dic.linkUrl
        })
      } else {
        wxShare(url, [], {});
      }
    }, () => {
      this.setState({
        isShowLoading: false
      })
    });
  }

  showBottomDiv(groupStatus, groupDetailData, isAttend, fontColor) {
    let borderR;
    if (fontColor['SHAPE'] == 3) {
      borderR = 'btnSemicircle';
    } else if (fontColor['SHAPE'] == 2) {
      borderR = 'btnCircular';
    } else {
      borderR = 'btnNoCircular';
    }
    if (groupStatus == 0) {
      return (
        <div>
          {isAttend ? <div className="bottomStyle">
            <div className="mulitP">恭喜！拼团成功！</div>
            <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}

              onClick={() => this.invateBtnPress(groupStatus, groupDetailData)}>查看订单详情
                        </button>
          </div> : <div className="bottomStyle">
              <div className="mulitP">该组团购已满,发起新的团购吧!</div>
              <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}
                onClick={() => this.attendGroup(groupDetailData)}>立即拼团
                        </button>
            </div>}

        </div>
      );

    } else if (groupStatus == 1) {
      return (
        <div>
          {isAttend ? <div className="bottomStyle">
            <div className="mulitP">拼团失败，若已支付钱款将尽快退还给您。</div>
            <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}
              onClick={() => this.invateBtnPress(groupStatus, groupDetailData)}>重新拼团
                        </button>
            <div className="qrCode" onClick={() => this.qrCodePress(groupStatus, groupDetailData)}>
              查看订单详情
                        </div>
          </div> : <div className="bottomStyle">
              <div className="mulitP">该组拼团失败,发起新的团购吧!</div>
              <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}
                onClick={() => this.attendGroup(groupDetailData)}>立即拼团
                        </button>
            </div>}

        </div>
      );
    } else if (groupStatus == 2) {
      return (<div>
        {isAttend ? <div className="bottomStyle">
          <div className="mulitP">还差{groupDetailData.personNum - groupDetailData.nowPerson}人成团，分享给好友拼团</div>
          <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}
            onClick={() => this.invateBtnPress(groupStatus, groupDetailData)}>邀请好友拼团
                        </button>
          <div className="qrCode" onClick={() => this.qrCodePress(groupStatus, groupDetailData)}>
            拼团二维码
                        </div>
        </div> : <div className="bottomStyle">
            <div className="mulitP">仅剩{groupDetailData.personNum - groupDetailData.nowPerson}个名额，快和好友一起拼团</div>
            <button className={"invateBtn" + ' ' + borderR} style={{ backgroundColor: fontColor['COLOR1'], color: fontColor['COLOR3'] }}
              onClick={() => this.attendGroup(groupDetailData)}>立即拼团
                        </button>
          </div>}</div>
      );
    }
  }

  render() {
    this.colorDic = constants.viewStyDic;
    const { groupShoppingDetail, groupDetailsActions } = this.props;
    let { groupText, groupStatus, groupDetailData } = groupShoppingDetail;

    let isAttend = groupDetailData ? (groupDetailData.isExist == 1 ? false : true) : null
    return (
      <div className="container" style={{ height: document.documentElement.clientHeight }}>
        {groupDetailData ? <div>
          <div className="goodDetails">
            <img src={groupDetailData.goodsUrl} />
            <div className="rightContent">
              <p>{groupDetailData.goodsName}</p>
              <p>{groupDetailData.personNum}人团</p>
              <div className="bottomPrice">
                <div className="div1">团购价:￥{groupDetailData.amount}</div>
                <div className="div2">原价:￥{groupDetailData.price}</div>
              </div>
            </div>
          </div>
          <InGroupShopping groupText={groupText}
            userImgList={groupDetailData.headList}
            totalNum={groupDetailData.joinUsers}
            needNum={groupDetailData.personNum}
            groupSucess={{
              usedTime: groupDetailData.startTime,
              beatPeopleNum: groupDetailData.beatRate
            }}
            remainingSecond={groupDetailData.time}
            remainingNoSecond={() => {
              groupDetailsActions.changeGroupStatus(1)
            }}
          />
          {this.showBottomDiv(groupStatus, groupDetailData, isAttend, this.colorDic)}
          {/* <div className={groupStatus === 0 || !isAttend ? "gotoHome hMarginTop1" : "gotoHome hMarginTop"}
                         onClick={() => this.gotoHomePage()}>
                        <div className="goHomeText">回到店铺首页</div>
                    </div> */}
        </div> : null}
        {this.state.isShowLoading ? <div className="loadingView">
          <div className="loadingImg"></div>
        </div> : null}
        <MaskModal showModal={this.state.showMaskModal} hiddenModal={() => this.hiddenModal()} />
        <QRCodeModal isShowQRCodModal={this.state.isShowQRCodModal}
          hiddenQRCodeModal={() => this.hiddenQRCodModal()} currentUrl={this.state.QRUrl} />
      </div>
    );
  }

  hiddenModal() {
    this.setState({
      showMaskModal: false
    })
  }

  //隐藏二维码
  hiddenQRCodModal() {
    this.setState({
      isShowQRCodModal: false
    })
  }

  attendGroup(groupDetailData) {
    const { history } = this.props;
    history.push({
      pathname: constants.commonUrl + '/goodDetails' + '/?shopId=' + this.state.shopId + '&goodsId=' + groupDetailData.goodsId + '&groupId=' + groupDetailData.groupBuyId + '&isAgainGroup=1',
    });
  }

  invateBtnPress(groupStatus, groupDetailData) {
    const { history } = this.props;
    console.log(groupStatus)
    if (groupStatus == 0) {
      //去订单详情 （拼团成功）
      history.push({
        pathname: constants.commonUrl + '/orderDetail' + "/?orderId=" + this.state.orderId + "&orderSonId=" + this.state.orderSonId + '&shopId=' + this.state.shopId
      });
    } else if (groupStatus == 1) {
      //重新拼团 （产品详情页）
      history.push({
        pathname: constants.commonUrl + '/goodDetails' + '/?shopId=' + this.state.shopId + '&goodsId=' + groupDetailData.goodsId + '&groupId=' + groupDetailData.groupBuyId + '&isAgainGroup=1',
      });
    } else if (groupStatus == 2) { //弹出指示页面上

      if (this._getIsWeido()) {//在维度中
        notiJSToGetParameter();
      }
      else {
        this.setState({
          showMaskModal: true
        })
      }
    }
  }

  qrCodePress(groupStatus, groupDetailData) {
    // alert(JSON.stringify(groupDetailData))
    if (groupStatus == 1) {
      //去订单详情 （拼团失败到订单的详情页）
      const { history } = this.props;
      history.push({
        pathname: constants.commonUrl + '/orderDetail' + "/?orderId=" + this.state.orderId + '&orderSonId=' + this.state.orderSonId
      });
    } else if (groupStatus == 2) {
      //拼团二维码
      if (this.state.QRUrl === '') {
        this.setState({
          QRUrl: constants.commonServerUrl + '/goodDetails' + '/?shopId=' + this.state.shopId + '&goodsId=' + groupDetailData.goodsId + '&groupId=' + groupDetailData.groupBuyId
        })
      }

      this.setState({
        isShowQRCodModal: true
      })
    }
  }

  //回到店铺首页
  gotoHomePage() {
    const { history } = this.props;
    history.push({
      pathname: constants.commonUrl + '/?shopId=' + this.state.shopId + '&shopPreview=0'
    });
  }
}

class MaskModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={this.props.showModal ? 'showMaskModal' : 'hiddenMaskModal'}
        onClick={this.props.hiddenModal}>
        <img className="img1" src={require('../../images/groupShoppingDetail/groupTogether.png')} />
        {/* <img className="img2" src={require('../../images/groupShoppingDetail/iKnow.png')}/> */}
        <span style={{ color: "white", fontSize: "59px", letterSpacing: "0.65px", fontFamily: "PingFangSC-Regula", width: "573px", height: "166px", lineHeight: "83px" }}>还差4人成团，点击右上角分享给好友</span>
      </div>
    );
  }
}

let screenWidth = window.screen.width;
let winDevicePixelRatio = window.devicePixelRatio;

class QRCodeModal extends Component {
  constructor(props) {
    super(props);
    let devicePixelRatio;
    if (db.userAgent() === 'Android') {
      devicePixelRatio = 1;
      if (screenWidth >= 720) {
        screenWidth = Math.floor(screenWidth / winDevicePixelRatio);
      }
    } else if (db.userAgent() === 'IOS') {
      devicePixelRatio = winDevicePixelRatio;
    } else {
      devicePixelRatio = 1;
    }
    this.state = {
      qrSize: devicePixelRatio * screenWidth * 350 / 750
    }
  }

  render() {
    return (
      <div className={this.props.isShowQRCodModal ? 'showQRCodeModal' : 'hiddenQRCodeModal'}
        onClick={this.props.hiddenQRCodeModal}>
        <div className="QRBgDiv">
          <QRCode value={this.props.currentUrl} size={this.state.qrSize} />
        </div>
      </div>
    );
  }
}