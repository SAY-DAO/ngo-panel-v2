/* eslint-disable import/prefer-default-export */
import {
  CREATE_MILESTONE_FAIL,
  CREATE_MILESTONE_REQUEST,
  CREATE_MILESTONE_SUCCESS,
  GET_MILESTONES_FAIL,
  GET_MILESTONES_REQUEST,
  GET_MILESTONES_SUCCESS,
} from '../constants/daoConstants';

export const milestoneReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MILESTONES_REQUEST:
      return { loading: true, success: false };
    case GET_MILESTONES_SUCCESS:
      return { loading: false, success: true, fetched: action.payload };
    case GET_MILESTONES_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_MILESTONE_REQUEST:
      return { loading: true, success: false };
    case CREATE_MILESTONE_SUCCESS:
      return { loading: false, success: true, created: action.payload };
    case CREATE_MILESTONE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
