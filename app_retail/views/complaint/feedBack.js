/**
 * Created by Song on 2018/07/11
 * 投诉 我要反馈
 */

import React, { Component } from "react";
import "./feedBack.less";
import { post } from "../../../common/Apis/Fetch.js";
import { Toast } from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import SvgImg from '../../../common/svgImage/svgImg'

export default class feedBack extends Component {
  constructor(props) {
    super(props);
    let theRequest = db.getValueFromUrl(location.search); // url search字段对象
    this.state = {
    };
  }

  componentDidMount() {
    if (db.userAgent() === "Android") {
      document.title = "我要反馈";
    } else {
      db.setPageTitle("我要反馈");
    }
      this.setState({
          orderNumber: this.props.history.location.state.saleOrderNo
      })
    const { feedBackAction } = this.props;
    feedBackAction.getReasons("/complain/getComplainReasons");
  }

  //选择投诉原因
  selectReason(id, list) {
    let { feedBackAction } = this.props;
    this.setState({
      reasonid: id
    })
    let list2 = list.map(item => {
      return {
        msgId: item.msgId,
        msgContent: item.msgContent,
        select: id === item.msgId ? true : false
      }
    })
    feedBackAction.selectReason(list2)
  }

  //下一步
  nextStep() {
    const { history, feedBackReducer } = this.props;
    const { select, orderNumber } = feedBackReducer;
    const { reasonid } = this.state;
    if (select) {
      history.push({
        pathname:`${contants.commonUrl}/uploadProof/?reasonid=${reasonid}&orderNumber=${orderNumber}`,
        orderId:this.props.location.state.orderId
      })
    }
  }

  render() {
    console.log(this.state,'2222222222222');
    const { reasons, select } = this.props.feedBackReducer;
    const { svgList, orderNumber } = this.state;
    //const { orderNumber } = this.props;
    return (
      <div className="name-space-feedback">
        <div className="title">投诉的对象</div>
        <p>订单号：{orderNumber}</p>
        <div className="title">请选择投诉的原因</div>
        <ul>
          {
            reasons.map(item => {
              return (
                <li key={item.msgId} onClick={() => this.selectReason(item.msgId, reasons)}>
                  {item.msgContent}
                  {item.select ? <SvgImg className="icon" style={{fill: '#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null}
                </li>
              )
            })
          }
        </ul>
        <div className={select?"next":"next disabled"} onClick={() => this.nextStep()}>下一步</div>
      </div>
    )
  }
}
