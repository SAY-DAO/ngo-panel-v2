import { daoApi, publicApi } from '../../apis/sayBase';
import {
  NeedTypeEnum,
  ProductStatusEnum,
  FlaskUserTypesEnum,
  ServiceStatusEnum,
} from '../../utils/types';
import {
  CHILD_EXAMPLE_NEEDS_FAIL,
  CHILD_EXAMPLE_NEEDS_REQUEST,
  CHILD_EXAMPLE_NEEDS_SUCCESS,
  CHILD_NEEDS_FAIL,
  CHILD_NEEDS_REQUEST,
  CHILD_NEEDS_SUCCESS,
  UNCONFIRMED_NEEDS_FAIL,
  UNCONFIRMED_NEEDS_REQUEST,
  UNCONFIRMED_NEEDS_SUCCESS,
  DUPLICATES_NEEDS_FAIL,
  DUPLICATES_NEEDS_REQUEST,
  DUPLICATES_NEEDS_SUCCESS,
  AUTO_CONFIRM_NEEDS_FAIL,
  AUTO_CONFIRM_NEEDS_REQUEST,
  AUTO_CONFIRM_NEEDS_SUCCESS,
  CHILD_ONE_NEED_REQUEST,
  CHILD_ONE_NEED_SUCCESS,
  CHILD_ONE_NEED_FAIL,
  SW_NEED_LIST_REQUEST,
  SW_NEED_LIST_SUCCESS,
  SW_NEED_LIST_FAIL,
  UPDATE_ONE_NEED_REQUEST,
  UPDATE_ONE_NEED_SUCCESS,
  UPDATE_ONE_NEED_FAIL,
  UPDATE_NEED_STATUS_REQUEST,
  UPDATE_NEED_STATUS_SUCCESS,
  UPDATE_NEED_STATUS_FAIL,
  ADD_ONE_NEED_REQUEST,
  ADD_ONE_NEED_SUCCESS,
  ADD_ONE_NEED_FAIL,
  UPDATE_NEED_CONFIRM_REQUEST,
  UPDATE_NEED_CONFIRM_SUCCESS,
  UPDATE_NEED_CONFIRM_FAIL,
  ALL_NEEDS_REQUEST,
  ALL_NEEDS_SUCCESS,
  ALL_NEEDS_FAIL,
  ALL_REPORT_NEEDS_REQUEST,
  ALL_REPORT_NEEDS_SUCCESS,
  ALL_REPORT_NEEDS_FAIL,
  DELETE_NEED_REQUEST,
  DELETE_NEED_SUCCESS,
  DELETE_NEED_FAIL,
  DELETE_OLD_NEEDS_REQUEST,
  DELETE_OLD_NEEDS_SUCCESS,
  DELETE_OLD_NEEDS_FAIL,
  UPDATE_ARRIVALS_REQUEST,
  UPDATE_ARRIVALS_SUCCESS,
  UPDATE_ARRIVALS_FAIL,
  DELETE_CANDIDATES_REQUEST,
  DELETE_CANDIDATES_SUCCESS,
  DELETE_CANDIDATES_FAIL,
  UPDATE_CANDIDATES_REQUEST,
  UPDATE_CANDIDATES_SUCCESS,
  UPDATE_CANDIDATES_FAIL,
} from '../constants/needConstant';

export const fetchAllNeeds = (ngoId, take) => async (dispatch, getState) => {
  try {
    dispatch({ type: ALL_NEEDS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-TAKE': take,
      },
    };

    const { data } = await publicApi.get(`/needs?ngoId=${ngoId}&isChildConfirmed=true`, config);

    dispatch({
      type: ALL_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ALL_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchReportNeeds = (isDone, ngoId, type, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: ALL_REPORT_NEEDS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-TAKE': 100,
      },
    };

    let response;

    if (!ngoId && isDone && status) {
      // to get all ngos done need - reports page
      response = await publicApi.get(
        `/needs?isDone=${isDone}&type=${type}&status=${status}`,
        config,
      );
    } else {
      // - reports page
      response = await publicApi.get(
        `/needs?isDone=${isDone}&ngoId=${ngoId}&type=${type}&status=${status}`,
        config,
      );
    }

    dispatch({
      type: ALL_REPORT_NEEDS_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: ALL_REPORT_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchExampleNeeds = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_EXAMPLE_NEEDS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/flask/preneeds/templates`, config);

    dispatch({
      type: CHILD_EXAMPLE_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CHILD_EXAMPLE_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchChildNeeds =
  (childId, take = 500) =>
    async (dispatch, getState) => {
      try {
        dispatch({ type: CHILD_NEEDS_REQUEST });

        const {
          userLogin: { userInfo },
        } = getState();

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: userInfo && userInfo.access_token,
            'X-TAKE': take,
          },
        };
        const { data } = await publicApi.get(`/child/childId=${childId}/needs`, config);

        dispatch({
          type: CHILD_NEEDS_SUCCESS,
          payload: data,
        });
      } catch (e) {
        // check for generic and custom message to return using ternary statement
        dispatch({
          type: CHILD_NEEDS_FAIL,
          payload: e.response && (e.response.status ? e.response : e.response.data.message),
        });
      }
    };

export const fetchChildOneNeed = (needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_ONE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/need/needId=${needId}`, config);

    dispatch({
      type: CHILD_ONE_NEED_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CHILD_ONE_NEED_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchSwNeedList = (take) => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_NEED_LIST_REQUEST });
    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-TAKE': take,
      },
    };

    let response;
    // super admin & admin
    if (
      swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
      swInfo.typeId === FlaskUserTypesEnum.ADMIN
    ) {
      response = await publicApi.get('/needs', config);
    } else {
      response = await publicApi.get(`/socialworkers/${swInfo.id}/createdNeeds`, config);
    }

    dispatch({
      type: SW_NEED_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: SW_NEED_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updateNeedConfirm = (needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_NEED_CONFIRM_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.patch(`/need/confirm/needId=${needId}`, {}, config);

    dispatch({
      type: UPDATE_NEED_CONFIRM_SUCCESS,
      payload: { data, id: needId },
    });
  } catch (e) {
    dispatch({
      type: UPDATE_NEED_CONFIRM_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const deleteNeed = (needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const { data } = await publicApi.patch(`/need/delete/needId=${needId}`, {}, config);

    dispatch({
      type: DELETE_NEED_SUCCESS,
      payload: { data, id: needId },
    });
  } catch (e) {
    dispatch({
      type: DELETE_NEED_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updateNeed = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_ONE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const formData = new FormData();
    formData.append('sw_id', swInfo.swId);

    formData.append('child_id', values.childId);
    formData.append('name_translations', values.name);
    formData.append('description_translations', values.description);
    formData.append('category', values.category);
    formData.append('isUrgent', values.isUrgent);
    formData.append('cost', values.cost);
    formData.append('type', values.type);
    formData.append('link', values.link);
    formData.append('affiliateLinkUrl', values.affiliateLinkUrl);
    formData.append('receipts', values.receipts);
    formData.append('doing_duration', values.doing_duration);
    formData.append('details', values.details);
    formData.append('informations', values.information);

    if (values.imageUrl) {
      formData.append('imageUrl', values.imageUrl);
    }

    const { data } = await publicApi.patch(
      `/need/update/needId=${values.needId}`,
      formData,
      config,
    );
    dispatch({
      type: UPDATE_ONE_NEED_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_ONE_NEED_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updateNeedStatus = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_NEED_STATUS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const formData = new FormData();
    formData.append('status', values.statusId);

    if (values.typeId === NeedTypeEnum.SERVICE) {
      if (values.statusId === ServiceStatusEnum.MONEY_TO_NGO) {
        formData.append('bank_track_id', values.bank_track_id);
      }
      if (values.statusId === ServiceStatusEnum.DELIVERED) {
        formData.append('purchase_cost', values.purchase_cost);
      }
    }
    if (values.typeId === NeedTypeEnum.PRODUCT) {
      if (values.statusId === ProductStatusEnum.PURCHASED_PRODUCT) {
        formData.append('purchase_cost', Number(values.purchase_cost));
        formData.append('dkc', values.dkc);
        formData.append('expected_delivery_date', values.expected_delivery_date);
      }
      if (values.statusId === ProductStatusEnum.DELIVERED_TO_NGO) {
        formData.append('ngo_delivery_date', values.ngo_delivery_date);
      }
    }

    const { data } = await publicApi.patch(
      `/need/update/needId=${values.needId}`,
      formData,
      config,
    );
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}, ${pair[1]}`);
    // }

    dispatch({
      type: UPDATE_NEED_STATUS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_NEED_STATUS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const AddNeed = (values, providerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_ONE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    if (!providerId) {
      throw new Error('Provider id is needed!');
    }
    const formData = new FormData();
    formData.append('sw_id', swInfo.id);

    if (values.childId) {
      formData.append('child_id', values.childId);
    }
    if (values.name) {
      formData.append('name_translations', values.name);
    }
    if (values.description) {
      formData.append('description_translations', values.description);
    }
    // category could be zero + isUrgent is a boolean
    formData.append('category', parseInt(values.category, 10));
    formData.append('isUrgent', values.isUrgent);
    if (values.cost) {
      formData.append('cost', values.cost);
    }
    if (values.type) {
      formData.append('type', parseInt(values.type, 10));
    }
    if (values.link) {
      formData.append('link', values.link);
    }
    if (values.affiliateLinkUrl) {
      formData.append('affiliateLinkUrl', values.affiliateLinkUrl);
    }
    if (values.doing_duration) {
      formData.append('doing_duration', values.doing_duration);
    }
    if (values.details) {
      formData.append('details', values.details);
    }
    if (values.information) {
      formData.append('informations', values.information);
    }
    if (values.imageUrl) {
      formData.append('imageUrl', values.imageUrl);
    }

    const { data } = await publicApi.post(`/need/`, formData, config);

    // create relation between nest provider and flask need
    const config2 = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const request = { flaskNeedId: data.id, nestProviderId: providerId };
    await daoApi.post(`/providers/join`, request, config2);
    dispatch({
      type: ADD_ONE_NEED_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_ONE_NEED_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};


export const autoConfirmNeeds = () => async (dispatch, getState) => {
  try {
    dispatch({ type: AUTO_CONFIRM_NEEDS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/auto/confirm`, config);

    dispatch({
      type: AUTO_CONFIRM_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: AUTO_CONFIRM_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchUnconfirmedCount = () => async (dispatch, getState) => {
  try {
    dispatch({ type: UNCONFIRMED_NEEDS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/unconfirmed/${userInfo.id}`, config);

    dispatch({
      type: UNCONFIRMED_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: UNCONFIRMED_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchDuplicateChildNeeds = (childId, needId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DUPLICATES_NEEDS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/duplicates/${childId}/${needId}`, config);

    dispatch({
      type: DUPLICATES_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: DUPLICATES_NEEDS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const deleteOldNeeds = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_OLD_NEEDS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/delete/old`, config);

    dispatch({
      type: DELETE_OLD_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_OLD_NEEDS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};


export const updateArrivedNeeds = () => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_ARRIVALS_REQUEST });

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

    const { data } = await daoApi.get(`/needs/update/arrivals`, config);

    dispatch({
      type: UPDATE_ARRIVALS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_ARRIVALS_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const deleteCandidates = () => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_CANDIDATES_REQUEST });

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

    const { data } = await daoApi.get(`/needs/delete/candidates`, config);

    dispatch({
      type: DELETE_CANDIDATES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: DELETE_CANDIDATES_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const updateCandidates = () => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CANDIDATES_REQUEST });

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
    const { data } = await daoApi.get(`/needs/update/candidates`, config);
    dispatch({
      type: UPDATE_CANDIDATES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_CANDIDATES_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};