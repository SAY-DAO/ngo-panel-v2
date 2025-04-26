import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, DialogTitle, FormControl, Grid, MenuItem, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { updatePreRegisterChild } from '../../redux/actions/childrenAction';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import {
  EducationEnum,
  FlaskUserTypesEnum,
  HousingStatusEnum,
  SchoolTypeEnum,
} from '../../utils/types';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import VoiceBar from '../VoiceBar';
import collaborators from '../../utils/temp';

export default function ChildPreRegisterUpdateDialog({
  open,
  setOpen,
  setUpdateDialogValues,
  updateDialogValues,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [uploadVoice, setUploadVoice] = useState();

  const { loading, approved, updated } = useSelector((state) => state.childPreRegister);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const validationSchema = Yup.object().shape({
    lastName_translations_fa: Yup.string().required('Please enter last name'),
    firstName_translations_fa: Yup.string().required('Please enter first name'),
    bio_translations_fa: Yup.string().required('Please enter bio'),
  });

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (approved || updated) {
      setOpen(false);
      setUpdateDialogValues();
      reset();
    }
  }, [approved, updated]);

  const handleClose = () => {
    setOpen(false);
    setUpdateDialogValues();
    reset();
  };

  const onVoiceChange = (e) => {
    if (e.target.files[0]) {
      setUploadVoice(e.target.files[0]);
      console.log(e.target.files[0]);
      console.log(URL.createObjectURL(e.target.files[0]));
    }
  };
  const onSubmit = async (data) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updatePreRegisterChild({
        flaskChildId: updateDialogValues.flaskChildId,
        id: updateDialogValues.id,
        bio: data.bio_translations_fa,
        educationLevel: Number(data.education),
        schoolType: Number(data.schoolType),
        housingStatus: Number(data.housingStatus),
        firstName: data.firstName_translations_fa,
        lastName: data.lastName_translations_fa,
        voiceFile: uploadVoice,
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {updateDialogValues && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{t('updateModal.preRegister.title')}</DialogTitle>
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
                  defaultValue={updateDialogValues.firstName.fa}
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
                  defaultValue={updateDialogValues.lastName.fa}
                  size="large"
                  control={control}
                  sx={{ width: '100%' }}
                  {...register('lastName_translations_fa')}
                  error={!!errors.lastName_translations_fa}
                />
              </Grid>
              {!collaborators.includes(swInfo.id) &&
                (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
                  swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
                  <Card sx={{ p: 3, m: 0, mt: 1, textAlign: 'center' }}>
                    <Grid container sx={{ m: 'auto' }}>
                      <Grid item xs={12} sx={{ width: '100%' }}>
                        <VoiceBar url={uploadVoice && URL.createObjectURL(uploadVoice)} />
                      </Grid>
                      <Grid item xs={12} sx={{ m: 'auto', width: '100%' }}>
                        <label htmlFor="upload-voice">
                          <input
                            id="upload-voice"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onVoiceChange}
                          />

                          <Button
                            name="upload-voice"
                            id="upload-voice"
                            color="primary"
                            component="div"
                            variant="outlined"
                            disabled={
                              collaborators.includes(swInfo.id) ||
                              (swInfo.typeId !== FlaskUserTypesEnum.ADMIN &&
                                swInfo.typeId !== FlaskUserTypesEnum.SUPER_ADMIN)
                            }
                            sx={{
                              m: 2,
                              bottom: '0px',
                              right: '0px',
                            }}
                          >
                            {t('child.uploadVoiceOrg')}
                          </Button>
                        </label>
                      </Grid>
                    </Grid>
                  </Card>
                )}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bio_translations_fa">
                  {t('child.bio_translations.fa')}
                </CustomFormLabel>
                <TextField
                  minRows={4}
                  multiline
                  id="bio_translations_fa"
                  defaultValue={updateDialogValues.bio.fa}
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
                    value={watch('housingStatus') || updateDialogValues.housingStatus}
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
                    value={watch('education') || updateDialogValues.educationLevel}
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
                    value={watch('schoolType') || updateDialogValues.schoolType}
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
  updateDialogValues: PropTypes.object,
  setUpdateDialogValues: PropTypes.func,
};
