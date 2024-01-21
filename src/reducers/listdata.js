import { SET_LISTDATA } from "../actions";

const listdata = (state = [], action) => {
  switch (action.type) {
    case SET_LISTDATA:
      return [...action.value];
    default:
      return state;
  }
};

export default listdata;
