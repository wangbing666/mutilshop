/**
 * Created by chengjiabing on 17/11/24.
 */
import React,{Component,} from 'react';
import {ActivityIndicator,WhiteSpace, ListView,RefreshControl,Modal, PullToRefresh,Toast} from 'antd-mobile';
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants'
import Alert from '../../../common/components/Alert'
const alert = Modal.alert;
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import {readUserInfo} from '../../../common/Apis/Utils'
import  './comment.less'
import {getValueFromUrl} from '../../../common/Apis/Utils'
export  default class CommentList extends Component
{
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource:dataSource,
            refreshing: false,
            commentText:'',
            requestCompleted:false,//获取到全部数据
            showLoading:false,
            showBlackView:false
        };
        this.lastId=0;
        this.pageSize=10;
        this.getMoreData=false;//正在获取数据
        var localUrl = location.search; //获取url中"?"符后的字串
        let theRequest = getValueFromUrl(localUrl)
        this.shopId=theRequest['shopId']
        this.storyId=theRequest['storyId']
        this.urlUserId=theRequest['userId']
    }

    componentDidMount() {
        const {commentListAction}=this.props;
        if(db.userAgent()==='Android'){
            document.title='评论列表';
        }else {
            db.setPageTitle('评论列表');
        }
        commentListAction.getCommentListPost([],this.pageSize,1,this.lastId,this.storyId,(lastComment,length)=>{
            if(lastComment){
                this.lastId=lastComment.commnentId;
                if(length>=this.pageSize){
                    this.state.requestCompleted=false;
                }
                else{
                    this.state.requestCompleted=true;
                }
            }
            else{
                this.state.requestCompleted=true;
            }
        })
        wxShare([],{});
    }
    replyClick(commentId){//回复接口
        if(commentId){
            this.commentId=commentId
        }
        else{
            this.commentId=null
        }
        document.getElementById("inputId").focus();
    }
    getRow(row){
        if(row.targetCommnentId===null){//评论
            return(
                <div className="commentContainer">
                    <img  src={row.hostUrl+row.fileUrl}/>
                    <div className="right">
                        <div className="name">{row.nickName}</div>
                        <div className="content">{row.comment}</div>
                        <div className="timeContainer">
                            <div className="reply" onClick={()=>{this.replyClick(row.commnentId)}}>回复</div>
                            <div className="time">{format(row.createTime*1000,'yyyy-MM-dd HH:mm:ss')}</div>
                        </div>
                    </div>
                </div>
            )
        }
        else{//回复
            return(
                <div className="rePlyContainer">
                    <img  src={row.hostUrl+row.fileUrl}/>
                    <div className="right">
                        <div className="name">{row.nickName}</div>
                        <div className="content">回复<span>{row.targetNickName}</span>：{row.comment}</div>
                        <div className="timeContainer">
                            <div className="reply" onClick={()=>{this.replyClick()}}>回复</div>
                            <div className="time">{format(row.createTime*1000,'yyyy-MM-dd HH:mm:ss')}</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        const commentListAry=this.props.commentList.commentListAry;
            return(
                <div className="commentList">
                    {commentListAry.length===0?<div>
                        <div className="blankDiv">
                            <img src={require('../../images/comment/noListData.png')}/>
                            <div >还没有评论,快来抢沙发!</div>
                        </div>
                        {this.state.showBlackView?                <div className="blackView" />:null
                        }
                        <div className="inputContainer">
                            <input  placeholder="请输入评论文字" value={this.state.commentText}
                                    onBlur={()=>{this.setState({showBlackView:false})}}
                                    onChange={(e)=>{this.setState({commentText:e.target.value})}}
                                    onFocus={()=>{this.setState({showBlackView:true})}}
                                    id="inputId"
                            />
                            <div className="realese1" onClick={()=>this.relesaeComment()}>
                                发布
                            </div>
                        </div>
                    </div>:<div>
                        <div className="commentListNumber">
                            <div>评论{this.props.commentList.allNumber}</div>
                        </div>
                        <ListView
                            dataSource={this.state.dataSource.cloneWithRows(commentListAry)}
                            renderRow={this.getRow.bind(this)}
                            pageSize={5}
                            style={{height:document.documentElement.clientHeight>window.screen.height?document.documentElement.clientHeight:window.screen.height}}
                            scrollRenderAheadDistance={200}
                            scrollEventThrottle={20}
                            onEndReachedThreshold={10}
                            className="commentListView"
                            scrollerOptions={{scrollbars: true}}
                            onEndReached={this.onEndReached.bind(this)}
                            renderFooter={this.getFooter.bind(this)}
                        />
                        {this.state.showBlackView?                <div className="blackView" />:null
                        }
                        <div className="inputContainer">
                            <input  placeholder="请输入评论文字" value={this.state.commentText}
                                    onBlur={()=>{this.setState({showBlackView:false})}}
                                    onChange={(e)=>{this.changeText(e.target.value);}}
                                    onFocus={()=>{this.setState({showBlackView:true})}}
                                    id="inputId"
                                    maxLength="400"
                            />
                            <div className="realese1" onClick={()=>this.relesaeComment()}>
                                发布
                            </div>
                        </div>
                    </div>}
                </div>)

    }
    changeText(text){//改变text 文字
        this.setState({commentText:text})
    }

    relesaeComment(commentId){
        const {commentListAction} = this.props
        const {history}=this.props;
        let userId = null
        if($.trim(this.state.commentText.toString())===""){
            if(!this.alert){
                this.alert = alert('提示','请输入评论内容', [
                    {
                        text: '确定', onPress: () => {
                            this.alert = null;
                    }, style: {color: '#000000'}
                    },
                ]);

            }
            return;
        }
        if(this.urlUserId){//从rn 进来
            userId=this.urlUserId;
        }
        else if(db.readUserInfo()){
            userId = db.readUserInfo()['wedoId']
        }
        if(!userId){
            console.log('未登陆')
            let url =contants.commonUrl+'/login'+'/?pathname=commentList'+'&type='+7+'&shopId='+this.shopId
            history.push({
                pathname:url,
                type:7
            });
        }
        else{
            if(this.state.commentText.length===0){
                Toast.info('请输入评价信息', 2);
                return;
            }
            let dic={
                storyId:this.storyId,
                userId:userId,
                comment:this.state.commentText,
                targetCommentId:this.commentId?this.commentId:0
            }
            if(this.isPosting ===true){
                return;
            }
            this.isPosting=true;
            commentListAction.writeCommontPost(dic,()=>{
                this.isPosting=false;
                this.setState({commentText:'',requestCompleted:false})
                this.lastId = 0;
                commentListAction.getCommentListPost([],this.pageSize,1,this.lastId,this.storyId,(lastComment,length)=>{
                    if(lastComment){
                        this.lastId=lastComment.commnentId;
                        if(length>=this.pageSize){
                            this.state.requestCompleted=false;
                        }
                        else{
                            this.state.requestCompleted=true;
                        }
                    }
                    else{
                        this.state.requestCompleted=true;
                    }
                })
            })

        }
    }
    getFooter(){
        const commentListAry=this.props.commentList.commentListAry;
        if(commentListAry.length===0){
            return <div></div>
        }
        return(
            <div className="listViewFootC">
                <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                <span>
                                {this.state.requestCompleted===false ? '加载中...' : '没有更多内容了'}
                             </span>
                <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
            </div>
        )

    }
    onEndReached(){
        const {commentListAction}=this.props;
        if(this.state.requestCompleted===false){
            console.log('onEndReached())')
            commentListAction.getCommentListPost(this.props.commentList.commentListAry,this.pageSize,2,this.lastId,this.storyId,(lastComment,length)=>{
                if(lastComment){
                    this.lastId=lastComment.commnentId;
                    if(length>=this.pageSize){
                        this.state.requestCompleted=false;
                    }
                    else{
                        this.state.requestCompleted=true;
                    }
                }
                else{
                    this.state.requestCompleted=true;
                }
            })
            this.getMoreData=true;
            this.setState({refreshing: true});
            setTimeout(() => {
                this.setState({
                    refreshing: false,
                });
                this.getMoreData=false;
            }, 1000);
        }
    }
    onRefresh() {
        console.log('onRefresh()')
        const {commentListAction}=this.props;
        this.lastId=0;
        commentListAction.getCommentListPost([],this.pageSize,1,this.lastId,this.storyId,(lastComment,length)=>{
            if(lastComment){
                this.lastId=lastComment.commnentId;
                if(length>=this.pageSize){
                    this.state.requestCompleted=false;
                }
                else{
                    this.state.requestCompleted=true;
                }
            }
            else{
                this.state.requestCompleted=true;
            }
        })
        this.getMoreData=true;
        this.setState({refreshing: true});
        setTimeout(() => {
            this.setState({
                refreshing: false,
            });
            this.getMoreData=false;
        }, 1000);
    }

}