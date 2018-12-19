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

        }
    }
    render() {
        let groupingData=this.props.groupingData;

        if(contants.viewStyDic&&contants.viewStyDic.styleId===1) {
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
                                return(
                                    <div className="groupName" key={index} onClick={()=>this.goDetails(val.groupId)}>
                                        <span>{val.groupName}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div className="GroupingPopup hide" id={this.props.id}  style={{
                    height: document.documentElement.clientHeight ,
                }}
                >
                    <div className="PopupBg" onClick={()=>{this.popupBodyShow()}} style={{
                        height: document.documentElement.clientHeight ,
                    }}>
                    </div>
                    <div className="popupBodySecond">
                        <div className="popupTitleSecond">
                            <span>选择分类</span>
                        </div>
                        <div className="popupCenterSecond">
                            {groupingData.map((val,index)=>{
                                return(
                                    <div className="grounSecondTitle" key={index} onClick={()=>this.goDetails(val.groupId)}>
                                        <span className="titleSecond">{val.groupName}</span>
                                        <img src={require('../../images/homePage/triangle.png')}/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        }
    }
    popupBodyShow(){
        document.getElementById("GroupingPopup").className="GroupingPopup hide";
    }
    goDetails(groupId){
        const {HomePage } = this.props;//相当于取this.props中的HomePageActions属性
        let title = HomePage.shopName;
        if(title) title = title.length>8 ? title.substr(0, 8) +"..." : title;
        contants.shopName = title;
        if(contants.shopPreView!=1) {
            window.sessionStorage.removeItem('listGoods');
            document.getElementById("GroupingPopup").className="GroupingPopup hide";
            const {history}=this.props;
            let url = contants.commonUrl+'/listGoods'+'/?groupId='+groupId+'&type='+1+'&shopId='+this.props.shopId+"&shopName="+title;
            history.push({
                pathname:url,
            });
        }
    }
}