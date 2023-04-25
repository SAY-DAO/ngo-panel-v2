import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  ListItem,
  Grid,
  AvatarGroup,
  CardActions,
  CardActionArea,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useAccount, useSigner } from 'wagmi';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useTheme } from '@mui/material/styles';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {
  PaymentStatusEnum,
  NeedTypeEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
  FlaskUserTypesEnum,
  Colors,
  colorChoices,
  AnnouncementEnum,
  SAYPlatformRoles,
} from '../../utils/types';
import ReceiptImage from './ReceiptImage';
import { signTransaction } from '../../redux/actions/blockchainAction';
import DurationTimeLine from './DurationTimeLine';
import { openTicketing, selectTicket } from '../../redux/actions/ticketAction';
import { ADD_TICKET_RESET, UPDATE_TICKET_COLOR_RESET } from '../../redux/constants/ticketConstants';
import TicketConfirmDialog from '../dialogs/TicketConfirmDialog';
import WalletDialog from '../dialogs/WalletDialog';
import WalletButton from '../wallet/WalletButton';
import TicketAnnouncementDialog from '../dialogs/TicketAnnouncementDialog';
import { convertFlaskToSayRoles, prepareUrl, randomIntFromInterval } from '../../utils/helpers';
import WaterWaveText from '../WaterWaveText';
import fetchIpfsMetaData from '../../utils/ipfsHelper';

const TaskCard = ({ need, setCardSelected, cardSelected, handleDialog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: signer } = useSigner();

  const [anchorEl, setAnchorEl] = useState(null);
  const [height, setHeight] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState({
    arrival: false,
    moneyReceived: false,
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [openWallets, setOpenWallets] = useState(false);
  const [needSignatures, setNeedSignatures] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [ipfsMetaData, setIpfsMetaData] = useState();
  const open = Boolean(anchorEl);

  const { address, isConnected } = useAccount();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket, loading: loadingTicketAdd, error: errorTicketAdd } = ticketAdd;

  const myTickets = useSelector((state) => state.myTickets);
  const { isTicketingOpen } = myTickets;

  const { signature, ipfs, loading: loadingSignature } = useSelector((state) => state.signature);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCardClick = () => {
    if (cardSelected === need.id) {
      setCardSelected(0);
    }
    if (cardSelected !== need.id) {
      setCardSelected(need.id);
    }
  };

  // set height on click
  useEffect(() => {
    if (cardSelected === need.id) {
      setHeight(true);
    } else {
      setHeight(false);
    }
  }, [cardSelected]);

  // toast
  useEffect(() => {
    if (errorTicketAdd) {
      setToastOpen(true);
    }
  }, [errorTicketAdd]);

  // when added open tickets
  useEffect(() => {
    if (openConfirm && !isTicketingOpen && addedTicket) {
      dispatch(openTicketing(true));
      dispatch(selectTicket(addedTicket.id));
      setOpenConfirm(false);
    }
  }, [addedTicket]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  // when already has a ticket
  const handleOpenTicketing = (ticketId) => {
    dispatch({ type: UPDATE_TICKET_COLOR_RESET });
    dispatch(openTicketing(true));
    setOpenConfirm(false);
    dispatch(selectTicket(ticketId));
  };

  // close toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignature = () => {
    dispatch(
      signTransaction(
        {
          address,
          flaskNeedId: need.id,
          statuses: need.status_updates,
          receipts: need.receipts_,
          payments: need.payments,
          isDone: need.isDone,
          paid: need.paid,
          unpayable: need.unpayable,
          unpayableFrom: need.unpayable_from,
        },
        signer,
      ),
    );
  };

  const theIpfs = ipfs && ipfs.need.flaskId === need.id && ipfs;

  useEffect(() => {
    if (pageDetails && !completed) {
      setNeedSignatures(
        pageDetails.signatures.filter(
          (s) => s.flaskNeedId === need.id && s.flaskUserId === swInfo.id,
        ),
      );
      setCompleted(true); // to only do this block once
    }
    if (signature && signature.flaskNeedId === need.id) {
      setNeedSignatures([...needSignatures, signature]);
    }
  }, [signature, pageDetails]);

  const handleAnnouncement = (Announcement) => {
    dispatch({ type: ADD_TICKET_RESET });
    if (Announcement === AnnouncementEnum.ARRIVED_AT_NGO) {
      setOpenAnnouncement({
        arrival: true,
        moneyReceived: false,
      });
    }
    if (Announcement === AnnouncementEnum.NGO_RECEIVED_MONEY) {
      setOpenAnnouncement({
        arrival: false,
        moneyReceived: true,
      });
    }
  };

  useEffect(() => {
    if (ipfsMetaData) {
      console.log(ipfsMetaData.child.awakeImage);
    } else if (need.ipfs) {
      const handleIpfs = async () => {
        const result = await fetchIpfsMetaData(need.ipfs.needDetailsHash);
        setIpfsMetaData(result.data);
      };
      handleIpfs();
    }
  }, [ipfsMetaData]);

  return (
    <Box sx={{ opacity: cardSelected === need.id || cardSelected === 0 ? 1 : 0.4 }}>
      {ipfsMetaData && (
        <img
          src={`https://cloudflare-ipfs.com/ipfs/${ipfsMetaData.image.split('ipfs://')[1]}`}
          style={{ maxWidth: '100px' }}
          alt="/>"
        />
      )}
      <Card
        sx={{
          p: 0,
          maxHeight: height ? '1200px' : `${randomIntFromInterval(320, 320)}px`,
          '&:hover': {
            border: 'ridge',
            borderColor: () => (height ? theme.palette.primary.dark : theme.palette.secondary.dark),
          },
          border: 'solid',
          borderColor: () => (height ? theme.palette.primary.dark : theme.palette.secondary.light),
          borderWidth: '0.1em',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background:
                  !need.imageUrl.includes('wrong') && need.child.awakeAvatarUrl
                    ? `url(
                      ${prepareUrl(need.child.awakeAvatarUrl)}
                    )`
                    : `url(${prepareUrl(need.imageUrl)})`,
                '&:hover': {
                  background: `url(${prepareUrl(need.imageUrl)})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                },
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {need.imageUrl.includes('wrong') && (
                <Tooltip title={t('need.tooltip.addIcon')}>
                  <IconButton onClick={() => console.log(true)}>
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box
              sx={{
                ml: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  whiteSpace: 'nowrap',
                  fontSize: 12,
                }}
              >
                {need.child.firstName_translations && need.child.firstName_translations.fa}{' '}
                {need.child.lastName_translations && need.child.lastName_translations.fa}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="200" sx={{ fontSize: 11 }}>
                {need.child.sayname_translations && need.child.sayname_translations.fa}
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <Tooltip title={t('myPage.taskCard.menu.more')}>
                <IconButton
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <FeatherIcon icon="more-horizontal" width="18" />
                </IconButton>
              </Tooltip>
              {pageDetails && (
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {(swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
                    swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
                    <MenuItem onClick={() => navigate(`/children/edit/${need.child.id}`)}>
                      <EditIcon sx={{ ml: 1, mr: 1 }} />
                      {t('myPage.taskCard.menu.updateChild')}
                    </MenuItem>
                  )}
                  {(swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
                    swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
                    <MenuItem>
                      <RouterLink
                        style={{ textDecoration: 'none', color: '#e6e5e8' }}
                        to={`/need/edit/${need.child.id}/${need.id}`}
                      >
                        <EditIcon sx={{ ml: 1, mr: 1 }} />
                        {t('myPage.taskCard.menu.updateٔNeed')}
                      </RouterLink>
                    </MenuItem>
                  )}
                  {need.ticket ? (
                    <MenuItem onClick={() => handleOpenTicketing(need.ticket.id)}>
                      <VisibilityIcon sx={{ ml: 1, mr: 1 }} />
                      {t('myPage.taskCard.menu.readTicket')}
                    </MenuItem>
                  ) : (
                    !need.ipfs && (
                      <MenuItem onClick={() => handleOpenConfirm()}>
                        <FlagOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                        {t('myPage.taskCard.menu.addTicket')}
                      </MenuItem>
                    )
                  )}
                  {swInfo.id === need.created_by_id &&
                    (!need.ticket ||
                      (need.ticket &&
                        need.ticket.lastAnnouncement !== AnnouncementEnum.ARRIVED_AT_NGO &&
                        need.ticket.lastAnnouncement !== AnnouncementEnum.NGO_RECEIVED_MONEY)) &&
                    (need.type === NeedTypeEnum.PRODUCT &&
                    need.status === ProductStatusEnum.PURCHASED_PRODUCT ? (
                      <MenuItem onClick={() => handleAnnouncement(AnnouncementEnum.ARRIVED_AT_NGO)}>
                        <CampaignOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                        {t('myPage.taskCard.menu.deliveryTicket')}
                      </MenuItem>
                    ) : (
                      need.type === NeedTypeEnum.SERVICE &&
                      need.status === ServiceStatusEnum.MONEY_TO_NGO && (
                        <MenuItem
                          onClick={() => handleAnnouncement(AnnouncementEnum.NGO_RECEIVED_MONEY)}
                        >
                          <CampaignOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                          {t('myPage.taskCard.menu.moneyToNgoTicket')}
                        </MenuItem>
                      )
                    ))}
                </Menu>
              )}
            </Box>
          </Box>
        </CardContent>
        <CardActionArea onClick={handleCardClick}>
          <CardContent
            sx={{
              p: '20px',
              pt: 0,
            }}
          >
            <Grid container>
              <Grid item xs={10}>
                <Tooltip arrow title={need.informations} placement="right">
                  <Typography
                    color="textSecondary"
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      mb: 1,
                    }}
                  >
                    {need.name_translations.fa}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <>
                  {need.ticket && (
                    <Box
                      sx={{
                        textAlign: 'center',
                        backgroundColor:
                          need.ticket.color === Colors.YELLOW
                            ? () => theme.palette.background.ripple
                            : '',
                        animation:
                          need.ticket.color === Colors.YELLOW
                            ? 'ripple 1.4s  infinite ease-in-out'
                            : '',

                        borderRadius: '50%',
                        '@keyframes ripple': {
                          '0%': {
                            transform: 'scale(.7)',
                            opacity: 0.7,
                          },
                          '100%': {
                            transform: 'scale(0.8)',
                            opacity: 1,
                          },
                        },
                        height: '40px',
                        width: '40px',
                        paddingTop: '7px',
                      }}
                    >
                      <FlagOutlinedIcon
                        sx={{
                          color:
                            need.ticket.color === Colors.YELLOW
                              ? colorChoices[1].code
                              : colorChoices[0].code,
                        }}
                      />
                      <Box
                        sx={{
                          textAlign: 'center',

                          borderRadius: '50%',
                          '@keyframes ripple': {
                            '0%': {
                              transform: 'scale(.7)',
                              opacity: 0.7,
                            },
                            '100%': {
                              transform: 'scale(0.8)',
                              opacity: 1,
                            },
                          },
                          height: '40px',
                          width: '40px',
                          paddingTop: '7px',
                        }}
                      >
                        {need.ticket.lastAnnouncement === AnnouncementEnum.ARRIVED_AT_NGO && (
                          <CampaignOutlinedIcon />
                        )}
                        {need.ticket.lastAnnouncement === AnnouncementEnum.NGO_RECEIVED_MONEY && (
                          <CampaignOutlinedIcon />
                        )}
                      </Box>
                    </Box>
                  )}
                  {need.ipfs && <WaterWaveText hash={need.ipfs && need.ipfs.needDetailsHash} />}
                </>
              </Grid>
            </Grid>
            {/* 
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {t('myPage.taskCard.paid')}: {need.paid.toLocaleString()}
            </Typography> */}
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {t('myPage.taskCard.cost')}: {need._cost.toLocaleString()}
            </Typography>
            <Grid container>
              {need.affiliateLinkUrl && need.affiliateLinkUrl !== 'null' && (
                <Typography color="textSecondary" variant="span" fontWeight="400">
                  {t('myPage.taskCard.provider')}:
                  <Link
                    href={need.affiliateLinkUrl}
                    sx={{ pl: 1, pr: 1 }}
                    underline="none"
                    target="_blank"
                  >
                    Affiliate
                  </Link>
                </Typography>
              )}
              {need.link && (
                <Typography color="textSecondary" variant="span" fontWeight="400" sx={{ pb: 1 }}>
                  {t('myPage.taskCard.provider')}:
                  <Link href={need.link} underline="none" sx={{ pl: 1, pr: 1 }} target="_blank">
                    Link
                  </Link>
                </Typography>
              )}
            </Grid>
            <Grid>
              {need.receipts_ && need.receipts_[0] ? (
                <AvatarGroup>
                  {need.receipts_.map((r) => (
                    <ReceiptImage receipt={r.receipt[0]} key={r.id} />
                  ))}
                </AvatarGroup>
              ) : (
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  {t('myPage.taskCard.noReceipt')}
                </Typography>
              )}
            </Grid>
          </CardContent>

          <Box sx={{ position: 'relative' }}>
            <ListItem
              sx={{
                position: 'absolute',
              }}
            >
              {need.type === NeedTypeEnum.PRODUCT &&
                need.status < ProductStatusEnum.PURCHASED_PRODUCT &&
                need.unpayable && (
                  <Chip
                    sx={{
                      color: '#000000',
                      backgroundColor: '#ff0000',
                    }}
                    label="unpayable"
                    size="small"
                  />
                )}
              {!need.isConfirmed && (
                <Chip
                  sx={{
                    color: '#000000',
                    backgroundColor: '#ff0000',
                  }}
                  label="Not Confirmed"
                  size="small"
                />
              )}
            </ListItem>
            <ListItem
              sx={{
                mt: (need.unpayable || !need.isConfirmed) && '30px',
                position: 'absolute',
              }}
            >
              <Chip
                sx={{
                  color: '#000000',
                  backgroundColor: need.type === NeedTypeEnum.PRODUCT ? '#9d59a8' : '#5888e3',
                }}
                label={need.type === NeedTypeEnum.PRODUCT ? 'Product' : 'Service'}
                size="small"
              />
              <Chip
                sx={{
                  m: 1,
                  color: '#000000',
                  backgroundColor:
                    need.status === PaymentStatusEnum.PARTIAL_PAY
                      ? '#ddf96a'
                      : need.status === PaymentStatusEnum.COMPLETE_PAY
                      ? '#00ffb8'
                      : need.status === PaymentStatusEnum.NOT_PAID
                      ? '#f331a6'
                      : '#00ffb8',
                }}
                label={
                  need.status === PaymentStatusEnum.PARTIAL_PAY
                    ? 'Partial Pay'
                    : need.status === PaymentStatusEnum.NOT_PAID
                    ? 'Not Paid'
                    : 'Complete Pay'
                }
                size="small"
              />
            </ListItem>
            {((need.type === NeedTypeEnum.PRODUCT && need.status === ProductStatusEnum.DELIVERED) ||
              (need.type === NeedTypeEnum.SERVICE &&
                need.status === ServiceStatusEnum.DELIVERED)) && (
              <ListItem
                sx={{
                  mt: '40px',
                  position: 'absolute',
                }}
              >
                <Chip
                  sx={{
                    color: '#000000',
                    backgroundColor: '#1bf500',
                  }}
                  label="Delivered"
                  size="small"
                />
              </ListItem>
            )}
            {need.type === NeedTypeEnum.SERVICE &&
              need.status === ServiceStatusEnum.MONEY_TO_NGO && (
                <ListItem
                  sx={{
                    mt: '40px',
                    position: 'absolute',
                  }}
                >
                  <Chip
                    sx={{
                      color: '#000000',
                      backgroundColor: '#ff9800',
                    }}
                    label="Money to NGO"
                    size="small"
                  />
                </ListItem>
              )}
            {need.type === NeedTypeEnum.PRODUCT ? (
              <img
                style={{ opacity: '50%', minHeight: '100px' }}
                srcSet={`${need.img} 1x, ${need.img} 2x`}
                alt={need.img}
                width="100%"
              />
            ) : (
              <Grid sx={{ mb: 4, minHeight: '100px', width: '100%' }} />
            )}

            {/* dates */}
            <Grid container sx={{ p: 0 }}>
              <Grid item xs={12}>
                <DurationTimeLine need={need} />
              </Grid>
            </Grid>
          </Box>
        </CardActionArea>
        <CardActions>
          {!need.isConfirmed &&
            convertFlaskToSayRoles(swInfo.typeId) === SAYPlatformRoles.AUDITOR && (
              <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
                <LoadingButton
                  disabled={
                    swInfo.typeId === FlaskUserTypesEnum.SOCIAL_WORKER ||
                    swInfo.typeId === FlaskUserTypesEnum.NGO_SUPERVISOR
                  }
                  onClick={() => handleDialog(need)}
                >
                  {t('button.confirm')}
                </LoadingButton>
              </Grid>
            )}
          {need.status === ProductStatusEnum.DELIVERED && (
            <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
              <Tooltip
                title={
                  <>
                    <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                      {t('wallet.signatureInformation.top')}
                    </Typography>
                    <Typography component="li" sx={{ fontSize: 10 }}>
                      {t('wallet.signatureInformation.1')} {t('wallet.signatureInformation.2')}
                    </Typography>
                    <Typography component="li" sx={{ fontSize: 10 }}>
                      {t('wallet.signatureInformation.3')}
                    </Typography>
                  </>
                }
              >
                <IconButton>
                  <HelpRoundedIcon />
                </IconButton>
              </Tooltip>

              {!isConnected ? (
                <WalletButton fullWidth variant="outlined" onClick={() => setOpenWallets(true)}>
                  {t('button.wallet.connect')}
                </WalletButton>
              ) : needSignatures && needSignatures[0] ? (
                needSignatures.map((s) => <Typography key={s.id}>{s.hash}</Typography>)
              ) : (
                isConnected &&
                (!theIpfs || (ipfs && ipfs.need && ipfs.need.flaskId !== need.id)) && (
                  <LoadingButton loading={loadingSignature} onClick={handleSignature}>
                    {t('button.wallet.sign')}
                  </LoadingButton>
                )
              )}
            </Grid>
          )}
        </CardActions>
      </Card>
      {openConfirm && (
        <TicketConfirmDialog
          openConfirm={openConfirm}
          setOpenConfirm={setOpenConfirm}
          loading={loadingTicketAdd}
          need={need}
        />
      )}
      {openAnnouncement && (
        <TicketAnnouncementDialog
          openAnnouncement={openAnnouncement}
          setOpenAnnouncement={setOpenAnnouncement}
          loading={loadingTicketAdd}
          need={need}
        />
      )}
      <WalletDialog openWallets={openWallets} setOpenWallets={setOpenWallets} />

      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
          <Alert
            onClose={handleCloseToast}
            variant="filled"
            severity="error"
            sx={{ width: '100%' }}
          >
            {errorTicketAdd && errorTicketAdd.data.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  need: PropTypes.object,
  setCardSelected: PropTypes.func,
  handleDialog: PropTypes.func,
  cardSelected: PropTypes.number,
};
