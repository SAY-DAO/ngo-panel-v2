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
  CircularProgress,
  FormControl,
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
import UploadImage from '../../components/UploadImage';
import VoiceBar from '../../components/VoiceBar';
import { getAge, EducationEnum, HousingStatusEnum } from '../../utils/helpers';

const ChildEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { childId } = useParams();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/children/list',
      title: t("BCrumb.childrenList"),
    },
    {
      title: t("BCrumb.childEdit"),
    },
  ];

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
  const [sex, setSex] = useState('');

  const childById = useSelector((state) => state.childById);
  const { result, success: successChild } = childById;
  console.log(result);

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  // theChild
  useEffect(() => {
    if (childId) {
      dispatch(fetchMyChildById(childId));
    }
  }, [childId]);

  const validationSchema = Yup.object().shape({
    housingStatus: Yup.string().required(''),
    address: Yup.string().required(''),
    sex: Yup.string().required(''),
    education: Yup.number().required(''),
    familyCount: Yup.string().required(''),
    nationality: Yup.string().required('Please enter your nationality'),
    city: Yup.string().required(''),
    state: Yup.string().required(''),
    country: Yup.string().required(''),
    lastName_translations_en: Yup.string().required(''),
    lastName_translations_fa: Yup.string().required(''),
    firstName_translations_fa: Yup.string().required(''),
    firstName_translations_en: Yup.string().required(''),
    sayname_translations_fa: Yup.string().required(''),
    sayname_translations_en: Yup.string().required(''),
    bio_translations_en: Yup.string().required(''),
    bio_translations_fa: Yup.string().required(''),
    bio_summary_translations_en: Yup.string().required(''),
    bio_summary_translations_fa: Yup.string().required(''),
  });

  const {
    setValue,
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (result) {
      setBirthDate(result.birthDate);
      setValue('awakeAvatarUrl', result.awakeAvatarUrl);
      setValue('sayname_translations_en', result.sayname_translations.en);
      setValue('sayname_translations_fa', result.sayname_translations.fa);
      setValue('firstName_translations_en', result.firstName_translations.en);
      setValue('firstName_translations_fa', result.firstName_translations.fa);
      setValue('lastName_translations_en', result.lastName_translations.en);
      setValue('lastName_translations_fa', result.lastName_translations.fa);
      setValue('bio_translations_en', result.bio_translations.en);
      setValue('bio_translations_fa', result.bio_translations.fa);
      setValue('bio_summary_translations_en', result.bio_summary_translations.en);
      setValue('bio_summary_translations_fa', result.bio_summary_translations.fa);
      setValue('sex', result.gender === true ? 2 : 1);
      setValue('education', result.education);
      setValue('familyCount', parseInt(result.familyCount, 10));
      setValue('country', result.country);
      setValue('state', result.state);
      setValue('city', result.city);
      setValue('nationality', result.nationality);
      setValue('birthPlace', result.birthPlace);
      setValue('address', result.address);
      setValue('phoneNumber', result.phoneNumber);
      setValue('housingStatus', result.housingStatus);
    }
  }, [result]);

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
      const theCountry = countries.filter((c) => c.phoneCode === `${watch('country')}`);
      console.log('theCountry');
      console.log(theCountry);
      console.log(theCountry[0].id || countries[0]);
      dispatch(fetchStateList(theCountry[0].id));
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
        awakeAvatarUrl: finalAvatarFile,
        sleptAvatarUrl: finalSleptAvatarFile,
        voiceUrl: uploadVoice,
        sayName: JSON.stringify({
          en: data.sayname_translations_en,
          fa: data.sayname_translations_fa,
        }),
        firstName: JSON.stringify({
          en: data.firstName_translations_en,
          fa: data.firstName_translations_fa,
        }),
        lastName: JSON.stringify({
          en: data.lastName_translations_en,
          fa: data.lastName_translations_fa,
        }),
        address: data.address,
        // country: parseInt(data.country, 10),
        country: 98,
        // state: parseInt(data.state, 10),  no state in flask server
        // city: parseInt(data.city, 10),
        city: 1,
        birthDate,
        nationality: data.nationality,
        birthPlace: data.nationality,
        education: parseInt(education, 10),
        sex: sex !== 1, // backend: true:male | false:female
        // school_type: data.school_type,
        phoneNumber: data.phoneNumber,
        familyCount: parseInt(data.familyCount, 10),
        housingStatus: parseInt(data.housingStatus, 10),
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

  const handleChangeSex = (event) => {
    setSex(event.target.value);
  };

  return (
    <PageContainer title="Child Add" description="this is Child Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!successChild || !successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container>
              {/*  Child avatar */}
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
                              : result && result.awakeAvatarUrl
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
              {/*  Child slept avatar */}
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
                              : result && result.sleptAvatarUrl
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

              <Grid item lg={10} md={12} xs={12} sx={{ m: 'auto' }}>
                {/*  Child voice */}
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Grid container sx={{ m: 'auto' }}>
                    <Grid item xs={6} sx={{ width: '100%' }}>
                      <VoiceBar url={result.voiceUrl} />
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
                {/* Say Name */}
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
                    </Grid>
                  </Grid>
                </Card>
                <Card sx={{ p: 1, textAlign: 'center' }}>
                  <Grid container direction="row">
                    {/* First Name */}
                    {/* Last Name */}
                    <Grid item md={6} container spacing={1} justifyContent="center">
                      <Grid item lg={5} xs={12}>
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
                      <Grid item lg={5} xs={12}>
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
                        <TextField
                          minRows={4}
                          multiline
                          id="bio_translations_en"
                          variant="outlined"
                          size="small"
                          control={control}
                          {...register('bio_translations_en')}
                          style={{ width: '100%', background: 'transparent' }}
                          error={!!errors.bio_translations_en}
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={6} container spacing={1} justifyContent="center">
                      <Grid item md={10} xs={12}>
                        <CustomFormLabel htmlFor="bio_translations_fa">
                          {t('child.bio_translations.fa')}
                        </CustomFormLabel>
                        <TextField
                          aria-label="minimum height"
                          minRows={4}
                          multiline
                          id="bio_translations_fa"
                          variant="outlined"
                          control={control}
                          {...register('bio_translations_fa')}
                          style={{ width: '100%', background: 'transparent' }}
                          error={!!errors.bio_translations_fa}
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={6} container spacing={1} justifyContent="center">
                      <Grid item md={10} xs={12}>
                        <CustomFormLabel htmlFor="bio_summary_translations_en">
                          {t('child.bio_summary_translations.en')}
                        </CustomFormLabel>
                        <TextField
                          aria-label="minimum height"
                          minRows={4}
                          multiline
                          id="bio_summary_translations_en"
                          variant="outlined"
                          size="small"
                          control={control}
                          {...register('bio_summary_translations_en')}
                          style={{ width: '100%', background: 'transparent' }}
                          error={!!errors.bio_summary_translations_en}
                        />
                      </Grid>
                    </Grid>
                    <Grid item md={6} container spacing={1} justifyContent="center">
                      <Grid item md={10} xs={12}>
                        <CustomFormLabel htmlFor="bio_summary_translations_fa">
                          {t('child.bio_summary_translations.fa')}
                        </CustomFormLabel>
                        <TextField
                          aria-label="minimum height"
                          minRows={4}
                          multiline
                          id="bio_summary_translations_fa"
                          variant="outlined"
                          control={control}
                          {...register('bio_summary_translations_fa')}
                          style={{ width: '100%', background: 'transparent' }}
                          error={!!errors.bio_summary_translations_fa}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} container justifyContent="center">
                      <FormControl sx={{ minWidth: 300 }}>
                        <CustomFormLabel id="sex">{t('child.sex')}</CustomFormLabel>
                        <CustomSelect
                          labelId="sex-controlled-open-select-label"
                          id="sex"
                          onChange={handleChangeSex}
                          control={control}
                          value={watch('sex') || ''}
                          register={{ ...register('sex') }}
                          error={!!errors.sex}
                        >
                          <MenuItem value={1}>{t('child.sexKind.female')}</MenuItem>
                          <MenuItem value={2}>{t('child.sexKind.male')}</MenuItem>
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} container justifyContent="center">
                      <FormControl sx={{ minWidth: 300 }}>
                        <CustomFormLabel id="education">{t('child.education')}</CustomFormLabel>
                        <CustomSelect
                          labelId="education-controlled-open-select-label"
                          id="education"
                          onChange={handleChangeEducation}
                          control={control}
                          value={watch('education') || ''}
                          register={{ ...register('education') }}
                          error={!!errors.education}
                        >
                          {Object.keys(EducationEnum).map((name, index) => (
                            <MenuItem key={name} value={Object.values(EducationEnum)[index]}>
                              {t(`child.educationondition.${name}`)}
                            </MenuItem>
                          ))}
                        </CustomSelect>
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
                    </Grid>
                    <Divider sx={{ width: '70%', m: 'auto', mt: 6 }} variant="middle">
                      <Typography
                        sx={{ p: 1, color: (theme) => theme.palette.info.light }}
                        variant="body1"
                      >
                        {t('child.divider.origin')}
                      </Typography>
                    </Divider>
                    <Grid item xs={12} container spacing={1} justifyContent="center" sx={{ mt: 4 }}>
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
                          {getAge(birthDate)} {t("child.years")}
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
                            register={{ ...register('birthDate') }}
                            error={!!errors.birthDate}
                          />
                        </LocalizationProvider>
                      </Grid>

                      <Grid item md={4} xs={12}>
                        <CustomFormLabel htmlFor="nationality">
                          {t('child.nationality')}
                        </CustomFormLabel>
                        <CustomSelect
                          labelId="nationality-controlled-open-select-label"
                          id="nationality-controlled-open-select"
                          control={control}
                          register={{ ...register('nationality') }}
                          defaultValue={watch('nationality') || ''}
                          sx={{ width: '100%' }}
                          error={!!errors.nationality}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {countries &&
                            countries.map((country) => (
                              <MenuItem key={country.id} value={country.phoneCode}>
                                {country.name}
                              </MenuItem>
                            ))}
                        </CustomSelect>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider sx={{ width: '70%', m: 'auto', mt: 6, mb: 2 }} variant="">
                    <Typography
                      sx={{ p: 1, color: (theme) => theme.palette.info.light }}
                      variant="body1"
                    >
                      {t('child.divider.housing')}
                    </Typography>
                  </Divider>
                  <Grid item xs={12} container spacing={1} justifyContent="center">
                    <Grid item md={4} xs={12}>
                      <FormControl sx={{ width: '100%' }}>
                        <CustomFormLabel htmlFor="country">{t('child.country')}</CustomFormLabel>
                        <CustomSelect
                          labelId="country-controlled-open-select-label"
                          id="country-controlled-open-select"
                          control={control}
                          register={{ ...register('country') }}
                          defaultValue={watch('country') || ''}
                          sx={{ width: '100%' }}
                          error={!!errors.country}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {countries &&
                            countries.map((country) => (
                              <MenuItem key={country.id} value={country.phoneCode}>
                                {country.name}
                              </MenuItem>
                            ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControl sx={{ width: '100%' }}>
                        <CustomFormLabel htmlFor="state">{t('child.state')}</CustomFormLabel>
                        <CustomSelect
                          labelId="state-controlled-open-select-label"
                          id="state-controlled-open-select"
                          control={control}
                          register={{ ...register('state') }}
                          value={watch('state') || ''}
                          sx={{ width: '100%' }}
                          error={!!errors.state}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {states &&
                            states.map((state) => (
                              <MenuItem key={state.id} value={state.phoneCode}>
                                {state.name}
                              </MenuItem>
                            ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <FormControl sx={{ width: '100%' }}>
                        <CustomFormLabel htmlFor="city">{t('child.city')}</CustomFormLabel>
                        <CustomSelect
                          labelId="city-controlled-open-select-label"
                          id="city-controlled-open-select"
                          control={control}
                          register={{ ...register('city') }}
                          value={watch('city') || ''}
                          sx={{ width: '100%' }}
                          error={!!errors.city}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {cities &&
                            cities.map((city) => (
                              <MenuItem key={city.id} value={city.id}>
                                {city.name}
                              </MenuItem>
                            ))}
                        </CustomSelect>
                      </FormControl>
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
                        rows={6}
                        size="small"
                        fullWidth
                        control={control}
                        register={{ ...register('address') }}
                        error={!!errors.address}
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
                          size="medium"
                          sx={{ width: '100%' }}
                          control={control}
                          {...register('phoneNumber')}
                        />
                      </Grid>

                      <Grid item>
                        <FormControl sx={{ width: '100%' }}>
                          <CustomFormLabel htmlFor="housingStatus">
                            {t('child.housingStatus')}
                          </CustomFormLabel>
                          <CustomSelect
                            labelId="housingStatus"
                            id="multiple-education"
                            value={watch('housingStatus') || ''}
                            control={control}
                            register={{ ...register('housingStatus') }}
                            error={!!errors.housingStatus}
                          >
                            <MenuItem value="">
                              <em>{t(`child.housingCondition.none`)}</em>
                            </MenuItem>
                            {Object.keys(HousingStatusEnum).map((name, index) => (
                              <MenuItem key={name} value={Object.values(HousingStatusEnum)[index]}>
                                {t(`child.housingCondition.${name}`)}
                              </MenuItem>
                            ))}
                          </CustomSelect>
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
                    {t('child.button.update')}
                  </LoadingButton>
                </Card>
              </Grid>
            </Grid>
          </form>
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
              <Button onClick={handleImageClose}>{t('button.close')}</Button>
            </DialogActions>
          </Dialog>
          {/* <Grid>
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
          </Grid> */}
        </>
      )}
    </PageContainer>
  );
};

export default ChildEdit;
