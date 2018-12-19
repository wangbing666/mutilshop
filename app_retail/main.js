/**
 * Created by chenmao on 2017/7/20.
 */
import React,{Component} from 'react';
import  ReactDom  from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import Roots from './views/root'
import '../common/styles/common.less'//全局公共样式
import '../common/svgImage/iconfont'
import 'lib-flexible';
require('es6-promise').polyfill();
import './styles/main.less'
//解决移动端300毫秒延迟
var FastClick = require('fastclick');
FastClick.attach(document.body);

ReactDom.render(
    <Provider store={store}>
        <Roots />
    </Provider>
    , document.getElementById('root'));
