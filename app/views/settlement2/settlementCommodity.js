/**
 * Created by chenmao on 2017/7/8.
 */
import React,{Component} from 'react';
import './settlement.less';

export default class SCommodity2 extends Component {
    render() {
        const {goodInfo}=this.props;
        return (
            <div className="SCommodityBody">
                {/* <div className="SCommodity"> */}
                    <img className="SCommodityImg" src={goodInfo.zoomUrl}/>
                    <div className="SCParameter">
                        <div className="SCName">
                            <p>{decodeURI(goodInfo.goodNam)}</p>
                        {/* </div> */}
                        <div className="SCSize">
                            <label className="SCType">
                                {decodeURI(goodInfo.goodSpecification)}
                            </label>
                        </div>
                        {goodInfo.backGoods==1?<div className="SCtui">7天退货</div>:null}
                    </div>
                    {/* <div className="SCCount">
                        <span className="SCQuantity">共{goodInfo.number}件</span>
                    </div> */}
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