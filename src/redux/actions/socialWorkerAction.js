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
  ADD_SW_REQUEST,
  ADD_SW_SUCCESS,
  ADD_SW_FAIL,
  MIGRATE_CHILDREN_FAIL,
  MIGRATE_CHILDREN_SUCCESS,
  MIGRATE_CHILDREN_REQUEST,
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

export const migrateSwChildren = (fromId, toId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MIGRATE_CHILDREN_REQUEST });
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
    formData.set('destinationSocialWorkerId', parseInt(toId, 10));

    const { data } = await publicApi.post(
      `/socialworkers/${fromId}/children/migrate`,
      formData,
      config,
    );

    dispatch({
      type: MIGRATE_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: MIGRATE_CHILDREN_FAIL,
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

    if (values.isCoordinator != null) {
      formData.set('isCoordinator', values.isCoordinator);
    }
    if (values.firstName) {
      formData.set('firstName', values.firstName);
    }
    if (values.lastName) {
      formData.set('lastName', values.lastName);
    }
    if (values.email) {
      formData.set('email', values.email);
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
    if (values.emergencyPhoneNumber) {
      formData.set('emergencyPhoneNumber', values.emergencyPhoneNumber);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }
    if (values.userName) {
      formData.set('username', values.userName);
    }
    if (values.telegramId) {
      formData.set('telegramId', values.telegramId);
    }
    if (values.typeId) {
      formData.set('typeId', values.typeId);
    }
    if (values.idCardFile) {
      formData.set('idCardUrl', values.idCardFile);
    }
    if (values.idNumber) {
      formData.set('idNumber', values.idNumber);
    }
    if (values.ngoId) {
      formData.set('ngoId', values.ngoId);
    }
    if (values.avatarFile) {
      formData.set('avatarUrl', values.avatarFile);
    }
    if (values.birthDate) {
      formData.set('birthDate', Date.parse(values.birthDate));
    }

    const { data } = await publicApi.patch(`/socialworkers/${values.id}`, formData, config);

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

export const AddSw = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_SW_REQUEST });
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
    formData.set('gender', false);

    if (values.isCoordinator != null) {
      formData.set('isCoordinator', values.isCoordinator);
    }
    if (values.firstName) {
      formData.set('firstName', values.firstName);
    }
    if (values.lastName) {
      formData.set('lastName', values.lastName);
    }
    if (values.email) {
      formData.set('email', values.email);
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
    if (values.emergencyPhoneNumber) {
      formData.set('emergencyPhoneNumber', values.emergencyPhoneNumber);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }
    if (values.userName) {
      formData.set('username', values.userName);
    }
    if (values.telegramId) {
      formData.set('telegramId', values.telegramId);
    }
    if (values.typeId) {
      formData.set('typeId', values.typeId);
    }
    if (values.idCardFile) {
      formData.set('idCardUrl', values.idCardFile);
    }
    if (values.idNumber) {
      formData.set('idNumber', values.idNumber);
    }
    if (values.ngoId) {
      formData.set('ngoId', values.ngoId);
    }
    if (values.avatarFile) {
      formData.set('avatarUrl', values.avatarFile);
    }
    if (values.birthDate) {
      formData.set('birthDate', Date.parse(values.birthDate));
    }

    console.log(values);
    const { data } = await publicApi.post(`/socialworkers/`, formData, config);

    dispatch({
      type: ADD_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_SW_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
