import { daoApi } from '../../apis/sayBase';
import {
  LIST_COMMENT_FAIL,
  LIST_COMMENT_REQUEST,
  LIST_COMMENT_SUCCESS,
  UPDATE_COMMENT_FAIL,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  RESOLVE_COMMENT_FAIL,
  RESOLVE_COMMENT_REQUEST,
  RESOLVE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAIL,
} from '../constants/commentConstants';

import { VirtualFamilyRole } from '../../utils/types';

export const fetchComments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_COMMENT_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const response = await daoApi.get(`/comment/all`, config);
    dispatch({
      type: LIST_COMMENT_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: LIST_COMMENT_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const updateComment =
  ({ isResolved, message, needId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_COMMENT_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo && userInfo.access_token,
          flaskId: userInfo && userInfo.id,
        },
      };

      const { data } = await daoApi.post(
        `/comment/update`,
        { message, needId, isResolved },
        config,
      );

      dispatch({
        type: UPDATE_COMMENT_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: UPDATE_COMMENT_FAIL,
        payload:
          e.response && e.response.data.detail
            ? e.response.data
            : e.response && e.response.data
            ? e.response.data.message
            : e.response,
      });
    }
  };

export const resolveComment = (needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: RESOLVE_COMMENT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.patch(`/comment/resolve/${needId}`, {}, config);

    dispatch({
      type: RESOLVE_COMMENT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: RESOLVE_COMMENT_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data
          : e.response && e.response.data
          ? e.response.data.message
          : e.response,
    });
  }
};

export const deleteComment = (commentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_COMMENT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.delete(`/comment/${commentId}`, config);

    dispatch({
      type: DELETE_COMMENT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_COMMENT_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data
          : e.response && e.response.data
          ? e.response.data.message
          : e.response,
    });
  }
};

export const createComment = (flaskNeedId, needNestId, message) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_COMMENT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.post(
      `/comment/create`,
      { flaskNeedId, needNestId, vRole: VirtualFamilyRole.SAY, message },
      config,
    );

    dispatch({
      type: CREATE_COMMENT_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CREATE_COMMENT_FAIL,
      payload: e.response && e.response.data ? e.response.data.message : e.message,
    });
  }
};
