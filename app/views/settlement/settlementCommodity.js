/**
 * Created by chenmao on 2017/7/8.
 */
import React,{Component} from 'react';
import './settlement.less';

export default class SCommodity extends Component {
    render() {
        const {goodInfo}=this.props;
        return (
            <div className="SCommodityBody">
                <img className="SCommodityImg" src={goodInfo.zoomUrl}/>
                <div className="SCParameter">
                    <div className="SCName">
                       <p>{goodInfo.goodNam}</p>
                       <div className="SCSize">
                       {
                           goodInfo.bodyType ? goodInfo.bodyType.map((item,index)=>{
                            return  item.type ? <span key={index}>{item.type}：{item.name}</span> : null
                       }):null
                    }
                     </div>
                     <div className="SCtui">7天退货</div>
                    </div>
                    <div className="priceModule">
                        <div className="SCPrice">
                            <icon>￥</icon><span>{goodInfo.price}</span>
                        </div>
                        <div className="SCCount">
                            <icon>X</icon><span>{goodInfo.number}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}