/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import { Carousel } from 'antd-mobile';
import './homePage.less';
import * as contants from '../../common/Apis/constants'

export default class CarouselFigure extends Component {
    render() {
        let banners=this.props.banners;
        //console.log("轮11111播图",banners);
        if(banners==null||banners.length===0){
            return null;
        }else if(banners.length===1){
            return(
                <div className="carouselFigure">
                    <div className="carousel">
                        {banners.map((val,index)=> {
                            return (
                                <img key={index} src={val.hostUrl+val.bannerUrl} onClick={()=>{this.externalJump(val.isOutreach,val.outreachUrl,val.inGoodid)}}/>
                            )
                        })}
                    </div>
                </div>
            )
        }else {
            return (
                <div className="carouselFigure">
                    <Carousel
                        className="carousel"
                        autoplay={true}
                        infinite={true}
                        selectedIndex={1}
                        swipeSpeed={35}
                    >
                        {banners.map((val,index)=> {
                            return (
                                <img key={index} src={val.hostUrl+val.bannerUrl} onClick={()=>{this.externalJump(val.isOutreach,val.outreachUrl,val.inGoodid)}}/>
                            )
                        })}
                    </Carousel>
                </div>
            )
        }
    };
    //isOutreach 1 外链 0 内链
    externalJump(isOutreach,outreachUrl,Goodid){
        if(isOutreach===1){
            window.open(outreachUrl);
        }else {
            const {router}=this.props;
            router.push({
                pathname:contants.commonUrl+'/goodDetails',
                state:{
                    goodsId:Goodid
                }
            });
        }
    };
}