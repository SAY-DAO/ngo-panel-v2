/* eslint-disable import/prefer-default-export */
import {
  ARCHIVE_MIDJOURNEY_IMAGES_FAIL,
  ARCHIVE_MIDJOURNEY_IMAGES_REQUEST,
  ARCHIVE_MIDJOURNEY_IMAGES_SUCCESS,
  GET_ALL_MIDJOURNEY_IMAGES_FAIL,
  GET_ALL_MIDJOURNEY_IMAGES_REQUEST,
  GET_ALL_MIDJOURNEY_IMAGES_SUCCESS,
  SELECT_MIDJOURNEY_IMAGE_FAIL,
  SELECT_MIDJOURNEY_IMAGE_REQUEST,
  SELECT_MIDJOURNEY_IMAGE_SUCCESS,
} from '../constants/midjourneyConstants';

export const midjourneyReducer = (state = {}, action) => {
  switch (action.type) {
    case SELECT_MIDJOURNEY_IMAGE_REQUEST:
      return { ...state, loading: true, success: false };
    case SELECT_MIDJOURNEY_IMAGE_SUCCESS:
      return { ...state, loading: false, success: true, selected: action.payload };
    case SELECT_MIDJOURNEY_IMAGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GET_ALL_MIDJOURNEY_IMAGES_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_ALL_MIDJOURNEY_IMAGES_SUCCESS:
      return { ...state, ...state, loading: false, success: true, needs: action.payload };
    case GET_ALL_MIDJOURNEY_IMAGES_FAIL:
      return { loading: false, error: action.payload };
    case ARCHIVE_MIDJOURNEY_IMAGES_REQUEST:
      return { ...state, loading: true, success: false };
    case ARCHIVE_MIDJOURNEY_IMAGES_SUCCESS:
      return { ...state, loading: false, success: true, archived: action.payload };
    case ARCHIVE_MIDJOURNEY_IMAGES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
