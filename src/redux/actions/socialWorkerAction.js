import { daoApi, publicApi } from '../../apis/sayBase';
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
  MIGRATE_SW_CHILDREN_FAIL,
  MIGRATE_SW_CHILDREN_SUCCESS,
  MIGRATE_SW_CHILDREN_REQUEST,
  SW_CHILD_LIST_REQUEST,
  SW_CHILD_LIST_SUCCESS,
  SW_CHILD_LIST_FAIL,
  MIGRATE_ONE_CHILD_REQUEST,
  MIGRATE_ONE_CHILD_SUCCESS,
  MIGRATE_ONE_CHILD_FAIL,
  DELETE_SW_REQUEST,
  DELETE_SW_SUCCESS,
  DELETE_SW_FAIL,
} from '../constants/socialWorkerConstants';

export const fetchSocialWorkerDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: (userInfo && userInfo.access_token) || userInfo.accessToken,
      },
    };
    const { data } = await publicApi.get(
      `/socialworkers/${userInfo.id || userInfo.user.id}`,
      config,
    );
    dispatch({
      type: SW_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: SW_DETAILS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'application/json',
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
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchSocialWorkersList = (flaskNgoId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id, // nest server needs this for auth
      },
    };

    const { data } = await daoApi.get(`ngo/socialworkers/${flaskNgoId}`, config);

    dispatch({
      type: SW_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'application/json',
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
    console.log(e.response);

    dispatch({
      type: UPDATE_SW_IS_ACTIVE_FAIL,
      payload:
        e.response && e.response.data.status_code
          ? e.response.data.message
          : e.response.data.message,
    });
  }
};

export const fetchSwOrNgoChildList = (swId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_CHILD_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    // both confirmed and not confirmed children
    // migrate will use the first one
    let response;
    if (swId) {
      response = await publicApi.get(`/child/all/confirm=${2}?sw_id=${swId}`, config);
    } else {
      response = await publicApi.get(`/child/all/confirm=${2}`, config);
    }

    dispatch({
      type: SW_CHILD_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: SW_CHILD_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const migrateSwOneChild = (childId, toId) => async (dispatch, getState) => {
  try {
    dispatch({ type: MIGRATE_ONE_CHILD_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const formData = new FormData();
    formData.set('new_sw_id', parseInt(toId, 10));
    const { data } = await publicApi.patch(`/child/migrate/childId=${childId}`, formData, config);

    dispatch({
      type: MIGRATE_ONE_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: MIGRATE_ONE_CHILD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const migrateSwChildren = (fromId, toId) => async (dispatch, getState) => {
  console.log(fromId, toId);
  try {
    dispatch({ type: MIGRATE_SW_CHILDREN_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
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
      type: MIGRATE_SW_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: MIGRATE_SW_CHILDREN_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'application/json',
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
    if (values.password) {
      formData.set('password', values.password);
    }
    const { data } = await publicApi.patch(`/socialworkers/${values.id}`, formData, config);

    dispatch({
      type: UPDATE_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SW_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'application/json',
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

    const { data } = await publicApi.post(`/socialworkers/`, formData, config);

    dispatch({
      type: ADD_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_SW_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const deleteSw = (swId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_SW_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.delete(`/socialworkers/${swId}`, {}, config);
    dispatch({
      type: DELETE_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_SW_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
