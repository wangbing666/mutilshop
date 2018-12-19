/**
 * Created by JieLi on 2017/11/18.
 */

import React,{Component} from 'react';

export default class SvgImg extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

      render(){
          return(
              <svg className={this.props.className} aria-hidden="true" style={this.props.style}>
                  <use xlinkHref={this.props.xlinkHref}></use>
              </svg>
          )
      }


}
