import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import ChildrenTable from '../../components/tables/ChildrenTable';

const ChildrenList = () => {
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
          <PageContainer title="Children" description="this is Children page">
            <Grid>
              <ChildrenTable ngoList={ngoList} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default ChildrenList;
