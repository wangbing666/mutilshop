/**
 * Created by XiaYongjie on 2017/7/11.
 *
 */
import React, {Component} from 'react';
import {Tabs} from "antd-mobile";
import './myOrderListEmpty.less'
import OrderList from "./orderListData";
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';
// import {Modal} from "antd-mobile/lib/index";
// const alert = Modal.alert;

const tabs = [
    {title: '待付款', sub: '1'},
    {title: '待收货', sub: '2'},
    {title: '已完成', sub: '3'},
    {title: '全部订单', sub: '4'},
];

export default class OrderTab extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            height: 0,
            index:0,
        }
        this.theRequest ={};
        this.isReturn = true;
    }


    //reader前
    componentWillMount() {
        this.isReturn = true;
        let theRequest = {};
        let strs = [];
        let urls = location.search; //获取url中"?"符后的字串
        if (urls.indexOf("?") !== -1) {
            let str = urls.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }

        this.theRequest = theRequest;
        let tempDic ={wedoId:theRequest.userId};
        db.saveUserId(tempDic);
        const {OrderTab, OrderListAction} = this.props;
    }

    onChange(v) {

    }

    componentDidMount() {

        this.setState({height: $('.am-tabs-tab-bar-wrap').height()});
        const {OrderTab, OrderListAction} = this.props;
        wxShare([], {});
        $('.am-tabs-bar').on("touchmove", function (e) {
            var e = e || event;
            e.preventDefault();
        });
    }


    //页面销毁
    componentWillUnmount() {
        const {OrderTab, OrderListAction} = this.props;
        if (this.isReturn) {
            OrderListAction.setType(-1);
            OrderListAction.clearn(6);
        }
    }

    render() {
        const {OrderTab,OrderListAction} = this.props;
        let key = OrderTab.myTabType==-1?this.orderStatus:OrderTab.myTabType;
        return (
            <div className="tabContaiCheng">
                <Tabs className="tab"
                      ref="tab"
                      swipeable={false}
                      tabs={tabs} initialPage={parseInt(key)}
                      animated={true}
                      page={parseInt(key)}
                      prerenderingSiblingsNumber={4}
                      onChange={(tab, index) => {
                         this.setState({
                             index:index
                         });
                      }}
                      onTabClick={(tab, index) => {
                          console.log('修改type', index)
                          OrderListAction.setType(index);
                      }}
                >
                    <OrderList index={1} {...this.props} theRequest={this.theRequest} height={this.state.height} onBack={(isReturn)=>{
                        this.isReturn = isReturn;
                    }}/>


                    <OrderList index={2} {...this.props} theRequest={this.theRequest}  height={this.state.height} onBack={(isReturn)=>{
                        this.isReturn = isReturn;
                    }} />


                    <OrderList index={3} {...this.props} theRequest={this.theRequest}  height={this.state.height} onBack={(isReturn)=>{
                        this.isReturn = isReturn;
                    }} />

                    <OrderList index={0} {...this.props} theRequest={this.theRequest} height={this.state.height} onBack={(isReturn)=>{
                        this.isReturn = isReturn;
                    }} />

                </Tabs>
                {OrderTab.isShow ? <div className="loadingView">
                    <div className="loadingImg"></div>
                </div>: null}
            </div>);
    }
}

