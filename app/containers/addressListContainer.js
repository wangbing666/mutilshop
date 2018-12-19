/**
 * Created by JieLi on 2017/7/6.
 */
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import AddressList from '../views/shippingAddress/addressList.js';
import * as addressListAct from '../actions/addressListAction.js';
import * as constant from '../../common/Apis/constants'

class addressListContainer extends React.Component{
    componentDidMount() {
        const {history} = this.props;
        constant.currentHistory = history;
    }

    render() {
        return (
            <AddressList {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    // const { App }=state;不使用immutable,这个解构的App在rootReducer中绑定的，不使用combineReducer就直接赋值const App=state;
    const  addressLists  = state.get('AddressList').toJS();
    return {
        addressLists
    };
};
const mapDispatchToProps = (dispatch) => {
    const addressListAction = bindActionCreators(addressListAct, dispatch);
    return {
        addressListAction
    };
};
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(addressListContainer));