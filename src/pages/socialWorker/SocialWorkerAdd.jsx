import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  Grid,
  Typography,
  Button,
  Badge,
  Dialog,
  Box,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  OutlinedInput,
  IconButton,
  MenuItem,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { AddSw } from '../../redux/actions/socialWorkerAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadIdImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { fetchNgoList } from '../../redux/actions/ngoAction';

const BCrumb = [
  {
    to: '/sw/list',
    title: 'Social Workers List',
  },
  {
    title: 'Add',
  },
];

const SocialWorkerAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [coordChecked, setCoordChecked] = useState(false);
  const [finalImageFile, setFinalImageFile] = useState();
  const [finalIdImageFile, setFinalIdImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [uploadIdImage, setUploadIdImage] = useState(location.state && location.state.newIdImage);
  const [birthDate, setBirthDate] = useState(new Date());
  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    phoneNumber: '',
    emergencyPhoneNumber: '',
    postalAddress: '',
    email: '',
    telegramId: '',
    typeId: 0,
    idCardFile: '',
    idNumber: '',
    ngoId: '',
    avatarFile: '',
    isCoordinator: false,
  });

  const swAdd = useSelector((state) => state.swAdd);
  const { success: successAddUpdate, loading: loadingAddSw, error: errorAddUpdate } = swAdd;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList, loading: loadingNgoAll } = ngoAll;

  useEffect(() => {
    if (!successNgoList) {
      dispatch(fetchNgoList());
    }
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    ngoId: Yup.string().required('Please enter your NGO'),
    typeId: Yup.string().required('Please enter permission'),
    idNumber: Yup.string().required('Please enter your ID number'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    emergencyPhoneNumber: Yup.string().required('Please enter your emergency phone'),
    email: Yup.string().required('Please enter your email'),
    telegramId: Yup.string().required('Please enter your telegram handle'),
    // email: Yup.string().required('Email is required').email('Email is invalid'),
    // password: Yup.string()
    //   .required('Password is required')
    //   .min(6, 'Password must be at least 6 characters')
    //   .max(40, 'Password must not exceed 40 characters'),
    // confirmPassword: Yup.string()
    //   .required('Confirm Password is required')
    //   .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    acceptTerms: Yup.bool(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      AddSw({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        emergencyPhoneNumber: data.emergencyPhoneNumber,
        postalAddress: data.postalAddress,
        telegramId: data.telegramId,
        typeId: data.typeId,
        idCardFile: finalIdImageFile,
        idNumber: data.idNumber,
        ngoId: data.ngoId,
        avatarFile: finalImageFile,
        birthDate,
        isCoordinator: values.isCoordinator,
      }),
    );
  };

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageDialog(true);
  };
  const handleImageClose = () => {
    setOpenImageDialog(false);
  };

  // dialog id image
  const handleIdImageClickOpen = () => {
    setOpenIdImageDialog(true);
  };
  const handleIdImageClose = () => {
    setOpenIdImageDialog(false);
  };

  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onIdImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadIdImage(e.target.files[0]);
      handleIdImageClickOpen();
    }
  };

  const handleRemoveImage = () => {
    console.log('remove');
  };

  const handleRemoveIdImage = () => {
    console.log('remove');
  };

  const handleChangeInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeCoord = () => {
    if (coordChecked) {
      setCoordChecked(false);
    } else if (!coordChecked) {
      setCoordChecked(true);
    }
    setValues({
      ...values,
      isCoordinator: coordChecked,
    });
  };

  console.log(errorAddUpdate && errorAddUpdate.data[0].msg);

  const shapeStyles = { bgcolor: 'transparent', width: 80, height: 50 };
  const rectangle = (
    <Box component="span" sx={shapeStyles}>
      <div className="upload__image-wrapper">
        <Button
          sx={{
            border: '1px dashed lightGrey',
            width: 80,
            minHeight: 50,
          }}
        >
          <img
            alt=""
            width="80%"
            style={{
              maxHeight: 50,
              bgcolor: 'white',
            }}
            src={
              finalIdImageFile
                ? URL.createObjectURL(finalIdImageFile) // image preview
                : values.idCardFile
            }
          />
        </Button>
      </div>
      <label htmlFor="upload-id-image">
        <input
          accept="image/*"
          id="upload-id-image"
          type="file"
          style={{
            display: 'none',
            left: '60px',
          }}
          onChange={onIdImageChange}
        />

        <IconButton onClick={handleRemoveIdImage} color="secondary">
          <RemoveCircleOutlineIcon
            color="secondary"
            fontSize="medium"
            sx={{
              borderRadius: '20%',
            }}
          />
        </IconButton>
        <IconButton name="upload-id-image" id="upload-id-image" color="primary" component="div">
          <AddCircleOutlineIcon
            color="primary"
            fontSize="medium"
            sx={{
              borderRadius: '20%',
            }}
          />
        </IconButton>
      </label>
    </Box>
  );

  return (
    <PageContainer title="Social Worker Add" description="this is Social Worker Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {loadingNgoAll ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        successNgoList && (
          <>
            <Breadcrumb title="Add page" subtitle="Social Worker" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        onClick={handleRemoveImage}
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
                          alt="user photo"
                          sx={{ width: 110, height: 110 }}
                          src={
                            finalImageFile
                              ? URL.createObjectURL(finalImageFile) // image preview
                              : values.avatarFile
                          }
                        />
                        <label htmlFor="upload-image">
                          <input
                            accept="image/*"
                            id="upload-image"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onImageChange}
                          />

                          <IconButton
                            name="upload-image"
                            id="upload-image"
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
                </Card>
                <Card sx={{ p: 3, minHeight: 150 }}>
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={6} sx={{ position: 'relative', textAlign: 'center' }}>
                      <Typography variant="caption"> {t('socialWorker.idCardUrl')}</Typography>
                      <Grid aria-label="id card">{rectangle}</Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('socialWorker.titleAdd')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel>
                    <TextField
                      required
                      id="firstName"
                      variant="outlined"
                      fullWidth
                      size="small"
                      onChange={handleChangeInput('firstName')}
                      control={control}
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors && errors.firstName && errors.firstName.message}
                    />
                    <CustomFormLabel htmlFor="lastName">
                      {t('socialWorker.lastName')}
                    </CustomFormLabel>
                    <TextField
                      required
                      id="lastName"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('lastName')}
                      control={control}
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors && errors.lastName && errors.lastName.message}
                    />
                    <CustomFormLabel htmlFor="Email">{t('socialWorker.email')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('email')}
                      control={control}
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors && errors.email && errors.email.message}
                    />

                    <CustomFormLabel htmlFor="country">{t('socialWorker.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      defaultValue={1}
                      onChange={handleChangeInput('country')}
                      control={control}
                      register={{ ...register('country') }}
                    >
                      <MenuItem value={1}>{t('socialWorker.countries.one')}</MenuItem>
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.country && errors.country.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="city">{t('socialWorker.city')}</CustomFormLabel>
                    <CustomSelect
                      labelId="city-controlled-open-select-label"
                      id="city-controlled-open-select"
                      defaultValue={1}
                      onChange={handleChangeInput('city')}
                      control={control}
                      register={{ ...register('city') }}
                    >
                      <MenuItem value={1}>{t('socialWorker.cities.one')}</MenuItem>
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.city && errors.city.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="postalAddress">
                      {t('socialWorker.postalAddress')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="postalAddress"
                      variant="outlined"
                      multiline
                      rows={4}
                      size="small"
                      sx={{ mb: 2 }}
                      fullWidth
                      onChange={handleChangeInput('postalAddress')}
                      control={control}
                      register={{ ...register('postalAddress') }}
                      helperText={errors && errors.postalAddress && errors.postalAddress.message}
                    />
                    <CustomFormLabel htmlFor="birthDate">
                      {t('socialWorker.birthDate')}
                    </CustomFormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        id="birthDate"
                        inputFormat="MM/dd/yyyy"
                        value={birthDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                        helperText={errors && errors.birthDate && errors.birthDate.message}
                      />
                    </LocalizationProvider>

                    <CustomFormLabel htmlFor="telegramId">
                      {t('socialWorker.telegramId')}
                    </CustomFormLabel>
                    <OutlinedInput
                      id="telegramId"
                      startAdornment={<InputAdornment position="start">@</InputAdornment>}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('telegramId')}
                      control={control}
                      {...register('telegramId')}
                      error={!!errors.telegramId}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.telegramId && errors.telegramId.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="idNumber">
                      {t('socialWorker.idNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="idNumber"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('idNumber')}
                      control={control}
                      {...register('idNumber')}
                      error={!!errors.idNumber}
                      helperText={errors && errors.lastName && errors.lastName.message}
                    />
                    <CustomFormLabel id="ngoId-controlled-open-select-label" htmlFor="ngoId">
                      {t('socialWorker.ngoName')}
                    </CustomFormLabel>
                    <CustomSelect
                      labelId="ngoId-controlled-open-select-label"
                      id="ngoId-controlled-open-select"
                      defaultValue={ngoList[1].id}
                      onChange={handleChangeInput('ngoId')}
                      register={{ ...register('ngoId') }}
                      control={control}
                      error={!!errors.ngoId}
                    >
                      {ngoList &&
                        Object.keys(ngoList).map((key) => (
                          <MenuItem key={key} value={ngoList[key].id}>
                            {ngoList[key].name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                    <CustomFormLabel id="typeId-controlled-open-select-label" htmlFor="typeId">
                      {t('socialWorker.typeId')}
                    </CustomFormLabel>
                    <CustomSelect
                      labelId="typeId-controlled-open-select-label"
                      id="typeId-controlled-open-select"
                      defaultValue={4}
                      onChange={handleChangeInput('typeId')}
                      control={control}
                      register={{ ...register('typeId') }}
                    >
                      <MenuItem value={1}>{t('socialWorker.roles.SUPER_ADMIN')}</MenuItem>
                      <MenuItem value={2}>{t('socialWorker.roles.SOCIAL_WORKER')}</MenuItem>
                      {/* <MenuItem value={3}>{t('socialWorker.roles.COORDINATOR')}</MenuItem> */}
                      <MenuItem value={4}>{t('socialWorker.roles.NGO_SUPERVISOR')}</MenuItem>
                      <MenuItem value={5}>{t('socialWorker.roles.SAY_SUPERVISOR')}</MenuItem>
                      <MenuItem value={6}>{t('socialWorker.roles.ADMIN')}</MenuItem>
                    </CustomSelect>
                    <CustomFormLabel htmlFor="phoneNumber">
                      {t('socialWorker.phoneNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="phoneNumber"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('phoneNumber')}
                      control={control}
                      {...register('phoneNumber')}
                      error={!!errors.phoneNumber}
                      helperText={errors && errors.phoneNumber && errors.phoneNumber.message}
                    />
                    <CustomFormLabel htmlFor="emergencyPhoneNumber">
                      {t('socialWorker.emergencyPhoneNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="emergencyPhoneNumber"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('emergencyPhoneNumber')}
                      control={control}
                      {...register('emergencyPhoneNumber')}
                      error={!!errors.emergencyPhoneNumber}
                      helperText={
                        errors && errors.emergencyPhoneNumber && errors.emergencyPhoneNumber.message
                      }
                    />
                    <FormControlLabel
                      sx={{ width: '100%' }}
                      control={
                        <Switch
                          id="isCoordinator"
                          variant="outlined"
                          checked={coordChecked}
                          onChange={handleChangeCoord}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label={
                        <Grid>
                          <Box
                            sx={{
                              display: 'inline-block',
                              backgroundColor:
                                coordChecked === true
                                  ? (theme) => theme.palette.success.main
                                  : (theme) => theme.palette.error.main,
                              borderRadius: '100%',
                              height: '10px',
                              width: '10px',
                            }}
                          />
                          {'  '}
                          <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>
                            {t('socialWorker.isCoordinator')}
                          </Typography>
                        </Grid>
                      }
                    />
                    <LoadingButton
                      loading={loadingAddSw}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      sx={{ mt: 4 }}
                    >
                      {t('socialWorker.button.update')}
                    </LoadingButton>
                  </form>
                </Card>
              </Grid>
            </Grid>

            {/* Social Worker Image */}
            <Dialog
              open={openImageDialog}
              onClose={handleImageClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <Box>
                  <UploadIdImage
                    uploadImage={uploadImage}
                    handleImageClose={handleImageClose}
                    setFinalImageFile={setFinalImageFile}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Social Worker ID Image */}
            <Dialog
              open={openIdImageDialog}
              onClose={handleIdImageClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <Box>
                  <UploadIdImage
                    uploadImage={uploadIdImage}
                    handleImageClose={handleIdImageClose}
                    setFinalImageFile={setFinalIdImageFile}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            <Grid>
              {(successAddUpdate || errorAddUpdate) && (
                <Message
                  severity={successAddUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addSw"
                  backError={errorAddUpdate}
                  sx={{ width: '100%' }}
                >
                  {successAddUpdate && t('socialWorker.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default SocialWorkerAdd;
