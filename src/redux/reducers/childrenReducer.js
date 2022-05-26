import {
  ADD_CHILD_FAIL,
  ADD_CHILD_REQUEST,
  ADD_CHILD_SUCCESS,
  CHILD_BY_ID_FAIL,
  CHILD_BY_ID_REQUEST,
  CHILD_BY_ID_RESET,
  CHILD_BY_ID_SUCCESS,
  CHILD_LIST_FAIL,
  CHILD_LIST_REQUEST,
  CHILD_LIST_RESET,
  CHILD_LIST_SUCCESS,
  UPDATE_CHILD_FAIL,
  UPDATE_CHILD_IS_ACTIVE_FAIL,
  UPDATE_CHILD_IS_ACTIVE_REQUEST,
  UPDATE_CHILD_IS_ACTIVE_SUCCESS,
  UPDATE_CHILD_REQUEST,
  UPDATE_CHILD_SUCCESS,
} from '../constants/childrenConstants';

export const childByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHILD_BY_ID_REQUEST:
      return { loading: true };
    case CHILD_BY_ID_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case CHILD_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

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

export const childUpdateIsActiveReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_CHILD_IS_ACTIVE_REQUEST:
      return { loading: true };
    case UPDATE_CHILD_IS_ACTIVE_SUCCESS:
      return { loading: false, success: true, status: action.payload };
    case UPDATE_CHILD_IS_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const childUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_CHILD_REQUEST:
      return { loading: true };
    case UPDATE_CHILD_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_CHILD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const childAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_CHILD_REQUEST:
      return { loading: true };
    case ADD_CHILD_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_CHILD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
