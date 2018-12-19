/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：退款进度详情
 */
import React from 'react';
import './refund_progress.less';
import '../refunds/refundsDetailList.less'
import {post} from "../../../common/Apis/Fetch";
import {format} from '../../../common/Apis/Utils'
import {ActivityIndicator, Toast, Picker, List} from "antd-mobile";
import {Modal, Button} from 'antd-mobile';
import * as db from '../../../common/Apis/Utils';
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as contants from '../../../common/Apis/constants'
import {withRouter} from 'react-router-dom'

const alert = Modal.alert;

class refundProgress extends React.Component {

    constructor(props) {
        super(props)
        this.theRequest = {};
        this.state = {
            data: [],
            orderId: '',
            aftersaleId: '',
            applyTime: '',
            reviewMessage: '',
            refundMoney: null,
            quit: true,
            quitStatus: true,
            showLoading: true,
            orderStatus: null,
            saleOrderNo: '',
            isConsumer: true,
            expressName: '', // 承运商
            transportNo: '', // 运单号
            isEdit: false,
            logisticsId: 0, // 承运商id
            isAgain: 0, // 是否已经修改
        }

    }


    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '售后详情';
        } else {
            db.setPageTitle('售后详情');
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
            isConsumer: theRequest.isConsumer === undefined
        });
    }

    componentDidMount() {
        wxShare( [], {});
        const {history,afterSalesAction} = this.props;
        //constant.currentHistory = history;

        this.getTranInfo();// 调用查看运单号接口
        // 获取承运商
        afterSalesAction.getExpressList();
    }
    //  获取运单信息
    getTranInfo(){
        let aftersaleId = this.theRequest.aftersaleId;
        let params = (aftersaleId == undefined || aftersaleId == null) ? {
            orderId: this.theRequest.orderId,
            targetUserId: this.state.isConsumer ? db.readUserInfo()['userId'] : this.theRequest.userId,
            aftersaleId:aftersaleId
        } : {
            orderId: this.theRequest.orderId,
            userId: this.state.isConsumer ? db.readUserInfo()['userId'] : this.theRequest.userId,
            targetUserId: this.state.isConsumer ? db.readUserInfo()['userId'] : this.theRequest.userId,
            aftersaleId: aftersaleId
        }
        const resultStr = Number(this.theRequest.saleType) === 2 ? "/afterSale/getReturnGoodsInfo":"/afterSale/getRefundInfo"
        post(resultStr, params, (data) => {
            this.setState({showLoading: false});
            if (data.status == 0) {
                this.setState({
                    data: data.body.refundInfo.orderFlow,
                    saleOrderNo: data.body.refundInfo.saleOrderNo, // 售后单号
                    aftersaleId: data.body.refundInfo.aftersaleId,
                    transportNo: data.body.refundInfo.transportNo,
                    orderStatus: data.body.refundInfo.orderStatus,
                    logisticsId: data.body.refundInfo.logisticsName && this.props.afterSale.expressList.find(item=>item.label=data.body.refundInfo.logisticsName).value,
                    expressName: data.body.refundInfo.logisticsName,
                    refundMoney: data.body.refundInfo.refundAmount,
                    reviewMessage: data.body.refundInfo.checkLeaveMsg, // 审核留言
                    orderId: data.body.refundInfo.orderId,
                    applyTime: format(data.body.refundInfo.afterSaleCreateTime, 'yyyy-MM-dd HH:mm:ss'),
                    isAgain: data.body.refundInfo.isAgain,
                    afterStatus: data.body.refundInfo.afterStatus,
                    afterIsAuth: data.body.refundInfo.afterIsAuth,
                    afterAmount: data.body.refundInfo.afterAmount,
                    // isEdit: data.body.refundInfo.transportNo ? true : false,
                })
            } else {
            }
        }, (err) => {
            this.setState({showLoading: false});
        })
    }

    quitApply() {
        this.alertInstance = alert('确定撤销申请?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: {color: '#000000'}},
            {
                text: '确定', onPress: () => {
                    let params = {
                        userId: db.readUserInfo()['userId'],
                        aftersaleId: this.state.aftersaleId, //TODO
                        operType: 1 //TODO
                    }
                    this.setState({showLoading: true});
                    let url = null;
                    if(true) { //未完成订单撤销申请 //TODO
                        url = '/afterSale/cancelAfterSale'
                    } else { //已完成订单撤销申请
                        url = 'cancelAfterSaleWhenCompleted'
                    }
                   
                    post(url, params, (data) => {
                        this.setState({showLoading: false});
                        if (data.status == 0) {
                            if (data.body.cancelStatus == 1) {
                                this.setState({quitStatus: false});
                                Toast.info("撤销成功");
                                const { history } = this.props;
                                history.goBack()
                                // let params = {
                                //     orderId: this.theRequest.orderId,
                                //     // userId: db.readUserInfo()['wedoId'],
                                //     userId: db.readUserInfo()['userId'],
                                //     aftersaleId: this.state.aftersaleId
                                // };
                                // this.setState({showLoading: true});
                                // post('/afterSale/getRefundInfo', params, (data) => {
                                //     console.log(data)
                                //     this.setState({showLoading: false});
                                //     if (data.status === 0) {
                                //         this.setState({
                                //             applyTime: format(data.body.refundInfo.afterSaleCreateTime, 'yyyy-MM-dd HH:mm:ss'),
                                //             aftersaleId: data.body.refundInfo.aftersaleId,
                                //             reviewMessage: data.body.refundInfo.checkLeaveMsg,
                                //             refundMoney: data.body.refundInfo.refundAmount,
                                //             quit: data.body.refundInfo.isCancelAS == 1 ? true : false,
                                //             data: data.body.refundInfo.orderFlow,
                                //             orderStatus: data.body.refundInfo.orderStatus,
                                //             saleOrderNo: data.body.refundInfo.saleOrderNo
                                //         })

                                //     } else {
                                //         console.log(data.msg);
                                //     }
                                // }, (err) => {
                                //     this.setState({showLoading: false});
                                //     console.log(err)
                                // })
                            }
                        }
                        else {
                            Toast.info("撤销失败");
                        }
                    }, (err) => {
                        
                        this.setState({showLoading: false});
                        Toast.info(err);
                    })
                }, style: {color: '#000000'}
            },
        ]);

    }

    setExpressName(e) {//修改承运商
        this.setState({
            expressName: e.target.value
        })
    }

    setExpressNo(e) {//修改运单号
        let filterVal = e.target.value.replace(/[^\w\.\/]/ig,'')
        this.setState({
            transportNo: filterVal
        })
    }

    feedBack() {//反馈

        const { history } = this.props;
        history.push({
            pathname: contants.commonUrl + '/feedBack',
            state: {
                userId: db.readUserInfo()['userId'],
                saleOrderNo: this.state.saleOrderNo,
                orderId:this.state.orderId
            }
        })
    }

    editLogistics() {
        this.setState({
            isEdit: true,
        })
    }

    wayCarrier(value){
        this.setState({logisticsId: value[0]});
        this.setState({expressName: this.props.afterSale.expressList.find(item=>item.value==value[0]).label})
    }

     // 提交运单
     submitWaybill(){
        const { 
            transportNo, 
            expressName, 
            logisticsId, 
            orderId, 
            aftersaleId, 
            isConsumer, 
            isEdit,
            saleOrderNo,
        } = this.state;
        if (!transportNo || !expressName || transportNo.length === 0 || expressName.length === 0) {
            Toast.info('请完善信息');
            return
        }
        if (isEdit) {
            let params = {
                saleOrderNo: saleOrderNo,
                transportNo: transportNo, // 运单号
                transportCode: logisticsId,
                logisticsId:logisticsId
            }
            post('/afterSale/modifyTransNo', params, (data) => {
                this.setState({showLoading: false});
                if (Number(data.status) === 0) {
                    this.setState({
                        isEdit: false,
                    })
                    this.getTranInfo();  // 调用查看运单号接口
                    Toast.info(data.msg);
                } else {
                }
            }, (err) => {
                this.setState({showLoading: false});
            })
        } else {
            const params = {
                transportNo: transportNo,// 运单号
                logisticsName: expressName,//承运商名称
                logisticsId: logisticsId,// 承运商ID
                orderId: orderId, // 订单ID
                aftersaleId: aftersaleId,// 售后ID
                userId: isConsumer ? db.readUserInfo()['userId'] : this.theRequest.userId,// 用户ID
                targetUserId: isConsumer ? db.readUserInfo()['userId'] : this.theRequest.userId,// 用户ID
            }
            post("/afterSale/postGoods", params, (data) => {
                this.setState({showLoading: false});
                if (data.status == 0) {
                  this.getTranInfo();  // 调用查看运单号接口
                  Toast.info(data.msg);
                } 
            }, (err) => {
                this.setState({showLoading: false});
            })
        }
    }

      //查看物流
      queryLogistics() { 
        post(`/transportInfo/getAftersaleTransportInfo`,  {
            orderId: this.state.orderId, //TODO
        }, (res) => {
            const { history } = this.props;
            const data = res.body.data;
            history.push(`${contants.commonUrl}/logistics?totalNum=${data.goodsNum}&url=${data.zoomUrl}&status=${this.state.orderStatus}&orderId=${this.state.orderId}&deliverCompanyName=${data.transportName}&deliverCompanyNo=${data.deliverCompanyNo}&transportNo=${data.transportNo}`)
        }, (err) => {
            Toast.info(err.msg, 2)
        })
    }

    render() {
        const { saleOrderNo } = this.state;
        return (
            <div className="name-space-refund">
                <div className="refundHeader1">
                    <div className="afterOrderNum"><span>售后单号:</span><span>{saleOrderNo}</span></div>
                    <div className="applyTime"><span>申请时间:</span><span>{this.state.applyTime}</span></div>
                </div>
                {( Number(this.state.afterIsAuth) ==4 && Number(this.state.afterStatus) == 1) && 
                   (this.state.orderStatus === 15 || this.state.orderStatus === 23 || this.state.orderStatus === 25 || this.state.orderStatus === 18 || this.state.orderStatus === 17) &&
                    <div className="refundSuccess">
                        <div><img src={require("../../images/aftersales/refund_success.png")}/></div>
                        <div><span>已退款</span><span>&nbsp;&nbsp;&nbsp;¥{this.state.afterAmount}</span></div>
                    </div> 
                }
                <div className="refundBody">
                    <div className="order_detail_number_p">
                        <span className="oder_number_left"> 售后进度</span>
                    </div>
                    {this.state.data.length !== 0 &&
                    <div className="flow-list">
                        <div className="new-order-flow new-p-re">
                            <ul className="new-of-storey">
                                {
                                    this.state.data.map((item, index) => {
                                        return <li key={index}
                                                   className={index === this.state.data.length - 1 ? 'new-of-storey_li' : ''}>

                                            {
                                                index === 0 ? <span className="top-white"/> : ''
                                            }
                                            {
                                                index === this.state.data.length - 1 ?
                                                    <span className="bottom-white"/> : ''
                                            }
                                            <div className={`icon ${index === 0 ? 'on' : ''}`}>
                                                {index === 0 && <div className={'icon1'}>
                                                </div>}
                                            </div>
                                            <span>
                                        {item.orderFlowMsg}
                                    </span>
                                            <span>
                                        {format(item.orderFlowTime, 'yyyy-MM-dd HH:mm:ss')}
                                    </span>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    }
                </div>

                {this.state.reviewMessage && <div className="refundFoot">
                    <div className="textTitle">审核留言</div>
                    <hr className="re-hr"/>
                    <div className="textContent">{this.state.reviewMessage}</div>
                </div>}
                {
                    Number(this.theRequest.saleType) !== 2 ? null : 
                    ((this.state.orderStatus === 13) && !this.state.isEdit) || this.state.orderStatus === 15 || this.state.orderStatus === 25 ? <div className="logistics">
                       <div className="log-item log-name"><b>承运商</b><span>{this.state.expressName}</span></div>
                       <div className="log-item log-number"><b>运单号</b><span>{this.state.transportNo}</span></div>
                    </div> : (this.state.orderStatus === 11 || this.state.orderStatus === 27 || this.state.isEdit) ? 
                    <div className="logistics">
                        <div className="log-item">
                            {/* <input value={this.state.expressName} /> */}
                            <Picker
                                className="picker"
                                data={this.props.afterSale.expressList}
                                value={[this.state.logisticsId]}
                                cols={1}
                                onChange={this.wayCarrier.bind(this)}
                                >
                                <List.Item arrow="horizontal">承运商</List.Item>
                            </Picker>
                        </div>
                            <div className="log-item log-edit">
                                <b>运单号</b>
                                <input value={this.state.transportNo} onChange={this.setExpressNo.bind(this)}/>
                            </div>
                    </div> : null
                }
                { (Number(this.state.orderStatus) === 8 || Number(this.state.orderStatus) === 9 || Number(this.state.orderStatus) === 12 || Number(this.state.orderStatus) === 22 || Number(this.state.orderStatus) === 28) &&
                    <div className="feedback" onClick={this.feedBack.bind(this)}>有问题，可向平台反馈</div> 
                }
                <div className="space"></div>

                {(this.state.quit && this.state.quitStatus && this.state.isConsumer) && (
                    this.state.orderStatus === 5 ||  this.state.orderStatus === 6 || 
                    this.state.orderStatus === 10 || this.state.orderStatus === 19 ||  this.state.orderStatus === 20 
                ) && <div className="quit3" onClick={this.quitApply.bind(this)}>撤销申请</div>}
                {
                    this.state.orderStatus === 13 && !this.state.isEdit && this.state.isAgain !== 1 &&
                    <div className="quit3">
                      <div onClick={this.editLogistics.bind(this)} className="left-button">修改运单</div>
                      <div onClick={this.queryLogistics.bind(this)}  className="right-button">查看物流</div>
                    </div>
                }
                {
                    this.state.orderStatus === 27 || this.state.orderStatus == 11 ? <div className="quit3">
                      <div onClick={this.submitWaybill.bind(this)} className="left-button">提交运单</div>
                      <div onClick={this.quitApply.bind(this)}  className="right-button">撤销申请</div>
                    </div> : null
                }
                {
                    this.state.orderStatus === 13 && this.state.isEdit && <div className="quit3" onClick={this.submitWaybill.bind(this)}>提交运单</div> 
                }
                {
                    this.state.isAgain === 1 && this.state.orderStatus !== 15 && this.state.orderStatus !== 25 && 
                    <div className="quit3" onClick={this.queryLogistics.bind(this)}>查看物流</div>
                }
                {this.state.showLoading ? <div className="loadingView"></div> : null
                }

            </div>
        )
    }
}

export default withRouter(refundProgress)

