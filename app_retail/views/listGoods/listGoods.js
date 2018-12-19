/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import CarouselFigure from '../homePage/carouselFigure';//轮播图
import HatlistGoods from './hatListGoods';//单个帽子
import Navigation from '../homePage/navigation';//顶部导航
import { ListView } from 'antd-mobile';
import * as contants from '../../common/Apis/constants'
import {wxShare} from '../../common/Apis/wxJsApis'
import * as db from '../../common/Apis/Utils';

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
    }
    //reader前
    componentWillMount(){
        if(db.userAgent()==='Android'){
            document.title='';
        }else{
            db.setPageTitle('');
        }
    }
    componentDidMount(){
        wxShare([],{});
        const {ListGoods,ListGoodsActions}=this.props;
        let groupId=this.props.location.state.groupId;//分类id
       // console.log("类型id",groupId);
        ListGoodsActions.groupingDetails("/goods/getGroupDetail",{groupId:groupId,pageIndex:0,pageSize:0},(data)=>{
        },(err)=>{});
        if(window.sessionStorage.getItem('listGoods')){
            this.initData=true;
        }else{
            this.pageIndex=1;
            let url="/shopping/btaingroup";
            let data={
                userId:0,
                groupId:groupId,
                pageSize:this.pageSize,
                pageIndex:this.pageIndex
            };
            ListGoodsActions.commodityListData([]);
            ListGoodsActions.commodityList(ListGoods.commodityList,url,data,(goodsList)=>{
                if(goodsList.length<this.pageSize){
                    this.setState({requestCompleted:false});
                }else {
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                }
            },()=>{});
        }
    };
    //页面销毁
    componentWillUnmount(){
        this.pageIndex=1;
        const {ListGoods,ListGoodsActions}=this.props;
        window.sessionStorage.setItem('listGoods',1000)
    }
    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <HatlistGoods key={rowID} hatData={rowData} {...this.props}/>
            );
        };

       // console.log(transferDate);
        const {ListGoods,ListGoodsActions}=this.props;
        //console.log("列表数据",ListGoods.commodityList);
        let commodityListNumber=ListGoods.commodityList.length;
        let currentPage=parseInt(commodityListNumber/this.pageSize);
        if(parseInt(commodityListNumber%this.pageSize)>0){
            this.pageIndex=currentPage+1;
        }else {
            if (currentPage>1){
                this.pageIndex=currentPage;
            }
        }
        console.log("分组详情",ListGoods.groupingDetailsData);
        let groupingDetails=ListGoods.groupingDetailsData;
      return(
          <div className="ListGoodsBody">
              <Navigation  {...this.props}/>
              <ListView
                  ref="listview"
                  dataSource={this.state.dataSource.cloneWithRows(ListGoods.commodityList)}
                  renderRow={row}
                  renderHeader={() => {
                      if(groupingDetails===[]){
                          return(
                              <div></div>
                          )
                      }else{
                          return(
                              <div className="listGoodTop">
                                  <div className="commodityType">
                                      <div className="cTypeCName">
                                          <img className="typeLeft" />
                                          <span>{groupingDetails.groupName}</span>
                                          <img className="typeRight" />
                                      </div>
                                      <div className="cTypeEName">
                                          <span>{groupingDetails.anotherName}</span>
                                      </div>
                                      <div className="tryOutBodyTow">
                                          {/*<span>试运营</span>*/}
                                      </div>
                                  </div>
                                  {groupingDetails.bannerlist===[]?<div>qwq</div>:<CarouselFigure banners={groupingDetails.bannerlist} {...this.props}/>}
                              </div>
                          )
                      }
                  }}
                  renderFooter={() => (<div className="listViewFoot">
                      <img className="imgLeft" />
                      {this.state.requestCompleted ? <span>加载中...</span> : <span>没有更多内容了</span>}
                      <img className="imgRight" />
                  </div>)}
                  className="hatListView"
                  style={{
                      height: document.documentElement.clientHeight
                  }}
                  scrollEventThrottle={200}
                  onEndReached={this.onEndReached.bind(this)}
                  onEndReachedThreshold={0}
                  useBodyScroll={true}
                  initialListSize={50}
                 />
          </div>
      )
    }
    onEndReached(){
        const {ListGoods,ListGoodsActions}=this.props;
        let groupId=this.props.location.state.goodsGroup.groupId;
        if(this.initData===false||this.state.requestCompleted===false){

        }else {
            let url="/shopping/btaingroup";
            let data={
                userId:0,
                groupId:groupId,
                pageSize:this.pageSize,
                pageIndex:this.pageIndex+1
            };
            ListGoodsActions.commodityList(ListGoods.commodityList,url,data,(goodsList)=>{
                console.log(goodsList.body.goodsList.list.length);
                if(goodsList.body.goodsList.list.length<this.pageSize){
                    this.setState({requestCompleted:false});
                }else {
                    setTimeout(() => {
                        this.initData=true;
                    }, 1000);
                }
                this.pageIndex=this.pageIndex+1;
            },()=>{});
        }
    }
}