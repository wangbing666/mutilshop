/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import CarouselFigure from '../homePage/carouselFigure';//轮播图
// import HatlistGoods from './hatListGoods';//单个帽子
import HatlistGoods from '../homePage/HatThree';//单个帽子
import Navigation from '../homePage/navigation';//顶部导航
import { ListView } from 'antd-mobile';
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import { Carousel } from 'antd-mobile';
import './commodityType2.less'
import {viewStyDic} from '../../../common/Apis/constants'

export default class ListGoods extends Component {
    constructor(...args) {
        super(...args);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData=false;
        this.pageIndex=1;
        this.pageSize=20;//没页条数
        this.state={
            dataSource: dataSource,
            isLoading: true,
            requestCompleted:true//是否还有更多数据
        }
        this.theRequest=db.getValueFromUrl(location.search)
    }
    //reader前
    componentWillMount(){
      
    }
    componentDidMount(){
        // let userId = db.readUserInfo()['userId']
        if(db.userAgent()==='Android'){
            document.title= contants.shopName;
        }else{
            db.setPageTitle(contants.shopName);
        }
        wxShare([],{});
        const {ListGoods,ListGoodsActions}=this.props;
        let theRequest = this.theRequest
        this.type =theRequest['type']
        this.groupId=theRequest['groupId']
        this.shopId=theRequest['shopId']
        if(parseInt(this.type)===1){ //点击分类
            ListGoodsActions.groupingDetails("/goods/getGroupDetail",{groupId:this.groupId,pageIndex:0,pageSize:0},(data)=>{
            },(err)=>{});
            if(window.sessionStorage.getItem('listGoods')){
                this.initData=true;
            }else{
                this.pageIndex=1;
                let data={
                    userId:0,
                    groupId:this.groupId,
                    pageSize:this.pageSize,
                    pageIndex:this.pageIndex
                };
                ListGoodsActions.commodityListData([]);
                ListGoodsActions.commodityList(ListGoods.commodityList,data,(goodsList)=>{
                    if(goodsList.length<this.pageSize){
                        this.setState({requestCompleted:false});
                    }else {
                        setTimeout(() => {
                            this.initData=true;
                        }, 1000);
                    }
                },()=>{});
            }
        }
        else { //点击 分区
            ListGoodsActions.getPartionInfoPost(this.groupId,()=>{},()=>{});
            if(window.sessionStorage.getItem('listGoods')){
                this.initData=true;
            }else{
                this.pageIndex=1;
                ListGoodsActions.getPartionListPost([],this.groupId,this.pageIndex,this.pageSize,(goodsList)=>{
                    if(goodsList.length<this.pageSize){
                        this.setState({requestCompleted:false});
                    }else {
                        setTimeout(() => {
                            this.initData=true;
                        }, 1000);
                    }
                },()=>{});
            }
        }
    };
    //页面销毁
    componentWillUnmount(){
        this.pageIndex=1;
        const {ListGoods,ListGoodsActions}=this.props;
        window.sessionStorage.setItem('listGoods',1000)
    }

    //isOutreach 1 外链 0 内链  点击分组banner
    externalJump(isOutreach,outreachUrl,Goodid){
        if(isOutreach===1){
            window.location=outreachUrl;
        }else if(Number(Goodid) !== 0){
            const {history}=this.props;
            let url = contants.commonUrl+'/goodDetails'+'/?shopId='+this.shopId+'&goodsId='+Goodid;
            history.push({
                pathname:url,
                state:{
                }
            });
        }
    };
    clickDepartJumpIntoUrl(data){//点击分区图片,跳转
        if(data.bannerUrl){
            window.location=data.bannerUrl;
        }
    }

    getHeadView() {
        const {ListGoods,ListGoodsActions}=this.props;
        let groupingDetails = ListGoods.groupingDetailsData;
        let partitionInfo = ListGoods.partitionInfo;
        if(parseInt(this.type)===1){
            if(groupingDetails===null){
                return(<div></div>)
            }else{
                return(
                    <div className="listGoodTop">
                        <div className="commodityType">
                            <div className="grounpContainer" style={{backgroundColor:viewStyDic.COLOR1}}>
                                <div className="leftImg"></div>
                                <div className="grounpName" style={{color:viewStyDic.COLOR3}}>{groupingDetails.groupName}</div>
                                <div className="rightImg"/>
                            </div>
                        </div>
                        {groupingDetails.bannerlist.length===0?<div></div>:
                        groupingDetails.bannerlist.length===1
                            ?                <div>
                            <div className="listcover">
                                {groupingDetails.bannerlist.map((val,index)=>{
                                    return(
                                        <img key={index}  onClick={()=>{this.externalJump(val.isOutreach,val.outreachUrl,val.inGoodid)}} src={val.hostUrl+val.bannerUrl} style={{width:"100%"}}/>
                                    )
                                })}
                            </div>
                        </div>
                            :
                            <Carousel className="listcover"
                                      autoplay={true}
                                      infinite={true}
                                      selectedIndex={0}
                                      swipeSpeed={35}
                                      dotStyle={{width:'10px',height:'1px',background:'white',marginBottom:'4px',borderRadius:0}}
                                      dotActiveStyle={contants.viewStyDic?{background:contants.viewStyDic.COLOR1,borderColor:contants.viewStyDic.COLOR1}:null}

                            >
                                {groupingDetails.bannerlist.map((val,index)=>{
                                    return(
                                        <img key={index}  onClick={()=>{this.externalJump(val.isOutreach,val.outreachUrl,val.inGoodid)}} src={val.hostUrl+val.bannerUrl}/>
                                    )
                                })}
                            </Carousel>
                        }
                    </div>
                )
            }
        }
        else{
            let ary =[]
            if(partitionInfo===null){
                return(<div></div>)
            }else{
                ary=[{
                    bannerUrl:partitionInfo.bannerFileUrl,
                    hostUrl:partitionInfo.bannerHostUrl,
                }]
                return(
                    <div className="listGoodTop">
                        <div className="commodityType">
                            <div className="grounpContainer" style={{backgroundColor:viewStyDic.COLOR1}}>
                                <div className="leftImg"></div>
                                <div className="grounpName" style={{color:viewStyDic.COLOR3}}>{partitionInfo.title}</div>
                                <div className="rightImg"/>
                            </div>
                        </div>
                        <div>
                            <div className="listcover">
                                {ary.map((val,index)=>{
                                    return(
                                        <img key={index } className="listcover"  onClick={()=>{this.clickDepartJumpIntoUrl(partitionInfo)}} src={val.hostUrl+val.bannerUrl}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
    render() {
        
        const row = (rowData, sectionID, rowID) => {
            
            return (
                <HatlistGoods key={rowID} hatData={rowData} {...this.props} shopId={this.shopId}/>
            );
        };
        // console.log(this.props)
        const {ListGoods,ListGoodsActions}=this.props;
        
        // let ListGoods = this.ListGoods;

        let commodityListNumber=ListGoods.commodityList.length;
        let currentPage=parseInt(commodityListNumber/this.pageSize);
        if(parseInt(commodityListNumber%this.pageSize)>0){
            this.pageIndex=currentPage+1;
        }else {
            if (currentPage>1){
                this.pageIndex=currentPage;
            }
        }
        let groupingDetails=ListGoods.groupingDetailsData;
      return(
          <div className="ListGoodsBody">
              <ListView
                  ref="listview"
                  dataSource={this.state.dataSource.cloneWithRows(ListGoods.commodityList)}
                  renderRow={row}
                  renderHeader={this.getHeadView.bind(this)}
                  renderFooter={() => (<div className="listViewFoot">
                      <img className="imgLeft" />
                      {this.state.requestCompleted ? <span>加载中...</span> : <span>没有更多内容了</span>}
                      <img className="imgRight" />
                  </div>)}
                  className="hatListView"
                  style={{
                      height: document.documentElement.clientHeight
                  }}
                  onEndReached={this.onEndReached.bind(this)}
                  useBodyScroll={true}
                  scrollRenderAheadDistance={200}
                  scrollEventThrottle={20}
                  onEndReachedThreshold={10}
                  initialListSize={50}
                 />
          </div>
      )
    }
    onEndReached(){
        
        const {ListGoods,ListGoodsActions}=this.props;
        if(this.initData===false||this.state.requestCompleted===false){
        }else {
            this.initData=false;
            // console.log('will '+this.pageIndex)
            if(parseInt(this.type)===1) {//点击分类进来
                let data={
                    userId:0,
                    groupId:this.groupId,
                    pageSize:this.pageSize,
                    pageIndex:this.pageIndex+1
                };
                ListGoodsActions.commodityList(ListGoods.commodityList,data,(goodsList)=>{
                    if(goodsList.length<this.pageSize){
                        this.setState({requestCompleted:false});
                    }else {
                        this.pageIndex=this.pageIndex+1;
                        setTimeout(() => {
                            this.initData=true;
                        }, 1000);
                    }
                },()=>{});
            }
            else {
                ListGoodsActions.getPartionListPost(ListGoods.commodityList,this.groupId,this.pageIndex+1,this.pageSize,(goodsList)=>{
                    if(goodsList.length<this.pageSize){
                        this.setState({requestCompleted:false});
                    }else {
                        this.pageIndex=this.pageIndex+1;
                        // console.log(this.pageIndex)
                        setTimeout(() => {
                            this.initData=true;
                        }, 1000);
                    }
                },()=>{});
            }
        }
    }
}