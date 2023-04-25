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
  COUNTRY_BY_ID_REQUEST,
  COUNTRY_BY_ID_SUCCESS,
  COUNTRY_BY_ID_FAIL,
  COUNTRY_BY_ID_RESET,
  CITY_BY_ID_REQUEST,
  CITY_BY_ID_SUCCESS,
  CITY_BY_ID_FAIL,
  CITY_BY_ID_RESET,
  CITIES_BY_IDS_REQUEST,
  CITIES_BY_IDS_SUCCESS,
  CITIES_BY_IDS_FAIL,
  CITIES_BY_IDS_RESET,
} from '../constants/countryConstants';

export function countryListReducer(state = { success: false }, action) {
  switch (action.type) {
    case COUNTRY_LIST_REQUEST:
      return { loading: true };
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

export const countryByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case COUNTRY_BY_ID_REQUEST:
      return { loading: true };
    case COUNTRY_BY_ID_SUCCESS:
      return { ...state, loading: false, success: true, country: action.payload };
    case COUNTRY_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case COUNTRY_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const cityByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CITY_BY_ID_REQUEST:
      return { loading: true };
    case CITY_BY_ID_SUCCESS:
      return { ...state, loading: false, success: true, city: action.payload };
    case CITY_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case CITY_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const citiesByIdsReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case CITIES_BY_IDS_REQUEST:
      return { loading: true };
    case CITIES_BY_IDS_SUCCESS:
      return { ...state, loading: false, success: true, theCities: action.payload };
    case CITIES_BY_IDS_FAIL:
      return { loading: false, error: action.payload };
    case CITIES_BY_IDS_RESET:
      return {};
    default:
      return state;
  }
};
