/**
 * Created by chengjiabing on 17/11/27.
 * 分销店首页头部
 */
import React,{Component} from 'react';
import './HatTwo.less'
import * as contants from '../../../common/Apis/constants'
import LazyLoad from 'react-lazyload';
export default class  HatTwo extends Component{

    constructor(props){
        super(props);
        this.state={
        }
    }
    componentDidMount() {

    }
    render(){
        let dic = this.props.homePageList;
        console.log(dic.groupPrice)
        return(
            <div className="HatTwo" onClick={()=>{this.clickToJumpIntoDetail(dic.goodsId)}}>
                <div className="goodName">{dic.goodsName}</div>
                <div className="priceContainer">
                    {/*<div className="rmb">RMB:</div>*/}
                    <div className="price">￥{dic.groupPrice?dic.groupPrice:dic.price}</div>
                    {dic.activityType?<img src={require('../../../app/images/homePage/tuangou.png')}/>:null}
                </div>
                <div className="imgContainer">
                    {
                        dic.goodsImgList.slice(0,3).map((data,index)=>{
                            return(
                                <LazyLoad key={index}>
                                    <img key={index} src={data}/>
                                </LazyLoad>
                            )

                        })
                    }
                </div>
                <div className="line"></div>
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