/**
 * Created by AndyWang on 2017/7/7.
 */
import React, { Component } from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'

export default class HatList extends Component {


  render() {

    let hatData = this.props.hatData;
    let goodName = hatData.goodsName ? hatData.goodsName : '';
    return (
      <div className="hatBody" onClick={() => this.goDetails(hatData.goodsId)}>
        <div className="hatImgBody">
          <div className="imgContainer">
            {hatData.status === 2 ? <img className="soldOutImg" src={require('../../images/goodDetails/o1@1x.png')} /> : null}
            <img className="hatImg" src={hatData.imgHostUrl + hatData.imgFileUrl} />
          </div>
        </div>
        <div className="hatName">{goodName}</div>
        <div className="imgPrice">
          <div className="hatUnitPrice">￥{hatData.inGroupBuying === 1 ? hatData.groupPrice : hatData.price}</div>
          {hatData.inGroupBuying === 1 ? <img className="tuanImg" src={require('../../images/homePage/tuangou.png')} />
            : null}
          {hatData.consumerRebate ?
            <div className="cash_Back">
              <span><i>返现</i>最高￥{hatData.consumerRebate}</span>
            </div>
            : null}
        </div>
      </div>
    )
  }
  goDetails(goodsId) {
    if (contants.shopPreView != 1) {
      const { history } = this.props;
      let url = contants.commonUrl + '/goodDetails' + '/?shopId=' + this.props.shopId + '&goodsId=' + goodsId
      history.push({
        pathname: url,
        state: {
        }
      });
    }
  }
}