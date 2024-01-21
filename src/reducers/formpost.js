import { SET_FORMPOST } from "../actions";

const formpost = (state = [], action) => {
  switch (action.type) {
    case SET_FORMPOST:
      return [...action.value];
    default:
      return state;
  }
};

export default formpost;
