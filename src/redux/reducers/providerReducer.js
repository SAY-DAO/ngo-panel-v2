import {
  ADD_PROVIDER_FAIL,
  ADD_PROVIDER_REQUEST,
  ADD_PROVIDER_SUCCESS,
  DELETE_PROVIDER_FAIL,
  DELETE_PROVIDER_REQUEST,
  DELETE_PROVIDER_SUCCESS,
  PROVIDER_BY_ID_FAIL,
  PROVIDER_BY_ID_REQUEST,
  PROVIDER_BY_ID_RESET,
  PROVIDER_BY_ID_SUCCESS,
  PROVIDER_LIST_FAIL,
  PROVIDER_LIST_REQUEST,
  PROVIDER_LIST_RESET,
  PROVIDER_LIST_SUCCESS,
  UPDATE_PROVIDER_FAIL,
  UPDATE_PROVIDER_IS_ACTIVE_FAIL,
  UPDATE_PROVIDER_IS_ACTIVE_REQUEST,
  UPDATE_PROVIDER_IS_ACTIVE_SUCCESS,
  UPDATE_PROVIDER_REQUEST,
  UPDATE_PROVIDER_SUCCESS,
} from '../constants/providerConstants';

export const providerByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case PROVIDER_BY_ID_REQUEST:
      return { loading: true };
    case PROVIDER_BY_ID_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case PROVIDER_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case PROVIDER_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const providerListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case PROVIDER_LIST_REQUEST:
      return { loading: true };
    case PROVIDER_LIST_SUCCESS:
      return { loading: false, success: true, providerList: action.payload };
    case PROVIDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case PROVIDER_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const providerUpdateIsActiveReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_PROVIDER_IS_ACTIVE_REQUEST:
      return { loading: true };
    case UPDATE_PROVIDER_IS_ACTIVE_SUCCESS:
      return { loading: false, success: true, status: action.payload };
    case UPDATE_PROVIDER_IS_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const providerUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_PROVIDER_REQUEST:
      return { loading: true };
    case UPDATE_PROVIDER_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_PROVIDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const providerAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_PROVIDER_REQUEST:
      return { loading: true };
    case ADD_PROVIDER_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_PROVIDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const providerDeleteReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case DELETE_PROVIDER_REQUEST:
      return { loading: true };
    case DELETE_PROVIDER_SUCCESS:
      return { loading: false, success: true, deleted: action.payload };
    case DELETE_PROVIDER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
