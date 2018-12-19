/**
 * Created by nipeng on 2017/11/23.
 * 故事列表
 */

import React,{Component} from 'react';
import './PPStoryBuyerManage.less';
import '../../../common/styles/common.less';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg';
import PPStoryCell from './PPStoryBuyerCell';
import { Modal } from 'antd-mobile';
const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';


export default class PPStoryBuyerManage extends Component{

    constructor(props){
        super(props);
        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)

        let userInfo = Util.readUserInfo();

        this.state={
            goodsId:theRequest['goodsId'],
            shopId:theRequest['shopId'],
            userId:userInfo!==null?userInfo.wedoId:0,
        }
    }

    componentWillMount() {

        if(db.userAgent()==='Android'){
            document.title='商品故事列表';
        }else{
            db.setPageTitle('商品故事列表');
        }

    }

    getData(){

        const {PPStoryAction,PPStoryReducer} = this.props;

        let dicData = {
            pageSize:1000000,
            lastId:0,
            type:1,
            shopId:this.state.shopId,
            goodsId:this.state.goodsId,
            userId:this.state.userId,
        }

        PPStoryAction.getStoryListPost(dicData,(callBack)=>{

        })

    }


    componentDidMount() {

        wxShare([],{});
        this.getData()
    }


    render(){

        const {PPStoryAction,PPStoryReducer} = this.props;

        return(

            <div className="containery">
                {
                    PPStoryReducer.storyList.length === 0 ?
                        <div className="whiteDiv">
                            <img src={require('../../images/storyPage/dudua.png')}/>
                            <p>商品暂且没有故事描述</p>

                        </div> :
                        <ul className="ulStyle">
                            {PPStoryReducer.storyList.map((val, index) => {
                                return (
                                    <li className="liStyle" key={index} onClick={() => {
                                        this.selectDetailsAction(val)
                                    }}>
                                        <PPStoryCell className="storyCellStyle" data={val} {...this.props}/>
                                    </li>
                                )
                            })}
                            <div className="nonamrlStyle">没有更多了</div>
                        </ul>
                }

                {PPStoryReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div>:null}


            </div>
        )
    }


    selectDetailsAction(val){

        console.log(val)



        const {history}=this.props;
        let url = contants.commonUrl+'/storyDetailsBuyerManages'+'/?shopId='+this.state.shopId+'&storyId='+val.storyId+'&userId='+this.state.userId;
        history.push({
            pathname:url,

        });

    }



}





