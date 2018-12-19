import React, { Component } from "react";
import { Modal, ListView, Icon, SwipeAction, List, PullToRefresh } from "antd-mobile";
import ReactDOM from 'react-dom';
import * as contants from "../../../common/Apis/constants";
import * as Util from "../../../common/Apis/Utils";
import './shopList.less';
import Empty from '../../../common/components/empty';

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      height: document.documentElement.clientHeight,
    }
    this.pageSize = 10;
  }

  componentDidMount() {
    if (this.lv) {
      /*const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      this.setState({
        height: hei,
      })*/
    }
  }

  //进入店铺详情
  toShop(shopId, shopType) {
    // window.location = contants.flagshipUrl+`/?shopId=${shopId}`;
    let shopDetailUrl = "";
    if (shopType == 1) {
      shopDetailUrl = contants.multishopUrl + `/retailPage/?shopId=${shopId}`;
    } else {
      shopDetailUrl = contants.multishopUrl + `/shopDetail/?shopId=${shopId}`;
    }
    Util.goToPageForApp(shopId, shopDetailUrl, false);
  }

  delete(collectId, index) {
    const { CollectionActions, Collection } = this.props;
    CollectionActions.deleteCollection('/goods/deleteCollectionById', {
      collectionId: collectId,
    }, 2, Collection.shopList, index);
  }

  doDateFn(timestamp) { //日期格式化处理
    if (!timestamp) return "";
    var date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    return Y + M + D;
  }

  doShopStatusFn(status, stock) { //处理店铺的状态
    if (status == 1) {
      return stock == 0 ? "已售罄" : null;
    } else if (status == 0 || status == 3) {
      return "已失效";
    } else if (status == 2) {
      return "已下架";
    }
  }

  // search() {
  //   const { Collection } = this.props;
  //   let keyWord = Collection.keyWord;
  //   let data = {
  //     keyWord: keyWord,
  //     userId: Util.readUserInfo()['wedoId']
  //   }
  //   this.props.search(data)
  // }


  //封装 查询。。。
  search(array, params) {
    const { Collection } = this.props;
    let keyWord = Collection.keyWord;
    let data = {
      name: keyWord,
      userId: Util.readUserInfo()['wedoId'],
      pageSize: this.pageSize,
      pageIndex: params && params.pageNow ? params.pageNow : 1
    }
    this.props.search(array, "/goods/getShoppingShopList", data, 2)
  }


  render() {
    let { Collection } = this.props;
    // console.log("店铺收藏列表",Collection.shopList,Collection.shopTotal);
    const dataSource = this.state.dataSource.cloneWithRows(Collection.shopList);
    let row = (row, rowId, rowIndex) => {
      return (
        <SwipeAction
          autoClose
          right={[
            {
              text: '取消',
              style: { backgroundColor: '#e9e9e9', color: '#6D6D72', width: '120px', fontSize: '28px' },
            },
            {
              text: '删除',
              onPress: () => this.delete(row.collectionId, rowIndex),
              style: { backgroundColor: '#FF2D55', color: 'white', width: '120px', fontSize: '28px' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <div className="productItem clear" key={row.collectionId} onClick={this.toShop.bind(this, row.shopId, row.shopType)}>
            <div className="img-wrap">
              <img src={row.zoomUrl} />
              {row.isFrozen == 2 ? <div>已失效</div> : null}
            </div>
            <div className="desc">
              <h2>{Util.cutOutStr(row.shopName, 12)}</h2>
              <div className="price clear">
                <p>收藏时间：{this.doDateFn(row.createTime)}</p>
              </div>
            </div>
          </div>
        </SwipeAction>
      )
    }
    return (
      // {Util.userAgent()!=='IOS' ? "top170 name-space-cplist":userInfo.bang ? "top220 name-space-cplist":"top192 name-space-cplist"}
      <div className={Util.userAgent() == 'IOS' ? "name-space-cslist" : 'name-space-cslist'}>
        {Collection.shopTotal === 0 ? <div style={{ height: document.documentElement.clientHeight }}><Empty message={'很抱歉！没有找到收藏的店铺~'} /></div> : <ListView
          ref={el => this.lv = el}
          dataSource={dataSource}
          // renderHeader={() => <span></span>}
          pullToRefresh={<PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />}
          style={{
            overflow: 'scorll',
            marginTop: '2.2666rem'
          }}
          renderFooter={() => (<div className="loadMore">
            {Collection.isLoading ? '加载中...' : Collection.hasMore ? '加载更多' : '没有更多店铺了'}
          </div>)}
          renderRow={row}
          pageSize={4}
          // onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached.bind(this)}
          onEndReachedThreshold={10}
        />
        }

      </div>
    )
  }

  //下拉刷新....
  onRefresh() {
    this.search([], { pageNow: 1 })
  }

  //加载更多....
  onEndReached() {
    const { Collection } = this.props;
    if (Collection.isLoading || !Collection.hasMore) {
      return;
    }
    let pageNow = Number(Collection.pageNow) + 1;
    this.search(Collection.productList, { pageNow: pageNow })
  }
}