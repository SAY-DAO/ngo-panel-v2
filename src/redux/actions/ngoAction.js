import { publicApi } from '../../apis/sayBase';
import {
  ADD_NGO_FAIL,
  ADD_NGO_REQUEST,
  ADD_NGO_SUCCESS,
  NGO_BY_ID_FAIL,
  NGO_BY_ID_REQUEST,
  NGO_BY_ID_SUCCESS,
  NGO_LIST_FAIL,
  NGO_LIST_REQUEST,
  NGO_LIST_SUCCESS,
  UPDATE_NGO_FAIL,
  UPDATE_NGO_IS_ACTIVE_FAIL,
  UPDATE_NGO_IS_ACTIVE_REQUEST,
  UPDATE_NGO_IS_ACTIVE_SUCCESS,
  UPDATE_NGO_REQUEST,
  UPDATE_NGO_SUCCESS,
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

export const updateNgoIsActive = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_NGO_IS_ACTIVE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.patch(`/ngo/${status}/ngoId=${id}`, id, config);

    dispatch({
      type: UPDATE_NGO_IS_ACTIVE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_NGO_IS_ACTIVE_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const updateNgo = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_NGO_REQUEST });
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

    const { data } = await publicApi.patch(`/ngo/update/ngoId=${values.id}`, formData, config);
    dispatch({
      type: UPDATE_NGO_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_NGO_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const AddNgo = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_NGO_REQUEST });
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

    if (values.lastName) {
      formData.set('name', values.name);
    }
    if (values.email) {
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
    if (values.website) {
      formData.set('website', values.website);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }

    if (values.logoUrl) {
      formData.set('logoUrl', values.logoUrl);
    }

    const { data } = await publicApi.post(`/ngo/add`, formData, config);
    dispatch({
      type: ADD_NGO_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_NGO_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
