/**
 * 封装get,post等请求方法
 * Created by chenmao on 2017/6/28.
 */
import * as qiniu from "qiniu-js";
import * as db from "./Utils";

//内网
import * as contants from "../Apis/constants";
import * as Utils from "./Utils";
import { Toast } from "antd-mobile";

const environment = process.env.NODE_ENV;

export const commonIp = "";
export const commonUrl = environment === 'prod' ? "http://admin.wedo77.com/cloud-web" : "http://192.168.9.41/cloud-web";
const commonIpHash = "https://res.wedo77.com"; //获取hash zhi
const commonIpFile = "http://res.wedo77.com"; // 获取file id

export const get = (url, successCallback, failCallback) => {
  $.ajax({
    type: "GET",
    url: commonUrl + url,
    dataType: "json",
    timeout: 15000, // 设置超时时间
    success: function(data) {
      successCallback(data);
    },
    error: function(err) {
      failCallback(err);
    },
    complete: function(XMLHttpRequest, status) {
      //不管成功失败都走这个回调
      if (status == "timeout") {
        xhr.abort(); // 超时后中断请求
        failCallback("网络失败");
      }
    }
  });
};

export const postWithIp = (url, data, successCallback, failCallback) => {
  let Url = commonIp + url;
  // Url = 'http://wx.weidu7.com/weixin'+url
  console.log(url);
  $.ajax({
    type: "POST",
    url: Url,
    data: data,
    dataType: "json",
    timeout: 15000, // 设置超时时间
    cache: false,
    beforeSend: function(xhr) {},
    success: function(data) {
      console.log("请求成功...");
      successCallback(data);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      let responseDic = XMLHttpRequest.responseJSON;
      if (responseDic.status == -101 || responseDic.status == -102) {
        //重新登陆
        console.log(history);
        if (!contants.currentHistory) {
          Toast.info("无法跳转登陆界面");
        } else {
          let url =
            contants.commonUrl +
            "/login" +
            "/?pathname=orderHome" +
            "&type=" +
            -1 +
            "&shopId=" +
            contants.shopInfo.shopId;
          contants.currentHistory.push({
            pathname: url,
            type: -1
          });
        }
      } else {
        failCallback(XMLHttpRequest);
      }
    },
    complete: function(XMLHttpRequest, status) {
      if (status == "timeout") {
        xhr.abort(); // 超时后中断请求
        failCallback("网络失败");
      }
    }
  });
};

export const post = (
  url,
  data,
  successCallback,
  failCallback,
  userId,
  checkcode
) => {
  let Url = commonUrl + url;
  //let ua = navigator.userAgent.toLowerCase();
   $.ajax({
    type: "POST",
    url:Url,
    data:data,
    dataType: "json",
    //contentType:"application/x-www-form-urlencoded",
    timeout: 15000, // 设置超时时间
    cache: false,
    // beforeSend: function(xhr) {
    //   //如果在app 发送验证
    //   if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {  
    //   }
    // },
    success: function(res) {
      successCallback(res);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      let responseDic = XMLHttpRequest.responseJSON;
      if (responseDic.status == -101 || responseDic.status == -102) {
        //重新登陆
      //  console.log(history);
        //alert("1");
        if (!contants.currentHistory) {
          Toast.info("无法跳转登陆界面");
        } else {
          let url =
            contants.commonUrl +
            "/login" +
            "/?pathname=orderHome" +
            "&type=" +
            -1 +
            "&shopId=" +
            contants.shopInfo.shopId;
          contants.currentHistory.push({
            pathname: url,
            type: -1
          });
        }
      } else {
        failCallback(XMLHttpRequest);
      }
    },
    complete: function(XMLHttpRequest, status) {
      //不管成功失败都走这个回调
      // console.log('不管成功失败都走这个回调')  // -101  -102 数据串改
      //
      // console.log(XMLHttpRequest)
      // console.log(status)
      if (status == "timeout") {
        xhr.abort(); // 超时后中断请求
        failCallback("网络失败");
      }
    }
  });
};


export const postTwo = (
  url,
  data,
  successCallback,
  failCallback
) => {
 
  $.ajax({
      type: "POST",
      url: commonIp+"/enterprise-admin/newCustomerChat/getAllInfoForWeb",
      data: data,
      dataType: "json",
      // contentType:"application/x-www-form-urlencoded",
      contentType:"application/json",
      processData:true,
      timeout: 15000, // 设置超时时间
      success: function(data) {
        successCallback(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      
      },
      complete: function(XMLHttpRequest, status) {

      }
  });
};

//七牛上传图片
function qiniuUpdataImage(files, token, serverCallback, failCallback) {
  let pictureCount = files.length;
  let haveHashArry = [];
  for (let i = 0; i < pictureCount; i++) {
    console.log(files[i]);
    files[i].uri = files[i].url;
    //获取七牛验证
    post(
      "/file/getVoucher",
      { userId: db.readUserInfo()["wedoId"] },
      data => {
        console.log(data);
        if (data.status === 0) {
          let token = data.body.uploadVoucher;
          let key = files[i].name;
          let putExtra = {
            fname: "",
            params: {},
            mimeType: null
          };
          let config = {
            useCdnDomain: true,
            disableStatisticsReport: false,
            retryCount: 6,
            region: null
          };
          putExtra.params["x:name"] = key.split(".")[0];
          let observable = qiniu.upload(
            files[i],
            null,
            token,
            putExtra,
            config
          );
          observable.subscribe({
            next(res) {
              // ...
            },
            error(err) {
              console.log(err);
              failCallback(err);
            },
            complete(res) {
              let requestData = {
                fileType: "0",
                fileUrl: res.hash,
                width: files[i].width,
                height: files[i].height,
                originHeight: 256,
                originWidth: 256,
                fileTime: null,
                frameOffset: 0,
                fileSize: files[i].size / 1024.0
              };
              haveHashArry.push(requestData);
              if (haveHashArry.length === files.length) {
                //获取hash 完成
                let dic = {
                  file: haveHashArry,
                  userId: db.readUserInfo()["wedoId"]
                };
                console.log(dic);
                $.ajax({
                  type: "post",
                  url: commonUrl + "/file/qiniuUpload",
                  contentType: "application/json",
                  data: JSON.stringify(dic),
                  dataType: "json",
                  success: function(data) {
                    //console.log("上传图片接口",data);
                    serverCallback(data);
                  },
                  error: function(err) {
                    failCallback(err);
                    // Toast.info("网络错误");
                  }
                });
              }
            }
          });
        } else {
          failCallback(data.msg);
        }
      },
      error => {
        failCallback(JSON.stringify(error));
      }
    );
  }
}

//文件数组data{file，userID}，回掉serverCallback
export function fileUpload(data, serverCallback, failCallback) {
  var UploadSuccessData = [];
  if (data == null || data.length == 0) {
    serverCallback("上传文件为空");
  } else {
    var files = data.file;
    qiniuUpdataImage(files, null, serverCallback, failCallback);
    return;
    var files = data.file;
    for (var i = 0; i < files.length; i++) {
      console.log(files[i]);
      var fileSuffix = files[i].type.split("/")[1]; //文件后缀
      getAllHash(
        files[i],
        function(HashData) {
          //console.log(HashData);
          var httpTest = window.location.protocol;
          // var test = window.location.host;
          var dataFile = {
            hostUrl: commonIpFile,
            fileUrl: HashData.yuanHash + "." + fileSuffix,
            zoomUrl: HashData.yaHash + "." + fileSuffix,
            fileType: 0
          };
          var dataFiles = [];
          dataFiles.push(dataFile);
          //console.log(dataFiles);
          var UploadData = {
            userId: data.userId,
            file: dataFiles
          };
          //console.log(UploadData);
          $.ajax({
            type: "post",
            url: commonUrl + "/file/insertFileUrl",
            contentType: "application/json",
            data: JSON.stringify(UploadData),
            dataType: "json",
            success: function(data) {
              //console.log("上传图片接口",data);
              UploadSuccessData.push(data[0]);
              if (UploadSuccessData.length == files.length) {
                //console.log(i);
                var data = {
                  status: 1,
                  UploadSuccessData: UploadSuccessData
                };
                serverCallback(data);
              } else {
                return null;
              }
            },
            error: function(err) {
              console.log("-----err----", "失败");
              failCallback(err);
              // Toast.info("网络错误");
            }
          });
        },
        failCallback
      );
    }
  }
}
//获取大图和缩略图hash值
function getAllHash(files, getHashCallback, failCallback) {
  let imgSuccessDate = {};
  let whetherOver = 0;
  //压缩图片
  console.log("dgdgdgdgdgd", files);
  resizeImage(
    files.url,
    function(data) {
      console.log(data);
      let fileDataYa = new FormData();
      fileDataYa.append("file", convertBase64UrlToBlob(data));
      generateHash(
        fileDataYa,
        function(data) {
          imgSuccessDate.yaHash = data.Hash;
          imgSuccessDate.yaName = data.Name;
          whetherOver = whetherOver + 1;
          console.log(whetherOver);
          if (whetherOver == 2) {
            getHashCallback(imgSuccessDate);
          }
        },
        failCallback
      );
    },
    256,
    256
  );
  //上传原图
  let fileData = new FormData();
  fileData.append("file", files);
  generateHash(
    fileData,
    function(data) {
      imgSuccessDate.yuanHash = data.Hash;
      imgSuccessDate.yuanName = data.Name;
      whetherOver = whetherOver + 1;
      //console.log(whetherOver);
      if (whetherOver == 2) {
        getHashCallback(imgSuccessDate);
      }
    },
    failCallback
  );
}
//上传图片获取hash值请求
function generateHash(fileData, successCallback, failCallback) {
  console.log("generateHash");
  $.ajax({
    type: "post",
    url: commonIpHash + "/upload",
    async: true,
    data: fileData,
    processData: false,
    contentType: false,
    success: successCallback,
    error: function(err) {
      failCallback(err);
      // Toast.info("网络错误");
    }
  });
}
//base64格式转Blob
function convertBase64UrlToBlob(urlData) {
  let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png"
  });
}

//src图片路径，callback回掉函数 ，w宽度，h高度
function resizeImage(src, callback, w, h) {
  console.log("tupiandizhi", src);
  let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    im = new Image();
  (w = w || 0), (h = h || 0);
  im.onload = function() {
    //为传入缩放尺寸用原尺寸
    let imgWidth = this.width;
    let imgHeight = this.height;
    h = (w / imgWidth) * imgHeight;
    console.log(w, h);
    !w && (w = this.width);
    !h && (h = this.height);
    //以长宽最大值作为最终生成图片的依据
    if (w !== this.width || h !== this.height) {
      let ratio;
      if (w > h) {
        ratio = this.width / w;
        h = this.height / ratio;
      } else if (w === h) {
        if (this.width > this.height) {
          ratio = this.width / w;
          h = this.height / ratio;
        } else {
          ratio = this.height / h;
          w = this.width / ratio;
        }
      } else {
        ratio = this.height / h;
        w = this.width / ratio;
      }
    }
    //以传入的长宽作为最终生成图片的尺寸
    if (w > h) {
      //var offset = (w - h) / 2;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(im, 0, 0, w, h);
    } else if (w < h) {
      // var offset = (h - w) / 2;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(im, 0, 0, w, h);
    } else {
      canvas.width = canvas.height = h;
      ctx.drawImage(im, 0, 0, w, h);
    }
    callback(canvas.toDataURL("image/png"));
  };
  im.src = src;
}
