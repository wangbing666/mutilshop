/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './orderHome.less';
import {wxShare} from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import SvgImg from "../../../common/svgImage/svgImg";
import * as contants from '../../../common/Apis/constants'
import {Modal,} from 'antd-mobile';
const alert = Modal.alert;
export default class OrderHome extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            viewStyDic: contants.viewStyDic,
        }
        this.shopId = 0;
        console.log("-------------------->",contants.viewStyDic);
    }
    //reader前
    componentWillMount(){
        if(db.userAgent()==='Android'){
            document.title='个人中心';
        }else{
            db.setPageTitle('个人中心');
        }
        const u = navigator.userAgent;
        let isWeidu = u.indexOf('wedo') > -1 ;
        this.setState({isWeidu}) //判断是否在app中，不在则不显示退出登录按钮
    }
    //在页面被渲染成功之后
    componentDidMount(){
        let theRequest = new Object();
        let strs= [];
        // let urls = location.search; //获取url中"?"符后的字串
        // if(urls.indexOf("?") !== -1) {
        //     let str = urls.substr(1);
        //     strs = str.split("&");
        //     for(let i = 0; i < strs.length; i++) {
        //         theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        //     }
        // }
        theRequest = db.getValueFromUrl();
        this.shopId = theRequest.shopId;

        wxShare([],{});
        const {OrderHome,OrderHomeActions}=this.props;
        let userInfo=db.readUserInfo();
        let url="/webOrder/getNumber";
        let data={
            userId:userInfo.wedoId,
            shopId:this.shopId
        };
        OrderHomeActions.orderNumber(url,data,()=>{},()=>{});
        window.removeEventListener("popstate",function () {
            console.log(222)
        },true)
    }
    //页面销毁
    componentWillUnmount(){
        const {OrderHome,OrderHomeActions}=this.props;
    }
    //1,待付款,2,待收货,3售后
    orderStatusNumber(status,orderNumber){
       if(orderNumber===null){
           return(
               <div></div>
           )
       }else if(status===1&&orderNumber.ispayment>0){
           return(
               <div className="statusNumber" style={{color:this.state.viewStyDic.COLOR3,backgroundColor:this.state.viewStyDic.COLOR1}}>{orderNumber.ispayment}</div>
           )
       }else if(status===2&&orderNumber.isgoods>0){
           return(
               <div className="statusNumber" style={{color:this.state.viewStyDic.COLOR3,backgroundColor:this.state.viewStyDic.COLOR1}}>{orderNumber.isgoods}</div>
           )
       }else if(status===3&&orderNumber.issales>0){
           return(
               <div className="statusNumber" style={{color:this.state.viewStyDic.COLOR3,backgroundColor:this.state.viewStyDic.COLOR1}}>{orderNumber.issales}</div>
           )
       }else {
           return(
               <div></div>
           )
       }
    };
    render() {
        const {OrderHome,OrderHomeActions}=this.props;
        let userInfo=db.readUserInfo();
        return (
            <div className="orderHome">
                <div className="orderHomeTop">
                    <div className="userInfo">
                        {/* <img src={userInfo.headUrl}/>
                        <span>ID:{userInfo.moblie}</span> */}
                         <img src={require("../../images/search/@1xGroup.png")}/>
                        <span>ID:1234567</span>
                    </div>
                </div>
                <div className="order-wrap">
                    <div className="myOrder" onClick={()=>{this.goMyOrder(3)}}>
                        <div className="myOrderLeft">
                            {/*<img className="jiantouImg" src={require('../../images/orderHome/orderTow.png')}/>*/}
                            <span className="orderListText">我的订单</span>
                        </div>
                        <div className="myOrderRight">
                            <span>查看全部订单</span>
                            <img className="jiantouImg" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                </div>
                <div className="orderStatus">
                    <div className="statusBody" onClick={()=>{this.goMyOrder(0)}}>
                        <SvgImg className="img" xlinkHref="#wedo-wedoicon-26" style={{fill:"#7F7F7F"}}/>
                        <span>待付款</span>
                        {this.orderStatusNumber(1,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goMyOrder(1)}}>
                        <SvgImg className="img" xlinkHref="#wedo-wedoicon-27" style={{fill:"#7F7F7F"}}/>
                        <span>待收货</span>
                        {this.orderStatusNumber(2,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goAfterSale()}}>
                        <SvgImg className="img" xlinkHref="#wedo-wedoicon-28" style={{fill:"#7F7F7F"}}/>
                        <span>我的售后</span>
                        {this.orderStatusNumber(3,OrderHome.orderNumber)}
                    </div>
                    <div className="statusBody" onClick={()=>{this.goMyOrder(2)}}>
                        <SvgImg className="img" xlinkHref="#wedo-wedoicon-29" style={{fill:"#7F7F7F"}}/>
                        <span>已完成</span>
                    </div>
                </div>
                <div className="myOList">
                    <div className="myCollectionBody" onClick={()=>this.goCollection()}>
                        <div className="myCollection myBorder">
                            <div className="myCLeft">
                                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-4" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                                <span className="orderListText">我的收藏</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                    <div className="myCollectionBody" onClick={()=>this.goShoppingCart()}>
                        <div className="myCollection myBorder">
                            <div className="myCLeft">
                                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-6" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                                <span className="orderListText">我的购物车</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                    <div className="myCollectionBody" onClick={()=>this.goAddress()}>
                        <div className="myCollection myBorder">
                            <div className="myCLeft">
                                {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-10" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                                <span className="orderListText">我的收货地址</span>
                            </div>
                            <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                        </div>
                    </div>
                    {
                        !this.state.isWeidu?
                            <div className="myCollectionBody" onClick={()=>this.logout()}>
                                <div className="myCollection myBorder">
                                    <div className="myCLeft">
                                        {/* <SvgImg className="jiantouImg" xlinkHref="#wedo-wedoicon-10" style={{fill:this.state.viewStyDic.COLOR1}}/> */}
                                        <span className="orderListText">退出登录</span>
                                    </div>
                                    <img className="jiantouImg myORight" src={require('../../images/orderHome/jiantouLift.png')}/>
                                </div>
                            </div>
                        :null
                    }
                </div>
            </div>
        )
    }
    //跳转我的订单页面
    goMyOrder(orderStatus){
        const {history}=this.props;
        // let url = contants.commonUrl+'listGoods/?groupId=52&type=1&shopId=1002'
        // history.push({
        //     pathname:url
        // })
        // return
        history.push({
            pathname:contants.commonUrl+'/orderList'+'/?shopId='+this.shopId+'&orderStatus='+orderStatus
        });

    };
    //跳转我的售后页面
    goAfterSale(){
        const {history}=this.props;
        history.push({
         pathname:contants.commonUrl+'/afterSale'
         });
    };
    //跳转我的收藏页面
    goCollection(){
        const {history}=this.props;
        history.push({
         pathname:contants.commonUrl+'/collection'+'/?shopId='+this.shopId
         });
    };
    //跳转购物袋页面
    goShoppingCart(){
        const {history}=this.props;
        history.push({
         pathname:contants.commonUrl+'/PPShoppingCart'+'/?shopId='+this.shopId
         });
    };
    //跳转地址页面
    goAddress(){
        //alert("我的地址");
        const {history}=this.props;
        history.push({
         pathname:contants.commonUrl+'/addressList'+'/?shopId='+this.shopId+'&pageType=orderHome',
            // state:{
            //     pageType:"orderHome"
            // }
         });
    }
    //退出登录
    logout(){
        let {OrderHomeActions,history} = this.props;
        let data={
            userId: "12491921"
        }
        alert('', '确定退出登录吗？', [
            { text: '取消', onPress: () => null },
            { text: '确定', onPress: () => {
                localStorage.removeItem('userInfo');
                document.cookie = 'CASTGC=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                let url = "/user/loginout";
                OrderHomeActions.logout(url,data,()=>{
                    history.replace({
                        pathname:contants.commonUrl+'/login/?shopId='+this.shopId
                    })
                });
            } }
        ])
    }
}
