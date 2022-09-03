import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import PageContainer from '../../components/container/PageContainer';
import {
  fetchNestChildren,
  fetchNestNeeds,
  updateNestServer,
} from '../../redux/actions/dao/DaoAction';
import DaoNeedStatus from './DaoNeedStatus';
import DaoChildStatus from './DaoChildstatus.';

const list = [];
let skip = 0;

const Dao = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails } = swDetails;

  const server = useSelector((state) => state.server);
  const { updated, loading: loadingServer } = server;

  useEffect(() => {
    dispatch(fetchNestNeeds());
    dispatch(fetchNestChildren());
  }, [updated]);

  let count;
  const handleupdateNestServer = () => {
    count = 500;
    list.push(updated && updated.needs);
    console.log(count, skip);
    dispatch(updateNestServer(count, skip));
    skip += 500;
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
            <LoadingButton loading={loadingServer} onClick={handleupdateNestServer}>
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
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default Dao;
