/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './shopHome.less';
import { Carousel, Grid, WingBlank } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
// 引入此路径，才不会打包失败
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.min.css';

export default class ShopListTemp extends Component {
  constructor(...args) {
    super(...args);
  }
  componentWillUnmount() {
    if (this.shopType == 2) {
      //确保引用了swiper
      if (this.shopSwiper) {
        // 销毁swiper
        this.shopSwiper.destroy();
      }
    }
  }

  componentDidMount() {
    this.shopSwiper = new Swiper(this.refs.shopHuaDom, {
      slidesPerView: 'auto',
      grabCursor: true,
      slidesOffsetBefore: 15,
    });
  }

  render() {
    let ornameObj = this.props.shopListOrname.orInfo;
    let type = ornameObj.shoplistType;
    this.shopType = ornameObj.shoplistType;
    let shopList = this.props.shopListOrname.shopList;
    //  let shopScript = Util.dealSelectType(ornameObj.goodScript,2);
    let infoArr = Util.dealSelectType(ornameObj.shopInfo, 3);
    let shopLen = shopList.length;
    let showMore = false;
    if (shopLen > ornameObj.viewMoreNum) {
      shopList.length = ornameObj.viewMoreNum;
      showMore = true;
    }
    let distance = 0;
    if (ornameObj.distance) {
      distance = parseInt(ornameObj.distance) / 75 + 'rem';
    }
    // console.log(shopList);
    //0:橱窗列表 1：店铺列表 2：滑动列表
    // console.log("店铺列表list----....",this.props.shopListOrname);
    switch (type) {
      case 0: //橱窗列表
        return (
          <div className="listMoudle3" style={{ marginTop: distance }}>
            {shopList.map((val, index) => {
              return (
                <div
                  className="listItem"
                  key={index}
                  style={{
                    backgroundColor: ornameObj.backgroundColor
                      ? ornameObj.backgroundColor
                      : '#fff',
                  }}
                >
                  <div className="shopTitleModule">
                    <img src={val.hostUrl + val.zoomUrl} />
                    <div className="shopInfo">
                      <p
                        style={{
                          color: ornameObj.fontColor
                            ? ornameObj.fontColor
                            : '#000',
                        }}
                        className="overTxtOne"
                      >
                        {val.shopName}
                      </p>
                      <div className="shopTip">
                        {infoArr[0] == 0 ? null : (
                          <span>
                            销量
                            {val.salesVolume ? val.salesVolume : 0}件
                          </span>
                        )}
                        {infoArr[1] == 0 ? null : (
                          <span>
                            共{val.upgoodsNum}
                            件宝贝
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="icon" style={{ display: 'none' }}>
                      <img
                        src={require('../../images/shippingAddress/n6@1.5x.png')}
                      />
                    </div>
                    {infoArr[2] == 0 ? null : (
                      <div
                        className="inShop"
                        onClick={this.toShopDetail.bind(
                          this,
                          val.shopId,
                          val.showType,
                        )}
                      >
                        <span>进店</span>
                      </div>
                    )}
                  </div>
                  {val.goodsList.length > 0 ? (
                    <div className="shopImgModule">
                      {val.goodsList.map((goods, goodsIndex) => {
                        if (goodsIndex < 3 && goods)
                          return (
                            <div className="goodsImg" key={goodsIndex}>
                              <img
                                src={goods.goodsHostUrl + goods.goodsFileUrl}
                                onClick={this.toDetail.bind(
                                  this,
                                  val.shopId,
                                  goods.goodsId,
                                )}
                              />
                              <span>￥{goods && goods.isGruopBuy == 1 ? goods.groupPrice : goods.goodsPrice}</span>
                            </div>
                          );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
            {showMore ? (
              <div
                className="viewMore"
                onClick={() => this.toCheckMore(ornameObj, infoArr)}
              >
                查看更多
              </div>
            ) : null}
            {/* <div className="viewMore" onClick={()=>this.toCheckMore(ornameObj,infoArr)}>查看更多</div> */}
          </div>
        );
        break;
      case 1: //店铺列表
        return (
          <div className="listMoudle3" style={{ marginTop: distance }}>
            {shopList.map((val, index) => {
              return (
                <div
                  className="listItem"
                  key={index}
                  style={{
                    backgroundColor: ornameObj.backgroundColor
                      ? ornameObj.backgroundColor
                      : '#fff',
                  }}
                >
                  <div className="shopTitleModule">
                    <img src={val.hostUrl + val.zoomUrl} />
                    <div className="shopInfo">
                      <p
                        className="overTxtOne"
                        style={{
                          color: ornameObj.fontColor
                            ? ornameObj.fontColor
                            : '#000',
                        }}
                      >
                        {val.shopName}
                      </p>
                      <div className="shopTip">
                        {infoArr[0] == 0 ? null : (
                          <span>
                            销量
                            {val.salesVolume ? val.salesVolume : 0}件
                          </span>
                        )}
                        {infoArr[1] == 0 ? null : (
                          <span>
                            共{val.upgoodsNum}
                            件宝贝
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="icon" style={{ display: 'none' }}>
                      <img
                        src={require('../../images/shippingAddress/n6@1.5x.png')}
                      />
                    </div>
                    {infoArr[2] == 0 ? null : (
                      <div
                        className="inShop"
                        onClick={this.toShopDetail.bind(
                          this,
                          val.shopId,
                          val.showType,
                        )}
                      >
                        <span>进店</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {showMore ? (
              <div
                className="viewMore"
                onClick={() => this.toCheckMore(ornameObj, infoArr)}
              >
                查看更多
              </div>
            ) : null}
          </div>
        );
        break;
      case 2: //2：滑动列表
        return (
          <div className="shopHuaModule" style={{ marginTop: distance }}>
            <div className="swiper-container" ref="shopHuaDom">
              <div className="swiper-wrapper">
                {shopList.map((item, index) => {
                  return (
                    <div key={index} className="swiper-slide">
                      <div
                        className="slideItem"
                        style={{
                          backgroundColor: ornameObj.backgroundColor
                            ? ornameObj.backgroundColor
                            : '#fff',
                        }}
                        onClick={this.toShopDetail.bind(
                          this,
                          item.shopId,
                          item.showType,
                        )}
                      >
                        <div className="slideImg">
                          <img
                            src={item.hostUrl + item.zoomUrl}
                            className="goodsImg"
                          />
                        </div>
                        <p
                          className="overTxtOne"
                          style={{
                            color: ornameObj.fontColor
                              ? ornameObj.fontColor
                              : '#000',
                          }}
                        >
                          {item.shopName}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {showMore ? (
                  <div
                    className="moreContainer"
                    onClick={() => this.toCheckMore(ornameObj, infoArr)}
                  >
                    <div className="lookmore">查看更多</div>
                    <div className="underline" />
                    <img src={require('../../images/homePage/more.png')} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        );
        break;
      case 3: //滑动列表
        return (
          <div className="listMoudle3">
            {shopList.map((val, index) => {
              return (
                <div className="listItem" key={index}>
                  <div className="shopTitleModule">
                    <img src={require('../../images/homePage/tuangou.png')} />
                    <div className="shopInfo">
                      <p>{val.title}</p>
                      <div className="shopTip">
                        <span>
                          销量
                          {val.num}件
                        </span>
                        <span>
                          共{val.count}
                          件宝贝
                        </span>
                      </div>
                    </div>
                    <div className="icon" style={{ display: 'none' }}>
                      <img
                        src={require('../../images/shippingAddress/n6@1.5x.png')}
                      />
                    </div>
                    <div
                      className="inShop"
                      onClick={this.toShopDetail.bind(
                        this,
                        val.shopId,
                        val.showType,
                      )}
                    >
                      <span>进店</span>
                    </div>
                  </div>
                  <article className="shopTxtModule">
                    {val.txt}
                    <span
                      className="checkMore"
                      onClick={() => this.toCheckMore(ornameObj, infoArr)}
                    >
                      查看更多
                    </span>
                  </article>
                  <div className="shopImgModule">
                    <img src={require('../../images/homePage/tuangou.png')} />
                    <img src={require('../../images/homePage/tuangou.png')} />
                    <img src={require('../../images/homePage/tuangou.png')} />
                  </div>
                </div>
              );
            })}
          </div>
        );
        break;
      default:
        return <div />;
    }
  }
  goPopupBody() {
    if (contants.shopPreView != 1) {
      document.getElementById('GroupingPopup').className = 'GroupingPopup show';
    }
  }

  //获取left值
  getLeftVale(index, len) {
    if (len <= 3) return;
    if (index == len - 1) return -(280 + 235) + 'px';
    let leftValue = index * 280 - 235 + 'px';
    return leftValue;
  }

  //商品详情
  toDetail(shopId, productId) {
    let goodDetailUrl =
      contants.multishopUrl +
      `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId, goodDetailUrl, false);
    //window.location = contants.flagshipUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
  }

  //店铺详情
  toShopDetail(shopId, shopType) {
    let shopDetailUrl = '';
    if (shopType == 1) {
      shopDetailUrl = contants.multishopUrl + `/retailPage/?shopId=${shopId}`;
    } else {
      shopDetailUrl = contants.multishopUrl + `/shopDetail/?shopId=${shopId}`;
    }
    Util.goToPageForApp(shopDetailUrl, false);
  }

  //查看更多
  toCheckMore(ornameObj, infoArr) {
    let linkId = ornameObj.shoplistId;
    let sortRule = ornameObj.sortRule;
    let color = ornameObj.fontColor;
    // console.log("11111----",infoArr);
    //测试---
    // window.location = contants.commonUrl+'/listGoods?linkId='+linkId+"&sortRule="+sortRule+"&type=2"+"&infoArr="+infoArr+"&fontColor="+color;
    let url =
      contants.multishopUrl +
      '/listGoodsShop?linkId=' +
      linkId +
      '&sortRule=' +
      sortRule +
      '&type=2' +
      '&infoArr=' +
      infoArr;
    Util.goToPageForApp(url, false);
    // window.location = url;
  }
}
