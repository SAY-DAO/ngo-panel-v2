/* eslint-disable import/prefer-default-export */
import {
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_FAIL,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
  LIST_COMMENT_REQUEST,
  LIST_COMMENT_FAIL,
  LIST_COMMENT_SUCCESS,
  RESOLVE_COMMENT_REQUEST,
  RESOLVE_COMMENT_SUCCESS,
  RESOLVE_COMMENT_FAIL,
} from '../constants/commentConstants';

export const commentsReducer = (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_COMMENT_REQUEST:
      return { ...state, loading: true, success: false };
    case RESOLVE_COMMENT_SUCCESS:
      return { ...state, loading: false, success: true, resolveResult: action.payload };
    case RESOLVE_COMMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_COMMENT_REQUEST:
      return { ...state, loading: true, success: false };
    case UPDATE_COMMENT_SUCCESS:
      return { ...state, loading: false, success: true, updatedComment: action.payload };
    case UPDATE_COMMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case DELETE_COMMENT_REQUEST:
      return { ...state, loading: true, success: false };
    case DELETE_COMMENT_SUCCESS:
      return { ...state, loading: false, success: true, deletedComment: action.payload };
    case DELETE_COMMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    case LIST_COMMENT_REQUEST:
      return { ...state, loading: true, success: false };
    case LIST_COMMENT_SUCCESS:
      return { ...state, loading: false, success: true, needsWithComment: action.payload };
    case LIST_COMMENT_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
