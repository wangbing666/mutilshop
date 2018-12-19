/**
 * Created by XiaYongjie on 2017/7/10.
 *
 */

import React, {Component} from 'react';
import './myOrderDetail.less';
import OrderItem from "./orderItem";


function getType(type) {
    if (type == 1) {
        return '待付款';
    } else if (type == 2) {
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
    } else {
        return '未知订单类型';
    }
}

class DetailPublic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        }

    }

    render() {
        return (
            <div>
                <OrderItem goods={this.state.data.goods} type="1" {...this.props}/>
            </div>);
    }
}

export default DetailPublic;