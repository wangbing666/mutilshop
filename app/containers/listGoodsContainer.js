/**
 * 分区分组
 */
import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import ListGoods from '../views/listGoods/listGoods';
import { withRouter } from 'react-router-dom'
import * as action1Creators from '../actions/listGoodsAction.js';
import * as constant from '../../common/Apis/constants'

class AppContainer extends React.Component {
    render() {
        return (
            <ListGoods {...this.props} />
        )
    }
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

}
const mapStateToProps = (state) => {
    const  ListGoods  = state.get('ListGoods').toJS();
    return {
        ListGoods
    };
};

const mapDispatchToProps = (dispatch) => {
    const ListGoodsActions = bindActionCreators(action1Creators, dispatch);
    return {
        ListGoodsActions
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppContainer));