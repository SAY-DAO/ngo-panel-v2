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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
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

const SocialWorkerProfileEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());

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
      setDateValue(result.birthDate);
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [successSwById]);

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 62,
    height: 62,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    if (checked && result.isActive) {
      dispatch(updateSwIsActive(result.id, 'deactivate'));
    } else if (!checked && !result.isActive) {
      dispatch(updateSwIsActive(result.id, 'activate'));
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    // lastName: Yup.string().required('Please enter your last name'),
    // country: Yup.string().required('Please enter your country'),
    // city: Yup.string().required('Please enter your city'),
    // province: Yup.string().required('Please enter your city'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // postalCode: Yup.string().required('Please enter your postal code'),
    // address: Yup.string().required('Please enter your address'),
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
    dispatch(updateSw(id));
  };

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };
  return (
    <PageContainer title="Customer Edit" description="this is Customer Edit page">
      {loadingSwById ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <>
            <Breadcrumb title="Edit page" subtitle="Customer" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Button onClick={handleClickOpen}>
                        <SmallAvatar
                          alt="ID card"
                          src={result.idCardUrl}
                          sx={{ boxShadow: '3px 4px #888888' }}
                        />
                      </Button>
                    }
                  >
                    <Avatar
                      alt="photo"
                      src={result && result.avatarUrl}
                      sx={{ width: 110, height: 110 }}
                    />
                  </Badge>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {result && `${result.firstName} ${result.lastName}`}
                  </Typography>
                  <Typography variant="body2"> {result && result.typeName}</Typography>
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
                                : result.status === 'Pending'
                                ? (theme) => theme.palette.warning.main
                                : result.status === 'Completed'
                                ? (theme) => theme.palette.primary.main
                                : result.status === 'Cancel'
                                ? (theme) => theme.palette.error.main
                                : (theme) => theme.palette.secondary.main,
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
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('socialWorker.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel> */}
                    <TextField
                      id="firstName"
                      variant="outlined"
                      defaultValue={result.firstName}
                      fullWidth
                      size="small"
                      required
                      control={control}
                      sx={{ width: '100%' }}
                      {...register('firstName')}
                      error={!!errors.firstName}
                    />
                    <CustomFormLabel htmlFor="lastName">
                      {t('socialWorker.lastName')}
                    </CustomFormLabel>
                    <TextField
                      id="lastName"
                      variant="outlined"
                      defaultValue={result.lastName}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <CustomFormLabel htmlFor="Email">{t('socialWorker.email')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.email}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    <CustomFormLabel htmlFor="country">{t('socialWorker.country')}</CustomFormLabel>
                    <TextField
                      id="country"
                      variant="outlined"
                      defaultValue={result.country}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <CustomFormLabel htmlFor="city">{t('socialWorker.city')}</CustomFormLabel>
                    <TextField
                      id="city"
                      variant="outlined"
                      defaultValue={result.city}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <CustomFormLabel htmlFor="postalAddress">
                      {t('socialWorker.address')}
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
                    />
                    <CustomFormLabel htmlFor="birthDate">
                      {t('socialWorker.birthDate')}
                    </CustomFormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        id="birthDate"
                        inputFormat="MM/dd/yyyy"
                        value={dateValue}
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
                    />
                    <CustomFormLabel htmlFor="typeId">{t('socialWorker.typeId')}</CustomFormLabel>
                    <TextField
                      id="typeId"
                      variant="outlined"
                      defaultValue={result.typeId}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                    />
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
                    src={result.idCardUrl}
                    style={{
                      position: 'absolute',
                      padding: '2px',
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
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
