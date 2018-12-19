/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */

import React, {Component} from 'react';
import './orderDetail.less';
import OrderItem from "./orderItem";
import SvgImg from "../../../common/svgImage/svgImg";
import * as contants from '../../../common/Apis/constants'


function getType(type) {
    if (type == 1) {
        return '待付款';
    } else if (type ==2) {
        return '待发货';
    } else if (type == 3) {
        return '已发货';
    } else if (type == 5) {
        return '退款中';
    } else if (type == 7) {
        return '退款中';
    } else if (type == 6) {
        return '退款中';
    } else if (type == 4) {
        return '已完成';
    } else if (type == 8) {
        return '已取消';
    } else if (type == 10){
        return '已完成';
    } else {
        return '未知订单类型';
    }
}

class DetailPublic extends Component {
    constructor(props) {
        super(props);
        this.state={
        }

    }
    getTopStatus(Data){
        // .groupStatus
        if(Data.orderType == 2){

            if(Data.groupStatus == 0 ){
                return "组团成功"
            }else if(Data.groupStatus == 1 || (Data.groupStatus === null && Data.status == 8) ){
                return "组团失败"
            }else if(Data.groupStatus == 2){
                return "等待成团"
            }else{
                return ""
            }
        }
    }
    render() {
        return (
            <div>
                <div className="order_detail_number_pp">
                    <div className="detail_number">{'下单时间: ' + this.props.data.createTime}</div>
                    <div className="childOrderItemRight">
                        <span style={{color: contants.viewStyDic.COLOR1}}>{this.getTopStatus(this.props.data)}</span>
                    </div>
                </div>
                
                <div className="detail_order_item_line"/>
                <div className="order_detail_number_pp border-btm">
                    <span className="order_detail_receive_1">收货信息</span>
                </div>
                <div className="detail_address">
                    <div className="address_people_msg">
                        <div className="people_name">
                            {/* <img src={require('../../images/order/order_people_name.png')}
                                 className="people_msg_img_1"/> */}
                            {this.props.data.receiverName&&<span className="address_msg">  { this.props.data.receiverName.length > 10 ? this.props.data.receiverName.substring(0, 10) + "..." : this.props.data.receiverName}</span>}
                        </div>
                        <div className="people_phone">
                            {/* <img src={require('../../images/order/order_people_phone.png')}
                                 className="people_msg_img_2"/> */}
                            <span className="address_msg">{this.props.data.receiverMobile}</span>
                        </div>
                    </div>
                    <div className="address_msg_p">
                        <span className="address_msg">
                            {this.props.data.address}
                        </span>
                    </div>
                    <img src={require('../../images/order/addr_line.png')} className="addr-line" />
                </div>
                {/* <div className="detail_order_item_line"/> */}
                <div className="order_detail_receive_2">
                    <div className="detail-wrap">
                        商品信息
                        {
                            this.props.data.needCs === 1?
                            <div className="contact-icon" onClick={this.props.contactService}>
                          
                                <SvgImg xlinkHref="#wedo-wedoicon-24" style={{fill:'#FF931E'}} />
                            </div>
                            :null
                        }
                    </div>
                </div>
                <OrderItem data={this.props.data} type="1" {...this.props} shopId={this.props.shopId} createTime={this.props.createTime}/>
                <div className="shop_list_1"/>
            </div>);
    }
}

export default DetailPublic;