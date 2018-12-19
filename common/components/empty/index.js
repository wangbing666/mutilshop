/**
 * Created by Song on 2018/07/24
 * 无搜索结果component
 */

import React, { Component } from "react";
import "./index.less";

export default class empty extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message } = this.props;
    return (
      <div className="name-space-empty">
        <img src={require("../../images/empty.png")}/>
        <p>{message}</p>
      </div>
    );
  }
}
