import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/my-profile/CoverCard';
import TaskCard from '../../components/my-profile/TaskCard';
import { fetchMyPage } from '../../redux/actions/userAction';
import { RolesEnum } from '../../utils/helpers';
import { MY_PAGE_RESET } from '../../redux/constants/userConstants';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [take, setTake] = useState(10);
  const [openSocialWorkers, setOpenSocialWorker] = useState(false);
  const [optionsSocialWorkers, setOptionsSwList] = useState([]);
  const isLoadingSw = openSocialWorkers && optionsSocialWorkers.length === 0;
  const [swNewDetails, setSwNewDetails] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { data, loading: loadingProfile } = myPage;

  const swAll = useSelector((state) => state.swAll);
  const { swList, success: successSwAll } = swAll;

  useEffect(() => {
    if (swInfo) setSwNewDetails(swInfo);
  }, [swInfo]);

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
    if (!openSocialWorkers) {
      setOptionsSwList([]);
    } else if (openSocialWorkers) {
      dispatch(fetchSocialWorkersList());
    }
  }, [openSocialWorkers, setOpenSocialWorker, swNewDetails]);

  useEffect(() => {
    let createdBy;
    let confirmedBy;
    let purchasedBy;

    if (swNewDetails) {
      if (swNewDetails.typeId === RolesEnum.ADMIN || swNewDetails.typeId === RolesEnum.SUPER_ADMIN) {
        createdBy = 0;
        confirmedBy = swNewDetails.id;
        purchasedBy = 0;
      } else if (swNewDetails.typeId === RolesEnum.COORDINATOR) {
        createdBy = 0;
        confirmedBy = 0;
        purchasedBy = swNewDetails.id;
      } else if (
        swNewDetails.typeId === RolesEnum.SOCIAL_WORKER ||
        swNewDetails.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        createdBy = swNewDetails.id;
        confirmedBy = 0;
        purchasedBy = 0;
      }
      dispatch(fetchMyPage({ take, createdBy, confirmedBy, purchasedBy }));
    }
    return () => {
      dispatch({ type: MY_PAGE_RESET });
    };
  }, [swNewDetails, take]);

  const handleChange = (event) => {
    setTake(event.target.value);
  };
  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      {swInfo ? (
        <>
          <CoverCard swId={(swNewDetails && swNewDetails.id) || swInfo.id} />
          <Grid container spacing={0}>
            <Card sx={{ width: '100%', minHeight: '500px' }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item>
                  {swInfo &&
                    (swInfo.typeId === RolesEnum.SUPER_ADMIN ||
                      swInfo.typeId === RolesEnum.ADMIN) && (
                      <Autocomplete
                        defaultValue={{
                          id: swInfo.id,
                          firstName: swInfo.firstName,
                          lastName: swInfo.lastName,
                          typeName: swInfo.typeName,
                        }}
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
                    >
                      <MenuItem value={10}>{t('myProfile.countRecent.count.ten')}</MenuItem>
                      <MenuItem value={50}>{t('myProfile.countRecent.count.fifty')}</MenuItem>
                      <MenuItem value={100}>{t('myProfile.countRecent.count.hundred')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider />
              {loadingProfile ? (
                <Grid sx={{ textAlign: 'center' }}>
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid container spacing={0}>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>{t('myProfile.taskManager.title.notPaid')}</Typography>
                      {data &&
                        data.needs[0] &&
                        data &&
                        data.needs[0].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>{t('myProfile.taskManager.title.paid')}</Typography>
                      {data &&
                        data.needs[1] &&
                        data &&
                        data.needs[1].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>{t('myProfile.taskManager.title.purchased')}</Typography>
                      {data &&
                        data.needs[2] &&
                        data &&
                        data.needs[2].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>{t('myProfile.taskManager.title.done')}</Typography>
                      {data &&
                        data.needs[3] &&
                        data &&
                        data.needs[3].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Card>
          </Grid>
        </>
      ) : (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
    </PageContainer>
  );
};

export default MyProfile;
