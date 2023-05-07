import { publicApi, cachePublicApi } from '../../apis/sayBase';
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
  COUNTRY_BY_ID_SUCCESS,
  COUNTRY_BY_ID_FAIL,
  CITY_BY_ID_REQUEST,
  CITY_BY_ID_SUCCESS,
  CITY_BY_ID_FAIL,
  COUNTRY_BY_ID_REQUEST,
  CITIES_BY_IDS_REQUEST,
  CITIES_BY_IDS_SUCCESS,
  CITIES_BY_IDS_FAIL,
} from '../constants/countryConstants';

export const fetchCountryList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUNTRY_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      id: 'fetch-countries',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await cachePublicApi.get(`/countries`, config);

    dispatch({
      type: COUNTRY_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: COUNTRY_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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

export const fetchCountryById = (countryId) => async (dispatch) => {
  try {
    dispatch({ type: COUNTRY_BY_ID_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await publicApi.get(`/cities/${countryId}`, config);
    dispatch({
      type: COUNTRY_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: COUNTRY_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchCityById = (cityId) => async (dispatch) => {
  try {
    dispatch({ type: CITY_BY_ID_REQUEST });

    const config = {
      id: `fetch-city:${cityId}`,
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await cachePublicApi.get(`/cities/${cityId}`, config);

    dispatch({
      type: CITY_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CITY_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

async function getCityById(cityId) {
  const config = {
    id: `fetch-city:${cityId}`,
    headers: {
      'Content-type': 'application/json',
    },
  };

  const { data } = await cachePublicApi.get(`/cities/${cityId}`, config);
  return data;
}

export const fetchCitiesByIds = (cityIds) => async (dispatch) => {
  try {
    dispatch({ type: CITIES_BY_IDS_REQUEST });
    const uniqueIds = [...new Set(cityIds)];

    const promises = await Promise.all(
      uniqueIds.map(async (cityId) => {
        return getCityById(cityId);
      }),
    );

    dispatch({
      type: CITIES_BY_IDS_SUCCESS,
      payload: promises,
    });
  } catch (e) {
    dispatch({
      type: CITIES_BY_IDS_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
