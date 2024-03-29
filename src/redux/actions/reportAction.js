import { publicApi } from '../../apis/sayBase';
import {
  ADD_RECEIPT_FAIL,
  ADD_RECEIPT_REQUEST,
  ADD_RECEIPT_SUCCESS,
  DELETE_RECEIPT_FAIL,
  DELETE_RECEIPT_REQUEST,
  DELETE_RECEIPT_SUCCESS,
  NEED_RECEIPT_LIST_FAIL,
  NEED_RECEIPT_LIST_REQUEST,
  NEED_RECEIPT_LIST_SUCCESS,
} from '../constants/reportConstants';

export const fetchNeedReceipts = (needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: NEED_RECEIPT_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.get(`/needs/${needId}/receipts`, config);

    dispatch({
      type: NEED_RECEIPT_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: NEED_RECEIPT_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const deleteReceipt = (needId, receiptId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_RECEIPT_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.delete(`/needs/${needId}/receipts/${receiptId}`, config);

    dispatch({
      type: DELETE_RECEIPT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_RECEIPT_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const addReceiptToNeed = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_RECEIPT_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    console.log(values);
    const formData = new FormData();

    if (values.code) {
      formData.set('code', values.code);
    }
    if (values.title) {
      formData.set('title', values.title);
    }
    if (values.needStatus) {
      formData.set('needStatus', values.needStatus);
    }
    if (values.description) {
      formData.set('description', values.description);
    }
    if (values.attachment) {
      formData.set('attachment', values.attachment);
    }

    const { data } = await publicApi.post(`/needs/${values.needId}/receipts`, formData, config);

    dispatch({
      type: ADD_RECEIPT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: ADD_RECEIPT_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
