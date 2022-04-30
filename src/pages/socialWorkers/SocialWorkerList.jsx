import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import SocialWorkerTable from './SocialWorkerTable';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';

const SocialWorkerList = () => {
  const dispatch = useDispatch();

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading, success } = swAll;

  useEffect(() => {
    dispatch(fetchSocialWorkersList());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        success && (
          <PageContainer title="Login" description="this is Login page">
            <Grid>
              <SocialWorkerTable swList={swList} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default SocialWorkerList;
