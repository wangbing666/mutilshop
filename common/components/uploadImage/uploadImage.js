/**
 * Created by Song on 2018/07/13
 * 图片上传组件 UI参考上传投诉证据页面
 */

import React, { Component } from "react";
import "./uploadImage.less";
import SvgImg from "../../svgImage/svgImg";
import { Icon } from 'antd-mobile';

export default class uploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addImg, deleteImg, previewImg, imgList, imgCount } = this.props;
    return (
      <div className="clear">
        {imgList.map((item, index) => (
          <div className="preview" key={index}>
            <img src={item} onClick={() => previewImg(index)} />
            <div className="delete" onClick={() => deleteImg(index)}>
              <Icon type="cross-circle-o" color="#6D6D72" className="icon" />
            </div>
          </div>
        ))}
        {imgCount < 5 ? (
          <div className="upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={e => addImg(e)}
            />
            <SvgImg
              className="icon"
              style={{ fill: "#6D6D72" }}
              xlinkHref="#wedo-wedoicon-30"
            />
            <div>
              {imgCount === 0
                ? `上传凭证(最多5张)`
                : `还可继续(上传${5 - imgCount}张)`}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
