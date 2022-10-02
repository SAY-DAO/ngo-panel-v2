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
import {
  updateProvider,
  fetchProviderById,
  updateProviderIsActive,
} from '../../redux/actions/providerAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadIdImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { PROVIDER_BY_ID_RESET } from '../../redux/constants/providerConstants';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { apiDao } from '../../env';

const BCrumb = [
  {
    to: '/provider/list',
    title: 'Providers List',
  },
  {
    title: 'Edit',
  },
];

const ProviderEdit = () => {
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
    country: '',
    city: '',
    type: '',
    state: '',
    website: '',
    logoUrl: '',
  });

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const providerById = useSelector((state) => state.providerById);
  const { result, loading: loadingProviderById, success: successProviderById } = providerById;

  const providerStatusUpdate = useSelector((state) => state.providerStatusUpdate);
  const { status } = providerStatusUpdate;

  const providerUpdate = useSelector((state) => state.providerUpdate);
  const {
    success: successProviderUpdate,
    loading: loadingProviderUpdate,
    error: errorProviderUpdate,
  } = providerUpdate;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your provider name'),
    country: Yup.string().required('Please enter Provider country'),
    state: Yup.string().required('Please enter Provider state'),
    city: Yup.string().required('Please enter Provider city'),
    website: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!',
      )
      .required('Please enter website'),
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

  // country
  useEffect(() => {
    if (!successCountryList && result) {
      dispatch({ type: COUNTRY_LIST_RESET });
      dispatch(fetchCountryList());
      dispatch(fetchStateList(result.country));
      dispatch(fetchCityList(result.state));
    }
  }, [successCountryList, result]);

  // state
  useEffect(() => {
    if (countries && watch('country')) {
      dispatch(fetchStateList(watch('country')));
    }
  }, [watch('country'), countries, result]);

  // city
  useEffect(() => {
    if (states && (watch('state') || watch('country'))) {
      dispatch(fetchCityList(watch('state')));
    }
  }, [watch('state'), watch('country'), countries, states, result]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProviderById(id));
    }
  }, [successProviderUpdate, id]);

  // isActive
  useEffect(() => {
    if (result && result.isActive) {
      setActiveChecked(true);
    } else {
      setActiveChecked(false);
    }
  }, [successProviderById, status]);

  useEffect(() => {
    if (result) {
      setValues({
        ...values,
        name: result.name,
        website: result.website,
        type: result.type,
        country: result.country,
        city: result.city,
        description: result.description,
        logoUrl: result.logoUrl,
      });
    }
  }, [dispatch, result, userInfo]);

  const handleChangeActive = () => {
    if (activeChecked && result.isActive) {
      dispatch(updateProviderIsActive(result.id, 'deactivate'));
    } else if (!activeChecked && !result.isActive) {
      dispatch(updateProviderIsActive(result.id, 'activate'));
    }
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updateProvider({
        id,
        name: data.name,
        website: data.website,
        type: data.type,
        country: data.country,
        state: data.state,
        city: data.city,
        description: data.description,
        logoFile: finalImageFile,
      }),
    );
    dispatch({ type: PROVIDER_BY_ID_RESET });
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
    <PageContainer title="Provider Edit" description="this is Provider Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!id ||
      loadingProviderById ||
      loadingProviderUpdate ||
      !result ||
      !countries ||
      !states ||
      !cities ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <>
            <Breadcrumb title="Edit page" subtitle="Provider" />
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
                          : `${apiDao}/providers/images/${result.logoUrl}`
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
                          {t('provider.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('provider.website')}
                  </Typography>
                  <Typography variant="body2">{result && result.website}</Typography>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('provider.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(() => onSubmit())} noValidate>
                    <CustomFormLabel htmlFor="name">{t('provider.name')}</CustomFormLabel>
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
                    <CustomFormLabel htmlFor="Email">{t('provider.website')}</CustomFormLabel>
                    <TextField
                      id="website"
                      variant="outlined"
                      defaultValue={result.website}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('website')}
                      control={control}
                      {...register('website')}
                      error={!!errors.website}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.website && errors.website.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="type">{t('provider.type')}</CustomFormLabel>
                    <CustomSelect
                      labelId="type-controlled-open-select-label"
                      id="type-controlled-open-select"
                      defaultValue={result.type}
                      onChange={handleChangeInput('type')}
                      control={control}
                      register={{ ...register('type') }}
                    >
                      <MenuItem value={0}>{t('need.types.service')}</MenuItem>
                      <MenuItem value={1}>{t('need.types.product')}</MenuItem>
                    </CustomSelect>
                    <CustomFormLabel htmlFor="country">{t('provider.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      defaultValue={result.country}
                      onChange={handleChangeInput('country')}
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
                    <CustomFormLabel htmlFor="state">{t('provider.state')}</CustomFormLabel>
                    <CustomSelect
                      labelId="state-controlled-open-select-label"
                      id="state-controlled-open-select"
                      defaultValue={result.state}
                      onChange={handleChangeInput('state')}
                      control={control}
                      register={{ ...register('state') }}
                    >
                      {states &&
                        states.map((state) => (
                          <MenuItem key={state.id} value={state.id}>
                            {state.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.country && errors.country.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="city">{t('provider.city')}</CustomFormLabel>
                    <CustomSelect
                      labelId="city-controlled-open-select-label"
                      id="city-controlled-open-select"
                      defaultValue={result.city}
                      onChange={handleChangeInput('city')}
                      control={control}
                      register={{ ...register('city') }}
                    >
                      {states &&
                        cities &&
                        cities.map((city) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>

                    <CustomFormLabel htmlFor="description">
                      {t('provider.description')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="description"
                      variant="outlined"
                      multiline
                      rows={4}
                      defaultValue={result.description}
                      size="small"
                      sx={{ mb: 2 }}
                      fullWidth
                      onChange={handleChangeInput('description')}
                      control={control}
                      register={{ ...register('description') }}
                    />

                    <LoadingButton
                      // loading={loadingProviderUpdate}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      sx={{ mt: 4 }}
                    >
                      {t('provider.button.update')}
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
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            <Grid>
              {(successProviderUpdate || errorProviderUpdate) && (
                <Message
                  severity={successProviderUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addProvider"
                  backError={errorProviderUpdate}
                  sx={{ width: '100%' }}
                >
                  {successProviderUpdate && t('provider.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default ProviderEdit;
