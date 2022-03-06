import { publicApi } from '../../apis/sayBase';
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
        'Content-type': 'application/json',
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
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const login = (userName, password) => async (dispatch) => {
  try {
    console.log('huh?');
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = {
      headers: {
        'Content-type': 'application/json',
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
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: USER_LOGOUT });
  localStorage.removeItem('userInfo');
};

export const forgotPassword = (theKey, value) => async (dispatch) => {
  let resetType;
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });
    const config = {
      headers: {
        'Content-type': 'application/json',
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
      payload: e.response && e.response.status ? e.response : e.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.accessToken,
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
      payload: e.response && e.response.status ? e.response : e.message,
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
          'Content-type': 'application/json',
          Authorization: userInfo && userInfo.accessToken,
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
        payload: e.response && e.response.status ? e.response : e.message,
      });
    }
  };
