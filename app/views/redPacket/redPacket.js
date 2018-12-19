import React, { Component } from 'react';
import './redPacket.less';
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import * as weidudb from '../../../common/Apis/weiduInteractive';
import * as contants from '../../../common/Apis/constants'

export default class RedPacket extends Component {
  constructor(...args) {
    super(...args);
    this.shopId = 0;
    this.intervalFn = null;
    this.userInfo = {};
    this.theRequest = db.getValueFromUrl();
  }

  componentWillMount() {
    let { history } = this.props;
    let userInfo = db.readUserInfo();
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      weidudb.getUserInfo();
    } else {
      if (!userInfo) {
        history.replace({
          pathname: contants.commonUrl + '/login/?path=redPacket?shopId=' + this.theRequest['shopId']
        })
      }
    }
    document.title = '红包明细';
    const u = navigator.userAgent;
    let isWeidu = u.indexOf('wedo') > -1;
    this.setState({ isWeidu }) //判断是否在app中，不在则不显示退出登录按钮
  }

  //在页面被渲染成功之后
  componentDidMount() {
    const userInfo = db.readUserInfo();
    const { RedPacketActions } = this.props;
    wxShare([], {});
    RedPacketActions.redPacketDetail('/redPacket/getRedPacketMoneyDetailed', { userId: userInfo.wedoId }, () => { }, () => { });
  }

  //页面销毁
  componentWillUnmount() {

  }

  render() {
    return (
      <div className="orderHome">
        123
      </div>
    )
  }
}
