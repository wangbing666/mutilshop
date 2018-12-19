/**
 * Created by chengjiabing on 17/11/28.
 * 店铺活动
 */
import React,{Component} from 'react';
import {ActivityIndicator,WhiteSpace, ListView,Modal, PullToRefresh } from 'antd-mobile';
import {format} from '../../../common/Apis/Utils'
import * as contants from '../../../common/Apis/constants'
import Alert from '../../../common/components/Alert'
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as db from '../../../common/Apis/Utils';
import {readUserInfo} from '../../../common/Apis/Utils'
import {getValueFromUrl} from '../../../common/Apis/Utils'
import * as weidudb from '../../../common/Apis/weiduInteractive';
import './shopActivity.less'
export default class shopActivity extends Component{
    constructor(props){
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.state = {
            dataSource:dataSource,
        };
        this.pageNow=1;
        this.pageSize=10;
        this.getMoreData=true;
        this.activityId=0;
        this.shopId=0;
    }

    componentWillMount() {
      weidudb.userAuthorization();//调用原生方法获取用户信息
    }

    componentDidMount() {
        const {list}=this.props.shopActivity;
        const {shopActivityAction}=this.props;
        let requestDic = getValueFromUrl(location.search)
        this.activityId=requestDic.activityId;
        this.shopId = requestDic.shopId;
        shopActivityAction.getShopActivityBannerPost(this.activityId,(title)=>{
            //微信分享所需参数
            let dic = {
                title: contants.activityInfo.title,
                desc: contants.activityInfo.content,
                imgUrl: contants.activityInfo.imgUrl,
                linkUrl: window.location.href
            };
            wxShare( [], dic, true);
            if(db.userAgent()==='Android'){
                // MOYAHEE
                document.title=title;
            }else{
                db.setPageTitle(title);
            }

        })
        shopActivityAction.getShopActivityListPost([],this.pageNow,this.pageSize,this.activityId,(ary)=>{
            if(ary.length>=this.pageSize){
                this.pageNow++
            }
            else{
                this.getMoreData=false;
            }
        })
    }
    getRow(rowData, sectionID, rowID){
        const {barnnerAndTemplateId}=this.props.shopActivity;
        let type = barnnerAndTemplateId.templateId?barnnerAndTemplateId.templateId:1;
        switch (type){
            case 1:
                return(
                    <div className="cellThree">
                        <div className="header">
                            <div className="title">{rowData.title}</div>
                        </div>
                        <div className="goods">
                            {
                                rowData.goodsInfo.map((data,index)=>{

                                    return(<div className="good" key={index} onClick={()=>{this.gotoDetails(data.goodsId,this.shopId)}}>
                                        <img src={data.hostUrl+data.fileUrl} />
                                        <p className="goodName">{data.goodsName}</p>
                                        <div className="price">
                                            <div className="actPrice"><span>¥</span>{data.groupPrice>0?data.groupPrice:data.price}</div>
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                )

                break;
            case 2:
                return(
                    <div className="cellOne">
                        <div className="header">
                            <img src={require('../../images/shopActivity/fenlan.png')}/>
                            <div className="title">{rowData.title}</div>
                        </div>
                        <div className="goods">
                            {
                                rowData.goodsInfo.map((data,index)=>{

                                    return(<div className="good" key={index}>
                                        <img src={data.hostUrl+data.fileUrl} />
                                        <div className="goodName">{data.goodsName}</div>
                                        <div className="price">
                                            <div className="actPrice"><span>¥</span>{data.groupPrice>0?data.groupPrice:data.price}</div>
                                            {data.groupPrice>0?
                                                <div className="realPrice">¥{data.price}</div>
                                                :null}
                                        </div>
                                        <div className="buy" onClick={()=>{this.gotoDetails(data.goodsId,this.shopId)}}>
                                            立即抢购
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                )
                break;
            case 3:
                return(
                    <div className="cellTwo">
                        <div className="header">
                            {/*<div className="titleContainer"></div>*/}
                            <img src={require('../../images/shopActivity/title.png')}/>
                            <div className="title">{rowData.title}</div>
                        </div>
                        <div className="goods">
                            {
                                rowData.goodsInfo.map((data,index)=>{

                                    return(<div className="good" key={index}>
                                        <img src={data.hostUrl+data.fileUrl} />
                                        <div className="goodName">{data.goodsName}</div>
                                        <div className="price">
                                            <div className="actPrice"><span>¥</span>{data.groupPrice>0?data.groupPrice:data.price}</div>
                                            {data.groupPrice>0?
                                                <div className="realPrice">¥{data.price}</div>
                                                :null}
                                        </div>
                                        <div className="buy" onClick={()=>{this.gotoDetails(data.goodsId,this.shopId)}}>
                                            立即抢购
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                )
                break;
            default :
                return <div></div>
        }



    }
    gotoDetails(goodsId,shopId){//跳转详情
        const {history}=this.props;
        let url = contants.commonUrl+'/goodDetails'+'/?shopId='+this.shopId+'&goodsId='+goodsId
        history.push({
            pathname:url,
            state:{
            }
        });
    }
    onRefresh() {
        const {shopActivityAction}=this.props;
        this.pageNow=1;
        shopActivityAction.getShopActivityBannerPost(this.activityId)
        shopActivityAction.getShopActivityListPost([],this.pageNow,this.pageSize,this.activityId,
            (ary)=>{
                if(ary.length>=this.pageSize){
                    this.pageSize++
                }
                else{
                    this.getMoreData=false;
                }
            })
        this.getMoreData=true;
        this.setState({refreshing: true});
        setTimeout(() => {
            this.setState({
                refreshing: false,
            });
            this.getMoreData=false;
        }, 1000);
    }

    onEndReached()
    {
        const {shopActivityAction}=this.props;
        const {list}=this.props.shopActivity;
        if(this.getMoreData===true&&this.props.shopActivity.isShowLoading===false){
            console.log('onEndReache')
            shopActivityAction.getShopActivityBannerPost(this.activityId)
            shopActivityAction.getShopActivityListPost(list,this.pageNow,this.pageSize,this.activityId,(ary)=>{
                if(ary.length>=this.pageSize){
                    this.pageSize++
                }
                else{
                    this.getMoreData=false;
                }
            })
        }
    }
    getHearView(){
        const banners=this.props.shopActivity.barnnerAndTemplateId.banners;
        console.log(banners.length)
        return(
            <div className="activityHearder">
                {banners.map((data,index)=>{
                    return(
                        <img key={index} src={data.hostUrl+data.fileUrl} onClick={()=>{this.clickToJumpUrl(data.linkUrl)}}>
                        </img>
                    )
                })}
            </div>
        )
    }
    clickToJumpUrl(url){
        if(url){
            window.location=url;
        }
    }
    render(){
        const {list,barnnerAndTemplateId}=this.props.shopActivity;
        return(
            <div>
                <ListView
                    dataSource={this.state.dataSource.cloneWithRows(list)}
                    renderRow={this.getRow.bind(this)}
                    style={{
                        height: document.documentElement.clientHeight,
                    }}
                    pageSize={5}
                    scrollRenderAheadDistance={200}
                    scrollEventThrottle={20}
                    initialListSize={5}
                    onEndReachedThreshold={10}
                    renderHeader={this.getHearView.bind(this)}
                    scrollerOptions={{scrollbars: true}}
                    className="handleSaleListView"
                    onEndReached={this.onEndReached.bind(this)}
                />
                {this.props.shopActivity.isShowLoading?<div className="loadingView"></div>:null
                }
            </div>
        )
    }
}