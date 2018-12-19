/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './shopHome.less';
import { Grid } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
import * as Api from '../../../common/Apis/Fetch';

export default class ClassifyTemp extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      activeIndex: 0,
      goodsList: [],
      shopList: [],
      isShowGoods: false,
      isShowShop: false,
    }
  }

  render() {
    //说明：ornameObj.goodScript  0 无 10 新品 11 新品 + ornameObj.scriptName
    //ornameObj.goodAbbr:商品简介(描述、浏览量、库存、销量)
    //ornameObj.goodBase：(商品名称、商品价格、划线价)
    // console.log("------分类列表----",this.props.classifyOrname);
    let ornameObj = this.props.classifyOrname.orInfo;
    let type = ornameObj.goodStyle;
    let classifyType = ornameObj.classifyType;//0：商品分类 1：店铺分类
    let classifyStyle = ornameObj.classifyStyle; //0 横向分类 1：左侧分类
    let classList = this.props.classifyOrname.classList;
    let goodScript = Util.dealSelectType(ornameObj.goodScript, 2);
    let goodAbbr = Util.dealSelectType(ornameObj.goodInfo, 4);
    let goodBase = Util.dealSelectType(ornameObj.goodBase, 3);

    let goodsList = [];
    let shopList = [];
    if (this.state.isShowGoods) {
      goodsList = this.state.goodsList;
    } else {
      goodsList = this.props.classifyOrname.goodsList;
    }
    if (this.state.isShowShop) {
      shopList = this.state.shopList;
    } else {
      shopList = this.props.classifyOrname.shopList;
    }
    let leftStyle1 = {
      color: '#D00510',
      borderLeft: '0.08rem solid #D00510',
      backgroundColor: '#fff'
    }
    let leftStyle2 = {
      color: ornameObj.fontColor,
      borderLeft: 'none',
      backgroundColor: '#F8F8F8'
    }
    let distance = 0;
    if (ornameObj.distance) {
      distance = parseInt(ornameObj.distance) / 75 + "rem";
    }
    switch (classifyStyle) {
      case 0:
        return (
          <div className="classifyContainer" style={{ backgroundColor: ornameObj.backgroundColor, marginTop: distance }}>
            {/* {classList.length >=1 ?
                        <div className="topNavModule">
                            <div className="navBody">
                                {classList.map((classItem,index)=>{ 
                                    return <div className="topNavbar" key={index} onClick={this.changeTab.bind(this,index,classItem.classifyTitleId,classifyType)} style={{color:this.state.activeIndex === index ? '#D00510' :ornameObj.fontColor}}><span style={{borderBottom:this.state.activeIndex === index ? "4px solid #D00510" :"none"}}>{classItem.classifyTitleName}</span></div>
                                    })   
                                    }
                             </div>
                        </div> : null
                        } */}
            <div className="topNavList" >
              <div className="topNavLeft">
                <div className="topNavTitleBody">
                  {
                    classList.map((classItem, index) => {
                      return (
                        <div className="topNavTitle" key={index}>
                          <div className="TitleDiv" onClick={this.changeTab.bind(this, index, classItem.classifyTitleId, classifyType)} style={{ color: this.state.activeIndex === index ? '#D00510' : ornameObj.fontColor }}>
                            <span style={{ borderBottom: this.state.activeIndex === index ? "2px solid #D00510" : "none" }}>{classItem.classifyTitleName}</span>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            {classifyType === 0 ? this.getClassConent(classifyType, classifyStyle, type, goodsList, ornameObj, goodScript, goodAbbr, goodBase) : this.getClassConent(classifyType, classifyStyle, type, shopList, ornameObj, goodScript, goodAbbr, goodBase)}
          </div>
        )
        break;
      case 1:
        return (
          <div className="classifyContainer2" style={{ backgroundColor: ornameObj.backgroundColor, marginTop: distance }}>
            {classList.length >= 1 ?
              <ul className="leftNavModule">
                {classList.map((classItem, index) => {
                  return <li className="leftNavbar overTxtOne" key={index} onClick={this.changeTab.bind(this, index, classItem.classifyTitleId, classifyType)} style={this.state.activeIndex === index ? leftStyle1 : leftStyle2}>{classItem.classifyTitleName}</li>
                })
                }
              </ul> : null
            }
            {classifyType === 0 ? this.getClassConent(classifyType, classifyStyle, type, goodsList, ornameObj, goodScript, goodAbbr, goodBase) : this.getClassConent(classifyType, classifyStyle, type, shopList, ornameObj, goodScript, goodAbbr, goodBase)}
          </div>
        )
        break;
      default:
        return (<div></div>)
    }

  };
  goPopupBody() {
    if (contants.shopPreView != 1) {
      document.getElementById("GroupingPopup").className = "GroupingPopup show";
    }
  };

  //正文
  getClassConent(classifyType, classifyStyle, type, reslist, ornameObj, goodScript, goodAbbr, goodBase) {
    if (classifyType == 0) {
      switch (type) {
        case 0: //大图
          return (
            <div className={classifyStyle == 0 ? "listMoudle4" : "classGoodsList1"}>
              {reslist.length > 0 ? reslist.map((item, index) => {
                return <div className="listItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)} >
                  <div className="shopImgModule">
                    <img src={item.goodsOriginalImg} />
                    {/* {item.activityType==0? null:<img className = "tgImg" src={require("../../images/comment/tgbIcon.png")} />} */}
                    <p className="newIcon">
                      {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                      {goodScript[0] == 0 ? null : <span>新品</span>}
                    </p>
                  </div>
                  <div className="shopTxtMoudle">
                    {goodBase[0] == 0 ? null : <p className="shopTitle overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</p>}
                    {goodAbbr[0] == 0 ? null : <p className="shopTxt">{item.describes}</p>}
                    {/* <div className="stock"><p>库存:{val.stock}</p><p className="profitModule"><span className="profitTxt">利润</span><span className="profitPrice">最高 ￥ {val.profit}</span></p></div> */}
                    {(goodAbbr[2] == 1 || goodAbbr[3] == 1) ? <div className="saleStock">
                      {goodAbbr[3] == 0 ? null : <p><span>销量：</span><span className="ssNum">{item.salesVolume}</span></p>}
                      {goodAbbr[2] == 0 ? null : <p><span>库存：</span><span className="ssNum">{item.stock}</span></p>}
                      {goodAbbr[1] == 0 ? null : <p><span>浏览量： </span><span className="ssNum">{item.pageView}</span></p>}
                    </div> : null}
                    <div className="shopPrice">
                      {goodBase[1] == 0 ? null : <p className="priceModule"><icon>￥</icon><span>{item.activityType ? item.groupPrice : item.price}</span></p>}
                      <p className="saleCheck">
                        {goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice ? item.linePrice : '0.0'}</span>}
                        {goodAbbr[1] == 0 ? null : <span className="checkNum">浏览量： {item.pageView}</span>}
                      </p>
                    </div>
                    {item.consumerRebate ?
                      <div className="cash_Back">
                        <span><i>返现</i>最高￥{item.consumerRebate}</span>
                      </div>
                      : null}
                  </div>
                </div>
              }) : null
              }
            </div>
          )
          break;
        case 1: //一行两个
          return (
            <div className={classifyStyle == 0 ? "listMoudle5" : "classGoodsList2"}>
              <Grid className="gridList" data={reslist} activeStyle={false}
                columnNum={2}
                renderItem={item => (
                  <div className="gridItem" onClick={this.toDetail.bind(this, item.shopId, item.goodsId)} >
                    <p className="newGoods">
                      {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                      {goodScript[0] == 0 ? null : <span className="iconTwo">新品</span>}
                    </p>
                    <div className="imgModule">
                      <img src={item.goodsOriginalImg} className="goodsImg" />
                      {item.activityType == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                    </div>
                    <div className="txtModule">
                      {goodBase[0] == 0 ? null : <p className="goodsTitle overTxtOne">{item.goodsName}</p>}
                      {goodAbbr[0] == 0 ? null : <p className="goodsTxt overTxtOne">{item.describes}</p>}
                      <p className="goodsPrice">
                        {goodBase[1] == 0 ? null : <i><icon>￥</icon><span className="newPrice">{item.activityType ? item.groupPrice : item.price}</span> </i>}
                        {goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice}</span>}
                      </p>
                      {item.consumerRebate ?
                        <div className="cash_Back">
                          <span><i>返现</i>最高￥{item.consumerRebate}</span>
                        </div>
                        : null}
                    </div>
                  </div>
                )}
              />
            </div>
          )
          break;
        case 2: //详细列表
          return (
            <div className={classifyStyle == 0 ? "listMoudle1" : "classGoodsList3"} style={{ marginTop: "0" }}>
              {reslist.length > 0 ? reslist.map((item, index) => {
                return <div className="recomItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)} >
                  <div className="imgMoudle">
                    <img className="goodImg" src={item.goodsOriginalImg} />
                    {item.activityType == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                  </div>
                  <div className="TextModule">
                    {goodBase[2] == 0 ? null : <div className="goodsName overTxtOne">{item.goodsName}</div>}
                    <div className="goodsPrice">
                      {goodBase[1] == 0 ? null : <i><icon>￥</icon><span className="price">{item.activityType ? item.groupPrice : item.price}</span></i>}
                      {goodBase[2] == 0 ? null : <span className="linePrice">￥{item.linePrice}</span>}
                    </div>
                    {goodAbbr[2] == 0 ? null : <div className="stock"><p>库存:{item.stock}</p></div>}
                    {/* <div className="stock"><p>库存:{item.stock}</p><p className="profitModule"><span className="profitTxt">利润</span><span className="profitPrice">最高 ￥ {item.profit}</span></p></div> */}
                    <div className="sales">
                      {goodAbbr[3] == 0 ? null : <span>销量：{item.salesVolume ? item.salesVolume : 0}</span>}
                      {goodAbbr[1] == 0 ? null : <span className="distri">浏览量：{item.pageView ? item.pageView : 0}</span>}
                    </div>
                    {item.consumerRebate ?
                      <div className="cash_Back">
                        <span><i>返现</i>最高￥{item.consumerRebate}</span>
                      </div>
                      : null}
                  </div>
                </div>
              }) : null
              }
            </div>
          )
          break;
        default:
          return (<div></div>)
      }
    } else {
      switch (type) {
        case 0: //橱窗显示
          return (
            <div className={classifyStyle == 0 ? "classifyShopList2" : "classifyShopList1"}>
              {reslist.length > 0 ? reslist.map((val, index) => {
                return <div className="listItem" key={index} style={{ backgroundColor: ornameObj.backgroundColor ? ornameObj.backgroundColor : '#fff' }}>
                  <div className="shopTitleModule">
                    <img src={val.hostUrl + val.zoomUrl} />
                    <div className="shopInfo">
                      <p style={{ color: ornameObj.fontColor ? ornameObj.fontColor : '#000' }}>{val.shopName}</p>
                      <div className="shopTip">
                        {goodBase[0] == 0 ? null : <span>销量{val.salesVolume ? val.salesVolume : 0}件</span>}
                        {goodBase[1] == 0 ? null : <span>共{val.upgoodsNum}件宝贝</span>}
                      </div>
                    </div>
                    <div className="icon" style={{ display: "none" }}><img src={require('../../images/shippingAddress/n6@1.5x.png')} /></div>
                    {goodBase[2] == 0 ? null : <div className="inShop" onClick={this.toShopDetail.bind(this, val.shopId, val.showType)}><span>进店</span></div>}
                  </div>
                  {val.goodsList.length > 0 ?
                    <div className="shopImgModule">
                      {
                        val.goodsList.map((goodItem, index) => {
                          if (classifyStyle == 0 && index < 3) {
                            return <div className="goodsImg" key={index}>
                              <img src={goodItem.goodsHostUrl + goodItem.goodsFileUrl} onClick={this.toDetail.bind(this, val.shopId, goodItem.goodsId)} />
                              <span>￥{goodItem.goodsPrice}</span>
                            </div>
                          } else if (classifyStyle == 1 && index < 2) {
                            return <div className="goodsImg" key={index}>
                              <img src={goodItem.goodsHostUrl + goodItem.goodsFileUrl} onClick={this.toDetail.bind(this, val.shopId, goodItem.goodsId)} />
                              <span>￥{goodItem.goodsPrice}</span>
                            </div>
                          }
                        })
                      }
                    </div> : null}
                </div>
              }) : null
              }
            </div>
          )
          break;
        case 1: //店铺列表
          return (
            <div className={classifyStyle == 0 ? "classifyShopList2" : "classifyShopList1"}>
              {reslist.length > 0 ? reslist.map((val, index) => {
                return <div className="listItem" key={index} style={{ backgroundColor: ornameObj.backgroundColor ? ornameObj.backgroundColor : '#fff' }}>
                  <div className="shopTitleModule">
                    <img src={val.hostUrl + val.zoomUrl} />
                    <div className="shopInfo">
                      <p className="overTxtOne" style={{ color: ornameObj.fontColor ? ornameObj.fontColor : '#000' }}>{val.shopName}</p>
                      <div className="shopTip">
                        {goodBase[0] == 0 ? null : <span>销量{val.salesVolume ? val.salesVolume : 0}件</span>}
                        {goodBase[1] == 0 ? null : <span>共{val.upgoodsNum}件宝贝</span>}
                      </div>
                    </div>
                    <div className="icon" style={{ display: "none" }}><img src={require('../../images/shippingAddress/n6@1.5x.png')} /></div>
                    {goodBase[2] == 0 ? null : <div className="inShop" onClick={this.toShopDetail.bind(this, val.shopId, val.showType)}><span>进店</span></div>}
                  </div>
                </div>
              }) : null
              }
            </div>
          )
          break;
        default:
          return (<div></div>)
      }
    }
  }

  //tab的切换操作
  changeTab(index, classifyTitleId, classifyType) {
    // Tool.getGoodsList();
    var acIndex = this.state.activeIndex;
    if (acIndex == index) return;
    let ornameObj = this.props.classifyOrname.orInfo;
    if (classifyType === 0) {
      this.getClassifyGoodsList(ornameObj, ornameObj.classifyId, 2, classifyTitleId, ornameObj.sortRule);
    } else {
      this.getClassifyShopList(ornameObj, ornameObj.classifyId, 2, classifyTitleId, ornameObj.sortRule);
    }

    if (acIndex !== index) {
      this.setState({
        activeIndex: index
      });
    }
  }


  //分类----获取商品列表
  getClassifyGoodsList(ornameObj, linkId, linkType, classId, sortRule) {
    let url = "/cloudGoods/getHomePageGoodsList?linkId=" + linkId + "&linkType=" + linkType + "&classifyTitleId=" + classId + "&sortRule=" + sortRule;
    Api.get(url, (response) => {
      if (response.status === 0) {
        ornameObj.goodsList = [];
        this.setState({
          goodsList: response.body.goodsListInfo,
          isShowGoods: true
        })
        ornameObj.goodsList = response.body.goodsListInfo;
      }
    }, (error) => {
      console.log("获取商品列表失败", error);
    });
  }

  //分类--- 获取店铺列表
  getClassifyShopList(ornameObj, linkId, linkType, classifyId, sortRule) {
    let url = "/cloudShop/getHomePageShopList?linkId=" + linkId + "&linkType=" + linkType + "&classifyTitleId=" + classifyId + "&sortRule=" + sortRule;
    Api.get(url, (response) => {
      if (response.status === 0) {
        ornameObj.shopList = [];
        this.setState({
          shopList: response.body.shopListInfo,
          isShowShop: true
        })
        ornameObj.shopList = response.body.shopList;
      }
    }, (error) => {
      console.log("获取店铺列表失败", error);
    });
  }
  //商品详情
  toDetail(shopId, productId) {
    let goodDetailUrl = contants.multishopUrl + `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId, goodDetailUrl, false);
  }

  //店铺详情
  toShopDetail(shopId, shopType) {
    let shopDetailUrl = "";
    if (shopType == 1) {
      shopDetailUrl = contants.multishopUrl + `/retailPage/?shopId=${shopId}`;
    } else {
      shopDetailUrl = contants.multishopUrl + `/shopDetail/?shopId=${shopId}`;
    }
    Util.goToPageForApp(shopDetailUrl, false);
  }

}


