import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Badge,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  OutlinedInput,
  IconButton,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import {
  fetchSocialWorkerById,
  updateSw,
  updateSwIsActive,
} from '../../redux/actions/socialWorkerAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadIdImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';

const SocialWorkerProfileEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  // const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [finalImageFile, setFinalImageFile] = useState();
  const [finalIdImageFile, setFinalIdImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [uploadIdImage, setUploadIdImage] = useState(location.state && location.state.newIdImage);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    phoneNumber: '',
    emergePhone: '',
    postalAddress: '',
    email: '',
    userName: '',
    telegramId: '',
    typeId: 0,
    idCardFile: '',
    idNumber: '',
    ngoName: '',
    avatarFile: '',
  });
  // const [openSelect, setOpenSelect] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const swById = useSelector((state) => state.swById);
  const { result, loading: loadingSwById, success: successSwById } = swById;

  const swStatusUpdate = useSelector((state) => state.swStatusUpdate);
  const { status } = swStatusUpdate;

  const swUpdate = useSelector((state) => state.swUpdate);
  const { success: successSwUpdate, error: errorSwUpdate } = swUpdate;

  useEffect(() => {
    dispatch(fetchSocialWorkerById(id));
  }, [dispatch, status]);

  useEffect(() => {
    if (result && result.isActive) {
      setBirthDate(result.birthDate);
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [successSwById]);

  useEffect(() => {
    if (result) {
      setValues({
        ...values,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        country: result.country,
        city: result.city,
        phoneNumber: result.phoneNumber,
        emergencyPhoneNumber: result.emergencyPhoneNumber,
        postalAddress: result.postalAddress,
        userName: result.username,
        telegramId: result.telegramId,
        typeId: result.typeId,
        idCardFile: result.idCardUrl,
        idNumber: result.idNumber,
        ngoName: result.ngoName,
        avatarFile: result.avatarUrl,
      });
    }
  }, [dispatch, result, userInfo]);

  const handleChange = () => {
    if (checked && result.isActive) {
      dispatch(updateSwIsActive(result.id, 'deactivate'));
    } else if (!checked && !result.isActive) {
      dispatch(updateSwIsActive(result.id, 'activate'));
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    country: Yup.string().required('Please enter your country'),
    city: Yup.string().required('Please enter your city'),
    // province: Yup.string().required('Please enter your city'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // postalCode: Yup.string().required('Please enter your postal code'),
    // postalAddress: Yup.string().required('Please enter your postalAddress'),
    // username: Yup.string()
    //   .required('Username is required')
    //   .min(6, 'Username must be at least 6 characters')
    //   .max(20, 'Username must not exceed 20 characters'),
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
      updateSw({
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        data: values.emergencyPhoneNumber,
        postalAddress: data.postalAddress,
        userName: data.userName,
        telegramId: data.telegramId,
        typeId: data.typeId,
        idCardFile: finalIdImageFile,
        idNumber: data.idNumber,
        ngoName: data.ngoName,
        avatarFile: finalImageFile,
        birthDate,
      }),
    );
  };

  // dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
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

  // const handleSelectClose = () => {
  //   setOpenSelect(false);
  // };

  // const handleSelectOpen = () => {
  //   setOpenSelect(true);
  // };

  const onImageChange = (e) => {
    // if (location.state && location.state.newIdImage) {
    //   setUploadIdImage(location.state.newIdImage);
    // }
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
      // navigate(`/sw/edit/upload`, {
      //   state: { imageUpload: e.target.files[0], id },
      // });
    }
  };

  const onIdImageChange = (e) => {
    // if (location.state && location.state.newImage) {
    //   setUploadImage(location.state.newImage);
    // }
    if (e.target.files[0]) {
      setUploadIdImage(e.target.files[0]);
      handleIdImageClickOpen();
      // navigate(`/sw/edit/upload`, {
      //   state: { idImageUpload: e.target.files[0], id },
      // });
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
  const shapeStyles = { bgcolor: 'darkGrey', width: 80, height: 50 };
  const rectangle = (
    <Box component="span" sx={shapeStyles}>
      <div className="upload__image-wrapper">
        <Button
          sx={{
            position: 'relative',
            width: '100%',
          }}
          onClick={handleClickOpen}
        >
          <img
            alt=""
            width="80%"
            style={{
              maxHeight: 50,
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

        <IconButton
          name="upload-id-image"
          id="upload-id-image"
          color="primary"
          component="div"
          sx={{
            position: 'absolute',
            bottom: '-10px',
            left: '60px',
          }}
        >
          <AddCircleOutlineIcon
            color="primary"
            fontSize="small"
            sx={{
              borderRadius: '20%',
              backgroundColor: 'primary.light',
            }}
          />
        </IconButton>
        <IconButton
          onClick={handleRemoveIdImage}
          color="secondary"
          sx={{
            position: 'absolute',
            bottom: '-10px',
            left: '25px',
          }}
        >
          <RemoveCircleOutlineIcon
            color="secondary"
            fontSize="small"
            sx={{
              borderRadius: '20%',
              backgroundColor: 'white',
            }}
          />
        </IconButton>
      </label>
    </Box>
  );

  return (
    <PageContainer title="Social Worker Edit" description="this is Social Worker Edit page">
      {loadingSwById ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <>
            {/*  when uploaded route to editing studio */}
            <Breadcrumb title="Edit page" subtitle="Social Worker" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        onClick={handleRemoveImage}
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          bottom: '-25px',
                          right: '60px',
                        }}
                      >
                        <RemoveCircleOutlineIcon
                          color="secondary"
                          fontSize="small"
                          sx={{
                            borderRadius: '20%',
                            backgroundColor: 'white',
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
                              bottom: '-20px',
                              right: '25px',
                            }}
                          >
                            <AddCircleOutlineIcon
                              color="primary"
                              fontSize="small"
                              sx={{
                                borderRadius: '20%',
                                backgroundColor: 'white',
                              }}
                            />
                          </IconButton>
                        </label>
                      </Grid>
                    </div>
                  </Badge>

                  <Typography variant="h2" sx={{ mt: 4 }}>
                    {result && `${result.firstName} ${result.lastName}`}
                  </Typography>
                  <Typography variant="body2">
                    Coordinator: {result && result.isCoordinator ? 'True' : 'False'}
                  </Typography>
                  <Typography variant="body2"> Permission: {result && result.typeName}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isActive"
                        variant="outlined"
                        defaultValue={result.isActive}
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        label="hi"
                      />
                    }
                    label={
                      <Grid>
                        <Box
                          sx={{
                            display: 'inline-block',
                            backgroundColor:
                              result.isActive === true
                                ? (theme) => theme.palette.success.main
                                : (theme) => theme.palette.error.main,
                            borderRadius: '100%',
                            height: '10px',
                            width: '10px',
                          }}
                        />
                        <Typography sx={{ display: 'inline-block' }}>
                          {t('socialWorker.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />

                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('socialWorker.email')}
                  </Typography>
                  <Typography variant="body2">{result && result.email}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('socialWorker.phoneNumber')}
                  </Typography>
                  <Typography variant="body2">{result && result.phoneNumber}</Typography>
                </Card>
                <Card>
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={6} sx={{ position: 'relative' }}>
                      <Grid aria-label="id card">{rectangle}</Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">ID #:{result.idNumber}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('socialWorker.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel>
                    <TextField
                      required
                      id="firstName"
                      variant="outlined"
                      defaultValue={result.firstName}
                      fullWidth
                      size="small"
                      onChange={handleChangeInput('firstName')}
                      control={control}
                      {...register('firstName')}
                      error={!!errors.firstName}
                    />
                    <CustomFormLabel htmlFor="lastName">
                      {t('socialWorker.lastName')}
                    </CustomFormLabel>
                    <TextField
                      required
                      id="lastName"
                      variant="outlined"
                      defaultValue={result.lastName}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('lastName')}
                      control={control}
                      {...register('lastName')}
                      error={!!errors.lastName}
                    />
                    <CustomFormLabel htmlFor="Email">{t('socialWorker.email')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.email}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('email')}
                      control={control}
                      {...register('email')}
                      error={!!errors.email}
                    />

                    <CustomFormLabel htmlFor="country">{t('socialWorker.country')}</CustomFormLabel>
                    <TextField
                      id="country"
                      variant="outlined"
                      defaultValue={result.country}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('country')}
                      control={control}
                      {...register('country')}
                      error={!!errors.country}
                    />
                    <CustomFormLabel htmlFor="city">{t('socialWorker.city')}</CustomFormLabel>
                    <TextField
                      id="city"
                      variant="outlined"
                      defaultValue={result.city}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('city')}
                      control={control}
                      {...register('city')}
                      error={!!errors.city}
                    />
                    <CustomFormLabel htmlFor="postalAddress">
                      {t('socialWorker.postalAddress')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="postalAddress"
                      variant="outlined"
                      multiline
                      rows={4}
                      defaultValue={result.postalAddress}
                      size="small"
                      sx={{ mb: 2 }}
                      fullWidth
                      onChange={handleChangeInput('postalAddress')}
                      control={control}
                      register={{ ...register('postalAddress') }}
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
                      />
                    </LocalizationProvider>

                    <CustomFormLabel htmlFor="telegramId">
                      {t('socialWorker.telegramId')}
                    </CustomFormLabel>
                    <OutlinedInput
                      id="telegramId"
                      startAdornment={<InputAdornment position="start">@</InputAdornment>}
                      variant="outlined"
                      defaultValue={result.telegramId}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('telegramId')}
                      control={control}
                      {...register('telegramId')}
                      error={!!errors.telegramId}
                    />
                    <CustomFormLabel htmlFor="idNumber">
                      {t('socialWorker.idNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="idNumber"
                      variant="outlined"
                      defaultValue={result.idNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('idNumber')}
                      control={control}
                      {...register('idNumber')}
                      error={!!errors.idNumber}
                    />
                    <CustomFormLabel htmlFor="idNumber">
                      {t('socialWorker.ngoName')}
                    </CustomFormLabel>
                    <TextField
                      id="ngoName"
                      variant="outlined"
                      defaultValue={result.ngoName}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('ngoName')}
                      control={control}
                      {...register('ngoName')}
                      error={!!errors.ngoName}
                    />
                    <CustomFormLabel id="demo-controlled-open-select-label" htmlFor="typeId">
                      {t('socialWorker.typeId')}
                    </CustomFormLabel>
                    <CustomSelect
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      defaultValue={result.typeId}
                      label="Age"
                      onChange={handleChangeInput('typeId')}
                      register={{ ...register('typeId') }}
                    >
                      <MenuItem value={1}>{t('socialWorker.roles.SUPER_ADMIN')}</MenuItem>
                      <MenuItem value={2}>{t('socialWorker.roles.SOCIAL_WORKER')}</MenuItem>
                      <MenuItem value={3}>{t('socialWorker.roles.COORDINATOR')}</MenuItem>
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
                      defaultValue={result.phoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('phoneNumber')}
                      control={control}
                      {...register('phoneNumber')}
                      error={!!errors.phoneNumber}
                    />
                    <CustomFormLabel htmlFor="emergencyPhoneNumber">
                      {t('socialWorker.emergencyPhoneNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="emergencyPhoneNumber"
                      variant="outlined"
                      defaultValue={result.emergencyPhoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('emergencyPhoneNumber')}
                      control={control}
                      {...register('emergencyPhoneNumber')}
                      error={!!errors.emergencyPhoneNumber}
                    />
                    <CustomFormLabel htmlFor="userName">
                      {t('socialWorker.userName')}
                    </CustomFormLabel>
                    <TextField
                      id="userName"
                      variant="outlined"
                      defaultValue={result.username}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('userName')}
                      control={control}
                      {...register('userName')}
                      error={!!errors.userName}
                    />

                    <Button
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      sx={{ mt: 4 }}
                    >
                      {t('socialWorker.button.update')}
                    </Button>
                  </form>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.firstName} ${result.lastName}`}
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'scroll',
                    width: 400,
                    height: 300,
                    backgroundColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                >
                  <img
                    alt="social worker ID"
                    src={
                      (finalIdImageFile && URL.createObjectURL(finalIdImageFile)) ||
                      result.idCardUrl
                    }
                    style={{
                      position: 'absolute',
                      padding: '2px',
                    }}
                    width="100%"
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Social Worker Image */}
            <Dialog
              open={openImageDialog}
              onClose={handleImageClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.firstName} ${result.lastName}`}
              </DialogTitle>
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
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.firstName} ${result.lastName}`}
              </DialogTitle>
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
              {(successSwUpdate || errorSwUpdate) && (
                <Message
                  severity={successSwUpdate ? 'success' : 'error'}
                  variant="filled"
                  backError={errorSwUpdate}
                  sx={{ width: '100%' }}
                >
                  {t('socialWorker.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default SocialWorkerProfileEdit;
