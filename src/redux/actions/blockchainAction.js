import { ethers } from 'ethers';
import { daoApi, publicApi } from '../../apis/sayBase';
import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  WALLET_CONNECT_FAIL,
  GET_SERVER_NEEDS_REQUEST,
  GET_SERVER_NEEDS_SUCCESS,
  GET_SERVER_NEEDS_FAIL,
  GET_SERVER_CHILDREN_REQUEST,
  GET_SERVER_CHILDREN_SUCCESS,
  GET_SERVER_CHILDREN_FAIL,
  CREATE_MILESTONE_REQUEST,
  CREATE_MILESTONE_SUCCESS,
  CREATE_MILESTONE_FAIL,
  GET_MILESTONES_REQUEST,
  GET_MILESTONES_SUCCESS,
  GET_MILESTONES_FAIL,
  SIGNATURE_REQUEST,
  SIGNATURE_SUCCESS,
  SIGNATURE_FAIL,
  GET_SERVER_USERS_REQUEST,
  GET_SERVER_USERS_SUCCESS,
  GET_SERVER_USERS_FAIL,
  GET_SERVER_NGO_REQUEST,
  GET_SERVER_NGO_SUCCESS,
  GET_SERVER_NGO_FAIL,
} from '../constants/daoConstants';

export const fetchNestNeeds = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_NEEDS_REQUEST });

    const responseNeed = await daoApi.get(`/needs/all`);
    const { data } = await daoApi.get(`/needs/all/done`);

    dispatch({
      type: GET_SERVER_NEEDS_SUCCESS,
      payload: { needs: responseNeed.data, totalDone: data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_NEEDS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchNestUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_USERS_REQUEST });

    const response = await daoApi.get(`/users/all`);

    dispatch({
      type: GET_SERVER_USERS_SUCCESS,
      payload: { users: response.data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_USERS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchNestChildren = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_CHILDREN_REQUEST });

    const response = await daoApi.get(`/children/all`);

    dispatch({
      type: GET_SERVER_CHILDREN_SUCCESS,
      payload: { children: response.data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_CHILDREN_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchNestNgos = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_NGO_REQUEST });

    const response = await daoApi.get(`/ngo/all`);

    dispatch({
      type: GET_SERVER_NGO_SUCCESS,
      payload: { ngos: response.data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_NGO_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const getMileStones = () => async (dispatch) => {
  try {
    dispatch({ type: GET_MILESTONES_REQUEST });
    const { data } = await daoApi.get(`/milestone/all`);
    dispatch({
      type: GET_MILESTONES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: GET_MILESTONES_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const createMileStone = (localData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_MILESTONE_REQUEST });

    const mileStoneRequest = {
      epics: localData.data,
      signature: 'TODO',
    };

    const { data } = await daoApi.post(`/milestone/create`, mileStoneRequest);

    dispatch({
      type: CREATE_MILESTONE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CREATE_MILESTONE_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const connectWallet = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONNECT_REQUEST });

    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    dispatch({
      type: WALLET_CONNECT_SUCCESS,
      payload: walletAddress,
    });
  } catch (e) {
    dispatch({
      type: WALLET_CONNECT_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const fetchFamilyNetworks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FAMILY_NETWORK_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.accessToken,
      },
    };
    const { data } = await publicApi.get(`/public/children`, config);

    dispatch({
      type: FAMILY_NETWORK_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: FAMILY_NETWORK_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const signTransaction = (need) => async (dispatch, getState) => {
  try {
    dispatch({ type: SIGNATURE_REQUEST });

    const {
      wallet: { signerAddress },
    } = getState();

    const request = {
      need,
      signerAddress,
    };

    console.log(request);

    const { data } = await daoApi.post(`/signature/sw/generate`, request);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer._signTypedData(
      data.domain,
      data.types,
      data.SocialWorkerVoucher,
    );

    await daoApi.post(`/needs/patch`, request);
    dispatch({
      type: SIGNATURE_SUCCESS,
      payload: { data, signature },
    });
  } catch (e) {
    dispatch({
      type: SIGNATURE_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
