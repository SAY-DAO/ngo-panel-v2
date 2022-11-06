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
  SW_PROFILE_REQUEST,
  SW_PROFILE_SUCCESS,
  SW_PROFILE_FAIL,
} from '../constants/socialWorkerConstants';

export const fetchSocialWorkerProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_PROFILE_REQUEST });
    const {
      // eslint-disable-next-line no-unused-vars
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    // const { data } = await daoApi.get(`/users/social-worker/tasks/${userInfo.id}`, config);
    const { data } = await daoApi.get(`/users/social-worker/tasks/13`, config);

    dispatch({
      type: SW_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_PROFILE_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchSocialWorkerDetails = () => async (dispatch, getState) => {
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchSocialWorkerById = (id) => async (dispatch, getState) => {
  console.log(id);
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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

export const fetchSwChildList = (swId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_CHILD_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    // both confirmed and not confirmed children
    const { data } = await publicApi.get(`/child/all/confirm=${2}?sw_id=${swId}`, config);

    dispatch({
      type: SW_CHILD_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_CHILD_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
        'Content-type': 'application/json',
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      type: MIGRATE_SW_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: MIGRATE_SW_CHILDREN_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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

    const { data } = await publicApi.post(`/socialworkers/`, formData, config);

    dispatch({
      type: ADD_SW_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_SW_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
