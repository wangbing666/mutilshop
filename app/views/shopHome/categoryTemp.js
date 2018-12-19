/**
 * Created by yusuyun on 2018/8/7.
 */
import React,{Component} from 'react';
import {Grid} from 'antd-mobile';
import './shopHome.less';
import * as contants from '../../../common/Apis/constants';
import GroupingList  from './groupingList';
import * as Util from '../../../common/Apis/Utils';
export default class CategoryTemp extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            bgColor:[],
        }
    }
    render() {
        let gridData = this.props.graphicOrname.orInfo.voList;
        let graphicNav = this.props.graphicOrname.orInfo.graphicNav;
      //  console.log("graphicNav+++",graphicNav);
        let type = graphicNav.navigationStyle;
        let wenBenStyle = graphicNav.slidingSet;
       // let column=graphicNav.layoutType;
        let distance = 0;
        if(graphicNav.distance){
            distance = parseInt(graphicNav.distance)/75+"rem";
        }
      let oneRowNum = 4;
      let newGridData=[];
      if(graphicNav.oneRowNum){ //一排 n 个
         oneRowNum = graphicNav.oneRowNum;
         if(Array.isArray(gridData)){
             let dataLen = gridData.length;
            let columNum = Math.ceil(dataLen/oneRowNum);
            for(let i = 0;i<columNum;i++){
                let itemArr=[];
               for(let j = 0;j<oneRowNum;j++){
                   if(dataLen>(i*oneRowNum+j)){
                    itemArr.push(gridData[i*oneRowNum+j])
                   }
                }
                newGridData.push(itemArr);
            }
        }

      }
        if(gridData.length>0){
            switch(type){
                case 0: //图文导航
                   // return(
                        if(wenBenStyle == 0){
                          return (<div className="gridModuleTw" style={{marginTop:distance,backgroundColor:graphicNav.backgroundColor ? graphicNav.backgroundColor : '#fff'}}>
                          { gridData.map((dataItem,index)=>{
                            return <div className="gridItem" style={{width:100/oneRowNum+"%"}} key={index} onClick={()=>{this.gotoPage(dataItem.urlLink,dataItem.urlLinkType)}}>
                                        <img src={dataItem.zoomUrl}/>
                                        <p style={{color:graphicNav.fontColor ? graphicNav.fontColor:'#000'}} className="overTxtOne">{dataItem.title}</p>
                                    </div>    
                          })
                          }
                        </div>
                    )
                }else{ //横向滑动
                    return (
                    <div className="gridModuleTw2" style={{marginTop:distance,backgroundColor:graphicNav.backgroundColor ? graphicNav.backgroundColor : '#fff'}}>
                       <div className="gridModuleBody">
                         <div className="allGrid">
                              {
                                  newGridData.map((item,itemIndex)=>{
                                       // let gridData =  gridData.slice(0,rowNum)
                                    return <div className="gridCont" key={itemIndex}>
                                            { item.map((dataItem,index)=>{
                                                    return <div className="gridItemHua" key={index} onClick={()=>{this.gotoPage(dataItem.urlLink,dataItem.urlLinkType)}}>
                                                                <img src={dataItem.zoomUrl}/>
                                                                <p style={{color:graphicNav.fontColor ? graphicNav.fontColor:'#000'}} className="overTxtOne">{dataItem.title}</p>
                                                        </div> 
                                            })
                                            }
                                    </div>
                                  })
                              }
                       </div>
                      </div>
                    </div>
                    )
                    }
                  break;
                case 1: //文本导航
                  if(wenBenStyle == 0){
                    return(
                        <div className="gridModule3" style={{marginTop:distance,backgroundColor:graphicNav.backgroundColor ? graphicNav.backgroundColor : '#fff'}}>
                            {
                                gridData.map((item,index)=>{
                                    let widthValue = 100/(gridData.length)+"%";
                                   return <div className="graphicItem" onClick={()=>{this.gotoPage(item.urlLink,item.urlLinkType)}} key={index} style={{width:widthValue,color:graphicNav.fontColor ? graphicNav.fontColor:'#000'}}>{item.title}</div>
                                })
                            }
                           
                        </div>
                    )
                  }else{
                      return(
                        <div className="gridModule4" style={{marginTop:distance,backgroundColor:graphicNav.backgroundColor ? graphicNav.backgroundColor : '#fff'}}>
                            <GroupingList {...this.props} groupingListData={gridData} />  
                        </div>
                      )  
                  } 
                 break;
            case 2: //图片热区
              if(gridData.length > 0){
                return(
                    <div className="gridModule2" style={{marginTop:distance,backgroundColor:graphicNav.backgroundColor ? graphicNav.backgroundColor : '#fff'}}>
                       <img useMap="#planetmap" src={graphicNav.fileUrl}/>
                        <map name="planetmap" id="planetmap">
                            {
                                gridData.map((item,index) => {
                                    return <area key={index}
                                    shape="react" coords={item.title} onClick={()=>{this.gotoPage(item.urlLink,item.urlLinkType)}} />
                                })
                            }
                        </map>
                    </div>
                )
              }else{
                  return <div></div>
              }
               
            break;
         default:
                return(<div></div>)
            } 
        }else{
            return <div></div>
        }
       
    };

    gotoPage(routerStr,linkeType){
        //alert(1111);
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
           Util.shopViewNum(shopId,shopDetailUrl,false);
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