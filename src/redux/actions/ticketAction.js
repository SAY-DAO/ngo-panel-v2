import { daoApi } from '../../apis/sayBase';
import {
  SELECTED_TICKET,
  SEARCH_USER,
  ADD_TICKET_FAIL,
  ADD_TICKET_REQUEST,
  ADD_TICKET_SUCCESS,
  TICKET_LIST_REQUEST,
  TICKET_LIST_SUCCESS,
  TICKET_LIST_FAIL,
  ADD_TICKET_MSG_REQUEST,
  ADD_TICKET_MSG_SUCCESS,
  ADD_TICKET_MSG_FAIL,
  TICKET_BY_ID_REQUEST,
  TICKET_BY_ID_SUCCESS,
  TICKET_BY_ID_FAIL,
  UPDATE_TICKET_COLOR_REQUEST,
  UPDATE_TICKET_COLOR_SUCCESS,
  UPDATE_TICKET_COLOR_FAIL,
} from '../constants/ticketConstants';

export const selectTicket = (id) => ({
  type: SELECTED_TICKET,
  id,
});

export const TicketSearch = (searchTerm) => ({
  type: SEARCH_USER,
  searchTerm,
});

export const fetchTicketList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TICKET_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { data } = await daoApi.get(`/tickets/all/user/${userInfo.id}`, config);

    dispatch({
      type: TICKET_LIST_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: TICKET_LIST_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const fetchTicketById = (ticketId) => async (dispatch) => {
  try {
    dispatch({ type: TICKET_BY_ID_REQUEST });
    const { data } = await daoApi.get(`/tickets/ticket/${ticketId}`);
    dispatch({
      type: TICKET_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: TICKET_BY_ID_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
      },
    };
    const { child, ...others } = values.need;
    const dataObject = {
      userId: values.userId,
      needId: values.needId,
      childId: child.id,
      title: values.title,
      need: others,
      ngoId: values.ngoId,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};

export const updateTicketColor = (values) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TICKET_COLOR_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const { data } = await daoApi.patch(
      `/tickets/ticket/${values.ticketId}?needId=${values.needId}&color=${values.color}`,
      config,
    );
    dispatch({
      type: UPDATE_TICKET_COLOR_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: UPDATE_TICKET_COLOR_FAIL,
      payload: e.response && e.response.status ? e.response : e.response.data.message,
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
      payload: e.response && e.response.status ? e.response : e.response.data.message,
    });
  }
};
