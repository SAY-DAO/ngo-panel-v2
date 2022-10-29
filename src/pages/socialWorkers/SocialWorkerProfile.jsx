import React, { useEffect } from 'react';
import { Card, CircularProgress, Divider, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/profile/CoverCard';
import TaskCard from '../../components/profile/TaskCard';
import { fetchSwNeedList } from '../../redux/actions/needsAction';
import { fetchSwChildList } from '../../redux/actions/socialWorkerAction';
import { RolesEnum } from '../../utils/helpers';
import { fetchChildList } from '../../redux/actions/childrenAction';

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

  // const swById = useSelector((state) => state.swById);
  // const { children } = swById;

  // const childAll = useSelector((state) => state.childAll);
  // const { myChildren } = childAll;

  useEffect(() => {
    if (swInfo) {
      dispatch(fetchSwNeedList());
      if (swInfo.typeId === RolesEnum.ADMIN || swInfo.typeId === RolesEnum.SUPER_ADMIN) {
        dispatch(fetchChildList());
      } else {
        dispatch(fetchSwChildList(swInfo.id));
      }
    }
  }, [swInfo]);

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
              hi
              <Divider />
              <Grid container spacing={0}>
                <Grid item xs={4}>
                  <TaskCard />
                </Grid>
                <Grid item xs={4}>
                  <TaskCard />
                </Grid>
                <Grid item xs={4}>
                  <TaskCard />
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
