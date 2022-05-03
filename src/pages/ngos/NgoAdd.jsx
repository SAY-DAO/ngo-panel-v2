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
import { AddNgo } from '../../redux/actions/ngoAction';

const BCrumb = [
  {
    to: '/ngo/list',
    title: 'NGOs List',
  },
  {
    title: 'Add',
  },
];

const NgoAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);

  const swAdd = useSelector((state) => state.swAdd);
  const { success: successAddUpdate, loading: loadingAddSw, error: errorAddUpdate } = swAdd;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your first name'),
    country: Yup.string().required('Please enter your country'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    postalAddress: Yup.string().required('Please enter your postalAddress'),
    emailAddress: Yup.string().required('Email is required').email('Email is invalid'),
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
      console.log('watch');
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
      AddNgo({
        name: data.name,
        website: data.website,
        emailAddress: data.emailAddress,
        country: data.country,
        // state: data.state,
        // city: data.city,
        phoneNumber: data.phoneNumber,
        postalAddress: data.postalAddress,
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
    console.log('remove');
  };

  return (
    <PageContainer title="Social Worker Add" description="this is Social Worker Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
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
                        alt="ngo logo"
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
                  {t('socialWorker.titleAdd')}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <CustomFormLabel htmlFor="name">NGO Name</CustomFormLabel>
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
                  <CustomFormLabel htmlFor="Email">{t('ngo.emailAddress')}</CustomFormLabel>
                  <TextField
                    id="emailAddress"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    control={control}
                    {...register('emailAddress')}
                    error={!!errors.emailAddress}
                  />
                  <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                    {errors && errors.emailAddress && errors.emailAddress.message}
                  </FormHelperText>
                  <CustomFormLabel htmlFor="Website">{t('ngo.website')}</CustomFormLabel>
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
                  <CustomFormLabel htmlFor="country">{t('ngo.country')}</CustomFormLabel>
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
                      <CustomFormLabel htmlFor="state">{t('ngo.state')}</CustomFormLabel>
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
                      <CustomFormLabel htmlFor="city">{t('ngo.city')}</CustomFormLabel>
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
                  {/* <CustomFormLabel htmlFor="city">{t('ngo.city')}</CustomFormLabel>
                  <CustomSelect
                 
                  >
                    {cities &&
                      states &&
                      states.map((city) => (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name}
                        </MenuItem>
                      ))}
                  </CustomSelect> */}

                  <CustomFormLabel htmlFor="postalAddress">
                    {t('ngo.postalAddress')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="postalAddress"
                    variant="outlined"
                    multiline
                    rows={4}
                    size="small"
                    sx={{ mb: 2 }}
                    fullWidth
                    control={control}
                    register={{ ...register('postalAddress') }}
                  />
                  <CustomFormLabel htmlFor="phoneNumber">{t('ngo.phoneNumber')}</CustomFormLabel>
                  <TextField
                    id="phoneNumber"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                    control={control}
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber}
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
      )}
    </PageContainer>
  );
};

export default NgoAdd;
