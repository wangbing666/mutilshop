/**
 * Created by andyWang on 2017/10/27.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'

export default class ViewMore extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            selectIndex:0,
        }
    }
    render() {
        let groupingData=this.props.groupingData;
        return (
            <div className="GroupingPopup hide" id={this.props.id}  style={{
                height: document.documentElement.clientHeight ,
            }}>
                <div className="PopupBg" onClick={()=>{this.popupBodyShow()}} style={{
                    height: document.documentElement.clientHeight ,
                }}>
                </div>
                <div className="popupBody">
                    <div className="popupTitle">
                        <span>选择分类</span>
                    </div>
                    <div className="popupCenter">
                        {groupingData.map((val,index)=>{
                            if(index===this.props.selectIndex){
                                return(
                                    <div className={this.props.type===5||this.props.type===1?"blueGroupName":"redGroupName"} key={index} onClick={()=>this.goDetails(val.groupId,index)}>
                                        <span>{val.groupName}</span>
                                    </div>
                                )
                            }
                            else{
                                return(
                                    <div className="groupName" key={index} onClick={()=>this.goDetails(val.groupId,index)}>
                                        <span>{val.groupName}</span>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        )
    }
    popupBodyShow(){
        document.getElementById("GroupingPopup").className="GroupingPopup hide";
    }
    goDetails(groupId,index){
        this.props.selectCallback(groupId,index)
        document.getElementById("GroupingPopup").className="GroupingPopup hide";
    }
}