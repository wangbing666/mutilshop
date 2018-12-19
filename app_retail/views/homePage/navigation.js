/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import {readUserInfo} from '../../../common/Apis/Utils';
import SvgImg from '../../../common/svgImage/svgImg'

export default class Navigation extends Component {
    constructor(props){
        super(props)
        {
            this.state={
            }
        }
    }

    componentDidMount() {
    }
    render() {
        return (
                <div className="Navigation" >
                    <div className="homeOrder"  onClick={()=>{this.goOrderHome()}} >
                        <img className="icon"  src={require('../../images/homePage/mine.png')}>
                        </img>
                    </div>
                    {/*调用原生方法onClick={()=>{this.TowGoSearch()}}*/}
                    {/* <div className="title" onClick={()=>{this.TowGoSearch()}} >
                        {this.props.shopName}
                    </div> */}
                    <div className="title" onClick={()=>{this.toShopBrief()}}>
                        {this.props.title.length>8?`${this.props.title.substr(0,8)}...`:this.props.title}
                    </div>
                    <div className="search" onClick={()=>{this.goSearch()}} >
                        <img className="icon" src={require('../../images/homePage/search.png')}>
                        </img>
                    </div>
                    <div className="shoppongCat" onClick={()=>{this.goShoppingCart()}} >
                        <img className="icon" src={require('../../images/homePage/shopCat.png')} >
                        </img>
                    </div>
                </div>
        )
    }
    toShopBrief(){ // 店铺介绍
        // const { history } = this.props;
        // history.push({
        //     pathname:contants.commonUrl+'/shopBrief'+'/?shopId='+this.props.shopId
        // });
        if(contants.shopPreView!=1) {
        let userInfo=readUserInfo();

        const { history } = this.props;
         if(userInfo===null){
                let url =contants.commonUrl+'/login'+'/?pathname=orderHome'+'&type='+4+'&shopId='+this.props.shopId
                history.push({
                    pathname:url,
                    type:4
                });
            }else {
            history.push({
                pathname:contants.commonUrl+'/shopBrief'+'/?shopId='+this.props.shopId
            });
        }
    }
    };
    //搜索页面
    goSearch(){
        if(contants.shopPreView!=1) {
            const {history}=this.props;
            let url=contants.commonUrl+'/search'+'/?shopId='+this.props.shopId
            history.push({
                pathname:url
            });
        }
    };
    //订单首页
    goOrderHome(){
        console.log("kkkk")
        if(contants.shopPreView!=1) {
            let userInfo=readUserInfo();
            const {history}=this.props;
            if(userInfo===null){
                let url =contants.commonUrl+'/login'+'/?pathname=orderHome'+'&type='+4+'&shopId='+this.props.shopId
                history.push({
                    pathname:url,
                    type:4
                });
            }else {
                history.push({
                    pathname:contants.commonUrl+'/orderHome'+'/?shopId='+this.props.shopId
                });
            }
        }
    };
    //购物袋
    goShoppingCart(){
        if(contants.shopPreView!=1) {
            console.log('按时发生');
            const {history}=this.props;
            history.push({
                pathname:contants.commonUrl+'/PPShoppingCart'+'/?shopId='+this.props.shopId
            });
        }
    };
}