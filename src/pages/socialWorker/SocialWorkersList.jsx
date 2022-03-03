import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import SocialWorkerTable from './SocialWorkerTable';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';

const SocialWorkersList = () => {
  const dispatch = useDispatch();

  const swAll = useSelector((state) => state.swAll);
  const { swList } = swAll;

  useEffect(() => {
    if (swList) {
      console.log(swList);
    } else {
      dispatch(fetchSocialWorkersList());
    }
  }, [swList]);

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid>
        <SocialWorkerTable />
      </Grid>
    </PageContainer>
  );
};

export default SocialWorkersList;
