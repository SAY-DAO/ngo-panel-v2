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
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/profile/CoverCard';
import TaskCard from '../../components/profile/TaskCard';
import {
  fetchSocialWorkerProfile,
  fetchSocialWorkersList,
  fetchSupervisorProfile,
} from '../../redux/actions/socialWorkerAction';
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  RolesEnum,
  ServiceStatusEnum,
} from '../../utils/helpers';


const SocialWorkerProfile = () => {
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(10);
  const [openSocialWorkers, setOpenSocialWorker] = useState(false);
  const [optionsSocialWorkers, setOptionsSwList] = useState([]);
  const isLoadingSw = openSocialWorkers && optionsSocialWorkers.length === 0;
  const [swNewDetails, setNewSwDetails] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const swProfile = useSelector((state) => state.swProfile);
  const { profile, loading: loadingProfile } = swProfile;

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
    if (!openSocialWorkers) {
      setOptionsSwList([]);
    } else if (openSocialWorkers) {
      dispatch(fetchSocialWorkersList());
    }
  }, [openSocialWorkers, setOpenSocialWorker, swNewDetails]);

  const organizedNeeds = [[], [], [], []]; // [[not paid], [payment], [purchased/delivered Ngo], [Done]]
  if (profile && profile.needs && profile.needs.items) {
    for (let i = 0; i < profile.needs.items.length; i++) {
      // not Paid
      if (profile.needs.items[i].status === 0) {
        organizedNeeds[0].push(profile.needs.items[i]);
      }
      // Payment Received
      else if (
        profile.needs.items[i].status === PaymentStatusEnum.PARTIAL_PAY ||
        profile.needs.items[i].status === PaymentStatusEnum.COMPLETE_PAY
      ) {
        organizedNeeds[1].push(profile.needs.items[i]);
      }

      if (profile.needs.items[i].type === NeedTypeEnum.SERVICE) {
        // Payment sent to NGO
        if (profile.needs.items[i].status === ServiceStatusEnum.MONEY_TO_NGO) {
          organizedNeeds[2].push(profile.needs.items[i]);
        }
        // Delivered to child
        if (profile.needs.items[i].status === ServiceStatusEnum.DELIVERED) {
          organizedNeeds[3].push(profile.needs.items[i]);
        }
      } else if (profile.needs.items[i].type === NeedTypeEnum.PRODUCT) {
        // Purchased
        if (profile.needs.items[i].status === ProductStatusEnum.PURCHASED_PRODUCT) {
          organizedNeeds[2].push(profile.needs.items[i]);
        }
        // Delivered to Ngo
        if (profile.needs.items[i].status === ProductStatusEnum.DELIVERED_TO_NGO) {
          organizedNeeds[2].push(profile.needs.items[i]);
        }
        // Delivered to child
        if (profile.needs.items[i].status === ProductStatusEnum.DELIVERED) {
          organizedNeeds[3].push(profile.needs.items[i]);
        }
      }
    }
  }
  console.log('organized Needs');
  console.log(organizedNeeds);

  useEffect(() => {
    if (!swNewDetails && swInfo) {
      if (swInfo && swInfo.typeId === RolesEnum.SAY_SUPERVISOR) {
        dispatch(fetchSupervisorProfile(swInfo.id, limit));
      }
      if (swInfo && swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        dispatch(fetchSocialWorkerProfile(swInfo.id, limit));
      }
      if (swInfo && swInfo.typeId === RolesEnum.COORDINATOR) {
        // dispatch(fetchContributorProfile(swInfo.id, limit));
      }
    }
    // using AutoComplete
    if (swNewDetails) {
      if (swNewDetails.typeId === RolesEnum.SAY_SUPERVISOR) {
        dispatch(fetchSupervisorProfile(swNewDetails.id, limit));
      }
      if (swNewDetails.typeId === RolesEnum.SOCIAL_WORKER || swNewDetails.typeId === RolesEnum.NGO_SUPERVISOR) {
        dispatch(fetchSocialWorkerProfile(swNewDetails.id, limit));
      }
      if (swNewDetails.typeId === RolesEnum.COORDINATOR) {
        // dispatch(fetchContributorProfile(swNewDetails.id, limit));
      }
    }
  }, [swNewDetails, swInfo, limit]);

  const handleChange = (event) => {
    setLimit(event.target.value);
  };
  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <Grid container spacing={2} justifyContent="center">
        {swInfo && swInfo.typeId === RolesEnum.SUPER_ADMIN && (
          <Grid item>
            <Autocomplete
              id="asynchronous-social-worker"
              sx={{ minWidth: '380px' }}
              open={openSocialWorkers}
              onOpen={() => {
                setOpenSocialWorker(true);
              }}
              onClose={() => {
                setOpenSocialWorker(false);
              }}
              options={optionsSocialWorkers}
              onChange={(e, value) => setNewSwDetails(value && value)}
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
                  label="View As ..."
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
          </Grid>
        )}
      </Grid>
      {swInfo ? (
        <>
          <CoverCard swId={swNewDetails && swNewDetails.id || swInfo.id} />
          <Grid container spacing={0}>
            <Card sx={{ width: '100%', minHeight: '500px' }}>
              <Grid container justifyContent="center" sx={{ p: 2 }}>
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Display Recent Created needs
                    </InputLabel>
                    <Select
                      sx={{ minWidth: '200px' }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={limit}
                      label="Display Recent Created needs"
                      onChange={handleChange}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={50}>Fifty</MenuItem>
                      <MenuItem value={100}>Hundred</MenuItem>
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
                      <Typography>Not Paid</Typography>
                      {organizedNeeds[0] &&
                        organizedNeeds[0].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>Payment</Typography>
                      {organizedNeeds[1] &&
                        organizedNeeds[1].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>Transferred/Purchased</Typography>
                      {organizedNeeds[2] &&
                        organizedNeeds[2].map((need) => <TaskCard key={need.id} need={need} />)}
                    </Card>
                  </Grid>
                  <Grid item xs={3}>
                    <Card elevation={4}>
                      <Typography>Done</Typography>
                      {organizedNeeds[3] &&
                        organizedNeeds[3].map((need) => <TaskCard key={need.id} need={need} />)}
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

export default SocialWorkerProfile;
