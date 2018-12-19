/**
 * Created by AndyWang on 2017/7/7.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'

export default class ViewMore extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            banners:this.props.banners,
            goodsGroup:this.props.goodsGroup
        }
    }
    render() {
        return (
            <div className="ViewMoreBody" onClick={()=>this.goDetails()}>
                <div className="viewMore">
                    <img  />
                    <div className="viewMoreText">查看全部单品</div>
                </div>
            </div>
        )
    }
    goDetails(){
        const {router}=this.props;
        window.sessionStorage.removeItem('listGoods');
        router.push({
            pathname:contants.commonUrl+'/listGoods',
            state:{
                banners:this.state.banners,
                goodsGroup:this.state.goodsGroup
            }
        });
    }
}