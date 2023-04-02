import {
  SELECTED_TICKET,
  SEARCH_USER,
  ADD_TICKET_REQUEST,
  ADD_TICKET_FAIL,
  ADD_TICKET_SUCCESS,
  USER_TICKET_LIST_REQUEST,
  USER_TICKET_LIST_SUCCESS,
  USER_TICKET_LIST_FAIL,
  ADD_TICKET_MSG_REQUEST,
  ADD_TICKET_MSG_SUCCESS,
  ADD_TICKET_MSG_FAIL,
  TICKET_BY_ID_RESET,
  TICKET_BY_ID_REQUEST,
  TICKET_BY_ID_SUCCESS,
  TICKET_BY_ID_FAIL,
  UPDATE_TICKET_COLOR_REQUEST,
  UPDATE_TICKET_COLOR_SUCCESS,
  UPDATE_TICKET_COLOR_FAIL,
  UPDATE_TICKET_COLOR_RESET,
  OPEN_TICKETING,
  ADD_TICKET_MSG_RESET,
  ADD_TICKET_RESET,
} from '../constants/ticketConstants';

const INIT_STATE = {
  currentTicket: null,
  ticketSearch: '',
  tickets: [],
  isTicketingOpen: false,
};

export const ticketAddReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TICKET_REQUEST:
      return { ...state, success: false, loading: true };
    case ADD_TICKET_SUCCESS:
      return {
        ...state,
        addedTicket: action.payload,
        loading: false,
        success: true,
      };
    case ADD_TICKET_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ADD_TICKET_RESET:
      return {};
    default:
      return state;
  }
};

export const ticketUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_TICKET_COLOR_REQUEST:
      return { loading: true };
    case UPDATE_TICKET_COLOR_SUCCESS:
      return {
        ...state,
        updatedTicket: action.payload,
        loading: false,
        success: true,
      };
    case UPDATE_TICKET_COLOR_FAIL:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_TICKET_COLOR_RESET:
      return {};
    default:
      return state;
  }
};

export const ticketByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case TICKET_BY_ID_REQUEST:
      return { ...state, loading: true };
    case TICKET_BY_ID_SUCCESS:
      return { ...state, loading: false, success: true, ticket: action.payload };
    case TICKET_BY_ID_FAIL:
      return { ...state, loading: false, error: action.payload };
    case TICKET_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};
export const ticketListReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_TICKET_LIST_REQUEST:
      return { ...state, tickets: null, loading: true };
    case USER_TICKET_LIST_SUCCESS:
      return { ...state, loading: false, success: true, tickets: action.payload };
    case USER_TICKET_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
    case OPEN_TICKETING:
      return {
        ...state,
        isTicketingOpen: action.open,
      };
    case SELECTED_TICKET:
      return {
        ...state,
        currentTicket: action.id,
      };
    case SEARCH_USER:
      return {
        ...state,
        ticketSearch: action.searchTerm,
      };
    default:
      return state;
  }
};

export const ticketAddMsgReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TICKET_MSG_REQUEST:
      return { ...state, loading: true };
    case ADD_TICKET_MSG_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        socketContent: action.payload,
      };
    case ADD_TICKET_MSG_FAIL:
      return { ...state, loading: false, error: action.payload };
    case ADD_TICKET_MSG_RESET:
      return {};
    default:
      return state;
  }
};
