/* eslint-disable import/prefer-default-export */
import {
  LIST_CAMPAIGN_REQUEST,
  LIST_CAMPAIGN_FAIL,
  LIST_CAMPAIGN_SUCCESS,
  FORCE_SEND_CAMPAIGN_REQUEST,
  FORCE_SEND_CAMPAIGN_FAIL,
  FORCE_SEND_CAMPAIGN_SUCCESS,
  FORCE_SEND_CAMPAIGN_RESET,
} from '../constants/campaignConstants';

export const campaignsReducer = (state = {}, action) => {
  switch (action.type) {
    case FORCE_SEND_CAMPAIGN_REQUEST:
      return { ...state, loading: true, success: false };
    case FORCE_SEND_CAMPAIGN_SUCCESS:
      return { ...state, loading: false, success: true, created: action.payload };
    case FORCE_SEND_CAMPAIGN_FAIL:
      return { ...state, loading: false, error: action.payload };
    case FORCE_SEND_CAMPAIGN_RESET:
      return {};
    case LIST_CAMPAIGN_REQUEST:
      return { ...state, loading: true, success: false };
    case LIST_CAMPAIGN_SUCCESS:
      return { ...state, loading: false, success: true, campaigns: action.payload };
    case LIST_CAMPAIGN_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
