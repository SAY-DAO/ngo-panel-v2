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
  FormHelperText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import UploadImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import {
  SW_BY_ID_RESET,
  UPDATE_SW_IS_ACTIVE_RESET,
  UPDATE_SW_RESET,
} from '../../redux/constants/socialWorkerConstants';
import { SW_LIST } from '../../routes/RouteConstants';

const SocialWorkerEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/sw/list',
      title: t('BCrumb.swList'),
    },
    {
      title: t('BCrumb.swEdit'),
    },
  ];

  const [myId, setMyId] = useState();
  const [finalImageFile, setFinalImageFile] = useState();
  const [finalIdImageFile, setFinalIdImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [uploadIdImage, setUploadIdImage] = useState(location.state && location.state.newIdImage);
  const [open, setOpen] = useState(false);
  const [activeChecked, setActiveChecked] = useState(false);
  const [coordChecked, setCoordChecked] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    phoneNumber: '',
    emergencyPhoneNumber: '',
    postalAddress: '',
    email: '',
    userName: '',
    telegramId: '',
    typeId: 0,
    idCardFile: '',
    idNumber: '',
    ngoId: '',
    avatarFile: '',
    newPassword: null,
    confirmNewPassword: null,
  });

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const swById = useSelector((state) => state.swById);
  const { result, loading: loadingSwById, success: successSwById } = swById;

  const swStatusUpdate = useSelector((state) => state.swStatusUpdate);
  const { status, error: errorStatusUpdate } = swStatusUpdate;

  const swUpdate = useSelector((state) => state.swUpdate);
  const { success: successSwUpdate, loading: loadingSwUpdate, error: errorSwUpdate } = swUpdate;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList, loading: loadingNgoAll } = ngoAll;

  useEffect(() => {
    if (successSwUpdate) {
      navigate(SW_LIST);
      dispatch({ type: UPDATE_SW_RESET });
      dispatch({ type: SW_BY_ID_RESET });
    }
  }, [successSwUpdate]);

  useEffect(() => {
    if (!id && userInfo) {
      // when .../profile/edit
      setMyId(userInfo.id);
    }
  }, [id, myId]);

  useEffect(() => {
    if ((!successSwById && (id || myId)) || status || successSwUpdate) {
      dispatch(fetchSocialWorkerById(id || myId));
    }
  }, [status, successSwUpdate, id, myId]);

  // isActive
  useEffect(() => {
    if (result && result.isActive) {
      setActiveChecked(true);
    } else {
      setActiveChecked(false);
    }
    return () => {
      dispatch({ type: UPDATE_SW_IS_ACTIVE_RESET });
    };
  }, [successSwById]);

  // isCoordinator
  useEffect(() => {
    if (result && result.isCoordinator) {
      setCoordChecked(true);
    } else {
      setCoordChecked(false);
    }
  }, [successSwById]);

  useEffect(() => {
    if (result) {
      setBirthDate(new Date(result.birthDate));

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
        ngoId: result.ngoId,
        avatarFile: result.avatarUrl,
      });
    }
  }, [dispatch, result, userInfo]);

  const handleChangeActive = () => {
    if (activeChecked && result.isActive) {
      dispatch(updateSwIsActive(result.id, 'deactivate'));
    } else if (!activeChecked && !result.isActive) {
      dispatch(updateSwIsActive(result.id, 'activate'));
    }
  };

  const handleChangeCoord = () => {
    if (coordChecked && result.isCoordinator) {
      dispatch(
        updateSw({
          id: id || myId,
          isCoordinator: false,
        }),
      );
    } else if (!coordChecked && !result.isCoordinator) {
      dispatch(
        updateSw({
          id: id || myId,
          isCoordinator: true,
        }),
      );
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    country: Yup.string().required('Please enter your country'),
    ngoId: Yup.string().required('Please enter your NGO'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // postalCode: Yup.string().required('Please enter your postal code'),
    // postalAddress: Yup.string().required('Please enter your postalAddress'),
    userName: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    // email: Yup.string().required('Email is required').email('Email is invalid'),
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmNewPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('newPassword'), null], 'Confirm Password does not match'),
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
        id: id || myId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        emergencyPhoneNumber: data.emergencyPhoneNumber,
        postalAddress: data.postalAddress,
        userName: data.userName,
        telegramId: data.telegramId,
        typeId: data.typeId,
        idCardFile: finalIdImageFile,
        idNumber: data.idNumber,
        ngoId: data.ngoId,
        avatarFile: finalImageFile,
        birthDate,
        password: data.newPassword && data.newPassword,
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

  const handleChangeInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const shapeStyles = { bgcolor: 'transparent', width: 80, height: 50 };
  const rectangle = (
    <Box component="span" sx={shapeStyles}>
      <div className="upload__image-wrapper">
        <Button
          sx={{
            position: 'relative',
            border: '1px dashed lightGrey',
            width: 80,
            minHeight: 50,
          }}
          onClick={handleClickOpen}
        >
          <img
            alt="ID"
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
    <PageContainer title="Social Worker Edit" description="this is Social Worker Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {(!id && !myId) || loadingSwById || loadingSwUpdate || loadingNgoAll ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        successNgoList &&
        result &&
        result.ngoId && (
          <>
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Badge
                    overlap="circular"
                    sx={{ margin: 'auto' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <div className="upload__image-wrapper">
                        <Grid
                          sx={{
                            position: 'relative',
                          }}
                        >
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
                            >
                              <AddCircleOutlineIcon
                                color="primary"
                                fontSize="medium"
                                sx={{
                                  zIndex: 10,
                                  borderRadius: '20%',
                                }}
                              />
                            </IconButton>
                          </label>
                        </Grid>
                      </div>
                    }
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
                  </Badge>

                  <Typography variant="h2" sx={{ mt: 4 }}>
                    {result && `${result.firstName} ${result.lastName}`}
                  </Typography>

                  <Typography variant="body2"> Permission: {result && result.typeName}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isActive"
                        variant="outlined"
                        defaultValue={result.isActive}
                        checked={activeChecked}
                        onChange={handleChangeActive}
                        inputProps={{ 'aria-label': 'controlled' }}
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
                        {'  '}
                        <Typography variant="subtitle2" sx={{ display: 'inline-block' }}>
                          {t('socialWorker.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isCoordinator"
                        variant="outlined"
                        defaultValue={result.isCoordinator}
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
                              result.isCoordinator === true
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
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('socialWorker.email')}
                  </Typography>
                  <Typography variant="body2">{result && result.email}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('socialWorker.phoneNumber')}
                  </Typography>
                  <Typography variant="body2">{result && result.phoneNumber}</Typography>
                </Card>
                {errorStatusUpdate && (
                  <Message
                    severity="error"
                    variant="filled"
                    input="addSw"
                    backError={errorStatusUpdate}
                    sx={{ width: '100%' }}
                  >
                    {errorStatusUpdate}
                  </Message>
                )}

                <Card sx={{ p: 3, minHeight: 150 }}>
                  <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item xs={12} sx={{ margin: 'auto', textAlign: 'center' }}>
                      <Typography variant="caption">ID #:{result.idNumber}</Typography>
                      <Grid aria-label="id card">{rectangle}</Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Card sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="firstName">
                          {t('socialWorker.firstName')}
                        </CustomFormLabel>
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
                      </Grid>
                      <Grid item lg={6}>
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
                          onChange={handleChangeInput('lastName')}
                          control={control}
                          {...register('lastName')}
                          error={!!errors.lastName}
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="Email">{t('socialWorker.email')}</CustomFormLabel>
                        <TextField
                          id="Email"
                          variant="outlined"
                          defaultValue={result.email}
                          fullWidth
                          size="small"
                          onChange={handleChangeInput('email')}
                          control={control}
                          {...register('email')}
                          error={!!errors.email}
                        />
                      </Grid>
                      <Grid item lg={3}>
                        <CustomFormLabel htmlFor="country">
                          {t('socialWorker.country')}
                        </CustomFormLabel>
                        <CustomSelect
                          labelId="country-controlled-open-select-label"
                          id="country-controlled-open-select"
                          defaultValue={result.country || 1}
                          onChange={handleChangeInput('country')}
                          control={control}
                          register={{ ...register('country') }}
                          size="small"
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value={1}>{t('socialWorker.countries.one')}</MenuItem>
                        </CustomSelect>
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.country && errors.country.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item lg={3}>
                        <CustomFormLabel htmlFor="city">{t('socialWorker.city')}</CustomFormLabel>
                        <CustomSelect
                          labelId="city-controlled-open-select-label"
                          id="city-controlled-open-select"
                          defaultValue={result.city || 1}
                          onChange={handleChangeInput('city')}
                          control={control}
                          register={{ ...register('city') }}
                          size="small"
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value={1}>{t('socialWorker.cities.one')}</MenuItem>
                        </CustomSelect>
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="phoneNumber">
                          {t('socialWorker.phoneNumber')}
                        </CustomFormLabel>
                        <TextField
                          id="phoneNumber"
                          variant="outlined"
                          defaultValue={result.phoneNumber}
                          fullWidth
                          size="small"
                          onChange={handleChangeInput('phoneNumber')}
                          control={control}
                          {...register('phoneNumber')}
                          error={!!errors.phoneNumber}
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="emergencyPhoneNumber">
                          {t('socialWorker.emergencyPhoneNumber')}
                        </CustomFormLabel>
                        <TextField
                          id="emergencyPhoneNumber"
                          variant="outlined"
                          defaultValue={result.emergencyPhoneNumber}
                          fullWidth
                          size="small"
                          onChange={handleChangeInput('emergencyPhoneNumber')}
                          control={control}
                          {...register('emergencyPhoneNumber')}
                          error={!!errors.emergencyPhoneNumber}
                        />
                      </Grid>
                      <Grid item xs={12}>
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
                          fullWidth
                          onChange={handleChangeInput('postalAddress')}
                          control={control}
                          register={{ ...register('postalAddress') }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                  <Card elevation={4}>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="birthDate">
                          {t('socialWorker.birthDate')}
                        </CustomFormLabel>
                        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                          <DesktopDatePicker
                            id="birthDate"
                            inputFormat="MM/dd/yyyy"
                            value={birthDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            error={!!errors.birthDate}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel htmlFor="telegramId">
                          {t('socialWorker.telegramId')}
                        </CustomFormLabel>
                        <OutlinedInput
                          id="telegramId"
                          startAdornment={<InputAdornment position="start">@</InputAdornment>}
                          variant="outlined"
                          defaultValue={result.telegramId}
                          fullWidth
                          size="medium"
                          onChange={handleChangeInput('telegramId')}
                          control={control}
                          {...register('telegramId')}
                          error={!!errors.telegramId}
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel id="demo-controlled-open-select-label" htmlFor="typeId">
                          {t('socialWorker.typeId')}
                        </CustomFormLabel>
                        <CustomSelect
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          defaultValue={result.typeId}
                          onChange={handleChangeInput('typeId')}
                          register={{ ...register('typeId') }}
                          size="small"
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value={1}>{t('socialWorker.roles.SUPER_ADMIN')}</MenuItem>
                          <MenuItem value={2}>{t('socialWorker.roles.SOCIAL_WORKER')}</MenuItem>
                          <MenuItem value={3}>{t('socialWorker.roles.COORDINATOR')}</MenuItem>
                          <MenuItem value={4}>{t('socialWorker.roles.NGO_SUPERVISOR')}</MenuItem>
                          <MenuItem value={5}>{t('socialWorker.roles.SAY_SUPERVISOR')}</MenuItem>
                          <MenuItem value={6}>{t('socialWorker.roles.ADMIN')}</MenuItem>
                        </CustomSelect>
                      </Grid>
                      <Grid item lg={6}>
                        <CustomFormLabel id="ngoId-controlled-open-select-label" htmlFor="ngoId">
                          {t('socialWorker.ngoName')}
                        </CustomFormLabel>
                        <CustomSelect
                          labelId="ngoId-controlled-open-select-label"
                          id="ngoId-controlled-open-select"
                          defaultValue={
                            result && ngoList && ngoList.find((n) => n.id === result.ngoId)
                              ? ngoList.find((n) => n.id === result.ngoId).id
                              : 0
                          }
                          register={{ ...register('ngoId') }}
                          control={control}
                          error={!!errors.ngoId}
                          size="small"
                          sx={{ width: '100%' }}
                        >
                          {ngoList &&
                            Object.keys(ngoList).map((key) => (
                              <MenuItem key={key} value={ngoList[key].id}>
                                {ngoList[key].name}
                              </MenuItem>
                            ))}
                        </CustomSelect>
                      </Grid>
                      <Grid item xs={6}>
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
                      </Grid>

                      <Grid item xs={6}>
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
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.userName && errors.userName.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <CustomFormLabel htmlFor="password">
                          {t('changePassword.newPassword')}
                        </CustomFormLabel>
                        <TextField
                          id="newPassword"
                          variant="outlined"
                          defaultValue={result.newPassword}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                          onChange={handleChangeInput('newPassword')}
                          control={control}
                          {...register('newPassword')}
                          error={!!errors.newPassword}
                        />
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.newPassword && errors.newPassword.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={6}>
                        <CustomFormLabel htmlFor="confirmNewPassword">
                          {t('changePassword.confirmNewPassword')}
                        </CustomFormLabel>
                        <TextField
                          id="confirmNewPassword"
                          variant="outlined"
                          defaultValue={result.confirmNewPassword}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                          onChange={handleChangeInput('confirmNewPassword')}
                          control={control}
                          {...register('confirmNewPassword')}
                          error={!!errors.confirmNewPassword}
                        />
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.confirmNewPassword && errors.confirmNewPassword.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item sx={{ m: 'auto' }}>
                        <LoadingButton
                          loading={loadingSwUpdate}
                          color="primary"
                          type="submit"
                          onClick={handleSubmit(onSubmit)}
                          variant="contained"
                        >
                          {t('socialWorker.button.update')}
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Card>
                  <Grid>
                    {(successSwUpdate || errorSwUpdate) && (
                      <Message
                        severity={successSwUpdate ? 'success' : 'error'}
                        variant="filled"
                        input="addSw"
                        backError={errorSwUpdate}
                        sx={{ width: '100%' }}
                      >
                        {successSwUpdate && t('socialWorker.updated')}
                      </Message>
                    )}
                  </Grid>
                </form>
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
                  <UploadImage
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
                  <UploadImage
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
          </>
        )
      )}
    </PageContainer>
  );
};

export default SocialWorkerEdit;
