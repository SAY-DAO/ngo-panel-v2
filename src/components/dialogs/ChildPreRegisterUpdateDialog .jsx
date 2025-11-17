import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Card,
  DialogTitle,
  Badge,
  IconButton,
  Typography,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Avatar,
  Box,
} from '@mui/material';
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
import UploadImage from '../UploadImage';
import { apiDao } from '../../env';

const trainees = process.env.REACT_APP_TRAINEE_IDS
  ? process.env.REACT_APP_TRAINEE_IDS.split(',').map(Number)
  : [];

export default function ChildPreRegisterUpdateDialog({
  open,
  setOpen,
  setUpdateDialogValues,
  updateDialogValues,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [uploadVoice, setUploadVoice] = useState();
  const [finalAvatarFile, setFinalAvatarFile] = useState();
  const [finalSleptAvatarFile, setFinalSleptAvatarFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState();

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

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageDialog(true);
  };

  const handleImageClose = () => {
    setOpenImageDialog(false);
  };

  const onAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadSleptAvatar();
      setUploadAvatar(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onSleptAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadAvatar();
      setUploadSleptAvatar(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onSubmit = async (data) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    console.log(finalAvatarFile);
    console.log(finalSleptAvatarFile);
    dispatch(
      updatePreRegisterChild({
        awakeFile: finalAvatarFile,
        sleptFile: finalSleptAvatarFile,
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
              <Grid container>
                {/*  Child avatar */}
                <Grid item md={6} xs={12} sx={{ m: 'auto', mr: 0 }}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <div className="upload__image-wrapper">
                        <Grid
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <Avatar
                            alt="avatar"
                            sx={{ width: 110, height: 110 }}
                            src={
                              finalAvatarFile
                                ? URL.createObjectURL(finalAvatarFile) // image preview
                                : `${apiDao}/children/avatars/images/${updateDialogValues.awakeUrl}`
                            }
                          />
                          <label htmlFor="upload-image-avatar">
                            <input
                              accept="image/*"
                              id="upload-image-avatar"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={onAvatarChange}
                            />

                            <IconButton
                              name="upload-image-avatar"
                              id="upload-image-avatar"
                              color="primary"
                              component="div"
                              disabled={!swInfo || trainees.includes(swInfo.id)}
                              sx={{
                                position: 'absolute',
                                bottom: '0px',
                                right: '0px',
                              }}
                            >
                              <AddCircleOutlineIcon
                                color={
                                  !swInfo || trainees.includes(swInfo.id) ? 'disabled' : 'primary'
                                }
                                fontSize="small"
                                sx={{
                                  zIndex: 10,
                                  borderRadius: '20%',
                                }}
                              />
                            </IconButton>
                          </label>
                        </Grid>
                      </div>
                    </Badge>
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                      {t('child.awakeAvatarUrl')}
                    </Typography>
                  </Card>
                </Grid>
                {/*  Child slept avatar */}
                <Grid item md={6} xs={12}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <div className="upload__image-wrapper">
                        <Grid
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <Avatar
                            alt="avatar"
                            sx={{ width: 110, height: 110 }}
                            src={
                              finalSleptAvatarFile
                                ? URL.createObjectURL(finalSleptAvatarFile) // image preview
                                : `${apiDao}/children/avatars/images/${updateDialogValues.sleptUrl}`
                            }
                          />
                          <label htmlFor="upload-image-slept-avatar">
                            <input
                              accept="image/*"
                              id="upload-image-slept-avatar"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={onSleptAvatarChange}
                            />

                            <IconButton
                              name="upload-image-slept-avatar"
                              id="upload-image-slept-avatar"
                              color="primary"
                              disabled={!swInfo || trainees.includes(swInfo.id)}
                              component="div"
                              sx={{
                                position: 'absolute',
                                bottom: '0px',
                                right: '0px',
                              }}
                            >
                              <AddCircleOutlineIcon
                                color={
                                  !swInfo || trainees.includes(swInfo.id) ? 'disabled' : 'primary'
                                }
                                fontSize="small"
                                sx={{
                                  zIndex: 10,
                                  borderRadius: '20%',
                                }}
                              />
                            </IconButton>
                          </label>
                        </Grid>
                      </div>
                    </Badge>
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                      {t('child.sleptAvatarUrl')}
                    </Typography>
                  </Card>
                </Grid>
                <Typography variant="body2" sx={{ mt: 0, m: 'auto', color: 'gray', fontSize: 30 }}>
                  {updateDialogValues.sayName.fa}
                </Typography>
              </Grid>

              <Card sx={{ width: '100%' }}>
                <Grid container justifyContent="center" spacing={1}>
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
                  {!trainees.includes(swInfo.id) &&
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
                                  trainees.includes(swInfo.id) ||
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
                          <MenuItem
                            key={name}
                            value={String(Object.values(HousingStatusEnum)[index])}
                          >
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
              </Card>
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
      {/* Child Image */}
      <Dialog
        open={openImageDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {uploadAvatar ? (
            <Box>
              <UploadImage
                uploadImage={uploadAvatar}
                handleImageClose={handleImageClose}
                setFinalImageFile={setFinalAvatarFile}
              />
            </Box>
          ) : (
            uploadSleptAvatar && (
              <Box>
                <UploadImage
                  uploadImage={uploadSleptAvatar}
                  handleImageClose={handleImageClose}
                  setFinalImageFile={setFinalSleptAvatarFile}
                />
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>
    </form>
  );
}

ChildPreRegisterUpdateDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  updateDialogValues: PropTypes.object,
  setUpdateDialogValues: PropTypes.func,
};
