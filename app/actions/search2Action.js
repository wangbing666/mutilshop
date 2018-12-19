import * as types from "./actionTypes";
import * as Util from "../../common/Apis/Fetch";

//添加搜索历史
export let addSearchCommodity = (searchText, successCallback) => {
  return dispatch => {
    let historicalS = JSON.parse(localStorage.getItem("historicalSearch"));
    let search = [];
    if (historicalS == null) {
      let searchName = { searchName: searchText };
      search.push(searchName);
    } else {
      let searchName = { searchName: searchText };
      search.push(searchName);
      console.log(historicalS);
      var Snumber = 10;
      for (let i = 0; i < historicalS.length; i++) {
        if (historicalS[i].searchName == searchText || i > Snumber) {
          Snumber = Snumber + 1;
        } else {
          search.push(historicalS[i]);
        }
      }
    }
    localStorage.setItem("historicalSearch", JSON.stringify(search));
    successCallback();
  };
};

//获取历史搜索记录
export let historyList = () => {
  return dispatch => {
    let historicalS = JSON.parse(localStorage.getItem("historicalSearch"));
    if (historicalS === null) {
      dispatch(historicalSData([]));
    } else {
      dispatch(historicalSData(historicalS));
    }
  };
};

//历史记录列表
let historicalSData = data => {
  return {
    type: types.SEARCH_HISTORY_LIST,
    historicalS: data
  };
};

export let setKeyword = (data) => {
  return dispatch => {
    dispatch({
      type: types.SET_KEY_WORD,
      keyWord: data
    })
  }
}
