import { daoApi, publicApi } from '../../apis/sayBase';
import {
  ADD_CHILD_FAIL,
  ADD_CHILD_REQUEST,
  ADD_CHILD_SUCCESS,
  CHILD_BY_ID_FAIL,
  CHILD_BY_ID_REQUEST,
  CHILD_BY_ID_SUCCESS,
  CHILDREN_BY_NGO_FAIL,
  CHILDREN_BY_NGO_REQUEST,
  CHILDREN_BY_NGO_SUCCESS,
  CHILD_LIST_REQUEST,
  CHILD_LIST_SUCCESS,
  CHILD_LIST_FAIL,
  UPDATE_CHILD_REQUEST,
  UPDATE_CHILD_SUCCESS,
  UPDATE_CHILD_STATUS_FAIL,
  UPDATE_CHILD_STATUS_REQUEST,
  UPDATE_CHILD_STATUS_SUCCESS,
  PRE_REGISTER_CHILD_ADD_FAIL,
  PRE_REGISTER_CHILD_ADD_REQUEST,
  PRE_REGISTER_CHILD_ADD_SUCCESS,
  CHECK_SIMILAR_NAMES_FAIL,
  CHECK_SIMILAR_NAMES_REQUEST,
  CHECK_SIMILAR_NAMES_SUCCESS,
  UPDATE_CHILD_FAIL,
  CHILD_ACTIVE_LIST_REQUEST,
  CHILD_ACTIVE_LIST_SUCCESS,
  CHILD_ACTIVE_LIST_FAIL,
  PRE_REGISTER_CHILD_LIST_REQUEST,
  PRE_REGISTER_CHILD_LIST_SUCCESS,
  PRE_REGISTER_CHILD_LIST_FAIL,
  PRE_REGISTER_CHILD_UPDATE_REQUEST,
  PRE_REGISTER_CHILD_UPDATE_SUCCESS,
  PRE_REGISTER_CHILD_UPDATE_FAIL,
} from '../constants/childrenConstants';

export const fetchMyChildById = (childId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_BY_ID_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
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
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchActiveChildList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_ACTIVE_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id, // nest server needs this for auth
      },
    };
    // const { data } = await publicApi.get(`/child/actives`, config);
    const { data } = await daoApi.get(`/children/all/actives`, config);

    dispatch({
      type: CHILD_ACTIVE_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CHILD_ACTIVE_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchChildList = (take, limit, filters) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHILD_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id, // nest server needs this for auth
        'X-TAKE': take,
        'X-LIMIT': limit,
      },
    };

    const { data } = await daoApi.post(`/children/flask/all`, filters, config);

    dispatch({
      type: CHILD_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CHILD_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchChildrenByNgo =
  ({ ngoId }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CHILDREN_BY_NGO_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userInfo && userInfo.access_token,
        },
      };
      // [0]for not confirmed children only, [1]for confirmed children only, [2]for both confirmed and not confirmed children
      const { data } = await publicApi.get(`/child/all/confirm=${2}?ngo_id=${ngoId}`, config);

      dispatch({
        type: CHILDREN_BY_NGO_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: CHILDREN_BY_NGO_FAIL,
        payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const formData = new FormData();

    if (values.country) {
      formData.append('country', values.country);
    }
    if (values.city) {
      formData.append('city', values.city);
    }
    if (values.nationality) {
      formData.append('nationality', values.nationality);
    }

    const { data } = await publicApi.patch(
      `/child/update/childId=${values.childId}`,
      formData,
      config,
    );
    dispatch({
      type: UPDATE_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_CHILD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updateChildExistenceStatus = (childId, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CHILD_STATUS_REQUEST });
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

    formData.append('existence_status', status); // 0 dead :( | 1 alive and present | 2 alive but gone | 3 Temporary gone
    const { data } = await publicApi.patch(`/child/update/childId=${childId}`, formData, config);
    dispatch({
      type: UPDATE_CHILD_STATUS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_CHILD_STATUS_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const checkSimilarNames = (newName, lang) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHECK_SIMILAR_NAMES_REQUEST });
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

    const { data } = await daoApi.patch(`/children/check/names/${newName}/${lang}`, config);
    dispatch({
      type: CHECK_SIMILAR_NAMES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: CHECK_SIMILAR_NAMES_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const createPreRegisterChild = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRE_REGISTER_CHILD_ADD_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();


    const formData = new FormData();
    formData.append('awakeFile', values.awakeFile);
    formData.append('sleptFile', values.sleptFile);
    formData.append('sayNameEn', values.sayName.en);
    formData.append('sayNameFa', values.sayName.fa);

    const config = {
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
        
      },
    };


    const { data } = await daoApi.post(`/children/preregister`, formData, config);

    dispatch({
      type: PRE_REGISTER_CHILD_ADD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: PRE_REGISTER_CHILD_ADD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updatePreRegisterChild = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRE_REGISTER_CHILD_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        processData: false,
        contentType: false,
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.patch(`/children/preregister`, values, config);

    dispatch({
      type: PRE_REGISTER_CHILD_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: PRE_REGISTER_CHILD_UPDATE_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const getPreRegisters = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRE_REGISTER_CHILD_LIST_REQUEST });
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

    const { data } = await daoApi.get(`/children/preregister/all`, config);

    dispatch({
      type: PRE_REGISTER_CHILD_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: PRE_REGISTER_CHILD_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
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
        'Content-Type': 'multipart/form-data',
        Authorization: userInfo && userInfo.access_token,
      },
    };

    const formData = new FormData();
    formData.append('ngo_id', values.id_ngo);
    formData.append('sw_id', values.id_social_worker);
    formData.append('awakeAvatarUrl', values.awakeAvatarUrl);
    formData.append('sleptAvatarUrl', values.sleptAvatarUrl);
    formData.append('voiceUrl', values.voiceUrl);
    formData.append('gender', values.gender);
    formData.append('cityId', values.cityId);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('birthDate', values.birthDate);
    // Start values.translation fields
    formData.append('sayname_translations', values.sayname_translations);
    formData.append('bio_translations', values.bio_translations);
    formData.append('bio_summary_translations', values.bio_summary_translations);
    formData.append('firstName_translations', values.firstName_translations);
    formData.append('lastName_translations', values.lastName_translations);

    if (values.address) {
      formData.append('address', values.address);
    }
    // if (values.education || values.school_type) {
    //   formData.append(
    //     'education',
    //     values.education === '-2' ? `-${values.school_type}2` : values.school_type + values.education,
    //   ); // because "int-2" cannot be stored. temporarily solution!
    // }
    if (values.birthPlaceId) {
      formData.append('birthPlaceId', values.birthPlaceId);
    }
    if (values.familyCount) {
      formData.append('familyCount', values.familyCount);
    }
    if (values.education || values.school_type) {
      formData.append(
        'education',
        values.education === '-2'
          ? `-${values.school_type}2`
          : values.school_type + values.education,
      ); // because "int-2" cannot be stored. temporarily solution!
    }
    if (values.housingStatus) {
      formData.append('housingStatus', values.housingStatus);
    }
    console.log(values);

    const { data } = await publicApi.post(`/child/add/`, formData, config);
    dispatch({
      type: ADD_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_CHILD_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
