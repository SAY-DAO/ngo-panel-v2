import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import { fetchSocialWorkerDetails } from '../../redux/actions/socialWorkerAction';
import NeedTable from '../../components/tables/NeedTable';

const NeedList = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails, success: successSwDetails } = swDetails;

  useEffect(() => {
    if (!successSwDetails) {
      dispatch(fetchSocialWorkerDetails());
    }
  }, [successSwDetails]);

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
