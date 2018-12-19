/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：热门推荐组件
 */
import React from 'react';
import  '../aftersales/popular_recommendation.less';
import {post,get} from '../../../common/Apis/Fetch.js';
import HatListGoods from "../homePage/HatThree";
import LazyLoad from 'react-lazyload';
import Suggestion from '../../../common/components/suggestion';

export default class popularRecommendation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }

    componentDidMount() {

        // let data={
        //     shopId:this.props.shopId
        // }
        // post('/goods/getLikeGoods',data, (data) => {
        //     if (data.status === 0) {
        //         //this.state.data = data.body.goodsResponses;
        //         this.setState({data:data.body.goodsResponses});
        //         //this.forceUpdate();
        //     }
        // }, (err) => {
        //     console.log("出错了")
        // })
        get('/goods/getLikeGoods', (data) => {
            if (data.status === 0) {
                //this.state.data = data.body.goodsResponses;
                this.setState({data:data.body.likeGoods});
                //this.forceUpdate();
            }
            
        }, (err) => {
            console.log("出错了")
        })
    }

    render() {
        return (
            <div className="popularMerchandise">
                {/* <div className="pMhead">
                    <div className="Rlift" />
                    <span>猜你喜欢</span>
                    <div className="RRight" />
                </div> */}
                {/*<div className="pMhead">*/}
                    {/*/!*<div className="Rlift" />*!/*/}
                    {/*<span>精品推荐</span>*/}
                    {/*<p  className="recommentedStyle">Products recommended</p>*/}
                {/*</div>*/}
                {/* <div className="hatListTowThree" style={{backgroundColor:'white'}}>
                    {this.state.data.map((val,index) => {
                        return (
                            <HatListGoods key={index} hatData={val} {...this.props} shopId={this.props.shopId}/>
                        )
                    })
                    }
                </div> */}
                <div className="suggestion-title">猜你喜欢</div>
                <Suggestion list={this.state.data} {...this.props} shopId={this.props.shopId}/>
                <div className="listViewFoot">
                    <img className="imgLeft" />
                    <span>没有更多内容了</span>
                    <img className="imgRight" />
                </div>
            </div>
        )
    }
}