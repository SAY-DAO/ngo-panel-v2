import { daoApi } from '../../apis/sayBase';
import {
  LIST_CAMPAIGN_FAIL,
  LIST_CAMPAIGN_REQUEST,
  LIST_CAMPAIGN_SUCCESS,
  FORCE_SEND_CAMPAIGN_REQUEST,
  FORCE_SEND_CAMPAIGN_SUCCESS,
  FORCE_SEND_CAMPAIGN_FAIL,
  SEND_NEWSLETTER_CAMPAIGN_REQUEST,
  SEND_NEWSLETTER_CAMPAIGN_SUCCESS,
  SEND_NEWSLETTER_CAMPAIGN_FAIL,
} from '../constants/campaignConstants';

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

    const response = await daoApi.get(`/campaign/all/sent`, config);
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

export const forceSendCampaign = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FORCE_SEND_CAMPAIGN_REQUEST });

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

    const { data } = await daoApi.get(
      `/campaign/send/force`,
      config,
    );

    dispatch({
      type: FORCE_SEND_CAMPAIGN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: FORCE_SEND_CAMPAIGN_FAIL,
      payload: e.response && e.response.data ? e.response.data.message : e.message,
    });
  }

};


export const sendNewsLetter = (details) => async (dispatch, getState) => {
  try {
    dispatch({ type: SEND_NEWSLETTER_CAMPAIGN_REQUEST });

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
      `/campaign/send/newsLetter`,
      details,
      config,
    );

    dispatch({
      type: SEND_NEWSLETTER_CAMPAIGN_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SEND_NEWSLETTER_CAMPAIGN_FAIL,
      payload: e.response && e.response.data ? e.response.data.message : e.message,
    });
  }

};
