/**
 * Created by Song on 2018/07/12
 * 投诉 上传证据
 */

import React, { Component } from "react";
import "./uploadProof.less";
import { post, fileUpload } from "../../../common/Apis/Fetch";
import { Toast, Modal } from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import SvgImg from '../../../common/svgImage/svgImg';
import UploadImage from '../../../common/components/uploadImage/uploadImage';
import PictureBrowse from "../goodDetails/pictureBrowse";
const { alert } = Modal;

export default class uploadProof extends Component {
  constructor(props) {
    super(props);
    let theRequest = db.getValueFromUrl(location.search); // url search字段对象
    this.state = {
      showLoading: false,
      reasonid: theRequest['reasonid'],
      orderNumber: theRequest['orderNumber'],
      fileList: [],
      imgList: [],
      imgCount: 0,
      textCount: 100,
      value: '',
      isOpen: false,
      picIndex: 0,
    };
  }

  componentDidMount() {
    if (db.userAgent() === "Android") {
      document.title = "上传证据";
    } else {
      db.setPageTitle("上传证据");
    }
  }

  //添加图片到本地
  addImg(e) {
    let { fileList, imgList } = this.state;
    e = e || event;
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files && files[0]) {
      let img = new Image();
      var reader = new FileReader();
      reader.onload = (evt) => {
        img.src = evt.target.result;
        img.onload = () => {
          files[0].width = img.width; //记录原始尺寸
          files[0].height = img.height;
          this.setState({
            fileList: [...fileList, files[0]],
            imgList: [...imgList, evt.target.result],
            imgCount: [...imgList, evt.target.result].length
          });
        }
      };
      reader.readAsDataURL(files[0]);
    }
  }

  //本地删除图片
  deleteImg(index) {
    let { fileList, imgList } = this.state;
    imgList.splice(index,1);
    fileList.splice(index,1);
    this.setState({
      imgList,
      fileList,
      imgCount: imgList.length
    })
  }

  //预览图片
  previewImg(index) {
    this.setState({
      isOpen: true,
      picIndex: index
    })
  }

  //关闭图片预览
  onClose() {
    this.setState({
      isOpen: false
    })
  }

  //输入文字
  onInput(e) {
    let txt = e.target.value;
    let len = txt.length;
    this.setState({
      textCount: 100 - len > 0 ? 100 - len : 0,
      value: txt.substr(0,100)
    })
  }

  //提交反馈
  submit() {
    let { uploadProofAction } = this.props;
    let { reasonid, orderNumber, value, imgList } = this.state;
    if(value.length===0){
      Toast.info("请填写投诉说明才可提交哦~", 3);
      return;
    }
    if(this.state.fileList.length) {
      let data = { file: this.state.fileList, userId: db.readUserInfo()["userId"] };
      fileUpload(data, (res) => {
        if(res && res[0]){
          let fileIds = res.map(item => item.fileId);
          let reasons = [Number(reasonid)]
          let params = {
            hintReasonId: reasons,
            targetId: this.props.location.state.orderId,
            userId: Number(data.userId),
            picList: fileIds,
            complainDescribe: value,
            orderNo: this.state.orderNumber,
            type: 7 //TODO
          }
          post(`/complain/saveComplainInfo?picList=${fileIds}&hintReasonId=${reasons}&targetId=${1001}&userId=${data.userId}&complainDescribe=${value}&orderNo=${this.state.orderNumber}&type=4`, null, res => {
            if(res.status === 0){
              alert("提交成功", "微度平台已经成功收到了您的投诉，我们会尽快处理。如有疑问请联系客服021-6079-0010", [
                {text: '确定', onPress: () => this.goBack()}
              ]);
            }
          }, err => {
            Toast.info('提交失败',2)
          });
        }else{
          Toast.info('图片上传失败',1)
        }
      }, (error) => {
        Toast.info("图片上传失败", 1)
      })
    }else{
      let reasons = [Number(reasonid)]
      let params = {
        hintReasonId: reasons,
        targetId: this.props.location.state.orderId,
        userId: Number(db.readUserInfo()["userId"]),
        picList: [],
        complainDescribe: value,
        orderNo: this.state.orderNumber,
        type: 4
      }
      post(`/complain/saveComplainInfo?picList=&hintReasonId=${reasons}&targetId=${1001}&userId=${db.readUserInfo()["userId"]}&complainDescribe=${value}&orderNo=${this.state.orderNumber}&type=4`, null, res => {
        if(res.status === 0){
          alert("提交成功", "微度平台已经成功收到了您的投诉，我们会尽快处理。如有疑问请联系客服021-6079-0010", [
            {text: '确定', onPress: () => this.goBack()}
          ]);
        }
      }, err => {
        Toast.info('提交失败',2)
      });
    }
    // uploadProofAction.submitProof("/complain/saveComplainInfo", {
    //   reasonid,
    //   orderNumber,
    //   imgList,
    //   value
    // })
  }

  //跳转到投诉入口
  goBack() {
    history.back()
  }

  render() {
    const { showLoading, reasonid, orderNumber, imgList, imgCount, textCount, value, isOpen } = this.state;
    return (
      <div className="name-space-proof">
        <div className="title">投诉的对象</div>
        <p>订单号：{orderNumber}</p>
        <div className="title">请上传投诉证据</div>
        <div className="content">
          <UploadImage addImg={this.addImg.bind(this)} deleteImg={this.deleteImg.bind(this)} imgList={imgList} imgCount={imgCount} previewImg={this.previewImg.bind(this)} />
          <h6>投诉说明</h6>
          <textarea onInput={(e) => this.onInput(e)} value={value} placeholder="请输入投诉说明文字（可输入100字）"></textarea>
          <span className="tip">还可输入{textCount}个字</span>
        </div>
        <div className="submit" onClick={() => this.submit()}>提交反馈</div>
        {
          isOpen ? <div>
            <div className="liulanClose">
              <img src={require('../../images/aftersales/close.png')} onClick={this.onClose.bind(this)}/>
            </div>
            <PictureBrowse {...this.props} pictureList={this.state.imgList} pictureS={require('../../images/goodDetails/collectIcon.png')} index={this.state.picIndex}  onClose={this.onClose.bind(this)}/>
          </div> : null
        }
        {
          showLoading ?
          <div className="loadingView">
            <div className="loadingImg"></div>
          </div> : null
        }
      </div>
    )
  }
}
