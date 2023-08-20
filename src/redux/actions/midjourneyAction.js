import { daoApi } from '../../apis/sayBase';
import {
  SELECT_MIDJOURNEY_IMAGE_FAIL,
  SELECT_MIDJOURNEY_IMAGE_REQUEST,
  SELECT_MIDJOURNEY_IMAGE_SUCCESS,
  ARCHIVE_MIDJOURNEY_IMAGES_FAIL,
  ARCHIVE_MIDJOURNEY_IMAGES_REQUEST,
  ARCHIVE_MIDJOURNEY_IMAGES_SUCCESS,
  GET_ALL_MIDJOURNEY_IMAGES_FAIL,
  GET_ALL_MIDJOURNEY_IMAGES_REQUEST,
  GET_ALL_MIDJOURNEY_IMAGES_SUCCESS,
} from '../constants/midjourneyConstants';

export const fetchMidjourneyImages = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_MIDJOURNEY_IMAGES_REQUEST });
    const { data } = await daoApi.get(`/midjourney/local/all`);
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

    const { data: fileData } = await daoApi.get(
      'http://localhost:8002/api/dao/download/streamable2/.%2Fuploads%2Fmidjourney%2Fneed-9297%2F9297_1.png',
    );
    console.log(fileData);

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('selectedImage', selectedImage);

    const { data } = await daoApi.post(`/midjourney/select/${needFlaskId}`, formData, config);

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

export const archivesMidjourneyImages = (needFlaskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ARCHIVE_MIDJOURNEY_IMAGES_REQUEST });

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
    const { data } = await daoApi.delete(`/midjourney/${needFlaskId}`, config);

    dispatch({
      type: ARCHIVE_MIDJOURNEY_IMAGES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: ARCHIVE_MIDJOURNEY_IMAGES_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
