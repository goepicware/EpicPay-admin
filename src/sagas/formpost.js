/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_FORMPOST, SET_FORMPOST } from "../actions";
import {
  apiUrl,
  masterheaderconfig,
  clientheaderconfig,
} from "../components/Helpers/Config";
import Axios from "axios";
var qs = require("qs");
export const watchGetFormPost = function* () {
  yield takeEvery(GET_FORMPOST, workerGetFormPost);
};

function* workerGetFormPost({ formPayload, postUrl, authType }) {
  try {
    const result = yield call(getFormPost, formPayload, postUrl, authType);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_FORMPOST, value: resultArr });
  } catch {
    console.log(postUrl + " post failed");
  }
}

function getFormPost(formPayload, postUrl, authType) {
  var headerConfig =
    authType === "client" ? clientheaderconfig : masterheaderconfig;
  return Axios.post(apiUrl + postUrl, qs.stringify(formPayload), headerConfig);
}
