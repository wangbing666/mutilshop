/**
 * Created by XiaYongjie on 2017/7/6.
 *
 */
import React, { Component } from 'react';
import './orderDetail.less';
class OrderListEmpty extends Component{
    render(){
        return( <div  style={{
            height: this.props.height,
            backgroundColor:'#FFFFFF'
        }}>
            <div className="order_empty_img_p">
            <img src={require('../../images/order/order_empty.png')} className="img"/>
            </div>
            <div className="no_order">暂无相关订单</div>
        </div>);
    }
}
export default OrderListEmpty;