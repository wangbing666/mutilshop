/**
 * Created by andyWang on 2017/10/27.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import * as Util from '../../../common/Apis/Utils';
export default class ViewMore extends Component {
    constructor(...args) {
        super(...args);
        this.state={

        }
    }
    render() {
        let groupingData=this.props.groupingData;
        let docHeight = Math.max(document.documentElement.clientHeight, contants.docHeight);
        // if(contants.viewStyDic&&contants.viewStyDic.styleId===1) {
            return (
                <div className="GroupingPopup hide" id={this.props.id}  style={{
                    minHeight: docHeight/75+"rem",
                }}>
                    <div className="PopupBg" onClick={()=>{this.popupBodyShow()}} style={{
                        minHeight: docHeight/75+"rem",
                    }}>
                    </div>
                    <div className="popupBody">
                        <div className="popupTitle">
                            <span>选择分类</span>
                        </div>
                        <div className="popupCenter">
                            {groupingData.map((val,index)=>{
                                return(
                                    <div className="groupName" key={index} onClick={()=>this.goDetails(val.urlLink,val.urlLinkType)}>
                                        <span>{val.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        }
    popupBodyShow(){
        document.getElementById("GroupingPopup").className="GroupingPopup hide";
    }

    goDetails(routerStr,linkeType){
       // alert(routerStr,linkeType)
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

    // toDetail(shopId, productId){
        
    //     window.location.href = contants.flagshipUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    //   }
    
    //   toShopDetail(shopId){
    //     window.location.href = contants.flagshipUrl+`/?shopId=${shopId}`;
    //   }
}