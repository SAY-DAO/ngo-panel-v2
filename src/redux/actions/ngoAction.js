import { publicApi } from '../../apis/sayBase';
import {
  NGO_BY_ID_FAIL,
  NGO_BY_ID_REQUEST,
  NGO_BY_ID_SUCCESS,
  NGO_LIST_FAIL,
  NGO_LIST_REQUEST,
  NGO_LIST_SUCCESS,
} from '../constants/ngoConstants';

export const fetchNgoById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: NGO_BY_ID_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/ngo/ngoId=${id}`, config);

    dispatch({
      type: NGO_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: NGO_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchNgoList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NGO_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/ngo/all`, config);
    
    dispatch({
      type: NGO_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: NGO_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
