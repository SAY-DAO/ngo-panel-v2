import { daoApi, publicApi } from '../../apis/sayBase';
import {
  ADD_PROVIDER_FAIL,
  ADD_PROVIDER_REQUEST,
  ADD_PROVIDER_SUCCESS,
  DELETE_PROVIDER_FAIL,
  DELETE_PROVIDER_REQUEST,
  DELETE_PROVIDER_SUCCESS,
  PROVIDER_BY_ID_FAIL,
  PROVIDER_BY_ID_REQUEST,
  PROVIDER_BY_ID_SUCCESS,
  PROVIDER_LIST_FAIL,
  PROVIDER_LIST_REQUEST,
  PROVIDER_LIST_SUCCESS,
  UPDATE_PROVIDER_FAIL,
  UPDATE_PROVIDER_IS_ACTIVE_FAIL,
  UPDATE_PROVIDER_IS_ACTIVE_REQUEST,
  UPDATE_PROVIDER_IS_ACTIVE_SUCCESS,
  UPDATE_PROVIDER_REQUEST,
  UPDATE_PROVIDER_SUCCESS,
} from '../constants/providerConstants';

export const fetchProviderById = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROVIDER_BY_ID_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/provider/providerId=${id}`, config);

    dispatch({
      type: PROVIDER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: PROVIDER_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchProviderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROVIDER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await daoApi.get(`/providers/all`, config);

    dispatch({
      type: PROVIDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: PROVIDER_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const updateProviderIsActive = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PROVIDER_IS_ACTIVE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.patch(`/provider/${status}/providerId=${id}`, id, config);

    dispatch({
      type: UPDATE_PROVIDER_IS_ACTIVE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_PROVIDER_IS_ACTIVE_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const updateProvider = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PROVIDER_REQUEST });
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

    if (values.firstName) {
      formData.set('name', values.name);
    }
    if (values.lastName) {
      formData.set('lastName', values.lastName);
    }
    if (values.emailAddress) {
      formData.set('emailAddress', values.emailAddress);
    }
    if (values.country) {
      formData.set('country', values.country);
    }
    if (values.city) {
      formData.set('city', values.city);
    }
    if (values.phoneNumber) {
      formData.set('phoneNumber', values.phoneNumber);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }
    if (values.website) {
      formData.set('website', values.website);
    }

    if (values.finalImageFile) {
      formData.set('logoUrl', values.finalImageFile);
    }

    const { data } = await publicApi.patch(
      `/provider/update/providerId=${values.id}`,
      formData,
      config,
    );
    dispatch({
      type: UPDATE_PROVIDER_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_PROVIDER_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const addProvider = (values) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PROVIDER_REQUEST });

    const request = {
      name: values.name,
      website: values.website,
      type: values.type,
      country: values.country,
      city: values.city,
      state: values.state,
      description: values.description,
      logoUrl: values.logoUrl,
    };
    const { data } = await daoApi.post(`/providers/add`, request);
    dispatch({
      type: ADD_PROVIDER_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: ADD_PROVIDER_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const deleteProvider = (providerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_PROVIDER_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.patch(`/provider/delete/providerId=${providerId}`, {}, config);
    dispatch({
      type: DELETE_PROVIDER_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_PROVIDER_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
