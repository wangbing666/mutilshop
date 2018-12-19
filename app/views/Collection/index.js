/**
 * Created by Song on 2018/7/25.
 * 多店收藏
 */

import React, { Component } from "react";
import "./index.less";
import { format } from "../../../common/Apis/Utils";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import { Modal, Tabs, Icon } from "antd-mobile";
import { wxShare } from "../../../common/Apis/wxJsApis";
import * as Util from "../../../common/Apis/Utils";
import ProductList from "./productList";
import ShopList from "./shopList";
import SvgImg from '../../../common/svgImage/svgImg';


// const tabs = [
//   { title: '商品收藏', id: 1 },
//   { title: '店铺收藏', id: 2 }
// ];

export default class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
     // height: document.documentElement.clientHeight - 91,
      focused: false,
      keyWord: '',
      showInput: false,
      inWedoApp: true,
      activeIndex:1,
    }
    this.pageSize = 10;
  }

  componentWillMount() {
    if (db.userAgent() === "Android") {
      document.title = "我的收藏";
    } else {
      db.setPageTitle("我的收藏");
    }
    wxShare();
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
    let index = this.state.activeIndex;
    this.getCollectionList(index);
  }

  //获取商品、店铺收藏列表-----
  getCollectionList(index){
    const { CollectionActions, Collection } = this.props;
    let userInfo = db.readUserInfo();
    let searhUrl = "/goods/getShoppingGoodsList";
    if(index == 1){
      searhUrl = "/goods/getShoppingGoodsList";
    }else{
      searhUrl = "/goods/getShoppingShopList";
    }
    CollectionActions.search([],searhUrl, {
      name: Collection.keyWord,
      userId: db.readUserInfo()['wedoId'],
      pageSize:this.pageSize,
      pageIndex:1
    },index);
  }

  setKeyword(e) {
    let keyWord = e.target.value.trim();
    const { CollectionActions,Collection } = this.props;
    CollectionActions.setKeyword(keyWord);
    this.setState({
      keyWord:keyWord
    })
    if(keyWord === ''){
      return;
    }
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

  goBack() {
    //history.back()
    db.goBackPrevPage();
  }

  clearInputValue() {
    this.setState({
      keyWord:''
    })
  }

  toggleInput() {
    this.setState({
      showInput: !this.state.showInput
    })
  }

  setType(tab) {
    const { CollectionActions } = this.props;
    CollectionActions.setCollectType(tab.id)
  }

  confirm(e) {
    document.activeElement.blur();//软盘消失
    e.preventDefault()
    const { CollectionActions, Collection } = this.props;
   // if(Collection.searchType === 1){
      CollectionActions.clearProductList()
    // }else{
    //   CollectionActions.clearShopList()
    // }
    this.getCollectionList(this.state.activeIndex);
    // this.search({
    //   name: this.state.keyWord,
    //   userId: db.readUserInfo()['wedoId']
    // })
  }

  //传递到子页面---
  search(array,url,params,index) { //搜索
    const { CollectionActions } = this.props;
     CollectionActions.search(array,url,params,index);
  }

   //tab的切换操作
   changeTab(index){
    var acIndex = this.state.activeIndex;
    if(acIndex !== index ){
        this.setState({
         activeIndex: index
       });
       if(document.documentElement.scrollTop)
          document.documentElement.scrollTop = 0;
       if(window.pageYOffset)
          window.pageYOffset = 0;
       if(document.body.scrollTop)
         document.body.scrollTop = 0;
    }
    this.getCollectionList(index);
 }

  render() {
    const { keyWord } = this.state;
    let userInfo=db.readUserInfo();
    return (
      <div className="name-space-collect">
         <div className={db.userAgent()!=='IOS' ? "navPad22 searchNav ":"searchNav"}>
              {
                this.state.inWedoApp ?
                 <div className={db.userAgent()!=='IOS' ? "public-top-status-bar clear" : userInfo.bang ? "navPad48 public-top-status-bar clear":" navPad22 public-top-status-bar clear"}>
                    <Icon type="left" className="header-back-btn" onClick={this.goBack.bind(this)} />
                    {
                      this.state.showInput ?
                        <form className="form-input clear" action="javascript:return true;" onSubmit={e => this.confirm(e)}>
                          {
                            keyWord?null:<SvgImg style={{fill:'#B6B6B8'}} className="search-icon" xlinkHref="#wedo-wedoicon-32"></SvgImg>
                          }
                          <input
                            ref="input"
                            type="search"
                            placeholder="商品/店铺名称"
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
                          <div className="cancel" onClick={this.toggleInput.bind(this)}>取消</div>
                        </form>
                      :
                        <div className="icon-wrap clear">
                          <div className="page-title">我的收藏</div>
                          <div className="btn-wrap" onClick={this.toggleInput.bind(this)}>
                            <SvgImg className="icon" style={{ fill: "#000000" }} xlinkHref="#wedo-wedoicon-32"></SvgImg>
                          </div>
                        </div>
                    }
                    <div  className="mapTop89 navModule collectNav">
                      <div className="handleSale" onClick={this.changeTab.bind(this,1)} style={{color:this.state.activeIndex === 1 ? '#D00510' :'#373737'}}><span>商品收藏</span></div>
                      <div className="saleRecord" onClick={this.changeTab.bind(this,2)} style={{color:this.state.activeIndex === 2 ? '#D00510' :'#373737'}}><span>店铺收藏</span></div>
                    </div>
                </div>:
                <div className="noWedoApp">
                    <form className="form-input wechat clear" action="javascript:return true;" onSubmit={e => this.confirm(e)}>
                      {
                        keyWord?null:<SvgImg style={{fill:'#B6B6B8'}} className="search-icon" xlinkHref="#wedo-wedoicon-32"></SvgImg>
                      }
                      <input
                        ref="input"
                        type="search"
                        placeholder="商品/店铺名称"
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
                    </form>
                      <div  className={db.userAgent()!=='IOS' ? "mapTop89 navModule collectNav" : userInfo.bang ? "mapTop137 navModule collectNav":"mapTop111 navModule collectNav"}>
                      <div className="handleSale" onClick={this.changeTab.bind(this,1)} style={{color:this.state.activeIndex === 1 ? '#D00510' :'#373737'}}><span>商品收藏</span></div>
                      <div className="saleRecord" onClick={this.changeTab.bind(this,2)} style={{color:this.state.activeIndex === 2 ? '#D00510' :'#373737'}}><span>店铺收藏</span></div>
                  </div>
               </div>
              }
            </div>
            {
                  this.state.activeIndex === 1 ?  <ProductList {...this.props} key={this.state.keyWord} search={this.search.bind(this)} /> :
                                                  <ShopList {...this.props} key={this.state.keyWord} search={this.search.bind(this)} />
              }
        </div>
    );
  }
}
