/**
 * Created by chenmao on 2017/6/28.
 */
import React, { Component, PropTypes } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import * as contants from '../../common/Apis/constants';
import ScrollToTop from '../../common/components/ScrollToTop';
import * as Tool from '../../common/Tools/tool';
import { addShopHitHand, getValueFromUrl } from '../../common/Apis/Utils';
/*
*实现按需加载文件
* */
import Bundle from '../views/bundle.js';

//异步载入
import HomepageContainer from 'bundle-loader?lazy&name=[name]!../containers/homePageContainer';
import WeipageContainer from 'bundle-loader?lazy&name=[name]!../containers/weiPageContainer';
import ShopHomeContainer from 'bundle-loader?lazy&name=[name]!../containers/shopHomeContainer';
import RetailpageContainer from 'bundle-loader?lazy&name=[name]!../containers/retailPageContainer';
import redPacketContainer from 'bundle-loader?lazy&name=[name]!../containers/redPacketContainer';

import goodDetailsContainer from 'bundle-loader?lazy&name=[name]!../containers/goodDetailsContainer';
import PPLoginContainer from 'bundle-loader?lazy&name=[name]!../containers/PPLoginContainer';
import orderHomeContainer from 'bundle-loader?lazy&name=[name]!../containers/orderHomeContainer';
import searchContainer from 'bundle-loader?lazy&name=[name]!../containers/searchContainer';
import afterSaleContainer from 'bundle-loader?lazy&name=[name]!../containers/afterSaleContainer';
import refundsDetailList from 'bundle-loader?lazy&name=[name]!../containers/refundsDetailList';
import RefundProgress from 'bundle-loader?lazy&name=[name]!../containers/refundProgress';

import addressListContainer from 'bundle-loader?lazy&name=[name]!../containers/addressListContainer';
import paymentContainer from 'bundle-loader?lazy&name=[name]!../containers/paymentContainer';
import settlementContainer from 'bundle-loader?lazy&name=[name]!../containers/settlementContainer';
import settlement2Container from 'bundle-loader?lazy&name=[name]!../containers/settlementContainer2';
import EditReceiptAddress from 'bundle-loader?lazy&name=[name]!../views/shippingAddress/editReceiptAddress';
import PPShoppingCartContainer from 'bundle-loader?lazy&name=[name]!../containers/PPShoppingCartContainer';
import PPCollectContainer from 'bundle-loader?lazy&name=[name]!../containers/PPCollectContainer';
import ListGood from 'bundle-loader?lazy&name=[name]!../containers/listGoodsContainer';
import ListGoodShop from 'bundle-loader?lazy&name=[name]!../containers/listGoodsShopContainer';

import groupShoppingDetailContainer from 'bundle-loader?lazy&name=[name]!../containers/groupShoppingDetailContainer';
import commentListContainer from 'bundle-loader?lazy&name=[name]!../containers/commentListContainer';
import shopActivityContainer from 'bundle-loader?lazy&name=[name]!../containers/shopActivityContainer';
import orderTabList from 'bundle-loader?lazy&name=[name]!../containers/orderTabList';
import myOrderDetail from 'bundle-loader?lazy&name=[name]!../containers/orderDetailContainer';
import ApplyAfterSalesService from 'bundle-loader?lazy&name=[name]!../views/aftersales/ApplyAfterSalesService';
import logisticsDetail from 'bundle-loader?lazy&name=[name]!../views/aftersales/logisticsDetail';
import applyAfterSalesServiceSuccess from 'bundle-loader?lazy&name=[name]!../views/aftersales/applyAfterServiceSuccess';

import PPStoryBuyerContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryBuyerContainer';
import PPStoryDetailsBuyerContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryDetailsBuyerContainer';

import orderTabListShop from 'bundle-loader?lazy&name=[name]!../../app_retail/containers/orderTabList';
import myOrderDetailShop from 'bundle-loader?lazy&name=[name]!../../app_retail/containers/orderDetailContainer';

import chatView from 'bundle-loader?lazy&name=[name]!../containers/chatViewContainer'; //加载客服
import shopBriefContainer from 'bundle-loader?lazy&name=[name]!../containers/shopBriefContainer'; //店铺介绍
import feedBackContainer from 'bundle-loader?lazy&name=[name]!../containers/feedBackContainer'; // 投诉提交反馈
import uploadProofContainer from 'bundle-loader?lazy&name=[name]!../containers/uploadProofContainer'; // 上传证据
import search2Container from 'bundle-loader?lazy&name=[name]!../containers/search2Container'; //多店搜索
import searchResultContainer from 'bundle-loader?lazy&name=[name]!../containers/searchResultContainer'; //多店搜索结果
import CollectionContainer from 'bundle-loader?lazy&name=[name]!../containers/CollectionContainer'; //多店收藏

const HomePage = () => (
  //首页
  <Bundle load={HomepageContainer}>{(Component) => <Component />}</Bundle>
);
const WeiPage = () => (
  //首页
  <Bundle load={WeipageContainer}>{(Component) => <Component />}</Bundle>
);
const RetailPage = () => (
  //首页 - 分销
  <Bundle load={RetailpageContainer}>{(Component) => <Component />}</Bundle>
);

const ShopHome = () => (
  //多店购物首页
  <Bundle load={ShopHomeContainer}>{(Component) => <Component />}</Bundle>
);

const goodDetails = () => (
  <Bundle load={goodDetailsContainer}>{(Component) => <Component />}</Bundle>
);

const groupShoppingDetail = () => (
  <Bundle load={groupShoppingDetailContainer}>
    {(Component) => <Component />}
  </Bundle>
);

const PPLogin = () => (
  <Bundle load={PPLoginContainer}>{(Component) => <Component />}</Bundle>
);
const orderHome = () => (
  <Bundle load={orderHomeContainer}>{(Component) => <Component />}</Bundle>
);
const search = () => (
  //首页搜索
  <Bundle load={searchContainer}>{(Component) => <Component />}</Bundle>
);
const afterSale = () => (
  //售后
  <Bundle load={afterSaleContainer}>{(Component) => <Component />}</Bundle>
);
const refundsDetail = () => (
  <Bundle load={refundsDetailList}>{(Component) => <Component />}</Bundle>
);

const orderList = () => (
  <Bundle load={orderTabList}>{(Component) => <Component />}</Bundle>
);

const redPacket = () => (
  <Bundle load={redPacketContainer}>{(Component) => <Component />}</Bundle>
);

const orderDetail = () => (
  <Bundle load={myOrderDetail}>{(Component) => <Component />}</Bundle>
);

//订单列表商家版
const orderListShop = () => (
  <Bundle load={orderTabListShop}>{(Component) => <Component />}</Bundle>
);
//订单详情商家版
const orderDetailShop = () => (
  <Bundle load={myOrderDetailShop}>{(Component) => <Component />}</Bundle>
);

const refundProgress = () => (
  <Bundle load={RefundProgress}>{(Component) => <Component />}</Bundle>
);
//地址列表
const addressList = () => (
  <Bundle load={addressListContainer}>{(Component) => <Component />}</Bundle>
);
//付款
const payment = () => (
  <Bundle load={paymentContainer}>{(Component) => <Component />}</Bundle>
);
//下订单
const settlement = () => (
  <Bundle load={settlementContainer}>{(Component) => <Component />}</Bundle>
);
//下订单2
const settlement2 = () => (
  <Bundle load={settlement2Container}>{(Component) => <Component />}</Bundle>
);

//编辑地址
const editReceiptAddress = () => (
  <Bundle load={EditReceiptAddress}>{(Component) => <Component />}</Bundle>
);

// 购物车
const PPShoppingCart = () => (
  <Bundle load={PPShoppingCartContainer}>{(Component) => <Component />}</Bundle>
);
// 我的收藏
const collectManage = () => (
  <Bundle load={PPCollectContainer}>{(Component) => <Component />}</Bundle>
);

// 分组 分区 页面
const listGoods = () => (
  <Bundle load={ListGood}>{(Component) => <Component />}</Bundle>
);
const listGoodsShop = () => (
  <Bundle load={ListGoodShop}>{(Component) => <Component />}</Bundle>
);
// 评论列表
const commentList = () => (
  <Bundle load={commentListContainer}>{(Component) => <Component />}</Bundle>
);

const shopActivity = () => (
  <Bundle load={shopActivityContainer}>{(Component) => <Component />}</Bundle>
); //店铺活动

// 故事列表
const storyBuyerManages = () => (
  // 消费者
  <Bundle load={PPStoryBuyerContainer}>{(Component) => <Component />}</Bundle>
);

// 故事详情
const storyDetailsBuyerManages = () => (
  // 消费者

  <Bundle load={PPStoryDetailsBuyerContainer}>
    {(Component) => <Component />}
  </Bundle>
);
// 申请售后
const applyService = () => (
  <Bundle load={ApplyAfterSalesService}>{(Component) => <Component />}</Bundle>
);

//查看物流
const logistics = () => (
  <Bundle load={logisticsDetail}>{(Component) => <Component />}</Bundle>
);

// 申请售后成功
const applySuccess = () => (
  <Bundle load={applyAfterSalesServiceSuccess}>
    {(Component) => <Component />}
  </Bundle>
);

// 客服
const chatViews = () => (
  <Bundle load={chatView}>{(Component) => <Component />}</Bundle>
);

//  店铺介绍
const shopBrief = () => (
  <Bundle load={shopBriefContainer}>{(Component) => <Component />}</Bundle>
);

//  提交反馈
const feedBack = () => (
  <Bundle load={feedBackContainer}>{(Component) => <Component />}</Bundle>
);

//  上传证据
const uploadProof = () => (
  <Bundle load={uploadProofContainer}>{(Component) => <Component />}</Bundle>
);

//  多店搜索
const search2 = () => (
  <Bundle load={search2Container}>{(Component) => <Component />}</Bundle>
);

//  多店搜索列表
const searchResult = () => (
  <Bundle load={searchResultContainer}>{(Component) => <Component />}</Bundle>
);

//  多店收藏
const collection = () => (
  <Bundle load={CollectionContainer}>{(Component) => <Component />}</Bundle>
);

class RouteConfig extends Component {
  constructor(props) {
    super(props);
    this.theRequest = getValueFromUrl(location.search);
  }

  componentDidMount() {

  }
  render() {
    return (
      <Router>
        <ScrollToTop>
          <Switch>
            <Route
              exact
              path={`${contants.commonUrl}/index`}
              component={ShopHome}
            />
            <Route
              path={`${contants.commonUrl}/shopDetail`}
              component={HomePage}
            />
            <Route path={`${contants.commonUrl}/weiPage`} component={WeiPage} />
            <Route
              path={`${contants.commonUrl}/retailPage`}
              component={RetailPage}
            />
            <Route
              path={`${contants.commonUrl}/listGoods`}
              component={listGoods}
            />
            <Route
              path={`${contants.commonUrl}/listGoodsShop`}
              component={listGoodsShop}
            />
            <Route path={`${contants.commonUrl}/login`} component={PPLogin} />
            <Route
              path={`${contants.commonUrl}/orderHome`}
              component={orderHome}
            />
            <Route
              path={`${contants.commonUrl}/redPacket`}
              component={redPacket}
            />
            <Route
              path={`${contants.commonUrl}/goodDetails`}
              component={goodDetails}
            />
            <Route path={`${contants.commonUrl}/search`} component={search} />
            <Route
              path={`${contants.commonUrl}/refundsDetailList`}
              component={refundsDetail}
            />
            <Route
              path={`${contants.commonUrl}/refundProgress`}
              component={refundProgress}
            />
            <Route
              path={`${contants.commonUrl}/afterSale`}
              component={afterSale}
            />
            <Route
              path={`${contants.commonUrl}/addressList`}
              component={addressList}
            />
            <Route path={`${contants.commonUrl}/payment`} component={payment} />
            <Route
              path={`${contants.commonUrl}/settlement`}
              component={settlement}
            />
            <Route
              path={`${contants.commonUrl}/settlement2`}
              component={settlement2}
            />
            <Route
              path={`${contants.commonUrl}/editReceiptAddress`}
              component={editReceiptAddress}
            />
            <Route
              path={`${contants.commonUrl}/PPShoppingCart`}
              component={PPShoppingCart}
            />
            <Route
              path={`${contants.commonUrl}/collectManage`}
              component={collectManage}
            />
            <Route
              path={`${contants.commonUrl}/groupShoppingDetail`}
              component={groupShoppingDetail}
            />
            <Route
              path={`${contants.commonUrl}/commentList`}
              component={commentList}
            />
            <Route
              path={`${contants.commonUrl}/shopActivity`}
              component={shopActivity}
            />
            <Route
              path={`${contants.commonUrl}/orderList`}
              component={orderList}
            />
            <Route
              path={`${contants.commonUrl}/orderDetail`}
              component={orderDetail}
            />
            <Route
              path={`${contants.commonUrl}/orderListShop`}
              component={orderListShop}
            />
            <Route
              path={`${contants.commonUrl}/orderDetailShop`}
              component={orderDetailShop}
            />
            <Route
              path={`${contants.commonUrl}/storyBuyerManages`}
              component={storyBuyerManages}
            />
            <Route
              path={`${contants.commonUrl}/storyDetailsBuyerManages`}
              component={storyDetailsBuyerManages}
            />
            <Route
              path={`${contants.commonUrl}/applyService`}
              component={applyService}
            />
            <Route
              path={`${contants.commonUrl}/logistics`}
              component={logistics}
            />
            <Route
              path={`${contants.commonUrl}/applySuccess`}
              component={applySuccess}
            />
            <Route path={`${contants.commonUrl}/chatV`} component={chatViews} />
            <Route
              path={`${contants.commonUrl}/shopBrief`}
              component={shopBrief}
            />
            <Route
              path={`${contants.commonUrl}/feedBack`}
              component={feedBack}
            />
            <Route
              path={`${contants.commonUrl}/uploadProof`}
              component={uploadProof}
            />
            <Route path={`${contants.commonUrl}/search2`} component={search2} />
            <Route
              path={`${contants.commonUrl}/searchResult`}
              component={searchResult}
            />
            <Route
              path={`${contants.commonUrl}/collection`}
              component={collection}
            />
            <Redirect to={`${contants.commonUrl}/index`} component={ShopHome} />
            {/* <Redirect to={`${contants.commonUrl}/?shopId=${this.theRequest["shopId"]}`} /> */}
          </Switch>
        </ScrollToTop>
      </Router>
    );
  }
}
export default RouteConfig;
