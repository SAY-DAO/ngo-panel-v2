import {
  SW_LIST_REQUEST,
  SW_LIST_SUCCESS,
  SW_LIST_FAIL,
  SW_DETAILS_REQUEST,
  SW_DETAILS_FAIL,
  SW_DETAILS_SUCCESS,
  UPDATE_SW_IS_ACTIVE_REQUEST,
  UPDATE_SW_IS_ACTIVE_SUCCESS,
  UPDATE_SW_IS_ACTIVE_FAIL,
  SW_DETAILS_RESET,
  SW_BY_ID_REQUEST,
  SW_BY_ID_SUCCESS,
  SW_BY_ID_FAIL,
  SW_BY_ID_RESET,
  UPDATE_SW_REQUEST,
  UPDATE_SW_SUCCESS,
  UPDATE_SW_FAIL,
  ADD_SW_REQUEST,
  ADD_SW_SUCCESS,
  ADD_SW_FAIL,
  SW_LIST_RESET,
  MIGRATE_SW_CHILDREN_REQUEST,
  MIGRATE_SW_CHILDREN_SUCCESS,
  MIGRATE_SW_CHILDREN_FAIL,
  SW_CHILD_LIST_REQUEST,
  SW_CHILD_LIST_SUCCESS,
  SW_CHILD_LIST_FAIL,
  MIGRATE_SW_CHILDREN_RESET,
  MIGRATE_ONE_CHILD_REQUEST,
  MIGRATE_ONE_CHILD_SUCCESS,
  MIGRATE_ONE_CHILD_FAIL,
  MIGRATE_ONE_CHILD_RESET,
} from '../constants/socialWorkerConstants';


export const swDetailsReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_DETAILS_REQUEST:
      return { loading: true };
    case SW_DETAILS_SUCCESS:
      return { loading: false, success: true, swInfo: action.payload };
    case SW_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case SW_DETAILS_RESET:
      return {};
    default:
      return state;
  }
};

export const swByIdReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_CHILD_LIST_REQUEST:
      return { ...state, loading: true };
    case SW_CHILD_LIST_SUCCESS:
      return { ...state, loading: false, success: true, children: action.payload };
    case SW_CHILD_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SW_BY_ID_REQUEST:
      return { loading: true };
    case SW_BY_ID_SUCCESS:
      return { ...state, loading: false, success: true, result: action.payload };
    case SW_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case SW_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const swListReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case SW_LIST_REQUEST:
      return { loading: true };
    case SW_LIST_SUCCESS:
      return { loading: false, success: true, swList: action.payload };
    case SW_LIST_FAIL:
      return { loading: false, error: action.payload };
    case SW_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const swUpdateIsActiveReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_SW_IS_ACTIVE_REQUEST:
      return { loading: true };
    case UPDATE_SW_IS_ACTIVE_SUCCESS:
      return { loading: false, success: true, status: action.payload };
    case UPDATE_SW_IS_ACTIVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const swMigrateOneReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case MIGRATE_ONE_CHILD_REQUEST:
      return { loading: true };
    case MIGRATE_ONE_CHILD_SUCCESS:
      return { loading: false, success: true, migrate: action.payload };
    case MIGRATE_ONE_CHILD_FAIL:
      return { loading: false, error: action.payload };
    case MIGRATE_ONE_CHILD_RESET:
      return {};
    default:
      return state;
  }
};

export const swMigrateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case MIGRATE_SW_CHILDREN_REQUEST:
      return { loading: true };
    case MIGRATE_SW_CHILDREN_SUCCESS:
      return { loading: false, success: true, migrate: action.payload };
    case MIGRATE_SW_CHILDREN_FAIL:
      return { loading: false, error: action.payload };
    case MIGRATE_SW_CHILDREN_RESET:
      return {};
    default:
      return state;
  }
};

export const swUpdateReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case UPDATE_SW_REQUEST:
      return { loading: true };
    case UPDATE_SW_SUCCESS:
      return { loading: false, success: true, updated: action.payload };
    case UPDATE_SW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const swAddReducer = (state = { success: false }, action) => {
  switch (action.type) {
    case ADD_SW_REQUEST:
      return { loading: true };
    case ADD_SW_SUCCESS:
      return { loading: false, success: true, added: action.payload };
    case ADD_SW_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
