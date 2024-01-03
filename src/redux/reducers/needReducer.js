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
  ALL_REPORT_NEEDS_REQUEST,
  ALL_REPORT_NEEDS_SUCCESS,
  ALL_REPORT_NEEDS_FAIL,
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
  ALL_REPORT_NEEDS_RESET,
  UPDATE_ONE_NEED_RESET,
  UPDATE_NEED_CONFIRM_RESET,
  UNCONFIRMED_NEEDS_REQUEST,
  UNCONFIRMED_NEEDS_SUCCESS,
  UNCONFIRMED_NEEDS_FAIL,
  UNCONFIRMED_NEEDS_RESET,
  DUPLICATES_NEEDS_REQUEST,
  DUPLICATES_NEEDS_SUCCESS,
  DUPLICATES_NEEDS_FAIL,
  DUPLICATES_NEEDS_RESET,
  DELETE_OLD_NEEDS_REQUEST,
  DELETE_OLD_NEEDS_SUCCESS,
  DELETE_OLD_NEEDS_FAIL,
  UPDATE_ARRIVALS_REQUEST,
  UPDATE_ARRIVALS_SUCCESS,
  UPDATE_ARRIVALS_FAIL,
  UPDATE_CANDIDATES_REQUEST,
  UPDATE_CANDIDATES_SUCCESS,
  UPDATE_CANDIDATES_FAIL,
  DELETE_CANDIDATES_REQUEST,
  DELETE_CANDIDATES_SUCCESS,
  DELETE_CANDIDATES_FAIL,
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

export const allReportNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_REPORT_NEEDS_REQUEST:
      return { loading: true, success: false };
    case ALL_REPORT_NEEDS_SUCCESS:
      return { loading: false, success: true, needs: action.payload };
    case ALL_REPORT_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case ALL_REPORT_NEEDS_RESET:
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

export const needConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_NEED_CONFIRM_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_NEED_CONFIRM_SUCCESS:
      return { loading: false, success: true, confirmed: action.payload };
    case UPDATE_NEED_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_NEED_CONFIRM_RESET:
      return {};
    default:
      return state;
  }
};

export const childOneNeedReducer = (state = {}, action) => {
  switch (action.type) {
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
    case UPDATE_ONE_NEED_RESET:
      return {};
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

export const unconfirmedReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UNCONFIRMED_NEEDS_REQUEST:
      return { loading: true };
    case UNCONFIRMED_NEEDS_SUCCESS:
      return { loading: false, success: true, unconfirmed: action.payload };
    case UNCONFIRMED_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case UNCONFIRMED_NEEDS_RESET:
      return {};
    default:
      return state;
  }
};

export const duplicatesReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case DUPLICATES_NEEDS_REQUEST:
      return { loading: true };
    case DUPLICATES_NEEDS_SUCCESS:
      return { loading: false, success: true, duplicates: action.payload };
    case DUPLICATES_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case DUPLICATES_NEEDS_RESET:
      return {};
    default:
      return state;
  }
};
export const deleteOldNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_OLD_NEEDS_REQUEST:
      return { count: state.count, loading: true, success: false };
    case DELETE_OLD_NEEDS_SUCCESS:
      return { count: state.count, loading: false, success: true, result: action.payload };
    case DELETE_OLD_NEEDS_FAIL:
      return { count: state.count, loading: false, error: action.payload };
    case DELETE_CANDIDATES_REQUEST:
      return { loading: true, success: false };
    case DELETE_CANDIDATES_SUCCESS:
      return { loading: false, success: true, candidates: action.payload };
    case DELETE_CANDIDATES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateArrivalsReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ARRIVALS_REQUEST:
      return { count: state.count, loading: true, success: false };
    case UPDATE_ARRIVALS_SUCCESS:
      return { count: state.count, loading: false, success: true, result: action.payload };
    case UPDATE_ARRIVALS_FAIL:
      return { count: state.count, loading: false, error: action.payload };
    case UPDATE_CANDIDATES_REQUEST:
      return { loading: true, success: false };
    case UPDATE_CANDIDATES_SUCCESS:
      return { loading: false, success: true, arrivedCandidates: action.payload };
    case UPDATE_CANDIDATES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};