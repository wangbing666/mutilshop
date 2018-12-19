/**
 * Created by XiaYongjie on 2017/7/7.
 *
 */

import React, {Component} from 'react';
import {ListView, Modal, PullToRefresh,} from 'antd-mobile';
import './orderDetail.less';
import OrderListEmpty from "./orderListEmpty";

const alert = Modal.alert;
import * as contants from '../../../common/Apis/constants';


function getType(type) {
    if (type == 1) {
        return '待付款';
    } else if (type == 2) {
        return '待发货';
    } else if (type == 3) {
        return '已发货';
    } else if (type == 4) {
        return '已完成';
    } else if (type == 5) {
        return '退款中';
    } else if (type == 6) {
        return '已取消';
    } else {
        return '未知订单类型';
    }
}

class OrderListData extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            key: this.props.data,
            dataSource: dataSource,
            refreshing: false,
            isLoading: false,
            hasMore: false,
            onTouch: false,
            requestCompleted: true,
            type: 0,
            empty: [
                {
                    name: 'xiaxie',
                }
            ],
        };

        this.pageNow = 1;
        this.pageSize = 5;
        this.getMoreData = true;
        this.theRequest = this.props.theRequest
    }

    //reader前
    componentWillMount() {
        document.title = "我的订单";
    }


    //在页面被渲染成功之后
    componentDidMount() {
       
        const {OrderListAction} = this.props;
        OrderListAction.getOrderList([], this.theRequest.userId, this.props.index, this.pageSize, this.pageNow, this.theRequest.roleType, this.theRequest.shopId, (data) => {
            if (data.length == 5) {
                this.setState({
                    requestCompleted: true,
                });
            } else {
                this.setState({
                    requestCompleted: false,
                });
            }
            setTimeout(() => {
                this.getMoreData = false;
            }, 1000);
        }, () => {
        });//传相应的数组

    }

    //页面销毁
    componentWillUnmount() {
        const {OrderTab, OrderListAction} = this.props;

        OrderListAction.hideAlert()
    }

    getTypeTitle(state, saletype) {
        let result = "";
        if (state == 1) {
            result = '预计返润：';
        } else if (state == 2) {
            result = '预计返润：';
        } else if (state == 3) {
            result = '预计返润：';
        } else if (state == 4) {
            result = '真实返润：';
        } else if (state == 5) {
            result = '预计返润：';
        } else if (state == 6) {
            result = '取消订单，不再返润';
        }  else {
            result = '未知订单类型';
        }
        if (state != 6) {
            switch (saletype) {
                case 1:
                    result = "订单已退款，不再返润";
                    break;
                case 2:
                    result = "订单已退货，不再返润";
                    break;
                case 3:
                    result = "订单已退货退款，不再返润";
                    break;
            }
        }
        return result;
    }

    onRefresh() {
        const {OrderListAction} = this.props;
        this.setState({refreshing: true});
        this.pageNow = 1
        setTimeout(() => {
            this.getMoreData = false;
            OrderListAction.getOrderList([], this.theRequest.userId, 1, this.pageSize = 5, this.pageNow = 1, this.theRequest.roleType, this.theRequest.shopId, (data) => {
                if (this.props.index === 1) {
                    if (data.length == 5) {
                        this.setState({
                            requestCompleted: true,
                        });
                    } else {
                        this.setState({
                            requestCompleted: false,
                        });
                    }
                }
            }, () => {
            });//传相应的数组

            OrderListAction.getOrderList([], this.theRequest.userId, 2, this.pageSize = 5, this.pageNow = 1, this.theRequest.roleType, this.theRequest.shopId, (data) => {
                if (this.props.index === 2) {
                    if (data.length == 5) {
                        this.setState({
                            requestCompleted: true,
                        });
                    } else {
                        this.setState({
                            requestCompleted: false,
                        });
                    }
                }
            }, () => {
            });//传相应的数组
            OrderListAction.getOrderList([], this.theRequest.userId, 3, this.pageSize = 5, this.pageNow = 1, this.theRequest.roleType, this.theRequest.shopId, (data) => {
                if (this.props.index === 3) {
                    if (data.length == 5) {
                        this.setState({
                            requestCompleted: true,
                        });
                    } else {
                        this.setState({
                            requestCompleted: false,
                        });
                    }
                }
            }, () => {
            });//传相应的数组
            OrderListAction.getOrderList([], this.theRequest.userId, 0, this.pageSize = 5, this.pageNow = 1, this.theRequest.roleType, this.theRequest.shopId, (data) => {
                if (this.props.index === 0) {
                    if (data.length == 5) {
                        this.setState({
                            requestCompleted: true,
                        });
                    } else {
                        this.setState({
                            requestCompleted: false,
                        });
                    }
                }
            }, () => {
            });//传相应的数组
            this.setState({
                refreshing: false,
            });
        }, 1000);
    }

    onScroll() {
    }

    getGoods(goods) {
        let newGoods = [];
        if (goods instanceof Array) {
            for (let i = 0; i < goods.length; i++) {
                if (goods[i].goodStatus === 0) {
                    newGoods.push(goods[i])
                }
            }
        }
        return newGoods;
    }


    onEndReached() {
        const {OrderTab, OrderListAction} = this.props;
        if (this.getMoreData === false && OrderTab.isShow === false) {
            this.getMoreData = true
            const {OrderTab, OrderListAction} = this.props;
            let array = []
            if (this.props.index === 1) {
                array = OrderTab.pendPaymentList;
            } else if (this.props.index === 2) {
                array = OrderTab.toBeReceivedList;
            } else if (this.props.index === 3) {
                array = OrderTab.completedList;
            } else if (this.props.index === 0) {
                array = OrderTab.allList;
            }
            OrderListAction.getOrderList(array, this.theRequest.userId, this.props.index, this.pageSize = 5, this.pageNow + 1, this.theRequest.roleType, this.theRequest.shopId, (data) => {
                if (data.length == 5) {
                    this.setState({
                        requestCompleted: true,
                    });
                } else {
                    this.setState({
                        requestCompleted: false,
                    });
                }
                this.getMoreData = false;
                this.pageNow = this.pageNow + 1;
            }, () => {
            });//传相应的数组
        }
    }

    onItemClick(rowData) {
        if (rowData === this.state.empty[0]) {
            return;
        }
        if (this.state.onTouch) {
            this.state.onTouch = false;
        } else {
            this.goMyOrderDetail(rowData);
        }
    }

    //跳转我的订单详情
    goMyOrderDetail(rowData) {
        this.props.onBack(false);
        const {history} = this.props;
        let url = contants.commonUrl + '/orderDetailShop' +
            "/?orderNum=" + rowData.orderNum + "&orderId=" + rowData.orderId
            + "&orderSonId=" + (rowData.orderSonId || 0) + "&userId="
            + this.theRequest.userId + "&roleType=" + this.theRequest.roleType + "&shopId=" + this.theRequest.shopId;
        history.push({
            pathname: url
            // state: {
            //     orderNum:rowData.orderNum,
            //     orderId: rowData.orderId,
            //     orderSonId: rowData.orderSonId,
            //     createTime: rowData.createTime,
            // }
        });
        let data = {type: 11, url: url};
        window.postMessage(JSON.stringify(data))
    };

    getItem(dates) {
        return (
            dates.map((shop, index) => {
                return (<li className="shop_li" key={index}>
                    <div className={index === dates.length - 1 ? "shop_item_2" : "shop_item"}>
                        <div className="shop_icon_p">
                            {shop.goodStatus === 1 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o6@1.5x.png')}/>}
                            {shop.goodStatus === 2 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o5@1.5x.png')}/>}
                            {shop.goodStatus === 3 &&
                            <img className="shop_icon_state"
                                 src={require('../../images/order/o4@1.5x.png')}/>}
                            {/* <img className="shop_icon" src={shop.hostUrl + shop.zoomUrl}/> */}
                            <img className="shop_icon" src={shop.goodFile}/>
                        </div>
                        <div className="shop_att">
                            <div className="shop_name_item">
                                <div className="shop_name">{shop.goodsName !== null ?
                                    (shop.goodsName.length > 10 ? shop.goodsName.substring(0, 10) + "..." : shop.goodsName)
                                    : ''}</div>
                                <div className="shop_count">{'x' + shop.goodsNum}</div>
                            </div>
                            <div className="shop_number_p">
                                <div className="shop_format">{this.getDes(shop.specifications)}</div>
                            </div>
                            <div className="shop_money_p">
                                <div className="shop_money">{'￥' + shop.goodsPrice}</div>
                            </div>
                        </div>
                    </div>
                </li>);
            }));
    }

    getDes(specifications) {
        if (specifications instanceof Array) {
            let des = '';
            for (let i = 0; i < specifications.length; i++) {
                des = des + specifications[i].type + ':' + specifications[i].name + "";
            }
            return des;
        }
    }

    render() {
        
        let array = [];
        let data = [];
        let height = document.documentElement.clientHeight - this.props.height;
        const row = (rowData, sectionID, rowID) => {
            if (rowData === this.state.empty[0]) {
                return (<OrderListEmpty {...this.props} height={height}/>);
            } else {
                return (
                    <div className="order_list_item" onClick={() => this.onItemClick(rowData)}>
                        {rowID == 0 ? <div className="order_list_top"/> : <div className="order_list_between"/>}
                        {/*该死本来有一套非要做成两种垃圾**/}

                        <div className="order_number_la">
                            <div className="order_number">
                                <img className="img_head"
                                     src={rowData.userHeadFile} onClick={(event) => {
                                    let data = {type: 1, userId: rowData.userId};
                                    window.postMessage(JSON.stringify(data))
                                    let ev = event || window.event;
                                    ev.stopPropagation();
                                }}/>
                                <div className="middleContainer">
                                    <span className="span_name">{rowData.userNickName}</span>
                                    <span className="span_1">{"下单时间:" + rowData.createTime}</span>
                                </div>
                            </div>

                            <div className="order_type" style={{color: '#007AED'}}>
                                <span>{getType(rowData.status)}</span>
                            </div>
                        </div>
                        <div className="item_head_line"></div>
                        {rowData.goods === null ? <div/> : <ul className="shop_list">{this.getItem(rowData.goods)}</ul>}
                        <div className="shop_item_bottom"/>
                        <div className="order_list_item_middle">
                            <span>{"共计" + rowData.orderNum + "件商品"}</span>
                            <div className="bottomMoney">
                                <span className="spanTitle">{"商品金额"}</span>
                                <span className="spanMoney">{'应付：￥' + rowData.payAmount}</span>
                            </div>
                        </div>
                        <div className="shop_item_bottom"/>
                        {this.theRequest.roleType == 2 ? <div className="order_list_item_bottom">
                            <div className="returnMoney">
                                <span
                                    className="spanTitle">{this.getTypeTitle(rowData.status, rowData.saletype)}</span>
                                {
                                    (rowData.saletype == undefined || rowData.saletype == null) ? <span
                                            className="spanMoney">{"¥ " + (this.theRequest.roleType == 2 ? (rowData.proxyMoney || 0) : rowData.payAmount)}</span> :
                                        <div/>
                                }
                            </div>

                        </div> : (rowData.isProxySale == 1 ?
                            <div className="shop_item_bottom_laji">
                                <div className="item_fen_p">
                                    <div className="tag">分销</div>
                                    <div className="uu_number_title">{"微度账号:"}</div>
                                    <div className="uu_number" onClick={(event) => {
                                        let data = {type: 1, userId: rowData.proxyUserId};
                                        window.postMessage(JSON.stringify(data))
                                        let ev = event || window.event;
                                        ev.stopPropagation();
                                    }}>{rowData.proxyUserNo}
                                    </div>
                                    <div/>
                                    {
                                        (rowData.saletype == undefined || rowData.saletype == null)&& <div className="span_title_laji">分润金额:</div>
                                    }
                                    {
                                        (rowData.saletype == undefined || rowData.saletype == null)&& <div className="span_money_laji">{"￥" + (rowData.proxyMoney || 0)}</div>
                                    }

                                </div>
                                <div className="money_p_laji">
                                <span
                                    className="span_title_laji">{rowData.status == 4 ? "实付金额：" : ((rowData.status == 1 || rowData.status == 2 || rowData.status == 3) ? "待收金额：" : (rowData.status === 6 ? "订单已取消" : "订单已退款"))}</span>
                                    {(rowData.status == 1 || rowData.status == 2 || rowData.status == 3 || rowData.status == 4) &&
                                    <span className="span_money_laji">{"" + rowData.payAmount}</span>}
                                </div>
                            </div> : <div className="shop_item_bottom_laji_laji">

                                <div className="money_p_laji">
                                <span
                                    className="span_title_laji">{rowData.status == 4 ? "实付金额：" : ((rowData.status == 1 || rowData.status == 2 || rowData.status == 3) ? "待收金额：" : (rowData.status === 6 ? "订单已取消" : "订单已退款"))}</span>
                                    {(rowData.status == 1 || rowData.status == 2 || rowData.status == 3 || rowData.status == 4) &&
                                    <span className="span_money_laji">{"" + rowData.payAmount}</span>}
                                </div>
                            </div>)

                        }

                    </div>
                );
            }
        };
        const {OrderTab, OrderListAction} = this.props;


        if (this.props.index === 1) {
            array = OrderTab.pendPaymentList;
            data = OrderTab.pendPaymentList;
        } else if (this.props.index === 2) {
            array = OrderTab.toBeReceivedList;
            data = OrderTab.toBeReceivedList;
        } else if (this.props.index === 3) {
            array = OrderTab.completedList;
            data = OrderTab.completedList;
        } else if (this.props.index === 0) {
            array = OrderTab.allList;
            data = OrderTab.allList;
        }

        if (array.length === 0) {
            array = this.state.empty;
        }
        return (
            <div className="order_list">
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(array)}
                    renderRow={row}
                    scrollRenderAheadDistance={200}
                    scrollEventThrottle={20}
                    initialListSize={5}
                    pageSize={5}
                    style={{
                        height: height,
                    }}
                    onScroll={this.onScroll}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={10}
                    scrollerOptions={{scrollbars: true}}
                    useBodyScroll={this.state.useBodyScroll}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />}
                    renderFooter={() => (data.length > 0 ?
                        <div>
                            <div className="my_listViewFoot">

                                <span>
                                {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                             </span>
                            </div>
                        </div> : <div/>)}
                />
            </div>
        );
    }

}

export default OrderListData;