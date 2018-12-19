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
                <div className="SCommodity">
                    <img className="SCommodityImg" src={goodInfo.zoomUrl}/>
                    <div className="SCParameter">
                        <div className="SCName">
                            <label>{goodInfo.goodNam}</label>
                        </div>
                        <div className="SCSize">
                            <label className="SCType">
                                {goodInfo.goodSpecification}
                            </label>

                        </div>
                    </div>
                    <div className="SCCount">
                        <span className="SCQuantity">共{goodInfo.number}件</span>
                    </div>
                </div>
            </div>
        )
    }
}