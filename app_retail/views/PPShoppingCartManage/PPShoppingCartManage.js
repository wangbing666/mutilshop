/**
 * Created by nipeng on 2017/7/10.
 * 购物袋view
 */

import React,{Component} from 'react';
import  './PPShoppingCardManage.less';
import '../../../common/styles/common.less'
import { SwipeAction, List, Toast } from 'antd-mobile';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import { Carousel,ActivityIndicator,Modal} from 'antd-mobile';
import PopularRecommendation from '../../../app/views/search/popularRecommendation';//热门推荐
import {wxShare} from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg';

const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';

export default class PPShoppingCartManage extends Component{

    constructor(props){
        super(props);

        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)
        this.colorDic = contants.viewStyDic;
        this.state={
            repertoryStr:'',
            isUserId:false,
            userId:'',
            goodsList:['1','2'],
            shopId:theRequest['shopId']
        }

    }

    componentWillMount() {

        if(db.userAgent()==='Android'){
            document.title='购物袋';
        }else{
            db.setPageTitle('购物袋');
        }

    }
4
    stopDrop() {
        var lastY;//最后一次y坐标点
        $(document.body).on('touchstart', function(event) {
            lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
        });
        $(document.body).on('touchmove', function(event) {
            var y = event.originalEvent.changedTouches[0].clientY;
            var st = $(this).scrollTop(); //滚动条高度
            if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
                lastY = y;
                event.preventDefault();
            }
            lastY = y;

        });
    }

    componentDidMount(){

        this.stopDrop()
        wxShare([],{});

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let userInfo = db.readUserInfo();

        if (userInfo===null){
            let shopCartList = db.readGoods()
            let tempAry = [];
            if (shopCartList!==null){
                tempAry = shopCartList;
                tempAry = tempAry.reverse();
            }
      
            this.setState({
                isUserId:false,
            })


            PPShoppingCartAction.setShoppingCartList(tempAry);
        }else {
            this.setState({
                isUserId:true,
                // userId:userInfo.wedoId
                userId:userInfo.userId
            })
            let url = '/shopping/shoppingcart';
            let urlHot = '/goods/hotRecommend';
            let body = {
                // userId:userInfo.wedoId,
                userId:userInfo.userId,
                shopId:this.state.shopId
                // orderId:1
            }
            let bodyHot = {

            }




            PPShoppingCartAction.getShoppingCartPost(url,urlHot,body,bodyHot,function (data) {

            },function (error) {

            })

        }

    }
    //type={{background:this.colorDic['COLOR1'],color:this.colorDic['COLOR1']}}
    render(){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let tempStyle = PPShoppingCartReducer.goodsList.length===0?"containerTwo":"containerOne";

        return(

            <div className="containerShop">

                <div className={tempStyle}>

                    {PPShoppingCartReducer.goodsList.length===0?
                        <div className="PPnoAddress">
                            <img className="whiteImgStyle" src={require('../../images/shoppingCardPage/noShopCart_Icon.png')}/>
                            {/*<p>暂无商品</p>*/}
                            <p className="whiteTitleStyle">购物车空空如也，赶快去购物吧~~</p>

                            <p className="goShopStyle" style={{background:this.colorDic['COLOR1'],color:this.colorDic['COLOR3']}} onClick={()=>{this.addShopCartAction()}}>去购物</p>
                            <div className="whiteViewStyle"></div>
                        </div>
                        :
                        <div>
                            <div className="themeStyle">
                                <p className="storyTextStyle">{PPShoppingCartReducer.goodsList[0].shopName}</p>
                                <div className="shanchuDicStyle" onClick={()=>{this.deleShoppingAction(PPShoppingCartReducer.goodsList,0,PPShoppingCartReducer.goodsList,Number(PPShoppingCartReducer.priceString),PPShoppingCartReducer.allSelectImag,2)}}>
                                    <img className="shanchuStyle" src={require('../../images/shoppingCardPage/shanchu.png')}/>
                                </div>

                            </div>
                            <div className="lineViewStyle"/>

                            <ul>

                                {this.listCell()}

                            </ul>


                        </div>
                    }

                    <PopularRecommendation {...this.props} shopId={this.state.shopId}/>

                </div>


                {PPShoppingCartReducer.goodsList.length===0?null:<div className="bottemView">
                    {PPShoppingCartReducer.goodsList.length!==0?<div onClick={()=>{this.changeSelectState()}}>
                        {PPShoppingCartReducer.allSelectImag?<SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>:
                            <img src={require('../../images/shippingAddress/k11.png')}/>}
                    </div>:
                        <div>
                            {PPShoppingCartReducer.allSelectImag?<SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>:
                                <img src={require('../../images/shippingAddress/k11.png')}/>}
                        </div>}

                    <p className="allSelect">全选</p>
                    {/*{PPShoppingCartReducer.priceString==0?*/}
                        <p className="allTotal">合计:<i>￥</i><span>{PPShoppingCartReducer.priceString}</span></p>
                        {/*:*/}
                        {/*<div>*/}
                            {/*<p className="numberMoneyStyle">合计￥{PPShoppingCartReducer.priceString}</p>*/}
                            {/*<p className="numberShopCart">共计{PPShoppingCartReducer.numberShopCart}件商品</p>*/}
                        {/*</div>}*/}


                    {PPShoppingCartReducer.priceString===0?<button className="PPaccountButton">去结算</button>:<button className="PPaccountButtons" style={{color:this.colorDic['COLOR3'],background:this.colorDic['COLOR1'],}}  onClick={()=>{this.accountAction()}}>去结算</button>}

                </div>}
                {PPShoppingCartReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div> :null}


            </div>

        )
    }

    addShopCartAction(){
        // 去添加商品
        const {history}=this.props;
        let url =contants.commonUrl+'/?shopId='+this.state.shopId
        history.push({
            pathname:url
        })
        // window.sessionStorage.removeItem('top');
    }

    listCell(){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        var that = this;

        return(

            PPShoppingCartReducer.goodsList.map(function(data,i) {
                return(
                    <li className="liMainStyle" key={i}>
                        <div className="cellDivStyle">

                            {that.state.isUserId?
                                data.status===1&&data.isdelete===0&&data.isJoin===0?<div className="selectIcons" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                    {data.selected?
                                        <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                        :
                                        <img src={require('../../images/shippingAddress/k11.png')}/>
                                    }
                                </div>:<div className="selectIcons" onClick={()=>{}}><img src={require('../../images/shoppingCardPage/Oval@1x.png')}/></div>
                                :
                                <div className="selectIcons" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                    {data.selected?
                                        <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                        :
                                        <img src={require('../../images/shippingAddress/k11.png')}/>
                                    }
                                </div>
                            }

                            {
                                that.state.isUserId?
                                    <div className="shopImages">
                                        <img className="shopImageS" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                        {data.isdelete===1?<img className="loseImagess" src={require('../../images/goodDetails/o6@1x.png')}/>:data.status===1&&data.isdelete===0?null:data.status===2?<img className="loseImagess" src={require('../../images/goodDetails/o2@1x.png')}/>:data.status===4?<img className="loseImagess" src={require('../../images/goodDetails/o1@1x.png')}/>:data.status===5?<img className="loseImagess" src={require('../../images/goodDetails/o6@1x.png')}/>:<img className="loseImagess" src={require('../../images/goodDetails/o6@1x.png')}/>}
                                    </div>

                                    :
                                    <div className="shopImages">
                                        <img className="shopImage" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                    </div>

                            }
                            <div className="contentStyles">
                                {that.state.isUserId?<div>
                                    <div className="nameDivStyle">
                                        <p className="themeStyless" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodsName}</p>
                                        {/* <div className="payMoneyStyle" onClick={()=>{that.selectCellRemond(data,1)}}> */}
                                            {/*<p className="symbolStyle">RMB:</p>*/}
                                            {/* <p className="moneyStyle">¥{data.price}</p> */}
                                        {/* </div> */}
                                    </div>

                                    <p className="ellips pColorStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.sizeString}</p>
                                    <div className="priceAndRepertorys">
                                        <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}><i>¥ </i>{data.price}</p>
                                        {data.isJoin===0?                                        <div className="repertoryStyleps">

                                            {data.number!==1&&(data.status===1&&data.isdelete===0&&data.isJoin===0)?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                            {(data.status===1&&data.isdelete===0)?<p className="numStyle">{data.number}</p>:<p className="numStyles">{data.number}</p>}
                                            {data.stock!==data.number&&(data.status===1&&data.isdelete===0&&data.isJoin===0)?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                        </div>
                                            :<p className="goodsInTuangou">该商品正在团购中...</p>}
                                        {/* <div className="shanchuDicStyless" onClick={()=>{that.deleShoppingAction(data,i,PPShoppingCartReducer.goodsList,Number(PPShoppingCartReducer.priceString),PPShoppingCartReducer.allSelectImag,1)}}>
                                            <img className="shanchuStyless" src={require('../../images/shoppingCardPage/shanchu.png')}/>
                                        </div> */}

                                    </div>
                                </div>
                                    :
                                    <div>

                                        <div className="nameDivStyle">
                                            <p className="themeStyless" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodNam}</p>
                                            {/* <div className="payMoneyStyle" onClick={()=>{that.selectCellRemond(data,1)}}> */}
                                                {/*<p className="symbolStyle">RMB:</p>*/}
                                                {/* <p className="moneyStyle">¥{data.price}</p> */}
                                            {/* </div> */}
                                        </div>

                                        <p className="ellips pColorStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodSpecification}</p>
                                        <div className="priceAndRepertorys">
                                            <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}><i>¥ </i>{data.price}</p>
                                            {data.isJoin===0 || !data.isJoin?<div className="repertoryStyleps">
                                                {data.number!==1?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                                <p className="numStyle">{data.number}</p>
                                                {data.stock!==data.number?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                            </div>
                                                :<p className="goodsInTuangou">该商品正在团购中...</p>}
                                             <div className="shanchuDicStyless" onClick={()=>{that.deleShoppingAction(data,i,PPShoppingCartReducer.goodsList,Number(PPShoppingCartReducer.priceString),PPShoppingCartReducer.allSelectImag,1)}}>
                                                <img className="shanchuStyless" src={require('../../images/shoppingCardPage/shanchu.png')}/>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>




                        </div>


                        <div className="lineViewStyles"/>

                    </li>
                )
            })
        )
    }





    bottomCellView()
    {
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        var that = this;

        return(
            PPShoppingCartReducer.recommendList.map(function(data,i) {
                return(
                    <li key={i} onClick={()=>{that.selectCellRemond(data,2)}}>
                        <img src={data.hostUrl+data.fileUrl}/>
                        <p className="itmeName">{data.goodName}</p>
                        <p className="itmeMoney">￥{data.price}</p>
                    </li>
                )
            })
        )
    }
    changeSelectState(){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        PPShoppingCartAction.setAllSelectImg(PPShoppingCartReducer.goodsList,!PPShoppingCartReducer.allSelectImag,this.state.isUserId)
    }

    changeState(data,list,i){
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        PPShoppingCartAction.setSelectImg(data,list,i,Number(PPShoppingCartReducer.priceString),PPShoppingCartReducer.allSelectImag,Number(PPShoppingCartReducer.numberShopCart),this.state.isUserId);
    }
    accountAction(){
        // alert('去结算')
        contants.createOrderData={}//
        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let temp = [];
        for (let i=0;i<PPShoppingCartReducer.goodsList.length;i++){

            let tempDic = PPShoppingCartReducer.goodsList[i];
            if (tempDic.selected){
                let tempDic1 = {};
                if (this.state.isUserId){
                    tempDic1 = {
                        goodNam:tempDic.goodsName,
                        goodsId:tempDic.goodsId,
                        number:tempDic.number,
                        param1:tempDic.param1,
                        param2:tempDic.param2,
                        param3:tempDic.param3,
                        zoomUrl:tempDic.zoomUrl,
                        price:tempDic.price,
                        stock:tempDic.stock,
                        shopId:tempDic.shopId,
                        shopName:tempDic.shopName,
                        flagshipId:tempDic.flagshipId,
                        goodSpecification:tempDic.sizeString,
                        oriPrice:tempDic.price, //原价
                        buyType:0,   //购买类型,1团购,0普通商品
                        groupId:1
                    }
                }else {
                    tempDic1= tempDic
                }

                temp.push(tempDic1);

            }

        }

        if (!this.state.isUserId){

            const {history}=this.props;
            history.push({
                pathname:contants.commonUrl+'/login'+'/?shopId='+this.state.shopId,
                state:{
                    type:2,
                    goodInfo:temp
                }
            });


            // this.props.router.push({
            //     pathname:contants.commonUrl+'/login',
            //     state:{
            //         type:2,
            //         goodInfo:temp
            //     }
            // });

        }else {
            // 去结算
            this.props.history.push({
                pathname:contants.commonUrl+'/settlement'+'/?shopId='+this.state.shopId,
                state:{
                    goodInfo:temp,

                }
            });

        }


    }


    jianhaoAction(data,i){

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        if (data.number===1){
            return;
        }
        if(this.state.isUserId){
            if (data.status!==1&&data.isdelete!==0){
                return;
            }
        }

        let numberStr = PPShoppingCartReducer.goodsList[i].number - 1;

        if (this.state.isUserId){

            let url = '/shopping/shopnumber';
            let body = {
                userId:this.state.userId,
                combinationId:data.combinationId,
                number:numberStr,
                goodsId:data.goodsId,
                shopId:this.state.shopId,
            }

            PPShoppingCartAction.setShoppingNuberPost(url,body,numberStr,data,i,PPShoppingCartReducer.goodsList,this.state.isUserId,Number(PPShoppingCartReducer.priceString),0,Number(PPShoppingCartReducer.numberShopCart),function (data) {

            },function (error) {

            })
        }else {

            PPShoppingCartAction.setNumberAction(data,i,numberStr,PPShoppingCartReducer.goodsList,this.state.isUserId,data.stock,Number(PPShoppingCartReducer.priceString),0,Number(PPShoppingCartReducer.numberShopCart));

        }



    }

    jiahaoAction(data,i){ //购物车增加

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        if (data.number===data.stock){
            return;
        }
        if(this.state.isUserId){
            if (data.status!==1&&data.isdelete!==0){
                return;
            }
        }


        let numberStr = PPShoppingCartReducer.goodsList[i].number + 1;
        if (this.state.isUserId){
            console.log(this.props)
            let url = '/shopping/shopnumber';
            let body = {
                userId:this.state.userId,
                combinationId:data.combinationId,
                number:numberStr,
                goodsId:data.goodsId,
                shopId:this.state.shopId,
            }
            PPShoppingCartAction.setShoppingNuberPost(url,body,numberStr,data,i,PPShoppingCartReducer.goodsList,this.state.isUserId,Number(PPShoppingCartReducer.priceString),1,Number(PPShoppingCartReducer.numberShopCart),function (data) {



            },function (error) {



            })

        }else {
            PPShoppingCartAction.setNumberAction(data,i,numberStr,PPShoppingCartReducer.goodsList,this.state.isUserId,data.stock,Number(PPShoppingCartReducer.priceString),1,Number(PPShoppingCartReducer.numberShopCart));
        }

    }
    deleShoppingAction(data,i,list,priceStr,allSelectImg,type){

        // alert('水电费第三方')

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;
        let userInfo = db.readUserInfo();

        let tempData = data;
        if(this.state.isUserId){  // 登录删网络
            let url = '/shopping/deleteshop';
            let  body = {};
            if (type===1){ // 删除单个商品

                body = {
                    // userId:userInfo.wedoId,
                    userId:userInfo.userId,
                    goodsId:JSON.stringify([{
                        goodsId:data.goodsId,
                        combinationId:data.combinationId
                    }])
                }
            }

            if(type===2){ // 删除全部商品

                let deleDate = [];

                for(let i=0;i<data.length;i++){
                    if(data[i].selected){
                        let deleDic = {}
                        deleDic.goodsId = data[i].goodsId;
                        deleDic.combinationId = data[i].combinationId;
                        deleDate.push(deleDic)
                    }
                }

                if(deleDate.length===0){
                    Toast.info('请先选择商品，可批量删除哦~', 1);
                    return;
                }
                tempData = deleDate;
                body = {
                    // userId:userInfo.wedoId,
                    userId:userInfo.userId,
                    goodsId:JSON.stringify(deleDate)
                }
            }

            PPShoppingCartAction.deletaShoppingCartPost(url,body,tempData,i,list,priceStr,allSelectImg,this.state.isUserId,Number(PPShoppingCartReducer.numberShopCart),type,function (data) {

            },function (error) {

            })
        }else {   // 没登录删缓存
            if (type===2){

                let deleDate = [];
                for(let i=0;i<data.length;i++){
                    if(data[i].selected){
                        let deleDic = {}
                        deleDic.goodsId = data[i].goodsId;
                        deleDic.combinationId = data[i].combinationId;
                        deleDate.push(deleDic)
                    }
                }

                if(deleDate.length===0){
                    Toast.info('请先选择商品，可批量删除哦~', 1);
                    return;
                }

            }
            PPShoppingCartAction.setDelectList(data,list,i,priceStr,allSelectImg,this.state.isUserId,Number(PPShoppingCartReducer.numberShopCart))

        }

    }



    selectCellRemond(data,type){
        // 点击了cell 跳转到商品详情
        let shopId = this.state.shopId;
        let goodId = data.goodsId;
        // 需要传用户id 店铺id 商品id
        const {history}=this.props;
        let url = contants.commonUrl+'/goodDetails'+'/?shopId='+shopId+'&goodsId='+goodId
        history.push({
            pathname:url,
            state:{
            }
        });
    }


    textCell(){

        const {PPShoppingCartReducer,PPShoppingCartAction} = this.props;

        var that = this;
        return(

            PPShoppingCartReducer.goodsList.map(function(data,i) {

                return(


                    <SwipeAction
                        key={i}
                        style={{ backgroundColor: 'white' }}
                        autoClose
                        right={[
                            {
                                text: '取消',
                                onPress: () => console.log('cancel'),
                                style: { backgroundColor: '#ddd', color: 'white' },
                            },
                            {
                                text: '删除',
                                onPress: () => that.deleShoppingAction(data,i,PPShoppingCartReducer.goodsList,Number(PPShoppingCartReducer.priceString),PPShoppingCartReducer.allSelectImag),
                                style: { backgroundColor: '#d4c1a1', color: 'white' },
                            },
                        ]}

                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}
                    >
                        <List.Item

                        >
                            <div className="commodityCell">

                                {that.state.isUserId?
                                    data.status===1&&data.isdelete===0?<div className="selectIcon" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                        {data.selected?
                                            <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                            :
                                            <img src={require('../../images/shippingAddress/k11.png')}/>
                                        }
                                    </div>:<div className="selectIcon" onClick={()=>{}}><img src={require('../../images/shoppingCardPage/Oval@1x.png')}/></div>
                                    :
                                    <div className="selectIcon" onClick={()=>{that.changeState(data,PPShoppingCartReducer.goodsList,i)}}>
                                        {data.selected?
                                            <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                            :
                                            <img src={require('../../images/shippingAddress/k11.png')}/>
                                        }
                                    </div>
                                }

                                {
                                    that.state.isUserId?
                                        <div className="shopImages">
                                            <img className="shopImage" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                            {data.isdelete===1?<img className="loseImages" src={require('../../images/goodDetails/o6@1x.png')}/>:data.status===1&&data.isdelete===0?null:data.status===2?<img className="loseImages" src={require('../../images/goodDetails/o2@1x.png')}/>:data.status===4?<img className="loseImages" src={require('../../images/goodDetails/o1@1x.png')}/>:data.status===5?<img className="loseImages" src={require('../../images/goodDetails/o6@1x.png')}/>:<img className="loseImages" src={require('../../images/goodDetails/o6@1x.png')}/>}
                                        </div>

                                        :
                                        <div className="shopImages">
                                            <img className="shopImage" src={data.zoomUrl} onClick={()=>{that.selectCellRemond(data,1)}}/>
                                        </div>

                                }

                                <div className="contentStyle">
                                    {that.state.isUserId?<div>
                                        <p className="ellips themeStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodsName}</p>
                                        <label className="ellips pColorStyle" onClick={()=>{that.selectCellRemond(data,1)}}>{data.sizeString}</label>
                                        <div className="priceAndRepertory">
                                            <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}><i>¥ </i>{data.price}</p>
                                            <div className="repertoryStylep">

                                                {data.number!==1&&(data.status===1&&data.isdelete===0)?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                                {(data.status===1&&data.isdelete===0)?<p className="numStyle">{data.number}</p>:<p className="numStyles">{data.number}</p>}
                                                {data.stock!==data.number&&(data.status===1&&data.isdelete===0)?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                            </div>
                                        </div>
                                    </div>
                                        :
                                        <div>
                                            <p className="ellips themeStyles" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodNam}</p>
                                            <p className="ellips pColorStyle" onClick={()=>{that.selectCellRemond(data,1)}}>{data.goodSpecification}</p>
                                            <div className="priceAndRepertory">
                                                <p className="priceStyleP" onClick={()=>{that.selectCellRemond(data,1)}}><i>¥ </i>{data.price}</p>
                                                <div className="repertoryStylep">
                                                    {data.number!==1?<button className="minusStyle" onClick={()=>{that.jianhaoAction(data,i)}}>-</button>:<button className="minusStyles">-</button>}
                                                    <p className="numStyle">{data.number}</p>
                                                    {data.stock!==data.number?<button className="plusSignStyle" onClick={()=>{that.jiahaoAction(data,i)}}>+</button>:<button className="plusSignStyles">+</button>}

                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>

                            </div>
                        </List.Item>
                    </SwipeAction>

                )
            })
        )
    }


}



