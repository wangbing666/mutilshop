/**
 * Created by chenmao on 2017/6/28.
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer.js';

let createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(rootReducer);
// let state = store.getState();
// alert(state.Search.searchText)
export default store;
