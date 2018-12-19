/**
 * Created by nipeng on 2017/11/23.
 * 故事列表
 */

import React,{Component} from 'react';
import './PPStoryManage.less';
import '../../../common/styles/common.less';
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import SvgImg from '../../../common/svgImage/svgImg';
import PPStoryCell from './PPStoryCell';
import { Modal } from 'antd-mobile';
const alert = Modal.alert;
import * as Util from '../../../common/Apis/Utils';


export default class PPStoryManage extends Component{

    constructor(props){
        super(props);
        var localUrl = location.search;
        let theRequest = Util.getValueFromUrl(localUrl)
        this.state={
            pageSize:10,
            goodsId:theRequest['goodsId'],
            shopId:theRequest['shopId'],
            userId:theRequest['userId'],
        }
    }

    componentWillMount() {


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


            if (callBack){

            }

        })

    }


    componentDidMount() {
        
        var that = this;
        const {PPStoryAction,PPStoryReducer} = that.props;

        // alert(JSON.stringify(this.state.userId));

        // alert('23424543252523')

        let getDatas=function (data){
            let dicData = {
                pageSize:1000000,
                lastId:0,
                type:1,
                shopId:that.state.shopId,
                goodsId:that.state.goodsId,
                userId:that.state.userId,
            }

            PPStoryAction.getStoryListPost(dicData,(callBack)=>{
                if (callBack){

                }

            })
        }
        document.addEventListener("message", getDatas);

        this.getData()
    }


    render(){

        const {PPStoryAction,PPStoryReducer} = this.props;

        return(

            <div className="containery">
                {
                    PPStoryReducer.storyList.length===0?
                        <div className="whiteDiv">
                            <img src={require('../../images/storyPage/dudua.png')}/>
                            <div>
                                <p>对商品美好的故事由你记录</p>
                                <span onClick={()=>{this.pubulishAction()}}>去发布</span>
                            </div>

                        </div>
                        :<ul className="ulStyle">
                        {PPStoryReducer.storyList.map((val,index)=>{
                            return(
                                <li className="liStyle" key={index} onClick={()=>{this.selectDetailsAction(val)}}>
                                    <PPStoryCell className="storyCellStyle" data={val} {...this.props}/>
                                </li>
                            )
                        })}
                        <div className="nonamrlStyle">没有更多了</div>
                    </ul>

                }
                {PPStoryReducer.isShowLoading?<div className="loadingView">
                    <div className="loadingImg"></div>
                </div> :null}
            </div>
        )
    }

    pubulishAction(){
        // alert('发放是')

        let dic = {
            h5ToRn:true,
            type:2,
        }
        window.postMessage(JSON.stringify(dic))

    }


    selectDetailsAction(val){

        let dic = {
            h5ToRn:true,
            type:1,
            data:val
        }
        window.postMessage(JSON.stringify(dic))

    }










}





