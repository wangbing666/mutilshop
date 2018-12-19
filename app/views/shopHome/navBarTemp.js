/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './homePage.less';
import * as contants from '../../../common/Apis/constants';
import * as Util from '../../../common/Apis/Utils';
export default class NavBar extends Component {
    constructor(props){
        super(props)
        {
            this.state={
            }
        }
    }

    componentDidMount() {
    }
    render() {
        let ornameObj = this.props.navBarOrname.orInfo;
        let navList = this.props.navBarOrname.navList;
        let navIcon,searchIcon,shoppingIcon,personIcon,classIcon;
        if(navList.length>1){
            navList.map((item)=>{
                switch(item.navigationType){
                    case 1:
                       navIcon ={
                         img:item.zoomUrl,
                         title:item.title
                        }
                    break;
                    case 2:
                      searchIcon =item.zoomUrl
                    break;
                    case 3:
                      shoppingIcon =item.zoomUrl
                    break;
                    case 4:
                      personIcon =item.zoomUrl
                    break;
                    case 5:
                      classIcon =item.zoomUrl
                   break;
                }
            })
        }
        let distance = 0;
        if(ornameObj.distance){
            distance = parseInt(ornameObj.distance)/75+"rem";
        }
        if(navList.length>0){
            return(
                <div className="recomTitle4" style={{backgroundColor:ornameObj.backgroundColor,marginTop:distance}}>
                   {navIcon ? 
                   <div className="shopInfo">
                        <div className="shopImg">
                            <img src={navIcon.img} />
                        </div>
                        <p className="shopName">{navIcon.title}</p>
                   </div>
                    :null}
                    <div className="shopIcon">
                      {searchIcon ?
                        <div className="homeOrder"  onClick={()=>{this.gotoPage("/search2",true)}} >
                             <img src={searchIcon} />
                        </div> :null
                      }
                       {shoppingIcon ? <div className="homeOrder"  onClick={()=>{this.gotoPage("/PPShoppingCart",false)}} >
                            <img src={shoppingIcon} />
                        </div> :null}
                        {personIcon ? <div className="homeOrder" onClick={()=>{this.gotoPage('/orderHome',false)}} >
                            <img src={personIcon} />
                        </div>:null }
                        {classIcon ? <div className="homeOrder" onClick={()=>{this.gotoSearchPage('/searchResult')}} >
                            <img src={classIcon} />
                        </div>:null }
                    </div>
            </div>
            )
        }else{
            return <div></div>
        }
           
    }

    //去商品搜索页面
    gotoSearchPage(routerStr){
        const {history}=this.props;
        history.push({
                    pathname:contants.commonUrl+routerStr
                });
    }

    //其他的页面跳转
    gotoPage(routerStr,isShow){
       let url = contants.multishopUrl+routerStr;
       Util.goToPageForApp(url,isShow);
    //测试测试
    //  let url = "http://172.22.200.109:8080/multiShop"+routerStr;
    //  window.location = url;
    }

}