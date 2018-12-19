/**
 * 用来存放项目中用到的常量
 * Created by chenmao on 2017/6/28.
 */
const environment = process.env.NODE_ENV; // 当前运行的环境
const origin = window.location.origin; // 获取当前主机域名
//公众号appId
export const appId =
  environment === 'prod'
    ? 'wx7a6fefa54a1dfe06' // 线上微信号
    : 'wxf1e94ab7588e40db'; // 测试号

//除商品详情页分享内容和标题
export const shareShopTitle = '微小店';
export const shareShopDesc = '微小店的描述';
export const chatServer = 'wss://uu.wedo77.com'; //聊天服务器

//公共路由配置
const Config = require('Config');
export let commonUrl = Config.commonUrl; // ''   '/flagship'  'retail'   ''
export let multishopUrl = `${origin}/multiShop`; // 页面跳转地址

// 根据运行环境自动打包线上或者测试环境
export let flagshipUrl =
  environment === 'prod'
    ? 'http://cloud.wedo77.com/flagship'
    : 'http://192.168.9.41/flagship';
export let fenXiaoUtl =
  environment === 'prod'
    ? 'http://cloud.wedo77.com/retail'
    : 'http://192.168.9.41/retail';
export let reqUrl =
  environment === 'prod'
    ? 'https://admin.wedo77.com/cloud-web'
    : 'http://192.168.9.41/cloud-web';
export let customerServiceUrl =
  environment === 'prod'
    ? 'http://admin.wedo77.com/customer-service/#/?'
    : 'http://192.168.9.41/customer-service/#/?';

export const commonServerUrl =
  environment === 'prod'
    ? 'http://cloud.wedo77.com/flagship'
    : 'http://192.168.9.41/flagship'; // 旗舰店地址分享用到
export const commonServerRetailUrl =
  environment === 'prod'
    ? 'http://cloud.wedo77.com/retail'
    : 'http://192.168.9.41/retail'; // 分销店地址分享用到
// 微信支付
export const wechatPayUrl =
  environment === 'prod'
    ? 'http://admin.wedo77.com/wedoH5pay/'
    : 'http://192.168.9.41/wedoH5pay/';

export let docHeight = 1334;
export let maxPrice = 999999999.0;

//所在页面url
export let url = null;

//地址详情
export let addressInfo = null;
//当前路由
export let currentHistory = null;

export let alertInstance = null;
export let access_token = null; //
export let viewStyDic = {
  //旗舰店样式
  showBanner: true, //banner显示
  showCategory: true, //显示分组分类
  showPartion: true, //显示分区
  COLOR3: '#ffffff',
  SHAPE: 1, //按钮形状
  SHOPWORKWORK: 'abc', //首页排序形式
  style_id: 1, //分组样式
  COLOR2: '#EAEDF1',
  COLOR1: '#4B90E2',
};

//多店首页装饰信息
export let ornameInfo = [];

// 店铺基本信息 分享专用
export let shopInfo = {
  //店铺基本信息
  authStatus: null,
  backgroundUrl: null,
  describes: '',
  fitmentId: null,
  fitmentUrl: null,
  fitmentZoomUrl: null,
  logoUrl: '',
  shopName: '',
  shareUrl: '',
  shopId: 0,
};

export let storyDetails = {
  shopId: '',
  goodsId: '0',
  title: '',
  content: '',
  picture: '',
  enterpriseId: 0,
  url: '',
  shareType: '12',
  sourceType: 1,
  storyId: '',
};

export let activityInfo = {
  //活动基本信息
};

export let groupShoppingDetailInfo = {
  //团购详情基本信息
};
export let shopPreView = null; //是否可以预览

export let homePageShareInfo = {}; //团购首页分享的信息

export let isJumpToPayment = false; //是否从订单详情跳转支付界面
export let createOrderData = {};

export let cartData = {};
export let goodsDetailData = {};

export let fbSaleOrderNo = '';
export let fbOrderId = '';
export let hasLiuHai = false;
export let isGetUserInfo = false;
export let shopName = '旗舰店';
