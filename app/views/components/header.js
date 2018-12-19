/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import {Icon} from 'antd-mobile';

export default class Navigation extends Component {
    constructor(props){
        super(props)
        {
            this.state={
            }
        }
    }

    componentDidMount() {
    }
      //返回上一级
  goBack() {
    history.back() 
  }
    render() {
        let {titleTxt} = this.props;
        return (
          <div className="public-top-status-bar clear">
             <Icon type="left" className="header-back-btn" onClick={this.goBack.bind(this)} />
            <div className="clear titleName">{titleTxt}</div>
         </div>
        )
    } 
}
