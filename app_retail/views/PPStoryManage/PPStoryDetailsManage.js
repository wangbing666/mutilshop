/**
 * Created by nipeng on 2017/11/28.
 * 故事详情
 */

import React,{Component} from 'react';
import './PPStoryDetailsManage.less';
import '../../../common/styles/common.less';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import SvgImg from '../../../common/svgImage/svgImg';
import PPStoryCell from './PPStoryCell';
import { Carousel } from 'antd-mobile';
import PPCommontManage from './PPCommontManage'



import {Modal} from 'antd-mobile';
const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';


export default class PPStoryDetailsManage extends Component{

    constructor(props){
        super(props);

        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)
        let userInfo = Util.readUserInfo();
        this.state={
            isLove:false,
            toIndex:1,
            isShowCommont:false,
            shopId:theRequest['shopId'],
            userId:theRequest['userId'],
            storyId:theRequest['storyId'],
            title:'',
            content:'',
            picture:'',
            shareContent:'',
            storyDetailsArray:[],
        }

    }


    componentWillMount() {


    }

    getNetworkData(isTrue){

        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;
        var  that = this;
        console.log(that.state.userId);
        let dicData = {
            userId:that.state.userId,
            storyId:that.state.storyId,
        }

        PPStoryDetailsAction.getStoryDetailsPost(dicData,(callBack)=>{

            if (callBack){
                let  title = '';
                let  content = '';
                let  picture = '';
                let  shareContent = '';
                let  storyDetailsArray = [];

                if (callBack.title!==null){
                    title = callBack.title;
                }
                if (callBack.details.length!==0){
                    if (callBack.details[that.state.toIndex-1].goodsName!==null){

                        shareContent = '推荐'+'"'+(callBack.details[that.state.toIndex-1].goodsName)+'"'+',快来关注哦~';

                        if (shareContent.length>12){
                            shareContent = shareContent.substr(0,12)+'...';
                        }

                    }
                    if (callBack.details[that.state.toIndex-1].story !== null){
                        content = callBack.details[that.state.toIndex-1].story;
                    }
                    if (callBack.details[that.state.toIndex-1].hostUrl!==null){
                        if (callBack.details[that.state.toIndex-1].fileUrl !== null){
                            picture = callBack.details[that.state.toIndex-1].hostUrl+callBack.details[that.state.toIndex-1].zoomUrl;
                        }
                    }
                    storyDetailsArray = callBack.details;
                }
                that.setState({
                    title:title,
                    content:content,
                    picture:picture,
                    shareContent:shareContent,
                    storyDetailsArray:storyDetailsArray
                })


                if (isTrue){

                    let  datas ={
                        titles:callBack.title,

                    }
                    // alert('发对方')
                    let dic = {
                        h5ToRn:true,
                        types:JSON.stringify({type:'6'}),
                        data:JSON.stringify(datas),
                    }
                    window.postMessage(JSON.stringify(dic))


                }
            }

        })

    }


    componentDidMount() {

        // console.log('范德萨发发第三方但是发')


        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;

        var  that = this;

        that.getNetworkData()

        let getDatas=function (data){

            // alert('发对方');
            let type  = JSON.parse(data.data);

            // alert(JSON.stringify(type))

            let tempDic = JSON.parse(type);
            if(tempDic.type==='1'|| tempDic.type==='3'){ // 分享和删除

                // alert('范德萨发')

                let  datas ={
                    shopId:that.state.shopId.toString(),
                    goodsId:"0",//没有商品id写0
                    title:that.state.title.toString(),//商品
                    content:that.state.content.toString(),//分享center
                    picture:that.state.picture.toString(),//商品或店铺图片
                    shareContent:that.state.shareContent.toString(),// 分享content
                    enterpriseId:'0',
                    url:'/?shopId='+that.state.shopId+'&storyId='+that.state.storyId+'&userId='+that.state.userId,
                    storyId:that.state.storyId.toString(),
                    shareSmallType:'12',
                    storyDetailsArray:that.state.storyDetailsArray,
                }
                // alert('发对方')
                let dic = {
                    h5ToRn:true,
                    types:type,
                    data:JSON.stringify(datas),
                }
                window.postMessage(JSON.stringify(dic))

            }

            if(tempDic.type==="2"){   // 编辑
                // alert('编辑回调');

                if (tempDic.isNumberss==='0'){
                    let  datas ={
                        shopId:that.state.shopId,
                        goodsId:"0",//没有商品id写0
                        title:that.state.title,//商品
                        content:that.state.content,//分享center
                        picture:that.state.picture,//商品或店铺图片
                        enterpriseId:0,
                        url:'storyDetailsBuyerManage'+'/?shopId='+that.state.shopId+'&storyId='+that.state.storyId+'&userId='+that.state.userId,
                        storyId:that.state.storyId,
                        shareSmallType:'12',
                        storyDetailsArray:that.state.storyDetailsArray,
                    }

                    let dic = {
                        h5ToRn:true,
                        types:type,
                        data:JSON.stringify(datas),
                    }
                    window.postMessage(JSON.stringify(dic))

                }

                if (tempDic.isNumberss === '1'){
                    that.getNetworkData(true)
                }

            }

            if(tempDic.type==="5"){  // 刷新评论数

                that.getNetworkData();
            }


            }

        document.addEventListener("message", getDatas);

       

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
                            <p className="payTextStyle">查看详情</p>
                        </div>:null:null}

                    </div>

                    <div className="textStyleDiv">
                        <p className="storyThemeStyle">{PPStoryDetailsReducer.storyDetailsArray.length!==0?PPStoryDetailsReducer.storyDetailsArray[this.state.toIndex-1].story:''}</p>
                    </div>

                </div>

                <div className="commontDivStyle">
                    <div className="commontButton" onClick={()=>{this.commontAction()}}>
                        <p className="commontText">点击发表评论…</p>
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

        let tempDic = {
            type:'4'
        }

        let dic = {
            h5ToRn:true,
            types:JSON.stringify(tempDic),
            data:goodsId
        }
        window.postMessage(JSON.stringify(dic))

    }


//
    titleAction(from, to){

        console.log(`slide from ${from} to ${to}`)
        this.setState({
            toIndex:to+1

        })
    }
    loveAction(isLove){


        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;

        let dicData = {
            userId:this.state.userId,
            storyId:this.state.storyId,
            type:PPStoryDetailsReducer.isLove?2:1
        }
        PPStoryDetailsAction.getLovePost(dicData,PPStoryDetailsReducer.isLikeNumber,(callBack)=>{

        })
    }

    commontAction(){
        // alert('23儿3然')

        console.log('2134324寸')
        this.setState({

            isShowCommont:!this.state.isShowCommont

        })



    }
    selectCommonAction(){
        // 点击进入评论列表
        let datas = {
            shopId:this.state.shopId,
            storyId:this.state.storyId
        }


        let tempDic = {
            type:'5'
        }

        let dic = {
            h5ToRn:true,
            types:JSON.stringify(tempDic),
            data:JSON.stringify(datas)
        }
        window.postMessage(JSON.stringify(dic))

    }

}










