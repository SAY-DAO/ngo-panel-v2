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
  TextField,
  IconButton,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { updateNgo, fetchNgoById, updateNgoIsActive } from '../../redux/actions/ngoAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { NGO_BY_ID_RESET } from '../../redux/constants/ngoConstants';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';

const BCrumb = [
  {
    to: '/ngo/list',
    title: 'NGOs List',
  },
  {
    title: 'Edit',
  },
];

const NgoEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

  const [activeChecked, setActiveChecked] = useState(false);
  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [values, setValues] = useState({
    name: '',
    website: '',
    country: '',
    city: '',
    phoneNumber: '',
    postalAddress: '',
    emailAddress: '',
    logoUrl: '',
  });

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const ngoById = useSelector((state) => state.ngoById);
  const { result, loading: loadingNgoById, success: successNgoById } = ngoById;

  const ngoStatusUpdate = useSelector((state) => state.ngoStatusUpdate);
  const { status } = ngoStatusUpdate;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const ngoUpdate = useSelector((state) => state.ngoUpdate);
  const { success: successNgoUpdate, loading: loadingNgoUpdate, error: errorNgoUpdate } = ngoUpdate;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your first name'),
    country: Yup.string().required('Please enter your country'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    postalAddress: Yup.string().required('Please enter your postalAddress'),
    emailAddress: Yup.string()
      // .min(3, 'must be at least 3 characters long')
      .email('Please enter your email')
      .required('Email is required'),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if ((!successNgoById && id) || status) {
      dispatch(fetchNgoById(id));
    }
  }, [status, successNgoUpdate, id]);

  // isActive
  useEffect(() => {
    if (result && result.isActive) {
      setActiveChecked(true);
    } else {
      setActiveChecked(false);
    }
  }, [successNgoById, status]);

  useEffect(() => {
    if (result) {
      setValues({
        ...values,
        name: result.name,
        website: result.website,
        emailAddress: result.emailAddress,
        country: result.country,
        city: result.city,
        phoneNumber: result.phoneNumber,
        postalAddress: result.postalAddress,
        logoUrl: result.logoUrl,
      });
    }
  }, [dispatch, result, userInfo]);

  // country
  useEffect(() => {
    if (!successCountryList) {
      dispatch({ type: COUNTRY_LIST_RESET });
      dispatch(fetchCountryList());
    }
  }, [successCountryList]);

  // state
  useEffect(() => {
    if (countries && watch('country')) {
      dispatch(fetchStateList(watch('country')));
    }
  }, [watch('country'), countries]);

  // city
  useEffect(() => {
    if (countries && states && watch('state')) {
      dispatch(fetchCityList(watch('state')));
    }
  }, [watch('state'), countries, states]);

  const handleChangeActive = () => {
    if (activeChecked && result.isActive) {
      dispatch(updateNgoIsActive(result.id, 'deactivate'));
    } else if (!activeChecked && !result.isActive) {
      dispatch(updateNgoIsActive(result.id, 'activate'));
    }
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updateNgo({
        id,
        name: data.name,
        emailAddress: data.emailAddress,
        country: data.country,
        state: data.state,
        city: data.city,
        phoneNumber: data.phoneNumber,
        postalAddress: data.postalAddress,
        website: data.website,
        logoUrl: finalImageFile,
      }),
    );

    dispatch({ type: NGO_BY_ID_RESET });
  };

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageDialog(true);
  };
  const handleImageClose = () => {
    setOpenImageDialog(false);
  };

  const handleIdImageClose = () => {
    setOpenIdImageDialog(false);
  };

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleChangeInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <PageContainer title="NGO Edit" description="this is NGO Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!id || loadingNgoById || loadingNgoUpdate ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <>
            <Breadcrumb title="Edit page" subtitle="NGO" />
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
                          : values.logoUrl
                      }
                    />
                  </Badge>

                  <Typography variant="h2" sx={{ mt: 4 }}>
                    {result && `${result.name}`}
                  </Typography>
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
                          {t('ngo.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('ngo.emailAddress')}
                  </Typography>
                  <Typography variant="body2">{result && result.emailAddress}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('ngo.phoneNumber')}
                  </Typography>
                  <Typography variant="body2">{result && result.phoneNumber}</Typography>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('ngo.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="name">{t('ngo.name')}</CustomFormLabel>
                    <TextField
                      required
                      id="name"
                      variant="outlined"
                      defaultValue={result.name}
                      fullWidth
                      size="small"
                      onChange={handleChangeInput('name')}
                      control={control}
                      {...register('name')}
                      error={!!errors.name}
                    />
                    <CustomFormLabel htmlFor="Email">{t('ngo.emailAddress')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.emailAddress}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('emailAddress')}
                      control={control}
                      {...register('emailAddress')}
                      error={!!errors.emailAddress}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.emailAddress && errors.emailAddress.message}
                    </FormHelperText>

                    <CustomFormLabel htmlFor="country">{t('ngo.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      value={watch('country') || result.city.countryId}
                      control={control}
                      register={{ ...register('country') }}
                    >
                      {countries &&
                        countries.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                    {countries && states && (
                      <>
                        <CustomFormLabel htmlFor="state">{t('ngo.state')}</CustomFormLabel>
                        <CustomSelect
                          labelId="state-controlled-open-select-label"
                          id="state-controlled-open-select"
                          value={watch('state') || result.city.stateId || 0}
                          control={control}
                          register={{ ...register('state') }}
                        >
                          {states.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </>
                    )}
                    {countries && states && cities && (
                      <>
                        <CustomFormLabel htmlFor="city">{t('ngo.city')}</CustomFormLabel>
                        <CustomSelect
                          labelId="city-controlled-open-select-label"
                          id="city-controlled-open-select"
                          value={watch('city') || result.city.id}
                          control={control}
                          register={{ ...register('city') }}
                        >
                          {cities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </>
                    )}

                    <CustomFormLabel htmlFor="postalAddress">
                      {t('ngo.postalAddress')}
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
                    <CustomFormLabel htmlFor="phoneNumber">{t('ngo.phoneNumber')}</CustomFormLabel>
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
                    <LoadingButton
                      // loading={loadingNgoUpdate}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      sx={{ mt: 4 }}
                    >
                      {t('ngo.button.update')}
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
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.name} ${result.lastName}`}
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
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            <Grid>
              {(successNgoUpdate || errorNgoUpdate) && (
                <Message
                  severity={successNgoUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addNgo"
                  backError={errorNgoUpdate}
                  sx={{ width: '100%' }}
                >
                  {successNgoUpdate && t('ngo.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default NgoEdit;
