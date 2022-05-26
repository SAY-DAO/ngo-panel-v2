import {
  CHILD_EXAMPLE_NEEDS_FAIL,
  CHILD_EXAMPLE_NEEDS_REQUEST,
  CHILD_EXAMPLE_NEEDS_SUCCESS,
  CHILD_NEEDS_FAIL,
  CHILD_NEEDS_REQUEST,
  CHILD_NEEDS_RESET,
  CHILD_NEEDS_SUCCESS,
  CHILD_ONE_NEED_REQUEST,
  CHILD_ONE_NEED_SUCCESS,
  CHILD_ONE_NEED_FAIL,
  SW_NEED_LIST_FAIL,
  SW_NEED_LIST_REQUEST,
  SW_NEED_LIST_SUCCESS,
  CHILD_ONE_NEED_RESET,
  UPDATE_ONE_NEED_REQUEST,
  UPDATE_ONE_NEED_SUCCESS,
  UPDATE_ONE_NEED_FAIL,
  ADD_ONE_NEED_REQUEST,
  ADD_ONE_NEED_SUCCESS,
  ADD_ONE_NEED_FAIL,
} from '../constants/needConstant';

export const exampleNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case CHILD_EXAMPLE_NEEDS_REQUEST:
      return { loading: true, success: false };
    case CHILD_EXAMPLE_NEEDS_SUCCESS:
      return { loading: false, success: true, exampleNeeds: action.payload };
    case CHILD_EXAMPLE_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const childNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case CHILD_NEEDS_REQUEST:
      return { loading: true, success: false };
    case CHILD_NEEDS_SUCCESS:
      return { loading: false, success: true, theNeeds: action.payload };
    case CHILD_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_NEEDS_RESET:
      return {};
    default:
      return state;
  }
};

export const childOneNeedReducer = (state = {}, action) => {
  switch (action.type) {
    case CHILD_ONE_NEED_REQUEST:
      return { ...state, loading: true, success: false };
    case CHILD_ONE_NEED_SUCCESS:
      return { loading: false, success: true, oneNeed: action.payload };
    case CHILD_ONE_NEED_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_ONE_NEED_RESET:
      return {};
    default:
      return state;
  }
};

export const swNeedListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_NEED_LIST_REQUEST:
      return { loading: true };
    case SW_NEED_LIST_SUCCESS:
      return { loading: false, success: true, needs: action.payload };
    case SW_NEED_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const needUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_ONE_NEED_REQUEST:
      return { loading: true };
    case UPDATE_ONE_NEED_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_ONE_NEED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const needAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_ONE_NEED_REQUEST:
      return { loading: true };
    case ADD_ONE_NEED_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_ONE_NEED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
