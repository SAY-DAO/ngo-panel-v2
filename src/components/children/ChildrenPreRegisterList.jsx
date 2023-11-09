import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Container, Grid, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { PropTypes } from 'prop-types';
import { getPreRegisters } from '../../redux/actions/childrenAction';
import ChildPreRegisterAddDialog from '../dialogs/ChildPreRegisterAddDialog';
import GenericDialog from '../dialogs/GenericDialog';
import ChildPreRegisterApproveDialog from '../dialogs/ChildPreRegisterApproveDialog';
import PreRegisterCard from './PreRegisterCard';
import { FlaskUserTypesEnum } from '../../utils/types';

export default function ChildrenPreRegisterList({ isConfirmed, tabNumber }) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [dialogValues, setDialogValues] = useState();
  const [deleteDialogValues, setDeleteDialogValues] = useState();
  const [resetDialogValues, setResetDialogValues] = useState();
  const [approveDialogValues, setApproveDialogValues] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const { preRegisterList, updated, added, deleted, approved } = useSelector(
    (state) => state.childPreRegister,
  );

  useEffect(() => {
    dispatch(getPreRegisters(tabNumber, page, rowsPerPage, isConfirmed));
  }, [deleted, updated, added, approved, tabNumber, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialog = (childId, currentStatus) => {
    setDialogOpen(true);
    setDialogValues({
      childId,
      currentStatus,
    });
  };

  return (
    <Container>
      {!isConfirmed &&
        tabNumber === 0 &&
        swInfo &&
        (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
          swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
          <LoadingButton onClick={handleDialog}>
            <AddIcon />
          </LoadingButton>
        )}
      <Grid container sx={{ minWidth: '100%' }}>
        {!preRegisterList || (preRegisterList && !preRegisterList.data) ? (
          <Grid item sx={{ textAlign: 'center' }} xs={12}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container justifyContent="center">
            <ImageList
              variant="standard"
              cols={3}
              gap={5}
              sx={{ minWidth: '100%', minHeight: 600 }}
            >
              {preRegisterList &&
                preRegisterList.data &&
                (tabNumber === 0
                  ? preRegisterList.data.filter((p) => !p.voiceUrl)
                  : preRegisterList.data
                )
                  // .filter((pr) => !pr.isConfirmed)
                  .map((p) => (
                    <ImageListItem key={p.id}>
                      <PreRegisterCard
                        setDeleteDialogValues={setDeleteDialogValues}
                        setApproveDialogValues={setApproveDialogValues}
                        setResetDialogValues={setResetDialogValues}
                        preRegistered={p}
                        setOpenDelete={setOpenDelete}
                        setOpenReset={setOpenReset}
                        setOpenApprove={setOpenApprove}
                      />
                    </ImageListItem>
                  ))}
            </ImageList>
            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component="div"
              colSpan={6}
              count={preRegisterList.meta.totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        )}
        <ChildPreRegisterAddDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          dialogValues={dialogValues}
        />
        <GenericDialog
          open={openDelete}
          setOpen={setOpenDelete}
          dialogValues={deleteDialogValues}
        />
        <GenericDialog open={openReset} setOpen={setOpenReset} dialogValues={resetDialogValues} />
        <ChildPreRegisterApproveDialog
          open={openApprove}
          setOpen={setOpenApprove}
          dialogValues={approveDialogValues}
        />
      </Grid>
    </Container>
  );
}

ChildrenPreRegisterList.propTypes = {
  isConfirmed: PropTypes.bool,
  tabNumber: PropTypes.number,
};
