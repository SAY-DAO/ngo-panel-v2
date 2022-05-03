import {
  CHILD_LIST_REQUEST,
  CHILD_LIST_SUCCESS,
  CHILD_LIST_FAIL,
  CHILD_LIST_RESET,
} from '../constants/childConstant';

export const childListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHILD_LIST_REQUEST:
      return { loading: true };
    case CHILD_LIST_SUCCESS:
      return { loading: false, success: true, childList: action.payload };
    case CHILD_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const childByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
