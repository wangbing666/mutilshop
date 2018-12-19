/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from "react"
import './myOrderDetail.less';
import * as contants from '../../../common/Apis/constants'
import * as db from '../../../common/Apis/Utils';
import {wxShare} from "../../../common/Apis/wxJsApis";

class MyOrderDetail extends Component {
    //在页面被渲染成功之后
    constructor(props) {
        super(props);
        this.state = {
            // orderId: this.props.location.state.orderId,
            // orderSonId: this.props.location.state.orderSonId,
            // createTime: this.props.location.state.createTime,
            type: 5,
            timeOut: false,
            timer: null,
            showLoading:false,
        }
        this.theRequest = {}
    }

    //reader前
    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '订单详情';
        } else {
            db.setPageTitle('订单详情');
        }

        let theRequest = {};
        let strs = [];
        let urls = location.search; //获取url中"?"符后的字串
        if (urls.indexOf("?") !== -1) {
            let str = urls.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }

        this.theRequest = theRequest;
    }

    getType(type) {
        if (type == 1) {
            return '待付款';
        } else if (type == 2) {
            return '待发货';
        } else if (type == 3) {
            return '已发货';
        } else if (type == 4) {
            return '已完成';
        } else if (type == 5) {
            return '退款中';
        } else if (type == 6) {
            return '退款中';
        } else if (type == 7) {
            return '退货退款中';
        } else if (type == 8) {
            return '已取消';
        }  else {
            return '未知订单类型';
        }
    }
    getTypeTitle(type,saletype) {
        let result="";
        if (type == 1) {
            result= '预计返润：';
        } else if (type == 2) {
            result= '预计返润：';
        } else if (type == 3) {
            result= '预计返润：';
        } else if (type == 4) {
            result= '真实返润：';
        } else if (type == 5) {
            result= '预计返润：';
        } else if (type == 6) {
            result= '预计返润：';
        } else if (type == 7) {
            result= '预计返润：';
        } else if (type == 8) {
            result= '预计返润：';
        }
        if (type!=8){
            switch(saletype){
                case 1:
                    result ="订单已退款，不再返润";
                    break;
                case 2:
                    result ="订单已退货，不再返润";
                    break;
                case 3:
                    result ="订单已退货退款，不再返润";
                    break;
            }
        }
        return result;
    }
    /**
     *
     * @param orders
     * @returns {number}  1.待付款，2其他状态，3. 订单已完成
     */
    getOrderType(orders) {
        if (orders instanceof Array) {
            let length = orders.length;
            for (let i = 0; i < length; i++) {
                if (orders[i].status === 1) {
                    return 1; //子订单中有一个是待付款的，应该全部都是待付款
                } else if (orders[i].status === 2 || orders[i].status === 3 || orders[i].status === 5 || orders[i].status === 6 || orders[i].status === 7) {
                    return 2 //子订单中有一个是订单是没有完成的，母订单不可能是完成状态
                }
            }
        }
        return 3;//当所有子订单都是取消或者已完成状态 ，订单是结束状态

    }

    componentDidMount() {
       
        const {OrderListAction} = this.props;
        let userID = db.readUserInfo()['userId'];
        
        if(!userID){
            userID = this.userId;
        }
        this.setState({showLoading:true})
        OrderListAction.getOrderDetail(userID,this.theRequest.roleType, this.theRequest.orderId, this.theRequest.orderSonId, (orderDetail) => {
            this.setState({showLoading:false})

        }, () => {
            //失败回调

        });
        wxShare([], {});
        // this.props.router.setRouteLeaveHook(
        //     this.props.route,
        //     this.routerWillLeave.bind(this)
        // )
    }

    //页面销毁
    componentWillUnmount() {
       
        // const {OrderTab, OrderListAction} = this.props;
        // OrderListAction.hideAlert()
        if (this.state.timer != null) {
            clearInterval(this.state.timer);
        }
        if (this.myAlert != null) {
            this.myAlert.close();
        }

        const {OrderListAction} = this.props;
        OrderListAction.clearn(5);
        if (this.alertInstance != null) {
            this.alertInstance.close();
        }
    }

    routerWillLeave(nextLocation) {

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

    onClick(key, order) {
        const {history} = this.props;
        switch (key) {
            case 1:
                //查看物流
                let count = 0;
                for (let i = 0; i < order.goods.length; i++) {
                    count = count + order.goods[i].goodsNum
                }
                let url = contants.commonUrl + '/logistics' + "/?totalNum=" + count + "&url=" + order.goods[0].hostUrl + order.goods[0].zoomUrl +
                    "&status=" + order.status + "&orderId=" + order.orderId + "&deliverCompanyName=" + order.logisticsName + "&deliverCompanyNo=" + order.logisticsCode
                    + "&transportNo=" + order.transportNo;
                history.push({
                    pathname: url
                    // query: {
                    //     totalNum: this.props.location.state.orderNum, //商品数量
                    //     url: order.goods[0].hostUrl + order.goods[0].zoomUrl,//商品缩略图
                    //     status: order.status, //订单状态
                    //     orderId: order.orderId, //订单id
                    //     deliverCompanyName: order.logisticsName, // 物流公司名称
                    //     deliverCompanyNo: order.logisticsCode,  // 物流公司对应码
                    //     transportNo: order.transportNo, //运单号
                    //
                    // }
                });
                let data = {type: 11, url: url};
                window.postMessage(JSON.stringify(data))
                break
            case 2:
                //查看售后
                this.goRefundsDetail(order)
                break

        }
    }

    getDes(specifications) {
        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                if(specifications[i].type){

                    des = des + specifications[i].type + ':' + specifications[i].name + "                                       ";
                }
            }
            return des;
        }
    }

    onShopClick(order, shop) {
        if (this.theRequest.roleType == 1) {
            window.postMessage(JSON.stringify({
                type: 3,
                url: 'flagGoodDetails' + '/?shopId=' + this.theRequest.shopId + '&goodsId=' + shop.goodsId + '&userId=' + this.theRequest.userId
            }))
        } else {
            if (order.state == 1 || order.state == 2) {
                window.postMessage(JSON.stringify({
                    type: 4,
                    userId: order.enterpriseAdmin,
                    userName: (order.enterpriseAdminName ? order.enterpriseAdminName : order.enterpriseAdminNickName),
                    enterpriseId: order.enterpriseId,
                    enterpriseLogo: order.logoUrl,
                    url: 'wdGoodDetails' + '/?shopId=' + this.theRequest.shopId + '&goodsId=' + shop.goodsId + '&userId=' + this.theRequest.userId + '&type=' + "1",
                }))
            } else {
                window.postMessage(JSON.stringify({
                    type: 5,
                    url: 'wdGoodDetails' + '/?shopId=' + this.theRequest.shopId + '&goodsId=' + shop.goodsId + '&userId=' + this.theRequest.userId + '&type=' + "1",
                }))
            }
        }
    }

    getItem(order, dates) {
        console.log("order",order)
        console.log("dates",order)
        return (
            dates.map((shop, index) => {
                return (<div className="shop_li" key={index} onClick={() => {
                    this.onShopClick(order, shop)
                }}>
                    <div className="shop_item">
                        <div className="shop_icon_p">
                            {shop.goodStatus === 1 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o6@1.5x.png')}/>} {/*已失效*/}
                            {shop.goodStatus === 2 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o5@1.5x.png')}/>} {/*已下架*/}
                            {shop.goodStatus === 3 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o4@1.5x.png')}/>}{/*已告罄*/}
                            <img className="shop_icon" src={shop.hostUrl + shop.zoomUrl}/>
                        </div>
                        <div className="shop_att">
                            <div className="shop_number_p">
                                <div
                                    className="shop_name">{shop.goodsName !== null ?
                                    (shop.goodsName.length > 10 ? shop.goodsName.substring(0, 10) + "..." : shop.goodsName)
                                    : ''}</div>
                                <div className="shop_count">{'x' + shop.goodsNum}</div>
                            </div>
                            <div className="shop_format">{this.getDes(shop.specifications)}</div>
                            <div className="shop_number_p">
                                <div className="shop_money">{'￥' + shop.goodsPrice}</div>
                                {this.theRequest.roleType == 2 && <div className="shop_share_money">
                                    <span
                                        className="span_title_1">{this.getTypeTitle(order.status,order.saleType)}</span>
                                    {(order.saleType ==undefined ||order.saleType ==null) && <span className="span_title_2">{shop.shareMoney}</span>}
                                </div>}


                            </div>
                        </div>
                    </div>
                    {index !== dates.length - 1 && <div className="orderToShop">
                        <div className="line"/>
                    </div>}

                </div>);
            })
        );
    }

    getChildrenItem(orders) {
   
        if (orders instanceof Array) {
            return (
                orders.map((order, index) => {
                    return (
                        <div key={index}>
                            {index !== 0 && <div className="orderToShop">
                                <div className="line"/>
                            </div>}

                            <div className="childOrderItemParent">
                                <div className="childOrderItemLeft">
                                    <span>{"订单号：" + order.orderNo}</span>
                                    {(this.theRequest.roleType == 2 && order.enterpriseAdmin != this.theRequest.userId) &&
                                    <img className="img_1" src={require('../../images/order/liaotian.png')}
                                         onClick={() => {
                                             window.postMessage(JSON.stringify({
                                                 type: 2,
                                                 userId: order.enterpriseAdmin,
                                                 userName: (order.enterpriseAdminName ? order.enterpriseAdminName : order.enterpriseAdminNickName),
                                                 enterpriseId: order.enterpriseId,
                                                 enterpriseLogo: order.logoUrl
                                             }))
                                         }}/>}
                                </div>
                                <div className="childOrderItemRight">
                                    <span style={{color: "#007AED"}}>{this.getType(order.status)}</span>
                                </div>
                            </div>
                            {this.getItem(order, order.goods)}
                            {(order.status == 2 && this.theRequest.roleType == 1) &&
                            <div className="orderDetailShopButtonParent">
                                <button style={{background: "#FFFFFF"}}>
                                    <span style={{color: "#007AED"}}>发货填写可在商户后台操作</span>
                                </button>
                            </div>
                            }
                            {(order.status == 3 || order.status == 4) &&
                            <div className="orderDetailShopButtonParent">
                                <button style={{background: "#FFFFFF"}} onClick={() => {
                                    this.onClick(1, order)
                                }}>
                                    <span style={{color: "#007AED"}}>查看物流</span>
                                </button>
                            </div>
                            }
                            {(order.status == 5) &&
                            <div className="orderDetailShopButtonParent">
                                <button style={{background: "#FFFFFF"}} onClick={() => {
                                    this.onClick(2, order)
                                }}>
                                    <span style={{color: "#007AED"}}>售后详情</span>
                                </button>
                            </div>
                            }
                            {(order.status == 6 || order.status == 7) && <div className="orderDetailShopButtonParent">
                                <button style={{background: "#FFFFFF"}} onClick={() => {

                                    this.onClick(1, order)
                                }}>
                                    <span style={{color: "#007AED"}}>查看物流</span>
                                </button>
                                <button style={{background: "#FFFFFF"}} onClick={() => {
                                    this.onClick(2, order)

                                }}>
                                    <span style={{color: "#007AED"}}>售后详情</span>
                                </button>
                            </div>
                            }
                        </div>
                    );
                })
            );
        } else {
            return (<div/>);
        }


    }


    //查看售后详情
    goRefundsDetail(order) {
        //查看售后
        let count = 0;
        for (let i = 0; i < order.goods.length; i++) {
            count = count + order.goods[i].goodsNum
        }
        const {OrderListAction, history, OrderTab} = this.props;
        let detail = OrderTab.orderDetail;
        let userID = db.readUserInfo()['wedoId'];
        let url = "";
        if (order.status == 5 || order.status == 6) {
            url = contants.commonUrl + '/refundProgress' + "/?orderId=" + order.orderId + "&orderNum=" + count + "&createTime=" + detail.createTime + "&isConsumer=" + false + "&userId=" + detail.userId;
            history.push({
                pathname: url
                // state: {
                //     orderId: order.orderId,
                //     orderNum: count,
                //     createTime: this.props.location.state.createTime,
                // }
            });
        } else {
            url = contants.commonUrl + '/refundsDetailList' + "/?orderId=" + order.orderId + "&orderNum=" + count + "&createTime=" + detail.createTime + "&userId=" + userID + "&isConsumer=" + false + "&userId=" + detail.userId;
            history.push({
                pathname: url,
                state: {
                    orderId: order.orderId,
                    orderNum: count,
                    userId: userID,
                    createTime: this.props.location.state.createTime,
                }
            });
        }

        let data = {type: 11, url: url};
        window.postMessage(JSON.stringify(data))
    };

    getPayType(type) {
        switch (parseInt(type)) {
            case 1:
                return "银行卡(快捷)"
                break;
            case 2:
                return "信用卡(快捷)"
                break;
            case 3:
                return "微信"
                break;
            case 4:
                return "支付宝"
                break;
            case 5:
                return "零钱"
                break;
            case 6:
                return "银行卡"
                break;
            case 7:
                return "信用卡"
                break;
            case 8:
                return "企业钱包"
                break;
            case 9:
                return "公务钱包"
                break;
            case 10:
                return "福利钱包"
                break;
        }
    }

    render() {
        const {OrderTab} = this.props;
        let detail = OrderTab.orderDetail;
    
        if (detail !== null) {
            return (
                <div className="order_detail">
                    <div className="order_number_p">
                        <div className="order_number">
                            <img
                                src={detail.userHeadFile} onClick={() => {
                                let data = {type: 1, userId: detail.userId};
                                window.postMessage(JSON.stringify(data))
                            }}/>
                            <div className="middleContainer">
                                <span className="span_name">{detail.userNickName}</span>
                                <span className="span_1">{"下单时间:" + detail.createTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="detail_order_item_line"/>
                    <ul className="shop_list">
                        {this.getChildrenItem(detail.orderSonList)}
                    </ul>
                    <div className="orderToShop">
                        <div className="line"/>
                    </div>
                    <div className="titleContent">
                        <span>收货信息:</span>
                    </div>
                    <div className="textContent_receive">
                        <span className="span_1">{detail.receiverName}</span>
                        <span className="span_2">{detail.receiverMobile}</span>
                        <span className="span_3">{detail.address}</span>
                    </div>
                    <div className="orderToShop">
                        <div className="line"/>
                    </div>
                    {detail.bileType && <div>
                        <div className="titleContent">
                            <span>支付方式:</span>
                        </div>
                        <div className="textContent">
                            <span>{this.getPayType(detail.bileType)}</span>
                        </div>
                        <div className="orderToShop">
                            <div className="line"/>
                        </div>
                    </div>
                    }
                    <div className="titleContent">
                        <span>送货时间:</span>
                    </div>
                    <div className="textContent">
                        <span>{detail === null ? '' : (detail.sendType === 1 ? '随时' : (detail.sendType === 2 ? '工作日' : '非工作日'))}</span>
                    </div>
                    <div className="orderToShop">
                        <div className="line"/>
                    </div>
                    {
                        (detail.remark !== undefined && detail.remark !== null && detail.remark !== "") && <div>
                            <div className="titleContent">
                                <span>留言:</span>
                            </div>
                            <div className="textContent">
                                <span>{detail.remark.length > 20 ? detail.remark.substring(0, 20) + "..." : detail.remark}</span>
                            </div>
                            <div className="orderToShop">
                                <div className="line"/>
                            </div>
                        </div>
                    }

                    <div className="titleContent">
                        <span>商品金额:</span>
                    </div>
                    <div className="textContent">
                        <span>{detail !== null ? '￥' + detail.goodsMoney : ''}</span>
                    </div>
                    <div className="orderBottomLine">
                        <div className="line"/>
                    </div>
                    <div className="orderBottom">
                        <div className="item">
                            <span className="spanTitle">{"实付金额:"}</span>
                            <span className="spanMoney">{detail !== null ? '￥' + detail.amount : ''}</span>
                        </div>
                        {this.theRequest.roleType == 2 && <div className="item_1">
                            <span className="spanTitle_1">{"返利总额:"}</span>
                            <span className="spanMoney_1"
                                  style={{color: '#FF2D55 '}}>{detail !== null ? '￥' + detail.proxyTotal : ''}</span>
                        </div>}

                    </div>
                </div>);
        } else {
            return (<div>
                {this.state.showLoading?<div className="loadingView"><div className="loadingImg"></div></div>:null}
            </div>);
        }
    }
}

export default MyOrderDetail;
