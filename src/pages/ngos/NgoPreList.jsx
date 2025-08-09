import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import NgoTable from '../../components/tables/NgoTable';
import { fetchNgoPreList } from '../../redux/actions/ngoAction';

const NgoPreList = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const ngoPreRegister = useSelector((state) => state.ngoPreRegister);
  const { ngosPreRegisterList, loading, success } = ngoPreRegister;

  useEffect(() => {
    dispatch(fetchNgoPreList(page, rowsPerPage));
    return () => {};
  }, []);

  console.log(ngosPreRegisterList);

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
              <NgoTable
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                ngoList={ngosPreRegisterList.data}
              />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default NgoPreList;
