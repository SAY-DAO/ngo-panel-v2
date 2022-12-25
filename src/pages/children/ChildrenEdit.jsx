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
  // MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
  Autocomplete,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HotelIcon from '@mui/icons-material/Hotel';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import MuiAudioPlayer from 'mui-audio-player-plus';

import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { updateChild, fetchMyChildById } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
// import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadIdImage from '../../components/UploadImage';
// import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { NGO_BY_ID_RESET } from '../../redux/constants/ngoConstants';

const BCrumb = [
  {
    to: '/child/list',
    title: 'Children List',
  },
  {
    title: 'Edit',
  },
];

const ChildrenEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

  // const [activeChecked, setActiveChecked] = useState(false);
  const [finalAvatar, setFinalAvatar] = useState();
  const [finalSleptAvatar, setFinalSleptAvatar] = useState();
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [openSleptAvatarDialog, setOpenSleptAvatarDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState(
    location.state && location.state.newImage,
  );
  const [uploadVoice, setUploadVoice] = useState(location.state && location.state.newImage);
  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const loadingNgo = openNgo && optionsNgo.length === 0;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChild, success: successChild } = childById;
  const [ngoId, setNgoId] = useState(result.id_ngo);
  console.log(ngoId);

  // const ngoStatusUpdate = useSelector((state) => state.ngoStatusUpdate);
  // const { status } = ngoStatusUpdate;

  // const ngoUpdate = useSelector((state) => state.ngoUpdate);
  // const { success: successNgoUpdate, loading: loadingNgoUpdate, error: errorNgoUpdate } = ngoUpdate;

  useEffect(() => {
    if (id) {
      dispatch(fetchMyChildById(id));
    }
  }, [id]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }
    if (active && successNgoList) {
      setOptionsNgo([...ngoList]);
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList]);

  // ngo open
  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    } else {
      dispatch(fetchNgoList());
    }
  }, [openNgo]);

  // isActive
  // useEffect(() => {
  //   if (result && result.isActive) {
  //     setActiveChecked(true);
  //   } else {
  //     setActiveChecked(false);
  //   }
  // }, [successNgoById, status]);

  // const handleChangeActive = () => {
  //   if (activeChecked && result.isActive) {
  //     dispatch(updateNgoIsActive(result.id, 'deactivate'));
  //   } else if (!activeChecked && !result.isActive) {
  //     dispatch(updateNgoIsActive(result.id, 'activate'));
  //   }
  // };

  const validationSchema = Yup.object().shape({
    sayName_fa: Yup.string().required('Please enter child`s SAY name'),
    sayName_en: Yup.string().required('Please enter child`s SAY name'),
    firstName_fa: Yup.string(),
    firstName_en: Yup.string(),
    lastName_fa: Yup.string(),
    lastName_en: Yup.string(),
    gender: Yup.boolean().required('Please enter child`s gender'),
    nationality: Yup.string(),
    address: Yup.string(),
    country: Yup.string().required('Please enter child`s country'),
    city: Yup.string().required('Please enter child`s city'),
    birthDate: Yup.string(),
    birthPlace: Yup.string(),
    phoneNumber: Yup.string().required('Please enter child`s phone number'),
    familyCount: Yup.number(),
    housingStatus: Yup.number(),
    avatarUrl: Yup.string().required('Please choose child`s avatar'),
    sleptAvatarUrl: Yup.string().required('Please choose child`s slept avatar'),
    voiceUrl: Yup.string().required('Please choose child`s voice'),
    bio_fa: Yup.string().required('Please enter child`s bio'),
    bio_en: Yup.string().required('Please enter child`s bio'),
    bioSummary_fa: Yup.string().required('Please enter child`s bio summary'),
    bioSummary_en: Yup.string().required('Please enter child`s bio summary'),
  });

  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (result) {
      setValue('sayName_fa', result.sayname_translations.fa);
      setValue('sayName_en', result.sayname_translations.en);
      setValue('firstName_fa', result.firstName_translations.fa);
      setValue('firstName_en', result.firstName_translations.en);
      setValue('lastName_fa', result.lastName_translations.fa);
      setValue('lastName_en', result.lastName_translations.en);
      setValue('gender', result.gender);
      setValue('nationality', result.nationality);
      setValue('address', result.address);
      setValue('country', result.country);
      setValue('city', result.city);
      setValue('birthDate', result.birthDate);
      setValue('birthPlace', result.birthPlace);
      setValue('phoneNumber', result.phoneNumber);
      setValue('familyCount', result.familyCount);
      setValue('housingStatus', result.housingStatus);
      setValue('avatarUrl', result.avatarUrl);
      setValue('sleptAvatarUrl', result.sleptAvatarUrl);
      setValue('voiceUrl', result.voiceUrl);
      setValue('bio_fa', result.bio_translations.fa);
      setValue('bio_en', result.bio_translations.en);
      setValue('bioSummary_fa', result.bio_summary_translations.fa);
      setValue('bioSummary_en', result.bio_summary_translations.en);
    }
  }, [dispatch, result, userInfo]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updateChild({
        id,
        name: data.name,
        emailAddress: data.emailAddress,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        postalAddress: data.postalAddress,
        website: data.website,
        // logoUrl: finalImageFile,
      }),
    );
    dispatch({ type: NGO_BY_ID_RESET });
  };

  // dialog image
  const handleAvatarClickOpen = () => {
    setOpenAvatarDialog(true);
  };
  const handleAvatarClose = () => {
    setOpenAvatarDialog(false);
  };

  const handleSleptAvatarClickOpen = () => {
    setOpenSleptAvatarDialog(true);
  };
  const handleSleptAvatarClose = () => {
    setOpenSleptAvatarDialog(false);
  };

  const onAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadAvatar(e.target.files[0]);
      handleAvatarClickOpen();
    }
  };

  const onSleptAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadSleptAvatar(e.target.files[0]);
      handleSleptAvatarClickOpen();
    }
  };

  const onVoiceChange = (e) => {
    if (e.target.files[0]) {
      setUploadVoice(e.target.files[0]);
    }
  };

  // const handleChangeInput = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value });
  // };

  return (
    <PageContainer title="Child Edit" description="this is Child Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!id || loadingChild ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result &&
        successChild && (
          <>
            <Breadcrumb
              title={`Edit page - ${result.sayname_translations.en}_${result.generatedCode}`}
              subtitle="Children"
            />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Grid container spacing={0}>
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
                            <label htmlFor="upload-avatar">
                              <input
                                accept="image/*"
                                id="upload-avatar"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={onAvatarChange}
                              />

                              <IconButton
                                name="upload-avatar"
                                id="upload-avatar"
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
                        alt="child avatar"
                        sx={{ width: 110, height: 110 }}
                        src={
                          finalAvatar
                            ? URL.createObjectURL(finalAvatar) // image preview
                            : result.awakeAvatarUrl
                        }
                      >
                        <ChildCareIcon fontSize="large" />
                      </Avatar>
                    </Badge>
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
                            <label htmlFor="upload-slept-avatar">
                              <input
                                accept="image/*"
                                id="upload-slept-avatar"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={onSleptAvatarChange}
                              />

                              <IconButton
                                name="upload-slept-avatar"
                                id="upload-slept-avatar"
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
                        alt="child slept avatar"
                        sx={{ width: 110, height: 110 }}
                        src={
                          finalSleptAvatar
                            ? URL.createObjectURL(finalSleptAvatar) // image preview
                            : result.sleptAvatarUrl
                        }
                      >
                        <HotelIcon fontSize="large" />
                      </Avatar>
                    </Badge>
                  </Grid>

                  <Badge
                    sx={{ margin: '40px auto', width: '100%' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <div className="upload__image-wrapper">
                        <Grid
                          sx={{
                            position: 'relative',
                          }}
                        >
                          <label htmlFor="upload-voice">
                            <input
                              accept="audio/*"
                              id="upload-voice"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={onVoiceChange}
                            />

                            <IconButton
                              name="upload-voice"
                              id="upload-voice"
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
                    <MuiAudioPlayer
                      id="inline-timeline"
                      display="timeline"
                      containerWidth="100%"
                      inline
                      src={uploadVoice ? URL.createObjectURL(uploadVoice) : result.voiceUrl}
                    />
                  </Badge>

                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isActive"
                        variant="outlined"
                        defaultValue={result.isActive}
                        // checked={activeChecked}
                        // onChange={handleChangeActive}
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
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('ngo.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-end"
                      spacing={2}
                    >
                      <Grid item xs={6}>
                        {/* <CustomFormLabel htmlFor="name">{t('common.ngoName')}</CustomFormLabel> */}
                        <Autocomplete
                          id="asynchronous-ngo"
                          open={openNgo}
                          onOpen={() => {
                            setOpenNgo(true);
                          }}
                          onClose={() => {
                            setOpenNgo(false);
                          }}
                          onChange={(e, value) => setNgoId(value && value.id)}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          getOptionLabel={(option) => `${option.id} - ${option.name}`}
                          options={optionsNgo}
                          loading={loadingNgo}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('common.ngoName')}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingNgo ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {/* <TextField
                          required
                          id="name"
                          variant="outlined"
                          defaultValue={result.name}
                          fullWidth
                          size="small"
                          // onChange={handleChangeInput('name')}
                          control={control}
                          {...register('name')}
                          error={!!errors.name}
                        /> */}
                      </Grid>
                      <Grid item xs={6}>
                        <CustomFormLabel htmlFor="name">{t('child.socialWorker')}</CustomFormLabel>
                        <TextField
                          required
                          id="name"
                          variant="outlined"
                          defaultValue={result.name}
                          fullWidth
                          size="small"
                          // onChange={handleChangeInput('name')}
                          control={control}
                          {...register('name')}
                          error={!!errors.name}
                        />
                      </Grid>
                    </Grid>
                    <CustomFormLabel htmlFor="Email">{t('ngo.emailAddress')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.emailAddress}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      // onChange={handleChangeInput('emailAddress')}
                      control={control}
                      {...register('emailAddress')}
                      error={!!errors.emailAddress}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.emailAddress && errors.emailAddress.message}
                    </FormHelperText>

                    {/* <CustomFormLabel htmlFor="country">{t('ngo.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      defaultValue={1}
                      // onChange={handleChangeInput('country')}
                      control={control}
                      register={{ ...register('country') }}
                    >
                      <MenuItem value={result.country || 1}>{t('ngo.countries.one')}</MenuItem>
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.country && errors.country.message}
                    </FormHelperText> */}
                    {/* <CustomFormLabel htmlFor="city">{t('ngo.city')}</CustomFormLabel>
                    <CustomSelect
                      labelId="city-controlled-open-select-label"
                      id="city-controlled-open-select"
                      defaultValue={result.city || 1}
                      // onChange={handleChangeInput('city')}
                      control={control}
                      register={{ ...register('city') }}
                    >
                      <MenuItem value={1}>{t('ngo.cities.one')}</MenuItem>
                    </CustomSelect> */}

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
                      // onChange={handleChangeInput('postalAddress')}
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
                      // onChange={handleChangeInput('phoneNumber')}
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
            {/* Child Avatar */}
            <Dialog
              open={openAvatarDialog}
              onClose={handleAvatarClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
              <DialogContent>
                <Box>
                  <UploadIdImage
                    uploadImage={uploadAvatar}
                    handleImageClose={handleAvatarClose}
                    setFinalImageFile={setFinalAvatar}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAvatarClose}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Child Slept Avatar */}
            <Dialog
              open={openSleptAvatarDialog}
              onClose={handleSleptAvatarClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
              <DialogContent>
                <Box>
                  <UploadIdImage
                    uploadImage={uploadSleptAvatar}
                    handleImageClose={handleSleptAvatarClose}
                    setFinalImageFile={setFinalSleptAvatar}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSleptAvatarClose}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* <Grid>
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
            </Grid> */}
          </>
        )
      )}
    </PageContainer>
  );
};

export default ChildrenEdit;
