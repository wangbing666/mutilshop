/**
 * Created by ysy on 18/8/30.
 * 分类
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import Classify from '../views/classify/index';
import * as classifyAction1 from '../actions/classifyAction';
import * as constant from '../../common/Apis/constants'

class classifyContainer extends React.Component {
    render() {
        return (
            <Classify {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  classify  = state.get('classify').toJS();
    return {
        classify
    };
};

const mapDispatchToProps = (dispatch) => {
    const classifyAction = bindActionCreators(classifyAction1, dispatch);
    return {
        classifyAction
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(classifyContainer));