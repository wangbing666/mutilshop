export const FETCH_HOME_LIST = 'FETCH_HOME_LIST';
//商品详情
export const GET_GOOD_DETAILS = 'GET_GOOD_DETAILS';
export const GET_GOODTYPE_SERVER='GET_GOODTYPE_SERVER'
export const ADD_GOOD_MOUNT = 'ADD_GOOD_MOUNT';
export const GET_ADDRESS_LIST = 'GET_ADDRESS_LIST';//获取收货地址列表
export const CHANGE_DETAIL_ADDRESS = 'CHANGE_DETAIL_ADDRESS';//更改默认地址
export const DELETE_RECEIPT_ADDRESS = 'DELETE_RECEIPT_ADDRESS'; //删除收货地址
export const ISSHOWACTIVITY = 'ISSHOWACTIVITY';//是否展示加载框

// 收藏列表
export const COLLECT_LIST = 'COLLECT_LIST';                // 更改收藏list
export const COLLECTLOADING = 'COLLECTLOADING';            // 收藏动画
// 登陆
export const LOGINBUITON = 'LOGINBUITON';                  // 登录之后更改userid
export const LOGINBUITONLOADING = 'LOGINBUITONLOADING'     // 加载动画
export const SETCODESTRING = 'SETCODESTRING'               // 更改验证码

// 购物袋
export const SETSHOPPINGCARTLIST = 'SETSHOPPINGCARTLIST';  // 购物袋数组
export const SETRECOMMENDLIST = 'SETRECOMMENDLIST';        // 购物袋热门推荐
export const SHOPPINGCARTLOADING = 'SHOPPINGCARTLOADING';  // 加载动画
export const SETALLSELECTIMAGE = 'SETALLSELECTIMAGE';      // 改变全选状态
export const SETDELECTSTATUSLIST = 'SETDELECTSTATUSLIST';  // 删除更新states
export const SETNUMBERACTION = 'SETNUMBERACTION';          // 改变商品数量

// 订单
export const SETORDERDEATAILSLIST = 'SETORDERDEATAILSLIST' // 订单已完成list
export const ORDERDETAILSLOADING = 'ORDERDETAILSLOADING'   // 加载动画


//
export const IS_SHOW_LOADING = 'IS_SHOW_LOADING';
export const RECEIVE_GOOD_DETAILS = 'RECEIVE_GOOD_DETAILS';
export const IS_GROUP_GOODS = 'IS_GROUP_GOODS';
export const RECEIVE_GOOD_SPECIFICATION = 'RECEIVE_GOOD_SPECIFICATION';
export const SHOW_PICTURE_BROWSE = 'SHOW_PICTURE_BROWSE';
//搜索模块
export const SEARCH_HISTORY_LIST = 'SEARCH_HISTORY_LIST';//历史记录列表
export const SEARCH_POPULAR_SEARCHES = 'SEARCH_POPULAR_SEARCHES';//热门搜索列表
export const SEARCH_FOR_PRODUCTS = 'SEARCH_FOR_PRODUCTS';//搜索商品列表
export const SEARCH_RESULTS = 'SEARCH_RESULTS';//搜索结果是否成功

//我的售后
export const SHOWLOADINGERROR = 'SHOWLOADINGERROR';
export const SHOWLOADING = 'SHOWLOADING';
export const GETHANDLESALELIST = 'GETHANDLESALELIST';//当前售后
export const GETSALEORDERLIST = ' GETSALEORDERLISTG';//售后记录列表
export const SELECTTABINAFTERSALE = 'SELECTTABINAFTERSALE';//选择某个tab

//首页

export const HOMEPAGE_LIST_OF_GOODS = 'HOMEPAGE_LIST_OF_GOODS';//首页商品列表
export const HOMEPAGE_IS_SHOW_LOADING = 'HOMEPAGE_IS_SHOW_LOADING';//页面加载动画
export const HOMEPAGE_SHOPDES='HOMEPAGE_SHOPDES';//店铺简要信息
export const GROUPING_NAME_LIST='GROUPING_NAME_LIST';//分组列表data
//OrderHome订单入口页面
export const ORDER_GET_NUMBER = 'ORDER_GET_NUMBER';//订单状态个数
//订单列表
export const GET_ORDER_LIST = 'GET_ORDER_LIST'; //获取订单列表

//订单结算
export const ORDER_IS_SHOW_LOADING='ORDER_IS_SHOW_LOADING';
export const RECEIVE_PAY_RESULT='RECEIVE_PAY_RESULT'
//单类商品列表
export const COMMODITY_LIST = 'COMMODITY_LIST'; //商品列表

export const GET_PEND_PAYMENT_LIST = 'GET_PEND_PAYMENT_LIST'; //获取待支付订单列表
export const GET_TO_BE_RECEIVED_LIST = 'GET_TO_BE_RECEIVED_LIST'; //获取待发货订单列表
export const GET_COMPLETETED_LIST = 'GET_COMPLETETED_LIST'; //获取已完成订单列表
export const GET_ALL_LIST = 'GET_ALL_LIST'; //获取全部订单列表
export const GET_ORDER_DETAIL_REACIVED = 'GET_ORDER_DETAIL_REACIVED' //待收货详情
export const GET_REFUND_DETAIL = 'GET_REFUND_DETAIL' //获取退货退款详情
export const SEND_EXPRESS_MSG = 'SEND_EXPRESS_MSG' //获取退货退款详情
export const GET_EXPRESS_LIST = 'GET_EXPRESS_LIST'; // 获取物流公司列表
export const GET_EXPRESS_VALUE_LIST = 'GET_EXPRESS_VALUE_LIST';// 获取物流公司列表Value
export const CLEAR_ORDER_DETAIL_DATA = 'CLEAR_ORDER_DETAIL_DATA';// 清除详情数据

//订单结算页面
export const SETTLEMENT_DEFAULT_ADDRESS='SETTLEMENT_DEFAULT_ADDRESS';//默认地址
export const SETTLEMENT_SELECT_ADDRESS='SETTLEMENT_SELECT_ADDRESS';//选择回掉地址
export const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS' //待付款获取数据成功
export const QUIT_ORDER_STATUS = 'QUIT_ORDER_STATUS' //取消订单状态
export const TAB_TYPE='TAB_TYPE';

export const SAVE_DATA = 'SAVE_DATA'


//客服聊天
export const APPLYCUSTOMERSERVICE='APPLYCUSTOMERSERVICE';//申请客服/停止
export const GETPERSONINQUEUE = 'GETPERSONINQUEUE' //获取排队人数
export const SETCOMMENTONCHAT = 'SETCOMMENTONCHAT' //评价客服

//团购详情
export const GROUPSTATUS = 'GROUPSTATUS';  //拼团状态
export const GROUPDETAILDATA = 'GROUPDETAILDATA';  //拼团详情


// 商品故事
export const PPSTORYLOADING = 'PPSTORYLOADING';   // 等待框
export const PPSTORYLIST = 'PPSTORYLIST';         // 商品故事列表



// 商品故事详情
export const PPSTORYDETAILSLOADING = 'PPSTORYDETAILSLOADING'; // 等待框
export const PPSTORYSETLOVE = 'PPSTORYSETLOVE';               // 商品故事是否喜欢
export const PPSTORYDETAILSDIC = 'PPSTORYDETAILSDIC';         // 商品故事dic
export const PPSTORYDETAILSARRAY = 'PPSTORYDETAILSARRAY'      // 商品故事Array
export const PPSTORYCOMMONTNUMBER = 'PPSTORYCOMMONTNUMBER'    // 商品故事数量

//店铺介绍
export const SHOPINFO = 'SHOPINFO'; // 获取店铺信息
export const ISFOCUSED = 'ISFOCUSED'; // 获取关注状态
export const FOCUS = 'FOCUS'; // 关注店铺
export const UNFOCUS = 'UNFOCUS'; // 取消关注店铺

//投诉 我要反馈
export const REASON = 'REASON'; //获取投诉原因列表
export const SELECTREASON = 'SELECTREASON'; //选择投诉原因
export const ADDREASON = 'ADDREASON'; //提交投诉原因

//投诉 上传证据
export const ADDIMG = 'ADDIMG'; //添加图片
export const DELETEIMG = 'DELETEIMG'; //删除图片
export const ADDTEXT = 'ADDTEXT'; //添加说明文字
export const SUBMITPROOF = 'SUBMITPROOF'; //提交投诉证据

export const IS_SHOP_FROZEN = 'IS_SHOP_FROZEN'; //店铺是否冻结
