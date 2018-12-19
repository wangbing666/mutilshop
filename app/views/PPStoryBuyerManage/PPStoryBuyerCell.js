/**
 * Created by nipeng on 2017/11/23.
 * 故事列表cell
 */

import React,{Component} from 'react';
import './PPStoryBuyerCell.less';
import '../../../common/styles/common.less'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import {wxShare} from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg'



export default class PPStoryBuyerCell extends Component{

    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount() {

        console.log(this.props.data)

    }


    render(){

        /*
         * storyImg =>第一张大图
         * themeStyleP =>主题
         * lookTitle=>浏览量 评论数 喜欢数
         * */
        return(
            <div className="containerq">
                <div className="whitediv">
                    <div className="storyImageStyle">
                        <img className="storyImg" src={this.props.data.hostUrl+this.props.data.fileUrl}/>
                    </div>
                    <div className="titleStyle">
                        <p className="ellips themeStyleP">{this.props.data.title}</p>

                        <div className="iconStyle">
                            <div className="lookdiv">
                                <img className="looksImg" src={require('../../images/storyPage/look.png')}/>
                                <p className="ellips lookTitle">{this.props.data.readNumber}</p>
                            </div>
                            <div className="lookdiv">
                                <img className="commentImg" src={require('../../images/storyPage/comment.png')}/>
                                <p className="ellips lookTitle">{this.props.data.commentNumber}</p>
                            </div>
                            <div className="lookdiv">
                                {
                                    this.props.data.islike===0?<img className="loveImg" src={require('../../images/storyPage/love2.png')}/>:<img className="loveImgs" src={require('../../images/storyPage/liebiaoLove.png')}/>
                                }
                                <p className="ellips lookTitle">{this.props.data.likeNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}







