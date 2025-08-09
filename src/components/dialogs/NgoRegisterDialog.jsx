import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PropTypes from 'prop-types';
import NgoAddForm from '../../pages/ngos/NgoAddForm';

export default function NgoRegisterDialog({ handleClose, open }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'div',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const { email } = formJson;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogContent sx={{ m: 0, p: 0 }}>
          <NgoAddForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

NgoRegisterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
