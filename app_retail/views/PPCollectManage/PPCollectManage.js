/**
 * Created by nipeng on 2017/7/7.
 * 收藏view
 */

import React,{Component} from 'react';
import './PPCollectManage.less'
import '../../../common/styles/common.less'
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants';
import * as db from '../../../common/Apis/Utils';
import { Carousel,ActivityIndicator,Modal} from 'antd-mobile';
import {wxShare} from '../../../common/Apis/wxJsApis';
import * as Util from '../../../common/Apis/Utils';




export default class PPCollectManage extends Component {

    constructor(props){
        super(props);
        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)

        this.state={
            shopId:theRequest['shopId'],
        }
    }
    componentWillMount() {
        if(db.userAgent()==='Android'){
            document.title='我的收藏';
        }else{
            db.setPageTitle('我的收藏');
        }

    }
    componentDidMount(){
        wxShare([],{});


        const {PPCollectReducer,PPCollectAction} = this.props;

        let userInfo = db.readUserInfo();

        let urldata="/goods/getGoodsList";
        const bodyDate={
            userId:userInfo.userId,
            // shopId:this.state.shopId
        };
        PPCollectAction.getCollectPost(urldata,bodyDate,function (data) {

        },function (error) {

        })
    }

    render(){
        const {PPCollectReducer,PPCollectAction} = this.props;
        return(
            <div className="container">

                {PPCollectReducer.collectList.length===0?
                    <div className="whiteCollectStyle">
                        <img src={require('../../images/storyPage/dudua.png')}/>
                        <p>您暂时没有收藏商品</p>
                    </div>
                    :
                    <ul>
                        {
                            this.cellView()
                        }
                    </ul>
                }

                {PPCollectReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div> :null}

            </div>
        )
    }
//{require('../../images/goodDetails/b1.png')}{data.goodsZoomURL}
    cellView(){
        const {PPCollectReducer,PPCollectAction} = this.props;

        var that = this;
        return(

            PPCollectReducer.collectList.map(function(data,i) {
                return(
                    <li key={i} className="cellStyle" onClick={()=>{that.selectCell(data,i)}}>

                        <div className="headStyle">
                            <img src={data.goodsZoomURL}/>
                            {data.goodsStatus===0?<img className="loseImage" src={require('../../images/goodDetails/o6@1x.png')}/>:data.goodsStatus===1?<img className="loseImage" src={require('../../images/goodDetails/o2@1x.png')}/>:data.goodsStatus===2?<img className="loseImage" src={require('../../images/goodDetails/o1@1x.png')}/>:null}

                        </div>

                        <div className="rightContent">
                            <p className="ellips nameStyle">{data.goodsName}</p>
                            <p className="ellips priceStyle">￥{data.goodsPrice}</p>
                            <p className="ellips collectTime">收藏时间:{format(data.createTime,'yyyy-MM-dd HH:mm:ss')}</p>
                            <p className="ellips cargStyle">{data.goodsStatus===0?'已失效':data.goodsStatus===1?'已下架':data.goodsStatus===2?'已售罄':'有货'}</p>
                        </div>


                    </li>
                )

            })

        )

    }

    selectCell(data,i){//点击事件

        // 需要传用户id 店铺id 商品id
        const {history}=this.props;
        let url= contants.commonUrl+'/goodDetails'+'/?shopId='+this.state.shopId+'&goodsId='+data.goodsId
        history.push({
            pathname:url,//PPShoppingCart

        });



        // this.props.router.push({
        //     pathname:contants.commonUrl+'/goodDetails',
        //     state:{
        //         goodsId:data.goodsId
        //     }
        // });


    }


}



