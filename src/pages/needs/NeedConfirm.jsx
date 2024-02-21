import * as React from 'react';
import { Grid } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import NeedConfirmTable from '../../components/tables/NeedConfirmTable';

export default function NeedConfirm() {
  return (
    <PageContainer>
      <Grid>
        <NeedConfirmTable />
      </Grid>
    </PageContainer>
  );
}
