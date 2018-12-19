/**
 * Created by JieLi on 2017/7/8.
 * 编辑收货地址
 */
import React, { Component } from 'react';
import { TextareaItem, Picker, List, InputItem, Toast, ActivityIndicator, Switch } from 'antd-mobile';
import { post } from '../../../common/Apis/Fetch'
import * as db from '../../../common/Apis/Utils';
import './editReceiptAddress.less';
import { wxShare } from '../../../common/Apis/wxJsApis';
import * as contants from '../../../common/Apis/constants'
import { withRouter } from 'react-router-dom';
import SvgImg from '../../../common/svgImage/svgImg'

import { areaInfo } from './regionalData'
import { createForm } from 'rc-form';

let userId = '';

class EditReceiptAddress extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      isShow: false,
      addressId: '',
      defaultAddress: true,
      areaNameCode: [],
      receiptName: '',
      receiptTel: '',
      receiptAddress: '',
      nameFocus: 0,
      telFocus: 0,
      beginSwitch: true,
      clicked: false
    };
    this.colorDic = contants.viewStyDic;
  }

  selectImage() {
    return (
      this.state.defaultAddress
        ?
        <SvgImg xlinkHref='#wedo-wedoicon-13' className="selectedIcon" />
        :
        <p></p>

    )
  }


  /*
   {this.state.receiptName&&this.state.receiptTel&&this.state.areaNameCode.length&&this.state.receiptAddress
   ?
   <div className="saveAddress">
   <p onClick={()=>{this.saveAddress()}}>保存</p>
   </div>
   :
   <div className="disableBtn">
   <p>保存</p>
   </div>
   }
   */

  render() {
    let borderR;
    if (this.colorDic['SHAPE'] == 3) {
      borderR = 'btnSemicircle';
    } else if (this.colorDic['SHAPE'] == 2) {
      borderR = 'btnCircular';
    } else {
      borderR = 'btnNoCircular';
    }

    // 新加入滑动开关
    let SwitchExample = (props) => {
      const { getFieldProps } = props.form;

      return (
        <List>
          <List.Item extra={<Switch
            {...getFieldProps('Switch1', {
              initialValue: this.state.beginSwitch,
              valuePropName: 'checked',
            })}
            onClick={(checked) => {
              // let addressState = this.state.defaultAddress;
              this.setState({
                defaultAddress: checked,
                beginSwitch: checked,
                nameFocus: 0,
                telFocus: 0,
                clicked: true,
              });
            }}

          />}>设为默认地址</List.Item></List>
      )
    };
    SwitchExample = createForm()(SwitchExample);
    const AreaChoose = props => (
      <div
        onClick={props.onClick}
        style={{}}
      >
        <div className="areaChoose">
          <p>{props.children}</p>
          <p ref={node => (this.address = node)}>{props.extra}</p>
          <img src={require('../../images/shippingAddress/k12.png')}></img>
        </div>
      </div>
    );
    return (
      <div className="containV">

        <div className="receiptPeople">
          <div className="name">
            <p>收货人</p>
            <input id="name" required="required" ref='name' onFocus={() => this.showNameClearBtn(1)} type="text" placeholder="请输入姓名" maxLength="20" value={this.state.receiptName} onChange={(e) => this.setReceiptName(e)} />
            {this.state.receiptName && this.state.nameFocus
              ?
              <img src={require('../../images/shippingAddress/n6@1x.png')} className="clear-input" onClick={() => this.clearNameInput({ receiptName: '' })} />
              :
              null
            }
          </div>
          <div className="userTel">
            <p>手机</p>
            <input id="tel" required="required" ref="tel" placeholder="请输入手机号码" onFocus={() => this.showTelClearBtn(1)} maxLength="11" type="tel" value={this.state.receiptTel} onChange={(e) => this.setReceiptTel(e)} />
            {this.state.receiptTel && this.state.telFocus
              ?
              <img className="clear-input" src={require('../../images/shippingAddress/n6@1x.png')} onClick={() => this.clearTelInput({ receiptTel: '' })} />
              :
              null
            }

          </div>

        </div>
        <div className="selectArea">

          <Picker
            extra="请选择区域"
            data={areaInfo}
            value={this.state.areaNameCode}
            onChange={e => this.setState({ areaNameCode: e })}
            onOk={() => this.hiddenClearBtn()}
            onDismiss={() => this.hiddenClearBtn()}
          >
            <AreaChoose>所在地区</AreaChoose>
          </Picker>


          <TextareaItem
            id="detailsAdd"
            title="详细地址"
            placeholder="请输入详细地址"
            data-seed="logId"
            autoFocus
            autoHeight
            value={this.state.receiptAddress}
            onChange={(e) => { this.setReceiptAddress(e) }}
            maxLength="50"
          />
        </div>

        <div className="defaultAddress">
          <SwitchExample />
        </div>

        <div className="saveAddress">
          <p onClick={() => { this.saveAddress() }} style={{ backgroundColor: this.colorDic['COLOR1'], color: this.colorDic['COLOR3'] }} className={borderR}>保存</p>
        </div>

        {this.state.isShow ? <div className="loadingView"><div className="loadingImg"></div></div> : null}


      </div>
    )
  }

  //设置输入框的值
  setReceiptName(param) {
    this.setState({
      receiptName: param.target.value
    });
  }

  setReceiptTel(param) {
    this.setState({
      receiptTel: param.target.value
    });
  }

  setReceiptAddress(param) {
    this.setState({
      receiptAddress: param,
      nameFocus: 0,
      telFocus: 0
    });
  }

  hiddenClearBtn(e) {
    this.setState({
      nameFocus: 0,
      telFocus: 0
    });
  }


  //清楚输入框内容
  clearNameInput(param) {
    this.refs.name.focus();
    this.setState({
      receiptName: ''
    });
  }
  clearTelInput() {
    this.refs.tel.focus();
    this.setState({
      receiptTel: ''
    });
  }

  //设置清除按钮是否显示
  showNameClearBtn(param) {

    this.setState({
      nameFocus: param,
      telFocus: 0
    });
  }
  showTelClearBtn(param) {
    this.setState({
      telFocus: param,
      nameFocus: 0
    });
  }

  componentWillMount() {
    console.log(this.props.location.state)
    if (this.props.location.state) {
      if (this.props.location.state.pageType == 'edit') {
        if (db.userAgent() === 'Android') {
          document.title = '编辑收货地址';
        } else {
          db.setPageTitle('编辑收货地址');
        }
      } else {
        if (db.userAgent() === 'Android') {
          document.title = '新增收货地址';
        } else {
          db.setPageTitle('新增收货地址');
        }
      }
    } else {
      this.props.history.push({
        pathname: contants.commonUrl + '/addressList',
      });
    }
  }





  componentDidMount() {
    wxShare([], {});
    const { history } = this.props;
    contants.currentHistory = history;
    userId = db.readUserInfo().userId;
    if (this.props.location.state.dataLength == 0) {
      this.setState({
        defaultAddress: true
      });
    }

    if (this.props.location.state.addressInfo) {
      let addressInfo = this.props.location.state.addressInfo;
      this.setState({
        areaNameCode: [addressInfo.provinceCode, addressInfo.cityCode, addressInfo.countryCode],
        receiptName: addressInfo.receiveName,
        receiptTel: addressInfo.phone,
        receiptAddress: addressInfo.adress,
        addressId: addressInfo.receiveId,
        beginSwitch: addressInfo.isdefault
      });

    }

  }

  //保存地址
  saveAddress() {
    let name = this.trimSpace(document.getElementById('name').value);
    let tels = this.trimSpace(document.getElementById('tel').value);
    let details = this.trimSpace(document.getElementById('detailsAdd').value);
    let code = this.state.areaNameCode;
    let SpcialRegx = new RegExp(`^[\u4E00-\u9FA5A-Za-z0-9()（）]+$`);

    // 新增：如果是下单时选择新增地址，则保存后直接调回下单页面
    let new_addRes = this.props.location.state.newAdress;

    // console.log('保存地址')
    if (!name) {
      Toast.info('请输入姓名!', 1);
      return;
    }
    if (!SpcialRegx.test(name) || !SpcialRegx.test(details)) {
      Toast.info('姓名或详细地址中不能含有特殊字符!', 2);
      return;
    }
    if (!tels) {
      Toast.info('请输入电话号码!', 1);
      return;
    }
    if (!this.isPhoneNum(tels)) {
      return;
    }
    if (!code.length) {
      Toast.info('请选择区域!', 1);
      return
    }
    if (!details) {
      Toast.info('请输入地址!', 1);
      return;
    }

    let defaultS;
    if (this.state.clicked) {
      if (this.state.defaultAddress) {
        defaultS = 1;
      } else {
        defaultS = 0;
      }
    } else {
      //console.log("this.props.location.state+++=",this.props.location.state);
      defaultS = this.props.location.state.addressInfo ? this.props.location.state.addressInfo.isdefault : 1
    }

    let requireData;
    let address = this.address.innerHTML.replace(/,/g, "")
    if (this.state.addressId) {

      requireData = { userId: userId, isdefault: defaultS, receiveName: name, phone: tels, provinceCode: code[0], cityCode: code[1], countyCode: code[2], adress: details, adressId: this.state.addressId, briefAddress: address };

    } else {
      requireData = { userId: userId, isdefault: defaultS, receiveName: name, phone: tels, provinceCode: code[0], cityCode: code[1], countyCode: code[2], adress: details, adressId: 0, briefAddress: address };

    }
    // console.log(requireData)
    this.setActivityIndicator(true);
    post('/adress/insertOrudate', requireData, (response) => {
      let that = this;
      that.setActivityIndicator(false)
      if (new_addRes) {
        that.props.history.goBack();
        that.props.history.goBack();
      } else {
        that.props.history.goBack();
      }


    }, (error) => {
      let that = this;
      that.setActivityIndicator(false)
      Toast.info('保存失败,请稍后再试', 1);
      // console.log(error);
    }, this.props.history)

  }

  setActivityIndicator(isShow) {
    this.setState({
      isShow: isShow
    });
  }


  //电话号码校验
  isPhoneNum(phoneNum) {
    var partten = /^1[3|4|5|7|8][0-9]{9}$/;
    if (partten.test(phoneNum)) {
      return true;
    }
    else {
      Toast.info('请输入正确号码!', 1);
      return false;
    }
  }
  //去除字符串前后空格
  trimSpace(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }



}
export default withRouter(EditReceiptAddress)