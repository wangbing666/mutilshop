/**
 * Created by chengjiabing on 17/7/8.
 * 当前售后
 */
import React,{Component} from 'react';
import {ActivityIndicator,WhiteSpace, ListView,RefreshControl,Modal, PullToRefresh } from 'antd-mobile';
import  './aftersales.less'
import ReactDOM from 'react-dom';
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants'
const alert = Modal.alert;
import * as db from '../../../common/Apis/Utils';
import {readUserInfo} from '../../../common/Apis/Utils'
import Empty from '../../../common/components/empty';
export default class handleSale extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource:dataSource,
            refreshing: false,
            height:document.documentElement.clientHeight,
        };
        this.pageNow=1;
        this.pageSize=5;
    }
 
    onScroll() {
    }
    componentDidMount() {
        if(this.lv){
            const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
            this.setState({
              height: hei,
            })
          }
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize);
        let url = db.userAgent() === 'Android' ? encodeURIComponent(location.href.split('#')[0]) : encodeURIComponent(contants.url);
    }

    //进入详情页面----
    toAfetrSaleDetail(rowData)
    {
        let userInfo = readUserInfo();
        if(userInfo===null)
        {
            alert('提示', '获取用户信息失败', [
                {
                    text: '确定', onPress: () => {
                }, style: 'default'
                },
            ])
            return;
        }
        const {history}=this.props;
        history.push({
           pathname:contants.commonUrl+'/refundProgress'+"/?orderId="+rowData.orderId+"&aftersaleId="+rowData.afterSaleId+"&userId="+userInfo.wedoId+"&orderNum="+rowData.saleOrderNo+"&createTime="+format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')+"&saleType="+rowData.afterSaleType
         });
    }
    componentWillUnmount() {
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.hideAlert()
    }
    componentWillReceiveProps(props) {
        // console.log('componentWillReceiveProps')
        // console.log(props.afterSale.showLoading+' '+props.afterSale.handerSaleList.length)
    }
    getRow(rowData, sectionID, rowID)
    {   
        const {afterSale} =this.props;
        let ary =afterSale.handerSaleList;
        let name = rowData.goodsName;
       // console.log(rowData.afterSaleType);
        if(name&&name.length>18)
            name = name.substring(0,18)
        return (
            <div>
                <div className="cellCheng" >
                    <div className="orderIdContainer1">
                        <span className="orderName">售后单号:{rowData.saleOrderNo}</span>
                    </div>
                    <div className="orderIdContainer1">
                        <span className="orderName">申请时间:{format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')}</span>
                    </div>
                    <div className="info">
                        <div className="imgContainer1">
                            <img className="img11"
                                src={rowData.goodsZoomURL}
                            />
                            <div className="lable">共{rowData.goodsNum}件商品</div>
                        </div>
                        <div className="right">
                            <div className="nameAndType">
                                <div className="title1">{rowData.goodsName}</div>
                                <div className="type">
                                     { rowData.parentSpecName1 ? (<span>{rowData.parentSpecName1}：{rowData.param1}</span>):null}
                                     { rowData.parentSpecName2 ? (<span>{rowData.parentSpecName2}：{rowData.param2}</span>):null}
                                     { rowData.parentSpecName3 ? (<span>{rowData.parentSpecName3}：{rowData.param3}</span>):null}
                                </div>
                            </div>
                            <div className="money"><icon>¥</icon><span>{rowData.refundAmount}</span></div>
                        </div>
                    </div>
                    <div className="bottomStyle">
                        <div className="handle">
                            <div className="drawBack">
                                 {/* {rowData.aftersaleType} */}
                                {rowData.afterSaleType == 1 ? "仅退款" : "退货退款"}
                            </div>
                        </div>
                        <div className="statusBtn" onClick={()=>{this.toAfetrSaleDetail(rowData)}} >进入详情</div>
                    </div>
                </div>
               { rowID == ary.length-1 ? null:<div className="marginGray"></div>}
             </div>
            )
    }
    render() {
        const {afterSalesAction,afterSale} =this.props;
        const separator = (sectionID, rowID) => (
            <div
                key={rowID}
                className="order_list_between"
            />
        );
        let ary =afterSale.handerSaleList;
        if(ary.length===0||ary===null){
            return(
                    <div className="noData" style={{height:document.documentElement.clientHeight}}
                    >
                        {/* <img className="imgIcon" src={require('../../images/aftersales/j1@1x.png')}></img>
                        <div className="noDataText">暂无申请记录</div> */}
                        <Empty message={'很抱歉！暂无申请记录~'}/>
                    </div>
                )
        }else{
            return(
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource.cloneWithRows(ary)}
                    renderRow={this.getRow.bind(this)}
                    style={{
                        height: this.state.height,
                    }}
                    pullToRefresh={<PullToRefresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />}
                    pageSize={5}
                    scrollRenderAheadDistance={200}
                    scrollEventThrottle={20}
                    initialListSize={5}
                    onEndReachedThreshold={10}
                    scrollerOptions={{scrollbars: true}}
                    className="handleSaleListView"
                    onEndReached={this.onEndReached.bind(this)}

                    renderFooter={afterSale.handerSaleList.length>0?this.getFooter.bind(this):null
                    }
                />
        )
        }
    }
    getFooter(){
        const {afterSale} =this.props;
        return(
            <div className="listViewFootC">
                <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                  <span>
                   {afterSale.showLoading ? '加载中...' : afterSale.hasMore ? '加载更多': '没有更多内容了'} 
                  </span>
                <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
            </div>
        )
    }

       //刷新...
    onRefresh() {
        const {afterSalesAction} =this.props;
        this.setState({refreshing: true});
        this.pageNow=1;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize);
    }
    //加载更多
    onEndReached()
    {
        const {afterSalesAction,afterSale} =this.props;
        if(afterSale.hasMore===true&&afterSale.showLoading===false)
        {
            afterSalesAction.getHandleSaleListPost(afterSale.handerSaleList,this.pageNow+1,this.pageSize);
        }
    }
}

