import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import InterestsIcon from '@mui/icons-material/Interests';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import HandshakeIcon from '@mui/icons-material/Handshake';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';
import cover from '../../assets/images/cover.jpg';
import { RolesEnum } from '../../utils/helpers';

const CoverCard = ({
  theUser,
  childCount,
  needCount,
  signatureCount,
  take,
  setTake,
  swInfo,
  swNewDetails,
  setSwNewDetails,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, success: successProfile } = myPage;

  const [openSocialWorkers, setOpenSocialWorker] = useState(false);
  const [optionsSocialWorkers, setOptionsSwList] = useState([]);

  const isLoadingSw = openSocialWorkers && optionsSocialWorkers.length === 0;
  const swAll = useSelector((state) => state.swAll);
  const { swList, success: successSwAll } = swAll;

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

  const handleChange = (event) => {
    setTake(event.target.value);
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
            bottom: '20px',
            right: '20px',
            color: 'white',
            paddingLeft: '10px',
            paddingRight: '20px',
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.default,
            opacity: '50%',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.background.default,
              opacity: [0.9, 0.8, 0.7],
            },
          }}
        >
          {swNewDetails.typeId === RolesEnum.ADMIN ||
          swNewDetails.typeId === RolesEnum.SUPER_ADMIN ? (
            <Typography>
              <strong>{t('myPage.countJobs.titleConfirmed')}</strong>
            </Typography>
          ) : (
            <Typography>
              <strong>{t('myPage.countJobs.titleCreated')}</strong>
            </Typography>
          )}

          {!successProfile ? (
            <CircularProgress size={15} />
          ) : (
            <Typography>
              {t('myPage.countJobs.count.first')}: {pageDetails.timeLine.inTwoDays}
            </Typography>
          )}
          {!successProfile ? (
            <CircularProgress size={15} />
          ) : (
            <Typography>
              {t('myPage.countJobs.count.second')}: {pageDetails.timeLine.inWeek}
            </Typography>
          )}
          {!successProfile ? (
            <CircularProgress size={15} />
          ) : (
            <Typography>
              {t('myPage.countJobs.count.third')}: {pageDetails.timeLine.inMonth}
            </Typography>
          )}
        </Box>
      </Grid>

      <CardContent
        sx={{
          pt: '24px',
          pb: '28px',
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
                  <ChildCareIcon fontSize="medium" />
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
                    padding: '4px',
                    borderRadius: '50%',
                    border: (theme) =>
                      `${theme.palette.mode === 'dark' ? '3px solid #3c414c' : '3px solid #fff'}`,
                    width: '110px',
                    height: '110px',
                    overflow: 'hidden',
                    margin: '0 auto',
                  }}
                >
                  <Avatar
                    src={theUser && theUser.avatarUrl}
                    alt="Social worker avatar"
                    sx={{
                      borderRadius: '50%',
                      width: '96px',
                      height: '96px',
                      border: (theme) =>
                        `${theme.palette.mode === 'dark' ? '4px solid #3c414c' : '4px solid #fff'}`,
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
                  <LoadingButton disabled color="primary" variant="contained" sx={{ mt: 2 }}>
                    {t('button.wallet.connect')}
                  </LoadingButton>
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
                <Grid item>
                  {swInfo &&
                    (swInfo.typeId === RolesEnum.SUPER_ADMIN ||
                      swInfo.typeId === RolesEnum.ADMIN) && (
                      <Autocomplete
                        size="small"
                        value={swNewDetails}
                        id="asynchronous-social-worker"
                        sx={{ minWidth: '300px' }}
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
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t('myPage.countRecent.title')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: '200px' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={take}
                      label={t('myPage.countRecent.title')}
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={100}>{t('myPage.countRecent.count.first')}</MenuItem>
                      <MenuItem value={250}>{t('myPage.countRecent.count.second')}</MenuItem>
                      <MenuItem value={500}>{t('myPage.countRecent.count.third')}</MenuItem>
                    </Select>
                  </FormControl>
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
