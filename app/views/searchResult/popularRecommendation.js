/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：热门推荐组件
 */
import React from 'react';
import  '../aftersales/popular_recommendation.less';
import * as Util from '../../../common/Apis/Fetch.js';
import * as db from '../../../common/Apis/Utils';
import { ListView,Toast} from "antd-mobile";
import * as contants from '../../../common/Apis/constants';
import Suggestion from '../../../common/components/suggestion';
export default class popularRecommendation extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: [],
            dataSource: ds.cloneWithRows([]),
            isLoading:false,
        }
        console.log('popularRecommendati '+this.props.shopId)
    }

    componentDidMount() {
        let likeUrl = '/goods/getLikeGoods';
        Util.get(likeUrl, (response) => {
           // console.log("你喜欢的列表----",response);
            if(response.status===0){
              this.setState({
                data:response.body.likeGoods,
                isLoading:true
              })   
            }else{
                Toast.info(response.msg, 2);
            }
        }, (error) => {
            Toast.info('网络失败', 2);
        });

    }

    render() {
        // let titleType = this.props.titleType;
        // const dataSource = this.state.dataSource.cloneWithRows(this.state.data);

        return (
          <div className="popularMerchandise">
              {this.state.data.length >0 ? <div className="suggestion-title">猜你喜欢</div>:null }
              <Suggestion list={this.state.data} {...this.props}/>
              {this.state.data.length >0 ? <div className="listViewFoot">
                  <img className="imgLeft" />
                  <span>没有更多内容了</span>
                  <img className="imgRight" />
              </div> : null
              }
          </div>
      )

        // let row = (rowItem) => {
        //     return (
        //       <div className="productItem clear" key={rowItem.goodsId} onClick={this.toDetail.bind(this, rowItem.shopId, rowItem.goodsId)}>
        //         <div className="img-wrap">
        //           <img src={rowItem.hostUrl+rowItem.fileUrl}/>
        //         </div>
        //         <div className="desc">
        //           <h2>{db.cutOutStr(rowItem.goodsName,12)}</h2>
        //           <div className="likePrice clear">
        //             { rowItem.isGruopBuy === 1 ? <span>团</span> : null }
        //             <i><b>￥</b>{rowItem.isGruopBuy == 1 ? rowItem.price:rowItem.linePrice}</i>
        //             {rowItem.linePrice >= 0 ? <a>￥{rowItem.linePrice}</a> : null}
        //           </div>
        //         </div>
        //       </div>
        //     )
        //   };
        //  return(
        //     // this.state.data ? 
        //         <div className="likeGoodsModule">
        //            {titleType ==1 ? <div className="title_type1"><span>猜你喜欢</span></div> : <div className="title_type2"><span>猜你喜欢</span></div>}
        //               <ListView
        //                 className='list-style2'
        //                 ref={el => this.lv = el}
        //                 dataSource={dataSource}
        //                 style={{overflow:'visible'}}
        //                 renderRow={row}
        //                 pageSize={4}
        //                 scrollRenderAheadDistance={500}
        //                 onEndReached={this.onEndReached.bind(this)}
        //                 onEndReachedThreshold={10}
        //              />
        //       </div>
        //      //  :null
        //  )
          
    }

    onEndReached () {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        
      }
      
       //跳转到商品详情
    // toDetail(shopId, productId){
    //   window.location = contants.flagshipUrl+`/goodDetails/?shopId=${shopId}&goodsId=${productId}`;
    // }
}