/**
 * Created by jieli on 2017/7/6.
 * 收货地址列表
 */
import React, { Component } from 'react';
import { Menu, ActivityIndicator, NavBar, Modal } from 'antd-mobile';
import './addressList.less'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants';
import { wxShare } from '../../../common/Apis/wxJsApis';
import SvgImg from '../../../common/svgImage/svgImg'

const alert = Modal.alert;

let userId = '';
export default class AddressList extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
    };
  }
  render() {
    const { addressLists, addressListAction } = this.props;
    return (
      <div className="addressContainer">
        <div className="addressList">
          <div className="addShopAddress" onClick={() => { this.addReceiptAddress() }}>
            <p>+</p>
            <p>添加新地址</p>
          </div>
          <ul>
            {
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}>
                {this.addlist()}
              </ReactCSSTransitionGroup>

            }
          </ul>

        </div>
        {addressLists.isShow ? <div className="loadingView"><div className="loadingImg"></div></div> : null}


      </div>
    );
  }

  /*加载框插件
  * <ActivityIndicator
   toast
   text="Loading..."
   animating={addressLists.isShow}
   />
  * */

  addlist() {
    const { addressLists, addressListAction } = this.props;
    var that = this;
    return (
      addressLists.addressList.map(function (data, i) {
        return (
          <li key={i} className="address">
            <div className="topAddress" onClick={() => { that.backToTopView(i) }}>
              <span className="customer">{data.receiveName}</span>
              <span className="tel">{data.phone}</span>
              <p className="detailAdd">{data.shopAdress}</p>
            </div>
            <div className="bottomAddress">
              <div className="defaultSel" onClick={() => { that.changeState(data.isdefault, i) }}>
                {data.isdefault ?
                  <SvgImg xlinkHref='#wedo-wedoicon-13' className="selectedIcon" style={{ fill: "#6d6d72" }} />
                  :
                  <p></p>

                }

                <span>默认地址</span>
              </div>
              <div className="edit" onClick={() => that.editReceiptAddress(data)}>
                <img src={require('../../images/shippingAddress/k8.png')}></img>
                {/*<span>编辑</span>*/}
              </div>
              <div className="delete" onClick={() => { that.alertDeleteBox(i, data.receiveId) }}>
                <img src={require('../../images/shippingAddress/k9.png')}></img>
                {/*<span>删除</span>*/}
              </div>
            </div>
          </li>
        )
      })
    )
  }


  //返回上一页面
  backToTopView(index) {
    if (this.props.location.state.pageType == 'settlement') {
      const { addressLists, addressListAction } = this.props;
      let data = addressLists.addressList[index];
      contants.addressInfo = data;
      this.props.history.goBack();
      // this.props.location.state.selectAddress(data);
    }
  }

  componentWillMount() {
    document.title = '收货地址';
    const { history } = this.props;
    let userInfo = db.readUserInfo();
    if (!userInfo) {
      let url = contants.commonUrl + '/login/?path=addressList'
      history.replace({
        pathname: url,
      })
    }
  }

  componentDidMount() {
    wxShare([], {});
    this.getAddressList();
  }

  //获取收货地址列表
  getAddressList() {
    let userId = db.readUserInfo()['userId'];
    const { addressLists, addressListAction } = this.props;
    var data = { userId: userId }
    // console.log(db.readUserInfo().userId)
    addressListAction.getAddressListData('/adress/getAddress', data);
  }

  //更改默认地址
  changeState(state, index) {
    // const {addressLists,addressListAction} = this.props;
    // var data = addressLists.addressList;
    //
    // data[index].isdefault = data[index].isdefault?0:1;
    // for(var i=0;i<data.length;i++){
    //     if(i!= index && data[index].isdefault==1){
    //         data[i].isdefault = 0;
    //     }
    // }
    // var requireData = {userId:10001,adressId:data[index].receiveId}
    // addressListAction.changeDetailAddress('/adress/isDefault',requireData,data);

    if (state == 0) {
      const { addressLists, addressListAction } = this.props;
      var data = addressLists.addressList;

      for (var i = 0; i < data.length; i++) {
        if (data[i].isdefault == 1) {
          data[i].isdefault = 0;
        }
      }
      data[index].isdefault = 1;
      var requireData = { userId: userId, adressId: data[index].receiveId }
      addressListAction.changeDetailAddress('/adress/isDefault', requireData, data);
    }

  }

  //编辑收货地址
  editReceiptAddress(data) {
    const { addressLists, addressListAction } = this.props;

    var allData = addressLists.addressList;
    const { history } = this.props;
    history.push({
      pathname: contants.commonUrl + '/editReceiptAddress',
      state: {
        pageType: 'edit',
        addressInfo: data,
        dataLength: allData.length
      },

    });
  }

  //弹出是否删除弹出框
  alertDeleteBox(index, receiveId) {
    this.alertObject = alert('', '确认要删除此收货地址吗?', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.deleteAddress(index, receiveId) },
    ])
  }

  componentWillUnmount() {
    if (this.alertObject) {
      this.alertObject.close();
    }
  }

  //删除收货地址
  deleteAddress(index, receiveId) {
    const { addressLists, addressListAction } = this.props;
    var data = addressLists.addressList;
    data.splice(index, 1);
    var requireData = { userId: userId, adressId: receiveId }
    addressListAction.deleteReceiptAddress('/adress/deleteAddress', requireData, data);

    if (contants.addressInfo && contants.addressInfo.receiveId == receiveId) {
      contants.addressInfo = null;
    }
  }

  // 新增收货地址
  addReceiptAddress() {

    const { history, location } = this.props;
    let addDress_s = null;

    if (location.state && location.state.hasOwnProperty("newAdress_sh")) {
      addDress_s = location.state.newAdress_sh;
    }

    const { addressLists, addressListAction } = this.props;
    var data = addressLists.addressList;
    history.push({
      pathname: contants.commonUrl + '/editReceiptAddress',
      state: {
        pageType: 'add',
        dataLength: data.length,
        newAdress: addDress_s
      },

    });
  }


}