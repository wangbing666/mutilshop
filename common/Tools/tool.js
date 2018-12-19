import * as Util from '../Apis/Fetch';
import * as contants from '../Apis/constants';
import * as toolData from "./data";

let promiseFnArr =[];
//1:Banner组件 2：图文导航组件 3：商品列表组件 4：店铺列表组件 5：标题组件  6：富文本组件 7：分类列表组件  8：拼团活动组件 9：导航栏组件',
//0：banner :1：图文导航信息:2：查询商品列表控件信息，3：店铺列表控件信息，4：标题控件信息:5：富文本控件信息:6：查询分类列表控件信息:7：查询拼团控件数据信息:8：查询导航数据信息，（查询标签信息，查询标签下拉）
const controlUrls =[{url:'/cloudBanner/queryDecorateBannerInfo',paramName:'bannerId'},
                    {url:'/cloudBanner/queryDecorateGraphicInfo',paramName:'graphicId'},
                    {url:'/cloudGoodsList/queryDecorateGoodsListInfo',paramName:'goodslistId'},
                    {url:'/cloudShoplist/queryDecorateShoplistInfo',paramName:'shoplistId'},
                    {url:'/cloudTitle/queryDecorateTitleInfo',paramName:'titleId'},
                    {url:'/cloudRichtext/queryDecorateRichtextInfo',paramName:'textId'},
                    {url:'/cloudClassifyList/queryDecorateClassifyListInfo',paramName:'classifyId'},
                    {url:'/cloudGrouponCampaign/queryDecorateGrouponCampaignInfo',paramName:'grouponId'},
                    {url:'/cloudNavigation/queryDecorateNavigationInfo',paramName:'navigationId'}
                   ];

let ornamentInfoList = [];
//获取购物首页控件信息
export let getPageLayoutById = ()=> {
  //let url="/cloud-web/cloudPage/queryHomePageLayout?pageId=1";
  let url = "/cloudPage/queryPageLayoutById?pageId=21";
  //return dispatch => {
       Util.get(url, (response) => {
         console.log("-----第一层。。。。",response);
          if(response.status===0){ //0 为返回了
              let tPageLayout  = response.body.tPageLayoutUnionComponentList;
               tPageLayout.map((item)=>{
                  let type = item.componentType;
                  let contorlUrl = controlUrls[type-1].url+"?"+controlUrls[type-1].paramName+"="+item.componentId; 
                  var p = new Promise(function (resolve, reject) {
                      getControlData(contorlUrl,item,type);
                  });
                  promiseFnArr.push(p);
             })
             Promise.all(promiseFnArr).then(function (results) {
              console.log(results); // 获得一个Array: ['P1', 'P2']
             });
          }else{
            ornamentInfoList = toolData.banner.data;
            contants.ornameGraphic = toolData.graphic.data;
            dealGoodsListRes(toolData.goodsList);
            dealShoplistRes(toolData.shoplist);
            dealTitleRes(toolData.title);
            dealRichtextRes(toolData.richtext);
            dealClassifyListRes(toolData.classifyList);
            dealGrouponCampaignRes(toolData.grouponCampaign);
            dealNavigationRes(toolData.navigation);

          }
      }, (error) => {
            console.log(2222111111);
            ornamentInfoList = toolData.banner.data;
            contants.ornameGraphic = toolData.graphic.data;
            dealGoodsListRes(toolData.goodsList);
            dealShoplistRes(toolData.shoplist);
            dealTitleRes(toolData.title);
            dealRichtextRes(toolData.richtext);
            dealClassifyListRes(toolData.classifyList);
            dealGrouponCampaignRes(toolData.grouponCampaign);
            dealNavigationRes(toolData.navigation);
      });
   // }
};


    //各控件 请求 ，获取各控件的数据
  export let doResControlData = (response,type) => {
          //1:Banner组件 2：图文导航组件 3：商品列表组件 4：店铺列表组件 5：标题组件  6：富文本组件 7：分类列表组件  8：拼团活动组件 9：导航栏组件',
          switch(type){
            case 1:
              dealBannerRes(response);
              break;
            case 2:
               dealGraphicRes(response);
              break
            case 3:
              dealGoodsListRes(response);
              break;
            case 4:
               dealShoplistRes(response);
               break;
            case 5:
              dealTitleRes(response);
              break;
            case 6:
             dealRichtextRes(response);
              break;
            case 7:
              dealClassifyListRes(response);
               break;
            case 8:
              dealGrouponCampaignRes(response);
              break;
            case 9:
               dealNavigationRes(response);
               break;
         }
};

    //各控件 请求 ，获取各控件的数据
export let getControlData = (url,componentObj,type) => {
         Util.get(url, (response) => { 
             //1:Banner组件 2：图文导航组件 3：商品列表组件 4：店铺列表组件 5：标题组件  6：富文本组件 7：分类列表组件  8：拼团活动组件 9：导航栏组件',
             switch(type){
               case 1:
                 dealBannerRes(response);
                 break;
               case 2:
                  dealGraphicRes(response);
                 break
               case 3:
                 dealGoodsListRes(response);
                 break;
               case 4:
                  dealShoplistRes(response);
                  break;
               case 5:
                 dealTitleRes(response);
                 break;
               case 6:
                dealRichtextRes(response);
                 break;
               case 7:
                 dealClassifyListRes(response);
                  break;
               case 8:
                 dealGrouponCampaignRes(response);
                 break;
               case 9:
                  dealNavigationRes(response);
                  break;
            }
      }, (error) => {
            console.log("各控件请求失败",error);
      });
};
//1:Banner组件
let dealBannerRes = (result) =>{
    if(result.status === 0){
        let bannerData = result.data;
        let deBanner = bannerData.tdecorateBanner;
      //  let pictureList = bannerData.tdecoratePictureVoList;
        let ornamentObj = {
            orSort:deBanner.componentSort,
            orName:"banner",
            orInfo:{
                bannareStyle:deBanner.bannareStyle,
                distance:deBanner.distance,
                interval:deBanner.pictureInterval,
                picWidth:deBanner.pictureWidth,
                pictureList:bannerData.tdecoratePictureVoList
            }
        };
        ornamentInfoList.push(ornamentObj);
        contants.ornameInfo = ornamentInfoList;
    }else{
        console.log("获取banner控件信息失败");
    }
}
//2：图文导航组件
let dealGraphicRes = (result) =>{
  if(result.status === 0){
      let graphicNav = result.data.tdecorateGraphicNavigation;
      let graphicVoList = result.data.tdecoratePictureVoList;
      let ornamentObj = {
            orSort:graphicNav.componentSort,
            orName:"graphic",
            orInfo:{
                graphicNav:graphicNav,
                voList:graphicVoList
            }
          }
          contants.ornameGraphic = ornamentObj;
     }else{
       console.log("获取图文导航装饰信息失败");
     }
}
//3：商品列表组件
let dealGoodsListRes= (result) =>{
   if(result.status === 0){
     let deGoodsList = result.data;
     let ornamentObj = {
        orSort:deGoodsList.componentSort,
        orName:"goodsList",
        orInfo:deGoodsList,
        goodsList:[]
    };
    //获取商品列表
    getGoodsList(ornamentObj,deGoodsList.goodslistId,0,"",deGoodsList.sortRule);
   }else{
       console.log("获取商品列表组件信息失败");
     }
}
//4：店铺列表组件 
let dealShoplistRes = (result) =>{
  if(result.status === 0){
    let deShopList = result.data;
    let ornamentObj = {
       orSort:deShopList.componentSort,
       orName:"shopList",
       orInfo:deShopList,
       shopList:[]
   };
   //获取店铺列表
   getShopList(ornamentObj,deShopList.shoplistId,1,deShopList.sortRule);
  }else{
    console.log("获取店铺列表组件信息失败");
  }
}
//5：标题组件 
let dealTitleRes = (result) =>{
  if(result.status === 0){
    let ornamentObj = {
      orSort:result.data.componentSort,
      orName:"title",
      orInfo:result.data
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList; 
  }else{
    console.log("获取标题组件信息失败");
  }
}
//6：富文本组件
let dealRichtextRes = (result) =>{
 if(result.status === 0){
  let ornamentObj = {
    orSort:result.data.componentSort,
    orName:"richTxt",
    orInfo:result.data
  };
  ornamentInfoList.push(ornamentObj);
  contants.ornameInfo = ornamentInfoList; 
 }else{
   console.log("获取富文本组件信息失败");
 }
}
//7：分类列表组件
let dealClassifyListRes = (result) =>{
  if(result.status === 0){
    let deClassify = result.body.tDecorateClassifyList;
    let classifyList = result.body.tDecorateClassifyTitleList;
    let ornamentObj = {
      orSort:deClassify.componentSort,
      orName:"classifyList",
      orInfo:deClassify,
      classList:classifyList,
      goodsList:[]
    };
    if(classifyList.length !=0){
        //获取分类商品列表
        getGoodsList(ornamentObj,deClassify.classifyId,2,classifyList[0].classifyTitleId,deClassify.sortRule);
    }else{
       ornamentInfoList.push(ornamentObj);
       contants.ornameInfo = ornamentInfoList;
    } 
 
 }
}
//8:拼团活动组件
let dealGrouponCampaignRes = (result) =>{
  if(result.status === 0){
    let collageObj = result.data;
    console.log("查询的拼团数据...",collageObj);
    let ornamentObj = {
      orSort:collageObj.componentSort,
      orName:"group",
      orInfo:collageObj,
      goodsList:[]
    };
     getGoodsList(ornamentObj,collageObj.grouponId,3,"",0);
  }else{
     ornamentInfoList.push(ornamentObj);
     contants.ornameInfo = ornamentInfoList;
  }
}
//9:导航栏组件
let dealNavigationRes = (result) =>{
  if(result.status === 0){
    let navData = result.data;
    let ornamentObj = {
      orSort:navData.decorateNavigation.componentSort,
      orName:"navgation",
      orInfo:navData.decorateNavigation,
      navList:navData.tdecoratePictureVoList
    };
    ornamentInfoList.push(ornamentObj);
    contants.ornameInfo = ornamentInfoList; 
   }else{
     console.log("获取富文本组件信息失败");
   }
} 


//获取商品列表
export let getGoodsList = (ornamentObj,linkId,linkType,classId,sortRule) => {
  let url = "/cloudGoods/getHomePageGoodsList?linkId="+linkId+"&linkType="+linkType+"&classifyTitleId="+classId+"&sortRule="+sortRule;
  ornamentObj.goodsList=[];
    Util.get(url, (response) => { 
      if(response.status === 0){
         ornamentObj.goodsList = response.body.goodsListInfo;
         ornamentInfoList.push(ornamentObj);
         contants.ornameInfo = ornamentInfoList;
      }
  }, (error) => {
      console.log("获取商品列表失败",error);
  });
}

//获取店铺列表
export let getShopList = (ornamentObj,linkId,linkType,sortRule) =>{
  let url = "/cloudShop/getHomePageShopList?linkId="+linkId+"&linkType="+linkType+"&sortRule="+sortRule;
    Util.get(url, (response) => { 
      if(response.status === 0){
         ornamentObj.shopList = toolData.shops.body.shopListInfo;
         ornamentInfoList.push(ornamentObj);
         contants.ornameInfo = ornamentInfoList;
      }
  }, (error) => {
      console.log("获取商品列表失败",error);
  });
}