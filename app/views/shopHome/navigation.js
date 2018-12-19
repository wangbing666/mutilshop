/**
 * Created by AndyWang on 2017/7/8.
 */
import React, { Component } from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants'
import * as Util from '../../../common/Apis/Utils';
import SvgImg from '../../../common/svgImage/svgImg';
import { Icon } from 'antd-mobile'

export default class Navigation extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NavigationHome">
        <Icon type="left" className="header-back-btn" />
        {/*调用原生方法onClick={()=>{this.TowGoSearch()}}*/}
        <div className="title">
          {Util.cutOutStr(this.props.title, 8)}
        </div>
        <div className="shoppongCat" >
          <img src={require('../../images/homePage/shareIcon.png')} />
        </div>
      </div>
    )
  }
}