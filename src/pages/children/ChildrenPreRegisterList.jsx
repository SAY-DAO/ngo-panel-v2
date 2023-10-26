import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import MessageWallet from '../../components/MessageWallet';
import { getPreRegisters } from '../../redux/actions/childrenAction';
import ChildPreRegisterDialog from '../../components/dialogs/ChildPreRegisterDialog';

export default function ChildrenPreRegisterList() {
  const dispatch = useDispatch();

  const [walletToastOpen, setWalletToastOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogValues, setDialogValues] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const signaturesVerification = useSelector((state) => state.signaturesVerification);
  const { error: errorSignaturesVerification } = signaturesVerification;

  const { preRegisterList } = useSelector((state) => state.childPreRegister);

  useEffect(() => {
    dispatch(getPreRegisters());
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // toast
  useEffect(() => {
    if (errorSignaturesVerification) {
      setWalletToastOpen(true);
    }
  }, [errorSignaturesVerification]);

  // close toast
  const handleCloseWalletToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setWalletToastOpen(false);
  };

  const handleDialog = (childId, currentStatus) => {
    setDialogOpen(true);
    setDialogValues({
      childId,
      currentStatus,
    });
  };
  return (
    <Grid container sx={{ height: '100vh', minWidth: '100%' }}>
      {preRegisterList && (
        <Grid container>
          <Grid item>
            <LoadingButton onClick={handleDialog}>
              <AddIcon />
            </LoadingButton>
          </Grid>
          <Grid item>
            <ImageList
              variant="standard"
              cols={5}
              gap={1}
              sx={{ minHeight: '50vh', minWidth: '100%' }}
            >
              {preRegisterList.map((p) => (
                <ImageListItem key={p.id}>
                  {p.name}
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            colSpan={6}
            count={preRegisterList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                'aria-label': 'rows per page',
              },
              native: true,
            }}
            sx={{ position: 'absolute', bottom: 10 }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      )}
      {errorSignaturesVerification && (
        <MessageWallet
          walletError={errorSignaturesVerification}
          walletToastOpen={walletToastOpen}
          handleCloseWalletToast={handleCloseWalletToast}
          severity="error"
        />
      )}
      <ChildPreRegisterDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        dialogValues={dialogValues}
      />
    </Grid>
  );
}
