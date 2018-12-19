/**
 * Created by dell on 2017/11/13.
 */
import React,{Component} from 'react';
import RouteMap from '../routes/route'
class Roots extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <RouteMap {...this.props}/>
        );
    }
}
export default Roots;