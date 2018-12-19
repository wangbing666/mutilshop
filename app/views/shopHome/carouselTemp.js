/**
 * Created by yusuyun on 2018/8/7.
 */
import React,{Component} from 'react';
import { Carousel } from 'antd-mobile';
import './shopHome.less';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
// 引入此路径，才不会打包失败
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import { util } from 'protobufjs';

export default class CarouselTemp extends Component {
    componentWillUnmount() {
        if( this.bannerType == 1){
            if (this.swiper) { // 销毁swiper
                this.swiper.destroy()
               }
        }
       }
    
    componentDidMount(){
        this.swiper = new Swiper(this.refs.lun, {
            //loop:true,
            slidesPerView :'auto',
            grabCursor : true,
            spaceBetween : 20,
            slidesOffsetBefore : 30,
            setWrapperSize :false,
          });
      }
    render() { 
      //  if(!contants.ornameInfo[0]) return;
       // let ornameInfo = this.props.bannerOrname;
        let bannerInfo = this.props.bannerOrname;
        let banners= bannerInfo.pictureList;
        let bannerType = bannerInfo.bannareStyle;
        this.bannerType = bannerInfo.bannareStyle;
        let distance = 0;
        if(bannerInfo.distance){
            distance = parseInt(bannerInfo.distance)/75+"rem";
        }
       // bannerType = 1;
       // console.log("666",bannerInfo);
        if(banners==null||banners.length===0){
            return null;
        }else if(banners.length===1){
            if(banners[0].zoomUrl){
            return(
                <div className="carouseContainer" style={{marginTop:distance}}>
                    <div className="carousel">
                        {banners.map((val,index)=> {
                            return (
                                <img key={index} src={val.zoomUrl} onClick={()=>{this.bannerExternalJump(val.urlLink,val.urlLinkType)}}/>
                            )
                        })}
                    </div>
                </div>
            )
        }else{
            return null;
        }
        }else {
            if(bannerType === 0){
                    return(
                        <div className="carouseContainer" style={{marginTop:distance}}>
                            <Carousel
                            autoplay={true}
                            infinite={true}
                            selectedIndex={0}
                            swipeSpeed={bannerInfo.interval ? bannerInfo.interval:35}
                            dotStyle={{width:'0.16rem',height:'0.16rem',borderRadius:'50%',background:'#B6B6B8',border:'none'}}
                            dotActiveStyle={{width:'0.254rem',height:'0.16rem',background:'#1E1E1E',borderRadius: '1.334rem',border:'none'}}
                            >
                            {banners.map((val,index)=>{
                                return(
                                    <img key={index} src={val.fileUrl} onClick={()=>{this.bannerExternalJump(val.urlLink,val.urlLinkType)}}/>
                                )
                            })}
                        </Carousel>
                        </div>
                    )
                
            // }else if(bannerType === 2){
            //     return (
            //         <div className="carouseContainer" style={{marginTop:bannerInfo.distance}}>
            //                 <Carousel className="space-carousel"
            //                     frameOverflow="visible"
            //                     cellSpacing={18}
            //                     slideWidth="610px"
            //                     selectedIndex={0}
            //                     infinite={false}
            //                     dots={false}
            //                     style={{ marginLeft:'0px',padding:'0px',background:'none',transform: 'translate3d(0px, 0px, 0px)'}}
            //                     beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            //                     // afterChange={index => this.setState({ slideIndex: index })}
            //                 >
            //                     {banners.map((val, index) => (
            //                     <a
            //                         key={index}
            //                         style={{
            //                         display: 'block',
            //                         position: 'relative',
            //                         width: "600px",
            //                         left: "-60px",
            //                          height:"350px"
            //                         }}
            //                     >
            //                         <img
            //                         src={val.zoomUrl}
            //                         alt={val.title}
            //                         style={{ width: "600px",height:"350px", verticalAlign: 'top',borderRadius:"18px" }}
            //                         //  style={{ width: val.pictureWidth,height:val.pictureLenth, verticalAlign: 'top',borderRadius:'18px' }}
            //                         />
            //                     </a>
            //                     ))}
            //                 </Carousel>
            //         </div>
            //       );
             }else{
                return  <div className="carouseContainer" style={{marginTop:distance}}>
                            <div className='swiper-container' ref="lun">
                                    <div className="swiper-wrapper">
                                        {
                                            banners.map((item,index)=>{   // this.state.bag是在state里面定义的数组为了循环数据
                                                return(                                    
                                                    <div key={index} className="swiper-slide" style={{width:item.pictureWidth}}>
                                                        {/* <img src={item.zoomUrl} style={{width:item.pictureWidth}}></img> */}
                                                        <img src={item.fileUrl} onClick={()=>{this.bannerExternalJump(item.urlLink,item.urlLinkType)}}/>
                                                    </div>
                                                )
                                            })
                                        }
                                </div>
                            </div>
                    </div>
            }
        }
    };

    bannerExternalJump(routerStr,linkeType){
        const {ShopHomeActions}=this.props;
        if(linkeType == 0){ // 微页面
            //let url = "/cloudPage/queryPageLayoutById?pageId="+routerStr;
           // ShopHomeActions.getPageLayoutById(url);
            let url = contants.multishopUrl+"/weiPage/?pageId="+routerStr;
            Util.goToPageForApp(url,false);
           
         }else if(linkeType == 1 || linkeType==4 || linkeType==5){ //进去商品详情
            let linkArr = [];
            if(routerStr.indexOf(",") > -1){
                linkArr = routerStr.split(",");
                 let shopId=linkArr[0];
                 let productId = linkArr[1];
                 let goodDetailUrl = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
                 Util.goodsViewNum(productId,goodDetailUrl,false);
            }
        }else if(linkeType == 2){
            let linkArr = [];
          if(routerStr.indexOf(",") > -1){
            linkArr = routerStr.split(",");
             let shopType=linkArr[0];
             let shopId = linkArr[1];
             let shopDetailUrl ="";
             if(shopType == 1){
                shopDetailUrl = contants.multishopUrl+`/retailPage/?shopId=${shopId}`;
             }else{
                shopDetailUrl = contants.multishopUrl+`/shopDetail/?shopId=${shopId}`;
             }
           Util.goToPageForApp(shopDetailUrl,false);
        }
        }else if(linkeType == 7){ //购物车
            let url = contants.multishopUrl+'/PPShoppingCart';
            Util.goToPageForApp(url,false);
        }else if(linkeType == 8){ //个人中心
            let url = contants.multishopUrl+'/orderHome';
            Util.goToPageForApp(url,false);
        }else if(linkeType == 3){//自定义链接
            //window.location = routerStr;
            Util.goToPageForApp(routerStr,false);
        }  

        // if(contants.shopPreView!=1) {
        //     if(val.linkUrl===""&&val.activityId===0){

        //     }else if(val.urlLink!==""){ //跳转外部链接
        //         window.location=val.urlLink;
        //     // }else{ // 跳转店铺活动
        //     //     const {history}=this.props;
        //     //     let url=contants.commonUrl+'/shopActivity'+'/?shopId='+this.theRequest['shopId']+'&activityId='+val.activityId
        //     //     history.push({
        //     //         pathname:url
        //     //     });
        //     }
        // }
    };
}