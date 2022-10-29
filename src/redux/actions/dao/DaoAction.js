/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import { daoApi, publicApi } from '../../../apis/sayBase';
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
} from '../../constants/daoConstants';

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
      need = {
        needId: data.needs[i].id,
        title: data.needs[i].name,
        affiliateLinkUrl: data.needs[i].affiliateLinkUrl,
        bankTrackId: data.needs[i].bank_track_id,
        category: data.needs[i].category,
        childGeneratedCode: data.needs[i].childGeneratedCode,
        childSayName: data.needs[i].childSayName,
        childDeliveryDate: data.needs[i].child_delivery_date,
        childId: data.needs[i].child_id,
        confirmDate: data.needs[i].confirmDate,
        confirmUser: data.needs[i].confirmUser,
        cost: data.needs[i].cost,
        created: data.needs[i].created,
        createdById: data.needs[i].created_by_id,
        deletedAt: data.needs[i].deleted_at,
        description: data.needs[i].description,
        descriptionTranslations: data.needs[i].description_translations, // { en: '' , fa: ''}
        titleTranslations: data.needs[i].name_translations, // { en: '' , fa: ''}
        details: data.needs[i].details,
        doingDuration: data.needs[i].doing_duration,
        donated: data.needs[i].donated,
        doneAt: data.needs[i].doneAt,
        expectedDeliveryDate: data.needs[i].expected_delivery_date,
        information: data.needs[i].information,
        isConfirmed: data.needs[i].isConfirmed,
        isDeleted: data.needs[i].isDeleted,
        isDone: data.needs[i].isDone,
        isReported: data.needs[i].isReported,
        isUrgent: data.needs[i].isUrgent,
        ngoId: data.needs[i].ngoId,
        ngoAddress: data.needs[i].ngoAddress,
        ngoName: data.needs[i].ngoName,
        ngoDeliveryDate: data.needs[i].ngo_delivery_date,
        oncePurchased: data.needs[i].oncePurchased,
        paid: data.needs[i].paid,
        purchaseCost: data.needs[i].purchase_cost,
        purchaseDate: data.needs[i].purchase_date,
        receiptCount: data.needs[i].receipt_count,
        receipts: data.needs[i].receipts,
        status: data.needs[i].status,
        statusDescription: data.needs[i].status_description,
        statusUpdatedAt: data.needs[i].status_updated_at,
        type: data.needs[i].type,
        typeName: data.needs[i].type_name,
        unavailableFrom: data.needs[i].unavailable_from,
        unconfirmedAt: data.needs[i].unconfirmed_at,
        unpaidCost: data.needs[i].unpaid_cost,
        unpayable: data.needs[i].unpayable,
        unpayableFrom: data.needs[i].unpayable_from,
        updated: data.needs[i].updated,
        payments: data.needs[i].payments, // []
        imageUrl: data.needs[i].imageUrl,
        needRetailerImg: data.needs[i].img,
      };
      needList.push(need);
    }


    const responseDead = await publicApi.get(`/child/all/confirm=2?existence_status=0`, config);
    console.log(responseDead.data);

    const responseAlivePresent = await publicApi.get(
      `/child/all/confirm=2?existence_status=1`,
      config,
    );
    console.log(responseAlivePresent.data);
    const array1 =responseDead.data.children.concat(responseAlivePresent.data.children);

    const responseAliveGone = await publicApi.get(
      `/child/all/confirm=2?existence_status=2`,
      config,
    );
    console.log(responseAliveGone.data);
    const array2 =array1.concat(responseAliveGone.data.children);

    const responseTempGone = await publicApi.get(`/child/all/confirm=2?existence_status=3`, config);
    console.log(responseTempGone.data);
    const array4 =array2.concat(responseTempGone.data.children);

    dispatch({ type: UPDATE_SERVER_REQUEST });

      console.log(array4);
      for (let i = 0; i < array4.length; i++) {
      child = {
        childId: array4[i].id,
        address: array4[i].address,
        avatarUrl: array4[i].avatarUrl,
        awakeAvatarUrl: array4[i].awakeAvatarUrl,
        bio: array4[i].bio,
        bioSummary: array4[i].bioSummary,
        bioSummaryTranslations: array4[i].bio_summary_translations,
        bioTranslations: array4[i].bio_translations,
        birthDate: array4[i].birthDate,
        birthPlace: array4[i].birthPlace,
        city: array4[i].city,
        confirmDate: array4[i].confirmDate,
        confirmUser: array4[i].confirmUser,
        country: array4[i].country,
        created: array4[i].created,
        doneNeedsCount: array4[i].done_needs_count,
        education: array4[i].education,
        existenceStatus: array4[i].existence_status,
        familyCount: array4[i].familyCount,
        generatedCode: array4[i].generatedCode,
        housingStatus: array4[i].housingStatus,
        ngoId: array4[i].id_ngo,
        idSocialWorker: array4[i].id_social_worker,
        isConfirmed: array4[i].isConfirmed,
        isDeleted: array4[i].isDeleted,
        isMigrated: array4[i].isMigrated,
        isGone: array4[i].is_gone,
        migrateDate: array4[i].migrateDate,
        migratedId: array4[i].migratedId,
        nationality: array4[i].nationality,
        sayFamilyCount: array4[i].sayFamilyCount,
        sayName: array4[i].sayName,
        sayNameTranslations: array4[i].sayNameTranslations,
        sleptAvatarUrl: array4[i].sleptAvatarUrl,
        status: array4[i].status,
        updated: array4[i].updated,
        voiceUrl: array4[i].voiceUrl,
      };
      childList.push(child);
    }

    const needRequest = {
      needData: needList,
      childData: childList,
    };
    console.log(needRequest);

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

    const theNeed = {
      needId: need.id,
      title: need.name,
      affiliateLinkUrl: need.affiliateLinkUrl,
      bankTrackId: need.bank_track_id,
      category: need.category,
      childGeneratedCode: need.childGeneratedCode,
      childSayName: need.childSayName,
      childDeliveryDate: need.child_delivery_date,
      childId: need.child_id,
      confirmDate: need.confirmDate,
      confirmUser: need.confirmUser,
      cost: need.cost,
      created: need.created,
      createdById: need.created_by_id,
      deletedAt: need.deleted_at,
      description: need.description,
      descriptionTranslations: need.description_translations, // { en: '' , fa: ''}
      titleTranslations: need.name_translations, // { en: '' , fa: ''}
      details: need.details,
      doingDuration: need.doing_duration,
      donated: need.donated,
      doneAt: need.doneAt,
      expectedDeliveryDate: need.expected_delivery_date,
      information: need.information,
      isConfirmed: need.isConfirmed,
      isDeleted: need.isDeleted,
      isDone: need.isDone,
      isReported: need.isReported,
      isUrgent: need.isUrgent,
      ngoId: need.ngoId,
      ngoAddress: need.ngoAddress,
      ngoName: need.ngoName,
      ngoDeliveryDate: need.ngo_delivery_date,
      oncePurchased: need.oncePurchased,
      paid: need.paid,
      purchaseCost: need.purchase_cost,
      purchaseDate: need.purchase_date,
      receiptCount: need.receipt_count,
      receipts, // when accordion opens we request receipts
      status: need.status,
      statusDescription: need.status_description,
      statusUpdatedAt: need.status_updated_at,
      type: need.type,
      typeName: need.type_name,
      unavailableFrom: need.unavailable_from,
      unconfirmedAt: need.unconfirmed_at,
      unpaidCost: need.unpaid_cost,
      unpayable: need.unpayable,
      unpayableFrom: need.unpayable_from,
      updated: need.updated,
      payments: need.payments,
      imageUrl: need.imageUrl,
      needRetailerImg: need.img,
    };
    const needRequest = {
      needData: [theNeed],
      childData: [],
    };
    console.log('needRequest');
    console.log(needRequest);
    const responseNeed = await daoApi.post(`/sync/update/one/`, theNeed); // create
    console.log('responseNeed');
    console.log(responseNeed);

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

    console.log(mileStoneRequest);
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
    await dispatch(updateOneNeedNestServer(need));
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
    console.log('request');
    console.log(request);

    const { data } = await daoApi.post(`/signature/sw/generate`, request);
    console.log('data');
    console.log(data);

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
    console.log(e);
    dispatch({
      type: SIGNATURE_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
