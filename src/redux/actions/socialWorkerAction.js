import { publicApi } from '../../apis/sayBase';
import {
  SW_DETAILS_REQUEST,
  SW_LIST_REQUEST,
  SW_LIST_SUCCESS,
  SW_LIST_FAIL,
  SW_DETAILS_FAIL,
  SW_DETAILS_SUCCESS,
  UPDATE_SW_IS_ACTIVE_REQUEST,
  UPDATE_SW_IS_ACTIVE_SUCCESS,
  UPDATE_SW_IS_ACTIVE_FAIL,
  SW_BY_ID_REQUEST,
  SW_BY_ID_SUCCESS,
  SW_BY_ID_FAIL,
  UPDATE_SW_SUCCESS,
  UPDATE_SW_FAIL,
  UPDATE_SW_REQUEST,
} from '../constants/socialWorkerConstants';

export const fetchSocialWorkerProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/socialworkers/${userInfo.id}`, config);

    dispatch({
      type: SW_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_DETAILS_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchSocialWorkerById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_BY_ID_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/socialworkers/${id}`, config);

    dispatch({
      type: SW_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchSocialWorkersList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.get('/socialworkers/', config);

    dispatch({
      type: SW_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const updateSwIsActive = (id, status) => async (dispatch, getState) => {
  try {
    console.log(id, status);
    dispatch({ type: UPDATE_SW_IS_ACTIVE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    let response;
    if (userInfo.id !== id) {
      response = await publicApi.post(`/socialworkers/${id}/${status}`, id, config);
    } else {
      throw new Error('You Can not deactivate yourself');
    }

    dispatch({
      type: UPDATE_SW_IS_ACTIVE_SUCCESS,
      payload: response,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SW_IS_ACTIVE_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const updateSw = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_SW_REQUEST });
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

    // formData.set('firstName', values.firstName);
    // formData.set('lastName', values.lastName);
    // formData.set('email', values.email);
    // formData.set('country', values.country);
    // formData.set('city', values.city);
    // formData.set('phoneNumber', values.phoneNumber);
    // formData.set('emergePhone', values.emergePhone);
    // formData.set('address', values.address);
    // formData.set('userName', values.userName);
    // formData.set('telegramId', values.telegramId);
    // formData.set('typeId', values.typeId);
    // formData.set('idCardUrl', values.idCardUrl);
    // formData.set('idNumber', values.idNumber);
    // formData.set('ngoName', values.ngoName);
    // formData.set('avatarUrl', values.avatarUrl);
    // formData.set('birthDate', values.birthDate);
    console.log(values);
    const { data } = await publicApi.patch(`/socialworkers/`, formData, config);

    dispatch({
      type: UPDATE_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SW_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
