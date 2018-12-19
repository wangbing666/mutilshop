/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './search.less';
// import HatlistGoods from '../listGoods/hatListGoods';//单个帽子
import HatlistGoods from "../homePage/HatThree";

import PopularRecommendation from './popularRecommendation';//热门推荐
import { ListView, Toast, Modal } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants'
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as weidudb from '../../../common/Apis/weiduInteractive';
import * as db from '../../../common/Apis/Utils';
//import { ListView,Toast} from 'antd-mobile';
const alert = Modal.alert;

export default class Search extends Component {
  constructor(...args) {
    super(...args);
    let strs = []
    var localUrl = location.search; //获取url中"?"符后的字串
    let theRequest = db.getValueFromUrl(location.search);
    this.shopId = theRequest['shopId']
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.keyword = null;
    this.currentPage = 1;
    //this.requestCompleted=true;
    this.state = {
      dataSource: dataSource,
      historicalS: [],
      requestCompleted: true,//是否还有下一页
      showClearImg: false,
    }
  }
  //reader前
  componentWillMount() {
    document.title = '搜索';
    weidudb.userAuthorization();
  }
  //在页面被渲染成功之后
  componentDidMount() {
    wxShare([], {});
    this.popularSearches();//获取热门搜索列表
    const { Search, SearchActions } = this.props;
    SearchActions.historyList();
  }
  //页面销毁
  componentWillUnmount() {
    const { Search, SearchActions } = this.props;
    SearchActions.searchResults(false);
    SearchActions.searchForProductsData([]);
  }
  //获取热门搜索接口
  popularSearches() {
    const { Search, SearchActions } = this.props;
    let url = "/goods/hotsearch";
    let data = {
      userId: 0,
      shopId: this.shopId
    };
    SearchActions.popularSearches(url, data, () => { }, () => { })
  };
  //搜索列表
  popularSearchesList(popularSearches) {
    console.log("热门搜索", popularSearches);
    if (popularSearches.length === 0) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="popularSearches">
          <div className="PSList">
            {popularSearches.map((val, index) => {
              let goodName;
              if (val.goodName == null) {
                goodName = val.goodName;
              } else {
                goodName = val.goodName.substring(0, 5);
              }
              return (
                <button key={index} onClick={() => { this.clickSearch(goodName) }} >{goodName}</button>
              )
            })}
          </div>
        </div>
      )
    }
  }
  //历史记录列表
  historicalSearchList(historicalS) {
    console.log(historicalS);
    if (historicalS.length === 0) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="historicalSearch">
          <div className="HSTitle">
            <label>搜索历史</label>
            <img src={require('../../images/search/trash.png')} onClick={() => { this.deleteSearch() }} />

          </div>
          <div className="HSList">
            {historicalS.map((val, index) => {
              return (
                <div className="HSLbody" key={index} onClick={() => { this.clickSearch(val.searchName) }}>
                  <div className="HSLText">
                    <img src={require('../../images/search/historicalSearch.png')} />
                    <label>{val.searchName}</label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }
  //点击按钮搜索
  clickSearch(val) {
    //调用搜索接口
    document.getElementById("searchInput").value = val;
    this.keyword = val.toString();
    this.currentPage = 1;
    const { Search, SearchActions } = this.props;
    let url = "/search/searchGoods";
    let data = {
      keyword: $.trim(val.toString()),
      currentPage: this.currentPage,
      shopId: this.shopId
    };
    this.setState({ showClearImg: true })
    document.getElementById("PAscreenBody").className = "PAscreenBody show";
    SearchActions.searchForProductsData([]);
    SearchActions.searchForProducts(Search.searchForProducts, url, data, (searchData) => {
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
      if (searchData.length < 8) {
        this.setState({ requestCompleted: false });
      }
    }, (err) => {
      Toast.info('获取数据失败', 2);
      document.getElementById("PAscreenBody").className = "PAscreenBody hide";
    });
  };
  valuechange(param) {
    let searchInput = param.target.value;
    if (searchInput && searchInput.length > 0) {
      this.setState({ showClearImg: true })
    }
    else {
      this.setState({ showClearImg: false })
    }
  }
  render() {
    const { Search } = this.props;
    console.log('Search.searchForProducts' + Search.searchForProducts.length)
    const row = (rowData, sectionID, rowID) => {
      return (
        <HatlistGoods key={rowID} hatData={rowData} {...this.props} shopId={this.shopId} />
      );
    };
    return (
      <div className="searchBody">
        <div id="PAscreenBody" className="PAscreenBody hide">
          <div className="loadingView">
          </div>
        </div>
        <div className="SBody">
          <div className="SMidle">
            <div className="SBodyLeft">
              <img src={require('../../images/search/search.png')} />
              <form className="SBodyRight" action="javascript:return true;" onSubmit={() => { this.searchCommodity(); }}>
                <input id="searchInput" type="search" placeholder="" onChange={(e) => this.valuechange(e)} />
              </form>
              {this.state.showClearImg ? <img className="clearImg" onClick={() => { this.cancelInput() }} src={require('../../images/search/click.png')} />
                : null}
            </div>
          </div>

        </div>
        {Search.searchResults ? <div className="searchBottom">
          {Search.searchForProducts.length === 0 ? <div>
            <div className="searchPromptText">
              <span>暂时没有搜索到相关产品</span>
            </div>
            <PopularRecommendation {...this.props} shopId={this.shopId} />
          </div> : <div>
              <div>
                <ListView
                  dataSource={this.state.dataSource.cloneWithRows(Search.searchForProducts)}
                  renderFooter={() => (<div className="searchListViewFoot">
                    <div className="imgLeft" />
                    <span>
                      {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                    </span>
                    <div className="imgRight" />
                  </div>)}
                  renderRow={row}
                  style={{
                    height: document.documentElement.clientHeight,
                  }}
                  scrollEventThrottle={200}
                  onEndReached={this.onEndReached.bind(this)}
                  onEndReachedThreshold={0}
                  className="searchListView" />
              </div>
            </div>}
        </div> : <div className="searchBottom">
            {this.popularSearchesList(Search.popularSearches)}
            {this.historicalSearchList(Search.historicalS)}
            <div>
              <div>
                <PopularRecommendation {...this.props} shopId={this.shopId} />
              </div>
            </div>
          </div>}
      </div>
    )
  }
  //取消按钮
  cancelInput() {
    document.activeElement.blur();
    document.getElementById("searchInput").value = "";
    const { Search, SearchActions } = this.props;
    SearchActions.searchResults(false);
    this.setState({ showClearImg: false })
    SearchActions.searchForProductsData([]);
  };
  //添加历史记录
  searchCommodity() { //点击键盘搜索
    this.setState({ showClearImg: false })
    document.activeElement.blur();
    setTimeout(() => {
      const { Search, SearchActions } = this.props;
      let searchInput = document.getElementById("searchInput").value;
      if (searchInput === null || searchInput === "" || $.trim(searchInput.toString()) === "") {
        if (!this.alert) {
          this.alert = alert('提示', '请输入搜索信息', [
            {
              text: '确定', onPress: () => {
                this.alert = null;
              }, style: { color: '#000000' }
            },
          ]);
        }
      } else {
        SearchActions.searchForProductsData([]);
        this.clickSearch(searchInput);
        SearchActions.addSearchCommodity(searchInput, () => {
          this.props.SearchActions.historyList();
        });
      }
    }, 400);
  };
  //清空历史记录
  deleteSearch() {
    localStorage.removeItem("historicalSearch");
    this.props.SearchActions.historyList();
  };
  onEndReached() {
    if (this.state.requestCompleted === false) {

    } else {
      const { Search, SearchActions } = this.props;
      let url = "/search/searchGoods";
      let data = {
        keyword: this.keyword,
        currentPage: this.currentPage + 1
      };
      console.log(data);
      SearchActions.searchForProducts(Search.searchForProducts, url, data, (searchData) => {
        if (searchData.length === 0) {
          this.setState({ requestCompleted: false });
        } else {
          this.currentPage = this.currentPage + 1;
        }
      }, () => { });
    }
  };
}