/**
 * Created by XiaYongjie on 2017/7/6.
 *
 */
import React, { Component } from 'react';
import './orderDetail.less';
import * as contants from '../../../common/Apis/constants'
class OrderListEmpty extends Component{
    onClick() {
        const {history} = this.props;
       // console.log("------------",contants.commonUrl + '/?shopId='+this.props.shopId)
        history.push({
            pathname: contants.commonUrl + '/?shopId='+this.props.shopId,
        });
    }
    render(){
        let buttonStyle="submit_style_2";
        if(contants.commonUrl.indexOf("flagship")!=-1) {
            if (contants.viewStyDic.SHAPE === 1) {
                buttonStyle = "submit_style_1"
            } else if (contants.viewStyDic.SHAPE === 2) {
                buttonStyle = "submit_style_2"
            } else {
                buttonStyle = "submit_style_3"
            }
        }
        return( <div  style={{
            height: this.props.height,
            backgroundColor:'#F4F6FE'
        }}>
            <div className="order_empty_img_p">
            <img src={require('../../images/order/order_empty.png')} className="img"/>
            </div>
            <div className="no_order">暂无相关订单</div>
            <div className="order_alert_home">
                您还没有相关订单哦，去首页看看~
            </div>
            <div className="order_empty_img_p">
                <button className={buttonStyle} style={{background:contants.viewStyDic.COLOR1,color:contants.viewStyDic.COLOR3}} onClick={()=>{this.onClick()}} > 返回首页 </button>
            </div>
        </div>);
    }
}
export default OrderListEmpty;