import { publicApi } from '../../apis/sayBase';
import {
  CHILD_LIST_REQUEST,
  CHILD_LIST_SUCCESS,
  CHILD_LIST_FAIL,
} from '../constants/childConstant';

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
    const { data } = await publicApi.get(`/child/all/confirm=2`, config);

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
