/**
 * Created by jieli on 2017/8/8.
 * 客服评价
 */
import React,{Component} from 'react';
import {TextareaItem,Picker, List,InputItem,Toast,ActivityIndicator} from 'antd-mobile';
import './reviewServer.less';
import * as db from '../../../common/Apis/Utils';
import {post} from '../../../common/Apis/Fetch'


export default class ReviewServer extends Component{
        // 构造
          constructor(props) {
            super(props);
            // 初始状态
            this.state = {
                //choose:1为选中  0为未选中
                grade:[{'pic':require('../../images/chatImage/d6.png'),'level':'满意','choose':1,'commentState':1},{'pic':require('../../images/chatImage/d7.png'),'level':'一般','choose':0,'commentState':2},{'pic':require('../../images/chatImage/d8.png'),'level':'不满意','choose':0,'commentState':3}],
                reviewMsg:''
            };
          }

          render(){
              return(
                  <div className="reviewBox">
                      <div className="closeImg">
                          <img src={require('../../images/chatImage/d9.png')} onClick={()=>this.props.closeWindow(0)}/>
                      </div>
                      <p className="thanks">感谢您的咨询,请您对我们的服务做出评价</p>
                      <ul className="grade">
                          {this.smilingFaceView()}
                      </ul>
                      <div className="reasonInput">
                          {/*<TextareaItem*/}
                              {/*title=""*/}
                              {/*placeholder="输入您想说的...(选填)"*/}
                              {/*value={this.state.reviewMsg}*/}
                              {/*onChange={(e)=>{this.setReviewMsg(e)}}*/}
                          {/*/>*/}
                          <textarea placeholder="输入您想说的...(选填)" value={this.state.reviewMsg} onChange={(e)=>{this.setReviewMsg(e)}} maxLength={100}></textarea>
                      </div>

                      <div className="makeSureBtn" onClick={()=>{this.makeSure()}}>
                          确定
                      </div>

                  </div>

              )
          }

    smilingFaceView(){
        let that = this;
        return(
            that.state.grade.map(function(data,i) {
                return (
                    <li key={i} onClick={()=>that.chooseSmallFace(i,data)}>
                        <img className="face" src={data.pic}/>
                        <div>
                            {data.choose?<img src={require('../../images/chatImage/d10.png')} />:<img src={require('../../images/chatImage/d11.png')} />}
                            <p>{data.level}</p>
                        </div>
                    </li>
                )
            })
        )
    }


    //输入框文字
    setReviewMsg(param){
        this.setState({
            reviewMsg:param.target.value
        });
    }


    //确认按钮
    makeSure(){
        let commentState = 1;
        for(let i = 0;i<this.state.grade.length;i++){
            if(this.state.grade[i].choose == 1){
                commentState = this.state.grade[i].commentState;
            }
        }
        let that = this;
        let requireData = {userId:this.props.userId,customerId:this.props.customerId,commentState:commentState,content:this.state.reviewMsg,goodId:this.props.goodsId}
        console.log(requireData)
        post('/customer/comment',requireData,function (responseData) {
            console.log(responseData)
            that.props.callBack();
        },function (error) {
            console.log(error)
        })
        this.props.closeWindow(0)
    }

    chooseSmallFace(index,data){
        if(data.choose == 1){
            return;
        }else{

            let dataS = this.state.grade
            for(let i = 0;i<dataS.length;i++){
                if(dataS[i].choose == 1){
                    dataS[i].choose = 0;
                }
            }
            dataS[index].choose =  1;
            this.setState({
                grade:dataS
            });
        }
    }

}