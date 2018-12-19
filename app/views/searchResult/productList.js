/**
 * Created by Song on 2018/07/019
 * 多店搜索商品列表
 */

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./productList.less";
import { ListView, Icon,PullToRefresh} from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import SvgImg from '../../../common/svgImage/svgImg'
import Empty from '../../../common/components/empty';
import PopularRecommendation from './popularRecommendation';//热门推荐
import LazyLoad from 'react-lazyload';

export default class ProductList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([]),
      height: document.documentElement.clientHeight,
      showModal1: false,
      showModal2: false, //商品/店铺类型modal
      showModalBg2: false, //modal1 background
      showModal3: false, //价格区间
      showModalBg3: false,
      showModal4: false, //商品分类
      showModalBg4: false,
      startPrice: '',
      endPrice: '',
     // keyWord:'',
    };
    this.pageNow = 1;
  }

  componentDidMount() {
    // if(this.lv){
    //   const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).offsetTop;
    //   alert(hei);
    //   this.setState({
    //     height: hei,
    //   });
    // }else{
     /* let minHeight = Math.max(document.documentElement.clientHeight, contants.docHeight);
      minHeight = minHeight/75+"rem";
      this.setState({
        height: minHeight,
      });*/
    //}
    this.search([]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showModal1: nextProps.showModal1
    })
  }

       //店铺详情
  toShop(shopId,shopType){
        let shopDetailUrl = "";
        if(shopType == 1){
            shopDetailUrl = contants.multishopUrl+`/retailPage/?shopId=${shopId}`;
         }else{
            shopDetailUrl = contants.multishopUrl+`/shopDetail/?shopId=${shopId}`;
         }
         db.goToPageForApp(shopDetailUrl,false);
      }

  toggleStyle() {
    let { SearchResultActions } = this.props;
    SearchResultActions.toggleListStyle()
  }

  toggleModal2() {
    if(this.state.showModalBg2){
      this.setState({
        showModal2: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg2: false
        })
      }, 200)
    }else{
      if(!this.state.showModal1&&!this.state.showModal3&&!this.state.showModal4){
        this.setState({
          showModalBg2: true
        })
        setTimeout(() => {
          this.setState({
            showModal2: true
          })
        }, 20)
      }
    }
  }

  //排序类型
  toggleRankType(index) {
    let { SearchResultActions } = this.props;
    SearchResultActions.setRankType(Number(index));
    SearchResultActions.clearSearch();
    if(this.state.showModalBg2){
      this.setState({
        showModal2: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg2: false
        })
      }, 200)
    }else{
      this.setState({
        showModalBg2: true
      })
      setTimeout(() => {
        this.setState({
          showModal2: true
        })
      }, 20)
    }
    this.search([],{rankType: index});
  }

  toggleModal3() {
    if(this.state.showModalBg3){
      this.setState({
        showModal3: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg3: false
        })
      }, 200)
    }else{
      if(!this.state.showModal1&&!this.state.showModal2&&!this.state.showModal4){
        this.setState({
          showModalBg3: true
        })
        setTimeout(() => {
          this.setState({
            showModal3: true
          })
        }, 20)
      }
    }
  }

  setStartPrice(e) {
    const value = e.target.value;
    const { SearchResultActions } = this.props;
    this.setState({
      startPrice: value
    })
    SearchResultActions.setStartPrice(value)
  }

  setEndPrice(e) {
    const value = e.target.value;
    const { SearchResultActions } = this.props;
    this.setState({
      endPrice: value
    })
    SearchResultActions.setEndPrice(value)
    
  }

  resetForm() {
    const { SearchResultActions } = this.props;
    this.setState({
      startPrice: '',
      endPrice: ''
    })
    SearchResultActions.setStartPrice('')
    SearchResultActions.setEndPrice('')
  }

  toggleModal4() {
    if(this.state.showModalBg4){
      this.setState({
        showModal4: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg4: false
        })
      }, 200)
    }else{
      if(!this.state.showModal1&&!this.state.showModal3&&!this.state.showModal2){
        this.setState({
          showModalBg4: true
        })
        setTimeout(() => {
          this.setState({
            showModal4: true
          })
        }, 20)
      }
    }
  }

  //商品分类视图切换
  setProductTypeView(e) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const { SearchResultActions, SearchResult } = this.props;
    const arr = SearchResult.productTypeArr;
    const arr2 = arr.map(item => {
      if(item.id == id){
        return {
          id: item.id,
          name: item.name,
          active: 1
        }
      }else{
        return {
          id: item.id,
          name: item.name
        }
      }
    })
    SearchResultActions.toggleProductMainType(arr2);
    SearchResultActions.getProductSubType('/category/querySubCategoryList?categoryId='+id,id,name);
  }

  confirm() {
    if(this.state.showModalBg3){
      this.setState({
        showModal3: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg3: false
        })
      }, 200)
    }else{
      this.setState({
        showModalBg3: true
      })
      setTimeout(() => {
        this.setState({
          showModal3: true
        })
      }, 20)
    }
    const { SearchResultActions } = this.props;
    SearchResultActions.clearSearch();
    this.search([]);
  }

  //条件搜索
  search(array,params) {
    let { SearchResult } = this.props;
     let data = {
       keyword:params&&params.keyword ? params.keyword : SearchResult.keyWord,
       shopId:'',
       platformType:1,
       sortType:params&&params.rankType > -1 ? params.rankType : SearchResult.rankType,
       minPrice:this.state.startPrice,
       maxPrice:this.state.endPrice,
       currentPage:params&&params.pageNow ? params.pageNow : 1
    }
    this.props.search(array,data);
  }

  //分类条件搜索
  searchByCategoryId(params){
    let {SearchResult,SearchResultActions} = this.props;
     let data = {
       categoryId: params.categoryId,
       sortType:params&&params.rankType > -1 ? params.rankType : SearchResult.rankType,
       priceLow:this.state.startPrice,
       priceHigh:this.state.endPrice,
    }
    SearchResultActions.search('/goods/queryGoodsListBySubCategory',data)
  }

   //商品详情
   toDetail(shopId, productId){
    let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    db.goodsViewNum(productId,goodDetailUrl,true);
  }

  //点击二级类目 。。。。
  setProductType(id,name) {
    let { SearchResultActions } = this.props;
    SearchResultActions.setProductType(id);
    SearchResultActions.clearSearch();
    //SearchResultActions.setK
    SearchResultActions.setKeyword(name)
    if(this.state.showModalBg4){
      this.setState({
        showModal4: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg4: false
        })
      }, 200)
    }else{
      if(!this.state.showModal1&&!this.state.showModal3&&!this.state.showModal2){
        this.setState({
          showModalBg4: true
        })
        setTimeout(() => {
          this.setState({
            showModal4: true
          })
        }, 20)
      }
    }
    this.search({keyword: name});
   // this.searchByCategoryId({categoryId: id});
   //SearchResultActions.searchByCategoryId('/cloud-web/search/searchCloudGoods', {categoryId: id})
  }
  
  render() {
    let { SearchResult } = this.props;
    const dataSource = this.state.dataSource.cloneWithRows(SearchResult.searchResult);
    let userInfo=db.readUserInfo();
    let row = (rowItem) => {
        return (
          <div className="productItem clear" key={rowItem.goodsId} onClick={this.toDetail.bind(this, rowItem.shopId, rowItem.goodsId)}>
            <div className="img-wrap">
              <img src={rowItem.hostUrl+rowItem.fileUrl}/>
            </div>
            <div className="desc">
             {SearchResult.listStyle === 1 ? null :  rowItem.isGruopBuy == 1 ? <div className="tuanGouIcon">团</div> : null }
              <h2 className="overTxtOne">{db.cutOutStr(rowItem.goodsName,12)}</h2>
              {SearchResult.listStyle !== 1 ? null :  rowItem.isGruopBuy == 1 ? <div className="tuanGouIcon">团</div> : null }
              <div className="likePrice">
                {/* <div className="priceCont"><i><b>￥</b>{Number(rowItem.isGruopBuy) == 1 ? rowItem.price : rowItem.linePrice}</i> */}
                <div className="priceCont"><i><b>￥</b>{rowItem.price}</i>
                { Number(rowItem.isGruopBuy) == 1 ? <a>￥{rowItem.linePrice}</a> : null}
                </div>
                {SearchResult.listStyle == 1 ? <div className="liulanCont"><i>{rowItem.pageView}人浏览</i></div> : null} 
              </div>
              {SearchResult.listStyle == 1 ? <div className="shopCont">
                <div className="ellipsis shopName">{ db.cutOutStr(rowItem.shopName,8)}</div>
                <div className="shopIcon" onClick={(e)=>{let ee = e||window.event;ee.stopPropagation();this.toShop(rowItem.shopId,rowItem.shopType)}}>
                  <span>进店</span>
                  <Icon className="rightIcon" type="right"/>
                </div>
              </div>:null}
            </div>
          </div>
        )
      };
  
    return (
      <div className="name-sapce-search-result">
        <ul className={db.userAgent()!=='IOS' ? "top89 header2 flex" : userInfo && userInfo.bang ? "top137 header2 flex":"top111 header2 flex"}>
          <li style={this.state.showModal4?{color: '#D00510'}:null} onClick={this.toggleModal4.bind(this)}>
            <span>分类</span>
            <Icon type="down" color={this.state.showModal4?'#D00510':''} className={this.state.showModal4?'rotate':''} />
          </li>
          <li style={this.state.showModal2?{color: '#D00510'}:null} onClick={this.toggleModal2.bind(this)}>
            <span>综合</span>
            <Icon type="down" color={this.state.showModal2?'#D00510':''} className={this.state.showModal2?'rotate':''} />
          </li>
          <li style={this.state.showModal3?{color: '#D00510'}:null} onClick={this.toggleModal3.bind(this)}>
            <span>筛选</span>
            <Icon type="down" color={this.state.showModal3?'#D00510':''} className={this.state.showModal3?'rotate':''} />
          </li>
          <li onClick={this.toggleStyle.bind(this)}>
            <SvgImg style={{fill:'#6D6D72'}} xlinkHref={SearchResult.listStyle === 1 ? '#wedo-wedoicon-36' : '#wedo-wedoicon-35'}></SvgImg>
          </li>
        </ul>
        { SearchResult.searchResult.length === 0 ? 
            <div className={db.userAgent()!=='IOS' ? "top170 noSearchResContainer" : userInfo && userInfo.bang ?"top220 noSearchResContainer":"top192 noSearchResContainer"}>
              <Empty message={'很抱歉！没有找到符合条件的商品~'}/>
              <PopularRecommendation {...this.props} shopId={this.state.shopId} titleType="1" />
            </div>
             :<div className={db.userAgent()!=='IOS' ? "top170 searchResutContanier" : userInfo && userInfo.bang ?"top220 searchResutContanier":"top192 searchResutContanier"}>
              <ListView
                className={SearchResult.listStyle === 1 ? 'list-style1' : 'list-style2'}
                ref={el => this.lv = el}
                dataSource={dataSource}
                // renderHeader={() => <span></span>}
              //   pullToRefresh={<PullToRefresh
              //     refreshing={this.state.refreshing}
              //     onRefresh={this.onRefresh.bind(this)}
              // />}
                renderFooter={() => (<div className="loadMore">
                  {SearchResult.isLoading ? '加载中...' : SearchResult.hasMore ? '加载更多' : '没有更多商品了'}
                </div>)}
                renderRow={row}
                style={{
                  height: this.state.height,
                  // overflow: 'auto',
                }}
                pageSize={4}
                // onScroll={() => { console.log('scroll'); }}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached.bind(this)}
                onEndReachedThreshold={10}
              /></div>
        }
        {/* 综合 */}
      <div className={db.userAgent()!=='IOS' ? "modalCont2": userInfo && userInfo.bang ?"modalCont3":"modalCont"}>
        <div className={this.state.showModalBg2 ? 'modal-2 active' : 'modal-2'}>
          <div className={this.state.showModal2 ? 'modal-bg-2 active' : 'modal-bg-2'} onClick={this.toggleModal2.bind(this)}></div>
          <ul className={this.state.showModal2 ? 'modal-content-2 active' : 'modal-content-2'}>
            <li onClick={this.toggleRankType.bind(this, 1)}>
              <span className={SearchResult.rankType === 1 ? 'active' : ''}>综合排序</span>
              {SearchResult.rankType === 1 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
            </li>
            <li onClick={this.toggleRankType.bind(this, 2)}>
              <span className={SearchResult.rankType === 2 ? 'active' : ''}>销量优先</span>
              {SearchResult.rankType === 2 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
            </li>
            <li onClick={this.toggleRankType.bind(this, 3)}>
              <span className={SearchResult.rankType === 3 ? 'active' : ''}>价格由低到高</span>
              {SearchResult.rankType === 3 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
            </li>
            <li onClick={this.toggleRankType.bind(this, 4)}>
              <span className={SearchResult.rankType === 4 ? 'active' : ''}>价格由高到低</span>
              {SearchResult.rankType === 4 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
            </li>
          </ul>
        </div>
        {/* 筛选 */}
        <div className={this.state.showModalBg3 ? 'modal-2 active' : 'modal-2'}>
          <div className={this.state.showModal3 ? 'modal-bg-2 active' : 'modal-bg-2'} onClick={this.toggleModal3.bind(this)}></div>
          <div className={this.state.showModal3 ? 'modal-content-3 active':'modal-content-3'}>
            <p>价格区间（元）</p>
            <div className="form-price">
              <div className="clear">
                <input type="number" value={this.state.startPrice} placeholder="最低价" onInput={this.setStartPrice.bind(this)} />
                <span></span>
                <input type="number" value={this.state.endPrice} placeholder="最高价" onInput={this.setEndPrice.bind(this)} />
              </div>
              <div className="btn-wrap clear">
                <button className="submit" onClick={e => this.confirm(e)}>确定</button>
                <button className="reset" onClick={this.resetForm.bind(this)}>重置</button>
              </div>
            </div>
          </div>
        </div>
        {/* 分类 */}
        <div className={this.state.showModalBg4 ? 'modal-2 active' : 'modal-2'}>
          <div className={this.state.showModal4 ? 'modal-bg-2 active' : 'modal-bg-2'} onClick={this.toggleModal4.bind(this)}></div>
          <div className={this.state.showModal4 ? 'clear modal-content-4 active':'clear modal-content-4'}>
            <ul onClick={this.setProductTypeView.bind(this)}>
              {SearchResult.productTypeArr.map(item => (
                <li key={item.id} data-id={item.id} data-name={item.name} className={item.active?'active':''}>{db.cutOutStr(item.name,2)}</li>
              ))}
            </ul>
            <div className="product-type-content">
              {
             SearchResult.productSubType &&  SearchResult.productSubType.list ?
                <div key={ SearchResult.productSubType.id}>
                  <h2>{ SearchResult.productSubType.name}</h2>
                  <ol className="clear">
                  {
                   SearchResult.productSubType.list.map(item2 => (
                      <li key={item2.id} onClick={this.setProductType.bind(this, item2.id,item2.name)}>
                        <div>
                          <img src={item2.logo}/>
                        </div>
                        <p>{item2.name}</p>
                      </li>
                    ))
                  }
                  </ol>
                </div>
              :null
            }

            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  //下拉刷新....
  onRefresh(){
    this.search([],{pageNow:1});
  }
  //上拉加载
  onEndReached () {
    let { SearchResult } = this.props;
    let searchList = SearchResult.searchResult;
    this.pageNow = this.pageNow+1;
    if (SearchResult.isLoading || !SearchResult.hasMore) {
      return;
    }
    this.search(searchList,{pageNow:this.pageNow})
  }
}
