/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './shopHome.less';
import * as contants from '../../../common/Apis/constants';
import SvgImg from '../../../common/svgImage/svgImg';

export default class TitleTemp extends Component{
    constructor(...args) {
        super(...args);
        this.state={
           // groupingListData:[{groupName:"时尚家居"},{groupName:"学习进修"},{groupName:"手机数码"},{groupName:"家电3c"}],
        //   type:1,
           // titleData:[{color:'#fff',bgColor:['#FF9E93','#F2637B'],txtPalce:'left'},{color:'red',bgColor:['#fff','#fff'],txtPalce:'right'},{color:'#000',bgColor:['#B6B6B8','#B6B6B8'],txtPalce:'right'}]
        }
    }
    render() {
        // let viewStyDic=contants.viewStyDic;
        // let title = this.props.title;
        let ornameObj = this.props.titleOrname;
         // 0:居左 1：居中 2：居右
        let fontLocation = this.dealLocation(ornameObj.fontLocation);
        let distance = 0;
        if(ornameObj.distance){
            distance = parseInt(ornameObj.distance)/75+"rem";
        }
        if(ornameObj.titleName || ornameObj.subTitleName){
            return (
                <div className="recomTitle5" style={{backgroundColor:ornameObj.backgroundColor,marginTop:distance}}>
                  <div className="titleContent" style={{color:ornameObj.fontColor ? ornameObj.fontColor : '#000',textAlign:fontLocation}}>
                     <p className="title">{ornameObj.titleName}</p>
                     <p className="titleSub">{ornameObj.subTitleName}</p>
                  </div>
               </div>
         )
        }else{
            return <div></div>
        }
           
    };
    goPopupBody(){
        if(contants.shopPreView!=1) {
            document.getElementById("GroupingPopup").className="GroupingPopup show";
        }
    };

    //标题文字的位置
    dealLocation(location){
        if(!location) return 'left';
        if(location == 0) return 'left';
        if(location == 1) return 'center';
        if(location == 2) return 'right';
    }

    //查看更多方法
    checkMore(){
        //跳转到个人中心页面
        history.push({
            pathname:contants.commonUrl+'/classify'
        });
    }

}