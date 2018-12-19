/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'

export default class HatList extends Component {
    render() {
        //console.log(this.props.hatData);
        let hatData=this.props.hatData;
        let goodName=hatData.goodsName?hatData.goodsName.substring(0,8):'';
        return (
            <div className="hatBody" onClick={()=>this.goDetails(hatData.goodsId)}>
                <div className="hatImgBody">
                    {hatData.status===2?<img className="soldOutImg" />:null}
                    <img className="hatImg" src={hatData.imgHostUrl+hatData.imgFileUrl}/>
                </div>
                <div className="hatAttribute">
                    <div className="hatName">{goodName}</div>
                    <div className="hatUnitPrice">￥{hatData.price}</div>
                </div>
            </div>
        )
    }
    goDetails(goodsId){
      //  console.log(goodsId);
        const {history}=this.props;
        console.log(this.props)
        console.log(goodsId)
        history.push({
            pathname:contants.commonUrl+'/goodDetails',
            state:{
                goodsId:goodsId
            }
        });
    }
}