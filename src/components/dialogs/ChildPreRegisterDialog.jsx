import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import UploadImage from '../UploadImage';
import { checkSimilarNames, createPreRegisterChild } from '../../redux/actions/childrenAction';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import { SexEnum } from '../../utils/types';

export default function ChildPreRegisterDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [similarError, setSimilarError] = useState({
    fa: 0,
    en: 0,
  });
  const [finalAvatarFile, setFinalAvatarFile] = useState();
  const [finalSleptAvatarFile, setFinalSleptAvatarFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState(
    location.state && location.state.newImage,
  );

  const childPreRegister = useSelector((state) => state.childPreRegister);
  const { loading: loadingAdded, success: successAdded } = childPreRegister;

  const childNameCheck = useSelector((state) => state.childNameCheck);
  const { result } = childNameCheck;

  const validationSchema = Yup.object().shape({
    sayname_translations_fa: Yup.string().required('Please enter the name'),
    sayname_translations_en: Yup.string().required('Please enter the name'),
    sex: Yup.string().required('Please enter the sex'),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const values = getValues();
    console.log(values);
    if (values.sayname_translations_fa) {
      setSimilarError({
        en: 0,
        fa: 0,
      });
      dispatch(checkSimilarNames(values.sayname_translations_fa, 'fa'));
    }
    if (values.sayname_translations_en) {
      setSimilarError({
        en: 0,
        fa: 0,
      });
      dispatch(checkSimilarNames(values.sayname_translations_en, 'en'));
    }
  }, [watch('sayname_translations_en'), watch('sayname_translations_fa')]);

  useEffect(() => {
    if (watch('sayname_translations_fa') && result) {
      setSimilarError({
        en: similarError.en,
        fa: result.total,
      });
    }
    if (watch('sayname_translations_en') && result) {
      setSimilarError({
        en: result.total,
        fa: similarError.fa,
      });
    }
  }, [watch('sayname_translations_en'), watch('sayname_translations_fa'), result]);

  useEffect(() => {
    if (successAdded) {
      setOpen(false);
    }
  }, [successAdded]);

  const handleClose = () => {
    setOpen(false);
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

  const handleRemoveAvatar = () => {
    console.log('removed not implemented...');
  };
  const onSubmit = (data) => {
    dispatch(
      createPreRegisterChild({
        awakeFile: finalAvatarFile,
        sleptFile: finalSleptAvatarFile,
        sayName: { en: data.sayname_translations_en, fa: data.sayname_translations_fa },
        sex: Number(data.sex),
      }),
    );
  };

  return (
    <Grid container>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{t('child.existence_status')}</DialogTitle>
          <DialogContent>
            <Grid container>
              {/*  Child avatar */}
              <Grid item md={6} xs={12} sx={{ m: 'auto', mr: 0 }}>
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        onClick={handleRemoveAvatar}
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          bottom: '-5px',
                          right: '65px',
                        }}
                      >
                        <RemoveCircleOutlineIcon
                          color="secondary"
                          fontSize="small"
                          sx={{
                            borderRadius: '20%',
                          }}
                        />
                      </IconButton>
                    }
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
                              : null
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
                            sx={{
                              position: 'absolute',
                              bottom: '0px',
                              right: '0px',
                            }}
                          >
                            <AddCircleOutlineIcon
                              color="primary"
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
                    badgeContent={
                      <IconButton
                        onClick={handleRemoveAvatar}
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          bottom: '-5px',
                          right: '65px',
                        }}
                      >
                        <RemoveCircleOutlineIcon
                          color="secondary"
                          fontSize="small"
                          sx={{
                            borderRadius: '20%',
                          }}
                        />
                      </IconButton>
                    }
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
                              : null
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
                            component="div"
                            sx={{
                              position: 'absolute',
                              bottom: '0px',
                              right: '0px',
                            }}
                          >
                            <AddCircleOutlineIcon
                              color="primary"
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
            </Grid>
            <Grid item xs={12} container spacing={1} justifyContent="center">
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="sayname_translations_fa">
                  {t('child.sayname_translations.fa')}
                </CustomFormLabel>
                <TextField
                  required
                  id="sayname_translations_fa"
                  variant="outlined"
                  size="large"
                  control={control}
                  {...register('sayname_translations_fa')}
                  error={!!errors.sayname_translations_fa || similarError.fa > 0}
                  helperText={similarError.fa > 0 && t(`error.similarNames`)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <CustomFormLabel htmlFor="sayname_translations_en">
                  {t('child.sayname_translations.en')}
                </CustomFormLabel>
                <TextField
                  id="sayname_translations_en"
                  variant="outlined"
                  size="large"
                  control={control}
                  {...register('sayname_translations_en')}
                  error={!!errors.sayname_translations_en || similarError.en > 0}
                  helperText={similarError.en > 0 && t(`error.similarNames`)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: '100%' }}>
                  <CustomFormLabel id="sex">{t('child.sex')}</CustomFormLabel>
                  <CustomSelect
                    labelId="sex-controlled-open-select-label"
                    id="sex"
                    control={control}
                    value={watch('sex') || ''}
                    register={{ ...register('sex') }}
                    error={!!errors.sex}
                  >
                    <MenuItem value={SexEnum.FEMALE}>{t(`child.sexKind.female`)}</MenuItem>
                    <MenuItem value={SexEnum.MALE}>{t(`child.sexKind.male`)}</MenuItem>
                  </CustomSelect>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={handleClose}>
              {t('button.cancel')}
            </Button>
            <LoadingButton
              disabled={!!result && result.total}
              loading={loadingAdded}
              color="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {t('child.button.add')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </form>
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
    </Grid>
  );
}

ChildPreRegisterDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
};
