import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import ReportStatusTable from '../../components/tables/ReportStatusTable';

const ReportStatus = () => {
  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails } = swDetails;

  return (
    <>
      {loadingSwDetails ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <PageContainer>
          <Grid>
            <ReportStatusTable />
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default ReportStatus;
