/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import { daoApi, publicApi } from '../../apis/sayBase';
import needListSerializer, { needSerializer } from '../../utils/serializer';
import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  WALLET_CONNECT_FAIL,
  UPDATE_SERVER_REQUEST,
  UPDATE_SERVER_SUCCESS,
  UPDATE_SERVER_FAIL,
  GET_SERVER_NEEDS_REQUEST,
  GET_SERVER_NEEDS_SUCCESS,
  GET_SERVER_NEEDS_FAIL,
  UPDATE_FLASK_REQUEST,
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
  GET_ONE_SERVER_SUCCESS,
  UPDATE_ONE_SERVER_REQUEST,
  GET_ONE_SERVER_REQUEST,
  UPDATE_ONE_SERVER_SUCCESS,
  UPDATE_ONE_SERVER_FAIL,
  GET_SERVER_NGO_REQUEST,
  GET_SERVER_NGO_SUCCESS,
  GET_SERVER_NGO_FAIL,
} from '../constants/daoConstants';

export const updateNestServer = (counter, skip) => async (dispatch, getState) => {
  let child = {};
  let need = {};
  const childList = [];
  const needList = [];
  try {
    dispatch({ type: UPDATE_FLASK_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-SKIP': skip,
        'X-TAKE': counter, // pagination
      },
    };
    const { data } = await publicApi.get(`/needs`, config);

    for (let i = 0; i < data.needs.length; i++) {
      need = needListSerializer(data.needs, i);
      needList.push(need);
    }

    const responseDead = await publicApi.get(`/child/all/confirm=2?existence_status=0`, config);

    const responseAlivePresent = await publicApi.get(
      `/child/all/confirm=2?existence_status=1`,
      config,
    );
    const array1 = responseDead.data.children.concat(responseAlivePresent.data.children);
    const responseAliveGone = await publicApi.get(
      `/child/all/confirm=2?existence_status=2`,
      config,
    );

    const array2 = array1.concat(responseAliveGone.data.children);

    const responseTempGone = await publicApi.get(`/child/all/confirm=2?existence_status=3`, config);
    const array3 = array2.concat(responseTempGone.data.children);

    dispatch({ type: UPDATE_SERVER_REQUEST });

    for (let i = 0; i < array3.length; i++) {
      child = {
        childId: array3[i].id,
        address: array3[i].address,
        avatarUrl: array3[i].avatarUrl,
        awakeAvatarUrl: array3[i].awakeAvatarUrl,
        bio: array3[i].bio,
        bioSummary: array3[i].bioSummary,
        bioSummaryTranslations: array3[i].bio_summary_translations,
        bioTranslations: array3[i].bio_translations,
        birthDate: array3[i].birthDate,
        birthPlace: array3[i].birthPlace,
        city: array3[i].city,
        confirmDate: array3[i].confirmDate,
        confirmUser: array3[i].confirmUser,
        country: array3[i].country,
        created: array3[i].created,
        doneNeedsCount: array3[i].done_needs_count,
        education: array3[i].education,
        existenceStatus: array3[i].existence_status,
        familyCount: array3[i].familyCount,
        generatedCode: array3[i].generatedCode,
        housingStatus: array3[i].housingStatus,
        ngoId: array3[i].id_ngo,
        idSocialWorker: array3[i].id_social_worker,
        isConfirmed: array3[i].isConfirmed,
        isDeleted: array3[i].isDeleted,
        isMigrated: array3[i].isMigrated,
        isGone: array3[i].is_gone,
        migrateDate: array3[i].migrateDate,
        migratedId: array3[i].migratedId,
        nationality: array3[i].nationality,
        sayFamilyCount: array3[i].sayFamilyCount,
        sayName: array3[i].sayName,
        sayNameTranslations: array3[i].sayNameTranslations,
        sleptAvatarUrl: array3[i].sleptAvatarUrl,
        status: array3[i].status,
        updated: array3[i].updated,
        voiceUrl: array3[i].voiceUrl,
      };
      childList.push(child);
    }
    console.log(child);

    const needRequest = {
      needData: needList,
      childData: childList,
    };

    const nestResponse = await daoApi.post(`/sync/update/multi`, needRequest);
    dispatch({
      type: UPDATE_SERVER_SUCCESS,
      payload: nestResponse,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SERVER_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const updateOneNeedNestServer = (need) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_ONE_SERVER_REQUEST });
    const {
      receiptList: { receipts },
    } = getState();

    const theNeed = needSerializer({ ...need, receipts }, 0);

    const needRequest = {
      needData: [theNeed],
      childData: [],
    };

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const responseNeed = await daoApi.post(`/sync/update/one/`, needRequest, {
      config,
    }); // create

    dispatch({
      type: UPDATE_ONE_SERVER_SUCCESS,
      payload: responseNeed.data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_ONE_SERVER_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
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

    // eslint-disable-next-line no-undef
    await window.ethereum.enable();
    // eslint-disable-next-line no-undef
    const provider = new ethers.providers.Web3Provider(window.ethereum);

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
    // update server first
    // await dispatch(updateOneNeedNestServer(need));
    const {
      serverOneNeed: { error },
    } = getState();

    if (error) {
      dispatch({
        type: SIGNATURE_FAIL,
        payload: error,
      });
      return;
    }
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const request = {
      flaskSwId: need.created_by_id,
      flaskNeedId: need.id,
      flaskChildId: need.child_id,
      signerAddress,
    };
    const { data } = await daoApi.post(`/signature/sw/generate`, request);
    console.log(data)

    // eslint-disable-next-line no-underscore-dangle
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
