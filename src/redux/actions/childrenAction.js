import { publicApi } from '../../apis/sayBase';
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
  UPDATE_CHILD_FAIL,
  UPDATE_CHILD_IS_ACTIVE_FAIL,
  UPDATE_CHILD_IS_ACTIVE_REQUEST,
  UPDATE_CHILD_IS_ACTIVE_SUCCESS,
  UPDATE_CHILD_REQUEST,
  UPDATE_CHILD_SUCCESS,
} from '../constants/childrenConstants';

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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchChildList = () => async (dispatch, getState) => {
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
    const array4 = array2.concat(responseTempGone.data.children);

    dispatch({
      type: CHILD_LIST_SUCCESS,
      payload: array4,
    });
  } catch (e) {
    dispatch({
      type: CHILD_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
          'Content-type': 'application/json',
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
        payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
    if (values.id_ngo) {
      formData.append('ngo_id', values.id_ngo);
    }
    if (values.id_social_worker) {
      formData.append('sw_id', values.id_social_worker);
    }
    if (values.awakeAvatarUrl) {
      formData.append('awakeAvatarUrl', values.awakeAvatarUrl);
    }
    if (values.sleptAvatarUrl) {
      formData.append('sleptAvatarUrl', values.sleptAvatarUrl);
    }
    if (values.voiceUrl) {
      formData.append('voiceUrl', values.voiceUrl);
    }
    if (values.firstName) {
      formData.append('firstName_translations', values.firstName_translations);
    }
    if (values.lastName) {
      formData.append('lastName_translations', values.lastName_translations);
    }
    if (values.bio_translations) {
      formData.append('sayname_translations', values.sayname_translations);
    }
    if (values.lastName) {
      formData.append('bio_translations', values.bio_translations);
    }
    if (values.lastName) {
      formData.append('bio_summary_translations', values.bio_summary_translations);
    }
    if (values.phoneNumber) {
      formData.append('phoneNumber', values.phoneNumber);
    }
    if (values.nationality) {
      formData.append('nationality', values.nationality);
    }
    if (values.country) {
      formData.append('country', values.country);
    }
    if (values.city) {
      formData.append('city', values.city);
    }
    if (values.birthPlace) {
      formData.append('birthPlace', values.birthPlace);
    }
    if (values.birthDate) {
      formData.append('birthDate', values.birthDate);
    }
    if (values.address) {
      formData.append('address', values.address);
    }
    if (values.familyCount) {
      formData.append('familyCount', values.familyCount);
    }
    if (values.education || values.school_type) {
      formData.append(
        'education',
        values.education === '-2' ? `-${values.school_type}2` : values.school_type + values.education,
      ); // because "int-2" cannot be stored. temporarily solution!
    }
    if (values.housingStatus) {
      formData.append('housingStatus', values.housingStatus);
    }
 
    console.log('child');
    console.log(values);

    const { data } = await publicApi.post(`/child/add`, formData, config);
    dispatch({
      type: ADD_CHILD_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: ADD_CHILD_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
