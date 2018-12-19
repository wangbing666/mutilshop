/**
 * Created by nipeng on 2017/11/30.
 *
 * 评论UI
 *
 */

import React,{Component} from 'react';
import './PPCommontManage.less';
import '../../../common/styles/common.less'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
//import {wxShare} from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg'
import {Modal} from 'antd-mobile';
const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';

export default class PPCommontManage extends Component{

    constructor(props){
        super(props);
        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)
        let userInfo = Util.readUserInfo();

        this.state={
            commentText:'',
            shopId:theRequest['shopId'],
            userId:theRequest['userId'],
            storyId:theRequest['storyId'],
        }
    }
    componentDidMount() {

      document.getElementById("commontId").focus();
    }


    render(){

        return(
            <div className="containerp" id="containerp"  onClick={()=>{this.selectCommonAction()}}>

                <div className="inputContainer">
                        <input id="commontId" focus={true} placeholder="请输入评论内容" value={this.state.commentText}
                               maxLength="400"
                               onChange={(e)=>{
                                   let text = e.target.value;
                                   {/*if(text.length===0){*/}
                                       {/*this.setState({commentText:e.target.value})*/}
                                   {/*}*/}
                                   {/*let reg = /^[\u4E00-\u9FA5A-Za-z0-9¥\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+$/;*/}
                                   {/*if (reg.test(text)) {*/}
                                   {/*}*/}
                                   {/*else{*/}
                                       {/*return;*/}
                                   {/*}*/}
                                   this.setState({commentText:e.target.value})
                               }
                               }
                        />
                        <div className="realese" onClick={()=>this.relesaeComment()}>
                            发布
                        </div>
                </div>
            </div>

        )
    }
    relesaeComment(){

        // alert('辅导费')



        if(this.state.commentText.length===0){
            alert('请输入评论内容');
            return;
        }
        if($.trim(this.state.commentText.toString())===""){
            alert("请输入评论信息")
            return;
        }
        let dicData = {
            storyId:this.state.storyId, // 故事id
            userId:this.state.userId,//
            comment:this.state.commentText,
            targetCommentId:0,//其他表示要回复的那条评论的id 0表示是对故事的评价，不回复任何人
        }


        const {PPStoryDetailsAction,PPStoryDetailsReducer} = this.props;


        PPStoryDetailsAction.getCommontPost(dicData,PPStoryDetailsReducer.commontNumber,(callBack)=>{

            if (callBack){

                alert('评论成功');
            }
        })

    }


    selectCommonAction(){

        this.props.getShow()
    }
    inputAction(){

        // document.getElementById("commontId").stopPropagation();

    }




}









