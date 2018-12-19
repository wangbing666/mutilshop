/**
 * Created by jieli on 2017/8/4.
 */
import React,{Component} from 'react';
import {Toast} from 'antd-mobile';
import './chatView.less'
import * as handerMsg  from '../../../common/proto/handerMsg'
import ReviewServer from './reviewServer'
import * as db from '../../../common/Apis/Utils';
import {format} from '../../../common/Apis/Utils'
import WxImageViewer from 'react-wx-images-viewer'
import FacePicture from './facePicture'
import {wxShare} from '../../../common/Apis/wxJsApis'
import {postTow,get,postWithIp} from "../../../common/Apis/Fetch";
import {getValueFromUrl} from '../../../common/Apis/Utils'
import {fileUpload} from "../../../common/Apis/Fetch";


let FaceArr = [];
for(let i=1;i<=85;i++){
    FaceArr.push(require('../../images/faces/'+i+'.png'))
}
let faceImage = {"[围巾]" : 79,"[衰]" : 17,"[怒]" : 10,"[怒骂]" : 19,"[嘘]" : 32,"[手套]" : 80,"[泪]" : 5,"[萌]" : 73,"[威武]" : 47,"[强]" : 42,"[钟]" : 76,"[太阳]" : 71,"[挖鼻屎]" : 21,"[浮云]" : 45,"[鄙视]" : 20,"[弱]" : 43,"[猪头]" : 67,"[嘻嘻]" : 1,"[馋嘴]" : 6,"[麦克风]" : 69,"[心]" : 65,"[围观]" : 46,"[相机]" : 48,"[哈哈]" : 2,"[哈欠]" : 34,"[微笑]" : 12,"[差劲]" : 62,"[可爱]" : 9,"[抱抱]" : 28,"[熊猫]" : 54,"[给力]" : 44,"[耶]" : 59,"[帽子]" : 83,"[赞]" : 57,"[酷]" : 16,"[拜拜]" : 40,"[吃惊]" : 18,"[拳头]" : 61,"[玫瑰]" : 64,"[思考]" : 25,"[勾引]" : 58,"[爱心]" : 51,"[伤心]" : 66,"[咖啡]" : 68,"[月亮]" : 70,"[喜欢]" : 3,"[害羞]" : 38,"[生病]" : 26,"[睡觉]" : 13,"[黑线]" : 41,"[握手]" : 63,"[不要]" : 55,"[互粉]" : 75,"[亲亲]" : 27,"[树叶]" : 84,"[哼]" : 8,"[快哭了]" : 39,"[礼物]" : 74,"[蛋糕]" : 78,"[兔子]" : 53,"[挤眼]" : 37,"[白眼]" : 29,"[汽车]" : 49,"[委屈]" : 33,"[悲伤]" : 24,"[啤酒]" : 72,"[晕]" : 4,"[汗]" : 11,"[抓狂]" : 7,"[ok]" : 56,"[奥特曼]" : 52,"[爱你]" : 60,"[右哼哼]" : 30,"[自行车]" : 77,"[偷笑]" : 15,"[敲打]" : 35,"[色]" : 22,"[足球]" : 85,"[雪人]" : 82,"[飞机]" : 50,"[鼓掌]" : 23,"[钱]" : 14,"[雪花]" : 81,
    "[左哼哼]" : 31,"[疑问]" : 36};
const betweenTime = 1000*15*60;
import * as contants from '../../../common/Apis/constants'
let webSocket;
let that = null;
let localUrl=null;//本页面url
let upLoadImgToWx=function(serverId,callBack){//上传图片到微信服务器
    get("/weixin/sharePage?pageUrl="+localUrl,(res)=>{
        if(res.status==0){
            contants.access_token=res.body.accessToken;
            wx.uploadImage({
                localId:serverId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    let url='https://api.weixin.qq.com/cgi-bin/media/get?access_token='+contants.access_token+'&media_id='+res.serverId;
                    callBack(url)
                },
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            });

        }else{
        }
    },(err)=>{
        alert(JSON.stringify(err))
    });
}

let writeTime=0;//记录时间
let timeFlag = 0;
let forbidDown = 0; //禁止点击界面,显示文字最底部
export default class ChatView extends Component{
    // 构造
      constructor(props){
        super(props);
        // 初始状态
        this.state = {
            chatInfo:[],   // 0代表我发的,1 代表别人发的 status  0 发送
            unSendChatInfo:[],//websocket 异常时候,存储发送的信息,
            sendMsg:'',
            userId:'',
            showReview:0,//0表示不显示评论框,1代表显示
            lookPic:[],
            showPic:0,
            showFace:0,//1表示显示表情框,0为不显示
            sendEnable:false,//是否可以发消息
            disConnet:0,//1:后台通知我断开 2 我主动断开 0 异常断开
            commentNumber:0,// 评论次数 ,只能评价1次
        };
          this.lastTime=null;//上次和tcp 交互时间
          this.heartRec = false;//服务器是否响应心跳包
          that = this;
          var localUrl = location.search; //获取url中"?"符后的字串
          let theRequest = getValueFromUrl(localUrl);
        //   this.goodsId = theRequest['goodsId'];
          this.shopId = theRequest['shopId'];
      }
      render(){
          const {chat,chatViewAction}=this.props;
          return(
              <div className="chatV">
                  <div className="reviewS">
                      <p className="companyName">{contants.shopInfo.shopName}</p>
                      <div className="reviewBtn" onClick={()=>{this.reviewServer()}}>
                          <img src={require('../../images/chatImage/d1.png')}></img>
                          <p>评论</p>
                      </div>
                  </div>
                  <ul className="chatContent" onClick={()=>{this.openExpression('hidden')}}>
                      {this.getCell()}
                  </ul>
                  {this.state.showFace?<div className="toTopUl"></div>:null}

                  <div className="inputAndFace">
                      <div className="inputBox">
                          <textarea id="inputText" placeholder="输入你的消息..." maxLength={500} onChange={(e)=>{this.setSendMsg(e)}} value={this.state.sendMsg} onFocus={()=>{this.showInputBox()}}></textarea>
                          <div className="expression" onClick={()=>{this.openExpression()}}>
                              <img src={require('../../images/chatImage/b40@1x.png')} />
                          </div>
                          {
                              this.state.sendMsg
                                  ?
                                  <div className="sendBtn" onClick={()=>{this.chatToService(this.state.sendMsg,0)}}>
                                   <p>发送</p>
                                  </div>
                                  :
                                  <div className="carmer" >
                                      <div className="imgParent">
                                          <img src={require('../../images/chatImage/camera@1x.png')}>
                                          </img>
                                          <input ref="addImg" id="takepicture" type="file" accept="image/*"
                                                 onChange={this.changeImg.bind(this)}

                                          />
                                      </div>
                                  </div>
                          }
                      </div>
                      {this.state.showFace?<FacePicture faceMessage={(param)=>{this.addFaceToTextarea(param)}}></FacePicture>:null}
                  </div>
                  {this.state.sendEnable?null:<div className="disableChat"></div>}
                  {this.state.showReview?
                      <div className="reviewContentV">
                          <div className="maskingV"></div>
                          <ReviewServer  closeWindow={(param)=>{this.closeWindow(param)}} customerId={chat.queueStatus.customerId} userId={this.state.userId} goodsId={this.goodsId}  callBack={()=>{
                              this.setState({commentNumber:this.state.commentNumber+1})
                              if(this.state.disConnet===1){
                                  this.props.router.goBack()
                              }
                          }
                          }/>
                      </div>
                      :null}
                  {this.state.sendEnable&&this.state.commentNumber===0?
                      null
                      :<div className="hideReviewBtn"></div>}
                  {
                      this.state.showPic ? <div>
                          {/*<div className="liulanClose">*/}
                              {/*<img src={require('../../images/aftersales/close.png')} onClick={this.closePicLook.bind(this)}/>*/}
                          {/*</div>*/}
                          <WxImageViewer urls={this.state.lookPic} onClose={this.closePicLook.bind(this)}/>
                      </div> : null
                  }
                  {chat.showLoading?<div className="chatLoading">
                      <div className="loading"></div>
                      <p>正在连接客服,请稍等...</p>
                  </div>:null}
              </div>
          )
      }
      getCell(){
          let that =this;
          let aryView =[];
          this.state.chatInfo.map(function (data,i) {
              // data.from = 4;
              let caseType = -1;
              if(data.from===0&&data.type==0)//自己文字
              {
                  caseType=0;
              }
              if(data.from===0&&data.type==1) //自己图片
              {
                  caseType=1;
              }
              if(data.from===1&&data.type==0)//他人文字
              {
                  caseType=2;
              }
              if(data.from===1&&data.type==1) //他人图片
              {
                  caseType=3;
              }
              if(data.from===1&&data.type==250) //他人 结束
              {
                  caseType=6;
              }
              if(data.from===2)//建立成功
              {
                  caseType=4;
              }
              if(data.from===3)//获取排队人数
              {
                  caseType=5;
              }
              if(data.from===4) //4评价
              {
                  caseType=6;
              }
              if(data.from===5) // 断开,再次连接
              {
                  caseType=7;
              }
              switch (caseType){
                  case 0://自己 文字
                      aryView.push(
                          <li key={i} className="rightInfo">
                              {data.showTime?<p className="chatTime">{format(data.time,'HH:mm')}</p>:null}
                              <div className="chatInfo">
                                  <div className="userInfo">
                                      {/*<p className="account">1523654893625</p>*/}
                                      {data.status===1?<div className="loadCircle"></div> :null}
                                      <p className="sendMsg" dangerouslySetInnerHTML={{__html: that.replace_em(data.message)}}></p>
                                  </div>
                                  <div className="chatIcon"></div>
                              </div>
                          </li>
                      )
                      break;
                  case 1://自己 图片
                      aryView.push(
                          <li key={i} className="rightInfo">
                              {data.showTime?<p className="chatTime">{format(data.time,'HH:mm')}</p>:null}
                              <div className="chatInfo">
                                  <div className="userInfo">
                                      {data.status===1?<div className="loadCircle"></div>
                                          :null}
                                      <img src={JSON.parse(data.message).url} onClick={()=>{that.openPicLook(JSON.parse(data.message).url)}}/>
                                  </div>
                                  <div className="chatIcon"></div>
                              </div>
                          </li>
                      )
                      break;
                  case 2://他人 文字
                      aryView.push(
                          <li key={i} className="leftInfo">
                              {data.showTime?<p className="chatTime">{format(data.time,'HH:mm')}</p>:null}
                              <div className="chatInfo">
                                  <div className="chatIcon"></div>
                                  <div className="userInfo">
                                      {/*<p className="account">1523654893625</p>*/}
                                      <p className="sendMsg" dangerouslySetInnerHTML={{__html: that.replace_em(data.message)}}></p>
                                  </div>
                              </div>
                          </li>
                      )
                      break;
                  case 3://他人 图片
                      let dic = JSON.parse(data.message)
                      aryView.push(
                          <li key={i} className="leftInfo">
                              {data.showTime?<p className="chatTime">{format(data.time,'HH:mm')}</p>:null}
                              <div className="chatInfo">
                                  <div className="chatIcon"></div>
                                  <div className="userInfo">
                                      <img src={dic.url} onClick={()=>{that.openPicLook(dic.url)}}/>
                                  </div>
                              </div>
                          </li>
                      )
                      break;
                  case 4://建立连接成功
                      aryView.push(
                          <li key={i} className="getDesId">
                              <div >
                                  <div className="times">{format(data.time,'HH:mm')}</div>
                                  <div className="title">{data.message}</div>
                              </div>
                          </li>
                      )
                      break;
                  case 5://获取排队人数
                      aryView.push(
                          <li key={i} className="getDesId">
                              <div >
                                  <div className="times">{format(data.time,'HH:mm')}</div>
                                  <div className="title">{data.message}</div>
                              </div>
                          </li>
                      )
                      break;
                  case 6://评价
                      aryView.push(
                          <li key={i} className="getDesId">
                              <div >
                                  <div className="whiteView">
                                      <div className="coomentTitle">感谢您的咨询,请您对我们的服务做出评价</div>
                                      <div className="commentBox">
                                          <div className="commentBtn" onClick={()=>{that.reviewServer()}}>评价</div>
                                          {data.click===false?<div className="commentBtnWhite"/>:null}
                                      </div>
                                  </div>
                              </div>
                          </li>
                      )
                      break;
                  case 7://连接断开
                      aryView.push(
                          <li key={i} className="getDesId">
                              <div >
                                  <span className="endLeft">你当前的服务已结束，如需继续咨询请</span>
                                  <span className="endRight" onClick={()=>{that.createLinkAgin()}}>重新连接客服</span>
                              </div>

                          </li>
                      )
                      break;
                  default:
                      aryView.push(<div></div>)
              }
          })
          return aryView;
      }

      //添加表情到输入框
    addFaceToTextarea(param){
        let chatMsg = this.state.sendMsg;
        this.setState({
            sendMsg:chatMsg+param
        });
    }


    //表情符号转化为表情
    replace_em(str){
        str = str.replace(/\</g,'&lt;');

        str = str.replace(/\>/g,'&gt;');

        str = str.replace(/\n/g,'<br/>');

        str = str.replace(/\[([\u4e00-\u9fa5]*)\]/g,function (word) {
            let index = faceImage[word]
            if(typeof(index) == 'undefined'){
                return word;
            }else {
                return `<img src=${FaceArr[index - 1]} />`
            }
        });
        return str;

    }


    //图片浏览
    openPicLook(param){
        this.setState({
            lookPic:[param],
            showPic:1
        });
    }

    //关闭图片浏览
    closePicLook(){
        this.setState({
            showPic:0
        })
    }

    setSendMsg(e){
        this.setState({
            sendMsg:e.target.value
        });
    }
    createLinkAgin()    //重新连接客服
    {
        if(!webSocket)
        {
            let userId = db.readUserInfo()['userId'];
            let mobileId = db.readUserInfo()['moblie']
            const {chat,chatViewAction}=this.props;
            for(let i =0;i<that.state.chatInfo.length;i++){ //之前的评价和 重新连接 设置不可点击
                let msg=that.state.chatInfo[i];
                if(msg.from==4||msg.from==5){
                    msg.click=false
                }
            }
            this.setState({commentNumber:0})
            chatViewAction.applyChatWithSalerPost(userId,1,mobileId,this.goodsId);
            this.getQueueNumber();
            timeFlag = 0;
        }
        else {
            alert('您已连接客服')
        }

    }
    //评论客服
    reviewServer(){
        if(webSocket||this.state.disConnet===1){
            this.setState({
                showReview:1
            });
        }
        else{
        }
    }
    //关闭评论窗口
    closeWindow(param){
        this.setState({
            showReview:param
        });
    }
    //消息过滤
    msgFilter(sequence){
        let chatAry =this.state.chatInfo;
        let isHave = false;
        for(let i=chatAry.length-1;i>=0;i--)
        {
            let dic = chatAry[i];
            if(dic.sequence===sequence)
            {
                isHave = true;
                break;
            }
        }
        return isHave;
    }
    //发送信息
    chatToService(param,type=0){
        //unSendChatInfo

        this.lastTime = new Date();
        const {chat,chatViewAction}=this.props;
        param = this.trimSpace(param);
        if(!param){

            return;
        }
        let data = handerMsg.encodeWithMsgData(chat.queueStatus.customerId,this.state.userId,type,param)
        if(type!=1){//不是图片

            let paramJson =JSON.stringify({enterpriseName:contants.shopInfo.shopName,enterpriseId:0,msgContent:param})



            data = handerMsg.encodeWithMsgData(chat.queueStatus.customerId,this.state.userId,type,paramJson)
        }

        let time = (new Date()).getTime();
        if(type===1){//
            let ary = this.state.chatInfo;
            for(let i=0;i<ary.length;i++) {
                let dic = ary[i];
                if(dic.type===1&&dic.status===1) //图片,没有发送成功,可能会有bug
                {
                    let kabaoDic=this.createMsg(param,0,-1,time,1,data.seq,type) //用服务器返回的信息替换微信返回的信息
                    ary[i]=kabaoDic;
                    this.setState({
                        chatInfo:ary,
                        showFace:0
                    });
                    break;
                }
            }
        }
        else if(type!=250){
            this.setState({
                chatInfo:this.state.chatInfo.concat(this.createMsg(param,0,-1,time,1,data.seq,type)),
                sendMsg:'',
                showFace:0
            });
        }
        if(webSocket&&webSocket.readyState===1){//可以通信
            webSocket.send(data.pack);
        }
        else{
            this.state.unSendChatInfo.push(data.pack)
            if(webSocket){
                // alert('websocket状态值 '+webSocket.readyState)
            }
            else{
                // alert('websocket 为空')
            }
        }
    }
     /*
      msg:消息内容,from 0 自己,1 他人,sequence 用于撤销删除消息,ack,用于确认消息已经发出,status 状态:0:收到1,已发出,2:发出并确认 3 不处理
      type:0文字 1 图片 click 是否可点击
      */
    createMsg(msg,from,sequence,time,status=0,ack=0,type:0,click=true)//创建消息对象
    {
        let showTime=1;//是否显示时间标签,0不显示
        if(from== 0 || from == 1){
            if(timeFlag==0 || (time-writeTime)/(60*1000)>=5){
                writeTime = time;
                showTime = 1;
            }else if((time-writeTime)/(60*1000)<5&& timeFlag != 0){
                showTime = 0;
            }
            timeFlag=1
        }
        let dic={
            message:msg,
            from:from,
            time:time,
            sequence:sequence,
            ack:ack,
            status:status,
            type:type,
            showTime:showTime,
            click:click
        }
        return dic
    }
    changeImg(event) {
        let files = event.target.files, file;
        file = files[0]; //选择图片
        let URL = window.URL || window.webkitURL;
        let blob = URL.createObjectURL(file)
        file.url = blob;
        let image = new Image();
        image.src = blob;
        image.onload = function(){

            file.height =image.height;
            file.width =image.height;



            let src =image.src;//临时url
            that.lastTime = new Date();
            const {chat}=that.props;
            let msgDic = {
                dur:0,
                thumb:src,
                fileId:-1,
                url:src,
            }
            let msg = JSON.stringify(msgDic)
            let data = handerMsg.encodeWithMsgData(chat.queueStatus.customerId,that.state.userId,1,msg)
            let time = (new Date()).getTime();
            that.setState({
                chatInfo:that.state.chatInfo.concat(that.createMsg(msg,0,-1,time,1,data.seq,1)),
                sendMsg:'',
                showFace:0
            });





            let upData = {file:[file], userId:that.state.userId}



            fileUpload(upData, (data) => {
                if (true) {
                    let msgDic = {
                        dur:0,
                        thumb:data[0].hostUrl+data[0].zoomUrl,
                        fileId:data[0].fileId,
                        url:data[0].hostUrl+data[0].fileUrl,
                        enterpriseId:0,
                        enterpriseName:contants.shopInfo.shopName,
                    }
                    let msg = JSON.stringify(msgDic)
                    that.chatToService(msg,1)
                }
                else {
                    Toast.info("上传图片失败")
                }
            },(err)=>{
                alert(JSON.stringify(err))
                // Toast.info(JSON.stringify(err))
            })











            // upLoadImgToWx(res.localIds[0],(url)=>{//获得图片临时url
            //     let dic = {
            //         con:{
            //             userId:db.readUserInfo()['userId'],
            //             urlList:[url],
            //         }
            //     }
            //     // that.setState({sendMsg:url})
            //     // {kabaoId: 12492436, enterpriseId: "10271", userId: 12, moblie: "15502146633"}
            //     postTow('/file/fileUploadIpfs',dic, (data) => { //上传图片
            //         if (data.status === 0) {
            //             let msgDic = {
            //                 dur:0,
            //                 thumb:data.body.data[0].hostUrl+data.body.data[0].zoomUrl,
            //                 fileId:data.body.data[0].fileId,
            //                 url:data.body.data[0].hostUrl+data.body.data[0].fileUrl,
            //                 enterpriseId:db.readUserInfo()['enterpriseId'],
            //                 enterpriseName:db.readUserInfo()['enterpriseName'],
            //             }
            //             let msg = JSON.stringify(msgDic)
            //             that.chatToService(msg,1)
            //         }
            //         else{
            //             Toast.info(data.msg);
            //         }
            //     }, (err)=>{
            //         Toast.info(JSON.stringify(err));
            //     })
            // })
            //













        }







    }
    //打开表情
    openExpression(param){
        if(param === 'hidden'){
            forbidDown = 1;
            this.setState({
                showFace:0
            });
            return;
        }
        this.setState({
            showFace:!this.state.showFace
        });
    }
    componentDidMount() {
       
        webSocket = null;
        this.stopDrop(document.querySelector('ul'));
        if(db.userAgent()==='Android'){
            document.title='在线客服';
        }else{
            db.setPageTitle('在线客服');
        }
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
        localUrl = url;
        wxShare([],{});
        let userInfo = db.readUserInfo();
        let userId =userInfo['userId'];
        const {chat,chatViewAction}=this.props;
        let mobileId = db.readUserInfo()['moblie']
        chatViewAction.applyChatWithSalerPost(userId,1,mobileId,this.shopId);//张飞
        this.getQueueNumber();//暂时关闭客服

        const {history}=this.props;

        history.listen(function(location) {
            if(location.pathname.indexOf('goodDetails')!=-1){//返回商品详情

                that.routerWillLeave()

            }

        })


        // this.props.history.setRouteLeaveHook(
        //     this.props.history,
        //     this.routerWillLeave.bind(this)
        // )
        document.addEventListener("visibilitychange", function(){
            if(document.hidden===false){
                that.getOfflineMsg();
            }
        });

    }

    getMsgFromServer(ary,callBack){//递归拉取消息
        const {chat,chatViewAction}=this.props;
        let dic = {
            srcId:chat.queueStatus.customerId,
            destId:this.state.userId,
            pageNum:0,
            pageSize:1000,
        }
        postWithIp('/UU/offlineByCustomer',dic, (data) => { //拉取离线消息
            let getAry = data.rows;
            if(getAry){//有数据
                this.getMsgFromServer(ary.concat(getAry),callBack)
            }
            else{
                callBack(ary)
            }
        }, (err)=>{
            Toast.info(JSON.stringify(err));
        })
    }



    getOfflineMsg(){//拉取消息
        clearInterval(this.keepActive)
        this.stopHeartCheckt();
        const {chat,chatViewAction}=this.props;
        let isDisconnet = false;//后台通知我断开
        let isDisconnetNum = 0;
        if(this.state.userId.length>0){
            let ary = this.getMsgFromServer([],(ary)=>{
                let msgAry=this.state.chatInfo;
                if(ary.length>0){
                    for(let i =0;i<ary.length;i++){
                        let data = ary[i];
                        if(this.msgFilter(data.sequence)===true)
                        {
                            if(data.msgType===250) {
                                isDisconnet = true;
                            }
                            continue;
                        }

                        let msg1=data.msg;
                        if(data.msgType!=1){//图片
                            let tempDic = JSON.parse(data.msg)
                            msg1=tempDic.msgContent
                        }

                        let msg =this.createMsg(msg1,1,data.sequence,data.createTime,0,0,data.msgType)
                        let linkAgin=this.createMsg(data.msg,5,-1,data.createTime,0,0,data.msgType);
                        let lastMsg = msgAry[msgAry.length-1];//获取最后一个对象;
                        if(lastMsg&&lastMsg.type===250&&data.msgType===250) {//最后个对象评价或重新连接
                            isDisconnet =true;
                        }
                        else{
                            if(data.msgType===250){
                                isDisconnet =true;
                                if(this.state.commentNumber===0){
                                    msgAry.push(linkAgin)
                                    msgAry.push(msg)
                                }
                                else{
                                    msgAry.push(linkAgin)
                                }
                            }
                            else{
                                msgAry.push(msg)
                            }
                        }
                    }
                    this.setState({
                        chatInfo:msgAry,
                    });
                    if(isDisconnet===true){
                        clearInterval(this.keepActive)
                        this.keepActive=null;
                        webSocket =null;
                        this.setState({
                            sendEnable:false,
                            disConnet:1
                        })
                    }
                    else{
                        if(webSocket&&webSocket.readyState===1){//正常情况下
                        }
                        else{
                            this.createSocketWithUserId(this.state.userId)
                        }
                    }
                }
                else{
                    if(webSocket&&webSocket.readyState===1){//正常情况下
                    }
                    else{
                        let lastMsg = this.state.chatInfo[this.state.chatInfo.length-1];//获取最后一个对象;
                        if(lastMsg.type!=250)
                        {
                            this.createSocketWithUserId(this.state.userId)
                        }
                        else{
                            webSocket =null;
                        }
                    }

                }
            });
        }
    }
    //阻止iOS的ul滚动
    stopDrop(el){
        document.body.addEventListener('touchmove', function(evt) {
            document.getElementById("inputText").blur();

            if(!evt._isScroller) {
                evt.preventDefault()
            }
        })


        el.addEventListener('touchstart', function() {
            var top = el.scrollTop, totalScroll = el.scrollHeight, currentScroll = top + el.offsetHeight
            if(top === 0) {
                el.scrollTop = 1
            } else if(currentScroll === totalScroll) {
                el.scrollTop = top - 1
            }
        })
        el.addEventListener('touchmove', function(evt) {
            if(el.offsetHeight < el.scrollHeight)
                evt._isScroller = true
        })
    }
    routerWillLeave(nextLocation) { //离开页面
        let userId = db.readUserInfo()['userId'];
        let mobileId = db.readUserInfo()['moblie']
        const {chat,chatViewAction}=this.props;
        clearInterval(this.keepActive)
        this.keepActive=null;
        if(!webSocket){//没建socket 连接,出队列
            chatViewAction.applyChatWithSalerPost(userId,2,mobileId,this.goodsId);
            clearInterval(this.timer)
            this.timer=null;
        }
        else{ //通知后台 我要断开
            this.stopHeartCheckt();
            this.killTheActiveSocket()
        }
    }
    killTheActiveSocket(){//主动断开连接
        this.chatToService('2',250)
        clearInterval(this.keepActive)
        this.keepActive=null;
        return;
    }
    getQueueNumber() {
        if(!this.timer)
        {
            this.timer=setInterval(()=>{
                const {chat,chatViewAction}=this.props;
                let userId = db.readUserInfo()['userId'];
                let mobileId = db.readUserInfo()['moblie']
                let postNumber = chat.queueStatus.postNumber;
                chatViewAction.getCurrentPersonNumberPost(userId,postNumber,mobileId,this.goodsId,this.shopId,(data)=>{
                    
                    if(data.customerId===-1||data.customerId===0){// 不在线 或者等待
                        let dic =this.createMsg('当前无客服在线，请耐心等待',3,-1,(new Date()).getTime(),3,-1,-1)//创建消息对象;
                        if(data.customerId===0){
                            dic =this.createMsg('当前排队人数'+data.currentCount+'人',3,-1,(new Date()).getTime(),3,-1,-1)//创建消息对象;
                        }
                        if(this.state.chatInfo.length>0)
                        {
                            let last = this.state.chatInfo[this.state.chatInfo.length-1];
                            if(last.from===3) {
                                this.state.chatInfo.splice(this.state.chatInfo.length-1,dic);
                                this.setState({
                                    chatInfo:this.state.chatInfo
                                })
                            }
                            else{
                                this.setState({
                                    chatInfo:this.state.chatInfo.concat(dic)
                                })
                            }
                        }
                        else{
                            this.setState({
                                chatInfo:this.state.chatInfo.concat(dic)
                            })
                        }
                    }
                    else{
                        let dic =this.createMsg(contants.shopInfo.shopName+'的客服为您服务',2,-1,(new Date()).getTime(),3,-1,-1)//创建消息对象;
                        this.setState({
                            chatInfo:this.state.chatInfo.concat(dic),
                            userId:data.kaBaoId,
                        })
                        this.createSocketWithUserId(data.customerId)
                        clearInterval(this.timer)
                        this.timer=null;
                        return
                    }
                })
            },5000)//原来是5秒
        }
    }
    createSocketWithUserId(desId)
    {



        if(webSocket) {
            webSocket.close();
            webSocket =null;
        }
        if(!webSocket) {
            webSocket = new WebSocket(contants.chatServer);
            webSocket.onopen = this.onopoen.bind(this)
            webSocket.onmessage = this.onMessage.bind(this);
            webSocket.onclose = this.onClose.bind(this);
            webSocket.onerror=this.onerror.bind(this)
        }
    }
    onopoen(){//socket 建立回调
        if(this.state.userId.length<=0)
            return;
        this.getMsgFromServer([],()=>{});//清除之前的离线缓存
        let data = handerMsg.encodeWithLoginData(this.state.userId)
        webSocket.send(data.pack);
        this.state.disConnet = 0;
        this.keepActive=setInterval(()=>{ //每隔一段时间去探测是否在聊天
            let now = new Date();
            if(now.getTime()-this.lastTime.getTime()>betweenTime)//好久没有交互了
            {
                this.killTheActiveSocket();
            }
        },1000*60*1);
        this.lastTime = new Date();
    }
    startHeartCheckt(){//开启心跳检查
        this.heartRec=false;
        if(webSocket&&webSocket.readyState===1){
            let pack = handerMsg.encodeWithHeartData().pack;
            webSocket.send(pack);
        }
        else{

        }
        if(this.heartCheck){
            clearTimeout(this.heartCheck)
        }
        this.heartCheck=setTimeout(()=>{
            if(this.heartRec===false){ //没收到心跳包
                this.setState({
                    sendEnable:false
                })
                this.createSocketWithUserId(this.state.userId)
            }
            else{
                this.startHeartCheckt();
            }
        },1000*60)
    }
    stopHeartCheckt(){//停止心跳检查
        if(this.heartCheck){
            clearTimeout(this.heartCheck)
        }
        this.heartRec=true;
    }

    onMessage(evt){ //收到信息回调f
        handerMsg.decodeWithData(evt,(decodeData)=>{

            if(decodeData.type===1) //登陆返回
            {

                this.lastTime = new Date();
                if(decodeData.data.status===0){ //登陆成功
                    while(this.state.unSendChatInfo.length>0){
                        let tempData = this.state.unSendChatInfo.shift();
                        webSocket.send(tempData)
                    }
                    this.lastTime = new Date();
                    const {chat,chatViewAction}=this.props;
                    let paramJson =JSON.stringify({enterpriseName:db.readUserInfo()['enterpriseName'],enterpriseId:db.readUserInfo()['enterpriseId'],msgContent:''})
                    let data = handerMsg.encodeWithMsgData(chat.queueStatus.customerId,this.state.userId,250,paramJson)
                    // let data = handerMsg.encodeWithMsgData(chat.queueStatus.customerId,this.state.userId,250,'')

                    let time = (new Date()).getTime();
                    webSocket.send(data.pack);
                    this.setState({
                        sendEnable:true
                    })
                    this.startHeartCheckt();
                }
                else{ //登陆失败
                    alert('登陆失败')
                }
            }
            if(decodeData.type===2) //发送数据 返回
            {

                this.lastTime = new Date();
                let ary = this.state.chatInfo;  //此功能不需要,可注释,提高性能
                for(let i=ary.length-1;i>=0;i--)
                {
                    let dic = ary[i];
                    // alert('找到'+i)
                    if(dic.ack===decodeData.seq)
                    {
                        dic.status=2;
                        dic.sequence=decodeData.data.sequence;
                        this.setState({
                            chatInfo:ary,
                        });

                        break;
                    }
                }
            }
            if(decodeData.type===3) //收到服务器的消息msg
            {
                this.lastTime = new Date();
                let type = decodeData.data.msgtype;
                let msg =null;
                let jsonDic = {msgContent:'解析文字失败'};
                try{
                    jsonDic = JSON.parse(decodeData.data.msg)
                }catch (error){
             
                }
                if(type===0){ //文字
                    msg=this.createMsg(jsonDic.msgContent,1,decodeData.seq,decodeData.data.recvtime,0,0,decodeData.data.msgtype)
                    if(this.msgFilter(decodeData.seq)===true)
                        msg = null;
                }
                else if(type===1)//图片
                {
                    msg=this.createMsg(decodeData.data.msg,1,decodeData.seq,decodeData.data.recvtime,0,0,decodeData.data.msgtype)
                    if(this.msgFilter(decodeData.seq)===true)
                        msg = null;
                }
                else if(type===250&&decodeData.data.msg.length>0)//结束会话
                {
             
                    let lastMsg = this.state.chatInfo[this.state.chatInfo.length-1];//获取最后一个对象;
                    if(lastMsg&&lastMsg.type===250){//最后个对象评价 或 重新连接,防止重复view 出现,原因 不明,可能是 消息发送重复
                        this.setState({
                            sendEnable:false,
                            disConnet:1
                        })
                    }
                    else{
                        let linkAgin = this.createMsg(decodeData.data.msg,5,decodeData.seq,decodeData.data.recvtime,0,0,decodeData.data.msgtype) //再次连接
                        msg=this.createMsg(decodeData.data.msg,4,decodeData.seq,decodeData.data.recvtime,0,0,decodeData.data.msgtype)//评价
                        let ary = this.state.chatInfo;
                        ary.push(linkAgin);
                        if(this.state.commentNumber===0){
                            ary.push(msg)
                        }
                        this.setState({
                            chatInfo:ary,
                            disConnet:1,
                            sendEnable:false
                        });
                    }
                    this.stopHeartCheckt();
                    webSocket.close();
                    webSocket = null;
                    clearInterval(this.keepActive)
                    this.keepActive=null;
                    return;
                }
                if(msg){
                    this.setState({
                        chatInfo:this.state.chatInfo.concat(msg),
                    });
                }
                webSocket.send(decodeData.pack)
            }
            if(decodeData.type===4){////心跳返回
               
                this.heartRec = true;

            }
        });



    }
    onClose(evt){//关闭回调
    
            // alert('onClose 心跳')
            // webSocket = null;
            // this.setState({sendEnable:false})
            // if(this.state.disConnet===0){ //异常断开
            //     let linkAgin = this.createMsg('',5,-1,'',3,0,-1)
            //     this.setState({
            //         chatInfo:this.state.chatInfo.concat(linkAgin),
            //     });
            // }


    }
    onerror(evt){//错误回调
   

        // alert('onerror 心跳')
        // webSocket = null;
        // this.setState({sendEnable:false})
        // if(this.state.disConnet===0){ //异常断开
        //     let linkAgin = this.createMsg('',5,-1,'',3,0,-1)
        //     this.setState({
        //         chatInfo:this.state.chatInfo.concat(linkAgin),
        //     });
        // }
    }

    componentWillMount() {
    }

    //去除字符串前后空格
    trimSpace(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    componentDidUpdate() {
        if(forbidDown){
            forbidDown = 0;
            return;
        }
        // document.body.scrollTop = document.body.scrollHeight;
        // $(window).scrollTop( $('.chatContent').height());
        $('.chatContent').scrollTop( 1000000);
        $('#inputText').scrollTop(100000)
    }

    //显示输入框
    showInputBox(){
        setTimeout(function(){
            document.body.scrollTop = document.body.scrollHeight;
        },300);
        this.setState({
            showFace:0,
        })
    }
}
