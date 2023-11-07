import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import AnalyticNeedTimeLine from '../../components/dao/ChartOne/AnalyticNeedTimeLine';
import AnalyticChildrenNeeds from '../../components/dao/ChartTwo/AnalyticChildrenNeeds';
import AnalyticChildSummary from '../../components/dao/ChartTwo/AnalyticChildSummary';
import NgoTreeview from '../../components/dao/ChartTwo/NgoTreeview';
import AnalyticFamilyDelivered from '../../components/dao/ChartOne/AnalyticFamilyDelivered';
import AnalyticChildFamily from '../../components/dao/ChartTwo/AnalyticChildFamily';
import AnalyticChildFamilyInOneMonth from '../../components/dao/ChartTwo/AnalyticChildFamilyInOneMonth';
import AnalyticChildFamilyInThreeMonths from '../../components/dao/ChartTwo/AnalyticChildFamilyInThreeMonths';
import { deleteCandidates, deleteOldNeeds } from '../../redux/actions/needsAction';

const Dao = () => {
  const dispatch = useDispatch();

  const { candidates, loading } = useSelector((state) => state.deletedOld);

  useEffect(() => {
    dispatch(deleteCandidates());
  }, []);

  return (
    <>
      <PageContainer>
        <Grid container direction="row">
          <Grid item sx={{ textAlign: 'center' }} xs={12}>
            <Typography>total: {(candidates && candidates.total) || 0}</Typography>
            <LoadingButton
              loading={loading}
              variant="outlined"
              color="danger"
              onClick={() => dispatch(deleteOldNeeds())}
            >
              DELETE OLD NEEDS
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            <AnalyticChildSummary />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AnalyticChildrenNeeds />
        </Grid>
        <Grid item xs={12}>
          <AnalyticChildFamily />
        </Grid>
        <Grid item xs={12}>
          <AnalyticChildFamilyInOneMonth />
        </Grid>
        <Grid item xs={12}>
          <AnalyticChildFamilyInThreeMonths />
        </Grid>
        <Grid item xs={12}>
          <AnalyticNeedTimeLine />
        </Grid>
        <Grid item xs={12}>
          <NgoTreeview />
        </Grid>
        <Grid item xs={12}>
          <AnalyticFamilyDelivered />
        </Grid>
      </PageContainer>
    </>
  );
};

export default Dao;
