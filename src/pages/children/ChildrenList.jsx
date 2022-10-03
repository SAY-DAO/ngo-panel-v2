import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import ChildrenTable from '../../components/tables/ChildrenTable';
import { fetchSwChildList } from '../../redux/actions/socialWorkerAction';

const ChildrenList = () => {
  const dispatch = useDispatch();

  const childAll = useSelector((state) => state.childAll);
  const { myChildren } = childAll;

  const swById = useSelector((state) => state.swById);
  const { children } = swById;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;


  // fetch children
  useEffect(() => {
    if (swInfo) {
      // super admin
      if (swInfo.typeId === 1) {
        dispatch(fetchChildList());
      } else if (swInfo.typeId !== 1) {
        console.
        dispatch(fetchSwChildList(swInfo.id));
      }
    }
  }, [swInfo]);

  return (
    <>
      {!swInfo || (!children && myChildren) ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        (children || myChildren) && (
          <PageContainer title="Children" description="this is Children page">
            <Grid>
              <ChildrenTable childList={children.children} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default ChildrenList;
