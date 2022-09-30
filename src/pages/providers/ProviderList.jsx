import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import { fetchProviderList } from '../../redux/actions/providerAction';
import ProviderTable from '../../components/tables/ProviderTable';

const ProviderList = () => {
  const dispatch = useDispatch();

  const providerAll = useSelector((state) => state.providerAll);
  const { providerList, loading, success } = providerAll;

  const providerDelete = useSelector((state) => state.providerDelete);
  const { success: successDelete } = providerDelete;

  useEffect(() => {
    dispatch(fetchProviderList());
  }, [dispatch, successDelete]);

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
              <ProviderTable providerList={providerList} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default ProviderList;
