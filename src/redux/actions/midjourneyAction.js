import { daoApi } from '../../apis/sayBase';
import {
  SELECT_MIDJOURNEY_IMAGE_FAIL,
  SELECT_MIDJOURNEY_IMAGE_REQUEST,
  SELECT_MIDJOURNEY_IMAGE_SUCCESS,
  DELETE_MIDJOURNEY_FOLDER_FAIL,
  DELETE_MIDJOURNEY_FOLDER_REQUEST,
  DELETE_MIDJOURNEY_FOLDER_SUCCESS,
  GET_ALL_MIDJOURNEY_IMAGES_FAIL,
  GET_ALL_MIDJOURNEY_IMAGES_REQUEST,
  GET_ALL_MIDJOURNEY_IMAGES_SUCCESS,
} from '../constants/midjourneyConstants';

export const fetchMidjourneyImages = (take, limit) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ALL_MIDJOURNEY_IMAGES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id, // nest server needs this for auth
        'X-TAKE': take,
        'X-LIMIT': limit,
      },
    };
    const { data } = await daoApi.get(`/midjourney/local/all`, config);
    dispatch({
      type: GET_ALL_MIDJOURNEY_IMAGES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ALL_MIDJOURNEY_IMAGES_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const selectMidjourneyImage = (needFlaskId, selectedImage) => async (dispatch, getState) => {
  console.log(needFlaskId, selectedImage);
  try {
    dispatch({ type: SELECT_MIDJOURNEY_IMAGE_REQUEST });

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
      `/midjourney/select/${needFlaskId}`,
      { selectedImage },
      config,
    );

    dispatch({
      type: SELECT_MIDJOURNEY_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: SELECT_MIDJOURNEY_IMAGE_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const deleteMidjourneyFolder = (needFlaskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_MIDJOURNEY_FOLDER_REQUEST });

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
    const { data } = await daoApi.delete(`/midjourney/images/${needFlaskId}`, config);

    dispatch({
      type: DELETE_MIDJOURNEY_FOLDER_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: DELETE_MIDJOURNEY_FOLDER_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
