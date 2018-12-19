/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './shopHome.less';
import { Carousel, Grid } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
// 引入此路径，才不会打包失败
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'

export default class GroupTemp extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
    }
  }

  componentWillUnmount() {
    //  console.log("-----",this.goodSwiper);
    if (this.type == 4) {
      if (this.goodSwiper) { // 销毁swiper
        this.goodSwiper.destroy()
      }
    }
  }

  componentDidMount() {
    this.goodSwiper = new Swiper(this.refs.grouphuaDom, {
      slidesPerView: 'auto',
      grabCursor: true,
      slidesOffsetBefore: 15,
    });
  }

  render() {
    //说明：ornameObj.goodScript  0 无 10 新品 11 新品 + ornameObj.scriptName
    //ornameObj.goodAbbr:商品简介(描述、浏览量、库存、销量)
    //ornameObj.goodBase：(商品名称、商品价格、划线价)
    let ornameObj = this.props.groupOrname.orInfo;
    let type = ornameObj.choiceStyle;
    this.type = type;
    let goodsList = this.props.groupOrname.goodsList;
    let goodScript = Util.dealSelectType(ornameObj.goodScript, 2);
    let goodAbbr = Util.dealSelectType(ornameObj.goodAbbr, 4);
    let goodBase = Util.dealSelectType(ornameObj.goodBase, 3);
    switch (type) {
      case 0: //大图
        return (
          <div className="listMoudle4" style={{ marginTop: ornameObj.distance }}>
            {goodsList.map((item, index) => {
              return <div className="listItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                <div className="shopImgModule">
                  <img src={item.goodsOriginalImg} />
                  {/* {item.activityType==0? null:<img className = "tgImg" src={require("../../images/comment/tgbIcon.png")} />} */}
                  <p className="newIcon">
                    {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                    {(goodScript[0] == 1 && item.activityType == 1) ? <span>团</span> : null}
                  </p>
                </div>
                <div className="shopTxtMoudle">
                  {goodBase[0] == 0 ? null : <p className="shopTitle">{Util.cutOutStr(item.goodsName, 12)}</p>}
                  {goodAbbr[0] == 0 ? null : <p className="shopTxt">{item.describes}</p>}
                  {/* <div className="stock"><p>库存:{val.stock}</p><p className="profitModule"><span className="profitTxt">利润</span><span className="profitPrice">最高 ￥ {val.profit}</span></p></div> */}
                  {(goodAbbr[2] == 1 || goodAbbr[3] == 1) ? <div className="saleStock">
                    {goodAbbr[3] == 0 ? null : <p><span>销量：</span><span className="ssNum">{item.salesVolume}</span></p>}
                    {goodAbbr[2] == 0 ? null : <p><span>库存：</span><span className="ssNum">{item.stock}</span></p>}
                    {goodAbbr[1] == 0 ? null : <p><span>浏览量： </span><span className="ssNum">{item.pageView}</span></p>}
                  </div> : null}
                  <div className="shopPrice">
                    {goodBase[1] == 0 ? null : <p className="priceModule"><icon>￥</icon><span>{goodScript[0] ? item.groupPrice : item.price}</span></p>}
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
          </div>
        )
        break;
      case 1: //一行两个
        return (
          <div className="listMoudle5" style={{ marginTop: ornameObj.distance }}>
            <Grid className="gridList" data={goodsList} activeStyle={false}
              columnNum={2}
              renderItem={item => (
                <div className="gridItem" onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                  <p className="newGoods">
                    {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                    {(goodScript[0] == 1 && item.activityType == 1) ? <span className="iconTwo">团</span> : null}
                  </p>
                  <div className="imgModule">
                    <img src={item.goodsOriginalImg} className="goodsImg" />
                    {goodScript[0] == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                  </div>
                  <div className="txtModule">
                    {goodBase[0] == 0 ? null : <p className="goodsTitle overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</p>}
                    {goodAbbr[0] == 0 ? null : <p className="goodsTxt overTxtOne">{item.describes}</p>}
                    <p className="goodsPrice">
                      {goodBase[1] == 0 ? null : <i><icon>￥</icon><span className="newPrice">{goodScript[0] ? item.groupPrice : item.price}</span> </i>}
                      {goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice}</span>}
                    </p>
                  </div>
                  {item.consumerRebate ?
                    <div className="cash_Back">
                      <span><i>返现</i>最高￥{item.consumerRebate}</span>
                    </div>
                    : null}
                </div>
              )}
            />
          </div>
        )
        break;
      case 2: //一大两小
        return (
          <div className="listMoudle6" style={{ marginTop: ornameObj.distance }}>
            {
              goodsList.map((item, index) => {
                return (
                  (index === 0 || index % 3 === 0) ?
                    <div className="oneItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                      <div className="imgModule">
                        <img src={item.goodsOriginalImg} className="goodsImg" />
                        {/* {item.activityType==0? null:<img className = "tgImg" src={require("../../images/comment/tgbIcon.png")} />} */}
                      </div>
                      <div className="txtModule">
                        {goodBase[0] == 0 ? null : <p className="goodsName overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</p>}
                        <p className="price">
                          {goodBase[1] == 0 ? null : <i><icon className="priceIcon">￥</icon><span className="newPrice">{goodScript[0] ? item.groupPrice : item.price}</span></i>}
                          {goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice} </span>}
                        </p>
                      </div>
                    </div> :
                    // <div className="twoContainer">
                    <div className="twoItem clear" style={{ marginLeft: index % 3 == 1 ? "0.4rem" : 0 }} key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                      <div className="tModule">
                        <div className="imgModule">
                          <img src={item.goodsOriginalImg} className="goodsImg" />
                          {goodScript[0] == 0 ? null : <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                          <p className="newIcon">
                            {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                            {/* {goodScript[0] == 0 ? null : <span>拼团</span>} */}
                          </p>
                        </div>
                        <div className="txtModule" style={{ marginLeft: "0.75rem", paddingTop: '0px' }}>
                          {goodBase[0] == 0 ? null : <p className="goodsName overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</p>}
                          <p className="price">
                            {goodBase[1] == 0 ? null : <i><icon className="priceIcon">￥</icon><span className="newPrice">{goodScript[0] ? item.groupPrice : item.price}</span></i>}
                            {goodBase[2] == 0 ? null : <span className="oldPrice">￥{item.linePrice} </span>}
                          </p>
                        </div>
                        {item.consumerRebate ?
                          <div className="cash_Back">
                            <span><i>返现</i>最高￥{item.consumerRebate}</span>
                          </div>
                          : null}
                      </div>
                    </div>
                  // </div>
                )
              })
            }

          </div>
        )
        break;
      case 3: //详细列表
        return (
          <div className="listMoudle1" style={{ marginTop: ornameObj.distance }}>
            {goodsList.map((item, index) => {
              return <div className="recomItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                <div className="imgMoudle">
                  <img className="goodImg" src={item.goodsOriginalImg} />
                  {(goodScript[0] == 1 && item.activityType == 1) ? <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} /> : null}
                </div>
                <div className="TextModule">
                  {goodBase[0] == 0 ? null : <div className="goodsName overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</div>}
                  <div className="goodsPrice">
                    {goodBase[1] == 0 ? null : <i><icon>￥</icon><span className="price">{goodScript[0] ? item.groupPrice : item.price}</span></i>}
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
          </div>
        )
        break;
      case 4: // 横向滑动
        return (
          <div className="goodsListHua" style={{ marginTop: ornameObj.distance }}>
            <div className='swiper-container' ref="grouphuaDom">
              <div className="swiper-wrapper">
                {
                  goodsList.map((item, index) => {   // this.state.bag是在state里面定义的数组为了循环数据
                    return (
                      <div key={index} className="swiper-slide">
                        {/* <img src={item.zoomUrl} style={{width:item.pictureWidth}}></img> */}
                        <div className="slideItem" onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                          <div className="slideImg">
                            <img src={item.goodsOriginalImg} className="goodsImg" />
                            {(goodScript[0] == 1 && item.activityType == 1) ? <img className="tgImg" src={require("../../images/comment/tgsIcon.png")} /> : null}
                            <p className="newIconSmall">
                              {goodScript[1] == 0 ? null : <span className="iconOne">{ornameObj.scriptName}</span>}
                              {/* {goodScript[0] == 0 ? null : <span>团</span>} */}
                            </p>
                          </div>
                          <div className="slideTxt">
                            {goodBase[0] == 0 ? null : <p className="goodsTitle overTxtOne">{Util.cutOutStr(item.goodsName, 12)}</p>}
                            <p className="goodsPrice">
                              {goodBase[1] == 0 ? null : <i><icon>￥</icon>
                                <span className="tprice">{goodScript[0] ? item.groupPrice : item.price}</span></i>}
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
              </div>
            </div>
          </div>)
        // return(
        //     <div className="HuandongList" style={{marginTop:ornameObj.distance}}>
        //        {goodsList.length < 3 ?
        //           goodsList.map((item,index) => {
        //              return <div className="goodsItem" key={index} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
        //               <div className="imgModule">
        //                       <img
        //                        src={item.goodsImg}
        //                       />
        //                     </div>
        //                     <div className="goodsName overTxtOne">{item.goodsName}</div>
        //                     <div className="goodsPrice">
        //                         <icon>￥</icon><span className = "price" style={{fontSize:'26px'}}>{item.price ? item.price : '0.0'}</span>
        //                          {goodBase[2] ==0 ? null : <span className="linePrice">￥{item.linePrice}</span>}
        //                     </div>
        //           </div>
        //           }) 
        //          :
        //           <Carousel className="space-carousel"
        //                 frameOverflow="visible"
        //                 cellSpacing={10}
        //                 slideWidth="228px"
        //                 selectedIndex={1}
        //                 infinite
        //                 dots={false}
        //                 style={{ marginLeft:'0px',padding:'0px',background:'none',transform: 'translate3d(0px, 0px, 0px)'}}
        //                // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        //                 // afterChange={index => this.setState({ slideIndex: index })}
        //             >
        //                 {goodsList.map((item, index) => (
        //                  <a onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}
        //                     key={index}
        //                     style={{
        //                     position: 'relative',
        //                     width: '228px',
        //                     height:'330px',
        //                     left:'10px',
        //                     textAlign:'center'
        //                     }}
        //                 >
        //                    <div className="imgModule">
        //                       <img
        //                        src={item.goodsImg}
        //                       />
        //                     </div>
        //                     <div className="goodsName overTxtOne">{item.goodsName}</div>
        //                     <div className="goodsPrice">
        //                         <icon>￥</icon><span className = "price" style={{fontSize:'26px'}}>{item.price ? item.price : '0.0'}</span>
        //                          {goodBase[2] ==0 ? null : <span className="linePrice">￥{item.linePrice}</span>}
        //                     </div>
        //                 </a>
        //                 ))}
        //             </Carousel>
        //        }
        //     </div>
        // )
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

  //商品详情
  toDetail(shopId, productId) {
    let goodDetailUrl = contants.multishopUrl + `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId, goodDetailUrl, false);
    //测试测试-----
    //window.location.href = "http://172.22.200.109:8080/multiShop"+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
  }

}