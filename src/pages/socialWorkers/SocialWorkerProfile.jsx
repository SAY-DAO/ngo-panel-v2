import React, { useEffect } from 'react';
import { Card, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/profile/CoverCard';
import TaskCard from '../../components/profile/TaskCard';
import { fetchSocialWorkerProfile } from '../../redux/actions/socialWorkerAction';
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
} from '../../utils/helpers';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'User Profile',
  },
];

const SocialWorkerProfile = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const swProfile = useSelector((state) => state.swProfile);
  const { profile } = swProfile;

  const organizedNeeds = [[], [], [], []]; // [[not paid], [payment], [purchased/delivered Ngo], [Done]]
  if (profile && profile.items) {
    for (let i = 0; i < profile.items.length; i++) {
      // not Paid
      if (profile.items[i].status === 0) {
        organizedNeeds[0].push(profile.items[i]);
      }
      // Payment Received
      else if (
        profile.items[i].status === PaymentStatusEnum.PARTIAL_PAY ||
        profile.items[i].status === PaymentStatusEnum.COMPLETE_PAY
      ) {
        organizedNeeds[1].push(profile.items[i]);
      }

      if (profile.items[i].type === NeedTypeEnum.SERVICE) {
        // Payment sent to NGO
        if (profile.items[i].status === ServiceStatusEnum.MONEY_TO_NGO) {
          organizedNeeds[2].push(profile.items[i]);
        }
        // Delivered to child
        if (profile.items[i].status === ServiceStatusEnum.DELIVERED) {
          organizedNeeds[3].push(profile.items[i]);
        }
      } else if (profile.items[i].type === NeedTypeEnum.PRODUCT) {
        // Purchased
        if (profile.items[i].status === ProductStatusEnum.PURCHASED_PRODUCT) {
          organizedNeeds[2].push(profile.items[i]);
        }
        // Delivered to Ngo
        if (profile.items[i].status === ProductStatusEnum.DELIVERED_TO_NGO) {
          organizedNeeds[2].push(profile.items[i]);
        }
        // Delivered to child
        if (profile.items[i].status === ProductStatusEnum.DELIVERED) {
          organizedNeeds[3].push(profile.items[i]);
        }
      }
    }
  }
  console.log(organizedNeeds);

  useEffect(() => {
    dispatch(fetchSocialWorkerProfile());
  }, []);

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      {/* breadcrumb */}
      <Breadcrumb title="User Profile" items={BCrumb} />
      {/* end breadcrumb */}
      {swInfo ? (
        <>
          <CoverCard swInfo={swInfo} />
          <Grid container spacing={0}>
            <Card sx={{ width: '100%', minHeight: '500px' }}>
              <Divider />
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
