/**
 * Created by chengjiabing on 17/11/22.
 */


/**
 * Created by chengjiabing on 17/11/22.
 * 分区列表第3种UI
 */
import React, { Component } from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import LazyLoad from 'react-lazyload';
import * as Util from '../../../common/Apis/Fetch';

export default class HatThree extends Component {
  render() {

    // {hatData.status===2?<img className="soldOutImg" />:null}
    let hatData = this.props.hatData;

    let goodName = hatData.goodsName ? hatData.goodsName : '';
    return (
      <div className="hatThreeContainer1" onClick={() => this.goDetails(hatData.goodsId)}>
        <div className="imgContainer">
          <LazyLoad>
            <img className="goodImg" src={hatData.imgHostUrl ? hatData.imgHostUrl + hatData.imgFileUrl :
              hatData.hostUrl + hatData.fileUrl} />
          </LazyLoad>
          {hatData.status === 2 ? <img className="shouqing" src={require('../../images/goodDetails/o1@1x.png')} /> : null}
        </div>
        <div className="goodName">{goodName}</div>
        <div className="tuangouImgPrice">
          <div className="price"><i>￥</i>{hatData.inGroupBuying == 1 ? hatData.groupPrice : hatData.price}</div>
          {hatData.inGroupBuying === 1 ? <img className="tuangouImg" src={require('../../images/homePage/tuangou.png')} /> : null}
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

    let url = "/goods/addGoodsViewValues"; //浏览商品时存redis
    let data = {
      "goodsId": goodsId
    };
    Util.post(url, data, (res) => {
      // dispatch(showLoading(false));
      // console.log(res)
    }, (err) => {
      FailCallBack(error);
      // dispatch(showLoading(false))
    });

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