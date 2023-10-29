import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DialogTitle, Grid, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { approvePreRegister } from '../../redux/actions/childrenAction';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';

export default function ApproveDialog({ open, setOpen, dialogValues }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    country: Yup.string().required('Please enter your address'),
    lastName_translations_en: Yup.string().required('Please enter your address'),
    firstName_translations_en: Yup.string().required('Please enter your address'),
    bio_translations_en: Yup.string().required('Please enter your address'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (dialogValues.type === 'approvePreregister') {
      dispatch(approvePreRegister(dialogValues.preRegisterId));
    }
    setOpen(false);
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {dialogValues && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            {dialogValues.type === 'approvePreregister' && t('approveModal.preRegister.title')}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1} justifyContent="center">
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="firstName_translations_en">
                  {t('child.firstName_translations.en')}
                </CustomFormLabel>
                <TextField
                  required
                  id="firstName_translations_en"
                  variant="outlined"
                  size="large"
                  sx={{ width: '100%' }}
                  control={control}
                  {...register('firstName_translations_en')}
                  error={!!errors.firstName_translations_en}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="lastName_translations_en">
                  {t('child.lastName_translations.en')}
                </CustomFormLabel>
                <TextField
                  id="lastName_translations_en"
                  variant="outlined"
                  size="large"
                  control={control}
                  sx={{ width: '100%' }}
                  {...register('lastName_translations_en')}
                  error={!!errors.lastName_translations_en}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bio_translations_en">
                  {t('child.bio_translations.en')}
                </CustomFormLabel>
                <TextField
                  minRows={4}
                  multiline
                  id="bio_translations_en"
                  variant="outlined"
                  size="small"
                  control={control}
                  {...register('bio_translations_en')}
                  style={{ width: '100%', background: 'transparent' }}
                  error={!!errors.bio_translations_en}
                />
              </Grid>
            </Grid>

            <DialogContentText id="alert-dialog-description">
              {dialogValues.type === 'approvePreregister' && t('approveModal.preRegister.content')}
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
    </form>
  );
}

ApproveDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
};
