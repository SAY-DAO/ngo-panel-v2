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
  Card,
  LinearProgress,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Scrollbar from '../custom-scroll/Scrollbar';
import { convertFlaskToSayRoles, getSAYRoleString, prepareUrl } from '../../utils/helpers';
import { socketHttp, WebsocketProvider } from '../../contexts/WebsocketContext';
import {
  AnnouncementEnum,
  colorChoices,
  SAYPlatformRoles,
  PanelContributors,
} from '../../utils/types';
import { dateTimeConvertor } from '../../utils/persianToEnglish';
import { socketChangeTicketColor } from '../../utils/socketHelpers';
import DurationTimeLine from '../my-profile/DurationTimeLine';
import ReportStatusChange from '../report/ReportStatusChange';
import StatusDialog from '../dialogs/ReportStatusDialog';
import { fetchChildOneNeed } from '../../redux/actions/needsAction';

const TicketContent = ({ toggleTicketSidebar }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [theTicket, setTheTicket] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusNeed, setStatusNeed] = useState();
  const [theNeed, setTheNeed] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicketId } = myTickets;

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket, loading: loadingTicket } = ticketById;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket, loading: loadingTicketUpdated } = ticketUpdate;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket } = ticketAdd;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed, loading: loadingOneNeed } = childOneNeed;

  const needStatusUpdate = useSelector((state) => state.needStatusUpdate);
  const { success: SuccessStatusUpdate } = needStatusUpdate;

  // set ticket
  useEffect(() => {
    if (fetchedTicket) {
      setTheTicket(fetchedTicket);
    }
  }, [currentTicketId, addedTicket, fetchedTicket]);

  // get recently updated need for status change
  useEffect(() => {
    if (
      (theTicket && !oneNeed) ||
      (theTicket && oneNeed && oneNeed.id !== theTicket.need.flaskId)
    ) {
      dispatch(fetchChildOneNeed(theTicket.need.flaskId));
    }
  }, [theTicket, theNeed, SuccessStatusUpdate]);

  // set need for status change
  useEffect(() => {
    setTheNeed();
    if (theTicket && oneNeed && oneNeed.id === theTicket.need.flaskId) {
      setTheNeed(oneNeed);
    }
  }, [oneNeed, theTicket]);

  useEffect(() => {
    if (SuccessStatusUpdate) {
      setStatusDialog(false);
      setStatusNeed(false);
    }
  }, [SuccessStatusUpdate]);

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
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item xs={9} md={4}>
                  <Card elevation={5} sx={{ p: 0 }}>
                    <ListItem>
                      <Grid container justifyContent="space-between">
                        <Grid item xs={6}>
                          <ListItemAvatar>
                            {theNeed && (
                              <Tooltip title={<DurationTimeLine need={theNeed} />}>
                                <Avatar alt="Icon" src={theNeed.imageUrl} />
                              </Tooltip>
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="h6">{theTicket.need.name}</Typography>}
                            secondary={theTicket.need.child.sayNameTranslations.fa}
                          />
                          <RouterLink
                            style={{ textDecoration: 'none', color: '#e6e5e8', display: `flex` }}
                            to={`/need/edit/${theTicket.need.child.flaskId}/${theTicket.need.flaskId}`}
                            target="_blank"
                          >
                            <EditIcon sx={{ width: 20, height: 20, mr: 1 }} />
                            <Typography color="primary">
                              {t('myPage.taskCard.menu.updateٔNeed')}
                            </Typography>
                          </RouterLink>
                        </Grid>
                        <Grid item xs={6} sx={{ m: 'auto' }}>
                          {loadingTicket || loadingOneNeed || !theNeed ? (
                            <LinearProgress size="small" sx={{ width: '30px' }} />
                          ) : (
                            <ReportStatusChange
                              need={theNeed}
                              setStatusDialog={setStatusDialog}
                              setStatusNeed={setStatusNeed}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Card>
                </Grid>
                {lgUp && (
                  <Grid item lg={5}>
                    <ListItem>
                      <AvatarGroup max={4}>
                        {theTicket.contributors.map((c) => (
                          <Tooltip
                            title={`${c.firstName} - ${t(
                              `roles.${getSAYRoleString(
                                theTicket.need.socialWorker.flaskUserId === c.flaskUserId
                                  ? PanelContributors.SOCIAL_WORKER
                                  : (theTicket.need.auditor &&
                                      theTicket.need.auditor.flaskUserId === c.flaskUserId) ||
                                    !theTicket.need.auditor
                                  ? PanelContributors.AUDITOR
                                  : theTicket.need.purchaser &&
                                    theTicket.need.purchaser.flaskUserId === c.flaskUserId &&
                                    PanelContributors.PURCHASER,
                              )}`,
                            )}`}
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
                <Grid item xs sx={{ textAlign: 'right' }}>
                  {convertFlaskToSayRoles(swInfo.typeId) === SAYPlatformRoles.AUDITOR &&
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
            {!theTicket ? (
              <Grid container>
                <CircularProgress sx={{ textAlign: 'center', m: 'auto' }} />
              </Grid>
            ) : (
              <Scrollbar
                style={{
                  // for keeping scroll down
                  height: lgUp && 'calc(100vh - 445px)',
                  transform: lgUp && 'rotateX(180deg)',
                  MozTransform: lgUp && 'rotateX(180deg)' /* Mozilla */,
                  WebkitTransform: lgUp && 'rotateX(180deg)' /* Safari and Chrome */,
                  MsTransform: lgUp && 'rotateX(180deg)' /* IE 9+ */,
                  OTransform: lgUp && 'rotateX(180deg)' /* Opera */,
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
                    theTicket.ticketHistories &&
                    theTicket.ticketHistories
                      .sort((a, b) => {
                        return b.createdAt - a.createdAt;
                      })
                      .map((h) =>
                        h.from !== swInfo.id ? (
                          <Box display="flex" alignItems="start" flexDirection="row" key={h.id}>
                            <ListItemAvatar>
                              <Avatar
                                alt="user"
                                src={
                                  theTicket.contributors.find((p) => p.flaskUserId === h.from) &&
                                  prepareUrl(
                                    theTicket.contributors.find((p) => p.flaskUserId === h.from)
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
                                {h.announcement === AnnouncementEnum.ARRIVED_AT_NGO && (
                                  <CampaignIcon sx={{ mb: 0, mr: 1 }} />
                                )}
                                {h.message}

                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'gray', fontSize: 12 }}
                                >
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
                                {h.announcement === AnnouncementEnum.ARRIVED_AT_NGO && (
                                  <CampaignIcon sx={{ mb: 0, mr: 1 }} />
                                )}
                                {h.announcement === AnnouncementEnum.NGO_RECEIVED_MONEY && (
                                  <CampaignIcon sx={{ mb: 0, mr: 1 }} />
                                )}
                                {h.message}

                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'gray', fontSize: 12 }}
                                >
                                  {/* {moment().diff(moment(h.createdAt), 'minutes')} */}
                                  {dateTimeConvertor(h.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ),
                      )}
                </Box>
                {statusNeed && (
                  <StatusDialog
                    need={statusNeed}
                    statusDialog={statusDialog}
                    setStatusDialog={setStatusDialog}
                    setStatusNeed={setStatusNeed}
                  />
                )}
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
