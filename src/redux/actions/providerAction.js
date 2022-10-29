import { daoApi } from '../../apis/sayBase';
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
  UPDATE_PROVIDER_REQUEST,
  UPDATE_PROVIDER_SUCCESS,
} from '../constants/providerConstants';

export const fetchProviderById = (id) => async (dispatch) => {
  try {
    dispatch({ type: PROVIDER_BY_ID_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const { data } = await daoApi.get(`/providers/${id}/`, config);

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

export const fetchProviderList = () => async (dispatch) => {
  try {
    dispatch({ type: PROVIDER_LIST_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
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

export const updateProvider = (values) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROVIDER_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const formData = new FormData();

    if (values.name) {
      formData.append('name', values.name);
    }
    if (values.description) {
      formData.append('description', values.description);
    }
    if (values.country) {
      formData.append('country', values.country);
    }
    if (values.city) {
      formData.append('city', values.city);
    }
    if (values.type) {
      formData.append('type', values.type);
    }
    if (values.state) {
      formData.append('state', values.state);
    }
    if (values.website) {
      formData.append('website', values.website);
    }
    if (values.isActive) {
      formData.append('isActive', values.isActive);
    }
    if (values.logoFile) {
      formData.append('file', values.logoFile);
    }
    console.log(values);
    const { data } = await daoApi.patch(`/providers/update/${values.id}`, formData, config);
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
    console.log(values);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const formData = new FormData();
    if (values.name) {
      formData.append('name', values.name);
    }
    if (values.description) {
      formData.append('description', values.description);
    }
    if (values.country) {
      formData.append('country', values.country);
    }
    if (values.city) {
      formData.append('city', values.city);
    }
    if (values.type) {
      formData.append('type', values.type);
    }
    if (values.state) {
      formData.append('state', values.state);
    }
    if (values.website) {
      formData.append('website', values.website);
    }
    if (values.isActive) {
      formData.append('isActive', values.isActive);
    }
    if (values.logoFile) {
      formData.append('file', values.logoFile);
    }

    const { data } = await daoApi.post(`/providers/add`, formData, config);
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

export const deleteProvider = (providerId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PROVIDER_REQUEST });

    // const config = {
    //   headers: {
    //     'Content-type': 'application/json',
    //     Authorization: 'authorizationToken',
    //     data: {},
    //   },
    // };
    const { data } = await daoApi.delete(`/providers/${providerId}`, { data: { foo: "bar" } });
    // const {data} = await daoApi.delete(`/providers/${providerId}`, config, {});
    // const { data } = await daoApi.delete(`/providers/${providerId}`, { config });
    // const { data } = await daoApi.delete(`/providers/${providerId}`, {}, config);
    // console.log(data2);
    // console.log(data3);
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
