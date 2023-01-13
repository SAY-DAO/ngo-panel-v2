import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
                    ? t('myProfile.confirmedNeeds')
                    : t('myProfile.createdNeeds')}
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
                    ? t('myProfile.myChildren')
                    : t('myProfile.allChildren')}
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
                  {t('myProfile.signed')}
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
                  <Button
                    disabled
                    color="primary"
                    variant="contained"
                    size="small"
                    sx={{
                      height: '40px',
                      backgroundColor: '#f4b58f',
                      pl: '18px',
                      pr: '18px',
                      ml: 1,
                      mt: { xs: 1, sm: 0, lg: 0 },
                    }}
                  >
                    {t('button.wallet.connect')}
                  </Button>
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
                            label={t('myProfile.viewAs')}
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
                      {t('myProfile.countRecent.title')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: '200px' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={take}
                      label={t('myProfile.countRecent.title')}
                      onChange={handleChange}
                      size="small"
                    >
                      <MenuItem value={10}>{t('myProfile.countRecent.count.ten')}</MenuItem>
                      <MenuItem value={50}>{t('myProfile.countRecent.count.fifty')}</MenuItem>
                      <MenuItem value={100}>{t('myProfile.countRecent.count.hundred')}</MenuItem>
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
