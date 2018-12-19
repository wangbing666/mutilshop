/**
 * Created by chengjiabing on 17/7/7.
 */
import React, {Component} from 'react';
import {Menu, ActivityIndicator, NavBar, Tabs, WhiteSpace,Badge} from 'antd-mobile';
import './aftersales.less'
import HandleSale from './handleSale'
import SaleRecord from './saleRecord'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
const TabPane = Tabs.TabPane;
import * as contants from '../../../common/Apis/constants'
import {getValueFromUrl} from '../../../common/Apis/Utils'

export default class afterSalesTab extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            height: 0
        }
        let request=getValueFromUrl(location.search)
        this.shopId=request['shopId']
    }

    callback(key) {
        const {afterSalesAction, afterSale} = this.props;
        afterSalesAction.selectTabWithIndex(key)
    }

    handleTabClick(key) {
    }

    componentDidMount() {
        wxShare([],{});
        this.setState({height: $('.am-tabs-tab').height()});
        if(db.userAgent()==='Android'){
            document.title='我的售后';
        }else{
            db.setPageTitle('我的售后');
        }
        // this.props.history.setRouteLeaveHook(
        //     this.props.route,
        //     this.routerWillLeave.bind(this)
        // )
        $('.am-tabs-bar').on("touchmove", function (e) {//取消滑动手势
            var e = e || event;
            e.preventDefault();
        });
    }

    routerWillLeave(nextLocation) {
        const {afterSalesAction, afterSale} = this.props;
        if (nextLocation.pathname === contants.commonUrl + '/orderHome') {
            afterSalesAction.selectTabWithIndex('1')
        }
    }

    render() {
        const {afterSalesAction, afterSale} = this.props;
        const tabs = [
            { title: <Badge >当前售后</Badge> },
            { title: <Badge >申请记录</Badge> },
        ];
        return (
            <div className="tabContainer">
                <Tabs defaultActiveKey={'1'}
                      swipeable={false}
                      tabs={tabs}
                      initialPage={1}
                      onChange={this.callback.bind(this)} onTabClick={() => {
                    this.handleTabClick()
                }}
                      activeKey={afterSale.index}

                >
                    <HandleSale {...this.props} height={this.state.height} shopId={this.shopId}></HandleSale>
                    <SaleRecord className="tabView" {...this.props} height={this.state.height} shopId={this.shopId}></SaleRecord>
                </Tabs>
                {/*{afterSale.showLoading?<div className="loadingView"></div>:null*/}
                {/*}*/}
            </div>
        )
    }
}
