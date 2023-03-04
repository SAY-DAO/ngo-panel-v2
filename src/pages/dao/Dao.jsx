import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import PageContainer from '../../components/container/PageContainer';
import {
  fetchNestChildren,
  fetchNestNeeds,
  fetchNestNgos,
  fetchNestUsers,
} from '../../redux/actions/blockchainAction';
import DaoNeedStatus from './DaoNeedStatus';
import DaoChildStatus from './DaoChildStatus';
import DaoFamilyStatus from './DaoFamilyStatus';
import DaoSocialWorkerStatus from './DaoSocialWorkerStatus';
import DaoNgoStatus from './DaoNgoStatus';

const Dao = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails } = swDetails;

  useEffect(() => {
    dispatch(fetchNestNeeds());
    dispatch(fetchNestChildren());
    dispatch(fetchNestUsers());
    dispatch(fetchNestNgos());
  }, []);

  // let count;
  const handleUpdateNestServer = () => {
    // let skip = needList && needList.needs.meta.totalItems;
    // skip += 1000;
    // count = 500;
    // console.log(count, skip);
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
            <LoadingButton onClick={handleUpdateNestServer}>sync</LoadingButton>
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
              <DaoFamilyStatus />
            </Grid>
            <Grid item xs={6}>
              <DaoSocialWorkerStatus />
            </Grid>
            <Grid item xs={6}>
              <DaoNgoStatus />
            </Grid>
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default Dao;
