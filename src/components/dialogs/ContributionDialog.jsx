import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Grid, IconButton, TextField, TextareaAutosize, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { blue, grey } from '@mui/material/colors';
import { createContribution } from '../../redux/actions/blockchainAction';

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 100%;
  font-size: 0.75rem;
  font-weight: 200;
  line-height: 1.5;
  padding: 12px;
  margin-top:15px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.secondary.light};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
export default function ContributionDialog({ open, setOpen, values, setValues }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ecoContribution = useSelector((state) => state.ecoContribution);
  const { created, loading: loadingEcoContribution } = ecoContribution;

  const handleClose = () => {
    setOpen(false);
  };
  const submitContribute = () => {
    dispatch(createContribution(values.title, values.description));
  };

  useEffect(() => {
    if (created) {
      setOpen(false);
      setValues();
    }
  }, [created]);

  const handleChange = (e) => {
    setValues({ description: e.target.value });
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton sx={{ position: 'absolute' }} onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
        <form onSubmit={submitContribute}>
          <DialogContent sx={{ mt: 2 }}>
            <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center', mb: 3 }}>
              Add
            </DialogContentText>
            <Grid container direction="column">
              <Grid item sx={{ width: '100% !important' }}>
                <TextField
                  id="outlined-controlled"
                  label="Controlled"
                  value={values.title}
                  onChange={(event) => {
                    setValues({ title: event.target.value });
                  }}
                  sx={{ width: '100% !important' }}
                />
              </Grid>
              <Grid item>
                <StyledTextarea
                  id="outlined-multiline-static"
                  label="Contribution Area"
                  minRows={10}
                  value={values.description}
                  onChange={handleChange}
                  variant="soft"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </form>
        <DialogActions>
          <LoadingButton
            loading={loadingEcoContribution}
            disabled={!values}
            autoFocus
            onClick={submitContribute}
            type="submit"
          >
            {t('button.submit')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ContributionDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  values: PropTypes.object,
  setValues: PropTypes.func,
};
