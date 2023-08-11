import { daoApi } from '../../apis/sayBase';
import {
  GET_ANALYTICS_CHILD_FAIL,
  GET_ANALYTICS_CHILD_REQUEST,
  GET_ANALYTICS_CHILD_SUCCESS,
  GET_ANALYTICS_CHILD_FAMILY_REQUEST,
  GET_ANALYTICS_CHILD_FAMILY_SUCCESS,
  GET_ANALYTICS_CHILD_FAMILY_FAIL,
  GET_ANALYTICS_NEED_REQUEST,
  GET_ANALYTICS_NEED_SUCCESS,
  GET_ANALYTICS_NEED_FAIL,
  GET_ANALYTICS_CHILDREN_REQUEST,
  GET_ANALYTICS_CHILDREN_SUCCESS,
  GET_ANALYTICS_CHILDREN_FAIL,
  GET_ANALYTICS_NGOS_REQUEST,
  GET_ANALYTICS_NGOS_SUCCESS,
  GET_ANALYTICS_NGOS_FAIL,
  GET_ANALYTICS_ECOSYSTEM_CHILDREN_REQUEST,
  GET_ANALYTICS_ECOSYSTEM_CHILDREN_SUCCESS,
  GET_ANALYTICS_ECOSYSTEM_CHILDREN_FAIL,
  GET_FAMILY_ANALYTICS_REQUEST,
  GET_FAMILY_ANALYTICS_SUCCESS,
  GET_FAMILY_ANALYTICS_FAIL,
  GET_ANALYTICS_CONTRIBUTION_REQUEST,
  GET_ANALYTICS_CONTRIBUTION_SUCCESS,
  GET_ANALYTICS_CONTRIBUTION_FAIL,
} from '../constants/analyticConstants';


export const fetchChildFamilyAnalytic = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_CHILD_FAMILY_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/child/active/family`, config);

    dispatch({
      type: GET_ANALYTICS_CHILD_FAMILY_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_CHILD_FAMILY_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchNeedAnalytics = (needType) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_NEED_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/needs/delivered/${needType}`, config);

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

export const fetchChildrenAnalytics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_CHILDREN_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/children`, config);

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

export const fetchChildAnalytics = (childId) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_CHILD_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/child/needs/${childId}`, config);

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

export const fetchNgosAnalytics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_NGOS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/ngos`, config);

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

export const fetchChildrenEcosystemAnalytics = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_ECOSYSTEM_CHILDREN_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/ecosystem/children`, config);

    dispatch({
      type: GET_ANALYTICS_ECOSYSTEM_CHILDREN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_ECOSYSTEM_CHILDREN_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchUserContribution = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ANALYTICS_CONTRIBUTION_REQUEST });

    const {
      swDetails: { swInfo },
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(
      `/analytic/contributions/${swInfo.id}/${swInfo.typeId}`,
      config,
    );

    dispatch({
      type: GET_ANALYTICS_CONTRIBUTION_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_ANALYTICS_CONTRIBUTION_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchFamilyAnalytic = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_FAMILY_ANALYTICS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/analytic/family/roles/scattered`, config);

    dispatch({
      type: GET_FAMILY_ANALYTICS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_FAMILY_ANALYTICS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};
