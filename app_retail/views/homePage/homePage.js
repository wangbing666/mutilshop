/**
 * Created by AndyWang on 2017/7/6.
 */
import React,{Component} from 'react';
import './homePage.less';

import Navigation from './navigation';//头部导航

import { ListView,Toast} from 'antd-mobile';
import HatOne from '../homeHat/HatOne';
import HatTwo from '../homeHat/HatTwo';
import HatThree from '../homeHat/HatThree';
import HatFour from '../homeHat/HatFour';
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import {hex_md5} from '../payment/md5';
import { Carousel } from 'antd-mobile';
import GroupingList from './groupingList';//分组名称左右滑
import GroupingPopup from './groupingPopup';//分组名称弹出框
import * as weidudb from '../../../common/Apis/weiduInteractive';
import {getValueFromUrl,setPageTitle} from '../../../common/Apis/Utils'
import SvgImg from "../../../common/svgImage/svgImg";
import Frozen from "../../../common/components/empty";

import { post,postTwo} from '../../../common/Apis/Fetch';

export default class HomePage extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = false;
        this.pageIndex = 1;
        this.pageSize = 10;
        this.shopId=0;
        this.state = {
            dataSource: dataSource,
            isLoading: false,
            requestCompleted: true,//是否还有更多数据
            viewStyDic: null,
            isShowServer:false,
        }
        this.groupId=null;
        var localUrl = location.search; //获取url中"?"符后的字串
        let theRequest = getValueFromUrl(localUrl)
        this.shopId = theRequest['shopId']
        contants.shopPreView=theRequest['shopPreview']
    }

    componentWillReceiveProps() {
        // if(this.groupListView){
        //     this.groupListView.updateSwiper()
        // }
    }

    componentDidUpdate() {
        // alert('componentDidUpdat')
        if(this.groupListView){
            if(contants.shopPreView == 1){
                setTimeout(()=>{
                    this.groupListView.updateSwiper()
                    this.refs.list.scrollTo(0,1)
                },1000)
            }
            else{
                this.groupListView.updateSwiper()
            }
        }
    }
        //reader前
    componentWillMount(){
        let data={
                "con":{"shopId":db.readUserInfo()["shopId"]}
            };
        postTwo("/enterprise-admin/newCustomerChat/getAllInfoForWeb",JSON.stringify(data),(res)=>{
            
            if( res.body.info.userId === db.readUserInfo()["userId"]){
                this.setState({
                    isShowServer:true
                })
            }
        },(err)=>{
            console.log(err)
        })
       
        weidudb.userAuthorization();//调用原生方法获取用户信息

    }
    //在页面被渲染成功之后
    componentDidMount(){
        // //localStorage.removeItem("userInfo");
        
        const {HomePage,HomePageActions}=this.props;
        HomePageActions.isShopFrozen(`/shop/isShopFrozen?shopId=${this.shopId}`);
        HomePageActions.getShopSubInfoPost(this.shopId,(data)=>{
           
        },(err)=>{
           
        });
        HomePageActions.groupingNameList(this.shopId,(data)=>{
        },(err)=>{
        });
        this.getHomepageList11();
        this.setState({viewStyDic:contants.viewStyDic})
        if(db.userAgent()==='Android'){
            // MOYAHEE
            document.title='微小店';
        }else {
            setPageTitle('微小店');
        }
    }
    getHomepageList11(){ //获取分销店单分类商品
        let a=location.href.indexOf('goodDetails');
        if(a>-1 || window.sessionStorage.getItem('top')){
            this.initData=true;
            window.sessionStorage.removeItem('top');
        }else{
            wxShare([],{});
            this.getHomepageListPost();
        }
    }
    getHomepageListPost(){
        const {HomePage,HomePageActions}=this.props;
        const bodyDate={
            pageSize:this.pageSize,
            pageNow:this.pageIndex,
            toObj:2,
            goodsType:1,
            shopId:this.shopId,
            groupId:this.groupId,
        };
        HomePageActions.getHomepageList(HomePage.homePageList,bodyDate,(data,goods)=>{
            if(data===0){
                this.setState({isLoading:true});
                setTimeout(() => {
                    this.initData=true;
                }, 1000);
                if(goods.length<this.pageSize){
                    this.setState({requestCompleted:false});
                }
            }
        },function (err) {
            Toast.info('获取数据失败', 2);
        });

    }
    //页面销毁
    componentWillUnmount(){
        window.sessionStorage.setItem('top',2000);

    }
    onEndReached(){
        // alert("请求数据1");
        if(this.initData===false||this.state.requestCompleted===false){
            return false;
        }else {
            const {HomePage,HomePageActions}=this.props;
            const bodyDate={
                pageSize:this.pageSize,
                pageNow:this.pageIndex+1,
                toObj:2,
                goodsType:1,
                shopId:this.shopId,
                groupId:this.groupId,
            };
            this.initData=false;
            HomePageActions.getHomepageList(HomePage.homePageList,bodyDate,(data,goods)=>{
                if(data===0){
                    if(goods.length<this.pageSize){
                        this.setState({requestCompleted:false});
                    }
                    this.pageIndex=this.pageIndex+1;
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                }
            },function (err) {

            });
        }
    }

    clickCategory(groupId){//点击分组
        this.groupId = groupId;
        this.getHomepageListPost();
    }
    getCategoryView(){//分组
        const {HomePage}=this.props;
        return(
            <GroupingList {...this.props}
                ref={(div)=>{this.groupListView =div;}}
                          groupingListData={HomePage.groupingNameData}
                          selectCategory={(groupId)=>{
                              this.clickCategory(groupId)
                          }}
            />
        )
    }
    bannerExternalJump(val){
        if(val.linkUrl===""&&val.activityId===0){

        }else if(val.linkUrl!==""){
            window.location=val.linkUrl;
            // return;
        }else{
            let userInfo=db.readUserInfo();
            window.location = contants.commonServerUrl+"/activity.html?activityId="+val.activityId+"&enterpriseId="+userInfo.enterpriseId;
        }

    }
    getBannerView(){ //店铺头部
        const {HomePage}=this.props;
        let dic= HomePage.shopData;
        let type =dic&&dic.fitmentId?dic.fitmentId:1;
        switch(type) {
            case 1:
                return (
                    <div>
                        <div className="cover">
                            <div className="bgImg">
                                <img src={dic.backgroundUrl}  />
                            </div>
                            <div className="textContainer">
                                <div className="logoImg">
                                    <img src={dic.logoUrl} />
                                </div>
                                <div className="right">
                                    <div className="shopName">{dic?dic.shopName:''}</div>
                                    <div className="shopDescribes">
                                        {dic?dic.describes:''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <div className="coverTwo">
                            <div className="bgImg">
                                <img src={dic.backgroundUrl}  />
                            </div>
                            <div className="textContainer">
                                <div className="logoImg">
                                    <img src={dic.logoUrl} />
                                </div>
                                <div className="right">
                                    <div className="shopName">{dic?dic.shopName:''}</div>
                                    <div className="shopDescribes">
                                        {dic?dic.describes:''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 3:
            case 4:
                return (
                    <div>
                        <div className="coverThree">
                            <div className="bgImg">
                                <img src={dic.backgroundUrl}  />
                            </div>
                            <div className="textContainer">
                                <div className="logoImg">
                                    <img src={dic.logoUrl} />
                                </div>
                                <div className="right">
                                    <div className="shopName">{dic?dic.shopName:''}</div>
                                    <div className="shopDescribes">
                                        {dic?dic.describes:''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div className="coverFive">
                        <div className="imgContainer">
                            <div className="bgImg">
                                <img src={dic.backgroundUrl}  />
                            </div>
                            <img className="arcImg" src={require('../../images/homePage/arc.png')}  />
                            <div className="logoImg">
                                <img  src={dic.logoUrl} />
                            </div>
                            <div className="shopName">{dic?dic.shopName:''}</div>
                        </div>
                        <div className="textContainer">
                            <div className="shopDescribes">
                                {dic?dic.describes:''}
                            </div>
                        </div>
                    </div>
                )
                break;
        }

    }
    getFooterView(){
        const {HomePage} =this.props;
        if(HomePage&&HomePage.homePageList.length>0){
            return(
                <div className="listViewFoot">
                    <img className="imgLeft" />
                    {this.state.requestCompleted? <div className="loadingBody">
                        <span>加载中</span>
                    </div>: <div className="loadingBody">
                        <span>没有更多内容了</span>
                    </div>}
                    <img className="imgRight" />
                </div>
            )
        }
        else{
            return <div></div>
        }
    }

    getHat(){
        const {HomePage}=this.props;
        let dic= HomePage.shopData;
        let type =dic&&dic.fitmentId?dic.fitmentId:1;
        let row = (rowData, sectionID, rowID) => {
            return (
                <HatOne key={rowID} {...this.props} homePageList={rowData} shopId={this.shopId} />
            );
        };
        let row2 = (rowData, sectionID, rowID) => {
            return (
                <HatTwo key={rowID} {...this.props} homePageList={rowData} shopId={this.shopId} />
            );
        };
        let row3 = (rowData, sectionID, rowID) => {
            return (
                <HatThree key={rowID} {...this.props} homePageList={rowData} shopId={this.shopId} />
            );
        };
        let row4 = (rowData, sectionID, rowID) => {
            return (
                <HatFour key={rowID} {...this.props} homePageList={rowData} shopId={this.shopId} />
            );
        };
        let row5 = (rowData, sectionID, rowID) => {
            return (
                <HatThree key={rowID} {...this.props} homePageList={rowData} shopId={this.shopId} />
            );
        };
        switch (type){
            case 1:
                $(".homePageListView .am-list-body").css('background',"#ffffff");
                $(".homePageListView").css('background',"#f4f5f7");

                return row;
            case 2:
                $(".homePageListView .am-list-body").css('background',"#ffffff");
                $(".homePageListView").css('background',"#f4f5f7");
                return row2;
            case 3:
                $(".homePageListView .am-list-body").css('background',"#f4f5f7");
                $(".homePageListView").css('background',"#f4f5f7");
                return row3;
            case 4:
                $(".homePageListView .am-list-body").css('background',"#f4f5f7");
                return row4;
            case 5:
                $(".homePageListView").css('background',"#f4f5f7");
                // $(".homePageListView .am-list-body").css('background',"#f4f5f7");
                return row5;
        }
        return row
    }
    isShowBlackView(){//是否显示空白界面
        const {HomePage}=this.props;
        let dic= HomePage.shopData;
        if(HomePage.homePageList.length>0||(dic.logoUrl&&dic.logoUrl.length>0)||(dic.describes&&dic.describes.length>0)){
            return false
        }
        return true;
    }
    contact() { // 在线客服
        let userInfo = db.readUserInfo();
        let shopId = this.shopId;
        const { history } = this.props;
        if(userInfo === null){
            history.push({
                pathname:contants.commonUrl+'/login/?shopId='+this.shopId,
                state:{
                    pathname:contants.commonUrl+'/chatV?shopId='+this.shopId,
                    type:5
                }
            });
        }else {
            // console.log(db.readUserInfo(), '************')
            let userChartInfo={
                userId: db.readUserInfo()["userId"],
                userHeadUrl: db.readUserInfo()["headUrl"],
                shopId:this.shopId,
                userName: db.readUserInfo()["userNickname"],
            };
            let query = '';
            
            Object.keys(userChartInfo).forEach((key) => {
                query += `${key}=${userChartInfo[key]}&`
            })   
            window.location.href = "//192.168.9.41/customer-service/#/?" + query;
            // window.location.href = "//172.22.200.69:3000/#/?" + query;

        }
    }
    render() {
        const {HomePage}=this.props;
        let row = this.getHat();
        let homePageListNumber=HomePage.homePageList.length;
        let currentPage=parseInt(homePageListNumber/this.pageSize);
        if(parseInt(homePageListNumber%this.pageSize)>0){
            this.pageIndex=currentPage+1;
        }else {
            if (currentPage>1){
                this.pageIndex=currentPage;
            }
        }
        return ( //
            <div className="mainView">
                <div className={this.isShowBlackView()===true?"homePageBodyBlank":"homePageBody"}>
                    <Navigation {...this.props} title={HomePage.shopData.shopName} shopId={this.shopId} shopName={HomePage.shopData.shopName}/>
                    {HomePage.isShopFrozen ? <Frozen message="该店铺正在闭关修炼中..." /> : this.isShowBlackView() ? <div className="blankView">
                        <img src={require('../../images/homePage/blank.png')}/>
                        <div>店铺正在装修中,敬请期待</div>
                    </div>:
                        <ListView
                            ref="list"
                            dataSource={this.state.dataSource.cloneWithRows(HomePage.homePageList)}
                            renderHeader={()=>{
                                return(<div>
                                    {this.getBannerView()}
                                    {this.getCategoryView()}
                                </div>)
                            }}
                            renderFooter={this.getFooterView.bind(this)}
                            renderRow={row}
                            style={{
                                height: document.documentElement.clientHeight ,
                            }}
                            scrollEventThrottle={600}
                            onEndReached={this.onEndReached.bind(this)}
                            onEndReachedThreshold={600}
                            useBodyScroll={true}
                            initialListSize={20}
                            className="homePageListView"/>
                    }
                </div>
                {(this.isShowBlackView() || this.state.isShowServer) ? null :
                    <div className="contact" onClick={() => this.contact()}>
                      
                        <div className="shadow-box clear">
                            <SvgImg className="icon" style={{ fill: "#D00510" }} xlinkHref="#wedo-wedoicon-24" />
                            <span>在线客服</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}