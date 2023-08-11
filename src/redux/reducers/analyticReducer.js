import {
  GET_ANALYTICS_NEED_REQUEST,
  GET_ANALYTICS_NEED_SUCCESS,
  GET_ANALYTICS_NEED_FAIL,
  GET_ANALYTICS_CHILD_FAMILY_REQUEST,
  GET_ANALYTICS_CHILD_FAMILY_SUCCESS,
  GET_ANALYTICS_CHILD_FAMILY_FAIL,
  GET_ANALYTICS_CHILD_REQUEST,
  GET_ANALYTICS_CHILD_SUCCESS,
  GET_ANALYTICS_CHILD_FAIL,
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

export const AnalyticChildNeedsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ANALYTICS_NEED_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_ANALYTICS_NEED_SUCCESS:
      return { ...state, loading: false, success: true, needsResult: action.payload };
    case GET_ANALYTICS_NEED_FAIL:
      return { oading: false, error: action.payload };
    case GET_ANALYTICS_CHILD_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_ANALYTICS_CHILD_SUCCESS:
      return { ...state, loading: false, success: true, childResult: action.payload };
    case GET_ANALYTICS_CHILD_FAIL:
      return { loading: false, error: action.payload };
    case GET_ANALYTICS_CHILDREN_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_ANALYTICS_CHILDREN_SUCCESS:
      return { ...state, loading: false, success: true, childrenResult: action.payload };
    case GET_ANALYTICS_CHILDREN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const analyticsNgosReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ANALYTICS_NGOS_REQUEST:
      return { loading: true, success: false };
    case GET_ANALYTICS_NGOS_SUCCESS:
      return { loading: false, success: true, ngosResult: action.payload };
    case GET_ANALYTICS_NGOS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const analyticsEcosystemReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ANALYTICS_CHILD_FAMILY_REQUEST:
      return { ...state, loading: true, success: false };
    case GET_ANALYTICS_CHILD_FAMILY_SUCCESS:
      return { ...state, loading: false, success: true, ecosystemChildFamilyResult: action.payload };
    case GET_ANALYTICS_CHILD_FAMILY_FAIL:
      return { oading: false, error: action.payload };
    case GET_ANALYTICS_ECOSYSTEM_CHILDREN_REQUEST:
      return { loading: true, success: false };
    case GET_ANALYTICS_ECOSYSTEM_CHILDREN_SUCCESS:
      return { loading: false, success: true, ecosystemChildrenResult: action.payload };
    case GET_ANALYTICS_ECOSYSTEM_CHILDREN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const analyticsContributionReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ANALYTICS_CONTRIBUTION_REQUEST:
      return { loading: true, success: false };
    case GET_ANALYTICS_CONTRIBUTION_SUCCESS:
      return { loading: false, success: true, contribution: action.payload };
    case GET_ANALYTICS_CONTRIBUTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const analyticsFamilyReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_FAMILY_ANALYTICS_REQUEST:
      return { loading: true, success: false };
    case GET_FAMILY_ANALYTICS_SUCCESS:
      return { loading: false, success: true, roles: action.payload };
    case GET_FAMILY_ANALYTICS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
