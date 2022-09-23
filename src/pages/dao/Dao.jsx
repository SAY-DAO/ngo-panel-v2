import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import PageContainer from '../../components/container/PageContainer';
import {
  fetchNestChildren,
  fetchNestNeeds,
  fetchNestUsers,
  updateNestServer,
} from '../../redux/actions/dao/DaoAction';
import DaoNeedStatus from './DaoNeedStatus';
import DaoChildStatus from './DaoChildstatus.';
import DaoUserStatus from './DaoUserStatus';

const Dao = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails } = swDetails;

  const server = useSelector((state) => state.server);
  const { updated, needList, loading: loadingServer } = server;

  useEffect(() => {
    dispatch(fetchNestNeeds());
    dispatch(fetchNestChildren());
    dispatch(fetchNestUsers());
  }, [updated]);

  let count;
  const handleUpdateNestServer = () => {
    let skip = needList && needList.needs.meta.totalItems;
    skip += 1000;
    count = 500;
    console.log(count, skip);
    dispatch(updateNestServer(count, skip));
  };

  return (
    <>
      {loadingSwDetails ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <PageContainer>
          <Grid item>
            <LoadingButton loading={loadingServer} onClick={handleUpdateNestServer}>
              sync
            </LoadingButton>
            Nest.js Server
          </Grid>
          <Grid container direction="row">
            <Grid item xs={6}>
              <DaoNeedStatus />
            </Grid>
            <Grid item xs={6}>
              <DaoChildStatus />
            </Grid>
            <Grid item xs={6}>
              <DaoUserStatus />
            </Grid>
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default Dao;
