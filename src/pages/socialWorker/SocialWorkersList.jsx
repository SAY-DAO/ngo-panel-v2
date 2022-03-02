import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import EnhancedTable from './SocialWorkerTable';

const SocialWorkersList = () => {
  console.log('hi');
  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid>
        <EnhancedTable />
      </Grid>
    </PageContainer>
  );
};

export default SocialWorkersList;
