/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Autocomplete,
  TextField,
  Avatar,
  Button,
  Tooltip,
  tooltipClasses,
  useMediaQuery,
  Skeleton,
  LinearProgress,
  Stack,
} from '@mui/material';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSignMessage,
} from 'wagmi';
import LogoutIcon from '@mui/icons-material/Logout';
import { SiweMessage } from 'siwe';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import { styled } from '@mui/material/styles';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';
import spring from '../../resources/images/cover/spring.jpeg';
import summer from '../../resources/images/cover/summer.jpeg';
import autumn from '../../resources/images/cover/autumn.jpeg';
import winter from '../../resources/images/cover/winter.jpeg';
import { FlaskUserTypesEnum } from '../../utils/types';
import {
  persianDay,
  persianMonth,
  persianMonthString,
  persianYear,
} from '../../utils/persianToEnglish';
import WalletDialog from '../dialogs/WalletDialog';
import {
  fetchNonce,
  fetchWalletInformation,
  walletVerify,
} from '../../redux/actions/blockchainAction';
import WalletButton from '../wallet/WalletButton';
import MessageWallet from '../MessageWallet';
import { WALLET_INFORMATION_RESET, WALLET_VERIFY_RESET } from '../../redux/constants/daoConstants';
import ContributionOverview from './ContributionOverview';
import { daysDifference } from '../../utils/helpers';
import NgoArrivalSummery from '../../pages/ngos/NgoArrivalSummery';

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip placement="left" {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 800,
    overflow: 'scroll',
    height: window.innerWidth < 800 && '80vh',
  },
});

const CoverCard = ({
  theUser,
  needCount,
  childCount,
  signatureCount,
  swInfo,
  swNewDetails,
  setSwNewDetails,
  arrivals,
  skeleton,
  setSkeleton,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [cover, setCover] = useState(null);
  const [openSocialWorkers, setOpenSocialWorker] = useState(false);
  const [optionsSocialWorkers, setOptionsSwList] = useState([]);
  const [openWallets, setOpenWallets] = useState(false);
  const [values, setValues] = useState();
  const [walletToastOpen, setWalletToastOpen] = useState(false);
  const [dateList, setDateList] = useState();
  const isLoadingSw = openSocialWorkers && optionsSocialWorkers.length === 0;
  const [height, setHeight] = useState(306.8);
  // wallet
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { reset, status, error: errorSignIn, isSuccess, signMessageAsync } = useSignMessage();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  const swAll = useSelector((state) => state.swAll);
  const { swList, success: successSwAll } = swAll;

  const walletNonce = useSelector((state) => state.walletNonce);
  const { nonceData, error: errorWalletNonce } = walletNonce;

  const { verifiedNonce, error: errorVerify } = useSelector((state) => state.walletVerify);

  const { information, error: errorWalletInformation } = useSelector(
    (state) => state.walletInformation,
  );

  const myPage = useSelector((state) => state.myPage);
  const { loading: loadingPageDetails } = myPage;

  const { error: errorSignature } = useSelector((state) => state.signature);

  // fetch nonce for the wallet siwe
  useEffect(() => {
    if (swInfo) {
      dispatch(fetchNonce());
    }
  }, [swInfo]);

  // toast
  useEffect(() => {
    if (errorSignIn || errorSignature || errorVerify) {
      setWalletToastOpen(true);
    }
  }, [errorSignIn, errorSignature, errorVerify]);

  // after sign in get sign-in information
  useEffect(() => {
    // Check client and server nonce
    const localData = JSON.parse(localStorage.getItem('say-siwe'));
    if (nonceData && nonceData.nonce === (localData && localData.nonce)) {
      dispatch(fetchWalletInformation());
    }
  }, [verifiedNonce]);

  useEffect(() => {
    if (!errorSignIn && isConnected && nonceData && nonceData.nonce) {
      setOpenWallets(false);
      const chainId = chain?.id;

      if (status === 'loading' || !address || !chainId) return;
      // Check client and server nonce
      const localData = JSON.parse(localStorage.getItem('say-siwe'));
      if (nonceData.nonce === (localData && localData.nonce)) {
        return;
      }
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in WITH Ethereum Wallet',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: nonceData.nonce,
      });

      const myAsync = async () => {
        const preparedMessage = message.prepareMessage();

        const result = await signMessageAsync({
          message: preparedMessage,
          onSuccess(data) {
            console.log('Success', data);
          },
        });

        localStorage.setItem(
          'say-siwe',
          JSON.stringify({
            'siwe-signature': result,
            nonce: nonceData.nonce,
          }),
        );

        setValues({
          signature: result,
          message,
        });
      };
      myAsync();
    }
  }, [isConnected, nonceData, errorSignIn]);

  // Verify signature
  useEffect(() => {
    if (!isSuccess) return;
    dispatch(walletVerify(values.message, values.signature));
  }, [values]);

  // Disconnect if did not sign in
  useEffect(() => {
    if (
      errorSignIn ||
      errorVerify ||
      errorSignature ||
      errorWalletInformation ||
      errorWalletNonce
    ) {
      disconnect();
      localStorage.removeItem('say-siwe');
    }
  }, [errorSignIn, errorVerify, errorWalletInformation, errorWalletNonce, errorSignature]);

  // seasonal cover
  useEffect(() => {
    const d = new Date();
    const pm = persianMonthString(d);
    if (pm === 'Farvardin' || pm === 'Ordibehesht' || pm === 'Khordad') {
      setCover(spring);
    }
    if (pm === 'Tir' || pm === 'Mordad' || pm === 'Shahrivar') {
      setCover(summer);
    }
    if (pm === 'Mehr' || pm === 'Aban' || pm === 'Azar') {
      setCover(autumn);
    }
    if (pm === 'Dey' || pm === 'Bahman' || pm === 'Esfand') {
      setCover(winter);
    }
  }, []);

  useEffect(() => {
    if (cover) {
      setSkeleton(false); // cover image skeleton
    }
  }, [cover]);

  // Autocomplete
  useEffect(() => {
    let active = true;
    if (!isLoadingSw) {
      return undefined;
    }
    if (active && successSwAll) {
      // sort myChildren
      const sortedSocialWorkers = swList.sort((a, b) => Number(b.isActive) - Number(a.isActive));
      setOptionsSwList([...sortedSocialWorkers]);
    }
    return () => {
      active = false;
    };
  }, [isLoadingSw, successSwAll, swNewDetails]);

  // social worker open
  useEffect(() => {
    if (openSocialWorkers && !swList) {
      dispatch(fetchSocialWorkersList());
    }
  }, [openSocialWorkers, setOpenSocialWorker, swNewDetails]);

  useEffect(() => {
    if (arrivals) {
      const myList = [];
      for (let i = 0; i < arrivals.length; i++) {
        if (arrivals[i].maxDate >= new Date().setHours(0, 0, 0, 0)) {
          // lets change today time to 12:00 am otherwise those with incorrect time will not be pushed
          myList.push(arrivals[i].maxDate);
        }
      }
      setDateList(myList);
    }
  }, [arrivals]);

  const onDisconnect = () => {
    localStorage.removeItem('say-siwe');
    dispatch({ type: WALLET_INFORMATION_RESET });
    dispatch({ type: WALLET_VERIFY_RESET });
    disconnect();
  };

  const handleWalletButton = () => {
    setOpenWallets(true);
    reset();
    dispatch({ type: WALLET_VERIFY_RESET });
    dispatch({ type: WALLET_INFORMATION_RESET });
  };

  // close toast
  const handleCloseWalletToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setWalletToastOpen(false);
  };

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  // scroll
  useEffect(() => {
    if (loadingPageDetails) {
      window.scrollTo(0, 0);
    }
  }, [loadingPageDetails]);

  const scrollFunction = () => {
    if (
      !loadingPageDetails &&
      (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50)
    ) {
      setHeight(120);
    } else {
      setHeight(306.8);
    }
  };

  useEffect(() => {
    if (document.getElementById('coverImage')) {
      scrollFunction();
    }
    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, [window.onscroll]);

  window.addEventListener('scroll', scrollFunction);
  return (
    <Card
      sx={{
        padding: '0',
      }}
    >
      <Grid
        sx={{
          height: lgUp ? height : 150,
          minHeight: lgUp ? height + 50 : 100,
          transition: '0.4s',
        }}
      >
        {skeleton ? (
          <Skeleton sx={{ height, m: 'auto' }} animation="wave" variant="rectangular" />
        ) : (
          <img
            id="coverImage"
            style={{ transition: '0.4s', opacity: height < 300 && 0.3 }}
            srcSet={`${cover} 1x, ${cover} 2x`}
            alt="cover"
            width="100%"
          />
        )}
      </Grid>
      {information && information.nonce}
      <div
        style={{
          display: height < 250 && 'none',
          transition: '0.8s',
        }}
      >
        <Grid
          container
          sx={{
            position: 'relative',
          }}
        >
          {swInfo &&
            (swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
              swInfo.typeId === FlaskUserTypesEnum.ADMIN) && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '220px',
                  left: '15px',
                  minHeight: '60px',
                  backgroundColor: (theme) => theme.palette.background.paper,
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  borderRadius: 1,
                }}
              >
                <Autocomplete
                  sx={{
                    minWidth: '210px',
                    mt: 2,
                  }}
                  size="small"
                  value={swNewDetails}
                  id="asynchronous-social-worker"
                  open={openSocialWorkers}
                  onOpen={() => {
                    setOpenSocialWorker(true);
                  }}
                  onClose={() => {
                    setOpenSocialWorker(false);
                  }}
                  options={optionsSocialWorkers}
                  onChange={(e, value) => setSwNewDetails(value && value)}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) =>
                    `${option.id}. ${option.typeName} - ${option.firstName} ${option.lastName}`
                  }
                  loading={isLoadingSw}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      {option.isActive ? (
                        <>
                          <FeatherIcon color="green" icon="check" width="18" />
                          <Typography>
                            {`${option.id}.  ${option.firstName} ${option.lastName}`}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <FeatherIcon color="red" icon="x" width="18" />
                          <Typography>
                            {`${option.id}.  ${option.firstName} ${option.lastName}`}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('myPage.viewAs')}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingSw ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
            )}
          {/* Contributor graph */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              color: 'white',
              paddingLeft: '0px',
              paddingRight: '0px',
              borderRadius: 1,
              opacity: '50%',
            }}
          >
            {lgUp && <ContributionOverview swNewDetails={swNewDetails} />}
          </Box>
        </Grid>
        <CardContent
          sx={{
            pt: '12px',
            pb: '0.8rem !important',
          }}
        >
          {/* infos */}
          <Grid container spacing={0}>
            <Grid
              item
              lg={4}
              sm={12}
              xs={12}
              sx={{
                order: {
                  xs: '2',
                  sm: '2',
                  lg: '1',
                },
              }}
            >
              <Grid
                container
                spacing={0}
                sx={{
                  mt: {
                    xs: 1,
                  },
                  mb: {
                    xs: 1,
                  },
                }}
              >
                <Grid
                  item
                  lg={3}
                  sm={3}
                  xs={3}
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey.A200,
                    }}
                  >
                    <InterestsOutlinedIcon fontSize="medium" sx={{ mb: 0 }} />
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 14,
                    }}
                  >
                    {needCount >= 0 ? (
                      needCount
                    ) : (
                      <Stack sx={{ m: 'auto', width: '20%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress sx={{ color: (theme) => theme.palette.primary }} />
                      </Stack>
                    )}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    fontWeight="400"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 10,
                      mt: 1,
                    }}
                  >
                    {t('myPage.notConfirmedNeeds')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={3}
                  xs={3}
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey.A200,
                    }}
                  >
                    <ChildCareIcon fontSize="medium" sx={{ mb: 0 }} />
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 14,
                    }}
                  >
                    {childCount >= 0 ? (
                      childCount
                    ) : (
                      <Stack sx={{ m: 'auto', width: '20%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress sx={{ color: (theme) => theme.palette.primary }} />
                      </Stack>
                    )}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 10,
                      mt: 1,
                    }}
                  >
                    {theUser &&
                    (theUser.typeId === FlaskUserTypesEnum.ADMIN ||
                      theUser.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
                      theUser.typeId === FlaskUserTypesEnum.SUPER_ADMIN)
                      ? t('myPage.myChildren')
                      : t('myPage.allChildren')}
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={3}
                  xs={3}
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey.A200,
                    }}
                  >
                    <HandshakeOutlinedIcon fontSize="medium" sx={{ mb: 0 }} />
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="600"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 14,
                    }}
                  >
                    {signatureCount >= 0 ? (
                      signatureCount
                    ) : (
                      <Stack sx={{ m: 'auto', width: '20%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress sx={{ color: (theme) => theme.palette.primary }} />
                      </Stack>
                    )}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 10,
                      mt: 1,
                    }}
                  >
                    {t('myPage.signed')}
                  </Typography>
                </Grid>

                <Grid
                  item
                  lg={3}
                  sm={3}
                  xs={3}
                  sx={{
                    textAlign: 'center',
                  }}
                >
                  <CustomWidthTooltip
                    arrow
                    title={<NgoArrivalSummery dateList={dateList} arrivals={arrivals} />}
                  >
                    <Typography
                      sx={{
                        color: (theme) => theme.palette.grey.A200,
                      }}
                    >
                      <DeliveryDiningOutlinedIcon fontSize="medium" sx={{ mb: 0 }} />
                    </Typography>
                  </CustomWidthTooltip>

                  <Typography
                    variant="h4"
                    fontWeight="600"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 14,
                    }}
                  >
                    {dateList && dateList[0] ? (
                      persianDay(new Date()) !== persianDay(new Date(Math.min(...dateList))) ||
                      persianMonth(new Date()) !== persianMonth(new Date(Math.min(...dateList))) ||
                      persianYear(new Date()) !== persianYear(new Date(Math.min(...dateList))) ? (
                        `${Math.ceil(
                          daysDifference(
                            new Date().toUTCString(),
                            new Date(Math.min(...dateList)).toUTCString(),
                          ),
                        )} ${t('myPage.days')}`
                      ) : (
                        new Date() > new Date(Math.min(...dateList)) && t('myPage.today')
                      )
                    ) : dateList && !dateList[0] ? (
                      '-'
                    ) : (
                      <Stack sx={{ m: 'auto', width: '20%', color: 'grey.500' }} spacing={2}>
                        <LinearProgress sx={{ color: (theme) => theme.palette.primary }} />
                      </Stack>
                    )}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      lineHeight: '1.2',
                      fontSize: 10,
                      mt: 1,
                    }}
                  >
                    {t('myPage.ngoArrival')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* Profile photo */}
            <Grid
              item
              lg={4}
              sm={12}
              xs={12}
              sx={{
                order: {
                  xs: '1',
                  sm: '1',
                  lg: '2',
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  mt: '-90px',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      borderRadius: '50%',
                      border: (theme) =>
                        `${theme.palette.mode === 'dark' ? '3px solid #3c414c' : '3px solid #fff'}`,
                      width: '100px',
                      height: '100px',
                      overflow: 'hidden',
                      margin: '0 auto',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'block',
                        backgroundImage: `url(${theUser.avatarUrl})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundColor: 'linear-gradient(#50b2fc,#f44c66)',
                        width: '100%',
                        height: '100%',
                        margin: 'auto',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: '5px',
                      display: 'block',
                    }}
                  >
                    <Typography
                      fontWeight="500"
                      sx={{
                        fontSize: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {/* {!theUser.firstName ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      `${theUser && theUser.firstName} ${theUser && theUser.lastName}`
                    )} */}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="400"
                      sx={{
                        textAlign: 'center',
                      }}
                    >
                      {/* {!theUser ? <CircularProgress color="inherit" size={20} /> : theUser.typeName} */}
                    </Typography>
                    <Grid container direction="column" sx={{ mt: 0 }}>
                      <Grid item sx={{ mb: 1 }}>
                        {!isConnected ? (
                          <WalletButton fullWidth variant="outlined" onClick={handleWalletButton}>
                            {t('button.wallet.connect')}
                          </WalletButton>
                        ) : (
                          <Grid container justifyContent="flex-end" alignItems="center">
                            <Grid item>
                              <Button
                                onClick={onDisconnect}
                                startIcon={
                                  <Avatar
                                    alt="ENS Avatar"
                                    src={ensAvatar}
                                    sx={{ width: 30, height: 30 }}
                                  />
                                }
                                endIcon={<LogoutIcon />}
                              >
                                <Typography
                                  sx={{
                                    textAlign: 'center',
                                    maxWidth: '400px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    width: '160px',
                                    height: '1.2em',
                                    whiteSpace: 'nowrap',
                                    justifyContent: 'flex-end',
                                    position: 'relative',
                                  }}
                                >
                                  {ensName
                                    ? `${ensName} (${address.slice(0, 5)}...${address.slice(-4)})`
                                    : `${address.slice(0, 5)}...${address.slice(-4)}`}
                                </Typography>
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              lg={4}
              sm={12}
              xs={12}
              display="flex"
              alignItems="center"
              sx={{
                justifyContent: {
                  sm: 'center',
                  lg: 'flex-end',
                },
                mt: { sm: 2, lg: 0 },
                ml: { sm: 4, lg: 0 },
                order: { xs: '3', sm: '3', lg: '3' },
              }}
            >
              <Box
                sx={{
                  display: {
                    sm: 'flex',
                    lg: 'flex',
                    xs: 'block',
                  },
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  textAlign: {
                    xs: 'center',
                  },
                }}
              >
                {/* <Grid container direction="column" spacing={2} sx={{ p: 2 }}>
                <Grid item>
                  <div
                    style={{
                      height: '25px',
                      width: '25px',
                      backgroundColor: '#bbb',
                      borderRadius: '50%',
                      display: 'inline-block',
                      color: 'black',
                      marginTop: 0,
                      textAlign: 'center',
                    }}
                  >
                    S
                  </div>
                </Grid>
              </Grid> */}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </div>

      <WalletDialog openWallets={openWallets} setOpenWallets={setOpenWallets} />
      {(errorVerify || errorWalletInformation || errorSignature || errorSignIn) && (
        <MessageWallet
          walletError={errorVerify || errorWalletInformation || errorSignature || errorSignIn}
          walletToastOpen={walletToastOpen}
          handleCloseWalletToast={handleCloseWalletToast}
          severity={errorSignIn || errorSignature ? 'warning' : 'error'}
        />
      )}
    </Card>
  );
};

export default CoverCard;
