/**
 * Created by andyWang on 2017/10/27.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import GroupingPopup from './groupingPopup';//分组名称弹出框
import * as Util from '../../../common/Apis/Utils';
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
        // let viewStyDic=contants.viewStyDic;
        // if(viewStyDic&&viewStyDic.styleId===1) {
            return (
                <div>
                    <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData}  />
                    <div className="GroupingList" >
                        <div className="GroupingLeft">
                            <div className="GroupingTitleBody">
                                {
                                    groupingListData.map((val,index)=>{
                                      //  console.log(val,"tuwenwebwebeb");
                                        return(
                                            <div className="GroupingTitle" key={index} onClick={()=>this.goDetails(val.urlLink,val.urlLinkType)}>
                                                <div className="TitleDiv">
                                                    <span>{val.title}</span>
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
    //     else{
    //         return(
    //             <div>
    //                 <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData} />
    //                 <div className="GroupingListSecond">
    //                     {
    //                         groupingListDataFive .map((val,index)=>{
    //                             return(
    //                                 <div className="grounSecondTitle" key={index} onClick={()=>this.goDetails(val.groupId)}>
    //                                     <div className="titleSecond">{val.groupName}</div>
    //                                     <img className="imgSecond" src={require('../../images/homePage/triangle.png')}/>
    //                                 </div>
    //                             )
    //                         })
    //                     }
    //                     {groupingListData.length>=5?  <div className="grounSecondTitle" key={7} onClick={()=>this.goPopupBody()}>
    //                         <div className="titleSecond">其他</div>
    //                         <img className="imgSecond" src={require('../../images/homePage/triangle.png')}/>
    //                     </div>:null}

    //                 </div>
    //             </div>
    //         )
    //     }
    // }
    goPopupBody(){
        if(contants.shopPreView!=1) {
            document.getElementById("GroupingPopup").className="GroupingPopup show";
        }
        // else{
        //     document.getElementById("GroupingPopup").className="GroupingPopup";
        // }
    };
    goDetails(routerStr,linkeType){
        // alert(routerStr);
        // alert(linkeType);
        const {history,ShopHomeActions}=this.props;
        if(linkeType == 0){ // 微页面
            // let url = "/cloudPage/queryPageLayoutById?pageId="+routerStr;
            // ShopHomeActions.getPageLayoutById(url);
            let url = contants.multishopUrl+"/weiPage/?pageId="+routerStr;
            Util.goToPageForApp(url,false);
        }else if(linkeType == 1 || linkeType==4 || linkeType==5){ //进去商品详情
            let linkArr = [];
            if(routerStr.indexOf(",") > -1){
                linkArr = routerStr.split(",");
                 let shopId=linkArr[0];
                 let productId = linkArr[1];
                 let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
                 Util.goodsViewNum(productId,goodDetailUrl,false);
            }
        }else if(linkeType == 2){
            let linkArr = [];
          if(routerStr.indexOf(",") > -1){
            linkArr = routerStr.split(",");
             let shopType=linkArr[0];
             let shopId = linkArr[1];
             let shopDetailUrl ="";
             if(shopType == 1){
                shopDetailUrl = contants.multishopUrl+`/retailPage/?shopId=${shopId}`;
             }else{
                shopDetailUrl = contants.multishopUrl+`/shopDetail/?shopId=${shopId}`;
             }
           Util.goToPageForApp(shopDetailUrl,false);
        }
      }else if(linkeType == 7){ //购物车
            let url = contants.multishopUrl+'/PPShoppingCart';
            Util.goToPageForApp(url,false);
        }else if(linkeType == 8){ //个人中心
            let url = contants.multishopUrl+'/orderHome';
            Util.goToPageForApp(url,false);
        }else if(linkeType == 3){//自定义链接
           // window.location = routerStr;
           Util.goToPageForApp(routerStr,false);
        } 

    }
}