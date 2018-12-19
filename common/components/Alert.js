/**
 * Created by chenmao on 2017/7/8.
 */

import React,{Component} from 'react';
import { Carousel,Modal ,ActivityIndicator} from 'antd-mobile';
import * as Screen from '../Apis/constants'
let ratio=$(window).width()/750;
export default class Alert extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            model:false
        };
    }
    componentDidMount(){
        if(this.props.model){
            this.setState({
                model:this.props.model
            })
        }
    }
    render() {
        console.log($(window).width())
        return (
                <Modal
                    title='提示'
                    transparent
                    maskClosable={false}
                    visible={this.state.model}
                    style={{'width':`${540*ratio}px`,'height':`${223*ratio}px`}}
                    footer={[{ text: '确定', onPress: () => {this.onClose(); } }]}
                >
                    {this.props.intro}
                </Modal>
        );
    }
    onClose() {
        this.setState({
            model: false
        });
    }
}

