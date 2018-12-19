/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import './commodityType.less';
import * as contants from '../../../common/Apis/constants';//全局配置信息

export default class HatListGoods extends Component {
    render() {
        let hatData=this.props.hatData;
        //console.log(hatData);
        let goodName=hatData.goodsName?hatData.goodsName.substring(0,8):'';
        return (
            <div className="HatListBody" onClick={()=>this.goDetails(hatData.goodsId)}>
                <div className="hatImgBody">
                    {hatData.status===2?<img className="soldOutImg" />:null}
                    <img className="hatImg" src={hatData.hostUrl+hatData.fileUrl}/>
                </div>
                <div className="hatAttribute">
                    <div className="hatName">{goodName}</div>
                    <div className="hatUnitPrice">￥{hatData.price}</div>
                </div>
            </div>
        )
    }
    goDetails(goodsId){
        //console.log(goodsId);
        const {history}=this.props;
        history.push({
            pathname:contants.commonUrl+'/goodDetails',
            state:{
                goodsId:goodsId
            }
        });
    }
}