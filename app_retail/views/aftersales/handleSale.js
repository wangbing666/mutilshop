/**
 * Created by chengjiabing on 17/7/8.
 * 当前售后
 */
import React,{Component} from 'react';
import {ActivityIndicator,WhiteSpace, ListView,RefreshControl,Modal } from 'antd-mobile';
import  './aftersales.less'
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants'
import Alert from '../../../common/components/Alert'
const alert = Modal.alert;
import * as db from '../../../common/Apis/Utils';
import {readUserInfo} from '../../../common/Apis/Utils'
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
        };
        this.pageNow=1;
        this.pageSize=5;
        this.getMoreData=true;
    }
    onRefresh() {
        console.log('onRefresh()')
        this.getMoreData=true;
        const {afterSalesAction,afterSale} =this.props;
        this.setState({refreshing: true});
        console.log(this.getMoreData)
        this.pageNow=1;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize,this.props.shopId,()=>{
        });
        setTimeout(() => {
            this.setState({
                refreshing: false,
            });
            this.getMoreData=false;
        }, 1000);
    }
    onScroll() {
    }
    componentDidMount() {
        const {afterSalesAction,afterSale} =this.props;
        afterSalesAction.getHandleSaleListPost([],this.pageNow,this.pageSize,this.props.shopId,()=>{
            setTimeout(() => {
                this.getMoreData=false;
            }, 1000);
        })
    }
    cellCick(rowData)
    
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
        if(rowData.afterSaleType===1)//退款
            this.props.history.push({
                pathname:contants.commonUrl+'/refundProgress'+"/?aftersaleId="+rowData.afterSaleId+"&saleOrderNo="+rowData.saleOrderNo+
                "&orderId="+rowData.orderId+"&userId="+userInfo.wedoId+"&applyTime="+format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss'),
                state:{
                    aftersaleId:rowData.afterSaleId,
                    saleOrderNo:rowData.saleOrderNo,
                    orderId:rowData.orderId,
                    userId:userInfo.wedoId,
                    applyTime:format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')
                }
            });
        if(rowData.afterSaleType===2){//退货退款
            this.props.history.push({
                // pathname:contants.commonUrl+'/refundsDetailList'+"/?aftersaleId="+rowData.afterSaleId+"&orderId="+rowData.orderId+
                // "&userId="+userInfo.wedoId+"&applyTime="+format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss')+"&saleOrderNo="+rowData.saleOrderNo,
                pathname: contants.commonUrl + '/refundProgress' + "/?orderId=" + rowData.orderId + '&saleType=2&aftersaleId='+rowData.afterSaleId,
                state:{
                    aftersaleId:rowData.afterSaleId,
                    orderId:rowData.orderId,
                    userId:userInfo.wedoId,
                    applyTime:format(rowData.afterSaleCreateTime,'yyyy-MM-dd HH:mm:ss'),
                    saleOrderNo:rowData.saleOrderNo,
                }
            });
    }
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
        let buttonStyle="button_style_1";
        if(contants.commonUrl.indexOf("flagship")!=-1) {
            if (contants.viewStyDic.SHAPE === 1) {
                buttonStyle = "button_style_1"
            } else if (contants.viewStyDic.SHAPE === 2) {
                buttonStyle = "button_style_2"
            } else {
                buttonStyle = "button_style_3"
            }
        }


        let name = rowData.goodsName;
        if(rowData==='noData')
        {
            return(
                <dic className="noData"
                >
                    <img className="imgIcon" src={require('../../images/aftersales/j1@1x.png')}></img>
                    <div className="noDataText">暂无申请记录</div>
                </dic>
            )
        }
        if(name&&name.length>18)
            name = name.substring(0,18)
        return (
            <div className="cellCheng" >
                <div className="marginGray"></div>
                <div className="orderIdContainer1">
                    <span className="orderName">售后单号：{rowData.saleOrderNo}</span>
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
                        <div className="title1">{name}</div>
                        <div className="money">退款金额¥:{rowData.refundAmount}</div>
                    </div>
                </div>
                <div className="bottomStyle">
                    <div className="handle">
                        <img src={require('../../images/aftersales/j3@1x.png')}></img>
                        <div className="drawBack">
                            退款中
                        </div>
                    </div>
                    {/* <div className="status">
                        <span className="text">您的售后服务已申请,请耐心等待...</span>
                        <img src={require('../../images/aftersales/j7@1x.png')} />
                    </div> */}
                    <button className={buttonStyle} style={{background: contants.viewStyDic.COLOR1}} onClick={()=>{this.cellCick(rowData)}}>
                        <span style={{color: contants.viewStyDic.COLOR3}}>进度详情</span>
                    </button>
                </div>

            </div>)
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
        if(ary.length===0||ary===null)
            ary=['noData']
        console.log('-------------',this.props.height)
        return(
            <div>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(ary)}
                    renderRow={this.getRow.bind(this)}
                    style={{
                        height: document.documentElement.clientHeight-this.props.height,
                    }}
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
            </div>
        )

    }
    getFooter()
    {
        return(
            <div className="listViewFootC">
                <img className="imgLeft" src={require('../../images/homePage/wuLeft.png')}/>
                <span>
                                {this.state.requestCompleted ? '加载中...' : '没有更多内容了'}
                             </span>
                <img className="imgRight" src={require('../../images/homePage/wuRight.png')}/>
            </div>
        )
    }
    onEndReached()
    {
        const {afterSalesAction,afterSale} =this.props;
        if(this.getMoreData===false&&afterSale.showLoading===false)
        {
            this.getMoreData=true;
            const {afterSalesAction,afterSale} =this.props;
            afterSalesAction.getHandleSaleListPost(afterSale.handerSaleList,this.pageNow+1,this.pageSize,this.props.shopId,(count)=>{
                if(count>0)
                    this.pageNow=this.pageNow+1;
                setTimeout(() => {
                    this.getMoreData=false;
                    // console.log(this.getMoreData)
                }, 1000);
            })
        }
    }
}

