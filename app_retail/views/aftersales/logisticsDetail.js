/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：物流详情页
 */
import React from 'react';
import './logistics_detail.less'
import {post, myGet} from '../../../common/Apis/Fetch.js';
import { withRouter } from 'react-router-dom';
import * as db from '../../../common/Apis/Utils';
import {wxShare} from '../../../common/Apis/wxJsApis';
import * as contants from '../../../common/Apis/constants'

class logisticsDetail extends React.Component {
    constructor(props) {
        super(props)
        this.theRequest ={};
        this.state = {
            data: [],
            totalNum: '',
            pictureUrl: '',
            status: '',
            orderId: '',
            deliverCompanyName: '',
            deliverCompanyNo: '',
            transportNo: '',
            transportStatus: '',
            isShow: true,
        }
    }

    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '物流跟踪';
        } else {
            db.setPageTitle('物流跟踪');
        }
        let theRequest = {};
        let strs = [];
        let urls = location.search; //获取url中"?"符后的字串
        if (urls.indexOf("?") !== -1) {
            let str = urls.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }

        this.theRequest = theRequest;
    }

    componentDidMount() {
        const {history} = this.props;
        contants.currentHistory = history;
        wxShare([], {});
        this.state.totalNum = this.theRequest.totalNum;//商品数量
        this.state.pictureUrl = this.theRequest.url;//图片url
        let status = this.theRequest.status;//订单是否已收货
        let orderId = this.theRequest.orderId;//订单号
        this.state.deliverCompanyName = this.theRequest.deliverCompanyName;//物流公司
        let deliverCompanyNo = this.theRequest.deliverCompanyNo;//物流公司对应码
        this.state.transportNo = this.theRequest.transportNo;//运单编号
        // if (status != 4) {
            this.state.transportStatus = '正在运输中'
            let params = {
                deliverCompanyNo: deliverCompanyNo,//'wanxiangwuliu',
                transportNo: this.state.transportNo// '11810310136962'
            }

            post('/transportInfo/getTransportInfoByKuaidi100', params, (data) => {
              
                this.setState({isShow: false});
                if (data.status === 0) {
                    this.state.data = data.body.data;
                    this.forceUpdate();
                } else {
                    console.log(data.message);
                }
            }, (err) => {
                this.setState({isShow: false});
               
            })
        // } else {
        //     this.state.transportStatus = '已收货'
        //     let params = {
        //         orderId: orderId
        //     }
        //     post('/transportInfo/getTransportInfo', params, (data) => {
               
        //         this.setState({isShow: false});
        //         if (data.status === 0) {
        //             this.state.data = data.body.data.data;
        //             this.state.deliverCompanyName = data.body.data.deliverCompanyName;
        //             this.state.transportNo = data.body.data.transportNo;
        //             this.state.totalNum = data.body.data.goodsNum;
        //             this.state.pictureUrl = data.body.data.hostUrl + data.body.data.zoomUrl;
        //             this.forceUpdate();
        //         } else {
                  
        //         }
        //     }, (err) => {
        //         this.setState({isShow: false});
              
        //     })
        // }
    }

    findPhone(str) {
        let arr = str.match((/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g));
        let s1 = str;
        let phone = '';
        let s2 = '';
        for (let pho of arr) {
            if (pho.length == 11) {
                let index = str.indexOf(pho);
                s1 = str.substring(0, index);
                phone = pho;
                s2 = index + 11 > str.length ? '' : str.substring(index + 11);
                break;
            }
        }
        return {
            s1,
            phone,
            s2
        }
    }

    render() {
        return (

            <div>
                {/* <div className="empty-view1"></div> */}
                <div className="new-order-track1">
                    <div className="img-content1">
                        <img src={this.state.pictureUrl}/>
                        <div><span>{this.state.totalNum}</span>件商品</div>
                    </div>
                    <div className="title">
                        {/* <div className="top"><span>物流状态:</span><span
                            className="leftText">{this.state.transportStatus}</span></div> */}
                        <div className="cen"><span>承运来源:</span><span
                            className="text1">{this.state.deliverCompanyName}</span></div>
                        <div className="btm3"><span>运单编号:</span><span className="span">{this.state.transportNo}</span>
                        </div>
                    </div>
                </div>
                <div className="progressTitle"><span>物流进度</span></div>
                {this.state.data.length != 0 &&
                <div className="flow-list-l">
                    <div className="new-order-flow-l new-p-re-l">
                        <ul className="new-of-storey-l">
                            {
                                this.state.data.map((item, index) => {
                                    let arr = this.findPhone(item.context);
                                    return <li key={index}>
                                        {
                                            index === 0 ? <span className="top-white"/> : ''
                                        }
                                        {
                                            index === this.state.data.length - 1 ?
                                                <span className="bottom-white"/> : ''
                                        }
                                        <div className={`icon ${index === 0 ? 'on' : ''}`}>
                                            {index === 0 && <div className={'icon1'}>
                                            </div>}
                                        </div>
                                        <span className="first">
                                        <font>{arr.s1}</font>
                                              <font className="phone">{arr.phone}</font>
                                              <font>{arr.s2}</font>
                                    </span>
                                        <span>
                                        {item.time}
                                    </span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                }
                {/*<ActivityIndicator*/}
                {/*toast*/}
                {/*text="Loading..."*/}
                {/*animating={this.state.isShow}*/}
                {/*/>*/}
                {this.state.isShow ? <div className="loadingView"></div> : null
                }
            </div>


        );
    }
}
export default withRouter(logisticsDetail)
