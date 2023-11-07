import {
  ADD_CHILD_FAIL,
  ADD_CHILD_REQUEST,
  ADD_CHILD_SUCCESS,
  CHILD_BY_ID_FAIL,
  CHILD_BY_ID_REQUEST,
  CHILD_BY_ID_RESET,
  CHILD_BY_ID_SUCCESS,
  CHILDREN_BY_NGO_FAIL,
  CHILDREN_BY_NGO_REQUEST,
  CHILDREN_BY_NGO_RESET,
  CHILDREN_BY_NGO_SUCCESS,
  UPDATE_CHILD_FAIL,
  UPDATE_CHILD_REQUEST,
  UPDATE_CHILD_SUCCESS,
  CHILD_LIST_REQUEST,
  CHILD_LIST_SUCCESS,
  CHILD_LIST_FAIL,
  CHILD_LIST_RESET,
  CHILD_ACTIVE_LIST_REQUEST,
  CHILD_ACTIVE_LIST_SUCCESS,
  CHILD_ACTIVE_LIST_FAIL,
  CHILD_ACTIVE_LIST_RESET,
  UPDATE_CHILD_STATUS_REQUEST,
  UPDATE_CHILD_STATUS_SUCCESS,
  UPDATE_CHILD_STATUS_FAIL,
  CHECK_SIMILAR_NAMES_REQUEST,
  CHECK_SIMILAR_NAMES_SUCCESS,
  CHECK_SIMILAR_NAMES_FAIL,
  PRE_REGISTER_CHILD_UPDATE_REQUEST,
  PRE_REGISTER_CHILD_UPDATE_SUCCESS,
  PRE_REGISTER_CHILD_UPDATE_FAIL,
  PRE_REGISTER_CHILD_ADD_REQUEST,
  PRE_REGISTER_CHILD_ADD_SUCCESS,
  PRE_REGISTER_CHILD_ADD_FAIL,
  PRE_REGISTER_CHILD_LIST_REQUEST,
  PRE_REGISTER_CHILD_LIST_SUCCESS,
  PRE_REGISTER_CHILD_LIST_FAIL,
  DELETE_PRE_REGISTER_REQUEST,
  DELETE_PRE_REGISTER_SUCCESS,
  DELETE_PRE_REGISTER_FAIL,
  APPROVE_PRE_REGISTER_REQUEST,
  APPROVE_PRE_REGISTER_SUCCESS,
  APPROVE_PRE_REGISTER_FAIL,
  PRE_REGISTER_CHILD_LIST_REST,
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

// all actives
export const childActiveListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHILD_ACTIVE_LIST_REQUEST:
      return { loading: true };
    case CHILD_ACTIVE_LIST_SUCCESS:
      return { loading: false, success: true, activeChildren: action.payload };
    case CHILD_ACTIVE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_ACTIVE_LIST_RESET:
      return {};
    default:
      return state;
  }
};

// all actives
export const childListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHILD_LIST_REQUEST:
      return { loading: true };
    case CHILD_LIST_SUCCESS:
      return { loading: false, success: true, myChildren: action.payload };
    case CHILD_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CHILD_LIST_RESET:
      return {};
    default:
      return state;
  }
};

// by Ngo id
export const childrenByNgoReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHILDREN_BY_NGO_REQUEST:
      return { loading: true };
    case CHILDREN_BY_NGO_SUCCESS:
      return { loading: false, success: true, childList: action.payload };
    case CHILDREN_BY_NGO_FAIL:
      return { loading: false, error: action.payload };
    case CHILDREN_BY_NGO_RESET:
      return {};
    default:
      return state;
  }
};

export const childUpdateStatusReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_CHILD_STATUS_REQUEST:
      return { loading: true };
    case UPDATE_CHILD_STATUS_SUCCESS:
      return { loading: false, success: true, statusResult: action.payload };
    case UPDATE_CHILD_STATUS_FAIL:
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

export const childNameCheckReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CHECK_SIMILAR_NAMES_REQUEST:
      return { loading: true };
    case CHECK_SIMILAR_NAMES_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case CHECK_SIMILAR_NAMES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const childPreRegisterReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case PRE_REGISTER_CHILD_LIST_REQUEST:
      return { loading: true };
    case PRE_REGISTER_CHILD_LIST_SUCCESS:
      return { loading: false, success: true, preRegisterList: action.payload };
    case PRE_REGISTER_CHILD_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PRE_REGISTER_CHILD_LIST_REST:
      return {};
    case PRE_REGISTER_CHILD_ADD_REQUEST:
      return { loading: true };
    case PRE_REGISTER_CHILD_ADD_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case PRE_REGISTER_CHILD_ADD_FAIL:
      return { loading: false, error: action.payload };
    case PRE_REGISTER_CHILD_UPDATE_REQUEST:
      return { loading: true };
    case PRE_REGISTER_CHILD_UPDATE_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case PRE_REGISTER_CHILD_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_PRE_REGISTER_REQUEST:
      return { ...state, loading: true, success: false };
    case DELETE_PRE_REGISTER_SUCCESS:
      return { ...state, loading: false, success: true, deleted: action.payload };
    case DELETE_PRE_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case APPROVE_PRE_REGISTER_REQUEST:
      return { ...state, loading: true, success: false };
    case APPROVE_PRE_REGISTER_SUCCESS:
      return { ...state, loading: false, success: true, approved: action.payload };
    case APPROVE_PRE_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
