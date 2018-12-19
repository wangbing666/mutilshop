/**
 * Created by JIeLi on 2017/12/12.
 */

import React,{Component} from 'react';
export default class PictureBrowse extends Component{
    // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
          picture:[],
          index: 0, //当前显示图片的index
      };
    }

    componentWillMount() {

    }
    componentDidMount() {
        this.setState({
          picture: this.props.pictureList,
          index: this.props.index || 0
        });

    }

    componentDidUpdate() {
        var swiper = new Swiper('.swiper-containers', {
            initialSlide: this.state.index,
            zoom: true,
            pagination: {
                el: '.swiper-pagination',
            },
        });

    }

    render(){
        return(
            <div style={{position:'fixed',top:0,width:'100%',height:'100%',background:'black',zIndex:99999}}>
                <div className="swiper-containers" style={{width:'100%',height:'100%'}}>
                    <div className="swiper-wrapper">
                        {this.state.picture.map((value,index)=>{
                            return(
                                <div key={index} className="swiper-slide" onClick={()=>{this.props.onClose?this.props.onClose(): this.hidePicture()}}>
                                    <div className="swiper-zoom-container">
                                        <img src={(value.hosrUrl+value.pictureFileUrl) || value}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="swiper-pagination swiper-pagination-white"></div>

                </div>
            </div>


        )
    }

    hidePicture(){
        const {goodDetailsActions}=this.props;
        goodDetailsActions.showPictureBrowse(0)
    }
}