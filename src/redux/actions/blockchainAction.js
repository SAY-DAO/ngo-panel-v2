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
  WALLET_NONCE_REQUEST,
  WALLET_NONCE_SUCCESS,
  WALLET_NONCE_FAIL,
  WALLET_VERIFY_REQUEST,
  WALLET_VERIFY_SUCCESS,
  WALLET_VERIFY_FAIL,
  WALLET_INFORMATION_REQUEST,
  WALLET_INFORMATION_SUCCESS,
  WALLET_INFORMATION_FAIL,
} from '../constants/daoConstants';

export const fetchNonce = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_NONCE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': false,
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      withCredentials: true,
      crossDomain: true,
    };
    const response = await daoApi.get(`/wallet/nonce`, config);

    dispatch({
      type: WALLET_NONCE_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: WALLET_NONCE_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const walletVerify = (message, signature) => async (dispatch, getState) => {
  try {
    dispatch({ type: WALLET_VERIFY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': false,
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        Authorization: userInfo && userInfo.accessToken,
      },
      withCredentials: true,
    };

    const { data } = await daoApi.post(
      `/wallet/verify/${userInfo.id}`,
      {
        message,
        signature,
      },
      config,
    );

    dispatch({
      type: WALLET_VERIFY_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log('here');
    console.log(e.response.statusText);
    dispatch({
      type: WALLET_VERIFY_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : e.response && e.response.statusText
          ? e.response.statusText
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};

export const fetchWalletInformation = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_INFORMATION_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    const { data } = await daoApi.get(`/wallet/personal_information`, config);

    dispatch({
      type: WALLET_INFORMATION_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: WALLET_INFORMATION_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};
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
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const connectWallet = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONNECT_REQUEST });

    // const provider = new BrowserProvider(window.ethereum);
    // await provider
    //   .send('eth_requestAccounts', [])
    //   .then(console.log('Please connect to MetaMask.'))
    //   .catch((err) => {
    //     console.log(err)
    //     throw err;
    //   });

    // const signer = provider.getSigner();
    // const walletAddress = await signer.getAddress();

    dispatch({
      type: WALLET_CONNECT_SUCCESS,
      // payload: walletAddress,
    });
  } catch (e) {
    dispatch({
      type: WALLET_CONNECT_FAIL,
      payload: e.error && { ...e.error },
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
        'Content-Type': 'application/json',
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
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const signTransaction = (address, need, signer) => async (dispatch, getState) => {
  try {
    dispatch({ type: SIGNATURE_REQUEST });

    const {
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    const { child, ...others } = need;
    const request = {
      flaskUserId: swInfo.id,
      panelData: others,
      childId: child.id,
      signerAddress: address,
      userTypeId: swInfo.typeId,
    };

    const { data } = await daoApi.post(`/wallet/sw/generate`, request, config);
    const signature = await signer._signTypedData(
      data.transaction.domain,
      data.transaction.types,
      data.transaction.SocialWorkerVoucher,
    );

    const request2 = {
      flaskUserId: swInfo.id,
      flaskNeedId: need.id,
      signerAddress: address,
      role: data.transaction.sayRole,
    };
    console.log(request2);
    const result = await daoApi.post(`/wallet/create/${signature}`, request2, config);

    dispatch({
      type: SIGNATURE_SUCCESS,
      payload: { data, result, signature },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: SIGNATURE_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};
