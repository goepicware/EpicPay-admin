import { SET_DETAILDATA } from "../actions";

const detaildata = (state = [], action) => {
  switch (action.type) {
    case SET_DETAILDATA:
      return [...action.value];
    default:
      return state;
  }
};

export default detaildata;
