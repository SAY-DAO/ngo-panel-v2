import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, Container, Grid, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { PropTypes } from 'prop-types';
import { getChildrenPreRegisters } from '../../redux/actions/childrenAction';
import ChildPreRegisterCreateDialog from '../dialogs/ChildPreRegisterCreateDialog';
import GenericDialog from '../dialogs/GenericDialog';
import ChildPreRegisterApproveDialog from '../dialogs/ChildPreRegisterApproveDialog';
import PreRegisterCard from './PreRegisterCard';
import { FlaskUserTypesEnum } from '../../utils/types';
import ChildPreRegisterUpdateDialog from '../dialogs/ChildPreRegisterUpdateDialog ';
import { CHECK_SIMILAR_NAMES_RESET } from '../../redux/constants/childrenConstants';
import collaborators from '../../utils/temp';

export default function ChildrenPreRegisterTabList({ isConfirmed, tabNumber }) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [dialogValues, setDialogValues] = useState();
  const [deleteDialogValues, setDeleteDialogValues] = useState();
  const [approveDialogValues, setApproveDialogValues] = useState();
  const [updateDialogValues, setUpdateDialogValues] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [selected, setSelected] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const { childrenPreRegisterList, assigned, updated, added, deleted, approved } = useSelector(
    (state) => state.childPreRegister,
  );

  useEffect(() => {
    dispatch(getChildrenPreRegisters(tabNumber, page, rowsPerPage, isConfirmed));
  }, [deleted, assigned, updated, added, approved, tabNumber, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialog = (childId, currentStatus) => {
    dispatch({ type: CHECK_SIMILAR_NAMES_RESET });
    setSelected();
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
          <LoadingButton onClick={handleDialog} disabled={collaborators.includes(swInfo.id)}>
            <AddIcon />
          </LoadingButton>
        )}
      <Grid container sx={{ minWidth: '100%' }}>
        {!childrenPreRegisterList || (childrenPreRegisterList && !childrenPreRegisterList.data) ? (
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
              {childrenPreRegisterList &&
                childrenPreRegisterList.data &&
                (tabNumber === 0
                  ? childrenPreRegisterList.data.filter((p) => !p.voiceUrl)
                  : childrenPreRegisterList.data
                )
                  // .filter((pr) => !pr.isConfirmed)
                  .map((p) => (
                    <ImageListItem key={p.id}>
                      <PreRegisterCard
                        setDeleteDialogValues={setDeleteDialogValues}
                        setApproveDialogValues={setApproveDialogValues}
                        preRegistered={p}
                        setOpenDelete={setOpenDelete}
                        setOpenApprove={setOpenApprove}
                        setOpenUpdate={setOpenUpdate}
                        setUpdateDialogValues={setUpdateDialogValues}
                      />
                    </ImageListItem>
                  ))}
            </ImageList>
            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component="div"
              colSpan={6}
              count={childrenPreRegisterList.meta.totalItems}
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
        <ChildPreRegisterCreateDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          dialogValues={dialogValues}
          selected={selected}
          setSelected={setSelected}
        />
        <GenericDialog
          open={openDelete}
          setOpen={setOpenDelete}
          dialogValues={deleteDialogValues}
        />
        <ChildPreRegisterUpdateDialog
          open={openUpdate}
          setOpen={setOpenUpdate}
          setUpdateDialogValues={setUpdateDialogValues}
          updateDialogValues={updateDialogValues}
        />
        <ChildPreRegisterApproveDialog
          open={openApprove}
          setOpen={setOpenApprove}
          dialogValues={approveDialogValues}
        />
      </Grid>
    </Container>
  );
}

ChildrenPreRegisterTabList.propTypes = {
  isConfirmed: PropTypes.bool,
  tabNumber: PropTypes.number,
};
