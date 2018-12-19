/**
 * Created by Song on 2018/07/05
 * 多店购物板块首页搜索框跳转搜索页
 */
import React, { Component } from "react";
import "./search.less";
import { Icon, Modal } from "antd-mobile";
import * as contants from "../../../common/Apis/constants";
import * as db from "../../../common/Apis/Utils";
import SvgImg from '../../../common/svgImage/svgImg'
import Header from '../components/header';
import { util } from "protobufjs";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      focused: false,
      searchHistory: []
    };
  }
  componentWillMount() {
    let history = localStorage.getItem("historySearch") || JSON.stringify([]);
    this.setState({
      searchHistory: JSON.parse(history)
    });
  }
  componentDidMount() {
    this.refs.input.focus()
  }

  setKeyword(e) {
    let value = e.target.value;
    this.setState({
      keyword: value
    });
  }
  onFocus() {
    this.setState({
      focused: true
    });
  }
  onBlur() {
    setTimeout(() => {
      this.setState({
        focused: false
      });
    }, 200);
  }
  confirm(e) {
    document.activeElement.blur();//软盘消失
    e.preventDefault();
    let key = this.state.keyword.trim();
    if(key.length === 0){
      return
    }
    let history = this.state.searchHistory.slice(0);
    let index = -1;
    for(let i = 0;i<history.length;i++){
      if(history[i].searchName === key){
        index = i;
        break;
      }
    }
    // let index = history.indexOf({searchName: key})
    if(index !== -1){
      history.splice(index,1);
    }
    history.unshift({searchName: key});
    if(history.length > 10){
      history.length = 10;
    }
    localStorage.setItem('historySearch', JSON.stringify(history))
    this.setState({searchHistory: history})
    const { Search2Actions } = this.props;
    Search2Actions.setKeyword(key);
    //测试----
    this.props.history.push('searchResult')
  //  let url = contants.multishopUrl+"/searchResult";
  //  db.goToPageForApp(url,true);
  }
  clearSearchHistory() {
    //清空搜索历史记录
    Modal.alert("确认删除全部历史记录?", "", [
      { text: "取消", onPress: () => null },
      {
        text: "确定",
        onPress: () => {
          this.setState({
            searchHistory: []
          });
          localStorage.removeItem("historySearch");
        }
      }
    ]);
  }
  clearItem(index) {
    //删除单项搜索历史
    let history = this.state.searchHistory.slice(0);
    history.splice(index, 1);
    this.setState({
      searchHistory: history
    });
    localStorage.setItem("historySearch", JSON.stringify(history));
  }
  //取消，返回上一页
  cancelSearch() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/kaBao_UU_Wedo/i) == "kabao_uu_wedo") {
      db.goBackPrevPage()
    } else {
      this.props.history.go(-1);
    }
  }
  setInputValue(index) {
    let history = this.state.searchHistory.slice(0);
    let current = history[index];
    history.splice(index,1);
    history.unshift(current);
    this.setState({
      keyword: current.searchName,
      searchHistory: history
    })
    localStorage.setItem("historySearch", JSON.stringify(history));
    const { Search2Actions } = this.props;
    Search2Actions.setKeyword(current.searchName);
    this.props.history.push('searchResult');
  //  this.props.history.push({
  //         pathname:contants.commonUrl+'/searchResult'
  //      });
  //   let url = contants.multishopUrl+"/searchResult";
  //  db.goToPageForApp(url,true);
  }
  clearInputValue() {
    this.setState({
      keyword:''
    })
  }
  render() {
    const focused = this.state.focused;
    const searchHistory = this.state.searchHistory;
    let userInfo=db.readUserInfo();
    console.log(localStorage.getItem("historySearch"))
    return (
      <div className="root name-space-search2">
        <div className={db.userAgent()!=='IOS' ? "searchNav": userInfo && userInfo.bang ? "navPad48 searchNav":"navPad22 searchNav"}>
          <form className="form-input clear" action="javascript:return true;" onSubmit={e => this.confirm(e)}>
            {
              this.state.keyword?null:<SvgImg className="search-icon" style={{fill:'#B6B6B8'}} xlinkHref="#wedo-wedoicon-32"></SvgImg>
            }
            <input
              ref="input"
              type="search"
              placeholder="请输入搜索关键词"
              onChange={e => this.setKeyword(e)}
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              value={this.state.keyword}
              maxLength="27"
              autoFocus="autofocus"
              className={this.state.keyword?'padding-1':''}
            />
            {
              this.state.focused && this.state.keyword?<Icon className="clear-icon" onClick={() => this.clearInputValue()} type="cross-circle-o" color="#B6B6B8" />:null
            }
            <div onClick={this.cancelSearch.bind(this)}>取消</div>
          </form>
             {searchHistory.length ? (
              <div className="title">
                <span>历史搜索</span>
                <div className="del-icon" onClick={this.clearSearchHistory.bind(this)}>
                  <SvgImg style={{fill:'#B6B6B8'}} xlinkHref="#wedo-wedoicon-22"></SvgImg>
                </div>
              </div>) : null}
          </div>
        {searchHistory.length ? (
          <div className={db.userAgent()!=='IOS' ? "contTop list-wrap": userInfo && userInfo.bang ? "contTop48 list-wrap":"contTop22 list-wrap"}>
            {searchHistory.map((item, index) => (
              <div className="item clear" key={index}>
                <span onClick={this.setInputValue.bind(this, index)}>{item.searchName}</span>
                <Icon type="cross-circle-o" color="#B6B6B8" onClick={() => this.clearItem(index)} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
