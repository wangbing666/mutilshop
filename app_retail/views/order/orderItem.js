/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */
import React, {Component} from "react"
import './myOrderDetail.less'
import * as contants from '../../../common/Apis/constants';


class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.goods,
            type: this.props.type
        }
        console.log('shops', this.state.data)
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
            return '待发货退款中';
        } else if (type == 6) {
            return '已发货退款中';
        } else if (type == 7) {
            return '已发货退货退款中';
        } else if (type == 8) {
            return '已取消';
        } else {
            return '未知订单类型';
        }
    }

    onClick(shop) {
        if (this.state.type == 1) {
            this.props.router.push({
                pathname: contants.commonUrl + '/goodDetails',
                state: {
                    goodsId: shop.goodsId
                }
            });
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

    getItem(dates) {
        return (
            dates.map((shop, index) => {
                return (<li className="shop_li" key={index} onClick={() => {
                    this.onClick(shop)
                }}>
                    <div className={index === dates.length - 1 ? "shop_item_2" : "shop_item"}>
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
                            {/* <img className="shop_icon" src={shop.hostUrl + shop.zoomUrl}/> */}
                            <img className="shop_icon" src={shop.goodsFile}/>
                        </div>
                        <div className="shop_att">
                            <div
                                className="shop_name">{shop.goodsName !== null ?
                                (shop.goodsName.length > 18 ? shop.goodsName.split(0, 18) + "..." : shop.goodsName)
                                : ''}</div>
                            <div className="shop_number_p">
                                <div className="shop_format">{this.getDes(shop.specifications)}</div>
                                <div className="shop_count">{'x' + shop.goodsNum}</div>
                            </div>
                            <div className="shop_money">{'￥' + parseInt(shop.goodsPrice)}</div>
                        </div>
                    </div>
                </li>);
            })
        );
    }

    getChildrenItem(orders) {
        return (
            orders.map((order, index) => {
                return (
                    <ul key={index}>
                        <div className="childOrderItemParent">
                            <div className="childOrderItemLeft">
                                <span>{"订单号：" + order.orderNo}</span>
                            </div>
                            <div className="childOrderItemRight">
                                <span style={{color: "#007AED"}}>{this.getType(order.status)}</span>
                            </div>
                        </div>
                        <div className="orderToShop">
                            <div className="line"/>
                        </div>
                        {this.getItem(order.goods)}
                        {<div>
                            <div className="orderToShop">
                                <div className="line"/>
                            </div>
                            <div className="orderDetailShopButtonParent">
                                <button style={{background: "rgba(0,122,237,0.10)"}}>
                                    <span style={{color: "#007AED"}}>申请退款</span>
                                </button>
                                <button style={{background: "rgba(0,122,237,0.10)"}}>
                                    <span style={{color: "#007AED"}}>售后详情</span>
                                </button>
                                <button style={{background: "rgba(0,122,237,0.10)"}}>
                                    <span style={{color: "#007AED"}}>查看物流</span>
                                </button>
                                <button style={{background: "#007AED"}}>
                                    <span style={{color: "#FFFFFF"}}>确认收货</span>
                                </button>
                            </div>
                        </div>}

                        <div className="orderToOrder">
                        </div>
                    </ul>
                );
            })
        );

    }

    render() {
        
        if (this.state.data !== null) {
            return (
                <ul className="shop_list">
                    {this.getChildrenItem(this.props.data.orderSonList)}
                </ul>);
        } else {
            return (
                <div/>);
        }
    }
}

export default OrderItem;
