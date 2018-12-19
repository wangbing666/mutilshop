import React, { Component } from 'react';
import './goodDetails.less'
import * as db from '../../../common/Apis/Utils';
import * as contants from '../../../common/Apis/constants'
import * as SKU from '../../../common/Apis/SKU'
import { Toast, Modal } from 'antd-mobile';
import SvgImg from '../../../common/svgImage/svgImg'
const alert = Modal.alert;
let showAlert = null;
export default class ChooseSpecification extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      goodMount: 1,
      index: [],
      specificationsText: '',
      ids: [],
      price: null,
      goodStock: null,
      isShowAlert: false,
      AlertStr: '',
      bannerImg: null
    }
    this.goodsId = 0;
    this.shopId = 0;
    this.colorDic = contants.viewStyDic;
  }
  componentDidMount() {
    // console.log(this.props.goodDetails.goodInfo.price)
    let strs = []
    var localUrl = window.location.href; //获取url中"?"符后的字串
    let theRequest = new Object();
    theRequest = db.getValueFromUrl();
    this.goodsId = theRequest['goodsId'];
    this.shopId = theRequest['shopId'];

    const myScroll = new IScroll('#wrapper');
    const { goodDetails, goodDetailsActions } = this.props;
    const { goodInfo } = goodDetails;
    $('.goodDialogCover,.goodDialog,.goodDialog img,.goodDialogHeader,footer,.goodDialogContainer').on("touchmove", function (e) {
      var e = e || event;
      e.preventDefault();
    });
    let that = this;
    let goodsId = theRequest['goodsId'];
    let resData = {
      param1: null,
      param2: null,
      param3: null,
      goodsId: goodsId
    };


    this.setState({ goodStock: goodInfo.stock, price: this.props.goodDetails.goodInfo.price });

    if (this.props.goodDetails.groupGoods.groupInfo) {
      this.setState({
        price: this.props.goodDetails.groupGoods.groupInfo.amount
      })
    }


    goodDetailsActions.getGoodTypeServer('/goods/getRulesIds', resData, (response) => {
      SKU.initSKU(response);
      let skuKeys = SKU.getObjKeys(response);
      let SKUResult = SKU.SKUResult;
      let str = '';
      let str1 = '';
      let goodsruleslist = goodInfo.goodsruleslist;
      for (let i = 0; i < goodsruleslist.length; i++) {
        inter:
        for (let j = 0; j < goodsruleslist[i].nameList.length; j++) {
          let nameList = goodsruleslist[i].nameList[j];
          for (let k = 0; k < skuKeys.length; k++) {
            if (skuKeys[k].indexOf(nameList.specificationsId) > -1) {
              if (str == '') {
                str = nameList.specificationsId
              } else {
                str += ',' + nameList.specificationsId
              }
              if (skuKeys[k].indexOf(str) > -1) {
                str1 = str;
                this.choose(i, j);
                chooseBtnType($('.goodTypeDiv').eq(i).find('.sku').eq(j))
                break inter;
              } else {
                str = str1;
              }
            }
          }
        }
      }
      $('.sku').each(function () {
        let self = $(this);
        let attr_id = self.attr('data-attrId');
        if (!SKUResult[attr_id]) {
          self.attr('disabled', 'disabled').addClass('disabledStyle');
        }
      }).click(function () {
        let self = $(this);
        chooseBtnType(self)
      });
      function chooseBtnType(self) {
        //选中自己，兄弟节点取消选中
        self.toggleClass('active').siblings().removeClass('active');

        //已经选择的节点
        let selectedObjs = $('.active');

        if (selectedObjs.length) {
          //获得组合key价格
          let selectedIds = [];
          selectedObjs.each(function () {

            selectedIds.push($(this).attr('data-attrId'));
          });

          selectedIds.sort(function (value1, value2) {
            return parseInt(value1) - parseInt(value2);
          });
          let len = selectedIds.length;
          if (len === goodsruleslist.length) {

            let prices = SKUResult[selectedIds.join(',')].prices
            if (parseInt(self.attr('data-isGroup'))) {
              prices = SKUResult[selectedIds.join(',')].groupPrice;
            }
            let count = SKUResult[selectedIds.join(',')].count;
            if (that.state.goodMount > count[0]) {
              that.setState({ goodMount: 1 })
            }
            that.setState({ price: prices[0], goodStock: count[0] })
          }
          //用已选中的节点验证待测试节点 underTestObjs
          $(".sku").not(selectedObjs).not(self).each(function () {
            let siblingsSelectedObj = $(this).siblings('.active');
            let testAttrIds = [];//从选中节点中去掉选中的兄弟节点
            if (siblingsSelectedObj.length) {
              let siblingsSelectedObjId = siblingsSelectedObj.attr('data-attrId');
              for (var i = 0; i < len; i++) {
                (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
              }
            } else {
              testAttrIds = selectedIds.concat();
            }
            testAttrIds = testAttrIds.concat($(this).attr('data-attrId'));
            testAttrIds.sort(function (value1, value2) {
              return parseInt(value1) - parseInt(value2);
            });
            if (!SKUResult[testAttrIds.join(',')]) {
              $(this).attr('disabled', 'disabled').removeClass('active').addClass('disabledStyle');
            } else {
              $(this).removeAttr('disabled').removeClass('disabledStyle');
            }
          });
        } else {
          //设置属性状态
          $('.sku').each(function () {
            SKUResult[$(this).attr('data-attrId')] ? $(this).removeAttr('disabled').removeClass('disabledStyle') : $(this).attr('disabled', 'disabled').removeClass('active').addClass('disabledStyle');
          })
        }
      }
    }, (err) => {

    });
  }

  componentWillUnmount() {
    if (showAlert)
      showAlert.close();
  }

  componentDidUpdate() {
    $('.active').css({ 'backgroundColor': contants.viewStyDic['COLOR1'], 'color': contants.viewStyDic['COLOR3'] });
  }
  choose(i, j) {
    $('.sku').css({ 'backgroundColor': '#f4f5f7', 'color': '#6d6d72' });
    $('.active').css({ 'backgroundColor': contants.viewStyDic['COLOR1'], 'color': contants.viewStyDic['COLOR3'] });
    $('.disabledStyle').css({ 'color': '#6d6d72' });
    const { goodDetails, goodDetailsActions } = this.props;
    const { goodInfo, groupGoods } = goodDetails;
    const { ids, index } = this.state;
    let idsArr = [];
    let indexArr = index;
    let str = i + '' + j;
    let goodTypeStr = '';
    let goodsId = this.goodsId;
    let len = 0;
    let goodFlag = true;
    if (indexArr.length == 0) {
      indexArr[i] = str;
    } else {
      let arrIndex = $.inArray(str, indexArr);
      if (arrIndex > -1) {
        delete indexArr[arrIndex];
      } else {
        for (let t = 0; t < indexArr.length; t++) {
          if (indexArr[t] && indexArr[t].charAt(0) == i) {
            indexArr[t] = str;
            break;
          } else {
            indexArr[i] = str;
            break;
          }
        }
      }
    }
    indexArr.map((val, m) => {
      if (val) {
        len++;
        const m1 = Number(val.charAt(0));
        const m2 = Number(val.charAt(1));
        idsArr.push(goodInfo.goodsruleslist[m1].nameList[m2].specificationsId);
        if (m == 0) {
          goodTypeStr = goodInfo.goodsruleslist[m1].type + ':' + goodInfo.goodsruleslist[m1].nameList[m2].name
        } else {
          goodTypeStr += ' ' + goodInfo.goodsruleslist[m1].type + ':' + goodInfo.goodsruleslist[m1].nameList[m2].name
        }
        if (goodInfo.goodsruleslist[m1].havaFile && m1 == i && m2 == j) {
          try {
            this.setState({
              bannerImg: goodInfo.goodsruleslist[m1].nameList[j].hostUrl + goodInfo.goodsruleslist[m1].nameList[j].fileUrl
            })
          } catch (e) {
            // console.log(e)
          }
        }
        if (goodInfo.goodsruleslist[m1].havaFile) {
          goodFlag = false;
        }
      }
    });

    if (goodFlag) {
      this.setState({ bannerImg: null });
    }


    this.setState({ index: indexArr, specificationsText: goodTypeStr, ids: idsArr });
    //请求价格
    // console.log("0")

    if (len == 0) {

      if (groupGoods.isJoin) {//团购商品
        this.setState({ price: groupGoods.groupInfo.price, goodStock: goodInfo.stock });
      } else {

        this.setState({ price: goodInfo.price, goodStock: goodInfo.stock });
      }
    }

  }
  render() {
    let borderR;
    if (this.colorDic['SHAPE'] == 3) {
      borderR = 'btnSemicircle';
    } else if (this.colorDic['SHAPE'] == 2) {
      borderR = 'btnCircular';
    } else {
      borderR = 'btnNoCircular';
    }
    const { goodDetails } = this.props;
    const { goodInfo, groupGoods } = goodDetails;
    let isGroup = 0;
    let goodsPrice = goodInfo.price;

    let groupBuy = 0;

    if (groupGoods && groupGoods.isJoin) {
      isGroup = 1;
      goodsPrice = groupGoods.groupInfo === null ? '0' : groupGoods.groupInfo.price;
      groupBuy = groupGoods.buy;
    }
    let flag = this.state.goodMount < this.state.goodStock;
    return (
      <div>
        <div className={`goodDialogCover ${goodDetails.isShow ? 'show' : 'hide'}`} onClick={() => { this.hideDialog() }}>

        </div>
        <div className={`goodAlertDialog ${this.state.isShowAlert ? 'show' : 'hide'}`}>
          <img src={require('../../images/goodDetails/b40.png')} />
          <span>{this.state.AlertStr}</span>
        </div>
        <div className={`goodDialogContainer ${goodDetails.isShow ? 'up' : goodDetails.isShow === null ? '' : 'down'}`} style={{ background: "white" }}>
          <div className='goodDesContainer'>
            <header className='goodDialog'>
              <div className="borderDiv"><img src={this.state.bannerImg ? this.state.bannerImg : goodInfo.goodsUrlList[0].hosrUrl + goodInfo.goodsUrlList[0].pictureFileUrl} /></div>
              <div className='goodDialogHeader'>
                <p>{goodInfo.goodsName}</p>
                <p>￥{this.state.price ? this.state.price : goodsPrice}</p>
                <p>{this.state.specificationsText ? this.state.specificationsText : '请选择商品规格'}</p>
              </div>
              <div className="closeDialog" onClick={() => { this.hideDialog() }}>
                <img src={require('../../images/goodDetails/close.png')} />
              </div>
            </header>
            <div className="middleContainer" id="wrapper">
              <div>
                {
                  goodInfo.goodsruleslist.map((val, i) => {
                    return (
                      <section className="goodType" key={i}>
                        <h1>{val.type}</h1>
                        <div className="goodTypeDiv">
                          {
                            val.nameList.map((v, j) => {
                              return (
                                <input key={j} data-isGroup={isGroup} type="button" className="sku" data-attrId={v.specificationsId} value={v.name} onClick={() => { this.choose(i, j) }} />
                              )
                            })
                          }
                        </div>
                      </section>
                    )
                  })
                }
                <section className="goodMount">
                  <h1>购买数量</h1>
                  <div>
                    <button className={this.state.goodMount <= 1 ? 'cancelClick' : 'canClick'} onClick={() => this.reduceGoodNum()}>－</button>
                    <span>{this.state.goodMount}</span>
                    <button className={flag ? 'canClick' : 'cancelClick'} onClick={() => this.addGoodNum()}>＋</button>
                  </div>
                </section>
              </div>
            </div>
            {
              goodDetails.openType !== 2 ?
                <footer>
                  {(isGroup && groupBuy)
                    ?
                    <button className={"buyButtonWidth" + ' ' + borderR} style={{ background: '#b6b6b8', color: '#f4f5f7' }}>已参团</button>
                    :
                    <button onClick={() => { this.submit() }} className={"buyButtonWidth" + ' ' + borderR} style={{ background: this.colorDic['COLOR1'], color: this.colorDic['COLOR3'] }}>确认</button>
                  }
                </footer> :
                <footer className="chooseTypeFooter">
                  <button onClick={() => { this.submit(0) }} className={"addCart" + ' ' + borderR} style={{ color: this.colorDic['COLOR1'], background: this.colorDic['COLOR2'] }}>加入购物袋</button>
                  <button onClick={() => { this.submit(1) }} className={"buyNow" + ' ' + borderR} style={{ color: this.colorDic['COLOR3'], background: this.colorDic['COLOR1'] }}>立即购买</button>
                </footer>
            }
          </div>
        </div>
      </div>
    );
  }
  submit(opts) {
    if (this.props.pageType) {
      return
    }
    // console.log(this.props)
    const { goodDetailsActions, goodDetails, history } = this.props;
    const { goodInfo, groupGoods } = goodDetails;
    let groupG;
    let groupInf;//团购信息
    let shopName;
    let shopType;
    if (groupGoods) {
      groupG = groupGoods.isJoin;
      groupInf = groupGoods.groupInfo;
      shopName = groupGoods.shopName;
      shopType = groupGoods.shopType;
    }
    const { ids } = this.state;
    let idsArr = ids;
    let len = 0;
    idsArr.map((val, i) => {
      if (val) {
        len++;
      }
    });
    if (len !== goodInfo.goodsruleslist.length) {
      this.setState({ isShowAlert: true, AlertStr: '请选择商品规格' });
      setTimeout(() => {
        this.setState({ isShowAlert: false });
      }, 1000);
      return;
    }
    let type = (opts || opts === 0) ? opts : goodDetails.openType;
    let userInfo = db.readUserInfo();
    let oriPrice;
    if (groupG) {
      oriPrice = goodInfo.price;
    } else {
      oriPrice = this.state.price;
    }

    let groupId = 1; //团购Id
    if (groupInf) {
      groupId = groupInf.groupBuyId;
    }
    let goodCartInfo = [{
      shopId: this.shopId,
      shopType: shopType,//0:旗舰店 1:分销店
      flagshipId: goodInfo.shopId, //旗舰店ID
      backGoods: goodInfo.backGoods,
      shopName: shopName,
      goodNam: goodInfo.goodsName,
      goodsId: this.goodsId,
      number: this.state.goodMount,
      goodSpecification: this.state.specificationsText,
      param1: idsArr[0] ? idsArr[0] : 0,
      param2: idsArr[1] ? idsArr[1] : 0,
      param3: idsArr[2] ? idsArr[2] : 0,
      zoomUrl: this.state.bannerImg ? this.state.bannerImg : goodInfo.goodsUrlList[0].hosrUrl + goodInfo.goodsUrlList[0].pictureFileUrl,
      price: this.state.price,
      oriPrice: oriPrice,
      stock: this.state.goodStock,
      restrictionsNumber: goodInfo.restrictionsNumber,
      buyType: groupG,  //购买类型,1团购,0普通商品
      groupId: groupId,
    }];

    switch (type) {
      //1 立即购买  0 加入购物袋
      case 0:
        let maxNum = goodInfo.restrictionsNumber;
        if (maxNum && maxNum != 0) {
          if (this.state.goodMount > maxNum) {
            alert('最多只能购买' + maxNum + "件");
            return;
          }
        }
        if (userInfo) {
          let requestData = {
            // userId:userInfo.wedoId,
            userId: userInfo.userId,

            shopList: JSON.stringify([{
              shopId: this.shopId,
              goodsId: this.goodsId,
              number: this.state.goodMount,
              param1: idsArr[0] ? idsArr[0] : 0,
              param2: idsArr[1] ? idsArr[1] : 0,
              param3: idsArr[2] ? idsArr[2] : 0
            }])
          };

          goodDetailsActions.addCart('/shopping/insertshop', requestData, () => {
            db.saveGoods(goodCartInfo);
            Toast.info('商品已成功加入购物袋', 0.5, null, false);
            goodDetailsActions.showDialog(false);
          }, (err) => {

          });
        } else {
          db.saveGoods(goodCartInfo);
          Toast.info('商品已成功加入购物袋', 0.5, null, false);
          goodDetailsActions.showDialog(false);
        }
        break;
      case 1:
        contants.createOrderData = {}//
        if (userInfo) {
          if (goodInfo) {
            if (groupInf) {//团购限购数量
              if (Number(groupInf.goodsLimitNumber) === 0 || goodCartInfo[0].number <= groupInf.goodsLimitNumber) {
                goodCartInfo[0].isInCart = 1;
                history.push({
                  pathname: contants.commonUrl + '/settlement2/?goodInfo=' + JSON.stringify(goodCartInfo),
                });
              } else {
                alert("不可超过限购数量")
              }
            } else {
              if (goodInfo.restrictionsNumber != 0 && goodCartInfo[0].number > goodInfo.restrictionsNumber) {
                alert("您最多只能购买" + goodInfo.restrictionsNumber + '件商品')
              } else {
                goodCartInfo[0].isInCart = 0;
                history.push({
                  pathname: contants.commonUrl + '/settlement2/?goodInfo=' + JSON.stringify(goodCartInfo),
                });
              }
            }
          }
        } else {
          history.push({
            pathname: contants.commonUrl + '/login/?shopId=' + this.shopId,
            state: {
              pathname: contants.commonUrl + '/settlement2',
              type: 3,
              goodInfo: goodCartInfo
            }
          });
        }

        break;
    }
  }
  hideDialog() {
    const { goodDetailsActions } = this.props;
    goodDetailsActions.showDialog(false);
  }
  reduceGoodNum() {
    if (this.state.goodMount <= 1) {

    } else {
      let goodMount = this.state.goodMount - 1;
      this.setState({ goodMount: goodMount });
    }
  }
  addGoodNum() {
    const { goodInfo } = this.props.goodDetails;
    let flag = this.state.goodMount < this.state.goodStock;
    if (flag) {
      let goodMount = this.state.goodMount + 1;
      this.setState({ goodMount: goodMount });
    }
  }
}

