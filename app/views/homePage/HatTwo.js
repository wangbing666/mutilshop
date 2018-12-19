/**
 * Created by chengjiabing on 17/11/22.
 * 分区列表第二种UI
 */
import React, { Component } from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import * as db from '../../../common/Apis/Utils';
import LazyLoad from 'react-lazyload';

export default class HatTwo extends Component {
  render() {
    // {hatData.status===2?<img className="soldOutImg" />:null}
    let hatData = this.props.hatData;
    let goodName = hatData.goodsName ? hatData.goodsName : '';
    let viewStyDic = contants.viewStyDic
    return (
      <div className="hatTwoContainer" onClick={() => this.goDetails(hatData.goodsId)}>
        <div className="imgContainer">
          <LazyLoad>
            <img className="goodImg" src={hatData.imgHostUrl + hatData.imgFileUrl} />
          </LazyLoad>
          {hatData.status === 2 ? <img className="shouqing" src={require('../../images/goodDetails/o1@1x.png')} /> : null}
        </div>
        <div className="right">
          <div>
            <p className="goodName">{goodName}</p>
            {hatData.inGroupBuying === 1 ? <div className="original_price">
              <div className="prePrice">
                原价{hatData.price}
              </div>
            </div> : null}
            {hatData.consumerRebate ?
              <div className="cash_Back">
                <span><i>返现</i>最高￥{hatData.consumerRebate}</span>
              </div>
              : null}
          </div>
          {
            hatData.inGroupBuying === 1 ?
              <div className="blue" style={viewStyDic ? { backgroundColor: viewStyDic.COLOR1 } : null}>
                <div className="price" style={viewStyDic ? { color: viewStyDic.COLOR3 } : null}>￥{hatData.groupPrice}</div>
                <div className="qianggou" style={viewStyDic && true ? { color: viewStyDic.COLOR1 } : null}>{hatData.inGroupBuying ? '团购中' : '立即抢购'}</div>
                <div className='triangle' />
              </div>
              :
              <div className="blue" style={viewStyDic ? { backgroundColor: viewStyDic.COLOR1 } : null}>
                <div className="price" style={viewStyDic ? { color: viewStyDic.COLOR3 } : null}>￥{hatData.price}</div>
                <div className="qianggou" style={viewStyDic && true ? { color: viewStyDic.COLOR1 } : null}>{hatData.inGroupBuying ? '团购中' : '立即抢购'}</div>
                <div className='triangle' />
              </div>
          }
        </div>
        <div className="verticalLine">
          <div className="bottomLine"></div>
        </div>
      </div>
    )
  }
  goDetails(goodsId) {
    if (contants.shopPreView != 1) {
      let url = contants.multishopUrl + '/goodDetails' + '/?shopId=' + this.props.shopId + '&goodsId=' + goodsId
      db.goToPageForApp(url, false)
    }
  }
}