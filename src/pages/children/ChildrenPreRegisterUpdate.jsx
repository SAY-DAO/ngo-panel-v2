import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@mui/material';
import AddStepper from '../../components/children/AddStepper';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';

function ChildrenPreRegisterUpdate() {
  const { t } = useTranslation();
  const BCrumb = [
    {
      to: '/children/list',
      title: t('BCrumb.childrenList'),
    },
    {
      title: t('BCrumb.add'),
    },
  ];

  return (
    <Grid container title="Child Add" description="this is Child Add page">
      {/* breadcrumb */}
      <Grid item xs={12}>
        <Breadcrumb items={BCrumb} />
      </Grid>
      {/* end breadcrumb */}
      <Grid item xs={12}>
        <Card sx={{ minHeight: 600, m: 'auto', mt: 6, maxWidth: '80%' }}>
          <AddStepper />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ChildrenPreRegisterUpdate;
