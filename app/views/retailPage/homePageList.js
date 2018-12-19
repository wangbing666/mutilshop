/**
 * Created by AndyWang on 2017/7/12.
 */
import React,{Component} from 'react';
import './homePage.less';
import CarouselFigure from './carouselFigure';//轮播图
import Hat from './hatList';//帽子列表
import ViewMore from './viewMore';//查看更多
import HatlistGoods from '../listGoods/hatListGoods';//单个帽子
import * as contants from '../../../common/Apis/constants'


export default class HomePageList extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            homePageList:this.props.homePageList,
            groupOne:[],
            groupTow:[],
            groupThree:[],
            group:null,//总组数
            remainder:null//最后个数
        }
    }

    slideUpDown(goodList){
       // console.log(goodList);
        if(goodList.length===0){
            return null;
        }else {
            return(
                <div className="hatListTow">
                    <div className="hatListBody">
                        {goodList.map((val,index)=>{
                            return(
                                <Hat key={index} hatData={val} {...this.props}/>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }
    //帽子列表上下滑动
    render() {
        let homePageList=this.state.homePageList;
        this.props.viewStyDic;
        return (
            <div className="commodity">
                <img className="bannerHostImg" onClick={()=>{this.goPartition(homePageList)}} src={homePageList.bannerHostUrl+homePageList.bannerFileUrl}/>
                {this.slideUpDown(this.state.homePageList.goodsList)}
            </div>
        )
    }
    goDetails(){
        const {history}=this.props;
        window.sessionStorage.removeItem('listGoods');
        history.push({
            pathname:contants.commonUrl+'/listGoods',
            state:{
                banners:this.state.homePageList.banners,
                goodsGroup:this.state.homePageList.goodsGroup
            }
        });
    }
    //分区列表页面
    goPartition(homePageList){
        window.sessionStorage.removeItem('partition');
        const {history}=this.props;
        history.push({
            pathname:contants.commonUrl+'/partition',
            state:{
                partitionCenter:homePageList
            }
        });
    };
}