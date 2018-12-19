/**
 * Created by nipeng on 2017/7/8.
 * 登陆reducer
 */

import * as types from '../actions/actionTypes';
import {Map} from 'immutable';

const initialState = Map({
    isShowLoading:false,
    checkCode:'',
    userId:'',
})

let PPLoginReducer = (state = initialState,actions)=>{
    switch (actions.type){
        case types.LOGINBUITON:{     // 登录之后更改userId
            return state.merge({
                userId:actions.userId
            })
        }
        case types.LOGINBUITONLOADING:{ // 加载动画
            return state.merge({
                isShowLoading:actions.isShowLoading
            })
        }
        case types.SETCODESTRING:{      // 验证码
            return state.merge({
                checkCode:actions.checkCode
            })
        }

        default:
            return state;
    }

}

export default PPLoginReducer;







