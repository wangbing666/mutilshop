/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './payment.less';
//import {readUserInfo} from '../../../common/Apis/Utils';//获取用户信息
import {hex_md5} from './md5';
import {wxShare} from '../../../common/Apis/wxJsApis';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';//全局配置信息
import {Toast} from 'antd-mobile';
import * as weiduInteractive from '../../../common/Apis/weiduInteractive';
import * as fetch from '../../../common/Apis/Fetch'


export default class Payment extends Component {
    constructor(...args) {
        super(...args);
        //1 微信 2 支付宝 3 快捷支付 4 微度支付
        this.state={
            paymentMethod:4,
            weixinPayment:false
        }
        this.colorDic = contants.viewStyDic;
    }
    componentDidMount(){
        contants.isJumpToPayment=false;
        wxShare([],{});
        const {Payment,PaymentActions}=this.props;
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger') {
            this.setState({weixinPayment:true,paymentMethod:1});
        }else{

        }
    }
    componentWillMount(){
        if(db.userAgent()==='Android'){
            document.title='订单结算';
        }else{
            db.setPageTitle('订单结算');
        }
    }
    render() {
        let payment=this.props.location.state;
        return (
            <div className="payment">
                <div className="amountsPayable">
                    <span className="amountsPayableText">应付金额:</span>
                    <span className="moneyText">￥{payment.money}</span>
                </div>
                <div className="theWay">
                    {/* {this.state.weixinPayment?<div className="theWayList" onClick={()=>{this.choosePaymentMethods(1)}}>
                        <div className="theWayLeft">
                            <img src={require('../../images/payment/weixin.png')}/>
                            <span>微信支付</span>
                        </div>
                        <div className="theWayRight">
                            <img src={this.state.paymentMethod===1?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                        </div>
                    </div>:null} */}

                    <div className="theWayList" onClick={()=>{this.choosePaymentMethods(4)}}>
                        <div className="theWayLeft">
                            <img src={require('../../images/payment/CombinedShape.png')}/>
                            <span>微度支付</span>
                        </div>
                        <div className="theWayRight">
                            <img src={this.state.paymentMethod===4?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                        </div>
                    </div>
                    {/*<div className="theWayList" onClick={()=>{this.choosePaymentMethods(2)}}>
                     <div className="theWayLeft">
                     <img src={require('../../images/payment/zhifubao@1x.png')}/>
                     <span>支付宝支付</span>
                     </div>
                     <div className="theWayRight">
                     <img src={this.state.paymentMethod===2?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                     </div>
                     </div>*/}
                    {/* <div className="theWayList" onClick={()=>{this.choosePaymentMethods(3)}}>
                     <div className="theWayLeft">
                     <img src={require('../../images/payment/kuaijie.png')}/>
                     <span>快捷支付</span>
                     </div>
                     <div className="theWayRight">
                     <img src={this.state.paymentMethod===3?require('../../images/payment/b31@1x.png'):require('../../images/payment/b32@1x.png')}/>
                     </div>
                     </div>*/}
                </div>
                {/*<div>
                 <input type="text" id="orderNo" style={{height:'90px',width:'200px'}} />
                 </div>*/}
                <div className="paymentBottom">
                    <button style={{backgroundColor:this.colorDic['COLOR1'],color:this.colorDic['COLOR3']}} onClick={()=>{this.choicePayment()}}>确定</button>
                </div>
                <div id="PAscreenBody" className="PAscreenBody hide">
                    <div className="loadingView">
                        <div className="loadingImg"></div>
                    </div>
                </div>
            </div>
        )
    }
    callPayment(){
       
        const {Payment,PaymentActions}=this.props;
        let url="/webOrder/payResult";
        let data={
            orderId:this.props.location.state.orderId
        };
        PaymentActions.payment(url,data,()=>{},()=>{});
    };
    //选择支付方式支付
    choicePayment(){
        // 1:微信支付  2：支付宝支付   3：快捷支付  4：微度支付
        window.sessionStorage.removeItem('top');
        if(this.state.paymentMethod===1){
            this.transactionNumber();
        }else if(this.state.paymentMethod===2){
            this.twoCodePayment();
        }else if(this.state.paymentMethod===3){
            this.quickPayment();
        }else {
            this.weiduPayment();
        }
    };
    //获取订单编号接口微信支付
    transactionNumber(){
        let payment=this.props.location.state;
        const {Payment,PaymentActions}=this.props;
        let url="/wallet/createTradeOrderNo";
        let userInfo=db.readUserInfo();
        let data={
            userId:userInfo.userId,
            orderId:this.props.location.state.orderId,//订单编号
            amount:payment.money,//金额
            //amount:0.01,//金额
            billType:3//付款方式
        };



        let shopId = this.props.location.state.shopId;
        let orderId = this.props.location.state.orderId;
        let orderSonId = this.props.location.state.sonOrderId;
        let shopUrl = contants.commonServerUrlRetail+'/?shopId='+shopId;
        if(this.props.location.state.buyType==0) {
            shopUrl = contants.commonServerUrlRetail + '/groupShoppingDetail/?shopId=' + shopId + '~orderId=' + orderId + '~orderSonId=' + orderSonId;
        }
        document.getElementById("PAscreenBody").className="PAscreenBody show";
        PaymentActions.transactionNumber(url,data,(data)=>{
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
            //2120161014152406001
            if(data.status===0){//         测试商户 2120160922184756001  1qaz2wsx   正式商户   2120161014152406001  kb201610171300#!!!
                window.sessionStorage.setItem('orderNo',data.body.orderNo);
                //window.sessionStorage.setItem('top',2000);


                let Mac=hex_md5("accountId=2120161014152406001&orderId="+data.body.orderNo+
                    "&commodity=DianBaoShop&amount="+payment.money+"&responseUrl="+data.body.callbackAddress+
                    "&subject=DianBaoShop&wechatappid=wx7a6fefa54a1dfe06&wechatappidpwd=b2720b3f4c5cccb8f40ba877da9030c6"+//微信公众号信息
                    "&returnPage="+shopUrl+"&key=kb201610171300#!!!").toUpperCase();
                let weixiUrl=contants.wechatPayUrl+"applyWXCodePayKabao?accountId=2120161014152406001&orderId="+data.body.orderNo+
                    "&commodity=DianBaoShop&amount="+payment.money+"&responseUrl="+data.body.callbackAddress+
                    "&subject=DianBaoShop&wechatappid=wx7a6fefa54a1dfe06&wechatappidpwd=b2720b3f4c5cccb8f40ba877da9030c6"+
                    "&returnPage="+shopUrl+"&mac="+Mac;

                window.location.href=weixiUrl;
            }else {
                Toast.info(data.msg, 2);
            }
        },(err)=>{
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
        });
    };
    //选择支付方式
    choosePaymentMethods(paymentMethod){
        this.setState({paymentMethod:paymentMethod});
    };
    //二维码支付支付宝支付
    twoCodePayment(){
        let payment=this.props.location.state;
        const {Payment,PaymentActions}=this.props;
        let userInfo=db.readUserInfo();
        let url="/wallet/applyScanCode";
        let paymentData={
            userId:userInfo.userId,
            payType:1,//支付类型1:支付宝;2:微信;3:银联
            orderId:this.props.location.state.orderId,
            commodity:"MOYAHEE",//商品信息
            amount:payment.money//金额
        };
        document.getElementById("PAscreenBody").className="PAscreenBody show";
        PaymentActions.CallPayment(url,paymentData,(response)=>{
            console.log(response);
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
            if(response.body.resultCode==="0000"){
                window.location.href=response.body.qrcode;
            }else {
                Toast.info(response.body.resultMsg, 2);
            }
        },(err)=>{
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
            Toast.info("请求失败", 2);
        });
    };
    //快捷支付
    quickPayment(){
        let payment=this.props.location.state;
        const {Payment,PaymentActions}=this.props;
        let url="/wallet/createTradeOrderNo";
        let userInfo=db.readUserInfo();
        let data={
            userId:userInfo.userId,
            orderId:this.props.location.state.orderId,//订单编号
            amount:payment.money,//金额
            billType:1//1：快捷支付
        };
        document.getElementById("PAscreenBody").className="PAscreenBody show";
        PaymentActions.transactionNumber(url,data,(data)=>{
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
            console.log(data.status);
            if(data.status===0){
                let Mac=hex_md5("accountId=2120161014152406001&customerId="+userInfo.userId+"&orderNo="+data.body.orderNo
                    +"&commodityName=MOYAHEE&amount="+payment.money+"&responseUrl="+data.body.callbackAddress+"&pageResponseUrl=http://myh.unspay.com&key=kb201610171300#!!!").toUpperCase();
                let quickPayment="http://wap.unspay.com:8082/quickpay-front/quickPayWap/prePay?accountId=2120161014152406001&customerId="+userInfo.userId+"&orderNo="+data.body.orderNo+
                    "&commodityName=MOYAHEE&amount="+payment.money+"&responseUrl="+data.body.callbackAddress+"&pageResponseUrl=http://myh.unspay.com&mac="+Mac;
                window.location.href=quickPayment;
            }else {
                Toast.info(data.msg, 2);
            }
        },(err)=>{
            document.getElementById("PAscreenBody").className="PAscreenBody hide";
        });
    };
    //微度支付
    weiduPayment(){
        
        let payment=this.props.location.state;

        const {Payment,PaymentActions}=this.props;
        let userInfo=db.readUserInfo();
        let Appneeddata = null;
        if(!payment.secondPayMap){//如果不是 第二次下单
            Appneeddata = payment.appNeedData
        }else{
            Appneeddata = payment.secondPayMap
        }
        // let Appneeddata = payment.appNeedData;

        let data={
            // userId:userInfo.wedoId,
            userId:userInfo.userId,
            orderId:this.props.location.state.orderId,//订单编号
            amount:payment.money,//金额
            //amount:0.01,//金额
            billType:5//付款方式   5：微度支付
        };
        document.getElementById("PAscreenBody").className="PAscreenBody show";//loading效果
        let shopId = this.props.location.state.shopId;
        // console.log(this.props)
        let orderId = this.props.location.state.orderId;

        let orderSonId = this.props.location.state.sonOrderId;
        let shopUrl = contants.commonServerUrlRetail+'/?shopId='+shopId;
        let goodType = 0; //0 普通商品  1 团购商品
        
        let orderDetailUrl = contants.commonServerUrlRetail+'/orderDetail/?orderId='+orderId.toString()+'&orderSonId=' +
            orderSonId+'&shopId='+shopId  ////订单详情url

        // console.log("orderDetailUrl is" +orderDetailUrl)


        // console.log('buy type is '+this.props.location.state.buyType)
        if(this.props.location.state.buyType==0){
            shopUrl=contants.commonServerUrlRetail+'/groupShoppingDetail/?shopId='+shopId+'&orderId='+orderId+'&orderSonId='+orderSonId;
            goodType = 1;
        }

        console.log("分销店首页",shopUrl)
        console.log("分销店详情页",shopUrl)

        document.getElementById("PAscreenBody").className="PAscreenBody hide";

        // let paymentData={
        //     orderNumber:this.props.location.state.orderNumber,//订单编号
        //     money:payment.money,//订单金额
        //     // userId:userInfo.wedoId,//微度的userId
        //     userId:userInfo.userId,//微度的userId
        //     enterpriseName:contants.shopInfo.shopName,
        //     shopUrl:shopUrl,
        //     orderId:this.props.location.state.orderId.toString(),
        //     stockUrl:fetch.commonUrl+"/webOrder/getGooodsStockByOrderId",
        // };


        // if(!payment.secondPayMap){
        //     alert("再次购买！")
        //     return false;
        // }

        let paymentData={
            shopUrl:shopUrl,
            platformNo:Appneeddata.platformNo,
            orderNo:Appneeddata.orderNumber,//订单编号
            amount:Appneeddata.amount,
            fee:Appneeddata.fee,//手续费
            remark:Appneeddata.remark,//主订单备注
            goodsName:Appneeddata.goodsName,//商品名称
            goodsCategory:Appneeddata.goodsCategory,//商品类别
            paymentItemList:Appneeddata.paymentItemList,//支付项目（子订单）列表

            goodType:goodType,//0普通商品，1团购商品
            orderDetailUrl:orderDetailUrl, //订单详情
            userId:userInfo.userId, //userID
        };
        //console.log(paymentData,'121212');
        this.weiduPaymentTow(paymentData);
    };

    weiduPaymentTow(paymentData){
        // alert('qqq');
        let pla=weiduInteractive.ismobile(1);
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/kaBao_UU_Wedo/i)=="kabao_uu_wedo") {
            //console.log("在微度外");
            if(pla === 1) {
                //alert('adnroid');
                window.business.shoppingInJSToPayMoney(JSON.stringify(paymentData));
            } else if(pla === 0) {
                //alert('ios');
                window.webkit.messageHandlers.shoppingInJSToPayMoney.postMessage(JSON.stringify(paymentData));
            }
        }else{
            const {Payment,PaymentActions}=this.props;
            let Url="/wallet/encryption";
           
            PaymentActions.encryption(Url,{code:JSON.stringify(paymentData)},(data)=>{
                console.log(data.body.desCode);
                weiduInteractive.weiduOpenUrl(data.body.desCode);
            },(err)=>{
                console.log(err);
            });
            //console.log("在微度外");
        }
    }

}