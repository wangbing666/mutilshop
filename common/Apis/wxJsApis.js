/**
 * Created by chenmao on 2017/7/11.
 */
import * as Util from './Fetch'
import * as constant from './constants'
import NativeShare from './native'
import * as db from './Utils';
/**
 * shareInfo={
 *      title:'',分享标题,
 *      desc:'',分享描述,
 *      imgUrl:'',分享图片缩略图url,
 *      linkUrl:'',分享连接url
 * }
 *jsApiList是一个需要用到微信api数组；例如['checkJsApi','chooseImage','onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ']；
 *url当前页面通过encodeURIComponent(location.href.split('#')[0]);取得
 * isGoodDetailPage判断是否是商品详情的分享
 */
export const wxShare = (jsApiArr, shareContent, isGoodDetailPage) => {
  const shareUrl = location.href;
  Util.post("/sharePage", { pageUrl: shareUrl }, (res) => {
    if (res.status == 0 && res.body) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: constant.appId, // 必填，公众号的唯一标识
        timestamp: res.body.nowTime, // 必填，生成签名的时间戳
        nonceStr: res.body.noncestr, // 必填，生成签名的随机串
        signature: res.body.encodeTicket,// 必填，签名
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
      });
      wxSharePage()
    } else {
      console.log('获取签名失败')
    }
  }, (err) => {
    console.log(err)
  });
};

// 分享到朋友圈或分享给朋友
const wxSharePage = () => {
  wx.onMenuShareAppMessage({
    title: '微度智能说', // 分享标题
    desc: '随时随地，共享你的云端智能生活', // 分享描述
    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'http://qiniu.wedo77.com/FjTkpmAM8ISs2Vi93TZXfo6gI9WU', // 分享图标
    type: '',
    dataUrl: '',
    success: function () {
      // 设置成功
    }
  });
  wx.onMenuShareTimeline({
    title: '微度智能说', // 分享标题
    link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: 'http://qiniu.wedo77.com/FjTkpmAM8ISs2Vi93TZXfo6gI9WU', // 分享图标
    success: function () {
      // 设置成功
    }
  });
}