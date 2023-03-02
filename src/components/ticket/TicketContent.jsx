/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Divider,
  Avatar,
  ListItemText,
  ListItemAvatar,
  Box,
  Grid,
  ListItem,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Scrollbar from '../custom-scroll/Scrollbar';
import { getCurrentStatusString, getUserSAYRoleString } from '../../utils/helpers';
import { fetchTicketById } from '../../redux/actions/ticketAction';
import { socketHttp, WebsocketProvider } from '../../contexts/WebsocketContext';

const TicketContent = ({ toggleTicketSidebar }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [theTicket, setTheTicket] = useState(null);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket, tickets } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { socketContent } = ticketMsgAdd;

  // set ticket
  useEffect(() => {
    if (socketContent) {
      const modifiedTickets = tickets.map((ticket) =>
        ticket.id === socketContent.content.ticket.id
          ? { ...ticket, ...ticket.ticketHistory.push(socketContent.content) }
          : ticket,
      );
      setTheTicket(modifiedTickets.find((tik) => tik.id === currentTicket));
    } else {
      setTheTicket(tickets && tickets.find((tik) => tik.id === currentTicket));
    }
  }, [ socketContent, currentTicket]);

  // fetch ticket when selected
  useEffect(() => {
    dispatch(fetchTicketById(currentTicket));
  }, [currentTicket]);

  console.log(theTicket)
  return (
    <WebsocketProvider value={socketHttp}>
      <Box>
        {theTicket ? (
          <div>
            <Box
              display="flex"
              alignItems="center"
              p={2}
              sx={{
                pt: '8px',
                pb: '7px',
              }}
            >
              <Box
                sx={{
                  display: { xs: 'block', md: 'block', lg: 'none' },
                  mr: '10px',
                }}
              >
                <FeatherIcon icon="menu" width="18" onClick={toggleTicketSidebar} />
              </Box>
              <Grid container direction="row">
                <Grid item xs={5}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt="Icon" src={theTicket.need.imageUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="h4">{theTicket.title}</Typography>}
                      secondary={theTicket.need.child.sayName}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={5}>
                  <ListItem>
                    <AvatarGroup max={4}>
                      {theTicket.contributors.map((p) => (
                        <Tooltip
                          title={`${p.firstName} - ${t(`roles.${getUserSAYRoleString(p.typeId)}`)}`}
                          key={p.id}
                        >
                          <Avatar
                            alt={p.firstName}
                            src={p.avatarUrl}
                            sx={{
                              backgroundColor: (theme) => theme.palette.grey.A200,
                            }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </ListItem>
                </Grid>
                <Grid item xs={2}>
                  <ListItem>
                    <ListItemText
                      primary={<Typography variant="h4">{t('need.status')}</Typography>}
                      secondary={t(`need.needStatus.${getCurrentStatusString(theTicket.need)}`)}
                    />
                  </ListItem>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Scrollbar style={{ height: 'calc(100vh - 445px)' }}>
              <Box p={2}>
                {theTicket &&
                  theTicket.ticketHistory.map((h, index) =>
                    h.from === swInfo.id ? (
                      <Box display="flex" alignItems="start   " flexDirection="row" key={index}>
                        <ListItemAvatar>
                          <Avatar
                            alt="user"
                            src={
                              theTicket.contributors.find((p) => p.flaskId === h.from) &&
                              theTicket.contributors.find((p) => p.flaskId === h.from).avatarUrl
                            }
                          />
                        </ListItemAvatar>
                        <div className="pl-3">
                          <Box
                            mb={1}
                            key={index}
                            sx={{
                              p: 2,
                              backgroundColor: 'primary.light',
                              borderRadius: '6px',
                              color: (theme) =>
                                `${
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(0, 0, 0, 0.87)'
                                    : 'rgba(0, 0, 0, 0.87)'
                                }`,
                            }}
                          >
                            {h.message}
                            <Typography>{moment().diff(moment(h.createdAt), 'minutes')}</Typography>
                          </Box>
                        </div>
                      </Box>
                    ) : (
                      <Box key={index}>
                        {theTicket.ticketHistory.map((v) => (
                          <Box
                            mb={1}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="row-reverse"
                            className="chat-socketContent"
                            key={v}
                          >
                            <Box
                              sx={{
                                p: 2,
                                backgroundColor: 'primary.light',
                                ml: 'auto',
                                borderRadius: '6px',
                                color: (theme) =>
                                  `${
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(0, 0, 0, 0.87)'
                                      : 'rgba(0, 0, 0, 0.87)'
                                  }`,
                              }}
                            >
                              {v.message}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ),
                  )}
              </Box>
            </Scrollbar>
          </div>
        ) : (
          <Box display="flex" alignItems="center" p={2} pb={1} pt={1}>
            <Box
              sx={{
                display: { xs: 'flex', md: 'flex', lg: 'none' },
                mr: '10px',
              }}
            >
              <FeatherIcon icon="menu" width="18" onClick={toggleTicketSidebar} />
            </Box>
            <Typography variant="h4">Select Ticket</Typography>
          </Box>
        )}
      </Box>
    </WebsocketProvider>
  );
};

export default TicketContent;

TicketContent.propTypes = {
  toggleTicketSidebar: PropTypes.func,
};
