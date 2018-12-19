/**
 * Created by chenmao on 2017/7/6.
 * 旗舰店,商品详情
 *
 *
 * 店家看的
 *
 *
 */

import React,{Component} from 'react';
import { Carousel} from 'antd-mobile';
import { Router, Route, Link,browserHistory  } from 'react-router'
import  './goodDetails.less'
import ChooseSpecification from './chooseSpecification'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import SvgImg from '../../../common/svgImage/svgImg'
let isClick=false;


export default class GoodDetails extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            addCartSuc:false,
            isCollect:1,
            isAretCollect:false,
            int_Status:'',
            statusStr:'',
            expiredTime: '',  //剩余时间
            timer: null
        };
        this.shopId = 0;
        this.goodsId = 0;
        this.userId = 0;
    }
    //进入店铺回到首页
    goToHomePage(){
        const {history}=this.props;
        //browserHistory.push('/index');
        history.push({
            pathname:contants.commonUrl+'/index'
        })
        window.sessionStorage.removeItem('top');
    }

    //跳转客服
    goToChat(){
        let userInfo=db.readUserInfo();
        const {history}=this.props;
        if(userInfo===null){
            history.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    pathname:contants.commonUrl+'/chatV',
                    type:5
                }
            });
        }else {
            this.props.history.push({
                pathname:contants.commonUrl+'/chatV/?shopId='+this.shopId
            })
        }
    }
    //跳转到购物袋
    goToCartPage(){
        this.props.history.push({
            pathname:contants.commonUrl+'/PPShoppingCart'
        })
    }
    componentWillMount(){
        try {
            if(db.userAgent()==='Android'){
                document.title='商品详情';
            }else{
                db.setPageTitle('商品详情');
            }
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }
    componentDidMount(){
        try {
            const {goodDetailsActions}=this.props;
            let strs=[]
            var localUrl = location.search; //获取url中"?"符后的字串
            let theRequest = new Object();
            if(localUrl.indexOf("?") != -1) {
                var str = localUrl.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
                this.goodsId = theRequest['goodsId'];
                this.shopId = theRequest['shopId'];
                this.userId = theRequest['userId']
            }
            let data={
                goodsId:this.goodsId,
                shopId:this.shopId
            };
            goodDetailsActions.getGoodDetailsFromServer('/goods/getFlagshipGoodsInfo',data,(response)=>{
                if(response.isJoin&&response.groupInfo){
                    this.countDown(response.groupInfo.endTime)
                }
            },(err)=>{
                console.log('要么是参数不全,要么是服务器返回error');
                alert(err);
                // alert('查询商品失败')
            });

            $(document).bind('touchmove',function(){
                isClick=false;
            });

            $(window).scroll(function() {
                let curIdArr=[];
                const top = $(document).scrollTop();
                const menu = $(".goodDetailsContainer");
                const items = $('.goodDetailsIntro').find("li");
                const items_a=$(".goodDetailsContainer li a");
                let curId = "";
                if(top>200){
                    let ratio=top/800;
                    if(ratio>=1){
                        ratio=1;
                    }
                    menu.css({'opacity':ratio,'display':'block'});
                }else{
                    let ratio=top/800;
                    menu.css({'opacity':ratio,'display':'none'});
                }
                if(!isClick){
                    var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
                    if(scrollBottom<10){
                        items_a.removeClass('activeStyle');
                        items_a.eq(3).addClass('activeStyle');
                        return;
                    }
                    items.each(function(i) {
                        const itemsTop = $(this).offset().top;
                        if(itemsTop<=top+50){
                            curId = "#" + $(this).attr("id");
                            curIdArr.push(curId);
                        }else {
                            if(curIdArr.length==0){
                                curId = "#" + $(this).attr("id");
                                curIdArr.push(curId);
                            }else{
                                return false;
                            }
                        }
                    });
                    const  curLink = menu.find(".activeStyle");
                    if(curId && curLink.attr("href") != curIdArr[curIdArr.length-1]) {
                        curLink.removeClass("activeStyle");
                        menu.find("[href='" + curIdArr[curIdArr.length-1] + "']").addClass("activeStyle");
                    }
                }
            });
            //获取RN传递的参数
            let that = this;
            document.addEventListener('message', function(e) {
                let data = JSON.parse(e.data)
                if(data.type == 'flagStoreShare'){
                    const {goodDetails}=that.props;
                    const {goodInfo}=goodDetails;
                    var goodsUrl = 'goodDetails' + '/?shopId=' + that.shopId;
                    let shareData = {
                        shopId:that.shopId,
                        goodsId:that.goodsId,
                        title:goodInfo.goodsName,
                        content:goodInfo.describe,
                        picture:goodInfo.goodsUrlList[0].hosrUrl+goodInfo.goodsUrlList[0].pictureFileUrl,
                        enterpriseId:goodInfo.shopId,
                        url:goodsUrl
                    }
                    let datas = {type:'backFlagShare',shareData:shareData,url:'goodDetails/?shopId='+that.shopId+'&goodsId='+that.goodsId}
                    window.postMessage(JSON.stringify(datas));
                }
            });

        } catch (e) {
            alert(JSON.stringify(e))
        }
    }
    componentWillUnmount(){
        const {goodDetailsActions}=this.props;
        goodDetailsActions.showDialog(null);
        goodDetailsActions.receiveGoodDetails(null);
        if(contants.alertInstance){
            contants.alertInstance.close();
        }
        clearInterval(this.state.timer);
    }
    componentDidUpdate(){
        const {goodInfo}=this.props.goodDetails;
        if(goodInfo){
            $('#detail').html(goodInfo.detailString);
            $('#parameter').html(goodInfo.goodsparamString);
            $('#brand').html(goodInfo.goodsBrandString);
            $('#needKnow').html(goodInfo.instructionsString);
            $(".goodDetailsContainer li a").unbind('click').click(function() {
                isClick=true;
                $(".goodDetailsContainer li a").removeClass('activeStyle');
                $(this).addClass('activeStyle');
                $("html, body").animate({
                    scrollTop: $($(this).attr("href")).offset().top-50 + "px"
                }, 500);
                return false;
            });
        }
    }
    showGoodStatusImg(){
        const {goodInfo}=this.props.goodDetails;
        if(goodInfo.status==2){
            return(//下架
                <img src={require('../../images/goodDetails/o2@1x.png')} className="goosStatusImg"/>
            )
        }
        if(!goodInfo.stock){
            return(//售罄
                <img src={require('../../images/goodDetails/o1@1x.png')} className="goosStatusImg"/>
            )
        }
    }
    getGoodTypeName(){
        const {goodInfo}=this.props.goodDetails;
        let str='';
        goodInfo.goodsruleslist.map((val,i)=>{
            if(i==0){
                str=val.type;
            }else{
                str+='/'+val.type;
            }
        });
        return str;
    }
    showBottomDialog(i){
        this.props.goodDetailsActions.showDialog(true,i)
    }
    render() {
        const {goodDetails}=this.props;
        const {goodInfo,groupGoods}=goodDetails;
        let groupG;
        let groupInf;
        if(groupGoods){
            groupG = groupGoods.isJoin;
            groupInf = groupGoods.groupInfo;
        }
        let goodCondition;
        let goodNoSale;
        if(goodInfo){
            goodCondition=goodInfo.condition &&(goodInfo.condition!='00');
            goodNoSale=goodInfo.status==2 || !goodInfo.stock;
        }
        return (
            <div className={`goodContainer`}>
                {goodInfo?(!goodInfo.isDelete && goodInfo.status!==3 && goodInfo.status!==0?
                    <div>
                        <ul className='goodDetailsContainer'>
                            <li><a href='#detail' className='activeStyle'>详情</a></li>
                            <li><a href='#parameter'>参数</a></li>
                            <li><a href='#brand'>品牌</a></li>
                            <li><a href='#needKnow'>买家须知</a></li>
                        </ul>
                        {
                            goodInfo.goodsUrlList.length>1?<Carousel
                                className="my-carousel"
                                autoplay={true}
                                infinite
                                selectedIndex={0}
                                swipeSpeed={35}
                                beforeChange={(from, to) => {}}
                                afterChange={index => {}}
                                dotActiveStyle={{background:'#007aed',borderColor:'#007aed'}}
                            >
                                {goodInfo.goodsUrlList.map((val, i)=> (
                                    <div key={i} className="carouselContainer">
                                        <img
                                            className='headImgStyle'
                                            src={val.hosrUrl+val.pictureFileUrl}
                                            alt="icon"
                                        />
                                    </div>
                                ))}
                            </Carousel>:<div className="carouselContainer">
                                <img
                                    className='headImgStyle'
                                    src={goodInfo.goodsUrlList[0].hosrUrl+goodInfo.goodsUrlList[0].pictureFileUrl}
                                />
                            </div>
                        }
                        {this.showGoodStatusImg()}
                        <div className='goodDesContainer'>
                            <div className="commodityName">
                                <p className="goodsName">{goodInfo.goodsName}</p>

                            </div>

                            <span className="isHasGood">{goodInfo.status==2?'已下架':!goodInfo.stock?'已售罄':'有货'}</span>
                            {groupG
                                ?
                                (goodInfo.inCloud
                                    ?
                                    <div className="groupDoodDesContainer_p1">
                                        <div>
                                            <div>
                                                <p>利润:</p>
                                                <p className="goodsPrice">{goodInfo.shareProfit}</p>
                                            </div>
                                            <div>
                                                <p>商品售价:</p>
                                                <p>{groupInf.price}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>{this.state.expiredTime}</p>
                                            <p>团购剩余</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="groupDoodDesContainer_p1">
                                        <div>
                                            <div>
                                                <p>商品售价:</p>
                                                <p className="goodsPrice">{groupInf.price}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p>{this.state.expiredTime}</p>
                                            <p>团购剩余</p>
                                        </div>
                                    </div>
                                )
                                :
                                (goodInfo.inCloud
                                    ?
                                        <div className="goodDesContainer_p1">
                                            <div>
                                                <p>利润:</p>
                                                <p className="goodsPrice">{goodInfo.shareProfit}</p>
                                            </div>
                                            <div>
                                                <p>商品售价:</p>
                                                <p>{goodInfo.price}</p>
                                            </div>
                                        </div>
                                    :
                                        <div className="goodDesContainer_p1">
                                            <div className="autotrophy">
                                                <p>商品售价:</p>
                                                <p className="goodsPrice">{goodInfo.price}</p>
                                            </div>
                                        </div>
                                )

                            }
                            <p className="goodDesContainer_p2">{goodInfo.describe}</p>
                        </div>
                        <div className='stripe'></div>
                        <div className='goodDesContainer'>
                            <div className='goodCondition'>
                                {goodInfo.condition!='00'?<div className='goodCondition_t'>
                                    {Number(goodInfo.condition.toString().charAt(1))?<div>
                                        <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                    <span>正品保证</span></div>:null}
                                    {Number(goodInfo.condition.toString().charAt(0)) ?<div>
                                        <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                        <span>包邮</span></div>:null}
                                </div>:null}
                                {goodInfo.serviceGroup.map((value,index)=>{
                                    return(
                                        <p key={index} className='goodCondition_b'>{value}</p>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='stripe'></div>
                        <div className={`goodDesContainer ${goodNoSale?'goodGray':'' }`} onClick={()=>{goodNoSale?null:this.showBottomDialog(2)}}>
                            <div className='goodSpecification'>
                                <span>{`选择：${this.getGoodTypeName()}`}</span>
                                <div className="showChooseDialog">
                                    <img src={require('../../images/goodDetails/b24.png')}/>
                                </div>
                            </div>
                        </div>

                        <div className='stripe'></div>
                        <ul className='goodDetailsIntro'>
                            <li id="detail"></li>
                            <li id="parameter"></li>
                            <li id="brand"></li>
                            <li id="needKnow"></li>
                        </ul>
                        {/*{goodInfo.status==2?<div className="goodDown bottom">商品已下架</div>:null}*/}
                        <div className='goodDesContainer bottom goodBottomB' style={{padding:'0px',bottom:"-1px"}}>
                            <ul className='goodBottom'>
                                {goodInfo.goodsStoryNum>0
                                    ?
                                    <div className="goodBottomMiddle">
                                        <li onClick={()=>{this.openStoryListView()}}>商品故事    ({goodInfo.goodsStoryNum})</li>
                                    </div>
                                    :
                                    <div className="goodBottomMiddle">
                                        <li onClick={()=>{this.openStoryView()}}>发布商品故事</li>
                                    </div>
                                }

                            </ul>
                        </div>
                    </div>
                    :null):null}
                {/*加入购物袋成功*/}
                    <div className={`addCartSuc ${this.state.addCartSuc?'show':'hide'}`}>
                        <img src={require('../../images/goodDetails/b40.png')}/>
                        <span>商品已成功添加到购物袋</span>
                    </div>
                {/*商品失效*/}
                {goodInfo?(goodInfo.isDelete || goodInfo.status==3 || goodInfo.status==0?
                    <div className="goodFailure">
                        <img src={require('../../images/goodDetails/o3@1x.png')} />
                        <span style={{color:'red'}}>此商品已失效~~</span>
                    </div>:null):null
                }
                {/*选择商品规格组件*/}
                {goodInfo?(!goodInfo.isDelete && goodInfo.status!==3 && goodInfo.status!==0?<ChooseSpecification
                    {...this.props}
                    callBack={()=>this.callBack()}
                    showDialog={goodDetails.isShow}/>:null):null}
                {/*Loading*/}
                {goodDetails.isShowLoading?<div className="loadingView"><div className="loadingImg"></div></div>:null}

                <div className={this.state.isAretCollect?"alertShow":"alertHide"}>
                    <div className="backViewStyles">
                    </div>
                    <div>
                        {this.state.int_Status===1?<img src={require('../../images/goodDetails/collectIcon.png')}/>:<img src={require('../../images/goodDetails/canceCollectIcon.png')}/>}
                        <p>{this.showAlert(this.state.int_Status,this.state.statusStr)}</p>
                    </div>
                </div>
            </div>
        );
    }


    //打开商品故事列表页面
    openStoryListView(){
        this.openStoryView()
    }
    //打开商品页面
    openStoryView(){
        const {goodDetails}=this.props;
        const {goodInfo}=goodDetails;
        let storyDic = {hostUrl:goodInfo.goodsUrlList[0].hosrUrl,fileUrl:goodInfo.goodsUrlList[0].pictureFileUrl,goodsName:goodInfo.goodsName,goodsId:this.goodsId}
        let data = {type:'flagPublish',storyDic:storyDic,shopId:this.shopId,goodsId:this.goodsId,userId:this.userId,url:'storyManage'+'/?shopId='+this.shopId+'&goodsId='+this.goodsId+'&type=2&userId='+this.userId}
        window.postMessage(JSON.stringify(data));
    }

    //设置按钮状态  {this.setBtnState(goodInfo.status)}
    setBtnState(btnState){

        if(btnState == 3){
            return(
                <div className="goodBottomRight">
                    <li className="soldOut">已售罄</li>
                </div>
            )
        }
        if(btnState == 2){
            return(
                <div className="goodBottomRight">
                    <li className="soldOut">已下架</li>
                </div>
            )
        }
        if(btnState == 1){
            return(
                <div className="goodBottomRight">
                    <li className="putaway">已上架</li>
                </div>
            )
        }


    }

    //倒计时
    countDown(timeLeave){
        timeLeave = timeLeave.toString()
        if(timeLeave.indexOf('天')>0){
            this.setState({expiredTime:timeLeave})
        }else {
            this.setState({expiredTime: this.formatSeconds(timeLeave)});
            //有时间限制开启定时器
            if (timeLeave != 0) {
                this.state.timer = setInterval(() => {
                    timeLeave--;
                    if (timeLeave == 0) {
                        clearInterval(this.state.timer);
                        location.reload()
                        return;
                    }
                    this.setState({expiredTime: this.formatSeconds(timeLeave)});
                }, 1000);
            }
        }

    }

    //秒数转化为时分秒
    formatSeconds(timeLeave) {
        var secondTime = 0;
        var minuteTime = 0;
        var hourTime = 0;
        if (timeLeave > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = Math.floor(timeLeave / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = Math.floor(timeLeave % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime >= 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = Math.floor(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = Math.floor(minuteTime % 60);
            } else {
                hourTime = 0;
            }
        } else {
            hourTime = 0;
            minuteTime = 0;
            if (timeLeave == 60) {
                minuteTime = 1;
                secondTime = 0;
            } else {
                secondTime = timeLeave;
            }

        }
        var result = this.addZero(hourTime) + ":" + this.addZero(minuteTime) + ':' + this.addZero(secondTime);
        return result;
    }

    addZero(time) {
        let str = time;
        if (time < 10) {
            str = '0' + time;
        }
        return str;
    }


    showAlert(int_Status,status){
        let alertStr = "";
        if (int_Status == 1){
            if(status==0){
                alertStr = "已收藏";
            }else {
                alertStr = "收藏失败";
            }
        }else {
            if(status==0){

                alertStr = "已取消收藏";
            }else {
                alertStr = "取消收藏失败";
            }

        }
        return alertStr;
    }

    callBack(){
        this.setState({addCartSuc:!this.state.addCartSuc});
    }
}

