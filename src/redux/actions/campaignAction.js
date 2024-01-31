import { daoApi } from '../../apis/sayBase';
import {
  LIST_CAMPAIGN_FAIL,
  LIST_CAMPAIGN_REQUEST,
  LIST_CAMPAIGN_SUCCESS,
  CREATE_CAMPAIGN_REQUEST,
  CREATE_CAMPAIGN_SUCCESS,
  CREATE_CAMPAIGN_FAIL,
} from '../constants/campaignConstants';

import { VirtualFamilyRole } from '../../utils/types';

export const fetchCampaigns = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_CAMPAIGN_REQUEST });
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

    const response = await daoApi.get(`/campaign/all`, config);
    dispatch({
      type: LIST_CAMPAIGN_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: LIST_CAMPAIGN_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const createCampaign = (flaskNeedId, needNestId, message) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_CAMPAIGN_REQUEST });

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
      `/campaign/create`,
      { flaskNeedId, needNestId, vRole: VirtualFamilyRole.SAY, message },
      config,
    );

    dispatch({
      type: CREATE_CAMPAIGN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CREATE_CAMPAIGN_FAIL,
      payload: e.response && e.response.data ? e.response.data.message : e.message,
    });
  }
};
