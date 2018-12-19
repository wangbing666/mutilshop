/**
 * Created by chenmao on 2017/7/6.
 *
 *
 * 消费者看到的
 *
 */

import React,{Component} from 'react';
import { Carousel} from 'antd-mobile';
import { Router, Route, Link,browserHistory  } from 'react-router'
import  './goodDetails.less'
import ChooseSpecification from './chooseSpecification'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import { get } from '../../../common/Apis/Fetch';
import * as contants from '../../../common/Apis/constants'
import SvgImg from '../../../common/svgImage/svgImg'
import InGroupShopping from '../groupShoppingDetail/inGroupShopping'
import * as weidudb from '../../../common/Apis/weiduInteractive';
import PictureBrowse from '../../../app/views/goodDetails/pictureBrowse'
let isClick=false;
import {Modal,Toast} from 'antd-mobile';
const alert = Modal.alert;

export default class GoodDetails extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            addCartSuc:false,
            isCollect:1,
            isAretCollect:false,
            int_Status:'',
            statusStr:'',
            selectIndex:0,
        };
        this.goodsId=0;
        this.shopId=0;
        this.pageType = 0;//1为预览页面 不能点击,0位普通页面
        this.groupId = null;
        this.isAgainGroup = 0;
        this.jump_or_no = null;
    }
    //进入店铺回到首页
    goToHomePage(){
        if(this.pageType){
            return
        }
        const {history}=this.props;
        //browserHistory.push('/index');
        history.push({
            pathname:contants.commonUrl+'/?shopId='+this.shopId
        })
        window.sessionStorage.removeItem('top');
    }

    //跳转客服
    goToChat(){
        let userInfo=db.readUserInfo();
        let that = this;
        get(`/shop/isShopMaster?shopId=${this.shopId}&userId=${userInfo.userId}`, function (res) {
            if(res.body.result!==0){
                Toast.info('不可和自己聊天', 2);
            }else{
                const {history}=that.props;
                if(userInfo===null){
                    history.push({
                        pathname:contants.commonUrl+'/login/?shopId='+that.shopId+'&goodsId='+that.goodsId,
                    });
                }else {
                    that.props.history.push({
                        pathname:contants.commonUrl+'/chatV/?goodsId='+that.goodsId+'&shopId='+that.shopId
                    })
                }
            }
        }, function (err) {
            // console.log(err.responseJSON);
            Toast.info(err.responseJSON.message, 2);
        });
    }
    //跳转到购物袋
    goToCartPage(){
        if(this.pageType){
            return
        }
        this.props.history.push({
            pathname:contants.commonUrl+'/PPShoppingCart/?shopId='+this.shopId
        })
    }
    //收藏
    collect() {
        if(this.pageType){
            return
        }
        const {goodDetails, goodDetailsActions}=this.props;
        let userInfo = db.readUserInfo();
        let goodsId=this.goodsId;
        let that = this;
        if (userInfo === null) {
            this.props.history.push({
                pathname:contants.commonUrl+'/login/?shopId='+this.shopId,
                state:{
                    type:1
                }
            });
        } else {
            let url = "/goods/collectGoods";
            let bodyData = {
                userId: userInfo.userId,
                goodsId: goodsId,
                // shopId:this.shopId,
                isCollection:Number(that.state.isCollect)
            };

            goodDetailsActions.collectOrcancel(url, bodyData, function (int_Status,statusStr) {
                that.setState({isCollect:!that.state.isCollect,isAretCollect:true,int_Status:int_Status,statusStr:statusStr});

                setTimeout(()=>{

                    that.setState({
                        isAretCollect:false
                    })
                },500);
            }, function (error) {

            })
        }
    }
    componentWillMount(){
        try {
            weidudb.userAuthorization();//调用原生方法获取用户信息
            
            if(db.userAgent()==='Android'){
                
                document.title='商品详情';
            }else{
                db.setPageTitle('商品详情');
            }

        } catch (e) {
            alert(JSON.stringify(e))
            
        }
    }
    _getIsWeido() {
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/kaBao_UU_Wedo/i)=="kabao_uu_wedo") {
            //console.log("在微度内");
            return true;
        }else{
            return false;
            //console.log("在微度外");
        }
    }
    //通过接口获取数据
    getGoodsDetailData(){
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
            this.goodsId = theRequest['goodsId'];
            this.pageType = theRequest['type'];
            if(theRequest['groupId']){
                this.groupId = theRequest['groupId'];
            }
            if(theRequest['isAgainGroup']){
                this.isAgainGroup = theRequest['isAgainGroup'];
            }
        }
        const {goodDetailsActions}=this.props;
        let userInfo=db.readUserInfo();
        let goodsId = theRequest['goodsId'];
        let shopId = theRequest['shopId'];
        let groupId = this.groupId;
        let data={
            goodsId:goodsId,
            userId:(userInfo&&userInfo.userId)?userInfo.userId:-1,
            shopId:shopId,
            groupId:groupId
        };
        // console.log(data)
        goodDetailsActions.getGoodDetailsFromServer('/goods/getGoodsDetail',data,(response)=>{
            if(response.isJoin == 0 && this.isAgainGroup){
                alert('团购活动已经结束!');
            }
             if(response.hasOwnProperty("groupInfo")){
                this.jump_or_no = response.groupInfo;
            }
            
            response = response.goodsDetail;
            if (!response.isDelete) {
                var goodsUrl = contants.commonServerUrl + '/goodDetails' + '/?shopId=' + this.shopId;
                //微度分享所需参数
                contants.groupShoppingDetailInfo = {
                    title: response.goodsName,
                    content: response.describe,
                    imgUrl: response.goodsUrlList[0].hosrUrl+response.goodsUrlList[0].pictureFileUrl,
                    goodsId: this.goodsId,
                    shareUrl: goodsUrl
                }

                //微信分享所需参数
                let dic = {
                    title: response.goodsName,
                    desc: response.describe,
                    imgUrl: response.goodsUrlList[0].hosrUrl+response.goodsUrlList[0].pictureFileUrl,
                    linkUrl: goodsUrl + '&goodsId=' + this.goodsId
                };
                wxShare([], dic, true);
                //二维码URL
                this.setState({
                    QRUrl: dic.linkUrl,
                    isCollect:response.isEnshrine
                })
            } else {
                wxShare([], {});
            }
        },(err)=>{
            // console.log('要么是参数不全,要么是服务器返回error');
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
    }

    componentDidMount(){
       
        let isWeido = this._getIsWeido()
        try {
            if(isWeido&&weidudb.ismobile(1) == 0&&!window.webkit){ //是iphone 手机并且是商品预览
                // console.log('维度中 商品预览')
                this.getGoodsDetailData();
            }
            else if (isWeido) {
                this.timer = setInterval(() => {
                    let userInfo = db.readUserInfo();
                    if (userInfo) {
                        clearInterval(this.timer)
                        this.timer=null;
                        this.getGoodsDetailData()
                    }
                    else{
                    }
                },500);
            } else {
                this.getGoodsDetailData();
            }
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }
    //重新请求
    againRequireData(){
        const {goodDetailsActions}=this.props;
        let userInfo=db.readUserInfo();
        let goodsId = this.goodsId;
        let shopId = this.shopId;
        let groupId = this.groupId;
        let data={
            goodsId:goodsId,
            userId:userInfo?userInfo.userId:-1,
            shopId:shopId,
            groupId:groupId
        };
        goodDetailsActions.getGoodDetailsFromServer('/goods/getGoodsDetail',data,(response)=>{

        },(err)=>{

        })
    }

    componentWillUnmount(){
        
        const {goodDetailsActions}=this.props;
        goodDetailsActions.showDialog(null);
        goodDetailsActions.receiveGoodDetails(null);
        if(contants.alertInstance){
            contants.alertInstance.close();
        }
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
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 'auto',
            spaceBetween: 23,
        });
    }
    showGoodStatusImg(){
        const {goodInfo}=this.props.goodDetails;
        if(goodInfo.status==2){
            return(
                <img src={require('../../images/goodDetails/o2@1xR.png')} className="goosStatusImg"/>
            )
        }
        if(!goodInfo.stock){
            return(
                <img src={require('../../images/goodDetails/o1@1xR.png')} className="goosStatusImg"/>
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
        if(this.pageType && (i==0||i==1)){
            return;
        }

       const {history,location} = this.props;
        let useShopId = db.getValueFromUrl(location.search);
        
        if(this.jump_or_no && (this.jump_or_no.groupStatus == 1 || this.jump_or_no.groupStatus == 2) ){
            history.push({
                pathname: contants.commonUrl + '/orderDetail' + "/?&orderId=" + this.jump_or_no.orderId + "&shopId=" + useShopId.shopId
            })
        }else{

            this.props.goodDetailsActions.showDialog(true,i)
        }
        
    }
    render() {
        this.colorDic = contants.viewStyDic;
        const {goodDetails}=this.props;
        const {goodInfo,groupGoods}=goodDetails;
        let groupG;
        let groupInf;
        let goodsStory;
        if(groupGoods){
            groupG = groupGoods.isJoin;
            groupInf = groupGoods.groupInfo;
            goodsStory = groupGoods.goodsStory;
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
                        {/* <ul className='goodDetailsContainer'>
                            <li><a href='#detail' className='activeStyle'>详情</a></li>
                            <li><a href='#parameter'>参数</a></li>
                            <li><a href='#brand'>品牌</a></li>
                            <li><a href='#needKnow'>买家须知</a></li>
                        </ul> */}
                        {
                            goodInfo.goodsUrlList.length>1?<Carousel
                                className="my-carousel"
                                autoplay={true}
                                infinite
                                selectedIndex={0}
                                swipeSpeed={35}
                                beforeChange={(from, to) => {}}
                                afterChange={index => {!goodDetails.showPictureBrowse?this.setState({selectIndex:index}):null}}
                                dotActiveStyle={{background:'#007aed',borderColor:'#007aed'}}
                            >
                                {goodInfo.goodsUrlList.map((val, i)=> (
                                    <div key={i} className="carouselContainer"  onClick={()=>{this.showPictureBrowse()}}>
                                        <img
                                            className='headImgStyle'
                                            src={val.hosrUrl+val.pictureFileUrl}
                                            alt="icon"
                                        />
                                    </div>
                                ))}
                            </Carousel>:<div className="carouselContainer"  onClick={()=>{this.showPictureBrowse()}}>
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
                                <span onClick={()=>{this.collect()}}>
                                    <SvgImg xlinkHref={!this.state.isCollect?'#wedo-wedoicon-1':'#wedo-wedoicon-'} className="collectIcon"/>
                                </span>
                            </div>

                            <span className="isHasGood">{goodInfo.status==2?'已下架':!goodInfo.stock?'已售罄':'有货'}</span>
                            {groupG
                                ?
                                <div className="groupDoodDesContainer_p1">
                                    <div>
                                        <p>￥{groupInf.amount}</p>
                                        <p>
                                            <span>原价:{groupInf.price}</span>
                                            <span>{groupInf.personNum}人团</span>
                                        </p>
                                    </div>
                                    <p>团购进行中...</p>
                                </div>
                                :
                                <p className="goodDesContainer_p1">
                                    <span style={{lineHeight: '90px'}}><b>RMB:</b>{goodInfo.price}</span>
                                    {/* <div>原价：1099</div> */}
                                </p>
                            }
                            <p className="goodDesContainer_p2">{goodInfo.describe}</p>
                        </div>
                        <div className='stripe'></div>
                        <div className={`goodDesContainer ${goodNoSale?'goodGray':'' }`} onClick={()=>{goodNoSale?null:(groupG?this.showBottomDialog(1):this.showBottomDialog(2))}}>
                            <div className='goodSpecification'>
                                <span>{`选择：${this.getGoodTypeName()}`}</span>
                                <div className="showChooseDialog">
                                    <img src={require('../../images/goodDetails/b24.png')}/>
                                </div>
                            </div>
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
                                    {goodInfo.backGoods === 1 ?<div>
                                        <SvgImg xlinkHref="#wedo-wedoicon-13" className="conditionIcon"/>
                                        <span>7天退换</span></div>:null}
                                </div>:null}
                                {goodInfo.serviceGroup.map((value,index)=>{
                                    return <p key={index} className='goodCondition_b'>{value}</p>
                                })}
                            </div>
                        </div>
                        {groupG
                            ?
                            <div>
                                <div className='stripe'></div>
                                <InGroupShopping
                                    groupText="正在拼团"
                                    userImgList={groupInf.headList}
                                    totalNum={groupInf.joinUsers}
                                    needNum={groupInf.personNum}
                                    groupSucess={{usedTime:groupInf.finishTime,beatPeopleNum:groupInf.finishRate}}
                                    remainingSecond={groupInf.leftTime}
                                    remainingNoSecond={()=> {
                                        location.reload();
                                        {/*this.againRequireData()*/}
                                    }}
                                />
                            </div>
                            :
                            null
                        }


                        {goodsStory&&goodsStory.length
                            ?
                            <div>
                            <div className='stripe'></div>
                            <div className="goodsStory">
                                <div className="storyTitle">
                                    <p>商品故事</p>
                                    <p onClick={()=>{this.openStoryListView()}}>查看全部</p>
                                </div>
                                <div className="storyInfo">
                                    {this.goodsStoryShow(goodsStory)}
                                </div>
                            </div>
                            </div>
                            :
                            null
                        }


                        <div className='stripe'></div>
                        <ul className='goodDetailsIntro'>
                            <li id="detail"></li>
                            <li id="parameter"></li>
                            <li id="brand"></li>
                            <li id="needKnow"></li>
                        </ul>
                        {/*{goodInfo.status==2?<div className="goodDown bottom">商品已下架</div>:null}*/}
                        <div className='goodDesContainer bottom goodBottomB' style={{padding:'0px',bottom:"-1px"}}>
                            {groupG
                                ?
                                <ul className='groupGoodBottom'>
                                    <li onClick={()=>{this.goToChat()}}>
                                        <SvgImg xlinkHref="#wedo-wedoicon-24" className="conditionIcon" style={{fill:'#007aed'}}/>
                                        {/* <span>客服</span> */}
                                    </li>
                                    <li onClick={()=>{this.goToHomePage()}}>
                                        <SvgImg xlinkHref="#wedo-wedoicon-25" className="conditionIcon" style={{fill:'#007aed'}}/>
                                        {/* <span>进入店铺</span> */}
                                    </li>
                                    <li onClick={()=>this.goToCartPage()}>
                                        <SvgImg xlinkHref="#wedo-wedoicon-19" className="conditionIcon" style={{fill:'#007aed'}}/>
                                        {/* <span>购物袋</span> */}
                                    </li>
                                    {this.joinGroup(goodNoSale)}


                                </ul>
                                :
                            ((goodInfo.status==2)||(!goodInfo.stock)
                                ?
                                    <ul className='goodBottom'>
                                        <div className="goodBottomLeft">
                                            <li onClick={()=>{this.goToChat()}}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-24" className="conditionIcon" style={{fill:'#007aed'}}/>
                                                {/* <span>客服</span> */}
                                            </li>
                                            <li onClick={()=>{this.goToHomePage()}}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-25" className="conditionIcon" style={{fill:'#007aed'}}/>
                                                {/* <span>进入店铺</span> */}
                                            </li>
                                            <li onClick={()=>this.goToCartPage()}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-19" className="conditionIcon" style={{fill:'#007aed'}}/>
                                                {/* <span>购物袋</span> */}
                                            </li>
                                        </div>
                                        <div className="goodBottomMiddle">
                                            <li style={{backgroundColor:'#b6b6b8',color:'#f4f5f7'}} className={goodNoSale?'noAaleMount':'addCartButton'}>加入购物车</li>
                                        </div>
                                        <div className="goodBottomRight">
                                            <li style={{backgroundColor:'#B4282D',color:'#ffffff'}} className={goodNoSale?'noAaleMountToBuy':'goBuyNowButton'}>立即购买</li>
                                        </div>


                                    </ul>
                                :
                                    <ul className='goodBottom'>
                                        <div className="goodBottomLeft">
                                            <li onClick={()=>{this.goToChat()}}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-24" className="conditionIcon" style={{fill:'#7f7f7f'}}/>
                                                {/* <span>客服</span> */}
                                            </li>
                                            <li onClick={()=>{this.goToHomePage()}}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-25" className="conditionIcon" style={{fill:'#7f7f7f'}}/>
                                                {/* <span>进入店铺</span> */}
                                            </li>
                                            <li onClick={()=>this.goToCartPage()}>
                                                <SvgImg xlinkHref="#wedo-wedoicon-19" className="conditionIcon" style={{fill:'#7f7f7f'}}/>
                                                {/* <span>购物袋</span> */}
                                            </li>
                                        </div>
                                        <div className="goodBottomMiddle">
                                            <li style={{backgroundColor:'#ffffff',color:'#6D6D72'}} onClick={()=>{goodNoSale?null:this.showBottomDialog(0)}} className={goodNoSale?'noAaleMount':'addCartButton'}>加入购物车</li>
                                        </div>
                                        <div className="goodBottomRight">
                                            <li style={{backgroundColor:'#B4282D',color:'#ffffff'}} onClick={()=>{goodNoSale?null:this.showBottomDialog(1)}} className={goodNoSale?'noAaleMountToBuy':'goBuyNowButton'}>立即购买</li>
                                        </div>
                                    </ul>

                            )

                            }

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
                        <div onClick={()=>{this.goToHomePage()}} style={{backgroundColor:'#007aed',color:'#f4f5f7'}}>进入店铺</div>
                    </div>:null):null
                }
                {/*选择商品规格组件*/}
                {goodInfo?(!goodInfo.isDelete && goodInfo.status!==3 && goodInfo.status!==0?<ChooseSpecification
                    {...this.props}
                    callBack={()=>this.callBack()}
                    pageType={this.pageType}
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

                {/*图片浏览goodInfo.goodsUrlList*/}
                {goodDetails.showPictureBrowse
                    ?
                    <PictureBrowse {...this.props} pictureList={goodInfo.goodsUrlList} pictureS={require('../../images/goodDetails/collectIcon.png')}
                                   selectIndex={this.state.selectIndex}
                    />
                    :
                    null
                }
            </div>
        );
    }

    showPictureBrowse(){
        const {goodDetailsActions}=this.props;
        goodDetailsActions.showPictureBrowse(1)
    }

    //展示商品故事
    goodsStoryShow(goodsStory){
        if(goodsStory.length>1){
            return(
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {goodsStory.map((value,index)=>{
                            return (
                                <div className="swiper-slide" key={index} onClick={()=>{this.openStoryView(value.storyId,value.title)}}>
                                    <div className="goodsStoryImg">
                                        <img src={value.hostUrl+value.fileUrl}/>
                                        <p>{value.pageCount}图</p>
                                    </div>
                                    <div className="storyIfo">
                                        <p className="dayRecommend">{value.title}</p>
                                        <div className="browse">
                                            <div>
                                                <img src={require('../../images/storyPage/look.png')}/>
                                                <p>{value.readNumber}</p>
                                            </div>
                                            <div>
                                                <img src={require('../../images/storyPage/comment.png')}/>
                                                <p>{value.commentNumber}</p>
                                            </div>
                                            <div>
                                                <img src={require('../../images/storyPage/love2.png')}/>
                                                <p>{value.likeNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }else if(goodsStory.length=1) {
            return(
                <div className="oneStory" onClick={()=>{this.openStoryView(goodsStory[0].storyId,goodsStory[0].title)}}>
                    <div className="goodsStoryImg">
                        <img src={goodsStory[0].hostUrl+goodsStory[0].fileUrl}/>
                        <p>{goodsStory[0].pageCount}图</p>
                    </div>
                    <div className="storyIfo">
                        <p className="dayRecommend">{goodsStory[0].title}</p>
                        <div className="browse">
                            <div>
                                <img src={require('../../images/storyPage/look.png')}/>
                                <p>{goodsStory[0].readNumber}</p>
                            </div>
                            <div>
                                <img src={require('../../images/storyPage/comment.png')}/>
                                <p>{goodsStory[0].commentNumber}</p>
                            </div>
                            <div>
                                <img src={require('../../images/storyPage/love2.png')}/>
                                <p>{goodsStory[0].likeNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    }
    //设置按钮状态
    joinGroup(goodNoSale,isGroup,goodsState,stock){

        let borderR;
        if(this.colorDic){
            if(this.colorDic['SHAPE']&&this.colorDic['SHAPE'] == 3){
                borderR = 'btnSemicircle';
            }else  if(this.colorDic['SHAPE']&&this.colorDic['SHAPE'] == 2){
                borderR = 'btnCircular';
            }else {
                borderR = 'btnNoCircular';
            }
        }

        if(this.jump_or_no.groupStatus == 2){
            return(
                    <li style={{backgroundColor:this.colorDic['COLOR1'],color:this.colorDic['COLOR3']}} onClick={()=>{goodNoSale?null:this.showBottomDialog(1)}} className={goodNoSale?'noAaleMount'+' '+borderR:'addCartButton'+' '+borderR}>查看参团</li>
                )
        }else{
            return(
                    <li style={{backgroundColor:this.colorDic['COLOR1'],color:this.colorDic['COLOR3']}} onClick={()=>{goodNoSale?null:this.showBottomDialog(1)}} className={goodNoSale?'noAaleMount'+' '+borderR:'addCartButton'+' '+borderR}>立即参团</li>
                )
        }
    }

    //打开商品故事列表页面
    openStoryListView(){
        if(this.pageType){
            return
        }
        let shopId = this.shopId;
        let goodsId = this.goodsId;
        //storyManage
        const {history}=this.props;
        let url = contants.commonUrl+'/storyBuyerManage'+'/?shopId='+shopId+'&goodsId='+goodsId;
        history.push({
            pathname:url
        });
    }
    //打开商品页面
    openStoryView(storyId,storyTitle){
        if(this.pageType){
            return
        }
        const {history}=this.props;
        let url = contants.commonUrl+'/storyDetailsBuyerManage'+'/?storyId='+storyId+'&shopId='+this.shopId;
        history.push({
            pathname:url,
            titles:storyTitle
        });
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

