import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import ChildrenTable from '../../components/tables/ChildrenTable';

const ChildrenList = () => {
  return (
    <>
      <PageContainer title="Children" description="this is Children page">
        <Grid>
          <ChildrenTable />
        </Grid>
      </PageContainer>
    </>
  );
};

export default ChildrenList;
