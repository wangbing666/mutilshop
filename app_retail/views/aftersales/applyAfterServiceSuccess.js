/**
 * author: cheng.zhang
 * date: 2017/7/6
 * desc：申请售后服务成功
 */
import React from 'react'
import './apply_after_sales_service_success.less';
import {wxShare} from '../../../common/Apis/wxJsApis'
import * as contants from '../../../common/Apis/constants'
import * as db from '../../../common/Apis/Utils';

export default class applyAfterSalesServiceSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.theRequest ={};
    }

    componentWillMount() {
        if (db.userAgent() === 'Android') {
            document.title = '申请售后服务';
        } else {
            db.setPageTitle('申请售后服务');
        }
        let theRequest = {};
        let strs = [];
        let urls = location.search; //获取url中"?"符后的字串
        if (urls.indexOf("?") !== -1) {
            let str = urls.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }

        this.theRequest = theRequest;

    }

    componentDidMount() {
        wxShare( [], {});
        const {history} = this.props;
        contants.currentHistory = history;
    }

    render() {
        return (
            <div className='text5'>
                <img className='img5'
                     src={require("../../images/aftersales/apply_after_sales_service_success.png")}></img>
                <div>{this.theRequest.type== 1 ? '您的退款服务申请已经提交成功，' : '您的退货退款服务申请已经提交成功，'}</div>
                <div>请您耐心等待审核。</div>
            </div>
        )
    }
}