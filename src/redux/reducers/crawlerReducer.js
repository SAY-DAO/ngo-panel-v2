import {
  CRAWL_LINK_FAIL,
  CRAWL_LINK_REQUEST,
  CRAWL_LINK_RESET,
  CRAWL_LINK_SUCCESS,
} from '../constants/crawlConstant';

const crawlReducer = (state = {}, action) => {
  switch (action.type) {
    case CRAWL_LINK_REQUEST:
      return { loading: true, success: false };
    case CRAWL_LINK_SUCCESS:
      return { loading: false, success: true, crawlResult: action.payload };
    case CRAWL_LINK_FAIL:
      return { loading: false, error: action.payload };
    case CRAWL_LINK_RESET:
      return {};
    default:
      return state;
  }
};

export default crawlReducer;
