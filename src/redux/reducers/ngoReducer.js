import {
  NGO_BY_ID_FAIL,
  NGO_BY_ID_REQUEST,
  NGO_BY_ID_RESET,
  NGO_BY_ID_SUCCESS,
  NGO_LIST_FAIL,
  NGO_LIST_REQUEST,
  NGO_LIST_RESET,
  NGO_LIST_SUCCESS,
} from '../constants/ngoConstants';

export const ngoByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NGO_BY_ID_REQUEST:
      return { loading: true };
    case NGO_BY_ID_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case NGO_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case NGO_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const ngoListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NGO_LIST_REQUEST:
      return { loading: true };
    case NGO_LIST_SUCCESS:
      return { loading: false, success: true, ngoList: action.payload };
    case NGO_LIST_FAIL:
      return { loading: false, error: action.payload };
    case NGO_LIST_RESET:
      return {};
    default:
      return state;
  }
};
