import {
  SELECTED_TICKET,
  SEARCH_USER,
  ADD_TICKET_REQUEST,
  ADD_TICKET_FAIL,
  ADD_TICKET_SUCCESS,
  TICKET_LIST_REQUEST,
  TICKET_LIST_SUCCESS,
  TICKET_LIST_FAIL,
  ADD_TICKET_MSG_REQUEST,
  ADD_TICKET_MSG_SUCCESS,
  ADD_TICKET_MSG_FAIL,
  TICKET_BY_ID_RESET,
  TICKET_BY_ID_REQUEST,
  TICKET_BY_ID_SUCCESS,
  TICKET_BY_ID_FAIL,
} from '../constants/ticketConstants';

const INIT_STATE = {
  currentTicket: 1,
  ticketSearch: '',
  tickets: [],
};

export const ticketAddReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TICKET_REQUEST:
      return { ...state, loading: true };
    case ADD_TICKET_SUCCESS:
      return {
        ...state,
        addedTicket: action.payload,
        loading: false,
        success: true,
      };
    case ADD_TICKET_FAIL:
      return { ...state, loading: false, error: action.payload };
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
    case TICKET_LIST_REQUEST:
      return { ...state, loading: true };
    case TICKET_LIST_SUCCESS:
      return { ...state, loading: false, success: true, tickets: action.payload };
    case TICKET_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };
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
    default:
      return state;
  }
};
