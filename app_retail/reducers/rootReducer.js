/**
 * Created by chenmao on 2016/11/29.
 *
 * 合并reducer
 */
//import { combineReducers } from 'redux';不使用immutable
import {combineReducers} from 'redux-immutable';//使用immutable
import HomePage  from "./homePageReducer.js";//首页
import GoodDetails from "./goodDetailsReducer"
import AddressList from './addressListReducer'
import Payment from './paymentReducers'
import Settlement from './settlementReducer'
import PPLoginReducer from './PPLoginReducer'; // 登陆
import OrderHome from './orderHomeReducer.js'//订单首页入口页面
import afterSale from '../../app/reducers/afterSalesReducer';
import PPShoppingCartReducer  from './PPShoppingCartReducer'; // 购物袋
import PPCollectReducer from './PPCollectReducer';    //我的收藏列表

import GroupShoppingDetail from "./groupShoppingDetailReducer"; //拼团详情
import OrderTab from './myOrderListReducer'
import Search from '../../app/reducers/searchReducer.js';//搜索页面

import StoryReducer from './PPStoryReducer';        // 我的故事列表
import storyDetails from './PPStoryDetailsReducer';
import commentList from "../../app/reducers/commentListReducer"; //评论列表
import Chat from "../../app/reducers/chatViewReducer"; //客服

import shopBriefReducer from "./shopBriefReducer";
import feedBackReducer from "./feedBackReducer";
import uploadProofReducer from "./uploadProofReducer";


let rootReducer = combineReducers({
    HomePage: HomePage,
    GoodDetails:GoodDetails,
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
    StoryReducer,
    storyDetails,
    commentList,
    Chat,
    shopBriefReducer,
    feedBackReducer,
    uploadProofReducer,
})


export default rootReducer;




