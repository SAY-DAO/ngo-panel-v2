import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_FORGOT_PASSWORD_REQUEST,
  USER_FORGOT_PASSWORD_SUCCESS,
  USER_FORGOT_PASSWORD_FAIL,
  USER_FORGOT_PASSWORD_RESET,
  USER_RESET_PASSWORD_REQUEST,
  USER_RESET_PASSWORD_SUCCESS,
  USER_RESET_PASSWORD_FAIL,
  USER_RESET_PASSWORD_RESET,
  USER_REGISTER_RESET,
  MY_PAGE_REQUEST,
  MY_PAGE_SUCCESS,
  MY_PAGE_FAIL,
  MY_PAGE_RESET,
  USER_SEARCH_REQUEST,
  USER_SEARCH_SUCCESS,
  USER_SEARCH_FAIL,
  USER_SEARCH_RESET,
  USER_BY_ID_REQUEST,
  USER_BY_ID_SUCCESS,
  USER_BY_ID_FAIL,
  USER_BY_ID_RESET,
  USER_CHECKPOINTS_REQUEST,
  USER_CHECKPOINTS_SUCCESS,
  USER_CHECKPOINTS_FAIL,
  USER_CHECKPOINTS_RESET,
  USER_IS_BUILDER_REQUEST,
  USER_IS_BUILDER_SUCCESS,
  USER_IS_BUILDER_FAIL,
  USER_IS_BUILDER_RESET,
  USER_CHILDREN_REQUEST,
  USER_CHILDREN_SUCCESS,
  USER_CHILDREN_FAIL,
  USER_CHILDREN_RESET,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_CHANGE_PASSWORD_RESET,
  USER_BUILDERS_REQUEST,
  USER_BUILDERS_SUCCESS,
  USER_BUILDERS_FAIL,
  USER_BUILDERS_RESET,
} from '../constants/userConstants';

export const userRegisterReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const userLoginReducer = (state = { userInfo: {} }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true, success: false };
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        success: true,
        userInfo: action.payload,
      };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userForgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_FORGOT_PASSWORD_REQUEST:
      return { loading: true, success: false };
    case USER_FORGOT_PASSWORD_SUCCESS:
      return { loading: false, success: true, forgotPass: action.payload };
    case USER_FORGOT_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_FORGOT_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const userResetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_RESET_PASSWORD_REQUEST:
      return { loading: true };
    case USER_RESET_PASSWORD_SUCCESS:
      return { loading: false, success: true, resetPass: action.payload };
    case USER_RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_RESET_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const myPageReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case MY_PAGE_REQUEST:
      return { loading: true };
    case MY_PAGE_SUCCESS:
      return { loading: false, success: true, pageDetails: action.payload };
    case MY_PAGE_FAIL:
      return { loading: false, error: action.payload };
    case MY_PAGE_RESET:
      return {};
    default:
      return state;
  }
};

export const userChangePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHANGE_PASSWORD_REQUEST:
      return { loading: true };
    case USER_CHANGE_PASSWORD_SUCCESS:
      return { loading: false, success: true, changePass: action.payload };
    case USER_CHANGE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    case USER_CHANGE_PASSWORD_RESET:
      return {};
    default:
      return state;
  }
};

export const userSearchReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SEARCH_REQUEST:
      return { loading: true };
    case USER_SEARCH_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case USER_SEARCH_FAIL:
      return { loading: false, error: action.payload };
    case USER_SEARCH_RESET:
      return {};
    default:
      return state;
  }
};

export const userCheckPointsReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHECKPOINTS_REQUEST:
      return { loading: true };
    case USER_CHECKPOINTS_SUCCESS:
      return { loading: false, success: true, points: action.payload };
    case USER_CHECKPOINTS_FAIL:
      return { loading: false, error: action.payload };
    case USER_CHECKPOINTS_RESET:
      return {};
    default:
      return state;
  }
};

export const userFetchReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_BY_ID_REQUEST:
      return { loading: true };
    case USER_BY_ID_SUCCESS:
      return { loading: false, success: true, dappUser: action.payload };
    case USER_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case USER_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const userBuilderStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_IS_BUILDER_REQUEST:
      return { loading: true };
    case USER_IS_BUILDER_SUCCESS:
      return { loading: false, success: true, updateResult: action.payload };
    case USER_IS_BUILDER_FAIL:
      return { loading: false, error: action.payload };
    case USER_IS_BUILDER_RESET:
      return {};
    case USER_BUILDERS_REQUEST:
      return { loading: true };
    case USER_BUILDERS_SUCCESS:
      return { loading: false, success: true, builders: action.payload };
    case USER_BUILDERS_FAIL:
      return { loading: false, error: action.payload };
    case USER_BUILDERS_RESET:
      return {};
    default:
      return state;
  }
};
export const userChildrenReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_CHILDREN_REQUEST:
      return { loading: true };
    case USER_CHILDREN_SUCCESS:
      return { loading: false, success: true, userChildren: action.payload };
    case USER_CHILDREN_FAIL:
      return { loading: false, error: action.payload };
    case USER_CHILDREN_RESET:
      return {};
    default:
      return state;
  }
};
