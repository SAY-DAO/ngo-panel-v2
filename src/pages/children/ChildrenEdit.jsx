/* eslint-disable no-unused-vars */
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
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FeatherIcon from 'feather-icons-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import { AddChild, fetchMyChildById } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import {
  fetchSocialWorkerById,
  fetchSocialWorkersList,
} from '../../redux/actions/socialWorkerAction';
import UploadImage from '../../components/UploadImage';
import VoiceBar from '../../components/VoiceBar';
import getAge, { EducationEnum, HousingStatusEnum } from '../../utils/helpers';

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
  const { childId } = useParams();

  const [finalAvatarFile, setFinalAvatarFile] = useState();
  const [finalSleptAvatarFile, setFinalSleptAvatarFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState(
    location.state && location.state.newImage,
  );
  const [uploadVoice, setUploadVoice] = useState(location.state && location.state.newImage);
  const [birthDate, setBirthDate] = useState(new Date());
  const [education, setEducation] = useState('');
  const [housingStatus, setHousingStatus] = useState('');
  const [sex, setSex] = useState('');

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
    // name: Yup.string().required('Please enter your first name'),
    // country: Yup.string().required('Please enter your country'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // address: Yup.string().required('Please enter your address'),
    // emailAddress: Yup.string().required('Email is required').email('Email is invalid'),
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

  // theChild
  useEffect(() => {
    if (childId) {
      dispatch(fetchMyChildById(childId));
    }
  }, [childId]);
  console.log(childId);

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

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      AddChild({
        sw_id: swId,
        ngo_id: ngoId,
        awakeAvatarUrl: finalAvatarFile,
        sleptAvatarUrl: finalSleptAvatarFile,
        voiceUrl: uploadVoice,
        sayname_translations: JSON.stringify({
          en: data.sayname_translations_en,
          fa: data.sayname_translations_fa,
        }),
        firstName_translations: JSON.stringify({
          en: data.firstName_translations_en,
          fa: data.firstName_translations_fa,
        }),
        lastName_translations: JSON.stringify({
          en: data.lastName_translations_en,
          fa: data.lastName_translations_fa,
        }),
        address: data.address,
        country: data.country,
        city: data.city,
        birthDate,
        birthPlace: data.birthPlace,
        familyCount: data.familyCount,
        education,
        sex,
        school_type: data.school_type,
        phoneNumber: data.phoneNumber,
        housingStatus,
        bio_translations: JSON.stringify({
          en: data.bio_translations_en,
          fa: data.bio_translations_fa,
        }),
        bio_summary_translations: JSON.stringify({
          en: data.bio_summary_translations_en,
          fa: data.bio_summary_translations_fa,
        }),
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

  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  const onVoiceChange = (e) => {
    if (e.target.files[0]) {
      setUploadVoice(URL.createObjectURL(e.target.files[0]));
      console.log(e.target.files);
      console.log(e.target.files[0]);
      console.log(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveAvatar = () => {
    console.log('uploadVoice');
  };

  const handleChangeEducation = (event) => {
    setEducation(event.target.value);
  };

  const handleChangeHousing = (event) => {
    setHousingStatus(event.target.value);
  };

  const handleChangeSex = (event) => {
    setSex(event.target.value);
  };

  return (
    <PageContainer title="Child Add" description="this is Child Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
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
                            alt="avatar"
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
                            alt="avatar"
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
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <Grid container sx={{ m: 'auto' }}>
                      <Grid item md={6} sx={{ width: '100%' }}>
                        <CustomFormLabel htmlFor="sayname_translations_en">
                          {t('child.sayname_translations.en')}
                        </CustomFormLabel>
                        <TextField
                          id="sayname_translations_en"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                          control={control}
                          {...register('sayname_translations_en')}
                          error={!!errors.sayname_translations_en}
                        />
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors &&
                            errors.sayname_translations_en &&
                            errors.sayname_translations_en.message}
                        </FormHelperText>
                      </Grid>
                      <Grid item md={6} sx={{ width: '100%' }}>
                        <CustomFormLabel htmlFor="sayname_translations_fa">
                          {t('child.sayname_translations.fa')}
                        </CustomFormLabel>
                        <TextField
                          id="sayname_translations_fa"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                          control={control}
                          {...register('sayname_translations_fa')}
                          error={!!errors.sayname_translations_fa}
                        />
                        <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                          {errors &&
                            errors.sayname_translations_fa &&
                            errors.sayname_translations_fa.message}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Card>
                  <Card sx={{ p: 2, textAlign: 'center' }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <Grid container direction="row" spacing={1}>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={5} xs={12}>
                            <CustomFormLabel htmlFor="firstName_translations_en">
                              {t('child.firstName_translations.en')}
                            </CustomFormLabel>
                            <TextField
                              required
                              id="firstName_translations_en"
                              variant="outlined"
                              size="large"
                              control={control}
                              {...register('firstName_translations_en')}
                              error={!!errors.firstName_translations_en}
                            />
                          </Grid>
                          <Grid item md={5} xs={12}>
                            <CustomFormLabel htmlFor="lastName_translations_en">
                              {t('child.lastName_translations.en')}
                            </CustomFormLabel>
                            <TextField
                              id="lastName_translations_en"
                              variant="outlined"
                              size="large"
                              control={control}
                              {...register('lastName_translations_en')}
                              error={!!errors.lastName_translations_en}
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={5} xs={12}>
                            <CustomFormLabel htmlFor="firstName_translations_fa">
                              {t('child.firstName_translations.fa')}
                            </CustomFormLabel>
                            <TextField
                              required
                              id="firstName_translations_fa"
                              variant="outlined"
                              size="large"
                              control={control}
                              {...register('firstName_translations_fa')}
                              error={!!errors.firstName_translations_fa}
                            />
                          </Grid>
                          <Grid item md={5} xs={12}>
                            <CustomFormLabel htmlFor="lastName_translations_fa">
                              {t('child.lastName_translations.fa')}
                            </CustomFormLabel>
                            <TextField
                              id="lastName_translations_fa"
                              variant="outlined"
                              size="large"
                              control={control}
                              {...register('lastName_translations_fa')}
                              error={!!errors.lastName_translations_fa}
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={10} xs={12}>
                            <CustomFormLabel htmlFor="bio_translations_en">
                              {t('child.bio_translations.en')}
                            </CustomFormLabel>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={5}
                              id="bio_translations_en"
                              variant="outlined"
                              size="small"
                              control={control}
                              {...register('bio_translations_en')}
                              style={{ width: '100%', background: 'transparent' }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={10} xs={12}>
                            <CustomFormLabel htmlFor="bio_translations_fa">
                              {t('child.bio_translations.fa')}
                            </CustomFormLabel>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={5}
                              id="bio_translations_fa"
                              variant="outlined"
                              control={control}
                              {...register('bio_translations_fa')}
                              style={{ width: '100%', background: 'transparent' }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={10} xs={12}>
                            <CustomFormLabel htmlFor="bio_summary_translations_en">
                              {t('child.bio_summary_translations.en')}
                            </CustomFormLabel>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={5}
                              id="bio_summary_translations_en"
                              variant="outlined"
                              size="small"
                              control={control}
                              {...register('bio_summary_translations_en')}
                              style={{ width: '100%', background: 'transparent' }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item md={6} container spacing={1} justifyContent="center">
                          <Grid item md={10} xs={12}>
                            <CustomFormLabel htmlFor="bio_summary_translations_fa">
                              {t('child.bio_summary_translations.fa')}
                            </CustomFormLabel>
                            <TextareaAutosize
                              aria-label="minimum height"
                              minRows={5}
                              id="bio_summary_translations_fa"
                              variant="outlined"
                              control={control}
                              {...register('bio_summary_translations_fa')}
                              style={{ width: '100%', background: 'transparent' }}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container justifyContent="center" sx={{ mt: 2 }}>
                          <FormControl sx={{ minWidth: 300 }}>
                            <InputLabel id="demo-name-label">{t('child.sex')}</InputLabel>
                            <Select
                              label="Sex"
                              labelId="demo-multiple-name-label"
                              id="demo-sex"
                              value={sex}
                              onChange={handleChangeSex}
                              input={<OutlinedInput label="Sex" />}
                            >
                              <MenuItem value>Male</MenuItem>
                              <MenuItem value={false}>Female</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} container justifyContent="center" sx={{ mt: 2 }}>
                          <FormControl sx={{ minWidth: 300 }}>
                            <InputLabel id="demo-multiple-name-label">
                              {t('child.education')}
                            </InputLabel>
                            <Select
                              label="Education"
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-education"
                              value={education}
                              onChange={handleChangeEducation}
                              input={<OutlinedInput label="Education" />}
                            >
                              {Object.keys(EducationEnum).map((name, index) => (
                                <MenuItem key={name} value={Object.values(EducationEnum)[index]}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={12} sx={{ width: '100%' }}>
                          <CustomFormLabel htmlFor="familyCount">
                            {t('child.familyCount')}
                          </CustomFormLabel>
                          <TextField
                            id="familyCount"
                            variant="outlined"
                            type="number"
                            size="small"
                            sx={{ mb: 1 }}
                            control={control}
                            {...register('familyCount')}
                            error={!!errors.familyCount}
                          />
                          <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                            {errors && errors.familyCount && errors.familyCount.message}
                          </FormHelperText>
                        </Grid>

                        <Divider sx={{ width: '70%', m: 'auto', mt: 6 }} variant="middle" />
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={1}
                          justifyContent="center"
                          sx={{ mt: 4 }}
                        >
                          <Grid item md={4} xs={12}>
                            <CustomFormLabel htmlFor="age">{t('child.age')}</CustomFormLabel>
                            <Typography
                              id="age"
                              variant="body1"
                              size="large"
                              color="primary.light"
                              sx={{
                                textAlign: 'center',
                                lineHeight: 3,
                                opacity: '60%',
                              }}
                            >
                              {getAge(birthDate)} Years
                            </Typography>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <CustomFormLabel htmlFor="birthDate">
                              {t('child.birthDate')}
                            </CustomFormLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DesktopDatePicker
                                id="birthDate"
                                inputFormat="MM/dd/yyyy"
                                value={birthDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                                helperText={errors && errors.birthDate && errors.birthDate.message}
                              />
                            </LocalizationProvider>
                          </Grid>

                          <Grid item md={4} xs={12}>
                            <CustomFormLabel htmlFor="birthPlace">
                              {t('child.birthPlace')}
                            </CustomFormLabel>
                            <CustomSelect
                              labelId="birthPlace-controlled-open-select-label"
                              id="birthPlace-controlled-open-select"
                              control={control}
                              register={{ ...register('birthPlace') }}
                              defaultValue={countries && countries[0].id}
                              sx={{ width: '100%' }}
                            >
                              {countries &&
                                countries.map((country) => (
                                  <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                  </MenuItem>
                                ))}
                            </CustomSelect>
                            <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                              {errors && errors.nationality && errors.nationality.message}
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={1} justifyContent="center">
                        <Grid item md={4} xs={12}>
                          <CustomFormLabel htmlFor="country">{t('child.country')}</CustomFormLabel>
                          <CustomSelect
                            labelId="country-controlled-open-select-label"
                            id="country-controlled-open-select"
                            control={control}
                            register={{ ...register('country') }}
                            defaultValue={countries && countries[0].id}
                            sx={{ width: '100%' }}
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
                        <Grid item md={4} xs={12}>
                          {countries && states && (
                            <>
                              <CustomFormLabel htmlFor="state">{t('child.state')}</CustomFormLabel>
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
                        <Grid item md={4} xs={12}>
                          {countries && states && cities && (
                            <>
                              <CustomFormLabel htmlFor="city">{t('child.city')}</CustomFormLabel>
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
                              <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                                {errors && errors.city && errors.city.message}
                              </FormHelperText>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justifyContent="center"
                        alignItems="flex-end"
                        sx={{ mt: 4 }}
                        spacing={1}
                      >
                        <Grid item md={6} xs={12}>
                          <CustomFormLabel htmlFor="address">{t('child.address')}</CustomFormLabel>
                          <CustomTextField
                            id="address"
                            variant="outlined"
                            multiline
                            rows={4}
                            size="small"
                            fullWidth
                            control={control}
                            register={{ ...register('address') }}
                            helperText={errors && errors.address && errors.address.message}
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Grid item>
                            <CustomFormLabel htmlFor="phoneNumber">
                              {t('child.phoneNumber')}
                            </CustomFormLabel>
                            <TextField
                              id="phoneNumber"
                              variant="outlined"
                              size="small"
                              sx={{ width: '100%' }}
                              control={control}
                              {...register('phoneNumber')}
                              error={!!errors.phoneNumber}
                            />
                          </Grid>
                          <Grid item sx={{ mt: 2 }}>
                            <FormControl sx={{ width: '100%' }}>
                              <InputLabel id="demo-multiple-name-label">
                                {t('child.housingStatus')}
                              </InputLabel>
                              <Select
                                label="HousingStatus"
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-education"
                                value={education}
                                onChange={handleChangeEducation}
                                input={<OutlinedInput label="housingStatus" />}
                              >
                                {Object.keys(HousingStatusEnum).map((name, index) => (
                                  <MenuItem
                                    key={name}
                                    value={Object.values(HousingStatusEnum)[index]}
                                  >
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>

                      <LoadingButton
                        // loading={loadingAddChild}
                        color="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        sx={{ mt: 4 }}
                      >
                        {t('child.button.add')}
                      </LoadingButton>
                    </form>
                  </Card>
                </Grid>
              </Grid>

              {/* Child Image */}
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
                    {successAddChild && t('child.updated')}
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
