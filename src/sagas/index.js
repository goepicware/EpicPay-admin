import { all } from "redux-saga/effects";
import { watchGetListData } from "./listdata";
import { watchGetDetailData } from "./detaildata";
import { watchGetFormPost } from "./formpost";

export default function* () {
  yield all([watchGetListData(), watchGetDetailData(), watchGetFormPost()]);
}
