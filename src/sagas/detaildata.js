/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_DETAILDATA, SET_DETAILDATA } from "../actions";
import {
  masterheaderconfig,
  clientheaderconfig,
} from "../components/Helpers/Config";
import Axios from "axios";

export const watchGetDetailData = function* () {
  yield takeEvery(GET_DETAILDATA, workerGetDetailData);
};

function* workerGetDetailData(reqData) {
  try {
    const uri = reqData.datas.url + "?" + reqData.datas.params;
    var headerConfig =
      reqData.datas.type === "client" ? clientheaderconfig : masterheaderconfig;
    const result = yield call(Axios.get, uri, headerConfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_DETAILDATA, value: resultArr });
  } catch {
    console.log("Get detail data failed");
  }
}
