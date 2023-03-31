import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import AnalyticNeedTimeLine from '../../components/dao/ChartOne/AnalyticNeedTimeLine';
import AnalyticChildrenNeeds from '../../components/dao/ChartTwo/AnalyticChildrenNeeds';
import AnalyticChildSummary from '../../components/dao/ChartTwo/AnalyticChildSummary';
import NgoTreeview from '../../components/dao/ChartTwo/NgoTreeview';

const Dao = () => {
  return (
    <>
      <PageContainer>
        <Grid container direction="row">
          <Grid item xs={12}>
            <AnalyticChildSummary />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AnalyticChildrenNeeds />
        </Grid>
        <Grid item xs={12}>
          <AnalyticNeedTimeLine />
        </Grid>
        <Grid item xs={12}>
          <NgoTreeview />
        </Grid>
      </PageContainer>
    </>
  );
};

export default Dao;
