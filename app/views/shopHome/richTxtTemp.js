/**
 * Created by AndyWang on 2017/7/8.
 */
import React,{Component} from 'react';
import './shopHome.less';

export default class RichTxtTemp extends Component{
    constructor(...args) {
        super(...args);
        this.state={
            isShowAll:true
        }
    }
    
    render() {
        let ornameObj = this.props.richTxtOrname;
        let fontLocation = this.dealLocation(ornameObj.fontLocation);
        let distance = 0;
        if(ornameObj.distance){
            distance = parseInt(ornameObj.distance)/75+"rem";
        }
        return(
            <div className="richTxtModule" style={{backgroundColor:ornameObj.backgroundColor,marginTop:distance,textAlign:fontLocation}}>
              { this.state.isShowAll ? 
                 <div className="textContainer">
                     <article className="richTxt" dangerouslySetInnerHTML = {{ __html:ornameObj.detailsStr }}>
                      </article>
                     <p className="checkAll" onClick={this.checkAllTxt.bind(this,false)}>查看全文</p>
                </div> :
                <div className="textContainer">
                      <article className="richAllTxt" dangerouslySetInnerHTML = {{ __html:ornameObj.detailsStr }}>
                      </article>
                     <p className="checkAll" onClick={this.checkAllTxt.bind(this,true)}>收起</p>
                </div>
               }
            </div>
        )
    };

        //标题文字的位置
        dealLocation(location){
            if(!location) return 'left';
            if(location == 0) return 'left';
            if(location == 1) return 'center';
            if(location == 2) return 'right';
        }

        //查看全文
        checkAllTxt(bool){
            this.setState({
                isShowAll:bool
            })
        }

}