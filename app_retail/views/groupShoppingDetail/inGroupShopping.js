/**
 * Created by fantiantian on 2017/11/20.
 * 拼团占坑模块
 */

import React, {Component} from 'react';
import './groupShoppingDetail.less';
import * as contants from '../../../common/Apis/constants'

export default class InGroupShopping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expiredTime: '',  //剩余时间
            timer: null
        }
    }

    componentDidMount() {
        let timeLeave = this.props.remainingSecond;
        this.setState({expiredTime: this.formatSeconds(timeLeave)});
        //有时间限制开启定时器
        if (timeLeave != 0) {
            this.state.timer = setInterval(() => {
                timeLeave--;
                if (timeLeave == 0) {
                    this.props.remainingNoSecond();
                    clearInterval(this.state.timer);
                    return;
                }
                this.setState({expiredTime: this.formatSeconds(timeLeave)});
            }, 1000);
        }
    }

    //离开界面销毁定时器
    componentWillUnmount() {
        if (this.state.timer != null) {
            clearInterval(this.state.timer);
        }
        if (this.myAlert != null) {
            this.myAlert.close();
        }
    }

    getBgDiv(needNum, userImgList) {
        let perpleArray = [];
        userImgList.map((item, index) => {
            perpleArray.push(<img key={index} src={item}/>);
        })

        for (var i = userImgList.length; i < needNum; i++) {
            perpleArray.push(<div key={i} className="bgDiv"></div>);
        }
        return perpleArray;
    }

    render() {
        /**
         *  groupText   正在拼团  拼团成功 已失效
         *  needNum  需要多少人成团
         *  totalNum 累计拼团人数
         *  userImgList  已参团人头像列表
         *  remainingSecond  拼团剩余秒数
         *  groupSucess 拼团成功，传递用时秒数和击败百分比  例如：{{usedTime: 100 ,beatPeopleNum: 18}}
         *  remainingNoSecond() 拼团时间用尽调用方法
         * */

        let {groupText, needNum, totalNum, userImgList, groupSucess} = this.props;
        userImgList = userImgList?userImgList:[];
        let expiredPeople = needNum - userImgList.length;
        return (
            <div className="inGroupShopping">
                <div className="topStyle">
                    <div className="showText span1">{groupText}</div>
                    <div className="showText span2">累计拼团{totalNum}人</div>
                </div>
                <div className="centerStyle">
                    <div className="groupPeopleShow">
                        {this.getBgDiv(needNum, userImgList)}
                    </div>
                    <div className="divP">
                        {groupText === '正在拼团'
                            ?
                            (userImgList.length==0
                                ?
                                <span>还剩{expiredPeople}个名额</span>
                                :
                                <span>还剩{expiredPeople}个名额，<span
                                    className="spanTime"
                                    style={ {color: '#007AED'}}>{this.state.expiredTime}</span>后结束</span> )
                            :
                            null
                        }
                        {groupText === '拼团成功' ? <span>用时<span
                            className="spanTime" style={{color: '#007AED'}}>{this.formatSeconds(groupSucess.usedTime)}</span>，打败{groupSucess.beatPeopleNum}的人</span> : null}
                        {groupText === '已失效' ? <span>很遗憾，拼团失败</span> : null}
                    </div>
                </div>
                <div className="bottomText"><span>拼团须知: </span><span>{needNum}人成团 人满开团 不满退款</span></div>
            </div>
        );
    }

    //秒数转化为时分秒
    formatSeconds(timeLeave) {
        var secondTime = 0;
        var minuteTime = 0;
        var hourTime = 0;
        if (timeLeave > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = Math.floor(timeLeave / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = Math.floor(timeLeave % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime >= 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = Math.floor(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = Math.floor(minuteTime % 60);
            } else {
                hourTime = 0;
            }
        } else {
            hourTime = 0;
            minuteTime = 0;
            if (timeLeave == 60) {
                minuteTime = 1;
                secondTime = 0;
            } else {
                secondTime = timeLeave;
            }

        }

        var result = this.addZero(hourTime) + ":" + this.addZero(minuteTime) + ':' + this.addZero(secondTime);
        return result;
    }

    addZero(time) {
        let str = time;
        if (time < 10) {
            str = '0' + time;
        }
        return str;
    }

    /*getA() {
        let {groupText, needNum, totalNum, userImgList, groupSucess} = this.props;
        let expiredPeople = needNum - userImgList.length;
        return (
            <div>
                <div className="topStyle">
                    <div className="showText span1">{groupText}</div>
                    <div className="showText span2">累计拼团{totalNum}人</div>
                </div>
                <div className="centerStyle">
                    <div className="groupPeopleShow">
                        {this.getBgDiv(needNum, userImgList)}
                    </div>
                    <div className="divP">
                        {groupText === '正在拼团'
                            ?
                            (userImgList.length==0
                                ?
                                <span>还剩{expiredPeople}个名额</span>
                                :
                                <span>还剩{expiredPeople}个名额，<span
                                    className="spanTime"
                                    style={ {color: '#007AED'}}>{this.state.expiredTime}</span>后结束</span> )
                            :
                            null
                        }
                        {groupText === '拼团成功' ? <span>用时<span
                            className="spanTime" style={{color: '#007AED'}}>{this.formatSeconds(groupSucess.usedTime)}</span>，打败{groupSucess.beatPeopleNum}的人</span> : null}
                        {groupText === '已失效' ? <span>很遗憾，拼团失败</span> : null}
                    </div>
                </div>
                <div className="bottomText"><span>拼团须知: </span><span>{needNum}人成团 人满开团 不满退款</span></div>
            </div>
        );

    }

    getB() {
        let {groupText, needNum, totalNum, userImgList, groupSucess} = this.props;
        let expiredPeople = needNum - userImgList.length;
        return (

            <div>
                <div className="topStyle">
                    <div className="showText span1">{groupText}</div>
                </div>
                <div className="centerStyle">
                    <div className="groupPeopleShow">
                        {this.getBgDiv(needNum, userImgList)}
                    </div>
                    <div className="divP">
                        {groupText === '正在拼团'
                            ? <div>
                    <span
                        className="spanTime"
                        style={ {color: '#007AED'}}>{this.state.expiredTime}</span><span>后结束 </span >
                        </div >

                            :
                            null
                        }
                        {groupText === '已成功' ? <span>用时<span
                            className="spanTime"
                            style={{color: this.colorDic['COLOR1']}}>{this.formatSeconds(groupSucess.usedTime)}</span>，打败{groupSucess.beatPeopleNum}的人</span> : null}
                    </div>
                </div>
                <div className="bottomText"><span>拼团须知: </span><span>{needNum}人成团 人满开团 不满退款</span></div>
            </div>

        );


    }

    render() {
        /!**
         *  groupText   正在拼团  拼团成功 已失效
         *  needNum  需要多少人成团
         *  totalNum 累计拼团人数
         *  userImgList  已参团人头像列表
         *  remainingSecond  拼团剩余秒数
         *  groupSucess 拼团成功，传递用时秒数和击败百分比  例如：{{usedTime: 100 ,beatPeopleNum: 18}}
         *  remainingNoSecond() 拼团时间用尽调用方法
         * *!/
        this.colorDic = contants.viewStyDic;

        return (
            <div className="inGroupShopping">
                {this.state.isAttend ? this.getA() : this.getB()}

            </div>
        );
    }*/


}