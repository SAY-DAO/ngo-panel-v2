import React from 'react';
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import ProviderForm from '../forms/ProviderForm';

export default function ProviderDialog({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <ProviderForm />
    </Dialog>
  );
}

ProviderDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
