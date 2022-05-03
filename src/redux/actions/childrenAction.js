import { publicApi } from '../../apis/sayBase';
import {
  ADD_CHILD_FAIL,
  ADD_CHILD_REQUEST,
  ADD_CHILD_SUCCESS,
  CHILD_BY_ID_FAIL,
  CHILD_BY_ID_REQUEST,
  CHILD_BY_ID_SUCCESS,
  CHILD_LIST_FAIL,
  CHILD_LIST_REQUEST,
  CHILD_LIST_SUCCESS,
  CHILD_NEEDS_FAIL,
  CHILD_NEEDS_REQUEST,
  CHILD_NEEDS_SUCCESS,
  UPDATE_CHILD_FAIL,
  UPDATE_CHILD_IS_ACTIVE_FAIL,
  UPDATE_CHILD_IS_ACTIVE_REQUEST,
  UPDATE_CHILD_IS_ACTIVE_SUCCESS,
  UPDATE_CHILD_REQUEST,
  UPDATE_CHILD_SUCCESS,
} from '../constants/childrenConstants';

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
    console.log(userInfo);

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

export const fetchMyChildById = (childId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_BY_ID_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.get(`/child/childId=${childId}&confirm=1`, config);

    dispatch({
      type: CHILD_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CHILD_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const fetchChildList =
  ({ ngoId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CHILD_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: userInfo && userInfo.access_token,
        },
      };
      // [0]for not confirmed children only, [1]for confirmed children only, [2]for both confirmed and not confirmed children
      const { data } = await publicApi.get(`/child/all/confirm=${2}?ngo_id=${ngoId}`, config);

      dispatch({
        type: CHILD_LIST_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: CHILD_LIST_FAIL,
        payload: e.response && e.response.status ? e.response : e.message,
      });
    }
  };

export const updateChildIsActive = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CHILD_IS_ACTIVE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await publicApi.patch(`/ngo/${status}/ngoId=${id}`, id, config);

    dispatch({
      type: UPDATE_CHILD_IS_ACTIVE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_CHILD_IS_ACTIVE_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const updateChild = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CHILD_REQUEST });
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

    if (values.firstName) {
      formData.set('name', values.name);
    }
    if (values.lastName) {
      formData.set('lastName', values.lastName);
    }
    if (values.emailAddress) {
      formData.set('emailAddress', values.emailAddress);
    }
    if (values.country) {
      formData.set('country', values.country);
    }
    if (values.city) {
      formData.set('city', values.city);
    }
    if (values.phoneNumber) {
      formData.set('phoneNumber', values.phoneNumber);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }
    if (values.website) {
      formData.set('website', values.website);
    }

    if (values.finalImageFile) {
      formData.set('logoUrl', values.finalImageFile);
    }

    const { data } = await publicApi.patch(`/ngo/update/ngoId=${values.id}`, formData, config);
    dispatch({
      type: UPDATE_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_CHILD_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

export const AddChild = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_CHILD_REQUEST });
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

    if (values.lastName) {
      formData.set('name', values.name);
    }
    if (values.email) {
      formData.set('emailAddress', values.emailAddress);
    }
    if (values.country) {
      formData.set('country', values.country);
    }
    if (values.city) {
      formData.set('city', values.city);
    }
    if (values.phoneNumber) {
      formData.set('phoneNumber', values.phoneNumber);
    }
    if (values.website) {
      formData.set('website', values.website);
    }
    if (values.postalAddress) {
      formData.set('postalAddress', values.postalAddress);
    }

    if (values.logoUrl) {
      formData.set('logoUrl', values.logoUrl);
    }
    console.log('hala');
    console.log(values);

    const { data } = await publicApi.post(`/child/add`, formData, config);
    dispatch({
      type: ADD_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_CHILD_FAIL,
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};
