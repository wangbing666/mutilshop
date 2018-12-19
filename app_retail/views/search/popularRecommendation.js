/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：热门推荐组件
 */
import React from 'react';
import  '../aftersales/popular_recommendation.less';
import {post} from '../../../common/Apis/Fetch.js';
import HatListGoods from "../listGoods/hatListGoods";

export default class popularRecommendation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let data={
            shopId:this.props.shopId
        }


        post('/goods/hotRecommend',data, (data) => {
            if (data.status === 0) {
                console.log(data.body.goodsResponses);
                //this.state.data = data.body.goodsResponses;
                this.setState({data:data.body.goodsResponses});
                //this.forceUpdate();
            }
        }, (err) => {
            console.log("出错了")
        })
    }

    render() {
        console.log(this.state.data);
        return (
            <div className="popularMerchandise">
                <div className="pMhead">
                    <div className="Rlift" />
                    <span>猜你喜欢</span>
                    <div className="RRight" />
                </div>

                <div className="PMbody">
                    {this.state.data.map((val,index) => {
                        return (
                            <HatListGoods key={index} hatData={val} {...this.props} shopId={this.props.shopId}/>
                        )
                    })
                    }
                </div>
                <div className="listViewFoot">
                    <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                    <span>没有更多内容了</span>
                    <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
                </div>
            </div>
        )
    }
}