import {
  ADD_RECEIPT_FAIL,
  ADD_RECEIPT_REQUEST,
  ADD_RECEIPT_SUCCESS,
  NEED_RECEIPT_LIST_FAIL,
  NEED_RECEIPT_LIST_REQUEST,
  NEED_RECEIPT_LIST_SUCCESS,
} from '../constants/reportConstants';

export const receiptsListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NEED_RECEIPT_LIST_REQUEST:
      return { loading: true };
    case NEED_RECEIPT_LIST_SUCCESS:
      return { loading: false, success: true, receipts: action.payload };
    case NEED_RECEIPT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const receiptAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_RECEIPT_REQUEST:
      return { loading: true };
    case ADD_RECEIPT_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_RECEIPT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
