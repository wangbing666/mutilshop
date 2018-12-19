import * as types from "./actionTypes";
import * as Util from "../../common/Apis/Fetch";
import { deleteGoods } from "../../common/Apis/Utils";
import { Toast} from 'antd-mobile';

const arr = [];
for(let i = 0;i<10;i++){
  arr.push(i)
}

//店铺列表数据
let data1 = arr.map((item,index) => ({
  shopId: Math.ceil(Math.random()*1e10),
  shopName: '店铺名称长店铺名称长店2铺4名6称8长0店铺名称长店铺名称长',
  logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
  sales: 10000,
  productNum: 1000,
  title: 'Meet hotel',
  des: '不是所有的兼职汪都需要风吹日晒   -'+(index+1),
  collectTime: '2018-07-25',
  status: 0
}))

//商品列表数据
let data2 = arr.map((item, index) => ({
  shopId: 3,
  shopName: '店铺名称长店铺名称长店2铺4名6称8长0店铺名称长店铺名称长',
  productId: Math.ceil(Math.random()*1e10),
  productName: '欧式真皮沙发客厅整装组合实木大小简美式经济型套装奢华家具',
  logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
  isGroup: 1,
  price: 999.02,
  collectTime: '2018-07-25',
  status: '已下架'
}))

//关键字
export let setKeyword = data => {
  return dispatch => {
    dispatch({
      type: types.SET_COLLECT_KEYWORD,
      keyWord: data
    })
  }
}

//搜索
export let search = (array,url,data,index) => {
 // console.log("index----",index);
  return dispatch => {
    dispatch({
      type: types.SHOWLOADING,
      isLoading: true
    })
    //测试使用测试使用
   // data.userId = "12497395";
    Util.post(url, data, (res) => {
      dispatch({
        type: types.SHOWLOADING,
        isLoading: false
      })
      if(res.status == 0){
          if(!array) array = [];
          if(index == 1){
            data2=[];
            let resData2 = res.body.collectionVoGoodsList;
            if(Array.isArray(resData2.list))
              data2 = [...array,...resData2.list];
              // console.log(".....",data2);
            let hasMore = data2.length >= resData2.total ? false : true;
            dispatch({
              type: types.SET_COLLECT_PRODUCT,
              productList: data2,
              pageNow:data.pageIndex,
              hasMore:hasMore
            })
          }else{
            data1=[];
            let resData1 = res.body.collectionVoShopList;
            if(Array.isArray(resData1.list))
              data1 = [...array,...resData1.list];
              let hasMore = data1.length >= resData1.total ? false : true;
            dispatch({
              type: types.SET_COLLECT_SHOP,
              shopList: data1,
              pageNow:data.pageIndex,
              hasMore:hasMore
             // shopTotal: data1.length
            })
          }
      }
    }, (err) => {
      console.log("获取收藏列表error",err)
      dispatch({
        type: types.SHOWLOADING,
        isLoading: false
      })
    })
  }
}

export let deleteCollection = (url,collectId,type,collectList,index) => {
  return dispatch => {
    Util.post(url, collectId, (res) => {
      if(res.status == 0 ){   //删除收藏成功
        collectList.splice(index,1);
        if(type === 1){
          dispatch({
            type: types.SET_COLLECT_PRODUCT,
            productList: collectList,
            goodsTotal: collectList.length
          })
        }else{
          dispatch({
            type: types.SET_COLLECT_SHOP,
            shopList: collectList,
            shopTotal: collectList.length
          })
        }
        Toast.info('删除成功',1);
      }else{
        Toast.info('删除失败',1);
      }
  },(err) =>{

  })
  }
}
//切换分类
export let setCollectType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_COLLECT_TYPE,
      data
    })
  }
}

export let clearShopList = () => {
  return dispatch => {
    dispatch({
      type: types.CLEAR_COLLECT_SHOP,
    })
  }
}

export let clearProductList = () => {
  return dispatch => {
    dispatch({
      type: types.CLEAR_COLLECT_PRODUCT,
    })
  }
}