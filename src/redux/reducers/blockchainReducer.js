import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  SIGNATURE_REQUEST,
  SIGNATURE_SUCCESS,
  SIGNATURE_FAIL,
  CREATE_MILESTONE_REQUEST,
  CREATE_MILESTONE_SUCCESS,
  CREATE_MILESTONE_FAIL,
  GET_MILESTONES_REQUEST,
  GET_MILESTONES_SUCCESS,
  GET_MILESTONES_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  WALLET_CONNECT_FAIL,
} from '../constants/daoConstants';

export const walletReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_CONNECT_REQUEST:
      return { loading: true, success: false };
    case WALLET_CONNECT_SUCCESS:
      return { loading: false, success: true, myWallet: action.payload };
    case WALLET_CONNECT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const mileStoneReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MILESTONES_REQUEST:
      return { loading: true, success: false };
    case GET_MILESTONES_SUCCESS:
      return { loading: false, success: true, fetched: action.payload };
    case GET_MILESTONES_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_MILESTONE_REQUEST:
      return { loading: true, success: false };
    case CREATE_MILESTONE_SUCCESS:
      return { loading: false, success: true, created: action.payload };
    case CREATE_MILESTONE_FAIL:
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
