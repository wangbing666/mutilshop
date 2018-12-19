/**
 * Created by Song on 2018/07/05
 * 多店购物板块首页搜索跳转搜索结果页面
 */
import React, { Component } from "react";
import "./index.less";
import { Icon } from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import * as Util from "../../../common/Apis/Utils";
import SvgImg from '../../../common/svgImage/svgImg'
import ProductList from './productList';
import ShopList from './shopList';

export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      keyWord: '',
      showModal1: false, //商品/店铺类型modal
      showModalBg1: false, //modal1 background
      isWedoApp: true,
    };
  }
  componentWillMount() {
    if (db.userAgent() === "Android") {
      document.title = "";
    } else {
      db.setPageTitle("");
    }
  }
  componentDidMount() {
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/kaBao_UU_Wedo/i)=="kabao_uu_wedo") {
      //在微度app中
      this.setState({
        inWedoApp: true
      })
    }else{
      this.setState({
        inWedoApp: false
      })
    }
    const { SearchResultActions, SearchResult } = this.props;
    //let url = '/goods/hotsearch';
    let typeUrl = '/category/queryMainCategoryList';
    let subTypeUrl ="/category/querySubCategoryList?categoryId=1";

    SearchResultActions.getProductType(typeUrl);//一级分类
    SearchResultActions.getProductSubType(subTypeUrl,1,"服装");  //二级分类
  }
  setKeyword(e) {
    const { SearchResultActions } = this.props;
    let value = e.target.value.trim();
   // let url = '/cloud-web/search/searchCloudGoods';
    SearchResultActions.setKeyword(value);
    if(value === "") return;
  }
  onFocus() {
    this.setState({
      focused: true
    });
  }
  onBlur() {
    setTimeout(() => {
      this.setState({
        focused: false
      });
    }, 200);
  }
  //返回上一页
  goBack() {
   history.back()
  // Util.goBackPrevPage();
  }
  clearInputValue() {
    const { SearchResultActions } = this.props;
    SearchResultActions.setKeyword('');
    this.setState({
      keyWord:''
    })
  }
  toggleSearchType(e) {
    let { SearchResultActions } = this.props;
    const index = e.currentTarget.dataset.index;
    SearchResultActions.clearSearch();
    SearchResultActions.setSearchType(Number(index));
    if(this.state.showModalBg1){
      this.setState({
        showModal1: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg1: false
        })
      }, 200)
    }else{
      this.setState({
        showModalBg1: true
      })
      setTimeout(() => {
        this.setState({
          showModal1: true
        })
      }, 20)
    }
  }
  toggleModal1() { //setTimeout 解决transition和display冲突
    if(this.state.showModalBg1){
      this.setState({
        showModal1: false
      })
      setTimeout(() => {
        this.setState({
          showModalBg1: false
        })
      }, 200)
    }else{
      this.setState({
        showModalBg1: true
      })
      setTimeout(() => {
        this.setState({
          showModal1: true
        })
      }, 20)
    }
  }
  
  confirm(e) {
    document.activeElement.blur();//软盘消失
    e.preventDefault();
    const {SearchResultActions,SearchResult } = this.props;
    let key = SearchResult.keyWord.trim();
    if(SearchResult.searchType === 1){
      let goodsData = {
        keyword: SearchResult.keyWord,
        shopId:'',
        platformType:1,
        sortType:1,
        minPrice:this.state.startPrice,
        maxPrice:this.state.endPrice,
        currentPage:1
      }
      SearchResultActions.search('/search/searchCloudGoods',[],goodsData)
  
    }else{
      let shopData = {
        platformType:1,
        keyword: SearchResult.keyWord,
        sortType: 1,
        currentPage:1
      }
      SearchResultActions.search('/search/searchCloudShop', [],shopData)
    }

    if(key.length === 0){
      return
    }
    let history = JSON.parse(localStorage.getItem("historicalSearch") || JSON.stringify([]));
    let index = -1;
    for(let i = 0;i<history.length;i++){
      if(history[i].searchName === SearchResult.keyWord){
        index = i;
        break;
      }
    }
    if(index !== -1){
      history.splice(index,1);
    }
    history.unshift({searchName: SearchResult.keyWord});
    if(history.length > 10){
      history.length = 10;
    }
    localStorage.setItem('historicalSearch', JSON.stringify(history))
  }

  search(array,params) { //搜索
    const { SearchResultActions, SearchResult } = this.props;
   // let searchUrl='/cloud-web/search/searchCloudGoods';
    if(SearchResult.searchType === 1){
      SearchResultActions.search('/search/searchCloudGoods',array,params)
    }else{
      SearchResultActions.search('/search/searchCloudShop',array,params)
    }
  }

  render() {
    const { SearchResult } = this.props;
    const keyWord = SearchResult.keyWord;
    let userInfo=db.readUserInfo();
    return (
      <div className="name-space-searchresult">
      <div className={db.userAgent()!=='IOS' ? "searchNav": userInfo && userInfo.bang ?"navPad48 searchNav":"navPad22 searchNav"}>
          <form className="form-input clear" action="javascript:return true;" onSubmit={e => this.confirm(e)}>
            {/* { !this.state.inWedoApp?<Icon type="left" style={{float:"left"}} className="header-back-btn" onClick={this.goBack.bind(this)} />:<div className="empty"></div>} */}
            <div className="empty"></div>
            <div className="type" onClick={this.toggleModal1.bind(this)}>
              { SearchResult.searchType === 1 ? '商品' : '店铺' }
              <div className="toggle-arrow">
                <Icon type="down" className={this.state.showModal1 ? 'rotate' : ''} />
              </div>
            </div>
            {
              keyWord?null:<SvgImg style={{fill:'#B6B6B8'}} className="search-icon" xlinkHref="#wedo-wedoicon-32"></SvgImg>
            }
            <input
              ref="input"
              type="search"
              placeholder="请输入搜索关键词"
              onChange={e => this.setKeyword(e)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              value={keyWord}
              maxLength="27"
              // autoFocus="autofocus"
              className={keyWord?'padding-1':''}
            />
            {
              this.state.focused && keyWord?<Icon className="clear-icon" onClick={() => this.clearInputValue()} type="cross-circle-o" color="#B6B6B8" />:null
            }
            <div className="cancel" onClick={this.goBack.bind(this)}>取消</div>
          </form>
        </div>
        {
          SearchResult.searchType === 1 ?
          <ProductList {...this.props} showModal1={this.state.showModal1} search={this.search.bind(this)} /> :
          <ShopList {...this.props} search={this.search.bind(this)} />
        }

            { db.userAgent()!=='IOS' ?
            <div className={this.state.showModalBg1 ? 'modal-1 top89 active' : 'modal-1 top89'}>
            <div className={this.state.showModal1 ? 'modal-bg-1 top89 active' : 'top89 modal-bg-1'} onClick={this.toggleModal1.bind(this)}></div>
            <ul className={this.state.showModal1 ? 'active' : ''}>
              <li data-index="1" onClick={this.toggleSearchType.bind(this)}>
                <span className={SearchResult.searchType === 1 ? 'active' : ''}>商品</span>
                {SearchResult.searchType === 1 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
              </li>
              <li data-index="2" onClick={this.toggleSearchType.bind(this)}>
                <span className={SearchResult.searchType === 2 ? 'active' : ''}>店铺</span>
                {SearchResult.searchType === 2 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
              </li>
            </ul>
          </div> :
           userInfo && userInfo.bang ?  <div className={this.state.showModalBg1 ? 'modal-1 top137 active' : 'modal-1 top137'}>
           <div className={this.state.showModal1 ? 'modal-bg-1 top137 active' : 'top137 modal-bg-1'} onClick={this.toggleModal1.bind(this)}></div>
           <ul className={this.state.showModal1 ? 'active' : ''}>
             <li data-index="1" onClick={this.toggleSearchType.bind(this)}>
               <span className={SearchResult.searchType === 1 ? 'active' : ''}>商品</span>
               {SearchResult.searchType === 1 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
             </li>
             <li data-index="2" onClick={this.toggleSearchType.bind(this)}>
               <span className={SearchResult.searchType === 2 ? 'active' : ''}>店铺</span>
               {SearchResult.searchType === 2 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
             </li>
           </ul>
         </div> :
           <div className={this.state.showModalBg1 ? 'modal-1 top111 active' : 'modal-1 top111'}>
           <div className={this.state.showModal1 ? 'modal-bg-1 top111 active' : 'top111 modal-bg-1'} onClick={this.toggleModal1.bind(this)}></div>
           <ul className={this.state.showModal1 ? 'active' : ''}>
             <li data-index="1" onClick={this.toggleSearchType.bind(this)}>
               <span className={SearchResult.searchType === 1 ? 'active' : ''}>商品</span>
               {SearchResult.searchType === 1 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
             </li>
             <li data-index="2" onClick={this.toggleSearchType.bind(this)}>
               <span className={SearchResult.searchType === 2 ? 'active' : ''}>店铺</span>
               {SearchResult.searchType === 2 ? <SvgImg style={{fill:'#D00510'}} xlinkHref="#wedo-wedoicon-31"></SvgImg> : null }
             </li>
           </ul>
         </div>
           }
           
      </div>
    );
  }
}
