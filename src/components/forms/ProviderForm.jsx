import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomFormLabel from './custom-elements/CustomFormLabel';
import Message from '../Message';
import CustomTextField from './custom-elements/CustomTextField';
import UploadImage from '../UploadImage';
import CustomSelect from './custom-elements/CustomSelect';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { addProvider } from '../../redux/actions/providerAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { ADD_PROVIDER_REST } from '../../redux/constants/providerConstants';
import { NeedTypeEnum } from '../../utils/types';

export default function ProviderForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [typeWatcher, setTypeWatcher] = useState();
  const [finalImageProviderFile, setFinalImageProviderFile] = useState();
  const [openProviderImageDialog, setOpenImageProviderDialog] = useState(false);
  const [uploadProviderImage, setUploadProviderImage] = useState(
    location.state && location.state.newImage,
  );

  const providerAdd = useSelector((state) => state.providerAdd);
  const {
    success: successAddProvider,
    loading: loadingAddProvider,
    error: errorAddProvider,
  } = providerAdd;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your provider name'),
    country: Yup.string().required('Please enter Provider country'),
    state: Yup.string().required('Please enter Provider state'),
    city: Yup.string().required('Please enter Provider city'),
    website:
      Number(typeWatcher) === NeedTypeEnum.PRODUCT &&
      Yup.string()
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

  // for validation
  useEffect(() => {
    setTypeWatcher(watch('type'));
  }, [watch('type')]);

  // state
  useEffect(() => {
    if (countries && watch('country')) {
      dispatch(fetchStateList(watch('country') || 103));
    }
  }, [watch('country'), countries]);

  // city
  useEffect(() => {
    if (countries && states && watch('state')) {
      dispatch(fetchCityList(watch('state')));
    }
  }, [watch('state'), countries, states]);

  // country
  useEffect(() => {
    if (!successCountryList) {
      dispatch({ type: COUNTRY_LIST_RESET });
      dispatch(fetchCountryList());
    }
    return () => {
      dispatch({ type: ADD_PROVIDER_REST });
    };
  }, [successCountryList]);

  const onSubmit = async (data) => {
    console.log(finalImageProviderFile);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);

    dispatch(
      addProvider({
        name: data.name,
        website: data.website,
        type: data.type,
        country: data.country,
        state: data.state,
        city: data.city,
        description: data.description,
        logoFile: finalImageProviderFile,
      }),
    );
  };

  const handleImageClose = () => {
    setOpenImageProviderDialog(false);
  };

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageProviderDialog(true);
  };

  const onImageChange = (e) => {
    console.log('huh');
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      setUploadProviderImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleRemoveImage = () => {
    setFinalImageProviderFile();
  };

  return (
    <>
      {!successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container sx={{ width: '100%' }}>
          <Grid item lg={12} md={8} xs={12} sx={{ margin: 'auto' }}>
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
                      alt="provider logo"
                      sx={{ width: 110, height: 110 }}
                      src={
                        finalImageProviderFile
                          ? URL.createObjectURL(finalImageProviderFile) // image preview
                          : null
                      }
                    />
                    <label htmlFor="upload-image-provider">
                      <input
                        accept="image/*"
                        id="upload-image-provider"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={onImageChange}
                      />

                      <IconButton
                        name="upload-image-provider"
                        id="upload-image-provider"
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
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                {t('provider.titleAdd')}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <CustomFormLabel htmlFor="name"> {t('provider.name')}</CustomFormLabel>
                    <TextField
                      required
                      id="name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      control={control}
                      {...register('name')}
                      placeholder={t('provider.providerExample')}
                      error={!!errors.name}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.name && errors.name.message}
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={6} lg={6}>
                    <CustomFormLabel htmlFor="type">{t('need.type_name')}</CustomFormLabel>
                    <CustomSelect
                      labelId="type-controlled-open-select-label"
                      id="type-controlled-open-select"
                      size="small"
                      defaultValue={0}
                      control={control}
                      sx={{ width: '100%' }}
                      register={{ ...register('type') }}
                    >
                      <MenuItem value={0}>{t('need.types.service')}</MenuItem>
                      <MenuItem value={1}>{t('need.types.product')}</MenuItem>
                    </CustomSelect>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="Website">{t('provider.website')}</CustomFormLabel>
                    <TextField
                      id="website"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      control={control}
                      {...register('website')}
                      error={!!errors.website}
                      placeholder="https://example.com"
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.website && errors.website.message}
                    </FormHelperText>
                  </Grid>

                  <Grid item xs={4}>
                    <CustomFormLabel htmlFor="country">{t('provider.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      value={
                        watch('country') || (countries && countries.find((c) => c.id === 103).id)
                      }
                      control={control}
                      register={{ ...register('country') }}
                      sx={{ width: '100%' }}
                      error={!!errors.country}
                    >
                      {countries &&
                        countries.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.name}
                          </MenuItem>
                        ))}
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.country && errors.country.message}
                    </FormHelperText>
                  </Grid>
                  <Grid item xs={4}>
                    {countries && states && (
                      <>
                        <CustomFormLabel htmlFor="state">{t('provider.state')}</CustomFormLabel>
                        <CustomSelect
                          labelId="state-controlled-open-select-label"
                          id="state-controlled-open-select"
                          value={watch('state') || states[0].id}
                          control={control}
                          register={{ ...register('state') }}
                          sx={{ width: '100%' }}
                          error={!!errors.state}
                        >
                          {states.map((state) => (
                            <MenuItem key={state.id} value={state.id}>
                              {state.name}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.state && errors.state.message}
                        </FormHelperText>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {cities && (
                      <>
                        <CustomFormLabel htmlFor="city">{t('provider.city')}</CustomFormLabel>
                        <CustomSelect
                          labelId="city-controlled-open-select-label"
                          id="city-controlled-open-select"
                          value={watch('city') || cities[0].id}
                          control={control}
                          register={{ ...register('city') }}
                          sx={{ width: '100%' }}
                          error={!!errors.city}
                        >
                          {cities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors && errors.city && errors.city.message}
                        </FormHelperText>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="description">
                      {t('provider.description')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="description"
                      variant="outlined"
                      multiline
                      rows={4}
                      size="small"
                      sx={{ mb: 2 }}
                      fullWidth
                      control={control}
                      register={{ ...register('description') }}
                      error={!!errors.postalAddress}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <LoadingButton
                      loading={loadingAddProvider}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="outlined"
                    >
                      {t('provider.button.add')}
                    </LoadingButton>
                  </Grid>
                </Grid>
              </form>
            </Card>
            <Grid>
              {(successAddProvider || errorAddProvider) && (
                <Message
                  severity={successAddProvider ? 'success' : 'error'}
                  variant="filled"
                  input="addSw"
                  backError={errorAddProvider}
                  sx={{ width: '100%' }}
                >
                  {successAddProvider && t('provider.updated')}
                </Message>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
      {/* Provider Image */}
      <Dialog
        open={openProviderImageDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box>
            <UploadImage
              uploadImage={uploadProviderImage}
              handleImageClose={handleImageClose}
              setFinalImageFile={setFinalImageProviderFile}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageClose}>{t('button.close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
ProviderForm.propTypes = {
  setOpenConfirm: PropTypes.func,
  openConfirm: PropTypes.bool,
  loading: PropTypes.bool,
  need: PropTypes.object,
};
