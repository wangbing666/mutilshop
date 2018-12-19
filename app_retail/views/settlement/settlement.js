/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './settlement.less';
import SCommodity from './settlementCommodity';//商品列表
import { Picker,Button,Modal} from 'antd-mobile';
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
let repetitionClick = false;//禁止重复点击的标签
const alert=Modal.alert;
   //送货时间
   let district=[{
     label: '随时',
     value: '1'
   }, {
         label: '工作日',
         value: '2'
     }, {
           label: '非工作日',
           value: '3'
       }];
const CustomChildren = props => (
    <div onClick={props.onClick} className="address settlementList">
        <label className="addressText">{props.children}</label>
        <div className="addressRight">
            <label>{props.extra}</label>
            <img src={require('../../images/settlement/arrowRight.png')}/>
        </div>
    </div>
);
export default class Settlement extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            district: district,
            isLoading: true,
            pickerText:contants.createOrderData.lastCreateOrderRequestData?[contants.createOrderData.lastCreateOrderRequestData.sendType.toString()]:'',
            pickerValue:null,
            unsaved:true,
            isShow:false,
            selectAddress:null,
            Msg:contants.createOrderData.lastCreateOrderRequestData?contants.createOrderData.lastCreateOrderRequestData.leaveMsg:'',
    };
            this.colorDic = contants.viewStyDic;
    }
    //页面渲染前
    componentWillMount(){
        if(db.userAgent()==='Android'){
            document.title='订单结算';
        }else{
            db.setPageTitle('订单结算');
        }
    }
    componentWillUnmount(){
        repetitionClick = false;
        // contants.addressInfo=null;
        this.props.SettlementActions.defaultAddressData(null);
        if(contants.alertInstance){
            contants.alertInstance.close();
        }
    }
    componentDidMount(){
        const {SettlementActions}=this.props;
        let userInfo=db.readUserInfo();
        let data={
            userId:userInfo.userId
        };
        wxShare([],{});
        if(!contants.addressInfo){
            SettlementActions.defaultAddress("/adress/getAddress",data,()=>{},()=>{});
        }
        let h=$(window).height();
        $(window).resize(function() {
            if($(window).height()<h){
                $('.settlementbottrom').hide();
            }
            if($(window).height()>=h){
                $('.settlementbottrom').show();
            }
        });
    }
    //是否回到上个页面
    goPreviousPage(){
        this.props.history.goBack();
    };
    getPrice(param){
        const { state }=this.props.location;
        const  {goodInfo}=state;
        let price=0;
        goodInfo.map((val,i)=>{
            if(param == 2){
                price+=Number(val.oriPrice)*Number(val.number);
            }else {
                price+=Number(val.price)*Number(val.number);
            }
        });
        let priceArr=String(price).split('.');
        return priceArr.length>1?price.toFixed(2):price;
    }
    render() {
        const {Settlement}=this.props;
        const { state }=this.props.location;
        const  {goodInfo}=state;
        let that=this;
        let AddressData=contants.addressInfo?contants.addressInfo:Settlement.defaultAddress;
        return (
            <div className="settlementBody">
                {AddressData===null?<div className="address settlementList" onClick={()=>{this.goAddress()}}>
                    <label className="addressText">选择收货地址</label>
                    <div className="addressRight">
                        <label></label>
                        <img src={require('../../images/settlement/arrowRight.png')}/>
                    </div>
                </div>: <div className="chooseAddressContainer" onClick={()=>{this.goAddress()}}>
                    <div className="chooseAddress">
                        <div className="chooseAddress_l">
                            <img src={require('../../images/settlement/b24@1x.png')} />
                            <p>
                                <span>{`收件人:${AddressData.receiveName}  ${AddressData.phone}`}</span>
                                <span>{AddressData.shopAdress}</span>
                            </p>
                        </div>
                        <img src={require('../../images/settlement/arrowRight.png')}/>
                    </div>
                </div>}
                <div className="commodityList">
                    <div className="commodityListTitle">
                        <label>{goodInfo[0].shopName}</label>
                    </div>
                    <div>
                        {goodInfo.map((val,i)=>{
                            return(
                                <SCommodity goodInfo={val} key={i}/>
                            )
                        })}
                    </div>
                </div>
                <div className="division"></div>
                <Picker
                    data={this.state.district}
                    extra="随时"
                    cols={1}
                    value={this.state.pickerText}
                    onChange={v => {this.setState({ pickerText: v });}}
                >
                    <CustomChildren>送货时间</CustomChildren>
                </Picker>
                <div className="division"></div>
                <div className="settlementList leaveMessage">
                    <input type="text" ref="inp" placeholder="买家留言" maxLength="20" onChange={(e)=>this.setMsg(e)} value={this.state.Msg}/>
                    {this.state.Msg?
                        <span onClick={()=>{this.removeText()}} style={{background:'white'}}>
                            <img src={require('../../images/shippingAddress/n6@1x.png')} />
                        </span>:null
                    }

                </div>
                <div className="settlementbottrom bottom">
                    <div className="Sleft">
                        <span>{`总计:￥${this.getPrice(1)}`}</span>
                    </div>
                    <button onClick={()=>{this.goPayment()}} style={{background: this.colorDic['COLOR1'],color: this.colorDic['COLOR3']}}>去支付</button>
                </div>
                {Settlement.isShowLoading?<div className="loadingView"><div className="loadingImg"></div></div>:null}
            </div>
        )
    }
    setMsg(e){
        this.setState({
            Msg:e.target.value
        });
    }
    removeText(){
        this.refs.inp.focus();
        this.setState({
            Msg:''
        })
    }
    goPayment(){
        if(repetitionClick){
            return;
        }
        repetitionClick = true;
        const {SettlementActions,Settlement,location}=this.props;
        const {state}=location;
        const  {goodInfo}=state;
        let userInfo = db.readUserInfo();
        let AddressData=contants.addressInfo?contants.addressInfo:Settlement.defaultAddress;
        if(!AddressData){
            contants.alertInstance=alert('提示', '请选择收货地址', [
                { text: '确定', onPress: () =>{}, style: 'default' }
            ]);
            repetitionClick = false;
            return;
        }
        let GoodsJson=[];
        goodInfo.map((val,i)=>{
            let goodDes={
                goodsId:val.goodsId,
                goodsNum:val.number,
                param1:val.param1,
                param2:val.param2,
                param3:val.param3,
                flagShip:val.flagshipId,
                isInCart:location.state.isInCart?0:1,
                isIngroup:val.buyType?0:1,
                groupActId:val.groupId?val.groupId:1,
                pictureUrl:val.zoomUrl,
                shouldMoney:val.oriPrice?val.oriPrice:val.price,
                factMoney:val.price
            };
            GoodsJson.push(goodDes);
        });
        let goodsAllCount=0;
        goodInfo.map((val,i)=>{
            goodsAllCount+=Number(val.number);
        });

        
        let requestData={
            'userId':userInfo.userId,
            'addressId':AddressData.receiveId,
            'sendType':this.state.pickerText[0]?Number(this.state.pickerText[0]):1,
            'leaveMsg':this.state.Msg,
            'shoppingInfo':[{

                'shopId':goodInfo[0].shopId,
                'shopType':1,//0旗舰店  1分销店    12月25号将 0设置为旗舰店
                'amount':this.getPrice(2), //原价
                'payAmount':this.getPrice(1), //实际价格
                'goodsAllCount':goodsAllCount,//订单商品总数量
                'goods':GoodsJson
            }]
            // mobile:userInfo.moblie,
            
        };


        // let requestData={
        //     shopId:goodInfo[0].shopId,
        //     // userId:userInfo.wedoId,
        //     userId:"jdjfjjfjfjfjfjjjjf",
        //     shopType:1,//0旗舰店  1分销店    12月25号将 0设置为旗舰店
        //     mobile:userInfo.moblie,
        //     amount:this.getPrice(2), //原价
        //     payAmount:this.getPrice(1), //实际价格
        //     sendType:this.state.pickerText[0]?Number(this.state.pickerText[0]):1,
        //     addressId:AddressData.receiveId,
        //     leaveMsg:this.state.Msg,
        //     goodsAllCount:goodsAllCount,
        //     goods:GoodsJson
        // };


        let lastCreateOrderRequestData = contants.createOrderData.lastCreateOrderRequestData;
        let lastAddressData = contants.createOrderData.AddressData;
        if(lastCreateOrderRequestData&&lastCreateOrderRequestData.addressId===requestData.addressId&&lastCreateOrderRequestData.leaveMsg===requestData.leaveMsg
            &&lastCreateOrderRequestData.sendType===requestData.sendType&&lastAddressData.shopAdress===AddressData.shopAdress&&
            lastAddressData.adress===AddressData.adress&&lastAddressData.phone==AddressData.phone
            &&lastAddressData.receiveName==AddressData.receiveName
        ){//不产生新订单
            repetitionClick=false;
            let res = contants.createOrderData.lastOrder;//上次订单信息
            // let orderSonId=res.sonOrderId?res.sonOrderId:0
            let orderSonId=res.payMap.paymentItemList[0].itemNo?res.payMap.paymentItemList[0].itemNo:0;//团购订单相关
            let orderDetailUrl = contants.commonUrl+'/orderDetail/?orderId='+res.orderId+'&orderSonId=' +
                orderSonId+'&shopId='+goodInfo[0].shopId
                
            let buyType=1;
            if(goodInfo.length==1&&goodInfo[0].buyType){
                buyType = 0;
            }
            contants.isJumpToPayment=true;
            this.props.history.push({
                pathname:orderDetailUrl,
                state:{
                    orderId:res.orderId,
                    sonOrderId:orderSonId,
                    shopId:goodInfo[0].shopId,
                    buyType:buyType,
                    money:this.getPrice(1),
                    orderNumber:res.orderNumber,
                }
            });
        }
        else{
            let buyType=1;
            if(goodInfo.length==1&&goodInfo[0].buyType){
                buyType = 0;
            }
            // console.log(JSON.stringify(requestData))
            SettlementActions.goToPay('/webOrder/createOrder',JSON.stringify(requestData),(res)=>{
                console.log(res,'订单数据');
                contants.createOrderData.lastOrder= res;
                contants.createOrderData.lastCreateOrderRequestData = requestData;
                contants.createOrderData.AddressData = AddressData;//地址是否变化
                let resOrderId = res.orderInfo[0].orderId;// 订单id
                // let resData = res.orderInfo[0];// 订单数据
                let resData = res.payMap;// 订单数据
                contants.isJumpToPayment=true;
                //let orderSonId = res.sonOrderId ? res.sonOrderId : 0;
                let orderSonId=res.payMap.paymentItemList[0].itemNo?res.payMap.paymentItemList[0].itemNo:0;//团购订单相关
                let orderDetailUrl = contants.commonUrl+'/orderDetail/?orderId='+resOrderId+'&orderSonId=' +
                    orderSonId+'&shopId='+goodInfo[0].shopId;
                repetitionClick = false;
                
                if(resOrderId){
                    console.log('订单id',resOrderId);
                    db.deleteGoods(goodInfo);
                    this.props.history.push({   
                        pathname:orderDetailUrl,
                        state:{
                            appNeedData:resData,
                            // orderId:res.orderId,//慕订单id
                            orderId:resOrderId,//慕订单id
                            orderNumber:res.orderNumber,
                            sonOrderId:orderSonId,
                            shopId:goodInfo[0].shopId,
                            buyType:buyType,
                            money:this.getPrice(1)
                        }
                    });
                }
            },(err)=>{
                repetitionClick = false;
            });

        }
    }
    //跳转地址页面
    goAddress(){
        const {history}=this.props;
        history.push({
            pathname:contants.commonUrl+'/addressList',
            state:{
                pageType:"settlement",
                // selectAddress:(address)=>{
                //     this.selectAddress(address)
                // }
                newAdress_sh:"add_new_adress"
            }
        });
    };
    // selectAddress(address){
    //     const {SettlementActions}=this.props;
    //     SettlementActions.selectAddress(address);
    // }
}