import { publicApi } from '../../apis/sayBase';
import {
  CHILD_EXAMPLE_NEEDS_FAIL,
  CHILD_EXAMPLE_NEEDS_REQUEST,
  CHILD_EXAMPLE_NEEDS_SUCCESS,
  CHILD_NEEDS_FAIL,
  CHILD_NEEDS_REQUEST,
  CHILD_NEEDS_SUCCESS,
  CHILD_ONE_NEED_REQUEST,
  CHILD_ONE_NEED_SUCCESS,
  CHILD_ONE_NEED_FAIL,
  SW_NEED_LIST_REQUEST,
  SW_NEED_LIST_SUCCESS,
  SW_NEED_LIST_FAIL,
  UPDATE_ONE_NEED_REQUEST,
  UPDATE_ONE_NEED_SUCCESS,
  UPDATE_ONE_NEED_FAIL,
  ADD_ONE_NEED_REQUEST,
  ADD_ONE_NEED_SUCCESS,
  ADD_ONE_NEED_FAIL,
  UPDATE_NEED_CONFIRM_REQUEST,
  UPDATE_NEED_CONFIRM_SUCCESS,
  UPDATE_NEED_CONFIRM_FAIL,
  ALL_NEEDS_REQUEST,
  ALL_NEEDS_SUCCESS,
  ALL_NEEDS_FAIL,
} from '../constants/needConstant';

export const fetchAllNeeds = (isDone, ngoId, type, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: ALL_NEEDS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-TAKE': 100, // pagination
      },
    };
    const { data } = await publicApi.get(
      `/needs?isDone=${isDone}&ngoId=${ngoId}&type=${type}&status=${status}`,
      config,
    );

    dispatch({
      type: ALL_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ALL_NEEDS_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/preneeds/`, config);

    dispatch({
      type: CHILD_EXAMPLE_NEEDS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CHILD_EXAMPLE_NEEDS_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchChildNeeds = (childId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_NEEDS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
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
      payload: e.response && e.response.status ? e.response : e.message,
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
        'Content-type': 'application/json',
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
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchSwNeedList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SW_NEED_LIST_REQUEST });
    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    let url;
    // super admin
    if (swInfo.typeId === 1) {
      url = `/needs`;
    } else {
      url = `/socialworkers/${userInfo.id}/createdNeeds`;
    }
    const { data } = await publicApi.get(url, config);

    dispatch({
      type: SW_NEED_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SW_NEED_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.patch(`/need/confirm/needId=${needId}`, config);

    dispatch({
      type: UPDATE_NEED_CONFIRM_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_NEED_CONFIRM_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const updateNeed = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_ONE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const formData = new FormData();
    if (values.childId) {
      formData.set('child_id', values.childId);
    }
    if (values.swId) {
      formData.set('sw_id', values.swId);
    }
    if (values.name) {
      formData.set('name_translations', values.name);
    }
    if (values.description) {
      formData.set('description_translations', values.description);
    }
    if (values.category) {
      formData.set('category', values.category);
    }
    if (values.isUrgent) {
      formData.set('isUrgent', values.isUrgent);
    }
    if (values.cost) {
      formData.set('cost', values.cost);
    }
    // Can be set only in p3 (product status 3)
    if (values.purchaseCost) {
      formData.set('purchase_cost', values.purchaseCost);
    }
    if (values.type) {
      formData.set('type', values.type);
    }
    if (values.link) {
      formData.set('link', values.link);
    }
    if (values.affiliateLinkUrl) {
      formData.set('affiliateLinkUrl', values.affiliateLinkUrl);
    }
    if (values.receipts) {
      formData.set('receipts', values.receipts);
    }
    if (values.doingDuration) {
      formData.set('doing_duration', values.doingDuration);
    }
    if (values.details) {
      formData.set('details', values.details);
    }
    if (values.information) {
      formData.set('informations', values.information);
    }
    if (values.deliveryDate) {
      formData.set('delivery_date', values.deliveryDate);
    }
    if (values.finalImageFile) {
      formData.set('imageUrl', values.finalImageFile);
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
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const AddNeed = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_ONE_NEED_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const formData = new FormData();
    if (values.childId) {
      formData.set('child_id', values.childId);
    }
    if (values.swId) {
      formData.set('sw_id', values.swId);
    }
    if (values.name) {
      formData.set('name_translations', values.name);
    }
    if (values.description) {
      formData.set('description_translations', values.description);
    }
    if (values.category) {
      formData.set('category', values.category);
    }
    if (values.isUrgent) {
      formData.set('isUrgent', values.isUrgent);
    }
    if (values.cost) {
      formData.set('cost', values.cost);
    }
    if (values.type) {
      formData.set('type', values.type);
    }
    if (values.link) {
      formData.set('link', values.link);
    }
    if (values.affiliateLinkUrl) {
      formData.set('affiliateLinkUrl', values.affiliateLinkUrl);
    }
    if (values.receipts) {
      formData.set('receipts', values.receipts);
    }
    if (values.doingDuration) {
      formData.set('doing_duration', values.doingDuration);
    }
    if (values.details) {
      formData.set('details', values.details);
    }
    if (values.information) {
      formData.set('informations', values.information);
    }
    if (values.deliveryDate) {
      formData.set('delivery_date', values.deliveryDate);
    }
    if (values.finalImageFile) {
      formData.set('imageUrl', values.finalImageFile);
    }
    const { data } = await publicApi.post(`/need`, formData, config);
    dispatch({
      type: ADD_ONE_NEED_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_ONE_NEED_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
