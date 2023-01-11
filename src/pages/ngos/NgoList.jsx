/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import NgoTable from '../../components/tables/NgoTable';

const NgoList = () => {
  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading, success } = ngoAll;

  return (
    <>
      {loading ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        success && (
          <PageContainer>
            <Grid>
              <NgoTable ngoList={ngoList} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default NgoList;
