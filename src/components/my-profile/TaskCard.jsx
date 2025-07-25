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
  CircularProgress,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useAccount, useConnect, useWalletClient, useSignMessage } from 'wagmi';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useTheme } from '@mui/material/styles';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DatasetLinkedOutlinedIcon from '@mui/icons-material/DatasetLinkedOutlined';
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
import {
  convertFlaskToSayRoles,
  daysDifference,
  getCategoryString,
  isUnpayable,
  prepareUrl,
  randomIntFromInterval,
} from '../../utils/helpers';
import WaterWaveText from '../WaterWaveText';
import fetchIpfsMetaData from '../../utils/ipfsHelper';
import signatureIcon from '../../resources/images/signature.svg';
import GenericDialog from '../dialogs/GenericDialog';
import { NEST_GRACE_PERIOD } from '../../utils/configs';
import { deleteNeed } from '../../redux/actions/needsAction';
import collaborators from '../../utils/temp';

function CircularProgressWithLabel(props) {
  const { t } = useTranslation();
  return (
    <Tooltip
      arrow
      title={
        <Typography sx={{ fontSize: 12 }}>
          {t('need.tooltip.deleteTimer')}
          {'  '}
          {(
            NEST_GRACE_PERIOD - daysDifference(props.need.tickets[0].updatedAt, new Date())
          ).toFixed(2)}{' '}
          {t('myPage.days')}
        </Typography>
      }
      placement="right-end"
      sx={{ width: '100%' }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            width: '40px !important',
            height: '40px !important',
            color: '#dd3976',
            borderRadius: 50,
            border: '1px solid gray',
          }}
          {...props}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FlagOutlinedIcon
            sx={{
              color:
                props.need.tickets[0].color === Colors.YELLOW
                  ? colorChoices[1].code
                  : props.need.tickets[0].color === Colors.BLUE
                  ? colorChoices[0].code
                  : colorChoices[2].code,
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
  need: PropTypes.any.isRequired,
};

const TaskCard = ({
  need,
  setCardSelected,
  cardSelected,
  handleDialog,
  // loadingEthereumSignature,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();

  const [progress, setProgress] = useState(0);
  const [dialogValues, setDialogValues] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [deletedId, setDeletedId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState({
    arrival: false,
    moneyReceived: false,
  });
  const [thisCardSignature, setThisCardSignature] = useState();
  const [openWallets, setOpenWallets] = useState(false);
  const [needSignatures, setNeedSignatures] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [ipfsMetaData, setIpfsMetaData] = useState();
  const open = Boolean(anchorEl);

  const { chain, address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { isLoading, pendingConnector } = useConnect();
  const { isLoading: isLoadingSignIn } = useSignMessage();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket, loading: loadingTicketAdd } = ticketAdd;

  const myTickets = useSelector((state) => state.myTickets);
  const { isTicketingOpen } = myTickets;

  const needConfirm = useSelector((state) => state.needConfirm);
  const { loading: loadingConfirm } = needConfirm;

  const childNeedsDuplicates = useSelector((state) => state.childNeedsDuplicates);
  const { loading: loadingDuplicates } = childNeedsDuplicates;

  const { signature, ipfs, loading: loadingSignature } = useSelector((state) => state.signature);
  // const { verification } = useSelector((state) => state.signaturesVerification);

  const { loading: loadingInformation } = useSelector((state) => state.walletInformation);

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { deleted } = childOneNeed;
  // const { userSignatures } = useSelector((state) => state.signatures);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // set card signature
  useEffect(() => {
    if (signature && signature.flaskNeedId === need.id) {
      setThisCardSignature(signature);
    }
  }, [signature]);

  useEffect(() => {
    if (pageDetails && !completed) {
      setNeedSignatures(need.signatures);
      setCompleted(true); // to only do this block once<too
    }
    if (signature && signature.flaskNeedId === need.id) {
      setNeedSignatures([...needSignatures, signature]);
    }
  }, [signature, pageDetails]);

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
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [cardSelected]);

  // after page changes reset the clicked card
  useEffect(() => {
    if (pageDetails) setCardSelected(0);
  }, [pageDetails]);

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignature = async () => {
    dispatch(
      signTransaction(
        {
          address,
          flaskNeedId: need.id,
          statuses: need.status_updates,
          receipts: need.receipts_,
          payments: need.payments,
        },
        walletClient,
        chain.id,
        pageDetails.meta.purchased,
      ),
    );
  };

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

  useEffect(() => {
    if (deleted && deleted.id === need.id) {
      setDeletedId(deleted.id);
    }
  }, [deleted]);

  useEffect(() => {
    if (need.tickets && need.tickets[0]) {
      setProgress(() =>
        daysDifference(need.tickets[0].updatedAt, new Date()) > NEST_GRACE_PERIOD
          ? 100
          : (daysDifference(need.tickets[0].updatedAt, new Date()) * 100) / NEST_GRACE_PERIOD,
      );
    }
  }, []);

  useEffect(() => {
    if (
      process.env === 'production' &&
      need.tickets[0] &&
      daysDifference(need.tickets[0].updatedAt, new Date()) > NEST_GRACE_PERIOD
    ) {
      console.log(`deleting need: ${need.id}`);
      dispatch(deleteNeed(need.id));
    }
  }, []);

  const handleDeleteDialog = (needId) => {
    setOpenDelete(true);
    setDialogValues({
      needId,
      type: 'deleteNeed',
    });
  };

  const iconImage = ipfsMetaData
    ? `${process.env.REACT_APP_IPFS_GATEWAY_1}/${ipfsMetaData.image.split('ipfs://')[1]}`
    : need.imageUrl && prepareUrl(need.imageUrl);

  const awakeImage = !ipfsMetaData
    ? prepareUrl(need.child.awakeAvatarUrl)
    : `${process.env.REACT_APP_IPFS_GATEWAY_1}/${
        ipfsMetaData.child.awakeImage.split('ipfs://')[1]
      }`;
  const firstName = !ipfsMetaData
    ? need.child.firstName_translations && need.child.firstName_translations.fa
    : '-';

  const lastName = !ipfsMetaData
    ? need.child.lastName_translations && need.child.lastName_translations.fa
    : '-';

  const sayName = !ipfsMetaData
    ? need.child.sayname_translations && need.child.sayname_translations.fa
    : ipfsMetaData.child.name.fa;

  const name = !ipfsMetaData
    ? need.name_translations && need.name_translations.fa
    : ipfsMetaData.properties.needDetails.titles.fa;

  const informations = !ipfsMetaData
    ? need.informations && need.informations
    : ipfsMetaData.properties.needDetails.information;

  const details = !ipfsMetaData
    ? need.details && need.details
    : ipfsMetaData.properties.needDetails.socialWorkerNotes;

  const theIpfs = ipfs && ipfs.need && ipfs.need.flaskId === need.id && ipfs;
  if (ipfs) console.log(theIpfs || '');
  const category = getCategoryString(need.category, need.isUrgent);
  const cost = need._cost && need._cost.toLocaleString();
  const affiliateLinkUrl = need.affiliateLinkUrl && need.affiliateLinkUrl;
  const link = need.link && need.link;
  const receipts = need.receipts_ && need.receipts_;
  const retailerImage = need.img;

  const swSignature =
    needSignatures && needSignatures.find((s) => s.flaskUserId === need.created_by_id);
  const auditorSignature =
    needSignatures && needSignatures.find((s) => s.flaskUserId === need.confirmUser);

  return (
    <>
      {swInfo && (
        <Box sx={{ opacity: cardSelected === need.id || cardSelected === 0 ? 1 : 0.4 }}>
          {(deletedId !== need.id || !deleted) && (
            <Card
              elevation={8}
              sx={{
                p: 0,
                maxHeight: isSelected ? '1400px' : `${randomIntFromInterval(320, 320)}px`,
                '&:hover': {
                  border: 'ridge',
                  borderColor: () =>
                    isSelected ? theme.palette.primary.dark : theme.palette.secondary.dark,
                  borderWidth: '0.2em',
                },
                border: 'solid',
                borderColor: () =>
                  needSignatures && needSignatures[0]
                    ? theme.palette.warning.main
                    : isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.text.secondary,
                borderWidth: needSignatures && needSignatures[0] ? '0.2em' : '0.1em',
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
                        need.imageUrl &&
                        !need.imageUrl.includes('wrong') &&
                        need.child.awakeAvatarUrl
                          ? `url(
                            ${awakeImage}
                          )`
                          : `url(${iconImage})`,
                      '&:hover': {
                        background: `url(${iconImage})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      },
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    {(!need.imageUrl || need.imageUrl.includes('wrong')) && (
                      <Tooltip title={t('need.tooltip.addIcon')}>
                        <IconButton>
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
                      {firstName} {lastName}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="300"
                      sx={{ fontSize: 11 }}
                    >
                      {sayName}
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
                        {!need.ipfs &&
                          ((!collaborators.includes(swInfo.id) &&
                            swInfo.typeId === FlaskUserTypesEnum.ADMIN) ||
                            swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
                            swInfo.id === need.created_by_id) && (
                            <MenuItem>
                              <EditIcon sx={{ ml: 1, mr: 1 }} />
                              <RouterLink
                                style={{ textDecoration: 'none', color: '#e6e5e8' }}
                                to={`/need/edit/${need.child.id}/${need.id}`}
                              >
                                {t('myPage.taskCard.menu.updateٔNeed')}
                              </RouterLink>
                            </MenuItem>
                          )}
                        {need.tickets && need.tickets[0] ? (
                          <MenuItem onClick={() => handleOpenTicketing(need.tickets[0].id)}>
                            <VisibilityIcon sx={{ ml: 1, mr: 1 }} />
                            {t('myPage.taskCard.menu.readTicket')}
                          </MenuItem>
                        ) : (
                          !collaborators.includes(swInfo.id) &&
                          !need.ipfs && (
                            <MenuItem onClick={() => handleOpenConfirm()}>
                              <FlagOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                              {t('myPage.taskCard.menu.addTicket')}
                            </MenuItem>
                          )
                        )}
                        {!collaborators.includes(swInfo.id) &&
                          swInfo.id === need.created_by_id &&
                          need.type === NeedTypeEnum.PRODUCT &&
                          need.status === ProductStatusEnum.PURCHASED_PRODUCT &&
                          (!need.tickets[0] ||
                            !need.tickets.find(
                              (item) => item.lastAnnouncement === AnnouncementEnum.ARRIVED_AT_NGO,
                            )) && (
                            <MenuItem
                              onClick={() => handleAnnouncement(AnnouncementEnum.ARRIVED_AT_NGO)}
                            >
                              <CampaignOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                              {t('myPage.taskCard.menu.deliveryTicket')}
                            </MenuItem>
                          )}
                        {!collaborators.includes(swInfo.id) &&
                          swInfo.id === need.created_by_id &&
                          need.type === NeedTypeEnum.SERVICE &&
                          need.status === ServiceStatusEnum.MONEY_TO_NGO &&
                          (!need.tickets[0] ||
                            need.tickets.find(
                              (item2) =>
                                item2.lastAnnouncement !== AnnouncementEnum.NGO_RECEIVED_MONEY,
                            )) &&
                          (receipts && receipts[0] ? (
                            <MenuItem
                              onClick={() =>
                                handleAnnouncement(AnnouncementEnum.NGO_RECEIVED_MONEY)
                              }
                            >
                              <CampaignOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                              {t('myPage.taskCard.menu.moneyToNgoTicket')}
                            </MenuItem>
                          ) : (
                            <MenuItem disabled>
                              <CampaignOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                              {t('myPage.taskCard.menu.addReceipt')}
                            </MenuItem>
                          ))}

                        {need && need.ipfs && need.ipfs.needDetailsHash && (
                          <MenuItem>
                            <DatasetLinkedOutlinedIcon sx={{ ml: 1, mr: 1 }} />
                            <RouterLink
                              style={{ textDecoration: 'none', color: '#e6e5e8' }}
                              to={`${process.env.REACT_APP_IPFS_GATEWAY_2}/${need.ipfs.needDetailsHash}/metadata.json`}
                            >
                              {t('myPage.taskCard.menu.ipfs')}
                            </RouterLink>
                          </MenuItem>
                        )}
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
                    <Grid item xs={9}>
                      <Typography
                        color="textSecondary"
                        variant="h5"
                        component="span"
                        fontWeight="600"
                      >
                        {name}
                      </Typography>
                      {((informations &&
                        typeof informations === 'string' &&
                        informations.length > 4) ||
                        (details && typeof details === 'string' && details.length > 4)) && (
                        <Tooltip
                          arrow
                          title={
                            <Typography>
                              {informations}
                              {details}
                            </Typography>
                          }
                          placement="left"
                        >
                          <IconButton component="div" sx={{ pt: 0, pb: 0, opacity: 0.8 }}>
                            <HelpOutlineOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Grid>

                    <Grid item xs={3} sx={{ maxHeight: '40px' }}>
                      {need.tickets && need.tickets[0] && (
                        <>
                          {/* flag Icon- ticketHistory has one item in it due to announcement */}
                          {(need.tickets[0].lastAnnouncement === AnnouncementEnum.NONE ||
                            need.tickets[0].lastAnnouncement === AnnouncementEnum.ERROR ||
                            !need.tickets[0].lastAnnouncement) && (
                            <Box
                              sx={{
                                textAlign: 'center',
                                backgroundColor:
                                  need.tickets[0].color === Colors.YELLOW
                                    ? () => theme.palette.background.ripple
                                    : '',
                                animation:
                                  need.tickets[0].color === Colors.YELLOW
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
                              {need.tickets[0].color === Colors.RED && (
                                <>
                                  <CircularProgressWithLabel value={progress} need={need} />
                                  <Typography sx={{ fontSize: 10, color: '#dd3976' }}>
                                    {`${Math.round(progress)}%`}
                                  </Typography>
                                </>
                              )}
                              {(need.tickets[0].color === Colors.YELLOW ||
                                need.tickets[0].color === Colors.BLUE) && (
                                <FlagOutlinedIcon
                                  sx={{
                                    color:
                                      need.tickets[0].color === Colors.YELLOW
                                        ? colorChoices[1].code
                                        : need.tickets[0].color === Colors.BLUE &&
                                          colorChoices[0].code,
                                  }}
                                />
                              )}
                            </Box>
                          )}
                          {/* Announcement Icon */}
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
                            {need.tickets.find(
                              (item) => item.lastAnnouncement === AnnouncementEnum.ARRIVED_AT_NGO,
                            ) && <CampaignOutlinedIcon />}
                            {need.tickets.find(
                              (item2) =>
                                item2.lastAnnouncement === AnnouncementEnum.NGO_RECEIVED_MONEY,
                            ) && <CampaignOutlinedIcon />}
                          </Box>
                        </>
                      )}
                      {/* Signature Icon */}
                      <Box
                        sx={{
                          textAlign: 'center',
                          height: '40px',
                          width: '40px',
                        }}
                      >
                        {needSignatures && needSignatures[0] && (
                          <Tooltip
                            arrow
                            title={
                              <>
                                <Typography sx={{ fontSize: 12 }}>
                                  {` ${t('roles.socialWorker')}:
                                  ${swSignature && swSignature.user && swSignature.user.firstName}`}
                                </Typography>
                                <Typography sx={{ fontSize: 12 }}>
                                  {auditorSignature &&
                                    `${t('roles.auditor')}:
                                  ${auditorSignature.user && auditorSignature.user.firstName}`}
                                </Typography>
                              </>
                            }
                            placement="right-end"
                            sx={{ width: '100%' }}
                          >
                            <img
                              style={{ minHeight: '10px' }}
                              srcSet={`${signatureIcon} 1x, ${signatureIcon} 2x`}
                              alt={need.img}
                              width="100%"
                            />
                          </Tooltip>
                        )}
                      </Box>
                      {need.ipfs && <WaterWaveText hash={need.ipfs && need.ipfs.needDetailsHash} />}
                    </Grid>
                  </Grid>
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: 10,
                      opacity: 0.8,
                    }}
                    fontWeight="300"
                  >
                    ( {t(category)} )
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                    {t('myPage.taskCard.cost')}: {cost}
                  </Typography>
                  <Grid container>
                    {typeof affiliateLinkUrl === 'string' &&
                      affiliateLinkUrl.length > 5 &&
                      !affiliateLinkUrl.includes('false') && (
                        <Typography color="textSecondary" variant="span" fontWeight="400">
                          {t('myPage.taskCard.provider')}:
                          <Link
                            href={affiliateLinkUrl}
                            sx={{ pl: 1, pr: 1 }}
                            underline="none"
                            target="_blank"
                          >
                            Affiliate
                          </Link>
                        </Typography>
                      )}
                    {link && (
                      <Typography
                        color="textSecondary"
                        variant="span"
                        fontWeight="400"
                        sx={{ pb: 1 }}
                      >
                        {t('myPage.taskCard.provider')}:
                        <Link href={link} underline="none" sx={{ pl: 1, pr: 1 }} target="_blank">
                          Link
                        </Link>
                      </Typography>
                    )}
                  </Grid>
                  <Grid>
                    {receipts && receipts[0] ? (
                      <AvatarGroup>
                        {receipts.map((r) => (
                          <ReceiptImage receipt={r.receipt[0]} key={r.id} />
                        ))}
                      </AvatarGroup>
                    ) : (
                      need.type === NeedTypeEnum.SERVICE &&
                      need.status >= ServiceStatusEnum.MONEY_TO_NGO && (
                        <Typography
                          sx={{ color: () => theme.palette.warning.dark }}
                          variant="h6"
                          fontWeight="400"
                        >
                          {t('myPage.taskCard.noReceipt')}
                        </Typography>
                      )
                    )}
                  </Grid>
                </CardContent>

                <Box sx={{ position: 'relative' }}>
                  <ListItem
                    sx={{
                      mt: '40px',
                      position: 'absolute',
                    }}
                  >
                    {need.type === NeedTypeEnum.PRODUCT &&
                      need.status < ProductStatusEnum.PURCHASED_PRODUCT &&
                      isUnpayable(need) && (
                        <Chip
                          sx={{
                            color: '#ff0000',
                            zIndex: 10,
                            opacity: 0.8,
                            borderColor: '#ff0000',
                          }}
                          label={t('myPage.taskCard.tags.unpayable')}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    {!need.isConfirmed && (
                      <Chip
                        sx={{
                          color: '#ff0000',
                          zIndex: 10,
                          opacity: 0.8,
                          borderColor: '#ff0000',
                        }}
                        label={t('myPage.taskCard.tags.notConfirmed')}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </ListItem>
                  <ListItem
                    sx={{
                      position: 'absolute',
                    }}
                  >
                    <Chip
                      sx={{
                        color: need.type === NeedTypeEnum.PRODUCT ? '#e66cf2' : '#5888e3',
                        zIndex: 10,
                        opacity: 0.8,
                        borderColor: need.type === NeedTypeEnum.PRODUCT ? '#e66cf2' : '#5888e3',
                      }}
                      label={
                        need.type === NeedTypeEnum.PRODUCT
                          ? t('myPage.taskCard.tags.product')
                          : t('myPage.taskCard.tags.service')
                      }
                      size="small"
                      variant="outlined"
                    />
                    {((need.type === NeedTypeEnum.PRODUCT &&
                      need.status <= ProductStatusEnum.PURCHASED_PRODUCT) ||
                      (need.type === NeedTypeEnum.SERVICE &&
                        need.status <= ServiceStatusEnum.MONEY_TO_NGO)) && (
                      <Chip
                        sx={{
                          color:
                            need.status === PaymentStatusEnum.PARTIAL_PAY
                              ? '#ddf96a'
                              : need.status === PaymentStatusEnum.COMPLETE_PAY
                              ? '#00ffb8'
                              : need.status === PaymentStatusEnum.NOT_PAID
                              ? '#f331a6'
                              : ((need.type === NeedTypeEnum.PRODUCT &&
                                  need.status === ProductStatusEnum.PURCHASED_PRODUCT) ||
                                  (need.type === NeedTypeEnum.SERVICE &&
                                    need.status === ProductStatusEnum.MONEY_TO_NGO)) &&
                                '#ffb100',
                          zIndex: 10,
                          opacity: 0.8,
                          m: 1,
                          borderColor:
                            need.status === PaymentStatusEnum.PARTIAL_PAY
                              ? '#ddf96a'
                              : need.status === PaymentStatusEnum.COMPLETE_PAY
                              ? '#00ffb8'
                              : need.status === PaymentStatusEnum.NOT_PAID
                              ? '#f331a6'
                              : ((need.type === NeedTypeEnum.PRODUCT &&
                                  need.status === ProductStatusEnum.PURCHASED_PRODUCT) ||
                                  (need.type === NeedTypeEnum.SERVICE &&
                                    need.status === ProductStatusEnum.MONEY_TO_NGO)) &&
                                '#ffb100',
                        }}
                        label={
                          need.status === PaymentStatusEnum.PARTIAL_PAY
                            ? t('myPage.taskCard.tags.partialPay')
                            : need.status === PaymentStatusEnum.NOT_PAID
                            ? t('myPage.taskCard.tags.notPaid')
                            : need.status === PaymentStatusEnum.COMPLETE_PAY
                            ? t('myPage.taskCard.tags.completePay')
                            : need.type === NeedTypeEnum.PRODUCT &&
                              need.status === ProductStatusEnum.PURCHASED_PRODUCT
                            ? t('myPage.taskCard.tags.purchased')
                            : need.type === NeedTypeEnum.SERVICE &&
                              need.status === ProductStatusEnum.MONEY_TO_NGO &&
                              t('myPage.taskCard.tags.moneyToNgo')
                        }
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </ListItem>
                  {((need.type === NeedTypeEnum.PRODUCT &&
                    need.status === ProductStatusEnum.DELIVERED) ||
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
                          color: '#1bf500',
                          zIndex: 10,
                          opacity: 0.8,
                          borderColor: '#1bf500',
                        }}
                        label={t('myPage.taskCard.tags.delivered')}
                        size="small"
                        variant="outlined"
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
                            color: '#ff9800',
                            zIndex: 10,
                            opacity: 0.8,
                            borderColor: '#ff9800',
                          }}
                          label={t('myPage.taskCard.tags.moneyToNgo')}
                          size="small"
                          variant="outlined"
                        />
                      </ListItem>
                    )}
                  {need.type === NeedTypeEnum.PRODUCT && need.img ? (
                    <img
                      style={{ opacity: !cardSelected ? '30%' : '80%', minHeight: '100px' }}
                      srcSet={`${retailerImage} 1x, ${retailerImage} 2x`}
                      alt={need.img}
                      width="100%"
                    />
                  ) : (
                    <Grid sx={{ mb: 4, minHeight: '100px', width: '100%' }} />
                  )}

                  {/* dates */}
                  <Grid container sx={{ p: 0 }}>
                    <Grid item xs={12}>
                      <DurationTimeLine need={need} signature={thisCardSignature} />
                    </Grid>
                  </Grid>
                </Box>
              </CardActionArea>
              <CardActions>
                {!need.isConfirmed &&
                  convertFlaskToSayRoles(swInfo.typeId) === SAYPlatformRoles.AUDITOR && (
                    <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
                      <LoadingButton
                        loading={loadingConfirm || loadingDuplicates}
                        disabled={
                          collaborators.includes(swInfo.id) ||
                          swInfo.typeId === FlaskUserTypesEnum.SOCIAL_WORKER ||
                          swInfo.typeId === FlaskUserTypesEnum.NGO_SUPERVISOR
                        }
                        onClick={() => handleDialog(need)}
                      >
                        {t('button.confirm')}
                      </LoadingButton>
                    </Grid>
                  )}
                {need.status === PaymentStatusEnum.NOT_PAID && (
                  <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
                    {!need.isConfirmed && (
                      <LoadingButton
                        fullWidth
                        variant="customDelete"
                        onClick={() => handleDeleteDialog(need.id)}
                        disabled={collaborators.includes(swInfo.id)}
                      >
                        {t('button.delete')}
                      </LoadingButton>
                    )}
                  </Grid>
                )}
                {need.created_by_id === swInfo.id &&
                  need.status === ProductStatusEnum.DELIVERED && (
                    <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
                      {(!needSignatures ||
                        !needSignatures[0] ||
                        !needSignatures.find((s) => s.flaskUserId === swInfo.id)) &&
                        (!isConnected ? (
                          <WalletButton
                            fullWidth
                            variant="outlined"
                            onClick={() => setOpenWallets(true)}
                          >
                            {t('button.wallet.connect')}
                          </WalletButton>
                        ) : (
                          isConnected && (
                            <>
                              <WalletButton
                                fullWidth
                                signbutton="true"
                                loading={
                                  isLoadingSignIn ||
                                  loadingSignature ||
                                  loadingInformation ||
                                  isLoading ||
                                  pendingConnector
                                }
                                onClick={handleSignature}
                                sx={{ color: 'black' }}
                              >
                                {t('button.wallet.sign')}
                              </WalletButton>
                            </>
                          )
                        ))}
                    </Grid>
                  )}
              </CardActions>
            </Card>
          )}

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
          <GenericDialog open={openDelete} setOpen={setOpenDelete} dialogValues={dialogValues} />
        </Box>
      )}
    </>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  need: PropTypes.object,
  setCardSelected: PropTypes.func,
  handleDialog: PropTypes.func,
  cardSelected: PropTypes.number,
  // loadingEthereumSignature: PropTypes.bool,
};
