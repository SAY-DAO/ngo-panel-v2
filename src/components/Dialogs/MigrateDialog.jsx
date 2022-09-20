import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { migrateSwChildren, migrateSwOneChild } from '../../redux/actions/socialWorkerAction';

export default function MigrateDialog({ open, setOpen, dialogValues, childId, toSwId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  // when only one child migrate
  const handleConfirmOne = () => {
    dispatch(migrateSwOneChild(childId, toSwId));
    setOpen(false);
  };

  // when all sw children migrate
  const handleConfirmAll = () => {
    dispatch(migrateSwChildren(dialogValues.fromSw.result.id, dialogValues.toSw.result.id));
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
            {t('socialWorker.migrateModal.confirm')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {t('button.cancel')}</Button>
          <Button onClick={!childId ? handleConfirmAll : handleConfirmOne} autoFocus>
            {t('button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

MigrateDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
  childId: PropTypes.number, // when only one child migrate
  toSwId: PropTypes.number, // when only one child migrate
  
};
