/**
 * Created by andyWang on 2017/10/27.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants';//全局配置信息
import GroupingPopup from './groupingPopup';//分组名称弹出框

export default class ViewMore extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            GroupingPopup:false
        }
    }
    render() {
        let groupingListData=this.props.groupingListData;
        let groupingListDataFive = groupingListData.slice(0,5)
        let viewStyDic=contants.viewStyDic;
        if(viewStyDic&&viewStyDic.styleId===1) {
            return (
                <div>
                    <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData}  />
                    <div className="GroupingList" >
                        <div className="GroupingLeft">
                            <div className="GroupingTitleBody">
                                {
                                    groupingListData.map((val,index)=>{
                                        return(
                                            <div className="GroupingTitle" key={index} onClick={()=>this.goDetails(val.groupId)}>
                                                <div className="TitleDiv">
                                                    <span>{val.groupName}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="GroupingRight">
                            <div className="GroupingRBg">
                            </div>
                            <div className="GroupingRIng" onClick={()=>{this.goPopupBody()}}>
                                <img src={require('../../images/homePage/FillCopy.png')} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData} />
                    <div className="GroupingListSecond">
                        {
                            groupingListDataFive .map((val,index)=>{
                                return(
                                    <div className="grounSecondTitle" key={index} onClick={()=>this.goDetails(val.groupId)}>
                                        <div className="titleSecond">{val.groupName}</div>
                                        <img className="imgSecond" src={require('../../images/homePage/triangle.png')}/>
                                    </div>
                                )
                            })
                        }
                        {groupingListData.length>=5?  <div className="grounSecondTitle" key={7} onClick={()=>this.goPopupBody()}>
                            <div className="titleSecond">其他</div>
                            <img className="imgSecond" src={require('../../images/homePage/triangle.png')}/>
                        </div>:null}

                    </div>
                </div>
            )
        }
    }
    goPopupBody(){
        if(contants.shopPreView!=1) {
            document.getElementById("GroupingPopup").className="GroupingPopup show";
        }
    };
    goDetails(groupId){
        const {HomePage } = this.props;//相当于取this.props中的HomePageActions属性
        let title = HomePage.shopName;
        if(title) title = title.length>8 ? title.substr(0, 8) +"..." : title;
        contants.shopName = title;
        if(contants.shopPreView!=1) {
            window.sessionStorage.removeItem('listGoods');
            const {history}=this.props;
            let url = contants.commonUrl+'/listGoods'+'/?groupId='+groupId+'&type='+1+'&shopId='+this.props.shopId+"&shopName="+title;
            history.push({
                pathname:url,
            });
        }

    }
}