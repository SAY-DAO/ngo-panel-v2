import {
  ADD_NGO_FAIL,
  ADD_NGO_REQUEST,
  ADD_NGO_RESET,
  ADD_NGO_SUCCESS,
  DELETE_NGO_FAIL,
  DELETE_NGO_REQUEST,
  DELETE_NGO_SUCCESS,
  NGO_ARRIVAL_FAIL,
  NGO_ARRIVAL_REQUEST,
  NGO_ARRIVAL_SUCCESS,
  UPDATE_NGO_ARRIVAL_FAIL,
  UPDATE_NGO_ARRIVAL_REQUEST,
  UPDATE_NGO_ARRIVAL_SUCCESS,
  NGO_BY_ID_FAIL,
  NGO_BY_ID_REQUEST,
  NGO_BY_ID_RESET,
  NGO_BY_ID_SUCCESS,
  NGO_LIST_FAIL,
  NGO_LIST_REQUEST,
  NGO_LIST_RESET,
  NGO_LIST_SUCCESS,
  UPDATE_NGO_FAIL,
  UPDATE_NGO_IS_ACTIVE_FAIL,
  UPDATE_NGO_IS_ACTIVE_REQUEST,
  UPDATE_NGO_IS_ACTIVE_SUCCESS,
  UPDATE_NGO_REQUEST,
  UPDATE_NGO_SUCCESS,
} from '../constants/ngoConstants';

export const ngoByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NGO_BY_ID_REQUEST:
      return { loading: true };
    case NGO_BY_ID_SUCCESS:
      return { loading: false, success: true, result: action.payload };
    case NGO_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case NGO_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const ngoListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NGO_LIST_REQUEST:
      return { loading: true };
    case NGO_LIST_SUCCESS:
      return { loading: false, success: true, ngoList: action.payload };
    case NGO_LIST_FAIL:
      return { loading: false, error: action.payload };
    case NGO_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const ngoUpdateIsActiveReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_NGO_IS_ACTIVE_REQUEST:
      return { loading: true };
    case UPDATE_NGO_IS_ACTIVE_SUCCESS:
      return { loading: false, success: true, status: action.payload };
    case UPDATE_NGO_IS_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ngoUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_NGO_REQUEST:
      return { loading: true };
    case UPDATE_NGO_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_NGO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ngoAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_NGO_REQUEST:
      return { loading: true };
    case ADD_NGO_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_NGO_FAIL:
      return { loading: false, error: action.payload };
    case ADD_NGO_RESET:
      return {};
    default:
      return state;
  }
};

export const ngoDeleteReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case DELETE_NGO_REQUEST:
      return { loading: true };
    case DELETE_NGO_SUCCESS:
      return { loading: false, success: true, deleted: action.payload };
    case DELETE_NGO_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ngoArrivalReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case NGO_ARRIVAL_REQUEST:
      return { loading: true };
    case NGO_ARRIVAL_SUCCESS:
      return { loading: false, success: true, arrivals: action.payload };
    case NGO_ARRIVAL_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_NGO_ARRIVAL_REQUEST:
      return { ...state, loading: true };
    case UPDATE_NGO_ARRIVAL_SUCCESS:
      return { ...state, loading: false, success: true, updatedCode: action.payload };
    case UPDATE_NGO_ARRIVAL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
