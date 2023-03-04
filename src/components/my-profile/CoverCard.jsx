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
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import InterestsIcon from '@mui/icons-material/Interests';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HandshakeIcon from '@mui/icons-material/Handshake';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';
import spring from '../../assets/images/cover/spring.jpeg';
import summer from '../../assets/images/cover/summer.jpeg';
import autumn from '../../assets/images/cover/autumn.jpeg';
import winter from '../../assets/images/cover/winter.jpeg';
import { RolesEnum } from '../../utils/types';
import { persianMonth } from '../../utils/persianToEnglish';
import ContributionOverview from './ContributionOverview';
import { fetchMyPage } from '../../redux/actions/userAction';

const CoverCard = ({
  theUser,
  needCount,
  signatureCount,
  swInfo,
  swNewDetails,
  setSwNewDetails,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [cover, setCover] = useState(null);
  const [openSocialWorkers, setOpenSocialWorker] = useState(false);
  const [optionsSocialWorkers, setOptionsSwList] = useState([]);
  const [skip, setSkip] = useState(10);
  const [childCount, setChildCount] = useState();
  const isLoadingSw = openSocialWorkers && optionsSocialWorkers.length === 0;

  // const myPage = useSelector((state) => state.myPage);
  // const { pageDetails } = myPage;

  const swAll = useSelector((state) => state.swAll);
  const { swList, success: successSwAll } = swAll;

  // seasonal cover
  useEffect(() => {
    const d = new Date();
    const pm = persianMonth(d);
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

  const handleChildPagination = () => {
    const isUser = swInfo.id === swNewDetails.id ? 1 : 0; // when 0 displays all children when 1 shows children/needs  created by them
    const take = 15;
    setChildCount(childCount+take)
    setSkip(skip + take);
    console.log(take);
    console.log(skip);
    dispatch(fetchMyPage(swNewDetails, isUser, skip, take));
  };

  return (
    <Card
      sx={{
        padding: '0',
      }}
    >
      <img srcSet={`${cover} 1x, ${cover} 2x`} alt={cover} width="100%" />

      <Grid
        container
        sx={{
          position: 'relative',
        }}
      >
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
          <ContributionOverview swNewDetails={swNewDetails} />
        </Box>
      </Grid>

      <CardContent
        sx={{
          pt: '24px',
          pb: '0 !important',
        }}
      >
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
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <InterestsIcon fontSize="medium" />
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {needCount || <CircularProgress size={15} />}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {theUser &&
                  (theUser.typeId === RolesEnum.ADMIN || theUser.typeId === RolesEnum.SUPER_ADMIN)
                    ? t('myPage.confirmedNeeds')
                    : t('myPage.createdNeeds')}
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    // disabled
                    onClick={handleChildPagination}
                    sx={{ pt: 0 }}
                  >
                    <ChildCareIcon fontSize="medium" />
                    <SwitchAccessShortcutAddIcon />
                  </IconButton>
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {childCount || <CircularProgress size={15} />}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {theUser &&
                  (theUser.typeId === RolesEnum.ADMIN ||
                    theUser.typeId === RolesEnum.SUPER_ADMIN ||
                    theUser.typeId === RolesEnum.SUPER_ADMIN)
                    ? t('myPage.myChildren')
                    : t('myPage.allChildren')}
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <HandshakeIcon fontSize="medium" />
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {signatureCount || <CircularProgress size={15} />}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {t('myPage.signed')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* about profile */}
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
                    {!theUser.firstName ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      `${theUser && theUser.firstName} ${theUser && theUser.lastName}`
                    )}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    {!theUser ? <CircularProgress color="inherit" size={20} /> : theUser.typeName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
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
              <Grid container direction="column" spacing={2} sx={{ p: 2 }}>
                <LoadingButton disabled color="primary" variant="contained" sx={{ mt: 2 }}>
                  {t('button.wallet.connect')}
                </LoadingButton>
                <Grid item>
                  {swInfo &&
                    (swInfo.typeId === RolesEnum.SUPER_ADMIN ||
                      swInfo.typeId === RolesEnum.ADMIN) && (
                      <Autocomplete
                        size="small"
                        value={swNewDetails}
                        id="asynchronous-social-worker"
                        sx={{ minWidth: '210px' }}
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
                          <Box
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
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
                                  {isLoadingSw ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CoverCard.propTypes = {
  childCount: PropTypes.number,
  needCount: PropTypes.number,
  signatureCount: PropTypes.number,
  theUser: PropTypes.object,
  take: PropTypes.number,
  setTake: PropTypes.func,
  swInfo: PropTypes.object,
  swNewDetails: PropTypes.object,
  setSwNewDetails: PropTypes.func,
};

export default CoverCard;
