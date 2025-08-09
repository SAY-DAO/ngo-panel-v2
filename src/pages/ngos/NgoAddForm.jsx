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
  Divider,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/system';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import UploadImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { PRE_REGISTER_NGO_CREATE_RESET } from '../../redux/constants/ngoConstants';
import { createPreRegisterNgo } from '../../redux/actions/ngoAction';

const NgoAddForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [docImage, setDocImage] = useState(location.state && location.state.newImage);
  const [finalDocImageFile, setFinalDocImageFile] = useState();
  const [finalLogoImageFile, setFinalImageLogoFile] = useState();
  const [uploadLogo, setUploadLogo] = useState(location.state && location.state.newImage);
  const [uploadIdImage, setUploadIdImage] = useState(location.state && location.state.newIdImage);
  const [finalIdImageFile, setFinalIdImageFile] = useState();

  const {
    success: successCreatePreNgo,
    loading: loadingCreatePreNgo,
    error: errorCreatePreNgo,
  } = useSelector((state) => state.ngoPreRegister);

  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);

  const countryList = useSelector((state) => state.countryList);
  const {
    countries,
    states,
    cities,
    success: successCountryList,
    error: errorCountryList,
  } = countryList;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your ngo name'),
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    country: Yup.string().required('Please enter Ngo country'),
    phoneNumber: Yup.number().required('Please enter your phone number'),
    swPhoneNumber: Yup.number().required('Please enter your phone number'),
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
      dispatch(fetchStateList(watch('country') || countries[0]));
    }
  }, [watch('country'), countries]);

  // city
  useEffect(() => {
    if (countries && states && watch('state')) {
      dispatch(fetchCityList(watch('state') || states[0]));
    }
  }, [watch('state'), countries, states]);

  useEffect(() => {
    dispatch({ type: PRE_REGISTER_NGO_CREATE_RESET });
    if (successCreatePreNgo) {
      navigate(`/ngo/list`);
    }
  }, [successCreatePreNgo]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      createPreRegisterNgo({
        name: data.name,
        website: data.website,
        emailAddress: data.emailAddress,
        country: data.country,
        state: data.state,
        city: data.city,
        phoneNumber: data.phoneNumber,
        postalAddress: data.postalAddress,
        swPhoneNumber: data.swPhoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        logoFile: finalLogoImageFile,
        docFile: finalDocImageFile,
        idCardFile: finalIdImageFile,
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

  const onDocChange = (e) => {
    if (e.target.files[0]) {
      setUploadLogo();
      setDocImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onLogoChange = (e) => {
    if (e.target.files[0]) {
      setDocImage();
      setUploadLogo(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleRemoveImage = () => {
    console.log('remove');
    setFinalDocImageFile();
  };

  const handleRemoveAvatar = () => {
    console.log('uploadVoice');
  };

  // dialog id image
  const handleIdImageClickOpen = () => {
    setOpenIdImageDialog(true);
  };
  const handleIdImageClose = () => {
    setOpenIdImageDialog(false);
  };
  const onIdImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadIdImage(e.target.files[0]);
      handleIdImageClickOpen();
    }
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
        >
          {finalIdImageFile && (
            <img
              alt="ID"
              width="80%"
              style={{
                maxHeight: 50,
                bgcolor: 'white',
              }}
              src={
                URL.createObjectURL(finalIdImageFile) // image preview
              }
            />
          )}
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
      <Typography variant="body2" sx={{ color: 'gray' }}>
        {t('socialWorker.idCard')}
      </Typography>
    </Box>
  );
  return (
    <Container>
      <Card sx={{ p: 1 }}>
        <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
          {t('ngo.titleAdd')}
        </Typography>
        {!countries ? (
          <Grid sx={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container justifyContent="center" alignItems="center">
              {/*  NGO logo */}
              <Grid item lg={6} md={6} xs={12} sx={{ ml: 0 }}>
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
                          right: '50px',
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
                          sx={{ width: 80, height: 80 }}
                          src={
                            finalLogoImageFile
                              ? URL.createObjectURL(finalLogoImageFile) // image preview
                              : null
                          }
                        />
                        <label htmlFor="upload-image-logo">
                          <input
                            accept="image/*"
                            id="upload-image-logo"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onLogoChange}
                          />
                          <IconButton
                            name="upload-image-logo"
                            id="upload-image-logo"
                            color="primary"
                            component="div"
                            sx={{
                              position: 'absolute',
                              bottom: '-5px',
                              right: '-5px',
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
                    {t('ngo.logo')}
                  </Typography>
                </Card>
              </Grid>
              {/*  NGO docs */}
              <Grid item lg={6} md={6} xs={12} sx={{ mr: 0 }}>
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
                          right: '50px',
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
                          sx={{ width: 80, height: 80 }}
                          src={
                            finalDocImageFile
                              ? URL.createObjectURL(finalDocImageFile) // image preview
                              : null
                          }
                        />
                        <label htmlFor="upload-image">
                          <input
                            accept="image/*"
                            id="upload-image"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onDocChange}
                          />

                          <IconButton
                            name="upload-image"
                            id="upload-image"
                            color="primary"
                            component="div"
                            sx={{
                              position: 'absolute',
                              bottom: '-5px',
                              right: '-5px',
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
                    {t('ngo.document')}
                  </Typography>
                </Card>
              </Grid>

              {/*  Data */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="name">{t('ngo.name')}</CustomFormLabel>
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
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="Website">{t('ngo.website')}</CustomFormLabel>
                  <TextField
                    id="website"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('website')}
                    error={!!errors.website}
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                  <CustomFormLabel htmlFor="country">{t('ngo.country')}</CustomFormLabel>
                  <CustomSelect
                    labelId="country-controlled-open-select-label"
                    id="country-controlled-open-select"
                    control={control}
                    register={{ ...register('country') }}
                    defaultValue={103}
                    sx={{ width: '100%' }}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                  {states && (
                    <>
                      <CustomFormLabel htmlFor="state">{t('ngo.state')}</CustomFormLabel>
                      <CustomSelect
                        labelId="state-controlled-open-select-label"
                        id="state-controlled-open-select"
                        control={control}
                        register={{ ...register('state') }}
                        value={watch('state') || (states && states[0].id)}
                        sx={{ width: '100%' }}
                      >
                        {states.map((state) => (
                          <MenuItem key={state.id} value={state.id}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </>
                  )}
                </Grid>
                <Grid item lg={4} md={4} xs={12}>
                  {states && cities && (
                    <>
                      <CustomFormLabel htmlFor="city">{t('ngo.city')}</CustomFormLabel>
                      <CustomSelect
                        labelId="city-controlled-open-select-label"
                        id="city-controlled-open-select"
                        control={control}
                        register={{ ...register('city') }}
                        value={watch('city') || (cities && cities[0].id)}
                        sx={{ width: '100%' }}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </>
                  )}
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel htmlFor="postalAddress">
                    {t('ngo.postalAddress')}
                  </CustomFormLabel>
                  <TextField
                    id="postalAddress"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('postalAddress')}
                    error={!!errors.postalAddress}
                  />
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel htmlFor="phoneNumber">{t('ngo.phoneNumber')}</CustomFormLabel>
                  <TextField
                    id="phoneNumber"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber}
                  />
                </Grid>
                {/* Supervisor */}
                <Grid sx={{ minWidth: '-webkit-fill-available' }}>
                  <Divider
                    sx={{ pb: 2, mt: 4, minWidth: 'inherit' }}
                    variant="middle"
                    textAlign="center"
                  >
                    {t('ngo.supervisor')}
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, minHeight: 150 }}>
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                      <Grid item xs={12} sx={{ margin: 'auto', textAlign: 'center' }}>
                        <Grid aria-label="id card">{rectangle}</Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="firstName">
                    {t('socialWorker.firstName')}
                  </CustomFormLabel>
                  <TextField
                    required
                    id="firstName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('firstName')}
                    error={!!errors.firstName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="lastName">{t('socialWorker.lastName')}</CustomFormLabel>
                  <TextField
                    required
                    id="lastName"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('lastName')}
                    error={!!errors.lastName}
                  />
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel htmlFor="Email">{t('ngo.emailAddress')}</CustomFormLabel>
                  <TextField
                    id="emailAddress"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('emailAddress')}
                    error={!!errors.emailAddress}
                  />
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <CustomFormLabel htmlFor="swPhoneNumber">
                    {t('socialWorker.phoneNumber')}
                  </CustomFormLabel>
                  <TextField
                    id="swPhoneNumber"
                    variant="outlined"
                    fullWidth
                    size="small"
                    control={control}
                    {...register('swPhoneNumber')}
                    error={!!errors.swPhoneNumber}
                  />
                </Grid>

                <Grid item sx={{ m: 'auto', mt: 4 }}>
                  <LoadingButton
                    loading={loadingCreatePreNgo}
                    color="primary"
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                  >
                    {t('ngo.button.add')}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Card>

      {/* NGO Image */}
      <Dialog
        open={openImageDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {docImage ? (
            <Box>
              <UploadImage
                uploadImage={docImage}
                handleImageClose={handleImageClose}
                setFinalImageFile={setFinalDocImageFile}
              />
            </Box>
          ) : (
            uploadLogo && (
              <Box>
                <UploadImage
                  uploadImage={uploadLogo}
                  handleImageClose={handleImageClose}
                  setFinalImageFile={setFinalImageLogoFile}
                />
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageClose}>{t('button.close')}</Button>
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
      <Grid>
        {(successCreatePreNgo || errorCreatePreNgo || errorCountryList) && (
          <Message
            severity={successCreatePreNgo ? 'success' : 'error'}
            variant="filled"
            input="addSw"
            backError={errorCreatePreNgo || errorCountryList}
            sx={{ width: '100%' }}
          >
            {successCreatePreNgo && t('ngo.updated')}
          </Message>
        )}
      </Grid>
    </Container>
  );
};

export default NgoAddForm;
