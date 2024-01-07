import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DialogTitle, FormControl, Grid, MenuItem, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { updatePreRegisterChild } from '../../redux/actions/childrenAction';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { EducationEnum, HousingStatusEnum, SchoolTypeEnum } from '../../utils/types';
import CustomSelect from '../forms/custom-elements/CustomSelect';

export default function ChildPreRegisterUpdateDialog({
  open,
  setOpen,
  setUpdateDialogValues,
  dialogValues,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, approved, updated } = useSelector((state) => state.childPreRegister);

  const validationSchema = Yup.object().shape({
    lastName_translations_fa: Yup.string().required('Please enter your address'),
    firstName_translations_fa: Yup.string().required('Please enter your address'),
    bio_translations_fa: Yup.string().required('Please enter your address'),
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (approved || updated) {
      setOpen(false);
    }
  }, [approved, updated]);

  const handleClose = () => {
    setOpen(false);
    setUpdateDialogValues();
  };

  const onSubmit = async (data) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updatePreRegisterChild({
        id: dialogValues.id,
        bio: data.bio_translations_fa,
        educationLevel: Number(data.education),
        schoolType: Number(data.schoolType),
        housingStatus: Number(data.housingStatus),
        firstName: data.firstName_translations_fa,
        lastName: data.lastName_translations_fa,
      }),
    );
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
          <DialogTitle>{t('approveModal.preRegister.title')}</DialogTitle>
          <DialogContent>
            <Grid container spacing={1} justifyContent="center">
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="firstName_translations_fa">
                  {t('child.firstName_translations.fa')}
                </CustomFormLabel>
                <TextField
                  required
                  id="firstName_translations_fa"
                  variant="outlined"
                  size="large"
                  defaultValue={dialogValues.firstName.fa}
                  sx={{ width: '100%' }}
                  control={control}
                  {...register('firstName_translations_fa')}
                  error={!!errors.firstName_translations_fa}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="lastName_translations_fa">
                  {t('child.lastName_translations.fa')}
                </CustomFormLabel>
                <TextField
                  id="lastName_translations_fa"
                  variant="outlined"
                  defaultValue={dialogValues.lastName.fa}
                  size="large"
                  control={control}
                  sx={{ width: '100%' }}
                  {...register('lastName_translations_fa')}
                  error={!!errors.lastName_translations_fa}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bio_translations_fa">
                  {t('child.bio_translations.fa')}
                </CustomFormLabel>
                <TextField
                  minRows={4}
                  multiline
                  id="bio_translations_fa"
                  defaultValue={dialogValues.bio.fa}
                  variant="outlined"
                  size="small"
                  control={control}
                  {...register('bio_translations_fa')}
                  style={{ width: '100%', background: 'transparent' }}
                  error={!!errors.bio_translations_fa}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ width: '100%' }}>
                  <CustomFormLabel htmlFor="housingStatus">
                    {t('child.housingStatus')}
                  </CustomFormLabel>
                  <CustomSelect
                    labelId="housingStatus"
                    id="multiple-education"
                    value={watch('housingStatus') || dialogValues.housingStatus}
                    control={control}
                    register={{ ...register('housingStatus') }}
                    error={!!errors.housingStatus}
                  >
                    <MenuItem value="">
                      <em>{t(`child.housingCondition.none`)}</em>
                    </MenuItem>
                    {Object.keys(HousingStatusEnum).map((name, index) => (
                      <MenuItem key={name} value={String(Object.values(HousingStatusEnum)[index])}>
                        {t(`child.housingCondition.${name}`)}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: '100%' }}>
                  <CustomFormLabel id="education">{t('child.education')}</CustomFormLabel>
                  <CustomSelect
                    labelId="education-controlled-open-select-label"
                    id="education"
                    control={control}
                    value={watch('education') || dialogValues.educationLevel}
                    register={{ ...register('education') }}
                    error={!!errors.education}
                  >
                    {Object.keys(EducationEnum).map((name, index) => (
                      <MenuItem key={name} value={Object.values(EducationEnum)[index]}>
                        {t(`child.educationCondition.${name}`)}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: '100%' }}>
                  <CustomFormLabel id="schoolType">{t('child.schoolType')}</CustomFormLabel>
                  <CustomSelect
                    labelId="schoolType-controlled-open-select-label"
                    id="schoolType"
                    control={control}
                    value={watch('schoolType') || dialogValues.schoolType}
                    register={{ ...register('schoolType') }}
                    error={!!errors.schoolType}
                  >
                    {Object.keys(SchoolTypeEnum).map((name, index) => (
                      <MenuItem key={name} value={Object.values(SchoolTypeEnum)[index]}>
                        {t(`child.schoolTypeCondition.${name.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={loading}
              color="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              autoFocus
            >
              {t('button.confirm')}
            </LoadingButton>
            <LoadingButton color="secondary" onClick={handleClose}>
              {t('button.cancel')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </form>
  );
}

ChildPreRegisterUpdateDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
  setUpdateDialogValues: PropTypes.func,
};
