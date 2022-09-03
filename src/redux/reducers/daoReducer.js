import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  SIGNATURE_REQUEST,
  SIGNATURE_SUCCESS,
  SIGNATURE_FAIL,
  UPDATE_SERVER_REQUEST,
  UPDATE_SERVER_SUCCESS,
  UPDATE_SERVER_FAIL,
  GET_SERVER_NEEDS_REQUEST,
  GET_SERVER_NEEDS_SUCCESS,
  GET_SERVER_NEEDS_FAIL,
  UPDATE_FLASK_REQUEST,
  GET_SERVER_CHILDREN_REQUEST,
  GET_SERVER_CHILDREN_SUCCESS,
  GET_SERVER_CHILDREN_FAIL,
} from '../constants/daoConstants';

export const serverReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SERVER_CHILDREN_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_SERVER_CHILDREN_SUCCESS:
      return { ...state, loading: false, success: true, childList: action.payload };
    case GET_SERVER_CHILDREN_FAIL:
      return { loading: false, error: action.payload };
    case GET_SERVER_NEEDS_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_SERVER_NEEDS_SUCCESS:
      return { ...state, loading: false, success: true, needList: action.payload };
    case GET_SERVER_NEEDS_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_FLASK_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_SERVER_REQUEST:
      return { loading: true, success: false };
    case UPDATE_SERVER_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_SERVER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const familyNetworksReducer = (state = {}, action) => {
  switch (action.type) {
    case FAMILY_NETWORK_REQUEST:
      return { loading: true, success: false };
    case FAMILY_NETWORK_SUCCESS:
      return { loading: false, success: true, network: action.payload };
    case FAMILY_NETWORK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const signatureReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGNATURE_REQUEST:
      return { loading: true, success: false };
    case SIGNATURE_SUCCESS:
      return { loading: false, success: true, signature: action.payload };
    case SIGNATURE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
