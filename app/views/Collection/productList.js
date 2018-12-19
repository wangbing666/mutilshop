import React, { Component } from 'react';
import { Modal, ListView, Icon, SwipeAction, PullToRefresh } from 'antd-mobile';
import ReactDOM from 'react-dom';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
import './productList.less';
import Empty from '../../../common/components/empty';

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      height: document.documentElement.clientHeight,
      refreshing: false,
    };
    this.pageSize = 10;
  }

  componentDidMount() {
    if (this.lv) {
      /*const hei =
        document.documentElement.clientHeight -
        ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      this.setState({
        height: hei,
      });*/
    }
  }

  //跳转到商品详情
  toDetail(shopId, productId) {
    // window.location = contants.multishopUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    let url =
      contants.multishopUrl +
      `/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    Util.goodsViewNum(productId, url, false);
  }

  delete(collectId, index) {
    const { CollectionActions, Collection } = this.props;
    CollectionActions.deleteCollection(
      '/goods/deleteCollectionById',
      {
        collectionId: collectId,
      },
      1,
      Collection.productList,
      index,
    );
  }

  //封装
  search(array, params) {
    const { Collection } = this.props;
    let keyWord = Collection.keyWord;
    let data = {
      name: keyWord,
      userId: Util.readUserInfo()['wedoId'],
      pageSize:this.pageSize,
      pageIndex:params && params.pageNow ? params.pageNow : 1
    }
    this.props.search(array, '/goods/getShoppingGoodsList', data, 1);
  }
  doDateFn(timestamp) {
    // 时间格式化方法
    if (!timestamp) return '';
    var date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    return Y + M + D;
  }

  doGoodsStatusFn(status, stock, isDelete) {
    //处理商品的状态
    if (status == 1) {
      if (stock == 0 || isDelete == 1) return '已售罄';
      return null;
    } else if (status == 0 || status == 3) {
      return '已失效';
    } else if (status == 2) {
      return '已下架';
    }
  }
  render() {
    let { Collection } = this.props;
    console.log("商品收藏",Collection);
    //console.log("商品收藏的列表",Collection.productList);
    const dataSource = this.state.dataSource.cloneWithRows(
      Collection.productList,
    );
    let userInfo = Util.readUserInfo();
    let row = (rowIem, rowId, rowIndex) => {
      return (
        <SwipeAction
          autoClose
          right={[
            {
              text: '取消',
              style: {
                backgroundColor: '#e9e9e9',
                color: '#6D6D72',
                width: '1.6rem',
                fontSize: '0.373rem',
              },
            },
            {
              text: '删除',
              onPress: () => this.delete(rowIem.collectionId, rowIndex),
              style: {
                backgroundColor: '#FF2D55',
                color: 'white',
                width: '1.6rem',
                fontSize: '0.373rem',
              },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
        >
          <div
            className="productItem clear"
            key={rowIem.collectionId}
            onClick={this.toDetail.bind(this, rowIem.shopId, rowIem.goodsId)}
          >
            <div className="img-wrap">
              <img src={rowIem.goodsZoomUrl} />
              {this.doGoodsStatusFn(
                rowIem.status,
                rowIem.stock,
                rowIem.isDelete,
              ) === null ? (
                ''
              ) : (
                <i>
                  {this.doGoodsStatusFn(
                    rowIem.status,
                    rowIem.stock,
                    rowIem.isDelete,
                  )}
                </i>
              )}
            </div>
            <div className="desc">
              <h2>{Util.cutOutStr(rowIem.goodsName, 12)}</h2>
              <div className="price clear">
                <p>
                  收藏时间：
                  {this.doDateFn(rowIem.createTime)}
                </p>
                {rowIem.inGroupBuying == 1 ? (
                  <div className="groupIcon">团</div>
                ) : null}
                {rowIem.price == null ? null : (
                  <div className="priceNum">
                    <i>￥</i>
                    {rowIem.price}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SwipeAction>
      );
    };
    return (
      <div
        className='name-space-cplist'
      >
        {Collection.goodsTotal == 0  ? (
          <div style={{ height: document.documentElement.clientHeight }}>
            <Empty message={'很抱歉！没有找到收藏的商品~'} />
          </div>
        ) : (
          <ListView
            ref={(el) => (this.lv = el)}
            dataSource={dataSource}
            pageSize={4}
            scrollRenderAheadDistance={500}
            scrollEventThrottle={20}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={10}
            renderRow={row}
            style={{
              overflow: 'scorll',
              marginTop: '2.26666rem'
            }}
            // renderHeader={() => <span></span>}
            // onScroll={() => { console.log('scroll'); }}
            pullToRefresh={
              <PullToRefresh
                // distanceToRefresh={10}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            renderFooter={() => (
              <div className="loadMore">
                {Collection.isLoading
                  ? '加载中...'
                  : Collection.hasMore
                    ? '加载更多'
                    : '没有更多商品了'}
              </div>
            )}
          />
        )}
      </div>
    );
  }

  //下拉刷新....
  onRefresh() {
    this.setState({
      refreshing: true,
      isLoading: true,
    });
    this.search([], { pageNow: 1 });
    setTimeout(() => {
      this.setState({
        refreshing: false,
        isLoading: false,
      });
    }, 12000);
  }

  //加载更多....
  onEndReached() {
    const { Collection } = this.props;
    if (Collection.isLoading || !Collection.hasMore) {
      return;
    }
    let pageNow = Number(Collection.pageNow) + 1;
    this.search(Collection.productList, { pageNow: pageNow });
  }
}
