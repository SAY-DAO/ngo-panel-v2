import { daoApi } from '../../apis/sayBase';
import {
  SELECTED_TICKET,
  SEARCH_USER,
  ADD_TICKET_FAIL,
  ADD_TICKET_REQUEST,
  ADD_TICKET_SUCCESS,
  USER_TICKET_LIST_REQUEST,
  USER_TICKET_LIST_SUCCESS,
  USER_TICKET_LIST_FAIL,
  ADD_TICKET_MSG_REQUEST,
  ADD_TICKET_MSG_SUCCESS,
  ADD_TICKET_MSG_FAIL,
  TICKET_BY_ID_REQUEST,
  TICKET_BY_ID_SUCCESS,
  TICKET_BY_ID_FAIL,
  UPDATE_TICKET_COLOR_REQUEST,
  UPDATE_TICKET_COLOR_SUCCESS,
  UPDATE_TICKET_COLOR_FAIL,
  OPEN_TICKETING,
} from '../constants/ticketConstants';

export const openTicketing = (open) => ({
  type: OPEN_TICKETING,
  open,
});

export const selectTicket = (id) => ({
  type: SELECTED_TICKET,
  id,
});

export const TicketSearch = (searchTerm) => ({
  type: SEARCH_USER,
  searchTerm,
});

export const fetchUserTicketList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_TICKET_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,

      },
    };
    const { data } = await daoApi.get(`/tickets/all/user/${userInfo.id}`, config);

    dispatch({
      type: USER_TICKET_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: USER_TICKET_LIST_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchTicketById = (ticketId) => async (dispatch, getState) => {
  try {
    dispatch({ type: TICKET_BY_ID_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/tickets/ticket/${ticketId}/${userInfo.id}`, config);

    dispatch({
      type: TICKET_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: TICKET_BY_ID_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const addTicket = (values) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TICKET_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskSwId: userInfo && userInfo.id,
      },
    };

    const dataObject = {
      title: values.title,
      roles: values.roles,
      flaskUserId: values.flaskUserId,
      userTypeId: values.userTypeId,
      flaskNeedId: values.flaskNeedId,
      statuses: values.statuses,
      receipts: values.receipts,
      payments: values.payments,
      announcement: values.announcement,
      arrivalDate: values.arrivalDate,
    };

    const { data } = await daoApi.post(`/tickets/add`, dataObject, config);
    dispatch({
      type: ADD_TICKET_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: ADD_TICKET_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const updateTicketColor = (socketData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TICKET_COLOR_REQUEST });

    // const { data } = await daoApi.patch(
    //   `/tickets/ticket/${values.ticketId}?color=${values.color}`,
    //   config,
    // );
    dispatch({
      type: UPDATE_TICKET_COLOR_SUCCESS,
      payload: {
        color: socketData.color,
        needFlaskId: socketData.needFlaskId,
        needStatus: socketData.needStatus,
        needType: socketData.needType,
        ticketId: socketData.ticketId,
      },
    });
  } catch (e) {
    dispatch({
      type: UPDATE_TICKET_COLOR_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const addTicketMsg = (socketData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TICKET_MSG_REQUEST });
    dispatch({
      type: ADD_TICKET_MSG_SUCCESS,
      payload: { ...socketData },
    });
  } catch (e) {
    dispatch({
      type: ADD_TICKET_MSG_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};
