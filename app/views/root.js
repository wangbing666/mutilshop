/**
 * Created by dell on 2017/11/13.
 */
import React,{Component} from 'react';
import RouteMap from '../routes/route';
import * as db from '../../common/Apis/Utils';
class Roots extends Component {
    render() {
        return (
            <RouteMap {...this.props}/>
        );
    }
}
export default Roots;