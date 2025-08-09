import { publicApi } from '../../apis/sayBase';
import {
  CITY_LIST_FAIL,
  CITY_LIST_REQUEST,
  CITY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_SUCCESS,
  STATE_LIST_FAIL,
  STATE_LIST_REQUEST,
  STATE_LIST_SUCCESS,
} from '../constants/countryConstants';

export const fetchCountryList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUNTRY_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/countries`, config);

    dispatch({
      type: COUNTRY_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: COUNTRY_LIST_FAIL,
      payload: e.response
        ? e.response.status
          ? e.response
          : e.response.data.message
        : e.message && e.message,
    });
  }
};

export const fetchStateList = (countryId) => async (dispatch, getState) => {
  try {
    dispatch({ type: STATE_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/countries/${countryId}/states`, config);

    dispatch({
      type: STATE_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: STATE_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchCityList = (stateId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CITY_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/states/${stateId}/cities`, config);

    dispatch({
      type: CITY_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CITY_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
