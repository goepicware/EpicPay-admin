import listdata from "./listdata";
import detaildata from "./detaildata";
import formpost from "./formpost";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  listdata: listdata,
  detaildata: detaildata,
  formpost: formpost,
});

export default rootReducer;
