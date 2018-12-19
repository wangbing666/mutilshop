/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */
import React, {Component} from "react"
import './orderDetail.less'
import * as db from "../../../common/Apis/Utils";
import * as contants from '../../../common/Apis/constants'
import {Modal} from 'antd-mobile';
const alert = Modal.alert;

class OrderItem extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.click = true;
        // console.log('shops', this.state.data)
    }

    getType(type,alldata) {
        if(alldata.orderType ==2 && alldata.groupStatus == 2){//2团购订单
                return "等待成团"   
        } else {
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
                return '已取消';
            } else if (type == 7) {
                return '待成团';
            } else if (type == 8) {
                return '已关闭';
            }else {
                return '未知订单类型';
            }
        }
      
    }

    onItemClick(shop) {
        //if (this.props.type == 1) { //先注释掉吧，感觉没啥用，不知道什么意思
            this.props.history.push({
                pathname: contants.commonUrl + '/goodDetails' + "/?shopId=" + this.props.shopId + "&goodsId=" + shop.goodsId,
            });
       // }
    }

    onClick(index, order) {
        const {OrderTab, OrderListAction, history,location} = this.props;
       // console.log("order",order);
        // let userID = db.readUserInfo()['wedoId'];
        let userID = db.readUserInfo()['userId'];
        let count = 0;
        for (let i = 0; i < order.goods.length; i++) {
            count = count + order.goods[i].goodsNum
        }
        let strs=[];// url 参数数组
        const localUrl = location.search; //获取url中"?"符后的字串
        let theRequest = new Object();
        // if(localUrl.indexOf("?") != -1) {
        //     var str = localUrl.substr(1);
        //     strs = str.split("&");
        //     for (var i = 0; i < strs.length; i++) {
        //         theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        //     }
        // }
        theRequest = db.getValueFromUrl();
        switch (index) {
            case 1: //申请售后
                OrderListAction.isCanReFunds(userID,theRequest.orderId,order.status,order.orderId,(data) => {
                   /* if(order.status === 4) { //已完成订单
                        return history.push({
                            pathname: contants.commonUrl + '/applyService' + "/?returnMoney=" + order.payAmount +
                            "&orderNum=" + order.orderNo + "&orderTime=" + this.props.createTime + "&type=" + order.status + "&orderId=" + order.orderId + "&shopId=" + this.props.shopId,
                        });
                    }*/
                   // console.log("111111111",data);
                    let money = 0;
                    if (data.returnMoney != null) {
                        money = (order.payAmount - parseFloat(data.returnMoney)).toFixed(2)

                    } else {
                        money = order.payAmount
                    }
                    let createTime = new Date(this.props.createTime.replace('-', '/').replace('-', '/')).getTime();
                    history.push({
                        pathname: contants.commonUrl + '/applyService' + "/?returnMoney=" + money +
                        "&orderNum=" + order.orderNo + "&orderTime=" + this.props.createTime + "&type=" + data.status + "&orderId=" + order.orderId + "&shopId=" + this.props.shopId,
                    });
                }, () => {
                    //失败回调
                });
                break;
            case 2:
                //查看售后
                this.goRefundsDetail(order);
                break;

            case 4:
                //确认收货
                if(this.click){
                    this.click =false
                    // console.log("console",this.click)
                    this.alertInstance = alert('确定确认收货?', '', [
                        {text: '取消', onPress: () => {
                            this.click =true;
                            }, style: {color: '#9B885F'}
                        },
                        {
                            text: '确定', onPress: () => {
                           
                                OrderListAction.makeSureReceptPost(order.orderId, userID, OrderTab.toBeReceivedList, OrderTab.completedList, OrderTab.allList, OrderTab.orderDetail, () => {
                                    this.click =true;
                                },()=>{
                                    this.click =true;
                                })
                            }, style: {color: '#9B885F'}
                        },
                    ]);
                    //跳到已完成
                }
                break;
            case 5:
                //再次购买，跳转到购物车
                let goods = this.getGoods(order.goods);
                if (goods.length > 0) {
                    OrderListAction.buyAgainWithOrder(userID, goods, this.props.shopId, () => { //10000 用户id
                       // this.props.onBack(false);
                        history.push({
                            pathname: contants.commonUrl + '/PPShoppingCart' + "/?shopId=" + this.props.shopId + "&userId=" + userID
                        });
                    })
                } else {
                    this.alertInstance = alert('', '订单中的商品还未上架，不能购买', [
                        {
                            text: '确定', onPress: () => {
                            }, style: {color: '#9B885F'}
                        },
                    ]);
                }

                break;
            case 6:
                 //删除订单
                this.alertInstance = alert('', '确定删除该订单?', [
                    {text: '取消', onPress: () => console.log('cancel'), style: {color: '#9B885F'}},
                    {
                        text: '确定', onPress: () => {
                           // OrderListAction.deleteOrCancelOrderPost(rowData.orderId,rowIndex,1, userID, completedList, allAry);//传相应的数组
                            OrderListAction.deleteOrCancelOrderPost(OrderTab.orderDetail.orderId,-1,1, userID, OrderTab.completedList, OrderTab.allList, () => {
                                history.goBack();
                            });//传相应的数组
                        }, style: {color: '#9B885F'}
                    },
                ]);
                break;
        }
    }


    getGoods(goods) {
        let newGoods = [];
        if (goods instanceof Array) {
            for (let i = 0; i < goods.length; i++) {
                if (goods[i].goodStatus === 1) { //上架中
                    newGoods.push(goods[i])
                }
            }
        }
        return newGoods;
    }

    goTo_groupBuy_detail(order,alldata){
      
        const {history} = this.props;
        
        history.push({
            // pathname: contants.commonUrl + '/groupShoppingDetail' + '/?shopId=' + this.state.shopId + '&orderId=' + this.state.orderId + '&orderSonId=' + this.state.orderSonId
            pathname: contants.commonUrl + '/groupShoppingDetail' + '/?shopId=' + this.props.shopId + '&orderId=' + alldata.orderId + '&orderSonId=' + order.orderId
        })
    }
    getDes(specifications) {

        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                if(specifications[i].type){
                    des = des + specifications[i].type + ':' + specifications[i].name + "  ";
                }
                
            }
            return des;
        }
    }

    //查看售后详情
    goRefundsDetail(order) {
        // console.log(order)
        //查看售后
        let count = 0;
        for (let i = 0; i < order.goods.length; i++) {
            count = count + order.goods[i].goodsNum
        }
        const {OrderListAction, history, OrderTab} = this.props;
        // let userID = db.readUserInfo()['wedoId'];
        //contants.commonUrl+'/refundProgress'+"/?orderId="+rowData.orderId+"&orderNum="+rowData.saleOrderNo+"&createTime="+format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')+"&saleType="+rowData.afterSaleType
        if (order.status == 5 || order.status == 6) {
            history.push({
                pathname: contants.commonUrl + '/refundProgress' + "/?orderId=" + order.orderId + "&orderNum=" + count + "&createTime=" + this.props.createTime+"&saleType="+order.saleType,
                state: {
                    orderId: order.orderId,
                    orderNum: count,
                    createTime: this.props.createTime,
                    // orderNo: 20180711101366991,//TODO
                }
            });
        } else {
            history.push({
                pathname: contants.commonUrl + '/refundsDetailList' + "/?orderId=" + order.orderId + "&orderNum=" + count + "&createTime=" + this.props.createTime,
                state: {
                    orderId: order.orderId,
                    orderNum: count,
                    createTime: this.props.createTime,
                }
            });
        }
    };


    getItem(dates,imgAlldata) {
        if (dates instanceof Array) {
            return (
                dates.map((shop, index) => {
                    return (<li className="shop_li detail-li" key={index} onClick={() => {
                        this.onItemClick(shop)
                    }}>
                        <div className={index === dates.length - 1 ? "shop_item_2" : "shop_item"}>
                            <div className="shop_icon_p">
                                {shop.goodStatus === 0 &&
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
                                </div>
                                <div style={{display:"flex",justifyContent:"left",alignItem:"center"}}>
                                    {imgAlldata.orderType == 2 &&
                                        <div><span className="tuanGouIcon2">团</span></div>
                                    }
                                    {shop.backGoods === 1 ? <div className="tag-p">7天退换</div> : null}
                                </div>
                              
                                <div className="shop_money"><span>￥</span>{shop.goodsPrice}<div className="shop_count">{'x' + shop.goodsNum}</div></div>
                            </div>
                        </div>
                    </li>);
                })
            );
        } else {
            return (<div/>)
        }
    }
    // 新加入订单详情中子订单下的“删除订单”和“再次购买”按钮
    getOrderSonType(orders) {
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
        console.log("lalalalla")
    }


    getChildrenItem(orders,buttonStyle,alldata) {
        let shouldNum = this.getOrderSonType(orders);

        if (orders instanceof Array) {
            return (
                orders.map((order, index) => {
                    return (
                        <ul key={index}>
                            <div className="childOrderItemParent">
                                <div className="childOrderItemLeft">
                                    <span>{"订单号：" + order.orderNo}</span>
                                </div>
                                <div className="childOrderItemRight">
                                    <span
                                        style={{color: contants.viewStyDic.COLOR1}}>{this.getType(order.status,alldata)}</span>
                                </div>
                            </div>
                            <div className="orderToShop">
                                <div className="line"/>
                            </div>
                            {this.getItem(order.goods,alldata)}
                            {(order.status == 2 || order.status == 3 || order.status == 4 || order.status == 5 || order.status == 6 || order.status == 7|| order.status == 10|| order.status == 8) &&
                            <div>
                                <div className="orderToShop">
                                    <div className="line"/>
                                </div>
                                <div className="orderDetailShopButtonParent">
                                    {(order.status == 2 || order.status == 3 || order.status == 4) && ((alldata.orderType == 1 && alldata.groupStatus==null) || (alldata.orderType == 2 && alldata.groupStatus == 0)) &&
                                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR2}} onClick={() => {
                                        this.onClick(1, order)
                                    }}>
                                        <span style={{color: contants.viewStyDic.COLOR1}}>申请售后</span>
                                    </button>
                                    }
                                    {(order.status == 5 || order.status == 6 || order.status == 7) &&
                                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR2}} onClick={() => {
                                        this.onClick(2, order)
                                    }}>
                                        <span style={{color: contants.viewStyDic.COLOR1}}>查看售后</span>
                                    </button>
                                    }
                                    {(order.status == 2 || order.status == 5 || order.status == 8) && (alldata.groupStatus == 2 || alldata.groupStatus == 0) &&
                                        <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR2}} onClick={() => {
                                            this.goTo_groupBuy_detail(order,alldata)
                                            }}>
                                            <span style={{color: contants.viewStyDic.COLOR1}}>拼团详情</span>
                                        </button>
                                    } 
                           
                                    {(order.status == 3 || order.status == 6) &&
                                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR1}} onClick={() => {
                                        this.onClick(4, order)
                                    }}>
                                        <span style={{color: contants.viewStyDic.COLOR3}}>确认收货</span>
                                    </button>
                                    }
                                   
                                    { ((order.status == 4 && alldata.groupStatus == 0) || ( order.status == 8 && alldata.groupStatus === 1) || (alldata.orderType == 1 && (order.status == 8 || order.status == 4)))  &&
                                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR1}} onClick={() => {
                                        this.onClick(5, order)
                                    }}>
                                        <span style={{color: contants.viewStyDic.COLOR3}}>再次购买</span>
                                    </button>
                                    }
                                    
                                    { (order.status == 8 && alldata.orderType == 2) && (alldata.groupStatus === null || alldata.groupStatus == 1) &&
                                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR1}} onClick={() => {
                                        this.onClick(6, order)
                                    }}>
                                        <span style={{color: contants.viewStyDic.COLOR3}}>删除订单</span>
                                    </button>
                                    }

                                </div>
                            </div>}
                            
                            {/*<div className="orderToOrder">*/}
                            {/*</div>*/}
                        </ul>
                    );
                })
            );
        } else {
            return (<div/>);
        }


    }

    render() {

        let buttonStyle="button_style_1";
        if(contants.commonUrl.indexOf("flagship")!=-1) {
            if (contants.viewStyDic.SHAPE === 1) {
                buttonStyle = "button_style_1"
            } else if (contants.viewStyDic.SHAPE === 2) {
                buttonStyle = "button_style_2"
            } else {
                buttonStyle = "button_style_3"
            }
        }
        if (this.state.data !== null) {
            return (
                <ul className="shop_list">
                    {this.getChildrenItem(this.props.data.orderSonList,buttonStyle,this.props.data)}
                </ul>);
        } else {
            return (
                <div/>);
        }
    }
}

export default OrderItem;
