/**
 * Created by Song on 2018/07/24
 * 系统推荐商品component
 */

import React, { Component } from "react";
import "./index.less";
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';//全局配置信息

export default class Suggestion extends Component {
  constructor(props) {
    super(props);
  }

  //跳转到商品详情页面
  toDetail(shopId, productId){
    let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    db.goodsViewNum(productId,goodDetailUrl,true);
  }

  render() {
    let { list } = this.props;
    list = list.length % 2 === 0 ? list : list.slice(0,list.length - 1)
    return (
      <div className="name-space-suggestion clear">
      {
         list.map(item => (
            <div className="productItem" key={item.goodsId} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
            <div className="img-wrap">
              <img src={item.hostUrl + item.fileUrl} />
            </div>
            <div className="desc">
              <h2>{db.cutOutStr(item.goodsName,12)}</h2>
              <div className="likeGoodsprice clear">
                { item.isGruopBuy ? <span>团</span> : null }
                <i><b>￥</b>{item.isGruopBuy ? item.linePrice:item.price}</i>
                { item.isGruopBuy ? <a>￥{item.linePrice}</a> : null }
              </div>
            </div>
          </div>
        ))
      }
      </div>
    )
  }
}
