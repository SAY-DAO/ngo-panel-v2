/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import NgoTable from '../../components/tables/NgoTable';
import { fetchNgoList } from '../../redux/actions/ngoAction';

const NgoList = () => {
  const dispatch = useDispatch();

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading, success } = ngoAll;

  useEffect(() => {
    dispatch(fetchNgoList());
  }, [dispatch]);

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
