/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './shopHome.less';
import { Grid } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
// 引入此路径，才不会打包失败
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

export default class GoodsListTemp extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
    }
  }
  componentWillUnmount() {
    //  console.log("-----",this.goodSwiper);
    if (this.goodsType == 4) {
      if (this.goodSwiper) { // 销毁swiper
        this.goodSwiper.destroy()
      }
    }
  }

  componentDidMount() {
    this.goodSwiper = new Swiper(this.refs.huaDom, {
      slidesPerView: 'auto',
      grabCursor: true,
      slidesOffsetBefore: 15,
    });
  }
  render() {
    //说明：ornameObj.goodScript  0 无 10 新品 11 新品 + ornameObj.scriptName
    //ornameObj.goodAbbr:商品简介(描述、浏览量、库存、销量)
    //ornameObj.goodBase：(商品名称、商品价格、划线价)
    let ornameObj = this.props.goodsListOrname.orInfo;
    //测试----
    //ornameObj.goodslistStyle = 4;
    let type = ornameObj.goodslistStyle;
    this.goodsType = ornameObj.goodslistStyle;
    let goodsList = this.props.goodsListOrname.goodsList;
    let goodScript = Util.dealSelectType(ornameObj.goodScript, 2);
    let goodAbbr = Util.dealSelectType(ornameObj.goodAbbr, 4);
    let goodBase = Util.dealSelectType(ornameObj.goodBase, 3);
    let goodsLen = goodsList.length;
    let showGoodsMore = false;
    if (goodsLen > ornameObj.viewMoreNum) {
      showGoodsMore = true;
      goodsList.length = ornameObj.viewMoreNum;
    }
    if (goodsList.length == 0) return null;
    switch (type) {
      case 0: //大图
        return (
          <div className="listMoudle4" style={{ marginTop: ornameObj.distance, background: ornameObj.backgroundColor }}>
            {goodsList.map((item, index) => {
              return <div className="listItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                <div className="shopImgModule">
                  <img src={item.goodsOriginalImg} />
                  {/* {item.activityType==0? null:<img className = "tgImg" src={require("../../images/comment/tgbIcon.png")} />} */}
                  <p className="newIcon">
                    {item.activityType == 0 ? null : <span className="iconOne">团</span>}
                    {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                    {goodScript[0] == 0 ? null : <span>新品</span>}
                  </p>
                </div>
                <div className="shopTxtMoudle">
                  {goodBase[0] == 0 ? null : <p className="shopTitle overTxtOne">{item.goodsName}</p>}
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
            })
            }
            {showGoodsMore ? <div className="viewMore" onClick={() => this.toCheckMore(ornameObj, goodScript, goodAbbr, goodBase)}>查看更多</div> : null}

            {/* <div className="viewMore" onClick={()=>this.toCheckMore(ornameObj,goodScript,goodAbbr,goodBase)}>查看更多</div> */}
          </div>
        )
        break;
      case 1: //一行两个
        return (
          <div className="listMoudle5" style={{ marginTop: ornameObj.distance, background: ornameObj.backgroundColor }}>
            <Grid className="gridList" data={goodsList} activeStyle={false}
              columnNum={2}
              renderItem={item => (
                <div className="gridItem" onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
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
                      {goodBase[1] == 0 ? null : <i><icon>￥</icon><span className="newPrice">{item.activityType ? item.groupPrice : item.price}</span></i>}
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
            {showGoodsMore ? <div className="viewMore" onClick={() => this.toCheckMore(ornameObj, goodScript, goodAbbr, goodBase)}>查看更多</div> : null}
          </div>
        )
        break;
      case 2: //一大两小
        return (
          <div className="listMoudle6" style={{ marginTop: ornameObj.distance, background: ornameObj.backgroundColor }}>
            {
              goodsList.map((item, index) => {
                return (
                  (index == 0 || index % 3 == 0) ?
                    <div className="oneItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                      <div className="imgModule">
                        <img src={item.goodsOriginalImg} className="goodsImg" />
                        {/* {item.activityType==0? null:<img className = "tgImg" src={require("../../images/comment/tgbIcon.png")} />} */}
                        <p className="newIcon">
                          {item.activityType == 0 ? null : <span className="iconOne">团</span>}
                          {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                          {goodScript[0] == 0 ? null : <span>新品</span>}
                        </p>
                      </div>
                      <div className="txtModule">
                        <p className="goodsName overTxtOne">{item.goodsName}</p>
                        <p className="price"><icon className="priceIcon">￥</icon><span className="newPrice">{item.activityType ? item.groupPrice : item.price}</span>{goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice} </span>}</p>
                        {item.consumerRebate ?
                          <div className="cash_Back">
                            <span><i>返现</i>最高￥{item.consumerRebate}</span>
                          </div>
                          : null}
                      </div>
                    </div> :
                    // <div className="twoContainer">
                    <div className="twoItem clear" style={{ marginLeft: index % 3 == 1 ? "0.4rem" : 0 }} key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                      <div className="tModule">
                        <div className="imgModule">
                          <img src={item.goodsOriginalImg} className="goodsImg" />
                          {item.activityType == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                          <p className="newIcon">
                            {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                            {goodScript[0] == 0 ? null : <span>新品</span>}
                          </p>
                        </div>
                        <div className="txtModule" style={{ marginLeft: "10px", paddingTop: '0px' }}>
                          <p className="goodsName overTxtOne">{item.goodsName}</p>
                          <p className="price"><icon className="priceIcon">￥</icon><span className="newPrice">{item.activityType ? item.groupPrice : item.price}</span>{goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice}</span>}</p>
                          {item.consumerRebate ?
                            <div className="cash_Back">
                              <span><i>返现</i>最高￥{item.consumerRebate}</span>
                            </div>
                            : null}
                        </div>
                      </div>
                    </div>
                  // </div>
                )
              })
            }
            {showGoodsMore ? <div className="viewMore" onClick={() => this.toCheckMore(ornameObj, goodScript, goodAbbr, goodBase)}>查看更多</div> : null}
          </div>
        )
        break;
      case 3: //详细列表
        return (
          <div className="listMoudle1" style={{ marginTop: ornameObj.distance, background: ornameObj.backgroundColor }}>
            {goodsList.map((item, index) => {
              return <div className="recomItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                <div className="imgMoudle">
                  <img className="goodImg" src={item.goodsOriginalImg} />
                  {item.activityType == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                  <p className="newIconSmall">
                    {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                    {goodScript[0] == 0 ? null : <span>新品</span>}
                  </p>
                </div>
                <div className="TextModule">
                  <div className="goodsName overTxtOne">{item.goodsName}</div>
                  <div className="goodsPrice">
                    {/* {goodBase[1] ==0 ? null : <div><icon>￥</icon><span className="newPrice">{item.activityType ? item.groupPrice : item.price}</span></div>} */}
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
            })
            }
            {showGoodsMore ? <div className="viewMore" onClick={() => this.toCheckMore(ornameObj, goodScript, goodAbbr, goodBase)} >查看更多</div> : null}
          </div>
        )
        break;
      case 4: // 横向滑动
        return (
          <div className="goodsListHua" style={{ marginTop: ornameObj.distance, background: ornameObj.backgroundColor }}>
            {/* {goodsList.length < 3 ? //没有活动
                            <div className="listFlex">
                                {goodsList.map((item,index)=>{   // this.state.bag是在state里面定义的数组为了循环数据
                                        return(                                    
                                            // <div key={index} className="swiper-slide">
                                                <div className="slideItem" key={index}>
                                                    <div className="slideImg">
                                                         <img src={item.zoomUrl} />
                                                    </div>
                                                    <div className ="slideTxt">
                                                        <p className="goodsTitle overTxtOne">{item.goodsName}</p>
                                                        <p className="goodsPrice"><icon>￥</icon><span>{item.price}</span></p>
                                                    </div>
                                                </div>
                                            // </div>
                                        )
                                    })
                                }
                            </div>:  */}
            <div className='swiper-container' ref="huaDom">
              <div className="swiper-wrapper">
                {
                  goodsList.map((item, index) => {   // this.state.bag是在state里面定义的数组为了循环数据
                    return (
                      <div key={index} className="swiper-slide">
                        {/* <img src={item.zoomUrl} style={{width:item.pictureWidth}}></img> */}
                        <div className="slideItem" onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                          <div className="slideImg">
                            <img src={item.goodsOriginalImg} className="goodsImg" />
                            {item.activityType == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                            <p className="newIconSmall">
                              {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                              {goodScript[0] == 0 ? null : <span>新品</span>}
                            </p>
                          </div>
                          <div className="slideTxt">
                            <p className="goodsTitle overTxtOne">{item.goodsName}</p>
                            <p className="goodsPrice">
                              {goodBase[1] == 0 ? null : <i><icon>￥</icon>
                                <span className="tprice">{item.activityType ? item.groupPrice : item.price}</span></i>}
                              {goodBase[2] == 0 ? null : <span className="lineprice"><icon>￥</icon>{item.linePrice}</span>}
                            </p>
                          </div>
                          {item.consumerRebate ?
                            <div className="cash_Back">
                              <span><i>返现</i>最高￥{item.consumerRebate}</span>
                            </div>
                            : null}
                        </div>
                      </div>
                    )
                  })
                }
                {showGoodsMore ? <div className="moreContainer swiper-slide" onClick={() => this.toCheckMore(ornameObj, goodScript, goodAbbr, goodBase)}>
                  <div className="lookmore">查看更多</div>
                  <div className="underline" />
                  <img src={require('../../images/homePage/more.png')} />
                </div> : null}
              </div>
            </div>
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

  toDetail(shopId, productId) {
    let goodDetailUrl = contants.multishopUrl + `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId, goodDetailUrl, false);

    //测试测试----
    // window.location.href = "http://172.22.200.109:8080/multiShop"+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
  }

  //查看更多
  toCheckMore(ornameObj, goodScript, goodAbbr, goodBase) {
    // const {history}=this.props;
    let linkId = ornameObj.goodslistId;
    let sortRule = ornameObj.sortRule;
    // console.log(contants.commonUrl+'/listGoods?linkId='+linkId+"&sortRule="+sortRule+"&type=1");
    // window.location = contants.commonUrl+'/listGoods?linkId='+linkId+"&sortRule="+sortRule+"&type=1"+"&goodScript="+goodScript+"&goodAbbr="+goodAbbr+"&goodBase="+goodBase+"&ornameObj="+ornameObj;
    let url = contants.multishopUrl + '/listGoodsShop?linkId=' + linkId + "&sortRule=" + sortRule + "&type=1" + "&goodScript=" + goodScript + "&goodAbbr=" + goodAbbr + "&goodBase=" + goodBase + "&ornameObj=" + ornameObj;
    Util.goToPageForApp(url, false);
  };


}