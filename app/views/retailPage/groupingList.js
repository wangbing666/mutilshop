/**
 * Created by andyWang on 2017/10/27.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import GroupingPopup from './groupingPopup';//分组名称弹出框

let that=null
let index=[0];

export default class ViewMore extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            GroupingPopup:false,
            selectIndex:0
        }
        this.lastSelect=0;
    }

    componentDidMount() {
        const {RetailPage}=this.props;
        that=this;
        window.clickCell=function(event,selectIndex){
            if(contants.shopPreView!=1) {
                that.setState({selectIndex:selectIndex})
                if(that.props.selectCategory){
                    that.props.selectCategory(that.props.groupingListData[selectIndex].groupId)
                }
                index[1]=index[0];
                index[0]=$(event.target).parent().attr('data-swiper-slide-index');
              
                $(event.target).addClass(that.getStyle()).parent().siblings().find('.ddd').removeClass(that.getStyle());
            }
        }
        // this.timer = setInterval(()=>{
       //      let dic= HomePage.shopData;
       //      let selectType = dic.fitmentId;//店铺模板
       //      let groupingListData=this.props.groupingListData?this.props.groupingListData:[];
       //      if(selectType!=null&&groupingListData.length>0){
       //          clearTimeout(this.timer);
       //          this.updateSwiper()
       //      }
       //      else{
       //      }
       //  },500)`
    }
    getStyle(){
        const {RetailPage}=this.props;
        let dic= RetailPage.shopData;
        let selectType = dic.fitmentId;//店铺模板
        if(selectType===1){
            return 'selectCell'
        }
        else{
            return 'redSelectCell'
        }
    }
    componentWillReceiveProps(nextProps) {
        // console.log('categeroy componentWillReceiveProps')
        // if(nextProps!=this.props){
        //     this.updateSwiper();
        // }
    }
    updateSwiper(){
        // console.log('grouplist00000000   updateSwiper')
        const {RetailPage}=this.props;
        let dic= RetailPage.shopData;
        let selectType = dic.fitmentId;//店铺模板
        let groupingListData=this.props.groupingListData?this.props.groupingListData:[];
        if(!this.swiper&&groupingListData.length>0&&selectType&&selectType!=5){
          
            let that = this;
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 3,
                preventClicks : false,//默认true
                on:{
                    touchMove: function(event){
                       
                        $('.swiper-slide').each(function(i,val){
                            if($(val).attr('data-swiper-slide-index')==index[0]){//本次点击
                                
                                $(val).find('.ddd').addClass(that.getStyle());
                            }
                            if($(val).attr('data-swiper-slide-index')==index[1]){//上次点击
                              
                                $(val).find('.ddd').removeClass(that.getStyle());
                            }
                        });
                    },
                    transitionEnd: function(swiper){
                     
                        $('.swiper-slide').each(function(i,val){

                            if($(val).attr('data-swiper-slide-index')==index[0]){//本次点击
                               
                                $(val).find('.ddd').addClass(that.getStyle());
                            }
                            if($(val).attr('data-swiper-slide-index')==index[1]){//上次点击
                    
                                $(val).find('.ddd').removeClass(that.getStyle());
                            }
                        });
                    },
                },
                virtual: {
                    slides: (function () {
                        var slides = [];
                        groupingListData.map((val,index)=>{
                            // let dicView = '<div key1="1" onclick="clickCell('+index+')">'+val.groupName+'</div>'
                            let dicView = '<div class="ddd"  onclick="clickCell(event,'+index+')">'+val.groupName+'</div>';
                            if(index===0){
                                if(selectType==1){
                                    dicView = '<div class="ddd selectCell"  onclick="clickCell(event,'+index+')">'+val.groupName+'</div>';
                                }
                                else{
                                    dicView = '<div class="ddd redSelectCell"  onclick="clickCell(event,'+index+')">'+val.groupName+'</div>';
                                }
                            }
                            slides.push(dicView)
                        })
                        return slides;
                    }()),
                },
            });
            this.swiper = swiper;
        }
    }

    componentDidUpdate() {
    }
    render() {
        const {RetailPage}=this.props;
        let dic= RetailPage.shopData;
        let type =dic.fitmentId?dic.fitmentId:5;
        let groupingListData=this.props.groupingListData?this.props.groupingListData:[];
        let groupingListDataFive = groupingListData?groupingListData.slice(0,5):[]
        if(type===5){
            groupingListDataFive = groupingListDataFive.slice(0,1);
        }
        switch (type){
            case -1:
                return (
                    <div>
                        <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData} viewStyDic={this.props.viewStyDic} selectCallback={(grounpId,index)=>{this.selecCallBack(grounpId,index)}} />
                        <div className="GroupingList" >
                            <div className="GroupingLeft">
                                <div className="GroupingTitleBody">
                                    {
                                        groupingListDataFive.map((val,index)=>{
                                            if(index===this.state.selectIndex){
                                                return(
                                                    <div className="selectGroupingTitle" key={index} onClick={()=>this.selectGroup(val.groupId,index)}>
                                                        <div className="TitleDiv">
                                                            <span>{val.groupName}</span>
                                                        </div>
                                                        <div className="line"></div>
                                                    </div>
                                                )
                                            }
                                            else{
                                                return(
                                                    <div className="GroupingTitle" key={index} onClick={()=>this.selectGroup(val.groupId,index)}>
                                                        <div className="TitleDiv">
                                                            <span>{val.groupName}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div className="GroupingRight">
                                <div className="GroupingRBg">
                                </div>
                                <div className="GroupingRIng" onClick={()=>{this.goPopupBody()}}>
                                    <img src={require('../../images/homePage/arrow2014.png')} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 1:
            case 2:
            case 3:
            case 4:
                return (
                    <div>
                        <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData}
                                       selectIndex={this.state.selectIndex}
                                       type={type}
                                       selectCallback={(grounpId,index)=>{this.selecCallBack(grounpId,index)}} />
                        <div className="GroupingList1 borderBottoms" >
                            <div className="swiper-container">
                                <div className="swiper-wrapper"></div>
                            </div>
                            <div className="GroupingRight">
                                <div className="GroupingRBg">
                                </div>
                                <div className="GroupingRIng" onClick={()=>{this.goPopupBody()}}>
                                    <img src={require('../../images/homePage/arrow2014.png')} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break
            case -2:
                return (
                    <div>
                        <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData} viewStyDic={this.props.viewStyDic} />
                        <div className="GroupingList" >
                            <div className="GroupingLeft">
                                <div className="GroupingTitleBody">
                                    {
                                        groupingListDataFive.map((val,index)=>{
                                            if(index===this.state.selectIndex){
                                                return(
                                                    <div className="redSelectGroupingTitle" key={index} onClick={()=>this.selectGroup(val.groupId,index)}>
                                                        <div className="TitleDiv">
                                                            <span>{val.groupName}</span>
                                                            <div className="line"></div>

                                                        </div>
                                                        <div className="line"></div>
                                                    </div>
                                                )
                                            }
                                            else{
                                                return(
                                                    <div className="GroupingTitle" key={index} onClick={()=>this.selectGroup(val.groupId,index)}>
                                                        <div className="TitleDiv">
                                                            <span>{val.groupName}</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                            <div className="GroupingRight">
                                <div className="GroupingRBg">
                                </div>
                                <div className="GroupingRIng" onClick={()=>{this.goPopupBody()}}>
                                    <img src={require('../../images/homePage/arrow2014.png')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 5:
                return (
                    <div>
                        <GroupingPopup id="GroupingPopup" {...this.props} groupingData={groupingListData}
                                       selectIndex={this.state.selectIndex}
                                       type={type}
                                       selectCallback={(grounpId,index)=>{this.selecCallBack(grounpId,index)}} />
                        <div className="GroupingList1" >
                            <div className="GroupingLeft">
                                <div className="GroupingTitleBody">
                                    {
                                        groupingListDataFive.map((val,index)=>{
                                            return(
                                                <div className="groupingTitleFive" key={index} onClick={()=>this.selectGroup(val.groupId,index)}>
                                                    <div className="TitleDiv">
                                                        <span>{val.groupName}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="GroupingRightFive" onClick={()=>{this.goPopupBody()}}>
                                <div className="verticalLine"/>
                                <div className="category">
                                    分类
                                </div>
                                <img src={require('../../images/homePage/arrow2014.png')} />

                            </div>
                        </div>
                    </div>
                )
                break;
            default:
                return(<div/>)
        }
    }
    goPopupBody(){
        if(contants.shopPreView!=1) {
            document.getElementById("GroupingPopup").className="GroupingPopup show";
        }
    };

    selecCallBack(groupId,index1){//选择分组回调
        this.setState({selectIndex:index1})
        const {RetailPage}=this.props;
        let dic= RetailPage.shopData;
        let selectType = dic.fitmentId;//店铺模板
        if(selectType!=5){
            if(index1!=index[0])
            {
                index[1]=index[0];
                index[0]=index1
                $('.swiper-slide').each(function(i,val){

                    if($(val).attr('data-swiper-slide-index')==index[0]){//本次点击
                  
                        $(val).find('.ddd').addClass(that.getStyle());
                    }
                    if($(val).attr('data-swiper-slide-index')==index[1]){//上次点击
                     
                        $(val).find('.ddd').removeClass(that.getStyle());
                    }
                });
                this.swiper&&this.swiper.slideTo(index1, 0,true);
            }
        }
        if(this.props.selectCategory){
            this.props.selectCategory(groupId)
        }
    }

    selectGroup(groupId,index){//选择分组
        if(contants.shopPreView!=1) {
            this.setState({selectIndex:index})
            if(this.props.selectCategory){
                this.props.selectCategory(groupId)
            }
        }
    }
}