/**
 * Created by chenmao on 2016/11/29.
 *
 * 合并reducer
 */
//import { combineReducers } from 'redux';不使用immutable
import {combineReducers} from 'redux-immutable';//使用immutable
import HomePage  from "./homePageReducer.js";//首页
import RetailPage  from "./retailPageReducer.js";//首页--分销
import GoodDetails from "./goodDetailsReducer"
import AddressList from './addressListReducer'
import Payment from './paymentReducers'
import Settlement from './settlementReducer'
import PPLoginReducer from './PPLoginReducer'; // 登陆
import OrderHome from './orderHomeReducer.js'//订单首页入口页面
import afterSale from './afterSalesReducer';//售后
import PPShoppingCartReducer  from './PPShoppingCartReducer'; // 购物袋
import PPCollectReducer from './PPCollectReducer';    //我的收藏列表
import ListGoods from './listGoodsReducer.js';//分区/分组 列表
import GroupShoppingDetail from "./groupShoppingDetailReducer"; //拼团详情
import commentList from "./commentListReducer"; //评论列表

import OrderTab from './myOrderListReducer';
import Search from './searchReducer.js';//搜索页面

import StoryReducer from './PPStoryReducer';        // 我的故事列表
import storyDetails from './PPStoryDetailsReducer';

import  shopActivity from './shopActivityReducer'
import Chat from './chatViewReducer';

import shopBriefReducer from './shopBriefReducer';
import feedBackReducer from './feedBackReducer';
import uploadProofReducer from './uploadProofReducer';
import Search2 from './search2Reducer'; //多店搜索
import SearchResult from './searchResultReducer'; //多店搜索结果页
import Collection from './CollectionReducer'; //多店收藏

import shopHomeReducer from './shopHomeReducer';

let rootReducer = combineReducers({
    HomePage,
    RetailPage,
    shopHomeReducer,
    GoodDetails,
    Search,
    OrderHome,
    PPLoginReducer,
    afterSale,
    AddressList,
    Payment,
    Settlement,
    PPShoppingCartReducer,
    PPCollectReducer,
    GroupShoppingDetail,
    OrderTab,
    storyDetails,
    ListGoods,
    commentList,
    StoryReducer,
    shopActivity,
    Chat,
    shopBriefReducer,
    feedBackReducer,
    uploadProofReducer,
    Search2,
    SearchResult,
    Collection
})


export default rootReducer;




