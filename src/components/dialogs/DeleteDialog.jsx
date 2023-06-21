import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DialogTitle } from '@mui/material';
import { deleteReceipt } from '../../redux/actions/reportAction';
import { deleteNeed } from '../../redux/actions/needsAction';

export default function DeleteDialog({ open, setOpen, dialogValues }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (dialogValues.type === 'deleteReceipt') {
      dispatch(deleteReceipt(dialogValues.needId, dialogValues.receiptId));
    }
    if (dialogValues.type === 'deleteNeed') {
      dispatch(deleteNeed(dialogValues.needId));
    }
    setOpen(false);
  };

  return (
    <div>
      {dialogValues && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {dialogValues.type === 'deleteNeed'
              ? t('deleteModal.need.title')
              : t('deleteModal.receipt.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogValues.type === 'deleteNeed'
                ? t('deleteModal.need.content')
                : t('deleteModal.receipt.content')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}> {t('button.cancel')}</Button>
            <Button onClick={handleDelete} autoFocus>
              {t('button.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
};
