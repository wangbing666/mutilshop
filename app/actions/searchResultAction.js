import * as types from "./actionTypes";
import * as Util from "../../common/Apis/Fetch";

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
  productList: [{
    id: Math.ceil(Math.random()*1e10),
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    price: 998
  },{
    id: Math.ceil(Math.random()*1e10),
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    price: 998
  },{
    id: Math.ceil(Math.random()*1e10),
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    price: 998
  }],
  title: 'Meet hotel',
  des: '不是所有的兼职汪都需要风吹日晒   -'+(index+1),
}))
//商品列表数据
let data2 = arr.map((item, index) => ({
  shopId: 3,
  shopName: '店铺名称长店铺名称长店2铺4名6称8长0店铺名称长店铺名称长',
  productId: Math.ceil(Math.random()*1e10),
  productName: '欧式真皮沙发客厅整装组合实木大小简美式经济型套装奢华家具',
  logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
  isGroup: 1,
  groupPrice: 899.01,
  price: 999.02,
  priceOld: 1000.02,
  pv: 6689888
}))
//{id:0,name:'全部',active:1}
let productTypeArr = [{id:1,name:'服饰'},{id:2,name:'鞋类箱包'},{id:3,name:'运动户外'},{id:4,name:'珠宝配饰'},{id:5,name:'化妆品'},{id:6,name:'家具家居'},{id:7,name:'图书音像'},{id:8,name:'乐器'},{id:9,name:'服务大类'},{id:10,name:'汽车配件'},{id:11,name:'票务凭证'},{id:12,name:'家居日用'},{id:13,name:'母婴'},{id:14,name:'食品'},{id:15,name:'医药保健'},{id:16,name:'3C数码'},{id:17,name:'家用电器'},{id:18,name:'虚拟充值'},{id:19,name:'话费通信'}];
let productSubType = [{id: 1, name: '服饰', list: [
    {
      id: 11,
      name: '服饰配件/皮带/帽子/围巾',
      logo: require('../images/goodsType/f1.png')
    },{
      id: 12,
      name: '女装/女士精品/',
      logo: require('../images/goodsType/f2.png')
    },{
      id: 13,
      name: '男装',
      logo: require('../images/goodsType/f3.png')
    },{
      id: 14,
      name: '女士内衣/男士内衣/家居服',
      logo: require('../images/goodsType/f4.png')
    }]
  },{
    id: 2, name: '鞋类箱包', list: [
    {
      id: 21,
      name: '箱包皮具/热销女包/男包',
      logo: require('../images/goodsType/x1.png')
    },{
      id: 22,
      name: '女鞋',
      logo: require('../images/goodsType/x2.png')
    },{
      id: 23,
      name: '流行男鞋',
      logo: require('../images/goodsType/x3.png')
    }]
  },{
    id: 3, name: '运动户外', list: [
    {
      id: 31,
      name: '运动鞋new',
      logo: require('../images/goodsType/y1.png')
    },{
      id: 32,
      name: '运动服/休闲服装',
      logo: require('../images/goodsType/y2.png')
    },{
      id: 33,
      name: '运动/瑜伽/健身/球迷用品',
      logo:  require('../images/goodsType/y3.png')
    },  {
      id: 34,
      name: '电动车/配件/交通工具',
      logo:  require('../images/goodsType/y4.png')
    },{
      id: 35,
      name: '自行车/骑行装备/零配件',
      logo:  require('../images/goodsType/y5.png')
    },{
      id: 37,
      name: '户外/登山/野营/旅行用品',
      logo:  require('../images/goodsType/y6.png')
    },{
      id: 38,
      name: '运动包/户外包/配件',
      logo:  require('../images/goodsType/y7.png')
    }]
},
{
  id: 4, name: '珠宝配饰', list: [
  {
    id: 41,
    name: 'ZIPO/瑞士军刀/眼镜',
    logo: require('../images/goodsType/z1.png')
  },{
    id: 42,
    name: '手表',
    logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png'
  },{
    id: 43,
    name: '饰品/流行首饰/时尚饰品新',
    logo: require('../images/goodsType/z2.png')
  },{
    id: 44,
    name: '女士内衣/男士内衣/家居服',
    logo: require('../images/goodsType/z3.png')
  }]
},
{
  id: 5, name: '化妆品', list: [
  {
    id: 51,
    name: '彩妆/香水/美妆工具',
    logo: require('../images/goodsType/h1.png')
  },{
    id: 52,
    name: '美发护发/假发',
    logo: require('../images/goodsType/h2.png')
  },{
    id: 53,
    name: '美容护肤/美体/精油',
    logo: require('../images/goodsType/h3.png')
  }]
},
{
  id:6, name: '家具家居', list: [
  {
    id: 61,
    name: '基础建材',
    logo: require('../images/goodsType/j1.png')
  },{
    id: 62,
    name: '家居饰品',
    logo: require('../images/goodsType/j2.png')
  },{
    id: 63,
    name: '五金/工具',
    logo: require('../images/goodsType/j3.png')
  },{
    id: 64,
    name: '电子/电工',
    logo: require('../images/goodsType/j4.png')
  },{
    id: 65,
    name: '特色手工艺',
    logo: require('../images/goodsType/j5.png')
  },{
    id: 66,
    name: '家装主材',
    logo: require('../images/goodsType/j6.png')
  },{
    id: 67,
    name: '商业/办公家具',
    logo: require('../images/goodsType/j7.png')
  },{
    id: 68,
    name: '住宅家具',
    logo: require('../images/goodsType/j8.png')
  },
  {
    id: 69,
    name: '床上用品',
    logo: require('../images/goodsType/j9.png')
  },{
    id: 610,
    name: '居家布艺',
    logo: require('../images/goodsType/j10.png')
  },
  {
    id: 611,
    name: '鲜花速递/花卉仿真/绿植园艺',
    logo: require('../images/goodsType/j11.png')
  }, 
  {
    id: 612,
    name: '全屋定制',
    logo: require('../images/goodsType/j12.png')
  }
]
},
{
  id: 7, name: '图书音像', list: [
  {
    id: 71,
    name: '书籍/杂志/报纸',
    logo: require('../images/goodsType/t1.png')
  },{
    id: 72,
    name: '音乐/影视/明星/音像',
    logo: require('../images/goodsType/t2.png')
  }]
},
{
  id: 8, name: '乐器', list: [
  {
    id: 81,
    name: '乐器/吉他/钢琴/配件',
    logo: require('../images/goodsType/yq1.png')
  }]
},{
  id: 9, name: '服务大类', list: [
  {
    id: 91,
    name: '餐饮美食',
    logo: require('../images/goodsType/fw1.png')
  },{
    id: 92,
    name: '休闲娱乐',
    logo: require('../images/goodsType/fw2.png')
  },{
    id: 93,
    name: '电影/演出/体育赛事',
    logo: require('../images/goodsType/fw3.png')
  },
  {
    id: 94,
    name: '本地化生活服装',
    logo: require('../images/goodsType/fw4.png')
  },{
    id: 95,
    name: '医疗及健身服务',
    logo: require('../images/goodsType/fw5.png')
  },{
    id: 96,
    name: '教育培训',
    logo: require('../images/goodsType/fw6.png')
  },
  {
    id: 97,
    name: '婚庆/摄影/摄像服务',
    logo: require('../images/goodsType/fw7.png')
  },{
    id: 98,
    name: '购物提货券/蛋糕面包',
    logo: require('../images/goodsType/fw8.png')
  },{
    id: 99,
    name: '超市卡/商场购物卡',
    logo: require('../images/goodsType/fw9.png')
  },  {
    id: 910,
    name: '个性定制/设计服务/DIY',
    logo: require('../images/goodsType/fw10.png')
  },{
    id: 911,
    name: '网店/网络服装/软件',
    logo: require('../images/goodsType/fw11.png')
  },{
    id: 912,
    name: '装修设计/施工/监理',
    logo: require('../images/goodsType/fw12.png')
  },{
    id: 913,
    name: '室内设计师',
    logo: require('../images/goodsType/fw13.png')
  }]
},
{
  id: 10, name: '汽车配件', list: [
  {
    id: 101,
    name: '汽车/用品/配件/改装',
    logo: require('../images/goodsType/qc1.png')
  },{
    id: 102,
    name: '摩托车/配件/骑士装备',
    logo: require('../images/goodsType/qc2.png')
  },{
    id: 103,
    name: '整车（经销商）',
    logo: require('../images/goodsType/qc3.png')
  },{
    id: 104,
    name: '新车/二手车（品牌商）',
    logo: require('../images/goodsType/qc4.png')
  }]
},
{
  id: 11, name: '票务凭证', list: [
  {
    id: 111,
    name: '电子凭证',
    logo: require('../images/goodsType/pz1.png')
  }]
},
{
  id: 12, name: '家居日用', list: [
  {
    id: 121,
    name: '居家日用',
    logo: require('../images/goodsType/jj1.png')
  },{
    id: 122,
    name: '节庆用品/礼品',
    logo: require('../images/goodsType/jj2.png')
  },{
    id: 123,
    name: '收纳整理',
    logo: require('../images/goodsType/jj3.png')
  },{
    id: 124,
    name: '家庭/个人清洁工具',
    logo: require('../images/goodsType/jj3.png')
  },{
    id: 125,
    name: '洗护清洁剂/卫生巾/纸/香薰',
    logo: require('../images/goodsType/jj4.png')
  },{
    id: 126,
    name: '厨房/烹饪用具',
    logo: require('../images/goodsType/jj5.png')
  },{
    id: 127,
    name: '餐饮具',
    logo: require('../images/goodsType/jj6.png')
  },
  {
    id: 128,
    name: '宠物/宠物食品及用品',
    logo: require('../images/goodsType/jj7.png')
  }]
},
{
  id: 13, name: '母婴', list: [
  {
    id: 131,
    name: '奶粉/辅食/营养品/零食',
    logo: require('../images/goodsType/my1.png')
  },{
    id: 132,
    name: '童装/婴儿装/亲子装',
    logo: require('../images/goodsType/my2.png')
  },{
    id: 133,
    name: '童鞋/婴儿鞋/亲子鞋',
    logo: require('../images/goodsType/my3.png')
  },{
    id: 134,
    name: '孕妇装/孕产妇用品/营养',
    logo: require('../images/goodsType/my4.png')
  },{
    id: 135,
    name: '玩具/童车/益智/积木/模型',
    logo: require('../images/goodsType/my5.png')
  },{
    id: 136,
    name: '尿片/洗护/喂哺/推车床',
    logo: require('../images/goodsType/my6.png')
  },{
    id: 137,
    name: '模玩/动漫/周边/COS/桌游',
    logo: require('../images/goodsType/my7.png')
  }]
},
{
  id: 14, name: '食品', list: [
  {
    id: 141,
    name: '零食/坚果/特产',
    logo: require('../images/goodsType/sp1.png')
  },{
    id: 142,
    name: '酒类',
    logo: require('../images/goodsType/sp2.png')
  },{
    id: 143,
    name: '咖啡/麦片/冲饮',
    logo: require('../images/goodsType/sp3.png')
  },{
    id: 144,
    name: '茶',
    logo: require('../images/goodsType/sp4.png')
  },{
    id: 145,
    name: '粮油米面/南北干货/调味品',
    logo: require('../images/goodsType/sp5.png')
  },{
    id: 146,
    name: '水产肉类/新鲜蔬菜/熟食',
    logo: require('../images/goodsType/sp6.png')
  }]
},
{
  id: 15, name: '医药保健', list: [
  {
    id: 151,
    name: '传统滋补营养品',
    logo: require('../images/goodsType/yy1.png')
  },{
    id: 152,
    name: '成人用品/情趣用品',
    logo: require('../images/goodsType/yy2.png')
  },{
    id: 153,
    name: '保健食品/膳食营养补充食品',
    logo: require('../images/goodsType/yy3.png')
  },{
    id: 154,
    name: 'OTC药品/医疗器械/计生用品',
    logo: require('../images/goodsType/yy4.png')
  },{
    id: 155,
    name: '精制中药材',
    logo: require('../images/goodsType/yy5.png')
  },{
    id: 156,
    name: '隐形眼镜/护理液',
    logo: require('../images/goodsType/yy6.png')
  }]
},
{
  id: 16, name: '3C数码', list: [
  {
    id: 161,
    name: '网络设备/网络相关',
    logo: require('../images/goodsType/sm1.png')
  },{
    id: 162,
    name: 'DIY电脑',
    logo: require('../images/goodsType/sm2.png')
  },{
    id: 163,
    name: '品牌台机/品牌一体机',
    logo: require('../images/goodsType/sm3.png')
  },{
    id: 164,
    name: '数码相机/单反相机/摄像机',
    logo: require('../images/goodsType/sm4.png')
  },{
    id: 165,
    name: 'MP3/MP4/iPod/录音笔',
    logo: require('../images/goodsType/sm5.png')
  },{
    id: 166,
    name: '手机',
    logo: require('../images/goodsType/sm6.png')
  },{
    id: 167,
    name: '电脑硬件/显示器/电脑周边',
    logo: require('../images/goodsType/sm7.png')
  },{
    id: 168,
    name: '笔记本电脑',
    logo: require('../images/goodsType/sm8.png')
  },{
    id: 169,
    name: '3C数码配件',
    logo: require('../images/goodsType/sm9.png')
  },{
    id: 1610,
    name: '电子元器件市场',
    logo: require('../images/goodsType/sm10.png')
  },
  {
    id: 1611,
    name: '闪存卡/U盘/存储/移动硬盘',
    logo: require('../images/goodsType/sm11.png')
  },{
    id: 1612,
    name: '电玩/配件/游戏/攻略',
    logo: require('../images/goodsType/sm12.png')
  },{
    id: 1613,
    name: '平板电脑/MID',
    logo: require('../images/goodsType/sm13.png')
  },{
    id: 1614,
    name: '智能设备',
    logo: require('../images/goodsType/sm14.png')
  },{
    id: 1615,
    name: '办公设备/耗材/相关服务',
    logo: require('../images/goodsType/sm15.png')
  },
  {
    id: 1616,
    name: '电子词典/电纸书/文化用品',
    logo: require('../images/goodsType/sm16.png')
  },{
    id: 1617,
    name: '包装',
    logo: require('../images/goodsType/sm17.png')
  }
]
},{
  id: 17, name: '家用电器', list: [
  {
    id: 171,
    name: '影音电器',
    logo: require('../images/goodsType/jy1.png')
  },{
    id: 172,
    name: '厨房电器',
    logo: require('../images/goodsType/jy2.png')
  },{
    id: 173,
    name: '生活电器',
    logo: require('../images/goodsType/jy3.png')
  },{
    id: 174,
    name: '大家电',
    logo: require('../images/goodsType/jy4.png')
  },{
    id: 175,
    name: '个人护理/保健/按摩器材',
    logo: require('../images/goodsType/jy5.png')
  }]
},{
  id: 18, name: '虚拟充值', list: [
  {
    id: 181,
    name: '网络游戏点卡',
    logo: require('../images/goodsType/xn1.png')
  },{
    id: 182,
    name: '腾讯QQ专区',
    logo: require('../images/goodsType/xn2.png')
  },{
    id: 183,
    name: '网游装备/游戏币/账号/代练',
    logo: require('../images/goodsType/xn3.png')
  }]},{
    id: 19, name: '话费通信', list: [
    {
      id: 191,
      name: '移动/联通/电信/充值中心',
      logo: require('../images/goodsType/hf1.png')
    },{
      id: 192,
      name: '合约机',
      logo: require('../images/goodsType/hf2.png')
    },{
      id: 193,
      name: '手机号码/套餐/增值业务',
      logo: require('../images/goodsType/hf3.png')
    }]
}
]

//获取商品分类 一级类目 
export let getProductType = (url) => {
  return dispatch => {
    Util.get(url,(res) => {
      if(res.status == 0){
        let cateList = res.body.result;
        // productTypeArr = [{id:0,name:'全部',active:1}];
        productTypeArr=[];
        for(let i = 0 ; i<cateList.length;i++){
          if(cateList[i]){ //分类 一级目录---》父类
            console.log(productSubType[i].id)
            productSubType[i].id = cateList[i].categoryId;
            productSubType[i].name = cateList[i].categoryName;
            let ptObj = {
              id:cateList[i].categoryId,
              name:cateList[i].categoryName,
              active:''
             }
             if(i===0) ptObj.active = 1;
            productTypeArr.push(ptObj)
          }
        }
        dispatch({
          type: types.GET_PRODUCT_TYPE,
          data: {
            productTypeArr,
          }
        })
      }
    }, (err) => {
      console.error('一级类目请求失败',err);
      dispatch({
        type: types.GET_PRODUCT_TYPE,
        data: {
          productTypeArr,
          //productSubType
        }
      })
    })
  }
}

//获取商品分类 二级类目
export let getProductSubType = (url,fuId,fuName) => {
  return dispatch => {
    Util.get(url,(res) => {
      if(res.status == 0){
        let resProductSubType={id:fuId,name:fuName,list:[]};
        let cateList = res.body.result;
        let subPrjectObj = productSubType.filter(item => item.id == fuId);  //查找写死中对应的二级类目
        for(let i = 0 ; i<cateList.length;i++){
          if(cateList[i] && subPrjectObj){ //分类 一级目录---》父类
            let pstObj = {
              id:cateList[i].categoryId,
              name:cateList[i].categoryName,
              logo:subPrjectObj[0].list[i].logo
             }
             resProductSubType.list.push(pstObj)
          }   
        }
        dispatch({
          type: types.GET_SUBPRODUCT_TYPE,
          data: {
            resProductSubType,
          }
        })
      }
    }, (err) => {
      console.error(err);
      dispatch({
        type: types.GET_SUBPRODUCT_TYPE,
        data: {
        //  productTypeArr,
          productSubType
        }
      })
    })
  }
}
//关键字
export let setKeyword = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_KEY_WORD,
      keyWord: data
    })
  }
}

//商品/店铺切换
export let setSearchType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_SEARCH_TYPE,
      searchType: data
    })
  }
}

//样式切换
export let toggleListStyle = () => {
  return dispatch => {
    dispatch({
      type: types.TOGGLE_LIST_STYLE,
    })
  }
}

//商品排序方式
export let setRankType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_RANK_TYPE,
      rankType: data
    })
  }
 
}

//价格区间
export let setStartPrice = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_START_PRICE,
      startPrice: data
    })
  }
}

export let setEndPrice = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_END_PRICE,
      endPrice: data
    })
  }
}

//商品分类
export let setProductType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_PRODUCT_TYPE,
      productType: data
    })
  }
}

//搜索结果
export let setSearchResult = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_SEARCH_RESULT,
      searchResult: data
    })
  }
}


// let data2 = arr.map((item, index) => ({
//   shopId: 3,
//   shopName: '店铺名称长店铺名称长店2铺4名6称8长0店铺名称长店铺名称长',
//   productId: Math.ceil(Math.random()*1e10),
//   productName: '欧式真皮沙发客厅整装组合实木大小简美式经济型套装奢华家具',
//   logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
//   isGroup: 1,
//   groupPrice: 899.01,
//   price: 999.02,
//   priceOld: 1000.02,
//   pv: 6689888
// }))

// 执行搜索函数
export let search = (url,array,data, callback) => {
  return dispatch => {
    dispatch({
      type: types.SHOWLOADING,
      isLoading: true
    })
    Util.post(url, data, (res) => {
      dispatch({
        type: types.SHOWLOADING,
        isLoading: false
      })
      if(res.status === 0){
        let totalNum = 0;
        if(res.body.total) totalNum = res.body.total; // 总条数
        if(!array) array=[];
        if(data.searchType === 1){
          data2 = [];
          if(res.body && Array.isArray(res.body.list)) data2 =[...array,...res.body.list];
        }else{
          data1 = [];
          if(res.body && Array.isArray(res.body.list)) data1 = [...array,...res.body.list];
        }
        let hasMore = res.body.pageSize*data.currentPage - totalNum > 0 ? false : true;
        dispatch({
          type: types.SET_SEARCH_RESULT,
          searchResult: data.searchType === 1 ? { data: data2, pageSize: 8, pageNow: data.currentPage,total:totalNum,hasMore:hasMore} : { data: data1, pageSize: 8, pageNow: data.currentPage,total:totalNum,hasMore:hasMore}
        })
      }
    }, (err) => {
      console.log(err)
      dispatch({
        type: types.SHOWLOADING,
        isLoading: false
      })
    })
  }
}
// 二级类目搜索 函数
// export let searchByCategoryId = (url, data) => {

// }

// //搜索
// export let search = (url,data,successCallback,failCallback)=>{
//   return dispatch => {
//       dispatch({
//         type: types.SHOWLOADING,
//         isLoading: true
//       })
//       return Util.post(url,data,(response) => {
//           dispatch(showLoading(false));
//           successCallback(response)
//       }, (error) => {
//           dispatch(showLoading(false))
//           failCallback(error)
//       });
//   }
// }

//重置搜索结果
export let clearSearch = () => {
  return dispatch => {
    dispatch({
      type: types.CLEAR_SEARCH
    })
  }
}

//切换大类
export let toggleProductMainType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_PRODUCT_MAIN_TYPE,
      productTypeArr: data
    })
  }
}

//切换店铺排序方式
export let toggleShopRankType = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_SHOP_RANK_TYPE,
      shopRankType: data
    })
  }
}