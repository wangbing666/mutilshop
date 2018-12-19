/**
 * Created by AndyWang on 2017/7/6.
 */
import React, { Component } from 'react';
import './homePage.less';

import Navigation from './navigation';//头部导航
import { ListView, Toast } from 'antd-mobile';
import HomePageList from './homePageList';
import * as contants from '../../../common/Apis/constants'
import { wxShare } from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import { Carousel } from 'antd-mobile';
import GroupingList from './groupingList';//分组名称左右滑
import * as weidudb from '../../../common/Apis/weiduInteractive';
import { post } from "../../../common/Apis/Fetch";
import SvgImg from "../../../common/svgImage/svgImg";
import Frozen from "../../../common/components/empty";

class Service extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="contact" onClick={this.props.contact}>
        <div className="contact">
          <div className="shadow-box clear">
            <SvgImg className="icon" style={{ fill: "#D00510" }} xlinkHref="#wedo-wedoicon-24" />
            <span style={{ color: "#D00510" }}>在线客服</span>
          </div>
        </div>
      </div>
    )
  }
}

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
    };
    this.theRequest = db.getValueFromUrl(location.search);
    this.shopId = this.theRequest['shopId'];
  }
  //reader前
  componentWillMount() {
    db.getShopStyleInfo(this.shopId);
    db.shopViewNum(this.shopId) // 统计店铺浏览量
    db.getShopBasic(this.shopId, 1); // 获取店铺基本信息接口
    weidudb.userAuthorization();//调用原生方法获取用户信息
    this.getHomepageList();
  }
  //在页面被渲染成功之后
  componentDidMount() {
    //设置旗舰店店样式
    const { HomePageActions } = this.props;
    HomePageActions.isShopFrozen(`/shop/isShopFrozen?shopId=${this.shopId}`); //旗舰店无店铺冻结？
    let theRequest = this.theRequest;
    let shopPreView = theRequest['shopPreview']//是否可预览
    contants.shopPreView = shopPreView
    //localStorage.removeItem("userInfo");
    //获取首页banner图

  }
  getHomepageList() {
    const { HomePageActions } = this.props;
    let theRequest = this.theRequest;
    const bodyDate = {
      pageSize: this.pageSize,
      pageNow: this.pageIndex,
      goodsPageNow: 1,
      goodsPageSize: 8,
      shopId: this.theRequest['shopId']
    };
    // console.log("bug",window.sessionStorage.getItem('top'));
    // if (window.sessionStorage.getItem('top')) {
    //   this.initData = true;
    //   window.sessionStorage.removeItem('top');
    // } else {
    HomePageActions.getHomepageList([], bodyDate, (data, goods) => {
      if (data === 0) {
        this.setState({ isLoading: true });
        setTimeout(() => {
          this.initData = true;
        }, 1000);
        if (goods.length < this.pageSize) {
          this.setState({ requestCompleted: false });
        }
      }
    }, function (err) {
      Toast.info('获取数据失败', 2);
    });
    wxShare([], {});
    HomePageActions.bannerData(theRequest['shopId'], (data) => {
    }, (err) => {
    });
    HomePageActions.groupingNameList(theRequest['shopId'], {}, (data) => {

    }, (err) => {
    });
  };

  //页面销毁
  componentWillUnmount() {
    // c('top', document.documentElement.scrollTop);
  }
  onEndReached() {
    // console.log('onEndReached')
    if (this.initData === false || this.state.requestCompleted === false) {
      return false;
    } else {
      // console.log('shopPartition/listPartition 6666')

      const { HomePage, HomePageActions } = this.props;
      const bodyDate = {
        pageSize: this.pageSize,
        pageNow: this.pageIndex + 1,
        goodsPageNow: 1,
        goodsPageSize: 8,
        shopId: this.theRequest['shopId']
      };
      this.initData = false;
      HomePageActions.getHomepageList(HomePage.homePageList, bodyDate, (data, goods) => {
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

  getCategoryView() { //分组,商品分类
    const { HomePage } = this.props;
    if (contants.viewStyDic.showCategory === false) {
      return (<div></div>)
    }
    return (
      <GroupingList {...this.props} groupingListData={HomePage.groupingNameData} viewStyDic={this.state.viewStyDic} shopId={this.theRequest['shopId']} />
    )
  }
  bannerExternalJump(val) {
    console.log(val)
    if (contants.shopPreView != 1) {
      if (val.linkUrl === "" && val.activityId === 0) {

      } else if (val.linkUrl !== "") { //跳转外部链接
        db.goToPageForApp(val.linkUrl, false)
      } else { // 跳转店铺活动
        const { history } = this.props;
        let url = contants.commonUrl + '/shopActivity' + '/?shopId=' + this.theRequest['shopId'] + '&activityId=' + val.activityId
        history.push({
          pathname: url
        });
      }
    }
  }
  getBannerView() { //首页轮播效果
    const { HomePage } = this.props;
    if (contants.viewStyDic.showBanner === false) {
      return (<div></div>)
    }
    if (HomePage.bannerDataList.length === 1) {
      return (
        <div>
          <div className="cover">
            {HomePage.bannerDataList.map((val, index) => {
              return (
                <img key={index} onClick={() => { this.bannerExternalJump(val) }} src={val.hostUrl + val.fileUrl} />
              )
            })}
          </div>
        </div>
      )
    } else {
      return (
        <div className="cover">
          <Carousel
            autoplay={true}
            infinite={true}
            selectedIndex={0}
            swipeSpeed={35}
            dotStyle={{ width: '10px', height: '1px', background: 'white', marginBottom: '4px', borderRadius: 0 }}
            dotActiveStyle={contants.viewStyDic ? { background: contants.viewStyDic.COLOR1, borderColor: contants.viewStyDic.COLOR1 } : null}
          >
            {HomePage.bannerDataList.map((val, index) => {
              return (
                <img key={index} onClick={() => { this.bannerExternalJump(val) }} src={val.hostUrl + val.fileUrl} />
              )
            })}
          </Carousel>
        </div>
      )
    }
  }
  getFooterView() {
    return (
      <div className="homePageListViewFoot">
        <img className="imgLeft" />
        {this.state.requestCompleted ? <div className="loadingBody">
          <span>加载中</span>
        </div> : <div className="loadingBody">
            <span>没有更多内容了</span>
          </div>}
        <img className="imgRight" />
      </div>
    )
  }
  contact() { // 在线客服
    let userInfo = db.readUserInfo();
    let shopId = this.theRequest['shopId'];
    const { history } = this.props;
    if (userInfo === null) {
      history.push({
        pathname: contants.commonUrl + '/login/?shopId=' + this.shopId,
        state: {
          pathname: contants.commonUrl + '/chatV?shopId=' + this.shopId,
          type: 5
        }
      });
    } else {
      let userChartInfo = {
        userId: userInfo["userId"],
        userHeadUrl: userInfo["headUrl"],
        shopId: shopId,
        userName: userInfo["userNickname"],
        forwardScene: 10003,
        shopLogoUrl: contants.shareShopImgUrl,
        enterpriseId: contants.shopInfo.enterpriseId,
        shopName: contants.shopInfo.shopName
      };
      let query = '';
      Object.keys(userChartInfo).forEach((key) => {
        query += `${key}=${userChartInfo[key]}&`
      })
      window.location.href = contants.customerServiceUrl + query;
    }
  }

  render() {
    let row = (rowData, sectionID, rowID) => {
      return (
        <HomePageList key={rowID} {...this.props} homePageList={rowData} viewStyDic={this.state.viewStyDic} shopId={this.theRequest['shopId']} />
      );
    };
    if (contants.viewStyDic.showPartion === false) {
      row = (rowData, sectionID, rowID) => {
        return (
          <div />
        );
      };
    }
    const { HomePage } = this.props;
    let title = HomePage.shopName;
    if (title) title = title.length > 8 ? title.substr(0, 8) + "..." : title;
    if (db.userAgent() === 'Android') {
      document.title = title;
    } else {
      db.setPageTitle(title);
    }
    // console.log(HomePage.homePageList,'21121');
    let homePageListNumber = HomePage.homePageList.length;
    let currentPage = parseInt(homePageListNumber / this.pageSize);
    // console.log('homePageListNumber '+homePageListNumber)
    if (parseInt(homePageListNumber % this.pageSize) > 0) {
      this.pageIndex = currentPage + 1;
    } else {
      if (currentPage > 1) {
        this.pageIndex = currentPage;
      }
    }
    const homePageIndex = () => {
      if (HomePage.isShowLoading) {
        return (
          <div className="loadingView" ><div className="loadingImg"></div></div>
        )
      } else {
        return (
          location.href.indexOf('goodDetails') < 0 ?
            <div className="homePageBody">
              <Navigation {...this.props} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
              {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                <div className="homepage_List">
                  {HomePage.homePageList.length > 0 ?
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderHeader={() => {
                        return (<div className="headerContainer">
                          {this.getBannerView()}
                          {this.getCategoryView()}
                        </div>)
                      }}
                      renderFooter={this.getFooterView.bind(this)}
                      renderRow={row}
                      style={{
                        height: document.documentElement.clientHeight,
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView" />
                    : <div className="no_list">没有数据</div>}
                  {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                </div>
              }
            </div> : null
        )
      }
    }
    switch (contants.viewStyDic.SHOPWORKWORK)  //A banner,B分组分类:C:分区列表
    {
      case 'abc':
        return ( //ABC
          <div>
            {homePageIndex()}
          </div>
        )
        break;
      case 'acb'://ACB 全部分区 (shopId=7时的分区方式)
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderRow={row}
                      style={{
                        height: document.documentElement.clientHeight
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView"
                      renderFooter={this.getCategoryView.bind(this)}
                      renderHeader={() => {
                        return (<div>
                          {this.getBannerView()}
                        </div>)
                      }}
                    />
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                  </a>
                }
              </div> : null}
          </div>
        )
        break;
      case 'bac'://BAC
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderRow={row}
                      style={{
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      renderHeader={() => {
                        return (<div className="headListViewBody">
                          {this.getCategoryView()}
                          {this.getBannerView()}
                        </div>)
                      }}
                      renderFooter={this.getFooterView.bind(this)}

                      className="homePageListView" />
                    {/*{this.getBannerView()}
                                {this.getCategoryView()}*/}
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                  </a>
                }
              </div> : null}
          </div>
        )
        break;
      case 'bca'://BCA
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    {this.getCategoryView()}
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderRow={row}
                      style={{
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView" />
                    {this.getBannerView()}
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                  </a>
                }
              </div> : null}
          </div>
        )
        break;
      case 'cab'://CAB
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderRow={row}
                      style={{
                      }}
                      renderFooter={() => {
                        return (<div>
                          {this.getBannerView()}
                          {this.getCategoryView()}
                        </div>)
                      }
                      }
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView" />
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                  </a>
                }
              </div> : null}
          </div>
        )
        break;
      case 'cba'://CBA
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderRow={row}
                      style={{
                      }}

                      renderFooter={() => {
                        return (<div>
                          {this.getCategoryView()}
                          {this.getBannerView()}
                        </div>)
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView" />
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}
                  </a>
                }
              </div> : null}
          </div>
        )
        break;
      default:
        return (
          <div>
            {location.href.indexOf('goodDetails') < 0 ?
              <div className="homePageBody">
                <Navigation {...this.props} viewStyDic={this.state.viewStyDic} title={HomePage.shopName} shopId={this.theRequest['shopId']} />
                {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> :
                  <a>
                    <ListView
                      ref="list"
                      dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                      renderHeader={this.getBannerView.bind(this)}
                      renderFooter={this.getFooterView.bind(this)}
                      renderRow={row}
                      style={{
                        height: document.documentElement.clientHeight,
                      }}
                      scrollEventThrottle={600}
                      onEndReached={this.onEndReached.bind(this)}
                      onEndReachedThreshold={600}
                      useBodyScroll={true}
                      initialListSize={20}
                      className="homePageListView" />
                    {Number(contants.viewStyDic.NEED_CS) === 1 ? <Service contact={this.contact.bind(this)} /> : null}

                  </a>
                }
              </div> : null}

          </div>
        )

    }
  }
}