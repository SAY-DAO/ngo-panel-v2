/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import NgoTable from './NgoTable';
import { fetchNgoList } from '../../redux/actions/NgoAction';

const NgoList = () => {
  const dispatch = useDispatch();

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading, success } = ngoAll;

  useEffect(() => {
    dispatch(fetchNgoList());
  }, [dispatch]);

  const ahmad = [];
  if (ngoList) {
    console.log(ngoList);
    for (const key in ngoList) {
      ahmad.push(ngoList[key]);
    }
  }

  return (
    <>
      {loading ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        success && (
          <PageContainer title="Login" description="this is Login page">
            <Grid>
              <NgoTable ngoList={ahmad} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default NgoList;
