/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：待付款订单详情
 */
import React from 'react';
import {ActivityIndicator, Modal, Toast} from 'antd-mobile';
import './pending_order_detail.less'
import '../order/orderDetail.less'
import {format} from '../../../common/Apis/Utils'
import {post} from "../../../common/Apis/Fetch";
import * as constant from "../../../common/Apis/constants";
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'

const alert = Modal.alert;
export default class pendingOrderDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderTime: '',
            expiredTime: '',
            orderNum: '',
            recipientInformation: [],
            itemList: [],
            sendTime: '',
            remark: '',
            goodsMoney: null,
            amount: null,
            detailType: '',
            userName: '',
            mobile: '',
            address: '',
            isQuitOrderSuccess: true,
            showLoading: true,
            isShowMessage: true,
            timeOut: false,
            goods: [],
            status: '',
            timer: null,
        }
    }

    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '订单详情';
        } else {
            db.setPageTitle('订单详情');
        }

    }

    //离开界面销毁定时器
    componentWillUnmount() {
        if (this.state.timer != null) {
            clearInterval(this.state.timer);
        }
        if (this.myAlert != null) {
            this.myAlert.close();
        }
    }

    componentDidMount() {
        let params = {
            userId: db.readUserInfo()['userId'],
            orderId: this.props.location.state.orderId,
        }
       // console.log("订单请求参数...",JSON.parse(params));
        post('/webOrder/getWebOrderDetail', params, (data) => {
            // console.log('------------', data)
            this.setState({showLoading: false});
            if (data.returnStatus === 0) {
                // this.state.sendTime = data.sendType == 1 ? '随时' : (data.sendType == 2 ? '工作日' : '非工作日');
                // this.state.orderTime = format(data.createTime, 'yyyy-MM-dd HH:mm:ss')
                // this.state.expiredTime = data.outTime;
                // this.state.goodsMoney = data.goodsMoney;
                // this.state.amount = data.amount;
                // this.state.status = '待付款';
                // this.state.goodsMoney = data.goodsMoney;
                // this.state.remark = data.remark;
                // this.state.address = data.address;
                // this.state.mobile = data.mobile;
                // this.state.userName = data.userName;
                // this.state.orderTime = data.createTime;
                // this.state.orderNum = data.orderNo;
                // this.state.goods = data.goods;

                this.setState({
                    sendTime: data.sendType == 1 ? '随时' : (data.sendType == 2 ? '工作日' : '非工作日'),
                    orderTime: format(data.createTime, 'yyyy-MM-dd HH:mm:ss'),
                    amount: data.amount,
                    status: '待付款',
                    goodsMoney: data.goodsMoney,
                    remark: data.remark,
                    address: data.address,
                    mobile: data.mobile,
                    userName: data.userName,
                    orderTime: data.createTime,
                    orderNum: data.orderNo,
                    goods: data.goods,
                })
                let index = data.createTime.indexOf('.');
                let time2 = index === -1 ? data.createTime : data.createTime.substring(0, index);
                let startTime = new Date(Date.parse(time2.replace(/-/g, "/"))).getTime();
                // let nowTime = Date.parse(new Date());
                let nowTime = data.nowDate;
                let time = parseInt((60 * 60 * 1000 - (nowTime - startTime)) / 1000);
                let timeLeave = ( time > 60 * 60 ? 60 * 60 : time);
                if (timeLeave <= 0) {
                    this.setState({timeOut: true, detailType: '已取消', status: '已取消'});
                } else {
                    this.setState({expiredTime: ((Math.floor(timeLeave / 60)) + "分" + (timeLeave - Math.floor(timeLeave / 60) * 60) + "秒")});
                    //有时间限制开启定时器
                    if (timeLeave != 0) {
                        this.state.timer = setInterval(() => {
                            timeLeave--;
                            if (timeLeave == 0) {
                                this.setState({timeOut: true, detailType: '已取消', status: '已取消'});
                                clearInterval(this.state.timer);
                                // const {router} = this.props;
                                // router.replace({
                                //     pathname: contants.commonUrl + '/orderDetailContainer',
                                //     state: {
                                //         orderId: data.orderId,
                                //         createTime: data.createTime,
                                //     }
                                // })
                                return;
                            }
                            this.setState({expiredTime: ((Math.floor(timeLeave / 60)) + "分" + (timeLeave - Math.floor(timeLeave / 60) * 60) + "秒")});
                        }, 1000);
                    }
                }

            } else {
                console.log(data.msg);
            }
        }, (err) => {
            this.setState({showLoading: false});
            console.log(err);
        })


    }

    quitOrder() {
        let orderId = this.props.location.state.orderId;
        if (this.state.timeOut) {
            this.myAlert = alert('', '确定删除该订单?', [{
                text: '确定', onPress: () => {
                    let params = {
                        userId: db.readUserInfo()['userId'],
                        orderId: orderId,
                        operation: 1
                    }
                    console.log('params', params)
                    post('/webOrder/cancelOrDeleteOrder', params, (data) => {
                        console.log(data)
                        if (data.status === 0) {
                            Toast.info("删除订单成功");
                            const {router} = this.props;
                            router.goBack();
                        } else {
                        }
                    }, (err) => {
                    })
                }, style: {color: '#000000'}
            }, {
                text: '取消', onPress: () => {
                }, style: {color: '#000000'}
            }]);
            return;
        }
        this.myAlert = alert('', '确定放弃该订单?', [{
            text: '确定', onPress: () => {
                let params = {
                    userId: db.readUserInfo()['userId'],
                    orderId: orderId,
                    operation: 2
                }
                post('/webOrder/cancelOrDeleteOrder', params, (data) => {
                    console.log(data)
                    if (data.status === 0) {
                        Toast.info("取消订单成功");
                        const {router} = this.props;
                        router.goBack();
                    } else {
                    }
                }, (err) => {
                })
            }, style: {color: '#000000'}
        }, {
            text: '取消', onPress: () => {
                console.log("取消")
            }, style: {color: '#000000'}
        }]);
    }

    getGoods(goods) {
        let newGoods = [];
        if (goods instanceof Array) {
            for (let i = 0; i < goods.length; i++) {
                if (goods[i].goodStatus === 0) {
                    newGoods.push(goods[i])
                }
            }
        }
        return newGoods;
    }

    payOrder() {
        if (this.state.timeOut) {
            // Toast.info("付款超时，订单自动取消");
            let goods = this.getGoods(this.state.goods);
            if (goods.length > 0) {
                let shopList = []
                for (let i = 0; i < goods.length; i++) {
                    let dic = {
                        "goodsId": goods[i].goodsId,
                        "number": goods[i].goodsNum,
                        "param1": goods[i].param1,
                        "param2": goods[i].param2,
                        "param3": goods[i].param3
                    }
                    shopList[i] = dic;
                }
                let body = {
                    userId: db.readUserInfo()['userId'],
                    shopList: JSON.stringify(shopList)
                }
                post('/shopping/insertshop', body, (response) => {
                    if (response.status == 0) {//加入购物袋成功
                        const {router} = this.props;
                        router.push({
                            pathname: contants.commonUrl + '/shoppingCart'
                        });
                    } else {
                        this.state.myAlert = alert('提示', response.msg, [
                            {
                                text: '确定', onPress: () => {
                            }
                            },
                        ]);
                    }
                }, (error) => {
                    dispatch(showLoading(false));
                    showAlert = alert('提示', '网络失败', [
                        {
                            text: '确定', onPress: () => {
                        }
                        },
                    ]);
                });
            } else {
                this.myAlert = alert('', '订单中的商品还未上架，不能购买', [
                    {
                        text: '确定', onPress: () => {
                    }, style: {color: '#000000'}
                    },
                ]);
            }
            return;
        }
        const {router} = this.props;
        router.push({
            pathname: constant.commonUrl + '/payment',
            state: {
                orderId: this.props.location.state.orderId,
                money: this.state.amount,
            }
        })
    }

    getDes(specifications) {
        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                des = des + specifications[i].type + ':' + specifications[i].name;
            }
            return des;
        }
    }

    onClick(item) {
        const {router} = this.props;
        router.push({
            pathname: constant.commonUrl + '/goodDetails',
            state: {
                goodsId: item.goodsId
            }
        })
    }

    render() {
        return (
            <div style={{backgroundColor: '#F4F4F4'}}>
                {(!this.state.timeOut) && <div className="tipOn">
                    <div>
                        <div className="img"><img src={require("../../images/aftersales/pending_order.png")}/></div>
                        <div className="text">你于<span>{this.state.orderTime}</span>&nbsp;&nbsp;下的订单</div>
                    </div>
                    <div className="textTop">请在<span>{this.state.expiredTime}</span>内付款，超时订单将取消</div>
                </div>}

                {(this.state.timeOut) && < div className="tipOff">
                    <div>
                        <div className="img"><img src={require("../../images/aftersales/e7.png")}/></div>
                        <div className="text">你于<span>{this.state.orderTime}</span>&nbsp;&nbsp;下的订单</div>
                    </div>
                    <div className="textTop">已超过时间未付款，订单已自动取消</div>
                </div>}


                <div>
                    <div className="order_detail_number_pp">
                        <div className="detail_number">{'订单号:' + this.state.orderNum}</div>
                        <div
                            className="detail_type">{this.state.status}</div>
                    </div>
                    <div className="detail_order_item_line"/>
                    <div className="order_detail_number_pp">
                    <span className="order_detail_receive_1">
            收货信息
            </span>
                    </div>
                    <div className="detail_address">
                        <div className="address_people_msg">
                            <div className="people_name">
                                <img src={require('../../images/order/order_people_name.png')}
                                     className="people_msg_img_1"/>
                                <span className="address_msg"> {this.state.userName}</span>
                            </div>
                            <div className="people_phone">
                                <img src={require('../../images/order/order_people_phone.png')}
                                     className="people_msg_img_2"/>
                                <span className="address_msg">{this.state.mobile}</span>
                            </div>
                        </div>
                        <div className="address_msg_p">
            <span className="address_msg1">
                {this.state.address}
            </span>
                        </div>
                    </div>
                    <div className="detail_order_item_line"/>
                    <div className="order_detail_receive1">
                        商品信息
                    </div>
                    <div>
                        <ul>
                            {this.state.goods.map((item, i) => {
                                return <li className="shop_li" onClick={() => {
                                    this.onClick(item)
                                }} key={i.toString()}>
                                    <div className={i === this.state.goods.length - 1 ? "shop_item_2" : "shop_item"}>
                                        <div className="shop_icon_p">

                                            {item.goodStatus === 1 &&
                                            <img className="shop_icon_state"
                                                 src={require('../../images/order/o6@1.5x.png')}/>} {/*已失效*/}
                                            {item.goodStatus === 2 &&
                                            <img className="shop_icon_state"
                                                 src={require('../../images/order/o5@1.5x.png')}/>} {/*已下架*/}
                                            {item.goodStatus === 3 &&
                                            <img className="shop_icon_state"
                                                 src={require('../../images/order/o4@1.5x.png')}/>}{/*已告罄*/}
                                            <img className="shop_icon" src={item.hostUrl + item.zoomUrl}/>
                                        </div>
                                        <div className="shop_att">
                                            <div
                                                className="shop_name">{item.goodsName !== null ?
                                                (item.goodsName.length > 18 ? item.goodsName.split(0, 18) + "..." : item.goodsName)
                                                : ''}</div>
                                            <div className="shop_number_p">
                                                <div className="shop_format">{this.getDes(item.specifications)}</div>
                                                <div className="shop_count">{'x' + item.goodsNum}</div>
                                            </div>
                                            <div className="shop_money">{'￥' + item.goodsPrice}</div>
                                        </div>
                                    </div>
                                </li>
                            })
                            }
                        </ul>
                    </div>
                </div>

                <div className="sendTime">
                    <div className="sendLeft">送货时间</div>
                    <div className="sendRight">{this.state.sendTime}</div>
                </div>

                {this.state.remark &&
                <div className="message1">
                    <div className="messageLeft1">留言</div>
                    <div>
                        <div className="messageRight1">{this.state.remark}</div>
                    </div>
                </div>}

                <div className="money3">
                    <div className="moneyTop2">
                        <div className="moneyLeft2">商品金额</div>
                        <div className="moneyRight2">¥{this.state.goodsMoney}</div>
                    </div>
                    <div>
                        <hr style={{borderTop: '1px'}}/>
                    </div>
                    <div className="moneyBottom2"><span className="spanLeft2">应付金额:&nbsp;</span><span
                        className="spanRight2">¥{this.state.amount}</span></div>
                </div>

                {!this.state.timeOut ?
                    <div className="btm4">
                        <button className="quit4" onClick={this.quitOrder.bind(this)}>取消订单</button>
                        <button className="pay4" onClick={this.payOrder.bind(this)}>立即付款</button>
                    </div>
                    :
                    <div className="btm4">
                        <button className="quit4" onClick={this.quitOrder.bind(this)}>删除订单</button>
                        <button className="pay4" onClick={this.payOrder.bind(this)}>再次购买</button>
                    </div>
                }
                {/*<ActivityIndicator*/}
                    {/*toast*/}
                    {/*text="Loading..."*/}
                    {/*animating={this.state.showLoading}*/}
                {/*/>*/}
                {this.state.showLoading ? <div className="loadingView">
                    <div className="loadingImg"></div>
                </div> : null
                }
            </div>
        )
    }
}
//
// const mapStateToProps = (state) => {
//     const orderDetailReceive = state.get('PendingOrderDetailReducer').toJS();
//     return {
//         orderDetailReceive
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     const PendingOrderAction = bindActionCreators(pendingOrderAction, dispatch);
//     return {
//         PendingOrderAction
//     };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(pendingOrderDetail);