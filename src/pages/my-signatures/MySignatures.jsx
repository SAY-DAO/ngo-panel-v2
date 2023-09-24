import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TablePagination } from '@mui/material';
import { fetchAllSignatures, fetchUserSignatures } from '../../redux/actions/blockchainAction';
import SignatureCard from '../../components/dao/my-signatures/SignatureCard';
import { FlaskUserTypesEnum } from '../../utils/types';
import MessageWallet from '../../components/MessageWallet';

export default function MySignatures() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  const [cardSelected, setCardSelected] = useState();
  const [walletToastOpen, setWalletToastOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const signaturesVerification = useSelector((state) => state.signaturesVerification);
  const { error: errorSignaturesVerification } = signaturesVerification;

  const { total, signatures } = useSelector((state) => state.signatures);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (
      swInfo &&
      !(
        swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN
      )
    ) {
      if (value === 0) {
        dispatch(fetchUserSignatures(page, rowsPerPage));
      }
      if (value === 1) {
        // dispatch(fetchMySignatures());
      }
      if (value === 2) {
        // dispatch(fetchMySignatures());
      }
    } else if (
      swInfo &&
      (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN)
    ) {
      if (value === 0) {
        dispatch(fetchAllSignatures(page, rowsPerPage));
      }
      if (value === 1) {
        // dispatch(fetchMySignatures());
      }
      if (value === 2) {
        // dispatch(fetchMySignatures());
      }
    }
  }, [value, swInfo, page, rowsPerPage]);

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label={t('mySignatures.tabs.swSignatures')} />
          <Tab disabled label={t('mySignatures.tabs.familySigned')} />
          <Tab disabled label={t('mySignatures.tabs.auditorSigned')} />
        </Tabs>
      </Box>

      {signatures && (
        <>
          <ImageList variant="standard" cols={5} gap={1}>
            {signatures.map((s) => (
              <ImageListItem key={s.id}>
                <SignatureCard
                  signature={s}
                  cardSelected={cardSelected}
                  setCardSelected={setCardSelected}
                  need={s.need}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            colSpan={6}
            count={total}
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
        </>
      )}

      {errorSignaturesVerification && (
        <MessageWallet
          walletError={errorSignaturesVerification}
          walletToastOpen={walletToastOpen}
          handleCloseWalletToast={handleCloseWalletToast}
          severity="error"
        />
      )}
    </>
  );
}
