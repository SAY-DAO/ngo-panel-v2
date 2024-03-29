import { daoApi, publicApi } from '../../apis/sayBase';
import { SIGNATURE_RESET } from '../constants/daoConstants';
import { USER_TICKET_LIST_RESET } from '../constants/ticketConstants';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  USER_LOGOUT,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_SUCCESS,
  MY_PAGE_REQUEST,
  MY_PAGE_SUCCESS,
  MY_PAGE_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_SEARCH_REQUEST,
  USER_SEARCH_SUCCESS,
  USER_SEARCH_FAIL,
  USER_CHILDREN_REQUEST,
  USER_CHILDREN_SUCCESS,
  USER_CHILDREN_FAIL,
  MY_PAGE_RESET,
} from '../constants/userConstants';

export const register = (userName, password, theKey, value, otp) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('password', password);
    formData.append('verifyCode', otp);

    if (theKey === 'email') {
      formData.append('email', value);
    }
    if (theKey === 'phone') {
      formData.append('phoneNumber', value);
      // formData.append('countryCode', dialCode);
    }

    dispatch({ type: USER_REGISTER_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await publicApi.post('/auth/register', formData, {
      config,
    });
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.removeItem('verifyInfo');
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const login = (userName, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('password', password);

    const { data } = await publicApi.post('/panel/auth/login', formData, config);

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (e) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: MY_PAGE_RESET });
  dispatch({ type: SIGNATURE_RESET });
  dispatch({ type: USER_TICKET_LIST_RESET });
  localStorage.removeItem('userInfo');
  localStorage.removeItem('say-siwe');
};

export const forgotPassword = (theKey, value) => async (dispatch) => {
  let resetType;
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const formData = new FormData();
    if (theKey === 'email') {
      formData.append('email', value);
      resetType = 'email';
    }
    if (theKey === 'phone_number') {
      // To be consistent with back-end this line phone_number is phoneNumber
      formData.append('phoneNumber', value);
      resetType = 'phone';
    }

    const { data } = await publicApi.post(`/auth/password/reset/${resetType}`, formData, config);
    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const resetPassword = (password) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_RESET_PASSWORD_REQUEST });

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
    formData.append('password', password);

    const { data } = await publicApi.patch(`/user/update/userId=me`, formData, config);
    dispatch({
      type: USER_RESET_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_RESET_PASSWORD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const userEditProfile =
  (phoneAuth, emailAuth, avatarUrl, firstName, lastName, phoneNumber, email, userName) =>
    async (dispatch, getState) => {
      try {
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

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
        if (userInfo.user.avatarUrl !== avatarUrl) {
          formData.append('avatarUrl', avatarUrl);
        }
        if (userInfo.user.firstName !== firstName) {
          formData.append('firstName', firstName);
        }
        if (userInfo.user.lastName !== lastName) {
          formData.append('lastName', lastName);
        }
        if (phoneAuth && userInfo.user.phone_number !== phoneNumber) {
          formData.append('phoneNumber', phoneNumber);
        }
        if (emailAuth && userInfo.user.emailAddress !== email) {
          formData.append('email', email);
        }
        if (userInfo.user.userName !== userName) {
          formData.append('userName', userName);
        }
        const { data } = await publicApi.patch(`/user/update/userId=me`, formData, config);

        dispatch({
          type: USER_UPDATE_PROFILE_SUCCESS,
          payload: data,
        });
      } catch (e) {
        dispatch({
          type: USER_UPDATE_PROFILE_FAIL,
          payload: e.response && (e.response.status ? e.response : e.response.data.message),
        });
      }
    };

export const fetchMyPage = (userId, typeId, take, limit) => async (dispatch, getState) => {
  try {
    dispatch({ type: MY_PAGE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
        'X-TAKE': take,
        'X-LIMIT': limit,
      },
    };

    const response = await daoApi.get(`/users/myPage/${userId}/${typeId}`, config);
    dispatch({
      type: MY_PAGE_SUCCESS,
      payload: response && response.data,
    });
  } catch (e) {
    dispatch({
      type: MY_PAGE_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const changeUserPassword = (currentPassword, newPassword) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_CHANGE_PASSWORD_REQUEST });
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
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);
    const { data } = await publicApi.post('/socialworkers/me/change-password', formData, config);
    dispatch({
      type: USER_CHANGE_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_CHANGE_PASSWORD_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};


export const searchUser = (query) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_SEARCH_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/family/search?q=${query}`, config);
    dispatch({
      type: USER_SEARCH_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_SEARCH_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};


export const fetchUserChildren = (flaskUserId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_CHILDREN_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/family/my/children/${flaskUserId}`, config);
    dispatch({
      type: USER_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_CHILDREN_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};