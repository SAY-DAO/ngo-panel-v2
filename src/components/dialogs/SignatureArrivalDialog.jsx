import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function SignatureArrivalDialog({ open, setOpen }) {
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  // when all sw children migrate
  const handleConfirmAll = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('socialWorker.notAllAnnounced')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmAll} autoFocus>
            {t('button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

SignatureArrivalDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
