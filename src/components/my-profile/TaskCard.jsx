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
  Badge,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import {
  PaymentStatusEnum,
  NeedTypeEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
  RolesEnum,
} from '../../utils/types';
import ReceiptImage from './ReceiptImage';
import { connectWallet, signTransaction } from '../../redux/actions/blockchainAction';
import DurationTimeLine from './DurationTimeLine';
import FullScreenDialog from '../dialogs/FullScreenDialog';
import { addTicket, fetchTicketList, selectTicket } from '../../redux/actions/ticketAction';
import { ADD_TICKET_RESET } from '../../redux/constants/ticketConstants';
import TicketConfirmDialog from '../dialogs/TicketConfirmDialog';

const TaskCard = ({ need, setCardSelected, cardSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [height, setHeight] = useState(false);
  const [openTicket, setOpenTicket] = useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  const wallet = useSelector((state) => state.wallet);
  const { myWallet } = wallet;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket, loading: loadingTicketAdd, error: errorTicketAdd } = ticketAdd;

  const open = Boolean(anchorEl);
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

  // when confirm get all tickets & select the added one
  useEffect(() => {
    if (openConfirm && !openTicket && addedTicket) {
      dispatch(selectTicket(addedTicket.id));
      dispatch(fetchTicketList());
      setOpenTicket(true);
    }
  }, [addedTicket]);

  // when added open tickets
  useEffect(() => {
    if (openConfirm && !openTicket && addedTicket) {
      dispatch(selectTicket(addedTicket.id));
      setOpenTicket(true);
      setOpenConfirm(false);
    }
  }, [addedTicket]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
    dispatch({ type: ADD_TICKET_RESET });
  };
  // when already has a ticket
  const handleOpenTicketing = (ticketId) => {
    setOpenTicket(true);
    setOpenConfirm(false);
    dispatch(selectTicket(ticketId));
  };

  const handleConfirm = (selectedRoles) => {
    console.log({
      roles: selectedRoles,
      title: need.name,
      userId: pageDetails.userId,
      ngoId: pageDetails.ngoId,
      needId: need.id,
      need,
    });
    dispatch(
      addTicket({
        title: need.name,
        userId: pageDetails.userId,
        ngoId: pageDetails.ngoId,
        needId: need.id,
        need,
      }),
    );
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
  const handleWallet = () => {
    dispatch(connectWallet());
  };
  const handleSignature = () => {
    dispatch(signTransaction(need));
  };

  return (
    <Box sx={{ opacity: cardSelected === need.id || cardSelected === 0 ? 1 : 0.4 }}>
      <Card
        sx={{
          p: 0,
          maxHeight: height ? '1200px' : '320px',
          '&:hover': {
            border: 'ridge',
            borderColor: (theme) =>
              height ? theme.palette.primary.dark : theme.palette.secondary.dark,
          },
          border: 'solid',
          borderColor: (theme) =>
            height ? theme.palette.primary.dark : theme.palette.secondary.light,
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
                background: need.child.awakeAvatarUrl
                  ? `url(${need.child.awakeAvatarUrl})`
                  : `url(${need.imageUrl})`,
                '&:hover': {
                  background: `url(${need.imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                },
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
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
                {need.child.firstName} {need.child.lastName}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="200" sx={{ fontSize: 11 }}>
                {need.child.sayName}
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <Tooltip title="Edit">
                <IconButton
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <Badge
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    badgeContent={5}
                    color="secondary"
                  >
                    <FeatherIcon icon="more-horizontal" width="18" />
                  </Badge>
                </IconButton>
              </Tooltip>
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
                {(pageDetails.typeId === RolesEnum.ADMIN ||
                  pageDetails.typeId === RolesEnum.SUPER_ADMIN) && (
                  <MenuItem onClick={() => navigate(`/children/edit/${need.child.id}`)}>
                    {t('myPage.taskCard.menu.updateChild')}
                  </MenuItem>
                )}
                {(pageDetails.typeId === RolesEnum.ADMIN ||
                  pageDetails.typeId === RolesEnum.SUPER_ADMIN) && (
                  <MenuItem onClick={() => navigate(`/need/edit/${need.child.id}/${need.id}`)}>
                    {t('myPage.taskCard.menu.updateٔNeed')}
                  </MenuItem>
                )}
                {need.ticket || (addedTicket && addedTicket.need.flaskId === need.id) ? (
                  <MenuItem
                    onClick={() =>
                      need.ticket
                        ? handleOpenTicketing(need.ticket.id)
                        : handleOpenTicketing(addedTicket.id)
                    }
                  >
                    {t('myPage.taskCard.menu.readTicket')}
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => handleOpenConfirm()}>
                    {t('myPage.taskCard.menu.addTicket')}
                  </MenuItem>
                )}
              </Menu>
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
                <Typography
                  color="textSecondary"
                  variant="h5"
                  fontWeight="600"
                  sx={{
                    mb: 1,
                  }}
                >
                  {need.name}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                {(need.ticket || (addedTicket && addedTicket.need.flaskId === need.id)) && (
                  <Box>
                    <FlagIcon />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {t('myPage.taskCard.paid')}: {need.paid.toLocaleString()}
            </Typography>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {t('myPage.taskCard.cost')}: {need.cost.toLocaleString()}
            </Typography>
            <Grid>
              {need.receipts_ && need.receipts_[0] ? (
                <AvatarGroup>
                  {need.receipts_.map((r) => (
                    <ReceiptImage receipt={r} key={r.id} />
                  ))}
                </AvatarGroup>
              ) : (
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  {t('myPage.taskCard.noReceipt')}
                </Typography>
              )}
            </Grid>
          </CardContent>

          <Grid container>
            {need.affiliateLinkUrl && (
              <Link href={need.affiliateLinkUrl} underline="none" target="_blank">
                <Typography
                  color="textSecondary"
                  variant="span"
                  fontWeight="400"
                  sx={{ textAlign: 'center', p: 1 }}
                >
                  Affiliate
                </Typography>
              </Link>
            )}
            {need.link && (
              <Link href={need.link} underline="none" target="_blank">
                <Typography
                  color="textSecondary"
                  variant="span"
                  fontWeight="400"
                  sx={{ textAlign: 'center', p: 1 }}
                >
                  Link
                </Typography>
              </Link>
            )}
          </Grid>

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
            <img
              style={{ opacity: '50%', minHeight: '100px' }}
              srcSet={`${need.img} 1x, ${need.img} 2x`}
              alt={need.img}
              width="100%"
            />
            {/* dates */}
            <Grid container sx={{ p: 0 }}>
              <Grid item xs={12}>
                <DurationTimeLine need={need} />
              </Grid>
            </Grid>
            <Grid container>
              {need.updated && (
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    <strong>{t('myPage.taskCard.date.updated')}:</strong>
                    {moment().diff(moment(need.updated), 'days')}{' '}
                    {t('myPage.taskCard.date.daysAgo')}
                    <br />
                  </Typography>
                </Grid>
              )}

              {need.ngoDeliveryDate && (
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    <strong>{t('myPage.taskCard.date.ngoDelivery')}: </strong>
                    {moment().diff(moment(need.ngoDeliveryDate), 'days')}{' '}
                    {t('myPage.taskCard.date.daysAgo')}
                    <br />
                  </Typography>
                </Grid>
              )}
              {need.childDeliveryDate && (
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    <strong>{t('myPage.taskCard.date.childDelivery')}: </strong>
                    {moment().diff(moment(need.childDeliveryDate), 'days')}{' '}
                    {t('myPage.taskCard.date.daysAgo')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardActionArea>
        <CardActions>
          <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
            {!myWallet ? (
              <LoadingButton onClick={handleWallet}>Connect Wallet</LoadingButton>
            ) : (
              <LoadingButton onClick={handleSignature}>Sign</LoadingButton>
            )}
          </Grid>
        </CardActions>
      </Card>
      <TicketConfirmDialog
        openConfirm={openConfirm}
        setOpenConfirm={setOpenConfirm}
        handleConfirm={handleConfirm}
        loading={loadingTicketAdd}
        need={need}
      />
      <FullScreenDialog openTicket={openTicket} setOpenTicket={setOpenTicket} />
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
  cardSelected: PropTypes.number,
};
