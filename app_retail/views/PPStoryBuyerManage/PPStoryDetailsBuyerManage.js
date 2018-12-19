/**
 * Created by nipeng on 2017/11/28.
 * 故事详情
 */

import React,{Component} from 'react';
import './PPStoryDetailsBuyerManage.less';
import '../../../common/styles/common.less';
import * as db from '../../../common/Apis/Utils';

import {wxShare} from '../../../common/Apis/wxJsApis';
// import SvgImg from '../../common/svgImage/svgImg';
// import PPStoryCell from './PPStoryBuyerCell';
import { Carousel } from 'antd-mobile';
import PPCommontManage from './PPCommontBuyerManage'

import {Modal} from 'antd-mobile';
const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';

import * as contants from '../../../common/Apis/constants'


export default class PPStoryDetailsBuyerManage extends Component{

    constructor(props){
        super(props);

        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)
        let userInfo = Util.readUserInfo();
        // alert(JSON.stringify(userInfo))
        this.state={
            isLove:false,
            toIndex:1,
            isShowCommont:false,
            shopId:theRequest['shopId'],
            userId:userInfo!==null?userInfo.wedoId:0,
            storyId:theRequest['storyId'],

        }

    }


    componentWillMount() {


    }

    componentDidMount() {

        // console.log('范德萨发发第三方但是发')

        // alert('单位发的是');


        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;
        let dicData = {
            userId:this.state.userId,
            storyId:this.state.storyId,
        }
        console.log('>>>>>>>>>>>')
        console.log(location.href.toString())
        PPStoryDetailsAction.getStoryDetailsPost(dicData,(callBack)=>{

            if (callBack){
                if(db.userAgent()==='Android'){
                    document.title=callBack.title.toString();
                }else{
                    db.setPageTitle(callBack.title.toString());
                }

                let shareContent = '推荐'+'"'+(callBack.details.length!==0?callBack.details[0].goodsName:'')+'"'+',快来关注哦~';

                if (shareContent.length>12){
                    shareContent = shareContent.substr(0,12)+'...';
                }


                let storyDic = {
                    shopId:this.state.shopId.toString(),
                    goodsId:"0",
                    title:callBack.title.toString(),
                    content:shareContent.toString(),
                    picture:(callBack.details[0].hostUrl+callBack.details[0].zoomUrl).toString(),
                    enterpriseId:'0',
                    url:(contants.commonServerUrl + '/storyDetailsBuyerManage' + '/?storyId=' + this.state.storyId + '&shopId=' + this.state.shopId).toString(),
                    shareType:'12',
                    sourceType:'1',
                    storyId:this.state.storyId.toString()

                }
                //微信分享所需参数
                const dic = {
                    title: storyDic.title,
                    desc: storyDic.content,// ????
                    imgUrl: storyDic.picture,
                    linkUrl: storyDic.url
                };
                wxShare([], dic, true);
                contants.storyDetails = storyDic

            }

        })


    }



    render(){
        console.log(this.state.toIndex)

        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;

        console.log(PPStoryDetailsReducer.storyDetails);

        console.log(this.state.isShowCommont);

        return(
            <div className="containeryD">


                <div className="blackStyle"/>
                <Carousel className="covers"
                          autoplay={false}
                          infinite={false}
                          dots = {false}
                          beforeChange={(from, to) => this.titleAction(from, to)}
                    // selectedIndex={0}
                    // swipeSpeed={35}
                    // dotStyle={{width:'20px',height:'6px',background:'white',marginBottom:'8px'}}
                    // dotActiveStyle={this.state.viewStyDic?{background:this.state.viewStyDic.firstColor}:null}
                >
                    {PPStoryDetailsReducer.storyDetailsArray.map((val,index)=>{
                        return(
                            <img key={index}  src={val.hostUrl+val.fileUrl}/>
                        )
                    })}
                </Carousel>
                <div className="textArrayStyle">

                    <div className="storyIndex">
                        <div className="indexStyle">
                            <div className="numberIndexTextStyle">
                                <p className="numberIndex">{this.state.toIndex}</p>
                                <p className="numberGang">/</p>
                                <p className="numberIndexs">{PPStoryDetailsReducer.storyDetailsArray.length}</p>
                            </div>

                            <p className="ellips titleIndex">{PPStoryDetailsReducer.storyDetailsArray.length!==0?PPStoryDetailsReducer.storyDetailsArray[this.state.toIndex-1].goodsName:''}</p>
                        </div>

                        {PPStoryDetailsReducer.storyDetailsArray.length!==0?PPStoryDetailsReducer.storyDetailsArray[this.state.toIndex-1].goodsUrl.length!==0?<div className="payDivStyle" onClick={()=>{this.payAction(PPStoryDetailsReducer.storyDetailsArray.length!==0?PPStoryDetailsReducer.storyDetailsArray[this.state.toIndex-1].goodsUrl:'')}}>
                            <p className="payTextStyle">立即购买</p>
                        </div>:null:null}
                    </div>

                    <div className="textStyleDiv">
                        <p className="storyThemeStyle">{PPStoryDetailsReducer.storyDetailsArray.length!==0?PPStoryDetailsReducer.storyDetailsArray[this.state.toIndex-1].story:''}</p>
                    </div>

                </div>

                <div className="commontDivStyle">
                    <div className="commontButton" onClick={()=>{this.commontAction()}}>
                        <p className="commontText">点击发表评论</p>
                    </div>

                    <div className="loveOrCommontButton">

                        <div className="commontIconStyle" onClick={()=>{this.selectCommonAction()}}>

                            <img className="commentIconStyle" src={require('../../images/storyPage/storyCommontIcon.png')}/>
                            <p className="ellips loveOrCommontTextStyle">{PPStoryDetailsReducer.commontNumber}</p>

                        </div>

                        <div className="commontIconStyle" onClick={()=>{this.loveAction(PPStoryDetailsReducer.isLove)}}>
                            {
                                PPStoryDetailsReducer.isLove?<img className="loveIconStyle" src={require('../../images/storyPage/love.png')}/>:<img className="loveIconStyle" src={require('../../images/storyPage/storyLoveIcon.png')}/>
                            }

                            <p className="ellips loveOrCommontTextStyle">{PPStoryDetailsReducer.isLikeNumber}</p>
                        </div>

                    </div>

                </div>

                {this.state.isShowCommont?<PPCommontManage getShow={()=>this.setShowAction()} {...this.props}/>:null}

                {PPStoryDetailsReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div> :null}

            </div>

        )

    }
    setShowAction(){


        this.setState({
            isShowCommont:false
        })


    }
    payAction(goodsId){
        // 立即购买  跳到商品详情
        const {history}=this.props;
        history.push({
            pathname:contants.commonUrl+'/goodDetails'+'/?shopId='+this.state.shopId+'&goodsId='+goodsId
        });

    }


//
    titleAction(from, to){

        console.log(`slide from ${from} to ${to}`)
        this.setState({
            toIndex:to+1

        })
    }
    loveAction(isLove){


        let userInfo = db.readUserInfo();

        if (userInfo===null){
            const {history}=this.props;
            history.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    type:8,
                }
            });
        }else {
            const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;

            let dicData = {
                userId:this.state.userId,
                storyId:this.state.storyId,
                type:PPStoryDetailsReducer.isLove?2:1
            }
            PPStoryDetailsAction.getLovePost(dicData,PPStoryDetailsReducer.isLikeNumber,(callBack)=>{

            })
        }



    }

    commontAction(){

        let userInfo = db.readUserInfo();

        if (userInfo===null){
            const {history}=this.props;
            history.push({
                pathname:contants.commonUrl+'/login',
                state:{
                    type:6,
                }
            });
        }else {
            this.setState({

                isShowCommont:!this.state.isShowCommont

            })
        }
    }
    selectCommonAction(){
        // 点击进入评论列表
        const {history}=this.props;
        history.push({
                pathname:contants.commonUrl+'/commentList'+'/?shopId='+this.state.shopId+'&storyId='+this.state.storyId
        });
    }


}










