/**
 * Created by Song on 2018/07/019
 * 多店搜索店铺列表
 */

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./shopList.less";
import { ListView,PullToRefresh } from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import PopularRecommendation from './popularRecommendation';//热门推荐
import Empty from '../../../common/components/empty';
import * as Util from '../../../common/Apis/Utils';
import LazyLoad from 'react-lazyload';
export default class ShopList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      orderType: [{id: 1, name: '综合', active: true},{id: 2, name: '销量'},{id: 3, name: '热度'}],
      dataSource: ds.cloneWithRows([]),
      height: document.documentElement.clientHeight
    };

    this.pageNow = 1;
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    // if(this.lv){
    //   const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop;
    //   this.setState({
    //     height: hei,
    //   })
    // }else{
      let minHeight = Math.max(document.documentElement.clientHeight, contants.docHeight);
      minHeight = minHeight/75+"rem";
      this.setState({
        height: minHeight
      });
    // }
    this.search();
  }

  toggleType(e) {
    const { SearchResultActions } = this.props;
    SearchResultActions.clearSearch();
    let id = Number(e.target.dataset.id);
    let arr = this.state.orderType.slice(0);
    let arr2 = arr.map(item => {
      return {
        id: item.id,
        name: item.name,
        active: item.id === id?true:false
      }
    })
    this.setState({
      orderType: arr2,
    })
    SearchResultActions.toggleShopRankType(id);
    this.search([],{shopRankType: id})
  }

  //商品详情
  toProductDetail(shopId, productId){
    let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId,goodDetailUrl,true);
  }

  //店铺详情
  toShop(shopId,shopType){
    console.log(shopType)
    let shopDetailUrl = "";
    if(shopType == 1){
      shopDetailUrl = contants.multishopUrl+`/retailPage/?shopId=${shopId}`;
   }else{
      shopDetailUrl = contants.multishopUrl+`/shopDetail/?shopId=${shopId}`;
   }
    Util.goToPageForApp(shopDetailUrl,false);
  }


  search(array,params) {
    const { SearchResult } = this.props;
    const data = {
      platformType:1,
      keyword: SearchResult.keyWord,
      sortType: params&&params.shopRankType > -1 ? params.shopRankType : SearchResult.shopRankType,
      currentPage:params&&params.pageNow ? params.pageNow : 1
    }
    this.props.search(array,data);
  }

  render() {
    //alert(this.state.height);
    let { orderType } = this.state;
    let { SearchResult } = this.props;
    const dataSource = this.state.dataSource.cloneWithRows(SearchResult.searchResult);
    let userInfo=Util.readUserInfo();
    let row = (row) => {
      return (
        <div className="shopItem" key={row.shopId}>
          <div className="head clear">
            <div className="img-wrap">
              <img src={row.logoUrl} />
            </div>
            <div className="info">
              <div className="name ellipsis">{Util.cutOutStr(row.shopName,12)}</div>
              <div className="sales">销量{row.totalSalesVolume}件&nbsp;&nbsp;<span>共{row.totalSpu}件宝贝</span></div>
            </div>
            <div className="link" onClick={this.toShop.bind(this, row.shopId,row.shopType)}>进店</div>
          </div>
          <div className="product-row clear">
            {
                row.goodDetailsList ? row.goodDetailsList.map((item,index) =>{
                if(item && index < 3 ){
                  return (
                    <div key={index} className="product-wrap" onClick={this.toProductDetail.bind(this, row.shopId, item.goodId)}>
                      <div className="img-wrap">
                          <img src={item.goodimage}/>
                      </div>
                      <span>￥{item.goodPrice}</span>
                    </div>
                  )
                }
              } 
            ) : <div></div>}
          </div>
        </div>
      );
    };

    return (
      <div className={Util.userAgent()!=='IOS' ? "top170 name-space-shop-list" : userInfo.bang ? "top220 name-space-shop-list":"top192 name-space-shop-list"}>
        <div className={Util.userAgent()!=='IOS' ? "top89 header flex" : userInfo.bang ?"top137 header flex":"top111 header flex"} onClick={(e) => this.toggleType(e)}>
        {
          orderType.map((item, index) => {
            return (
              <div className={item.active?'active':''} data-id={item.id} key={item.id}>
                {item.name}
              </div>
            )
          })
        }
        </div>
        {  SearchResult.searchResult.length === 0 ?
          <div>
             <Empty message={'很抱歉！没有找到符合条件的店铺~'}/>
             <PopularRecommendation {...this.props} shopId={this.state.shopId} titleType="1" />
          </div> :
           
        // {/* <Suggestion {...this.props} list={this.state.data} /> */}
          <ListView
              ref={el => this.lv = el}
              dataSource={dataSource}
              // renderHeader={() => <span></span>}
              pullToRefresh={<PullToRefresh
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
            />}
              renderFooter={() => (<div className="loadMore">
                {SearchResult.isLoading ? '加载中...' : SearchResult.hasMore ? '加载更多' : '没有更多店铺了'}
              </div>)}
              renderRow={row}
              style={{
                height: this.state.height,
                //overflow: 'auto',
              }}
              pageSize={4}
              // onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached.bind(this)}
              onEndReachedThreshold={10}
          /> 
        }
      </div>
    );
  }

  //下拉刷新....
  onRefresh(){
    this.search([],{pageNow:1});
  }

  //上拉加载...
  onEndReached () {
    const { SearchResult } = this.props;
    let searchList = SearchResult.searchResult;
    if (SearchResult.isLoading || !SearchResult.hasMore) {
      return;
    }
    this.pageNow = this.pageNow + 1;
    this.search(searchList,{pageNow:this.pageNow});
  }

}
