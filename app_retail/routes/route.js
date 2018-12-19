/**
 * Created by chenmao on 2017/6/28.
 */
import React, {Component, PropTypes} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from 'react-router-dom';
import {Toast} from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
import ScrollToTop from '../../common/components/ScrollToTop'
import * as Util from '../../common/Apis/Fetch';
import  {addShopHitHand} from '../../common/Apis/Utils'
/*
*实现按需加载文件
* */
import Bundle from '../views/bundle.js';




//同步载入
import {getValueFromUrl} from '../../common/Apis/Utils'
//异步载入
import HomePageContainer from 'bundle-loader?lazy&name=[name]!../containers/homePageContainer';

import goodDetailsContainer from 'bundle-loader?lazy&name=[name]!../containers/goodDetailsContainer';
import wdGoodDetailsContainer from 'bundle-loader?lazy&name=[name]!../containers/WDGoodDetailsContainer';
import flagGoodDetailsContainer from 'bundle-loader?lazy&name=[name]!../containers/flagGoodDetailsContainer';
import PPLoginContainer from 'bundle-loader?lazy&name=[name]!../containers/PPLoginContainer';
import orderHomeContainer from 'bundle-loader?lazy&name=[name]!../containers/orderHomeContainer';
import searchContainer from 'bundle-loader?lazy&name=[name]!../../app/containers/searchContainer';
import afterSaleContainer from 'bundle-loader?lazy&name=[name]!../../app/containers/afterSaleContainer';
import refundsDetailList from 'bundle-loader?lazy&name=[name]!../containers/refundsDetailList';
import RefundProgress from 'bundle-loader?lazy&name=[name]!../containers/refundProgress';

import addressListContainer from 'bundle-loader?lazy&name=[name]!../containers/addressListContainer';
import paymentContainer from 'bundle-loader?lazy&name=[name]!../containers/paymentContainer';
import settlementContainer from 'bundle-loader?lazy&name=[name]!../containers/settlementContainer';
import EditReceiptAddress from 'bundle-loader?lazy&name=[name]!../views/shippingAddress/editReceiptAddress';
import PPShoppingCartContainer from 'bundle-loader?lazy&name=[name]!../containers/PPShoppingCartContainer';
import PPCollectContainer from 'bundle-loader?lazy&name=[name]!../containers/PPCollectContainer';
import orderTabList from 'bundle-loader?lazy&name=[name]!../../app/containers/orderTabList';
import myOrderDetail from 'bundle-loader?lazy&name=[name]!../../app/containers/orderDetailContainer';
import PPStoryContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryContainer';
import PPStoryDetailsContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryDetailsContainer';




import groupShoppingDetailContainer from 'bundle-loader?lazy&name=[name]!../containers/groupShoppingDetailContainer';
import ApplyAfterSalesService from "bundle-loader?lazy&name=[name]!../views/aftersales/ApplyAfterSalesService";
import logisticsDetail from "bundle-loader?lazy&name=[name]!../views/aftersales/logisticsDetail";
import applyAfterSalesServiceSuccess from "bundle-loader?lazy&name=[name]!../views/aftersales/applyAfterServiceSuccess";
import PPStoryDetailsBuyerContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryDetailsBuyerContainer';
import PPStoryBuyerContainer from 'bundle-loader?lazy&name=[name]!../containers/PPStoryBuyerContainer'
import commentListContainer from 'bundle-loader?lazy&name=[name]!../../app/containers/commentListContainer';

import orderTabListShop from 'bundle-loader?lazy&name=[name]!../containers/orderTabList';
import myOrderDetailShop from 'bundle-loader?lazy&name=[name]!../containers/orderDetailContainer';
import chatView from 'bundle-loader?lazy&name=[name]!../../app/containers/chatViewContainer';//加载客服

import shopBriefContainer from 'bundle-loader?lazy&name=[name]!../containers/shopBriefContainer'; //店铺介绍
import feedBackContainer from "bundle-loader?lazy&name=[name]!../containers/feedBackContainer"; // 投诉提交反馈
import uploadProofContainer from "bundle-loader?lazy&name=[name]!../containers/uploadProofContainer"; // 上传证据
import unpackageListContainer from "bundle-loader?lazy&name=[name]!../../app/containers/unpackageListContainer";// 订单详情查看物流未打包商品列表

//商品详情
const HomePage = () => (
    <Bundle load={HomePageContainer}>
        {(Component) => <Component />}
    </Bundle>
)

//商品详情
const goodDetails = () => (
    <Bundle load={goodDetailsContainer}>
        {(Component) => <Component />}
    </Bundle>
)
//微度小店商品详情
const wdGoodDetails = () => (
    <Bundle load={wdGoodDetailsContainer}>
        {(Component) => <Component />}
    </Bundle>
)
//旗舰店商品详情
const flagGoodDetails = () => (
    <Bundle load={flagGoodDetailsContainer}>
        {(Component) => <Component />}
    </Bundle>
)

const groupShoppingDetail = () => (
    <Bundle load={groupShoppingDetailContainer}>
        {(Component) => <Component />}
    </Bundle>
)

const PPLogin = () => (
    <Bundle load={PPLoginContainer}>
        {(Component) => <Component />}
    </Bundle>
)
const orderHome = () => (
    <Bundle load={orderHomeContainer}>
        {(Component) => <Component />}
    </Bundle>
)
const  search= () => (
    <Bundle load={searchContainer}>
        {(Component) => <Component />}
    </Bundle>
)
const  afterSale= () => (
    <Bundle load={afterSaleContainer}>
        {(Component) => <Component />}
    </Bundle>
)
const refundsDetail= () => (
    <Bundle load={refundsDetailList}>
        {(Component) => <Component />}
    </Bundle>
)
 //地址列表
 const  addressList= () => (
     <Bundle load={addressListContainer}>
         {(Component) => <Component />}
     </Bundle>
 )
 //编辑地址
 const  editReceiptAddress= () => (
     <Bundle load={EditReceiptAddress}>
         {(Component) => <Component />}
     </Bundle>
 )
const refundProgress= () => (
    <Bundle load={RefundProgress}>
        {(Component) => <Component />}
    </Bundle>
)

//付款
const  payment= () => (
    <Bundle load={paymentContainer}>
        {(Component) => <Component />}
    </Bundle>
)
//下订单
const  settlement= () => (
    <Bundle load={settlementContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 购物车
const  PPShoppingCart= () => (
    <Bundle load={PPShoppingCartContainer}>
        {(Component) => <Component />}
    </Bundle>
)
// 我的收藏
const  collectManage= () => (
    <Bundle load={PPCollectContainer}>
        {(Component) => <Component />}
    </Bundle>
)

const  orderList= () => (
    <Bundle load={orderTabList}>
        {(Component) => <Component />}
    </Bundle>
)

const  orderDetail= () => (
    <Bundle load={myOrderDetail}>
        {(Component) => <Component />}
    </Bundle>
)
//订单列表商家版
const  orderListShop= () => (
    <Bundle load={orderTabListShop}>
        {(Component) => <Component />}
    </Bundle>
)
//订单详情商家版
const  orderDetailShop= () => (
    <Bundle load={myOrderDetailShop}>
        {(Component) => <Component />}
    </Bundle>
)
// 故事详情
const storyDetailsManage = ()=>(   // 卖家

    <Bundle load={PPStoryDetailsContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 故事列表
const storyManage = ()=>(        // 卖家
    <Bundle load={PPStoryContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 申请售后
const applyService = ()=>(


    <Bundle load={ApplyAfterSalesService}>
        {(Component) => <Component />}
    </Bundle>
)

//查看物流
const logistics = ()=>(

    <Bundle load={logisticsDetail}>
        {(Component) => <Component />}
    </Bundle>
)

// 申请售后成功
const applySuccess = ()=>(

    <Bundle load={applyAfterSalesServiceSuccess}>
        {(Component) => <Component />}
    </Bundle>
)

// 故事详情
const storyDetailsBuyerManage = ()=>(   // 消费者

    <Bundle load={PPStoryDetailsBuyerContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 故事列表
const storyBuyerManage = ()=>(        // 消费者
    <Bundle load={PPStoryBuyerContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 评论列表
const  commentList= () => (
    <Bundle load={commentListContainer}>
        {(Component) => <Component />}
    </Bundle>
)

// 客服
const chatViews = ()=>(
    <Bundle load={chatView}>
        {(Component) => <Component />}
    </Bundle>
)

//  店铺介绍
const shopBrief = () => (
    <Bundle load={shopBriefContainer}>
        {(Component) => <Component />}
    </Bundle>
)

//  提交反馈
const feedBack = () => (
    <Bundle load={feedBackContainer}>
        {(Component) => <Component />}
    </Bundle>
)

//  上传证据
const uploadProof = () => (
    <Bundle load={uploadProofContainer}>
        {(Component) => <Component />}
    </Bundle>
)

//  未打包商品列表
const unpackageList = () => (
    <Bundle load={unpackageListContainer}>
        {(Component) => <Component />}
    </Bundle>
)

class RouteConfig extends Component {
    constructor(props) {
        super(props);
        var localUrl = location.search; //获取url中"?"符后的字串
        if(localUrl&&localUrl.length>0){
            this.theRequest = getValueFromUrl(localUrl);
        }
        else{
            this.theRequest = {shopId:0}

        }

    }

    componentDidMount() {
        //获取店铺简要信息
        let theRequest = this.theRequest;
        let subUrl ='/cloudShop/getDisShopInfo';
        let shopId=theRequest['shopId'];
        if(!shopId){
            return;
        }
        Util.post(subUrl,{shopId:shopId}, (response) => {
            if(response.status===0){
                contants.shopInfo=response.body.shopBaseInfo;
                contants.shopInfo.shopId=shopId;
                contants.shopInfo.shareUrl = contants.commonServerUrlRetail+'/?shopId='+theRequest['shopId'];
                contants.shareShopImgUrl=response.body.shopBaseInfo.logoUrl;
            }else{
                Toast.info(response.msg, 2);
            }
        }, (error) => {
            Toast.info('网络失败', 2);
        });
        //点击量处理
        addShopHitHand(shopId)
    }
    render(){
        return(
            <Router>
                <ScrollToTop>
                    <Switch>
                        <Route exact path={`${contants.commonUrl}/`} component={HomePage}></Route>
                        <Route  path={`${contants.commonUrl}/login`} component={PPLogin}></Route>
                        <Route  path={`${contants.commonUrl}/orderHome`} component={orderHome}></Route>
                        <Route  path={`${contants.commonUrl}/goodDetails`} component={goodDetails}></Route>
                        <Route  path={`${contants.commonUrl}/wdGoodDetails`} component={wdGoodDetails}></Route>
                        <Route  path={`${contants.commonUrl}/flagGoodDetails`} component={flagGoodDetails}></Route>
                        <Route  path={`${contants.commonUrl}/search`} component={search}></Route>
                        <Route path={`${contants.commonUrl}/refundsDetailList`} component={refundsDetail} />
                        <Route path={`${contants.commonUrl}/refundProgress`} component={refundProgress}/>
                        <Route path={`${contants.commonUrl}/afterSale`} component={afterSale}></Route>
                        <Route  path={`${contants.commonUrl}/addressList`} component={addressList}></Route>
                        <Route path={`${contants.commonUrl}/editReceiptAddress`} component={editReceiptAddress}></Route>
                        <Route  path={`${contants.commonUrl}/payment`} component={payment}></Route>
                        <Route path={`${contants.commonUrl}/settlement`} component={settlement}></Route>
                        <Route  path={`${contants.commonUrl}/PPShoppingCart`} component={PPShoppingCart}></Route>
                        <Route  path={`${contants.commonUrl}/collectManage`} component={collectManage}></Route>
                        <Route  path={`${contants.commonUrl}/groupShoppingDetail`} component={groupShoppingDetail}></Route>
                        <Route  path={`${contants.commonUrl}/orderList`} component={orderList}></Route>
                        <Route  path={`${contants.commonUrl}/orderDetail`} component={orderDetail}></Route>
                        <Route  path={`${contants.commonUrl}/orderListShop`} component={orderListShop}></Route>
                        <Route  path={`${contants.commonUrl}/orderDetailShop`} component={orderDetailShop}></Route>
                        <Route  path={`${contants.commonUrl}/storyManage`} component={storyManage}></Route>
                        <Route  path={`${contants.commonUrl}/storyDetailsManage`} component={storyDetailsManage}></Route>
                        <Route  path={`${contants.commonUrl}/logistics`} component={logistics}></Route>
                        <Route  path={`${contants.commonUrl}/storyBuyerManage`} component={storyBuyerManage}></Route>
                        <Route  path={`${contants.commonUrl}/storyDetailsBuyerManage`} component={storyDetailsBuyerManage}></Route>
                        <Route  path={`${contants.commonUrl}/applySuccess`} component={applySuccess}></Route>
                        <Route  path={`${contants.commonUrl}/applyService`} component={applyService}></Route>
                        <Route  path={`${contants.commonUrl}/commentList`} component={commentList}></Route>
                        <Route  path={`${contants.commonUrl}/chatV`} component={chatViews}></Route>
                        <Route  path={`${contants.commonUrl}/shopBrief`} component={shopBrief} />
                        <Route  path={`${contants.commonUrl}/feedBack`} component={feedBack} />
                        <Route  path={`${contants.commonUrl}/uploadProof`} component={uploadProof} />
                        <Route path={`${contants.commonUrl}/unpackageList`} component={unpackageList} />
                        <Redirect to={`${contants.commonUrl}/?shopId=${this.theRequest['shopId']}`} />
                    </Switch>
                </ScrollToTop>
            </Router>
        )
    }
}

export default RouteConfig;