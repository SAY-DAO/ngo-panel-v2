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
  useMediaQuery,
  Fab,
  CircularProgress,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Scrollbar from '../custom-scroll/Scrollbar';
import { getCurrentStatusString, getSAYRoleString, prepareUrl } from '../../utils/helpers';
import { socketHttp, WebsocketProvider } from '../../contexts/WebsocketContext';
import { colorChoices } from '../../utils/types';
import { dateTimeConvertor } from '../../utils/persianToEnglish';
import { socketChangeTicketColor } from '../../utils/socketHelpers';
import DurationTimeLine from '../my-profile/DurationTimeLine';

const TicketContent = ({ toggleTicketSidebar }) => {
  const { t } = useTranslation();

  const [theTicket, setTheTicket] = useState(null);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket, tickets } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { socketContent } = ticketMsgAdd;

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket } = ticketById;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket, loading: loadingTicketUpdated } = ticketUpdate;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket } = ticketAdd;

  // set ticket
  useEffect(() => {
    if (tickets) {
      setTheTicket(tickets.find((tik) => tik.id === currentTicket));
    }
  }, [currentTicket, addedTicket, tickets]);

  // set ticket when socket msg received
  useEffect(() => {
    if (socketContent && tickets) {
      const modifiedTickets = tickets.map((ticket) =>
        ticket.id === socketContent.content.ticket.id
          ? { ...ticket, ...ticket.ticketHistory.push(socketContent.content) }
          : ticket,
      );
      setTheTicket(modifiedTickets.find((tik) => tik.id === currentTicket));
    }
  }, [socketContent, tickets]);

  const handleTicketUpdate = (choice) => {
    socketChangeTicketColor(theTicket.id, swInfo.id, choice.color);
  };
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
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
              <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={6} md={2}>
                  <ListItem>
                    <ListItemAvatar>
                      <Tooltip title={<DurationTimeLine need={theTicket.need} />}>
                        <Avatar alt="Icon" src={prepareUrl(theTicket.need.imageUrl)} />
                      </Tooltip>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="h6">{theTicket.need.name}</Typography>}
                      secondary={theTicket.need.child.sayNameTranslations.fa}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6} md={3}>
                  <ListItem>
                    <ListItemText
                      primary={<Typography variant="h4">{t('need.status')}</Typography>}
                      secondary={t(`need.needStatus.${getCurrentStatusString(theTicket.need)}`)}
                    />
                  </ListItem>
                </Grid>
                {lgUp && (
                  <Grid item lg={5}>
                    <ListItem>
                      <AvatarGroup max={4}>
                        {theTicket.contributors.map((c) => (
                          <Tooltip
                            title={`${c.firstName} - ${t(`roles.${getSAYRoleString(c.role)}`)}`}
                            key={c.id}
                          >
                            <Avatar
                              alt={c.firstName}
                              src={prepareUrl(c.avatarUrl)}
                              sx={{
                                backgroundColor: (theme) => theme.palette.grey.A200,
                              }}
                            />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    </ListItem>
                  </Grid>
                )}
                <Grid item xs={12} md={2} sx={{ textAlign: 'left' }}>
                  {theTicket.flaskUserId === swInfo.id &&
                    colorChoices.map((choice) => (
                      <Fab
                        color="primary"
                        style={{ backgroundColor: choice.code }}
                        sx={{
                          marginTop: !lgUp ? '3px' : 0,
                          marginRight: !lgUp ? 0 : '3px',
                          width: lgUp ? '40px' : '30px',
                          height: lgUp ? '40px' : '30px',
                          color: 'black',
                          m: '5px',
                        }}
                        key={choice.color}
                        onClick={() => handleTicketUpdate(choice)}
                      >
                        {loadingTicketUpdated ? (
                          <CircularProgress size={20} />
                        ) : (updatedTicket || fetchedTicket) &&
                          (updatedTicket || fetchedTicket).color === choice.color ? (
                          <FeatherIcon icon="check" size="24" />
                        ) : (
                          ''
                        )}
                      </Fab>
                    ))}
                </Grid>
              </Grid>
            </Box>
            <Divider />
            {!tickets ? (
              <Grid container>
                <CircularProgress sx={{ textAlign: 'center', m: 'auto' }} />
              </Grid>
            ) : (
              <Scrollbar
                style={{
                  // for keeping scroll down
                  height: 'calc(100vh - 445px)',
                  transform: 'rotateX(180deg)',
                  MozTransform: 'rotateX(180deg)' /* Mozilla */,
                  WebkitTransform: 'rotateX(180deg)' /* Safari and Chrome */,
                  msTransform: 'rotateX(180deg)' /* IE 9+ */,
                  OTransform: 'rotateX(180deg)' /* Opera */,
                }}
              >
                <Box
                  p={2}
                  sx={{
                    // for keeping scroll down
                    transform: lgUp && 'rotateX(180deg)',
                    MozTransform: lgUp && 'rotateX(180deg)' /* Mozilla */,
                    WebkitTransform: lgUp && 'rotateX(180deg)' /* Safari and Chrome */,
                    MsTransform: lgUp && 'rotateX(180deg)' /* IE 9+ */,
                    OTransform: lgUp && 'rotateX(180deg)' /* Opera */,
                  }}
                >
                  {theTicket &&
                    theTicket.ticketHistory.map((h) =>
                      h.from !== swInfo.id ? (
                        <Box display="flex" alignItems="start" flexDirection="row" key={h.id}>
                          <ListItemAvatar>
                            <Avatar
                              alt="user"
                              src={
                                theTicket.contributors.find((p) => p.flaskId === h.from) &&
                                prepareUrl(
                                  theTicket.contributors.find((p) => p.flaskId === h.from)
                                    .avatarUrl,
                                )
                              }
                              sx={{ backgroundColor: (theme) => theme.palette.grey[600] }}
                            />
                          </ListItemAvatar>
                          <div className="pl-3">
                            <Box
                              mb={1}
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
                              <Typography variant="subtitle2" sx={{ color: 'gray', fontSize: 12 }}>
                                {/* {moment().diff(moment(h.createdAt), 'minutes')} */}
                                {dateTimeConvertor(h.createdAt)}
                              </Typography>
                            </Box>
                          </div>
                        </Box>
                      ) : (
                        <Box key={h.id + 1}>
                          <Box
                            mb={1}
                            display="flex"
                            alignItems="flex-end"
                            flexDirection="row-reverse"
                            className="chat-socketContent"
                            key={h.id}
                          >
                            <Box
                              sx={{
                                p: 2,
                                backgroundColor: 'secondary.light',
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
                              {h.message}
                              <Typography variant="subtitle2" sx={{ color: 'gray', fontSize: 12 }}>
                                {/* {moment().diff(moment(h.createdAt), 'minutes')} */}
                                {dateTimeConvertor(h.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ),
                    )}
                </Box>
              </Scrollbar>
            )}
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
