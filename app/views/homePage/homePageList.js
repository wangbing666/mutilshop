/**
 * Created by AndyWang on 2017/7/12.
 */
import React, { Component } from 'react';
import './homePage.less';
import Hat from './hatList';//帽子列表
import * as contants from '../../../common/Apis/constants'
import HatTree from './HatThree';//帽子列表
import HatTwo from './HatTwo';//帽子列表
import LazyLoad from 'react-lazyload';


export default class HomePageList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      homePageList: this.props.homePageList,
      groupOne: [],
      groupTow: [],
      groupThree: [],
      group: null,//总组数
      remainder: null//最后个数
    }
  }

  slideUpDown(goodList, partitionId, homePageList) {
    // console.log(goodList,'商品数据');
    // let homePageList=this.state.homePageList;
    // console.log(" console.log(this.state.homePageList);",this.state.homePageList);
    if (goodList.length === 0) {
      return null;
    } else {
      return (
        <div>
          {Number(homePageList.isShow) === 1 ?
            <div className="hatListTow" >
              <div className="hatListBody">
                {goodList.map((val, index) => {
                  return (
                    <Hat key={index} hatData={val} {...this.props} />
                  )
                })}
                <div className="moreContainer" onClick={() => { this.lookMoreDepartion() }}>
                  <div className="lookmore">查看更多</div>
                  <div className="underline" />
                  <img src={require('../../images/homePage/more.png')}></img>
                </div>
              </div>
            </div> : null}
        </div>
      )
    }
  }
  lookMoreDepartion() {//首页点击分区更多

    const { HomePage } = this.props;//相当于取this.props中的HomePageActions属性
    let title = HomePage.shopName;
    if (title) title = title.length > 8 ? title.substr(0, 8) + "..." : title;
    contants.shopName = title;
    if (contants.shopPreView != 1) {
      const { history, homePageList } = this.props;
      window.sessionStorage.removeItem('listGoods');
      let url = contants.commonUrl + '/listGoods' + '/?groupId=' + homePageList.partitionId + '&type=' + 2 + '&shopId=' + this.props.shopId + "&shopName=" + title;
      history.push({
        pathname: url,
      });
    }
  }
  slideUpDownTwo(goodList, partitionId, homePageList) {
    // let homePageList=this.state.homePageList;
    if (goodList.length === 0) {
      return null;
    } else {
      return (
        <div>
          {Number(homePageList.isShow) === 1 ?
            <div className="hatListTowTwo">
              {goodList.map((val, index) => {
                return (
                  <HatTwo key={index} hatData={val} {...this.props} />
                )
              })}
              <div className="lookMoreContainer" onClick={() => { this.lookMoreDepartion() }}>
                <div>
                  <div className="lookMore">查看更多</div>
                  {/*<div className="underline"/>*/}
                </div>
                <img className="lookMoreImg" src={require('../../images/homePage/more.png')} />
              </div>
            </div> : null}
        </div>
      )
    }
  }
  slideUpDownThree(goodList, partitionId, homePageList) {
    // console.log(goodList);
    if (goodList.length === 0) {
      return null;
    } else {
      return (
        <div>
          {Number(homePageList.isShow) === 1 ?
            <div className="hatListTowThree">
              {goodList.map((val, index) => {
                return (
                  <HatTree key={index} hatData={val} {...this.props} />
                )
              })}
              <div className="hatThreeContainer1" onClick={() => { this.lookMoreDepartion() }}>
                <div className="lookMore" >查看更多</div>
                <div className="underline" />
                <img className="lookMoreImg" src={require('../../images/homePage/more.png')} />
              </div>
            </div> : null}
        </div>
      )
    }
  }
  getImgTitle() {
    let homePageList = this.state.homePageList;
    let viewStyDic = contants.viewStyDic
    return (
      <div>
        {Number(homePageList.isShow) === 1 ? <div>
          <div className="commodityTypeTitle" style={viewStyDic ? { backgroundColor: viewStyDic.COLOR1 } : null}>
            <div className="line" style={this.props.viewStyDic ? { backgroundColor: viewStyDic.COLOR3 } : null}></div>
            <span style={viewStyDic ? { color: viewStyDic.thirdColor } : null}>{homePageList.title}</span>
            <div className="line" style={this.props.viewStyDic ? { backgroundColor: viewStyDic.COLOR3 } : null}></div>
          </div>

          <div className="bannerHostImg">
            <LazyLoad>
              <img className="bannerHostImg" onClick={() => { this.goPartition(homePageList) }} src={homePageList.bannerHostUrl + homePageList.bannerFileUrl} />
            </LazyLoad>
          </div>
        </div> : null}
        {/*<img className="bannerHostImg" onClick={()=>{this.goPartition(homePageList)}} src={homePageList.bannerHostUrl+homePageList.bannerFileUrl}/>*/}
      </div>
    )

  }
  //帽子列表上下滑动
  render() {
    let homePageList = this.state.homePageList;
    let partitionId = this.state.homePageList.partitionId;
    let type = homePageList.formworkId;
    // console.log(this.state.homePageList.goodsList);
    switch (type) {
      case 1:
        return (
          <div className="commodity" >
            {this.getImgTitle()}
            {this.slideUpDown(this.state.homePageList.goodsList, partitionId, homePageList)}
          </div>
        )
        break;
      case 3:
        return (
          <div className="commodity" >
            {this.getImgTitle()}
            {this.slideUpDownTwo(this.state.homePageList.goodsList, partitionId, homePageList)}
          </div>
        )
        break;
      case 2:
        return (
          <div className="commodity" >
            {this.getImgTitle()}
            {this.slideUpDownThree(this.state.homePageList.goodsList, partitionId, homePageList)}
          </div>
        )
        break;
      default:
        return (<div></div>)
    }

  }
  
  //分区列表页面
  goPartition(homePageList) {
    // console.log(homePageList)
    if (homePageList.bannerUrl && homePageList.bannerUrl.length > 0) {
      window.location = homePageList.bannerUrl;
    }
  };
}