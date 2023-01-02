import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import ChildrenTable from '../../components/tables/ChildrenTable';
import { fetchSwChildList } from '../../redux/actions/socialWorkerAction';
import { fetchChildList } from '../../redux/actions/childrenAction';

const ChildrenList = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren } = childAll;

  const swById = useSelector((state) => state.swById);
  const { children } = swById;


  // fetch children
  useEffect(() => {
    if (swInfo) {
      // super admin
      if (swInfo.typeId === 1) {
        dispatch(fetchChildList()); // all => confirm=2, existence_status=1
      } else if (swInfo.typeId !== 1) {
        dispatch(fetchSwChildList());
      }
    }
  }, [swInfo]);

  return (
    <>
      {!swInfo || (!children && !myChildren) ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        (children || myChildren) && (
          <PageContainer title="Children" description="this is Children page">
            <Grid>
              <ChildrenTable childList={children ? children.children : myChildren} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default ChildrenList;
