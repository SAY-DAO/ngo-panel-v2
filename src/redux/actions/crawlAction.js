import { daoApi } from '../../apis/sayBase';
import { CRAWL_LINK_FAIL, CRAWL_LINK_REQUEST, CRAWL_LINK_SUCCESS } from "../constants/crawlConstant";

const crawlTheLink = (url) => async (dispatch, getState) => {
  try {
    dispatch({ type: CRAWL_LINK_REQUEST });

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

    const { data } = await daoApi.get(`/crawler/digikala?url=${url}`, config);

    dispatch({
      type: CRAWL_LINK_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: CRAWL_LINK_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export default crawlTheLink;
