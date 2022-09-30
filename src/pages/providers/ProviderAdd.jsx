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
  IconButton,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadIdImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { addProvider } from '../../redux/actions/providerAction';

const BCrumb = [
  {
    to: '/provider/list',
    title: 'Providers List',
  },
  {
    title: 'Add',
  },
];

const ProviderAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);

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

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
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
        logoUrl: finalImageFile,
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

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleRemoveImage = () => {
    setFinalImageFile();
  };

  return (
    <PageContainer title="Provider Add" description="this is Provider Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Breadcrumb title="Add page" subtitle="Provider" />
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
                        alt="provider logo"
                        sx={{ width: 110, height: 110 }}
                        src={
                          finalImageFile
                            ? URL.createObjectURL(finalImageFile) // image preview
                            : null
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
            </Grid>
            <Grid item lg={8} md={12} xs={12}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  {t('provider.titleAdd')}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <CustomFormLabel htmlFor="name"> {t('provider.name')}</CustomFormLabel>
                  <TextField
                    required
                    id="name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('name')}
                    error={!!errors.name}
                  />
                  <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                    {errors && errors.name && errors.name.message}
                  </FormHelperText>
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
                  />
                  <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                    {errors && errors.website && errors.website.message}
                  </FormHelperText>
                  <CustomFormLabel htmlFor="type">{t('need.type_name')}</CustomFormLabel>
                  <CustomSelect
                    labelId="type-controlled-open-select-label"
                    id="type-controlled-open-select"
                    defaultValue={1}
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
                    defaultValue={countries && countries[0].id}
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
                      <CustomFormLabel htmlFor="state">{t('provider.state')}</CustomFormLabel>
                      <CustomSelect
                        labelId="state-controlled-open-select-label"
                        id="state-controlled-open-select"
                        defaultValue={states && states[0].id}
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
                      <CustomFormLabel htmlFor="city">{t('provider.city')}</CustomFormLabel>
                      <CustomSelect
                        labelId="city-controlled-open-select-label"
                        id="city-controlled-open-select"
                        defaultValue={cities && cities[0].id}
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

                  <LoadingButton
                    loading={loadingAddProvider}
                    color="primary"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    sx={{ mt: 4 }}
                  >
                    {t('provider.button.add')}
                  </LoadingButton>
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

          {/* Provider Image */}
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
        </>
      )}
    </PageContainer>
  );
};

export default ProviderAdd;
