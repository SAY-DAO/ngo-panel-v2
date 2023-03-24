import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import ProviderForm from '../../components/forms/ProviderForm';

const BCrumb = [
  {
    to: '/provider/list',
    title: 'Providers List',
  },
  {
    title: 'Add',
  },
];

const ProviderAdd = () => {
  return (
    <PageContainer title="Provider Add" description="this is Provider Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container sx={{ pl: 12, pr: 12}}>
        <Breadcrumb title="Add page" subtitle="Provider" />
        <ProviderForm />
      </Grid>
    </PageContainer>
  );
};

export default ProviderAdd;
