/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：申请售后服务
 */
import React from 'react';
import './apply_after_sales_service.less'
import {Picker, Toast, TextareaItem, ActivityIndicator} from 'antd-mobile';
import {fileUpload} from "../../../common/Apis/Fetch";
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as contants from '../../../common/Apis/constants'
import { withRouter } from 'react-router-dom';
import * as db from '../../../common/Apis/Utils';
import {post} from "../../../common/Apis/Fetch";
import * as Util from '../../../common/Apis/Fetch'
import PictureBrowse from "../goodDetails/pictureBrowse";
import * as constant from '../../../common/Apis/constants'
import UploadImage from '../../../common/components/uploadImage/uploadImage';

let imgAry = []//微信选择的选择的图片
let upLoadAry = [];//上传微信服务器
var images = {
    localId: [],
    serverId: []
};

const type1 = [
    {
        label: '退款',
        value: '退款',
    }, {
        label: '退货退款',
        value: '退货退款',
    }
]
const type2 = [
    {
        label: '退款',
        value: '退款',
    }
]

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
    <div
        onClick={props.onClick}
        className="border"
    >
        <div className="pick">
            <div className="pickText">
                <div className="pickLeft">售后类型</div>
                <div className="pickRight">{props.data}</div>
            </div>
            <div>
                <img src={require("../../images/aftersales/arrow.png")}/>
            </div>
        </div>
    </div>
);
// 如果不是使用 List.Item 作为 children
const CustomChildrenR = props => (
    <div
        onClick={props.onClick}
        className="border"
    >
        <div className="pick">
            <div className="pickText">
                <div className="pickLeft">申请原因</div>
                <div className="pickRight">{props.data}</div>
            </div>
            <div>
                <img src={require("../../images/aftersales/arrow.png")}/>
            </div>
        </div>
    </div>
);

let callBack = '';
let canSubmit = true;

let upLoadImgToWx = function (serverId, callBack) {//上传图片到微信服务器

    wx.uploadImage({
        localId: serverId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: function (res) {
            let url = 'https://api.weixin.qq.com/cgi-bin/media/get?access_token=' + contants.access_token + '&media_id=' + res.serverId;
            upLoadAry.push(url)
            if (upLoadAry.length === imgAry.length) {
                callBack(upLoadAry)
            }
            else {
                upLoadImgToWx(imgAry[upLoadAry.length], callBack)
            }
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
}
class ApplyAfterSalesService extends React.Component {


    constructor(props) {
        super(props)
        this.theRequest ={};
        this.state = {
            typeValue: '请选择',
            reasonValue: 0,
            reasonLabel: '请选择',
            files: [],
            orderNum: null,
            orderTime: null,
            totalMoney: null,
            typeData: 0,
            imgAry: [],//上传的图片,
            desc: '',
            fileId: [],
            pictureFile: [],
            inputVa: 0,
            reasonData: [],
            showLoading: false,
            isOpen: false,
            index: null,
            fileList: [],
            imgList: [],
            imgCount: 0,
            textCount: 100,
            picIndex: 0
        }
    }

    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '申请退款';
        } else {
            db.setPageTitle('申请退款');
        }
        let theRequest = {};
        let strs = [];
        let urls = location.search; //获取url中"?"符后的字串
        if (urls.indexOf("?") !== -1) {
            let str = urls.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }

        this.theRequest = theRequest;
        this.setState({
            // typeData: this.theRequest.type == 2 ? type2 : (this.theRequest.type == 3 ? type1 : type2),
            typeData: this.theRequest.type == 2 ? type2 : type1, //2 待发货状态 只能退款
            inputVa: this.theRequest.type == 2 ? this.theRequest.returnMoney : '',
            orderNum: this.theRequest.orderNum,
            orderTime: this.theRequest.orderTime,
            totalMoney: this.theRequest.returnMoney,
        })
    }

    componentWillUnmount() {
        canSubmit = true;
    }

    componentDidMount() {

        // console.log(callBack)
        // console.log('-------------', this.theRequest.returnMoney)
        // const {saveReducer} = this.props;
        // if (saveReducer.data.length !== 0) {
        //     console.log('-----取数据-----', saveReducer.data)
        //     this.setState({
        //         typeValue: saveReducer.data.type,
        //         amount: saveReducer.data.amount,
        //         reason: saveReducer.data.reason,
        //         desc: saveReducer.data.desc,
        //         imgAry: saveReducer.data.picture
        //     })
        // }
        imgAry = []
        upLoadAry = []
        wxShare([], {});
        const {history} = this.props;
        constant.currentHistory = history;


        post('/webOrder/getAftersaleReasons', '', (res) => {
            if (res !== null && '' !== res) {
                console.log(res)
                let data = res.body.result;
                if (data instanceof Array) {
                    let array = [];
                    for (let i = 0; i < data.length; i++) {
                        let reason = {
                            label: data[i].reason,
                            value: data[i].reasonId,
                        }
                        array.push(reason);
                    }
                    console.log('array----->', array)
                    this.setState({reasonData: array})
                }
            }
        }, (err) => {
            console.log(err);
        })

    }


    //  syncUpload(localIds,callBack){
    //     let localId = localIds.pop();
    //     wx.uploadImage({
    //         localId: localId,
    //         isShowProgressTips: 1,
    //         success: function (res) {
    //             let serverId = res.serverId; // 返回图片的服务器端ID
    //             upLoadAry.push(serverId)
    //             //其他对serverId做处理的代码
    //             if(localIds.length > 0){
    //                 syncUpload(localIds,callBack);
    //             }
    //         }
    //     });
    // };
    handleSubmit() {
        if (!canSubmit) {

            return;
        }
        if (this.state.typeValue == '请选择') {
            Toast.info("请选择售后类型");
            return;
        }

        if (this.state.inputVa == null || this.state.inputVa == '' || this.state.inputVa == 0 || this.state.inputVa == 0.0 || this.state.inputVa == 0.00) {
            Toast.info("请输入退款金额")
            return;
        }
        if (this.state.inputVa < 0) {
            Toast.info("退款金额不合理");
            return;
        }

        if (this.state.reasonLabel == '请选择') {
            Toast.info("请选择售后原因");
            return;
        }

        if ((this.state.inputVa - this.state.totalMoney) > 0) {
            Toast.info("退款金额超过最大限制");
            return;
        }

        if (this.state.desc.trim() == null || this.state.desc.trim() == '') {
            Toast.info("请填写问题描述");
            return;
        }

        // 有图片
        if (this.state.fileList.length > 0) {

            canSubmit = false;
            // let upData = {file: this.state.pictureFile, userId: db.readUserInfo()['wedoId']}
            let upData = {file: this.state.fileList, userId: db.readUserInfo()['userId']}
           
            this.setState({showLoading: true});
            fileUpload(upData, (data) => {
           
                if (true) {
              
                    this.state.fileId = data;
                    console.log(...this.state.fileId)
                    let saleType = this.state.typeValue == '退款' ? 1 : 2;
                    let fileIdAry = [];
                    for (let i = 0; i < this.state.fileId.length; i++) {
                        fileIdAry.push(this.state.fileId[i].fileId)
                    }
                    let params = {
                        orderId: this.theRequest.orderId,
                        saleType: saleType,
                        amount: this.state.inputVa,
                        describes: this.state.desc,
                        userId: db.readUserInfo()['userId'],
                        dictionaryId: this.state.reasonValue,
                        fileId: fileIdAry,
                        shopId:this.theRequest.shopId,
                        logisticsId:this.theRequest.logisticsId ==="null"?"":this.theRequest.logisticsId
                    }
                   if(this.theRequest.type == 4 || Number(this.theRequest.type) > 18) {
                        let params = {
                            orderNo: this.theRequest.orderNum,
                            blackTime: this.theRequest.orderTime,
                            saleType: saleType,
                            amount: this.state.inputVa,
                            dictionaryId: this.state.reasonValue,
                            describes: this.state.desc,
                            fileId: fileIdAry,
                            orderId: this.theRequest.orderId,
                            userId: db.readUserInfo()['userId'],
                            shopId:this.theRequest.shopId,
                            logisticsId:this.theRequest.logisticsId ==="null"?"":this.theRequest.logisticsId
                        }
                        return post('/afterSale/finishedApplayAfterSale', params, (data) => {
                            this.setState({showLoading: false});
                            if (data.status === 0) {
                                const {history} = this.props;
                                let url = contants.commonUrl + '/applySuccess' + "/?type=" + saleType ;
                                history.replace({
                                    pathname: url
                                })
                            } else {
                                canSubmit = true;
                                Toast.info(data.msg);
                            }
                        }, (err) => {
                            canSubmit = true;
                            this.setState({showLoading: false});
                            Toast.info(err.msg);
                        })
                   }

                    post('/afterSale/applayAfterSale', params, (data) => {
                        this.setState({showLoading: false});
                        if (data.status === 0) {
                            const {history,} = this.props;
                            let url = contants.commonUrl + '/applySuccess' + "/?type=" + saleType ;
                            history.replace({
                                pathname: url,
                            })
                        } else {
                            canSubmit = true;
                            Toast.info(data.msg);
                        }
                    }, (err) => {
                        canSubmit = true;
                        this.setState({showLoading: false});
                        Toast.info(err);
                    })
                }
                else {
                    canSubmit = true;
                    Toast.info("上传图片失败")
                }
            },(err)=>{
                this.setState({showLoading: false});
                canSubmit = true;
                Toast.info("上传图片失败")
            })



        }
        else {//没图片
            canSubmit = false;
            let saleType = this.state.typeValue == '退款' ? 1 : 2;
            let params = {
                orderId: this.theRequest.orderId,
                saleType: saleType,
                amount: this.state.inputVa,
                describes: this.state.desc,
                userId: db.readUserInfo()['userId'],
                dictionaryId: this.state.reasonValue,
                fileId: this.state.fileId,
                shopId:this.theRequest.shopId,
                logisticsId:this.theRequest.logisticsId ==="null"?"":this.theRequest.logisticsId
            }
          
            this.setState({showLoading: true});
            if(this.theRequest.type == 4 || Number(this.theRequest.type) > 18) { //已完成订单走新增的申请售后接口
                let params = {
                    orderNo: this.theRequest.orderNum,
                    blackTime: this.theRequest.orderTime,
                    saleType: saleType,
                    amount: this.state.inputVa,
                    dictionaryId: this.state.reasonValue,
                    describes: this.state.desc,
                    fileId: this.state.fileId,
                    orderId: this.theRequest.orderId,
                    userId: db.readUserInfo()['userId'],
                    shopId:this.theRequest.shopId,
                    logisticsId:this.theRequest.logisticsId ==="null"?"":this.theRequest.logisticsId
                }
                return post('/afterSale/finishedApplayAfterSale', params, (data) => {
                    this.setState({showLoading: false});
                    if (data.status === 0) {
                 
                        const {history} = this.props;
                        let url = contants.commonUrl + '/applySuccess' + "/?type=" + saleType ;
                        history.replace({
                            pathname: url
                        })
                    } else {
                        canSubmit = true;
                        Toast.info(data.msg);
                    }
                }, (err) => {
                
                    canSubmit = true;
                    this.setState({showLoading: false});
                    Toast.info(err.msg);
                })
            }

            post('/afterSale/applayAfterSale', params, (data) => {
                this.setState({showLoading: false});
                if (data.status === 0) {
                    console.log('提交售后成功')
                    const {history,} = this.props;
                    let url = contants.commonUrl + '/applySuccess' + "/?type=" + saleType ;
                    history.replace({
                        pathname: url,
                    })
                } else {
                    canSubmit = true;
                    Toast.info(data.msg);

                }
            }, (err) => {
                console.log('提交售后失败')

                canSubmit = true;
                this.setState({showLoading: false});
                Toast.info(err);
            })
        }
    }


    onClick() {
    }

    onChange(value) {
        let label;
        for (let i = 0; i < this.state.reasonData.length; i++) {
            if (value[0] === this.state.reasonData[i].value) {
                label = this.state.reasonData[i].label;
            }
        }
        this.setState({
            reasonValue: value[0],
            reasonLabel: label,
        });
    };

    getImage()//上传图片
    {
        wx.chooseImage({
            count: 5 - imgAry.length,
            success: function (res) {
                images.localId = res.localIds;
                //this.setState({imgAry:images.localId})
                //$('#img').attr({'src':images.localId[0]})
                for(let i =0;i<images.localId.length;i++)
                {
                    let src =images.localId[i]
                    let img1 ="<div class='addImgJs'><img class='scanimg' src="+src+" /><img class='smallImg' src='http://myh.unspay.com/images/e10.png') /></div>"
                    $(".addImgcheng").before(img1);        // 追加新元素
                    imgAry.push(images.localId[i])
                }
                //  alert('已选择 ' + res.localIds.length + ' 张图片'+images.localId[0]);
                $('.smallImg').unbind('click').click(function () {
                    imgAry.splice($(this).parent().index(), 1)
                    $(this).parent().remove();
                    // console.log($(this).parent().index())
                    $(".addImgcheng").show();
                })
                $('.scanimg').unbind('click').click(function () {
                    // console.log($(this).attr("key"))
                    // $(this).parent().remove();
                    console.log($(this).parent().index())
                    // $(".addImgcheng").hide();
                    wx.previewImage({
                        current: imgAry[$(this).parent().index()], // 当前显示图片的http链接
                        urls: imgAry // 需要预览的图片http链接列表
                    });
                })
                if (imgAry.length === 5) {//移除
                    $(".addImgcheng").hide();
                }
            }
        });
        // this.addImgByJs()
    }
    addImgByJs(){//添加图片tianji
        for(let i = 0;i<1;i++)
        {
            let src ='http://192.168.9.81/resources/QmQT6RMqG1Jr7LSZcH7bcpfsafN1cnBhXrvQbyhPitQFkq.png'
            let img1 ="<div class='addImgJs'><img class='scanimg'  src="+src+" /><img class='smallImg'  src=require('../../images/aftersales/e10.png') /></div>"
            // $(".imgContainer").insertBefore(img1,$(".addImgcheng"));        // 追加新元素
            // $(".imgContainer").prepend(img1,);        // 追加新元素

            $(".addImgcheng").before(img1);        // 追加新元素
            imgAry.push(src)
        }

        $('.smallImg').unbind('click').click(function () {
            console.log($(this).parent().index())

            $(this).parent().remove();
            console.log($(this).parent().index())

            imgAry.splice($(this).parent().index(), 1)
            $(".addImgcheng").show();


        })
        $('.scanimg').unbind('click').click(function () {
            // $(this).index()
            // $(this).attr("key")
            // console.log($(this).attr("key"))
            // $(this).parent().remove();
            console.log($(this).parent().index())
        })
        if (imgAry.length === 5) {//移除
            console.log('remove')
            $(".addImgcheng").hide();
        }
        else {
            // console.log('add ')
            // $(".addImgcheng").show();

        }
    }

    scanImg() {
        console.log('scan img')
        wx.previewImage({
            current: images.localId[0], // 当前显示图片的http链接
            urls: images.localId // 需要预览的图片http链接列表
        });
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
      desc: txt.substr(0,100)
    })
  }

    render() {
        const { imgList, imgCount, textCount, desc, isOpen } = this.state;
        let borderR;
        if(contants.viewStyDic['SHAPE'] == 3){
            borderR = 'btnSemicircle';
        }else if(contants.viewStyDic['SHAPE'] == 2){
            borderR = 'btnCircular';
        }else {
            borderR = 'btnNoCircular';
        }
        return (
            <div className="apply_after">
                <div className="order-top">
                    <div className="order order1">
                        <div className="orderNum"><span>订单号:</span><span>{this.state.orderNum}</span></div>
                    </div>
                    <div className="order">
                        <div className="orderTime"><span>下单时间:</span><span>{this.state.orderTime}</span></div>
                    </div>
                </div>
                <div className="order-center">
                    <Picker  data={this.state.typeData} cols={1}
                            onChange={v => {
                                this.setState({typeValue: v})
                            }
                            }
                            itemStyle={{height: '53px', lineHeight: '53px'}}
                            indicatorStyle={{fontSize: '38px', lineHeight: '53px', height: '53px'}}
                            >
                        <CustomChildren  data={this.state.typeValue}/>
                    </Picker>
                    {(this.theRequest.type != 2) && <div className="money1">
                        <div>退款金额</div>
                        <div>
                            <input placeholder="请输入退款金额"
                                ref="refundMoney" onInput={(event) => {
                                //保留小数点后两位
                                let content = event.target.value;
                                let val = content.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                                let str = val.length > 11 ? val.splice(0, 11) : val;
                                this.setState({inputVa: str});
                            }}
                                value={this.state.inputVa}
                                type="number"/>
                        </div>
                    </div>}
                    {(this.theRequest.type == 2) && <div className="money1">
                        <div>退款金额</div>
                        <div ref="refundMoney">{this.state.inputVa}</div>
                    </div>}
                </div>
                <div className="moneyTip">
                    <div>(最多<span>{this.theRequest.returnMoney}</span>元，含发货邮费0.00元)</div>
                </div>

                <div className="order-bottom">
                    <Picker className="pickerReason" data={this.state.reasonData} cols={1}
                            onChange={v => {
                                this.onChange(v)
                            }}
                            value={[this.state.reasonValue]}
                            itemStyle={{height: '53px', lineHeight: '53px'}}
                            indicatorStyle={{fontSize: '38px', lineHeight: '53px', height: '53px'}}
                            >
                        <CustomChildrenR data={this.state.reasonLabel}/>
                    </Picker>

                    {/* <div className="des">
                        <TextareaItem
                            title="问题描述"
                            autoHeight
                            placeholder="请你在此描述问题(可输入100字)" count={100}
                            labelNumber={5}
                            onChange={(v) => {
                                this.setState({desc: v});
                            }}
                        />

                        <div className="imgContainer">
                            <div className="addImgcheng">
                                <img src={require('../../images/aftersales/e7@1x.png')}
                                    onClick={this.getImage.bind(this)}
                                >
                                </img>
                            </div>
                        </div>


                        <div className="imgContainer">
                            {this.state.imgAry.map((content, i) => {
                                return (
                                    <div className="addImg">
                                        <img src={content}
                                            onClick={this.pictureViewer.bind(this, i)}
                                        >
                                        </img>
                                        <img className='smallImg'
                                            onClick={this.deleteImg.bind(this, i)}

                                            src={require('../../images/aftersales/e10.png')}
                                        ></img>
                                    </div>
                                )
                            })}
                            {this.state.imgAry.length >= 5 ? null :
                                <div className="addImg">
                                    <img src={require('../../images/aftersales/e7@1x.png')}
                                    >
                                    </img>
                                    <input ref="addImg" id="takepicture" type="file" accept="image/*"
                                        onChange={this.changeImg.bind(this)}
                                    />
                                </div>
                            }
                        </div>

                        <div className="upLoadInfo">最多可上传5张图片</div>
                    </div> */}
                    <div className="content">
                        <h6>问题描述</h6>
                        <textarea onInput={(e) => this.onInput(e)} value={desc} placeholder="请您在此描述问题（可输入100字）"></textarea>
                        <span className="tip">还可输入{textCount}个字</span>
                        <UploadImage addImg={this.addImg.bind(this)} deleteImg={this.deleteImg.bind(this)} imgList={imgList} imgCount={imgCount} previewImg={this.previewImg.bind(this)} />
                    </div>
                    {/* <div className="tipLeft3">提交服务单后，售后专员可能与你电话沟通，请保持手机畅通</div>
                    <div className="tip3">商品寄回地址将在审核通过后以短信形式告知</div> */}
                    {/* <div className={"sub submit"+' '+borderR}  style={{background: contants.viewStyDic.COLOR1, color: contants.viewStyDic.COLOR3}} onClick={this.handleSubmit.bind(this)}>
                        提交
                    </div> */}
                    <div className="submit" onClick={this.handleSubmit.bind(this)}>提交</div>
                    {
                        this.state.isOpen ? <div>
                            <div className="liulanClose">
                                <img src={require('../../images/aftersales/close.png')} onClick={this.onClose.bind(this)}/>
                            </div>
                            <PictureBrowse {...this.props} pictureList={this.state.imgList} pictureS={require('../../images/goodDetails/collectIcon.png')} index={this.state.picIndex}  onClose={this.onClose.bind(this)}/>
                            {/*<WxImageViewer urls={this.state.imgAry} onClose={this.onClose.bind(this)}*/}
                                        {/*index={this.state.index}/>*/}
                        </div> : ""
                    }
                    {this.state.showLoading ? <div className="loadingView">
                        <div className="loadingImg"/></div> : null}
                </div>
            </div>
        )
    }

    // deleteImg(i) {
    //     let imgAry = this.state.imgAry;
    //     imgAry.splice(i, 1)
    //     this.setState({imgAry: imgAry})

    //     let picture = this.state.pictureFile;
    //     picture.splice(i, 1)
    //     this.setState({pictureFile: picture})
    // }

    onClose() {
        this.setState({
            isOpen: false
        })
    }

    pictureViewer(i) {
        this.setState({
            isOpen: true,
            index: i,
        })
        // const {router} = this.props;
        // // let that = this;
        // router.push({
        //     pathname: contants.commonUrl + '/pictureLook',
        //     state: {
        //         images: this.state.imgAry,
        //         index: i,
        //         // data: {
        //         //     type: this.state.typeValue,
        //         //     money: this.state.inputVa,
        //         //     reason: this.state.reasonLabel,
        //         //     desc: this.state.desc,
        //         //     imgAry: this.state.imgAry,
        //         //     picture: this.state.pictureFile
        //         // },
        //         // passParam: (data) => {
        //         //     callBack=data;
        //         //     console.log('<<<<<')
        //         //     console.log(callBack)
        //         //     // // alert(params)
        //         //     console.log('---------收到回调------------',data)
        //         //     // that.setState({
        //         //     //     typeValue: data.type,
        //         //     //     inputVa: data.money,
        //         //     //     reasonLabel: data.reason,
        //         //     //     desc: data.desc,
        //         //     //     imgAry: data.imgAry,
        //         //     //     pictureFile: data.picture
        //         //     // })
        //         // }
        //     }
        // })
    }

    changeImg(event) {
        let files = event.target.files, file;
        let array = this.state.pictureFile;
        let imgAry = this.state.imgAry;
        let haveUp = this.state.imgAry.length;
        if (files.length + this.state.imgAry.length > 5)//图片超过5张,提示
        {
            Toast.info('最多可选5张图片', 1);
        }
        let select = Math.min(5 - this.state.imgAry.length, files.length);
        let that =this;
        console.log('changeImg')
        for (let i = 0; i < select; i++) {
            file = files[i];
            let URL = window.URL || window.webkitURL;
            let blob = URL.createObjectURL(file)
            file.url = blob;
            let image = new Image();
            image.src = blob;
            image.onload = function(){
                console.log(`宽 ${image.width} 高 ${image.height}`);
                file.height =image.height;
                file.width =image.height;
                imgAry.push(blob);
                array.push(file);
                that.setState({imgAry: imgAry})
                that.setState({pictureFile: array})
            }
        }
    }

    addImage() {//添加图片
        // Modal.alert('test')
        // console.log('添加图片')
        // this.refs.addImg.click();
        let takePicture = document.getElementById('takepicture');
        takePicture.click();
    }
}

//

//     const saveReducer = state.get('SavgeReducer').toJS();
//     return {
//         saveReducer
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     const ApplyAction = bindActionCreators(applyAction, dispatch);
//     return {
//         ApplyAction
//     };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(ApplyAfterSalesService);
export default withRouter(ApplyAfterSalesService)