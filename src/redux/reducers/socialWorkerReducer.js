import {
  SW_LIST_REQUEST,
  SW_LIST_SUCCESS,
  SW_LIST_FAIL,
  SW_DETAILS_REQUEST,
  SW_DETAILS_FAIL,
  SW_DETAILS_SUCCESS,
} from '../constants/socialWorkerConstants';

export const socialWorkerDetailsReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_DETAILS_REQUEST:
      return { loading: true };
    case SW_DETAILS_SUCCESS:
      return { loading: false, success: true, swInfo: action.payload };
    case SW_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const socialWorkerListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_LIST_REQUEST:
      return { loading: true };
    case SW_LIST_SUCCESS:
      return { loading: false, success: true, swList: action.payload };
    case SW_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
