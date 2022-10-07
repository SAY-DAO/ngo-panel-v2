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
  Autocomplete,
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
import FeatherIcon from 'feather-icons-react';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { AddChild } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import {
  fetchSocialWorkerById,
  fetchSocialWorkersList,
} from '../../redux/actions/socialWorkerAction';
import UploadImage from '../../components/UploadImage';
import VoiceBar from '../../components/VoiceBar';

const BCrumb = [
  {
    to: '/child/list',
    title: 'Children List',
  },
  {
    title: 'Add',
  },
];

const Children = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [finalAvatarFile, setFinalAvatarFile] = useState();
  const [finalSleptAvatarFile, setFinalSleptAvatarFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState(
    location.state && location.state.newImage,
  );
  const [uploadVoice, setUploadVoice] = useState(location.state && location.state.newImage);

  const [ngoId, setNgoId] = useState();
  const [swId, setSwId] = useState();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const isLoadingNgo = openNgo && optionsNgo.length === 0;

  const childAdd = useSelector((state) => state.childAdd);
  const { success: successAddChild, loading: loadingAddChild, error: errorAddChild } = childAdd;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading: loadingSwAll, success: successSwAll } = swAll;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

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

  // social worker
  useEffect(() => {
    if (swId) {
      dispatch(fetchSocialWorkerById(swId));
    }
  }, [swId]);

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

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!isLoadingNgo) {
      return undefined;
    }
    if (active && successNgoList) {
      setOptionsNgo([...ngoList]);
    }
    return () => {
      active = false;
    };
  }, [isLoadingNgo, successNgoList]);

  // ngo open
  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    } else {
      dispatch(fetchNgoList());
    }
  }, [openNgo]);

  // Autocomplete Social worker
  useEffect(() => {
    let active = true;
    if (active && successSwAll) {
      // sort social worker
      const filtered = swList.filter((s) => s.ngoId === ngoId);
      const sortedSocialWorkers = filtered.sort((a, b) => Number(b.isActive) - Number(a.isActive));

      setOptions([...sortedSocialWorkers]);
    }
    return () => {
      active = false;
    };
  }, [ngoId, successSwAll]);

  // social worker open
  useEffect(() => {
    if (!open || openNgo) {
      setOptions([]);
    } else if (ngoId && (open || !openNgo)) {
      dispatch(fetchSocialWorkersList());
    }
  }, [open, openNgo, ngoId]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      AddChild({
        ngo_id: data.ngo_id,
        awakeAvatarUrl: finalAvatarFile,
        sleptAvatarUrl: finalSleptAvatarFile,
        voiceUrl: data.voiceUrl,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
        sayname_translations: data.sayname_translations,
        bio_translations: data.bio_translations,
        bio_summary_translations: data.bio_summary_translations,
        firstName_translations: data.firstName_translations,
        lastName_translations: data.lastName_translations,
        nationality: data.nationality,
        birthPlace: data.birthPlace,
        address: data.address,
        housingStatus: data.housingStatus,
        familyCount: data.familyCount,
        education: data.education,
        school_type: data.school_type,
        logoUrl: finalAvatarFile,
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

  const onAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadSleptAvatar();
      setUploadAvatar(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onSleptAvatarChange = (e) => {
    if (e.target.files[0]) {
      setUploadAvatar();
      setUploadSleptAvatar(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const onVoiceChange = (e) => {
    if (e.target.files[0]) {
      setUploadVoice(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveAvatar = () => {
    console.log(uploadVoice);
  };

  return (
    <PageContainer title="Social Worker Add" description="this is Social Worker Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Autocomplete
            id="asynchronous-ngo"
            sx={{ width: 300 }}
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
            loading={isLoadingNgo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ngo"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingNgo ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            id="asynchronous-social-worker"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={(e, value) => setSwId(value && value.id)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              option.isActive
                ? `${option.id} - ${option.firstName}`
                : `${option.id} - ${option.firstName}`
            }
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.isActive ? (
                  <>
                    <FeatherIcon color="green" icon="check" width="18" />
                    <Typography>{`${option.id} - ${option.firstName}`}</Typography>
                  </>
                ) : (
                  <>
                    <FeatherIcon color="red" icon="x" width="18" />
                    <Typography>{`${option.id} - ${option.firstName} `}</Typography>
                  </>
                )}
              </Box>
            )}
            options={successNgoList && ngoId ? options : []}
            loading={loadingSwAll}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Social Worker"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingSwAll ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {!successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {swId && (
            <>
              <Grid container spacing={0}>
                <Grid item lg={4} md={12} xs={12} sx={{ m: 'auto', mr: 0 }}>
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
                              finalAvatarFile
                                ? URL.createObjectURL(finalAvatarFile) // image preview
                                : null
                            }
                          />
                          <label htmlFor="upload-image-avatar">
                            <input
                              accept="image/*"
                              id="upload-image-avatar"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={onAvatarChange}
                            />

                            <IconButton
                              name="upload-image-avatar"
                              id="upload-image-avatar"
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
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                      {t('child.awakeAvatarUrl')}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item lg={4} md={12} xs={12} sx={{ m: 'auto', ml: 0 }}>
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
                              finalSleptAvatarFile
                                ? URL.createObjectURL(finalSleptAvatarFile) // image preview
                                : null
                            }
                          />
                          <label htmlFor="upload-image-slept-avatar">
                            <input
                              accept="image/*"
                              id="upload-image-slept-avatar"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={onSleptAvatarChange}
                            />

                            <IconButton
                              name="upload-image-slept-avatar"
                              id="upload-image-slept-avatar"
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
                    <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                      {t('child.sleptAvatarUrl')}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item lg={8} md={12} xs={12} sx={{ m: 'auto' }}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Grid container sx={{ m: 'auto' }}>
                      <Grid item xs={6} sx={{ width: '100%' }}>
                        <VoiceBar url="theChild.voiceUrl" />
                      </Grid>
                      <Grid item xs={6} sx={{ m: 'auto', width: '100%' }}>
                        <label htmlFor="upload-voice">
                          <input
                            id="upload-voice"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={onVoiceChange}
                          />

                          <Button
                            name="upload-voice"
                            id="upload-voice"
                            color="primary"
                            component="div"
                            variant="outlined"
                            sx={{
                              bottom: '0px',
                              right: '0px',
                            }}
                          >
                            {t('child.uploadVoice')}
                          </Button>
                        </label>
                      </Grid>
                    </Grid>
                  </Card>

                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                      {t('child.titleAdd')}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <CustomFormLabel htmlFor="name"> {t('child.titleAdd')}</CustomFormLabel>
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
                      <CustomFormLabel htmlFor="phoneNumber">
                        {t('ngo.phoneNumber')}
                      </CustomFormLabel>
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
                        loading={loadingAddChild}
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
                  {uploadAvatar ? (
                    <Box>
                      <UploadImage
                        uploadImage={uploadAvatar}
                        handleImageClose={handleImageClose}
                        setFinalImageFile={setFinalAvatarFile}
                      />
                    </Box>
                  ) : (
                    uploadSleptAvatar && (
                      <Box>
                        <UploadImage
                          uploadImage={uploadSleptAvatar}
                          handleImageClose={handleImageClose}
                          setFinalImageFile={setFinalSleptAvatarFile}
                        />
                      </Box>
                    )
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleImageClose}>Close</Button>
                </DialogActions>
              </Dialog>
              <Grid>
                {(successAddChild || errorAddChild) && (
                  <Message
                    severity={successAddChild ? 'success' : 'error'}
                    variant="filled"
                    input="addSw"
                    backError={errorAddChild}
                    sx={{ width: '100%' }}
                  >
                    {successAddChild && t('socialWorker.updated')}
                  </Message>
                )}
              </Grid>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Children;
