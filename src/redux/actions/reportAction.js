import { publicApi } from '../../apis/sayBase';
import {
  ADD_RECEIPT_FAIL,
  ADD_RECEIPT_REQUEST,
  ADD_RECEIPT_SUCCESS,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.get(`/needs/${needId}/receipts`, config);

    dispatch({
      type: NEED_RECEIPT_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: NEED_RECEIPT_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
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

    console.log('formData');
    // eslint-disable-next-line no-restricted-syntax
    for (const value of formData.values()) {
      console.log(value);
    }
    console.log('formData');
    const { data } = await publicApi.post(`/needs/${values.needId}/receipts`, formData, config);

    dispatch({
      type: ADD_RECEIPT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: ADD_RECEIPT_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
