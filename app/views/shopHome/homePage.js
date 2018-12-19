/**
 * Created by AndyWang on 2017/7/6.
 */
import React, { Component } from 'react';
// import './homePage.less';

import Navigation from './navigation';//头部导航
import { ListView, Toast } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants'
import { wxShare } from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as weidudb from '../../../common/Apis/weiduInteractive';
import CarouselTemp from './carouselTemp';
import TitleTemp from './titleTemp';
import CategoryTemp from './categoryTemp';
import ShopListTemp from './shopListTemp';
import GoodsListTemp from './goodsListTemp';
import RichTxtTemp from './richTxtTemp';
import NavBarTemp from './navBarTemp';
import ClassifyTemp from './classifyTemp';
import GroupTemp from './groupTemp'

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.initData = false;
    this.pageIndex = 1;
    this.pageSize = 5;
    this.shopId = 0;
    this.state = {
      dataSource: dataSource,
      isLoading: false,
      requestCompleted: true,//是否还有更多数据
      viewList: 1
    }
    this.theRequest = db.getValueFromUrl(location.search);
  }
  //reader前
  componentWillMount() {
    weidudb.userAuthorization();//调用原生方法获取用户信息 
  }
  //在页面被渲染成功之后
  componentDidMount() {
    const { ShopHomeActions } = this.props;
    let url = "/cloudPage/queryHomePageLayout?pageType=1";
    ShopHomeActions.getPageLayoutById(url);
    let theRequest = this.theRequest;
    let shopPreView = theRequest['shopPreview']//是否可预览
    contants.shopPreView = shopPreView;
    contants.viewStyDic = {}; // 每次回到主页清除样式
    //localStorage.removeItem("userInfo");
    //获取首页banner图
    let homeObj = localStorage.getItem("shareInfo");
    let info = null;
    if (homeObj) {
      info = JSON.parse(homeObj);
      if (db.userAgent() === 'Android') {
        // MOYAHEE
        document.title = info.pageName;
      } else {
        db.setPageTitle(info.pageName);
      }
    }

  }

  //页面销毁
  componentWillUnmount() {
    // window.sessionStorage.setItem('top',document.documentElement.scrollTop);
  }
  onEndReached() {
    if (this.initData === false || this.state.requestCompleted === false) {
      return false;
    } else {
      const { HomePage, ShopHomeActions } = this.props;
      const bodyDate = {
        pageSize: this.pageSize,
        pageNow: this.pageIndex + 1,
        goodsPageNow: 1,
        goodsPageSize: 8,
        shopId: this.theRequest['shopId']
      };
      this.initData = false;
      ShopHomeActions.getHomepageList(HomePage.homePageList, bodyDate, (data, goods) => {
        if (data === 0) {
          if (goods.length < this.pageSize) {
            this.setState({ requestCompleted: false });
          }
          this.pageIndex = this.pageIndex + 1;
          setTimeout(() => {
            this.initData = true;
          }, 1000);
        }
      }, function (err) {

      });
    }
  }

  render() {
    const { IndexPage } = this.props;
    let ornameList = [];
    if (!IndexPage.isShowLoading) {
      ornameList = contants.ornameInfo;
      //对返回的装饰信息进行 排序
      if (ornameList) {
        ornameList = ornameList.sort(function (a, b) {
          var value1 = a.orSort ? a.orSort : 0;
          var value2 = b.orSort ? b.orSort : 0;
          return value1 - value2;
        })
      }
    }
    let docHeight = Math.max(document.documentElement.clientHeight, contants.docHeight);
    return (
      IndexPage.isShowLoading ? <div className="loadingView" style={{ minHeight: docHeight / 75 + "rem" }}><div className="loadingImg"></div></div> :
        <div className="homePageBody">
          {/* <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={IndexPage.shopName} shopId={this.theRequest['shopId']}/>  */}
          {/* <div style={{marginTop:'81px'}}> */}
          <div>
            {ornameList.length > 0 ? ornameList.map((item, index) => {
              switch (item.orName) {
                case 'banner':
                  return <CarouselTemp key={index} bannerOrname={item.orInfo} {...this.props} />
                  break;
                case 'graphic':
                  return <CategoryTemp key={index} graphicOrname={item} {...this.props} />
                  break;
                case 'title':
                  return <TitleTemp key={index} titleOrname={item.orInfo} {...this.props} />
                  break;
                case 'goodsList':
                  return <GoodsListTemp key={index} goodsListOrname={item} {...this.props} />
                  break;
                case 'shopList':
                  return <ShopListTemp key={index} shopListOrname={item} {...this.props} />
                  break;
                case 'classifyList':
                  return <ClassifyTemp key={index} classifyOrname={item} {...this.props} />
                  break;
                case 'richTxt':
                  return <RichTxtTemp key={index} richTxtOrname={item.orInfo} {...this.props} />
                  break;
                case 'navgation':
                  return <NavBarTemp key={index} navBarOrname={item} {...this.props} />
                  break;
                case 'group':
                  return <GroupTemp key={index} groupOrname={item} {...this.props} />
                  break;
              }
            }) : null}
          </div>
        </div>
    )
  }
}