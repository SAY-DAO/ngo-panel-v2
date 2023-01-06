import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import NeedTable from '../../components/tables/NeedTable';

const NeedList = () => {

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
            <NeedTable />
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default NeedList;
