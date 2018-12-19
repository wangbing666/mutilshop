/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from "react";
import './refundsDetailList.less'
import {InputItem, Picker, List, Modal, ActivityIndicator} from "antd-mobile";
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as Utils from '../../../common/Apis/Fetch';

import { Toast } from 'antd-mobile';

const Item = List.Item;
const alert = Modal.alert;
const CustomChildren = props => (
    <div
        onClick={props.onClick}
        className="express_item"
    >
        <div className="express_item_3">
            <div className="express_item_title">承运商</div>
            <div className="express_item_name">{props.data}</div>
        </div>
    </div>
);

export default class RefundsDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            number: '',
            isCommit: false,
            data: '',
            expressName: '请选择承运商名称',
            expressId: 0,
            isConsumer:false,
            operType: 2, //退货
            editOrderNum:null,

    }
        this.orderId;
        this.aftersaleId;
        this.createTime;
        this.orderNum;
        this.theRequest;
    }

    //reader前
    componentWillMount() {
        // console.log(this.props)
        this.setState({
            editOrderNum:1
        })
        if(db.userAgent()==='Android'){
            document.title='售后详情';
        }else{
            db.setPageTitle('售后详情');
        }
        let theRequest = {};
        // let strs = [];
        // let urls = location.search; //获取url中"?"符后的字串
        // if (urls.indexOf("?") !== -1) {
        //     let str = urls.substr(1);
        //     strs = str.split("&");
        //     for (let i = 0; i < strs.length; i++) {
        //         theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        //     }
        // }
        theRequest = db.getValueFromUrl();
        this.orderId = theRequest.orderId;
        this.aftersaleId = theRequest.aftersaleId;
        this.createTime = theRequest.createTime;
        this.orderNum = theRequest.orderNum;
        this.theRequest = theRequest;
        this.setState({
            isConsumer:theRequest.isConsumer === undefined
        }) ;
    }

    //在页面被渲染成功之后
    componentDidMount() {
        const { afterSalesAction } = this.props;
        
        let userId = "";
        if(this.state.isConsumer){
            // userId  = db.readUserInfo()['wedoId'];
            userId  = db.readUserInfo()['userId'];
        }else {
            userId = this.theRequest.userId ;
        }
        afterSalesAction.getSaleDetail(userId, this.aftersaleId, this.orderId);

        afterSalesAction.getExpressList();
        wxShare([], {});
    }

    //页面销毁
    componentWillUnmount() {
        if (this.alertInstance != null) {
            this.alertInstance.close();
        }
        const {afterSalesAction} = this.props;
        afterSalesAction.hideAlert();
    }

    onClick(key) { //提交运单

        const {afterSalesAction, afterSale} = this.props;
        // let userId = db.readUserInfo()['wedoId'];//(SH)
        let userId = db.readUserInfo()['userId'];
        // console.log(userId)
        switch (key) {
            case 1: //提交
                this.alertInstance = alert('确定提交寄件信息?', '', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#000000'}},
                    {
                        text: '确定', onPress: () => {
                        afterSalesAction.sendExpressInfo(userId, afterSale.refundInfo.aftersaleId,
                            this.state.expressName, this.state.expressId, this.state.number, afterSale.refundInfo, this.orderId);
                    }, style: {color: '#000000'}
                    },
                ]);

                break;
            case 2://撤销申请
                this.alertInstance = alert('确定撤销申请?', '', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#000000'}},
                    {
                        text: '确定', onPress: () => {
                        afterSalesAction.cancelApplyPost(userId, afterSale.refundInfo.aftersaleId, afterSale.refundInfo, this.orderId, this.state.operType);
                    }, style: {color: '#000000'}
                    },
                ]);
                break;
        }
    }

    changeVal(e) {
        let val = e.target.value.trim();
        let Regx = /^[A-Za-z0-9]*$/;
        let isSub = false;

        if (val != '' && Regx.test(val)) {
            if (this.state.expressName != '请选择承运商名称') {
                isSub = true;
            }
        }
        this.setState({number: val, isCommit: isSub});
        console.log(this.state.isCommit)
    };

    onChange(value) {
        const {afterSale} = this.props;
        let label = '';
        let isSub = false;

        for (let i = 0; i < afterSale.expressList.length; i++) {
            if (value[0] === afterSale.expressList[i].value) {
                label = afterSale.expressList[i].label;
                break;
            }
        }


        if (this.state.number !== null && this.state.number !== '') {
            isSub = true;
        }
        this.setState({
            expressId: value[0],
            expressName: label,
            isCommit: isSub
        });
    };
    // 添加修改运单按钮事件（SH）

    editOrder(val){
       
        this.setState({
            editOrderNum:val
        })
        if(val === 0){ //此接口没通 (查看物流)
            let data = {
                orderId:this.orderId,//订单Id
                // combinationIdList:,//
            };

            Utils.post('/transportInfo/getAftersaleTransportInfo',data,(res)=>{
                alert("查看物流成功")
            },(err)=>{
                alert("请求失败")
            })
        }else if(val === 2){
               
                if(this.state.isCommit){

                }
            
        }else if(val === 3){
   
        this.subMitOrder()
       
    }
    }
    subMitOrder(msg){
        let data = {
            userId:db.readUserInfo()['userId'],
            aftersaleId:this.props.afterSale.refundInfo.aftersaleId,//售后单号
            logisticsName:this.state.expressName,//承运商名称
            transportNo:this.state.number,//运单号
            logisticsId:this.state.expressId,//承运商id
            orderId:this.orderId
        };

        let orderListData = {
            userId: db.readUserInfo()['userId'],
            targetUserId: db.readUserInfo()['userId'],
            aftersaleId: this.props.afterSale.refundInfo.aftersaleId,
            orderId: this.orderId
        };
        
        if(this.state.isCommit){

            Utils.post('/afterSale/postGoods',data,(res)=>{
            
                if(res.status == 0){
                     Utils.post('/afterSale/getReturnGoodsInfo',orderListData,()=>{

                     },(err)=>{
                         alert("获取售后进度失败！")
                     })
                }
                
            },(err)=>{
                alert("修改订单失败！")
            })
        }else{
            
            return false;
            alert("输入不合法！")
        }

    }

    render() {
        const {afterSale} = this.props;

        const renderButton = () => {
            if (this.state.editOrderNum === 1) {
                return(
                    <div className="submit_edit_p_1">
                            <div className="refund_number_p">
                                <div className="express_item">
                                    <div className="express_item_title_1">承运商</div>
                                    <div className="express_item_name">{refundInfo.logisticsName}</div>
                                    {/* <div className="express_item_name">张柳青快递公司</div> */}
                                </div>
                                <div className="express_item">
                                    <div className="express_item_title_1">运单号</div>
                                    <div className="express_item_name">{refundInfo.transportNo}</div>
                                    {/* <div className="express_item_name">1111111111111111</div> */}
                                </div>
                            </div>
                      

                        <div className="quitUnClick status-1">
                            <div onClick={ ()=>{ this.editOrder(2) } }>修改运单</div>
                            <div onClick={ ()=>{ this.editOrder(0) } }>查看物流</div>
                        </div>
                    </div>
                )
            } else if(this.state.editOrderNum === 2){
                return (
                    <div className="submit_edit_p_1">
                        <div>
                            <Picker
                                data={afterSale.expressList}
                                cols={1}
                                onChange={v=> this.onChange(v)}>
                                <CustomChildren data={this.state.expressName}></CustomChildren>
                            </Picker>
                            <div className="express_item">
                                <div className="express_item_title">运单号</div>
                                <input className="express_item_name" ref="myTextInput" maxLength="20"
                                     onChange={v => {this.changeVal(v)}}
                                    placeholder="请输入运单号"/>
                            </div>
                        </div>
                        <div onClick={ ()=>{ this.editOrder(3) } } className="quitUnClick status-1" style={{color:"red"}}>确认修改</div>
                    </div>

                )
            } else if(this.state.editOrderNum === 3 && this.state.isCommit){
                return(
                    <div className="submit_edit_p_1">
                        <div className="refund_number_p">
                                <div className="express_item">
                                    <div className="express_item_title_1">承运商</div>
                                    <div className="express_item_name">{refundInfo.logisticsName}</div>
                                    {/* <div className="express_item_name">张柳青快递公司</div> */}
                                </div>
                                <div className="express_item">
                                    <div className="express_item_title_1">运单号</div>
                                    <div className="express_item_name">{refundInfo.transportNo}</div>
                                    {/* <div className="express_item_name">1111111111111111</div> */}
                                </div>
                        </div>
                        <div onClick={ ()=>{ this.editOrder(0) } } className="quitUnClick status-1" style={{color:"red"}}>查看物流</div>
                    </div>
                )
            } else {
                return false;
            }

        }
        let refundInfo = afterSale.refundInfo;
        // console.log(refundInfo)
        if (refundInfo !== null) {
            return (<div style={{background: '#F2F2F2'}}>
                <div className="order_detail_number">
                    <div
                        className="oder_number_left">{'申请时间:' + format(refundInfo.afterSaleCreateTime, 'yyyy-MM-dd HH:mm:ss')}</div>
                </div>
                <div className="order_detail_number">
                    <div className="oder_number_left left2">{'售后单号:' + refundInfo.saleOrderNo}</div>
                </div>
                {
                    refundInfo.orderStatus === 15 && //处理完成 显示以退款金额
                    <div className="refund_money_p">
                        <img className="refund_money_img" src={require('../../images/refund/refund.png')}/>
                        <span className="refund_money" style={{color:"#000000"}}> {'已退款       ￥' + refundInfo.refundAmount}</span>
                    </div>
                }
                <div className="order_detail_number_p">
                    <span className="oder_number_left"> 售后进度</span>
                </div>
                <div className="flow-list">
                    <div className="new-order-flow new-p-re">
                        <ul className="new-of-storey">
                            {
                                refundInfo.orderFlow.map((item, index) => {
                                    return <li key={index}
                                               className={index === refundInfo.orderFlow.length - 1 ? 'new-of-storey_li' : ''}>
                                        {
                                            index === 0 ? <span className="top-white"/> : ''
                                        }
                                        {
                                            index === refundInfo.orderFlow.length - 1 ?
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
                {/*afterSaleStatus 状态说明参考卡宝售后进度接口说明文档： /afterSale/getReturnGoodsInfo */}

                 {/* 待审核状态可以撤销申请 */}
                {
                    (refundInfo.afterSaleStatus === 1 && refundInfo.isCancelAS === 1 && this.state.isConsumer) &&
                    <div className="quitUnClick status-1" style={{color:"red"}} onClick={() => { this.onClick(2) }}>
                       {/*  <button className="submit_cancel" onClick={() => { this.onClick(2) }}>撤销申请
                        </button> */}
                        撤销申请
                    </div>
                } 
           

                {/**申请通过状态，可以提交-运单（第一次提交） 此时还可以撤销申请**/}
                {(refundInfo.afterSaleStatus == 2 && refundInfo.isCancelAS == 1 && this.state.isConsumer) &&
                <div className="refund_number_p">
                    <Picker
                        data={afterSale.expressList}
                        cols={1}
                        onChange={v => this.onChange(v)}>
                        <CustomChildren data={this.state.expressName}></CustomChildren>
                    </Picker>
                    <div className="express_item_1">
                        <div className="express_item_title">运单号</div>
                        <input className="express_item_name" ref="myTextInput_one" maxLength="20"
                               value={this.state.number} onChange={v => {this.changeVal(v)}}
                               placeholder="请输入运单号"/>
                    </div>

                    <div className="quitUnClick status-1">
                        <div >撤销申请</div>
                        <div onClick={()=>{ this.subMitOrder("first") }}>提交运单</div>{/* onClick={()=>{ this.editOrder(1) }} */}
                    </div>
                
                    
                </div>
                }

                {/* 添加修改-运单 */}

                {(refundInfo.afterSaleStatus === 2 && refundInfo.isCancelAS == 0 && this.state.isConsumer && refundInfo.orderStatus === 13) && renderButton()}
                

                {/**退货已收到，处理退款中**/}

                 {
                    ( refundInfo.afterSaleStatus === 3 && refundInfo.isCancelAS == 0 && refundInfo.transportNo !== undefined &&
                        refundInfo.transportNo !== null && '' != refundInfo.transportNo) && refundInfo.orderStatus === 14 &&
                    <div className="refund_number_p">
                        <div className="express_item">
                            <div className="express_item_title_1">承运商</div>
                            <div className="express_item_name">{refundInfo.logisticsName}</div>
                        </div>
                        <div className="express_item">
                            <div className="express_item_title_1">运单号</div>
                            <div className="express_item_name">{refundInfo.transportNo}</div>
                        </div>
                    </div>
                }  
                {/* 已完成订单 退款退货完成 */}
                 {
                    ( refundInfo.afterSaleStatus === 4 && refundInfo.isCancelAS == 0 && refundInfo.transportNo !== undefined &&
                        refundInfo.transportNo !== null && '' != refundInfo.transportNo) && refundInfo.orderStatus === 15 &&
                    <div className="refund_number_p">
                        <div className="express_item">
                            <div className="express_item_title_1">承运商</div>
                            <div className="express_item_name">{refundInfo.logisticsName}</div>
                        </div>
                        <div className="express_item">
                            <div className="express_item_title_1">运单号</div>
                            <div className="express_item_name">{refundInfo.transportNo}</div>
                        </div>
                    </div>
                }  

                {/* 之前的功能，暂时用不到 */}

                {/*    <div className="submit_p">
                        {this.state.isCommit && <button className="submit_2" onClick={() => {
                            this.onClick(1)
                        }}>我已寄件
                        </button>
                        } {this.state.isCommit === false && <button className="submit_1">我已寄件</button>
                    }
                </div> */}

                {/* 审核留言，暂时用不上 */}

                {/*   {
                    (refundInfo.checkLeaveMsg != null && '' != refundInfo.checkLeaveMsg ) &&
                    <div className="refund_msg">
                        <div className="order_detail_number_p" style={{marginTop: '0'}}>
                            <span className="oder_number_left"> 审核留言</span>
                        </div>
                        <div>
                            <span className="leave_msg">{refundInfo.checkLeaveMsg}</span>
                        </div>
                    </div>
                } */}

                {afterSale.showLoading ? <div className="loadingView">
                    <div className="loadingImg"></div>
                </div> : null}
            </div>);
        } else {
            return (
                <dic
                    style={{
                        height: document.documentElement.clientHeight,
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <img className="imgIcon" src={require('../../images/aftersales/j1@1x.png')}></img>
                    <div>暂无申请记录</div>
                </dic>
            );
        }

    }
}