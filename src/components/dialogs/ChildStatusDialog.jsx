import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Checkbox, DialogTitle, FormControlLabel } from '@mui/material';
import CustomizedRadios from '../CustomizedRadios';
import { updateChildExistenceStatus } from '../../redux/actions/childrenAction';

export default function ChildStatusDialog({ open, setOpen, dialogValues }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [checked, setChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckBox = (event) => {
    setChecked(event.target.checked);
  };

  const handleStatusChange = () => {
    if (dialogValues && dialogValues.childId && selectedValue) {
      dispatch(updateChildExistenceStatus(dialogValues.childId, selectedValue));
      setOpen(false);
      setSelectedValue();
    }
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
          <DialogTitle>{t('child.existence_status')}</DialogTitle>
          <DialogContent>
            <CustomizedRadios
              values={dialogValues}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
            />
            <FormControlLabel
              sx={{ mt: 4 }}
              required
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCheckBox}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={t('childStatusModal.checkBox')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}> {t('button.cancel')}</Button>
            <Button onClick={handleStatusChange} autoFocus disabled={!checked}>
              {t('button.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

ChildStatusDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
};
