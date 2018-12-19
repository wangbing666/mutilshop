/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import { ListView,PullToRefresh } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import "./commodityType.less";

export default class ListGoods extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData=false;
        this.pageIndex=1;
        this.pageSize=20;//没页条数
        this.state={
            dataSource: dataSource,
           // refreshing:false
            isLoading: true,
            goodAbbr:[],
            goodBase:[],
            goodScript:[],
            infoArr:[],
            fontColor:"",
            ornameObj:{},
            requestCompleted:true//是否还有更多数据
        }
        this.theRequest=db.getValueFromUrl(location.search);
    }
    //reader前
    componentWillMount(){
    }

    //将字符串转成数组
    transfromArr(str){
        let strArr = [];
        if(typeof(str) == "string" && str.indexOf(",")>-1){
            strArr = str.split(",");
        }
        return strArr;
    }
    //设置title
    setTitleName(name){
        if(db.userAgent()==='Android'){
            document.title=name;
        }else{
            db.setPageTitle(name);
        }
    }
    componentDidMount(){
        wxShare([],{});
        const {ListGoods,ListGoodsActions}=this.props;
        if(this.theRequest.type ==1){
            let linkId = this.theRequest.linkId;
            let sortRule = this.theRequest.sortRule;
            let goodBase = this.transfromArr(this.theRequest.goodBase);
            let ornameObj = this.theRequest.ornameObj;
            let goodAbbr = this.transfromArr(this.theRequest.goodAbbr);
            let goodScript = this.transfromArr(this.theRequest.goodScript);
            this.setTitleName("商品列表");
            this.setState({
                goodBase:goodBase,
                goodAbbr:goodAbbr,
                goodScript:goodScript,
                ornameObj:ornameObj
            })
            ListGoodsActions.getGoodsList(linkId,0,"",sortRule);
        }else if(this.theRequest.type ==2){
            let linkId = this.theRequest.linkId;
            let sortRule = this.theRequest.sortRule;
            let infoArr = this.transfromArr(this.theRequest.infoArr);
            this.setTitleName("店铺列表");
            this.setState({
                infoArr:infoArr,
               // fontColor:this.theRequest.fontColor,
            })
            ListGoodsActions.getShopList(linkId,1,"",sortRule);
        }
    };
    //页面销毁
    componentWillUnmount(){

    }

    getHeadView() {
        return(<div style={{height:"0px",padding:'0px',display:"none"}}></div>)
    }
    render() {
        const {ListGoods,ListGoodsActions}=this.props;
        const row = (item, sectionID, rowID) => {
            if(this.theRequest.type == 1){
                    return( <div className="recomItem" key={rowID} onClick={this.toDetail.bind(this, item.shopId, item.goodsId)}>
                    <div className="imgMoudle">
                        <img className="goodImg" src={item.goodsImg}/>
                        {item.activityType==0? null: <img className = "tgImg" src={require("../../images/comment/tgsIcon.png")} />}
                        <p className="newIconSmall"> 
                                { this.state.goodScript[1] == 0 ? null : <span className="iconOne">{this.state.ornameObj.scriptName}</span>}
                                { this.state.goodScript[0] == 0 ? null : <span>新品</span>}
                        </p>
                    </div>
                    <div className="TextModule">
                            <div className="goodsName overTxtOne">{item.goodsName}</div>
                            <div className="goodsPrice">
                                {this.state.goodBase[1] ==0 ? null :<i><icon>￥</icon><span className = "price">{item.activityType ? item.groupPrice:item.price }</span></i>}
                                {this.state.goodBase[2] ==0 ? null : <span className="linePrice">￥{item.linePrice}</span>}
                            </div>
                            {this.state.goodAbbr[2] ==0 ? null : <div className="stock"><p>库存:{item.stock}</p></div> }
                            {/* <div className="stock"><p>库存:{item.stock}</p><p className="profitModule"><span className="profitTxt">利润</span><span className="profitPrice">最高 ￥ {item.profit}</span></p></div> */}
                            <div className="sales">
                                { this.state.goodAbbr[3] == 0 ? null : <span>销量：{item.salesVolume ? item.salesVolume : 0 }</span>}
                                { this.state.goodAbbr[1] == 0 ? null :<span className="distri">浏览量：{item.pageView ? item.pageView : 0}</span>}
                            </div>
                    </div>
                </div>
                )
             }else{
                return(
                      <div className="listItem shopListItem" key={rowID}>
                               <div className="shopTitleModule">
                                 <img src={item.hostUrl+item.zoomUrl}/>
                                   <div className="shopInfo">
                                        <p style={{color:'#000'}}>{item.shopName}</p>
                                        <div className="shopTip">
                                          {this.state.infoArr[0] == 0 ? null : <span>销量{item.salesVolume ? item.salesVolume : 0}件</span>}
                                          {this.state.infoArr[1] == 0 ? null : <span>共{item.upgoodsNum}件宝贝</span>}
                                        </div>
                                   </div>
                                   <div className="icon" style={{display:"none"}}><img src={require('../../images/shippingAddress/n6@1.5x.png')}/></div>
                                   {this.state.infoArr[2] == 0 ? null : <div className="inShop"  onClick={this.toShopDetail.bind(this, item.shopId,item.showType)}><span>进店</span></div>}
                               </div>
                            { item.goodsList.length > 0 ? 
                               <div className="shopImgModule">
                                   { item.goodsList.map((goods,goodsIndex) =>{
                                        if(goodsIndex < 3 && goods){
                                            return <div className="goodsImg" key={goodsIndex}>
                                            <img src={goods.goodsHostUrl + goods.goodsFileUrl}  onClick={this.toDetail.bind(this, item.shopId, goods.goodsId)}/>
                                           <span>￥{goods.goodsPrice}</span>
                                           </div>
                                        }  
                                    }) 
                                   }
                               </div>:null}
                           </div>   
                         )
            }
            
        };
   
      return(
         this.theRequest.type == 1 ?
          <div className="listMoudle1">
            {/* <Header titleTxt="商品列表"></Header> */}
              <ListView
                  ref="listview"
                  dataSource={this.state.dataSource.cloneWithRows(ListGoods.commodityList)}
                  renderRow={row}
                  renderHeader={this.getHeadView.bind(this)}
                  pullToRefresh={<PullToRefresh
                      refreshing={this.state.refreshing}
                      onRefresh={this.onRefresh.bind(this,1)}
                  />}
                  renderFooter={() => (<div className="listViewFoot">
                      <img className="imgLeft" />
                      <span>没有更多内容了</span>
                      <img className="imgRight" />
                  </div>)}
                  className="hatListView"
                  style={{
                      height: document.documentElement.clientHeight
                  }}
                 // onEndReached={this.onEndReached.bind(this)}
                  useBodyScroll={true}
                  scrollRenderAheadDistance={200}
                  scrollEventThrottle={20}
                  onEndReachedThreshold={10}
                  initialListSize={50}
                 />
          </div> : 
              <div className="classifyShopList2" style={{padding:"0px",background:'#fff'}}>
                {/* <Header titleTxt="店铺列表"></Header> */}
              <ListView
                  ref="listview"
                  dataSource={this.state.dataSource.cloneWithRows(ListGoods.commodityList)}
                  renderRow={row}
                  renderHeader={this.getHeadView.bind(this)}
                  pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this,2)}
                />}
                  renderFooter={() => (<div className="listViewFoot">
                      <img className="imgLeft" />
                      <span>没有更多内容了</span>
                      <img className="imgRight" />
                  </div>)}
                  className="hatListView"
                  style={{
                      height: document.documentElement.clientHeight
                  }}
                 // onEndReached={this.onEndReached.bind(this)}
                  useBodyScroll={true}
                  scrollRenderAheadDistance={200}
                  scrollEventThrottle={20}
                  onEndReachedThreshold={10}
                  initialListSize={50}
                 />
          </div>
      )
    }
    onEndReached(){
       // const {ListGoods,ListGoodsActions}=this.props;
        if(this.initData===false||this.state.requestCompleted===false){
        }else {
            this.initData=false; 
        }
    }

    //下拉刷新-----
    onRefresh(type) {
        const {ListGoodsActions}=this.props;
        let linkId = this.theRequest.linkId;
        let sortRule = this.theRequest.sortRule;
      if(type === 1){
        ListGoodsActions.getGoodsList(linkId,0,"",sortRule);
      }else{
        ListGoodsActions.getShopList(linkId,1,"",sortRule);
      }
    }
       //商品详情
       toDetail(shopId, productId){
        let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
        db.goodsViewNum(productId,goodDetailUrl,true);
      }
    
      //店铺详情
      toShopDetail(shopId,shopType){
        let shopDetailUrl = "";
        if(shopType == 1){
            shopDetailUrl = contants.multishopUrl+`/retailPage/?shopId=${shopId}`;
         }else{
            shopDetailUrl = contants.multishopUrl+`/shopDetail/?shopId=${shopId}`;
         }
        db.goToPageForApp(shopDetailUrl,false);
      }
}