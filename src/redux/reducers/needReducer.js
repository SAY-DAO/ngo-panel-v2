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
  ALL_NEEDS_REQUEST,
  ALL_NEEDS_SUCCESS,
  ALL_NEEDS_FAIL,
  UPDATE_NEED_CONFIRM_SUCCESS,
  UPDATE_NEED_CONFIRM_FAIL,
  UPDATE_NEED_CONFIRM_REQUEST,
  DELETE_NEED_REQUEST,
  DELETE_NEED_SUCCESS,
  DELETE_NEED_FAIL,
  ADD_ONE_NEED_RESET,
  UPDATE_NEED_STATUS_REQUEST,
  UPDATE_NEED_STATUS_SUCCESS,
  UPDATE_NEED_STATUS_FAIL,
  UPDATE_NEED_STATUS_RESET,
  ALL_NEEDS_RESET,
} from '../constants/needConstant';

export const allNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_NEEDS_REQUEST:
      return { loading: true, success: false };
    case ALL_NEEDS_SUCCESS:
      return { loading: false, success: true, needs: action.payload };
    case ALL_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case ALL_NEEDS_RESET:
      return {};
    default:
      return state;
  }
};

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
      return { loading: false, error: action.payload, success: false };
    case CHILD_NEEDS_RESET:
      return {};
    default:
      return state;
  }
};

export const childOneNeedReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NEED_CONFIRM_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_NEED_CONFIRM_SUCCESS:
      return { loading: false, success: true, confirmed: action.payload };
    case UPDATE_NEED_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_NEED_REQUEST:
      return { ...state, loading: true, success: false };
    case DELETE_NEED_SUCCESS:
      return { loading: false, success: true, deleted: action.payload };
    case DELETE_NEED_FAIL:
      return { loading: false, error: action.payload };
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

export const needStatusUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_NEED_STATUS_REQUEST:
      return { loading: true };
    case UPDATE_NEED_STATUS_SUCCESS:
      return { loading: false, success: true, statusUpdated: action.payload };
    case UPDATE_NEED_STATUS_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_NEED_STATUS_RESET:
      return {};
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
    case ADD_ONE_NEED_RESET:
      return {};
    default:
      return state;
  }
};
