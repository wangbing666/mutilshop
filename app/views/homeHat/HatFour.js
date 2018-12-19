/**
 * Created by chengjiabing on 17/11/27.
 * 分销店首页头部
 */
import React,{Component} from 'react';
import './HatFour.less'
import * as contants from '../../../common/Apis/constants'
import LazyLoad from 'react-lazyload';

export default class  HatFour extends Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount() {

    }
    render(){
        let dic = this.props.homePageList;
        return(
            <div className="HatFour" onClick={()=>{this.clickToJumpIntoDetail(dic.goodsId)}}>
                <div className="imgContainer">
                    <LazyLoad>
                        <img src={dic.goodsImgList[0]} />
                    </LazyLoad>
                    {dic.stock===0?<img className="shouqing" src={require('../../images/goodDetails/o1@1xR.png')} />:null}
                </div>
                <div className="goodName">{dic.goodsName}</div>
                <div className="priceContainer">
                    {/*<div className="rmb">¥</div>*/}
                    <div className="price">￥{dic.groupPrice?dic.groupPrice:dic.price}</div>
                    {dic.activityType?<img src={require('../../../app/images/homePage/tuangou.png')}/>:null}
                </div>
            </div>
        )
    }

    clickToJumpIntoDetail(goodIs){
        if(contants.shopPreView!=1) {
            const {history}=this.props;
            let url = contants.commonUrl+'/goodDetails'+'/?shopId='+this.props.shopId+'&goodsId='+goodIs
            console.log(url)
            history.push({
                pathname:url,
                state:{
                }
            });
        }
    }

}