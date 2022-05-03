import {
  CITY_LIST_FAIL,
  CITY_LIST_REQUEST,
  CITY_LIST_SUCCESS,
  COUNTRY_LIST_FAIL,
  COUNTRY_LIST_REQUEST,
  COUNTRY_LIST_RESET,
  COUNTRY_LIST_SUCCESS,
  STATE_LIST_FAIL,
  STATE_LIST_REQUEST,
  STATE_LIST_SUCCESS,
} from '../constants/countryConstants';

export default function countryListReducer(state = { success: false }, action) {
  switch (action.type) {
    case COUNTRY_LIST_REQUEST:
      return { ...state, loading: true };
    case COUNTRY_LIST_SUCCESS:
      return { ...state, loading: false, success: true, countries: action.payload };
    case COUNTRY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case STATE_LIST_REQUEST:
      return { ...state, loading: true };
    case STATE_LIST_SUCCESS:
      return { ...state, loading: false, success: true, states: action.payload };
    case STATE_LIST_FAIL:
      return { loading: false, error: action.payload };
    case CITY_LIST_REQUEST:
      return { ...state, loading: true };
    case CITY_LIST_SUCCESS:
      return { ...state, loading: false, success: true, cities: action.payload };
    case CITY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case COUNTRY_LIST_RESET:
      return {};
    default:
      return state;
  }
}
