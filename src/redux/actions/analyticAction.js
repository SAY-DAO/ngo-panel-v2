import { daoApi } from '../../apis/sayBase';
import {
  GET_ANALYTICS_CHILD_FAIL,
  GET_ANALYTICS_CHILD_REQUEST,
  GET_ANALYTICS_CHILD_SUCCESS,
  GET_ANALYTICS_NEED_REQUEST,
  GET_ANALYTICS_NEED_SUCCESS,
  GET_ANALYTICS_NEED_FAIL,
  GET_ANALYTICS_CHILDREN_REQUEST,
  GET_ANALYTICS_CHILDREN_SUCCESS,
  GET_ANALYTICS_CHILDREN_FAIL,
  GET_ANALYTICS_NGOS_REQUEST,
  GET_ANALYTICS_NGOS_SUCCESS,
  GET_ANALYTICS_NGOS_FAIL,
  GET_ANALYTICS_ECOSYSTEM_REQUEST,
  GET_ANALYTICS_ECOSYSTEM_SUCCESS,
  GET_ANALYTICS_ECOSYSTEM_FAIL
} from '../constants/analyticConstants';

export const fetchNeedAnalytics = (needType) => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_NEED_REQUEST });
    const { data } = await daoApi.get(`/analytic/needs/${needType}`);

    dispatch({
      type: GET_ANALYTICS_NEED_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_NEED_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchChildrenAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_CHILDREN_REQUEST });
    const { data } = await daoApi.get(`/analytic/children`);

    dispatch({
      type: GET_ANALYTICS_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_CHILDREN_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchChildAnalytics = (childId) => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_CHILD_REQUEST });
    const { data } = await daoApi.get(`/analytic/child/needs/${childId}`);

    dispatch({
      type: GET_ANALYTICS_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_CHILD_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchNgosAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_NGOS_REQUEST });
    const { data } = await daoApi.get(`/analytic/ngos`);

    dispatch({
      type: GET_ANALYTICS_NGOS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_NGOS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};


export const fetchEcosystemAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_ECOSYSTEM_REQUEST });
    const { data } = await daoApi.get(`/analytic/ecosystem`);

    dispatch({
      type: GET_ANALYTICS_ECOSYSTEM_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_ECOSYSTEM_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};
