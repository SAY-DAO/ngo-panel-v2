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
  Autocomplete,
  FormControl,
  Divider,
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
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
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
import { AddChild, checkSimilarNames } from '../../redux/actions/childrenAction';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';
import UploadImage from '../../components/UploadImage';
import VoiceBar from '../../components/VoiceBar';
import { EducationEnum, FlaskUserTypesEnum, HousingStatusEnum } from '../../utils/types';
import { getAge } from '../../utils/helpers';

const ChildrenAddOld = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/children/list',
      title: t('BCrumb.childrenList'),
    },
    {
      title: t('BCrumb.add'),
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

  const [ngoId, setNgoId] = useState();
  const [swId, setSwId] = useState();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo && optionsNgo.length === 0;

  const childAdd = useSelector((state) => state.childAdd);
  const { success: successAddChild, error: errorAddChild, loading: loadingAddChild } = childAdd;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading: loadingSwAll, success: successSwAll } = swAll;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const validationSchema = Yup.object().shape({
    housingStatus: Yup.string().required('Please enter your address'),
    address: Yup.string().required('Please enter your address'),
    sex: Yup.string().required('Please enter your address'),
    education: Yup.number().required('Please enter your address'),
    familyCount: Yup.string().required('Please enter your address'),
    birthPlace: Yup.string().required('Please enter your address'),
    city: Yup.string().required('Please enter your address'),
    state: Yup.string().required('Please enter your address'),
    country: Yup.string().required('Please enter your address'),
    lastName_translations_en: Yup.string().required('Please enter your address'),
    lastName_translations_fa: Yup.string().required('Please enter your address'),
    firstName_translations_fa: Yup.string().required('Please enter your address'),
    firstName_translations_en: Yup.string().required('Please enter your address'),
    sayname_translations_fa: Yup.string().required('Please enter your address'),
    sayname_translations_en: Yup.string().required('Please enter your address'),
    bio_translations_en: Yup.string().required('Please enter your address'),
    bio_translations_fa: Yup.string().required('Please enter your address'),
    bio_summary_translations_en: Yup.string().required('Please enter your address'),
    bio_summary_translations_fa: Yup.string().required('Please enter your address'),
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

  // ngo open
  // useEffect(() => {
  //   if (!openNgo) {
  //     setOptionsNgo([]);
  //   } else if (swInfo) {
  //     if (
  //       swInfo.typeId === FlaskUserTypesEnum.SOCIAL_WORKER ||
  //       swInfo.typeId === FlaskUserTypesEnum.NGO_SUPERVISOR
  //     ) {
  //       setOptionsNgo([
  //         {
  //           id: swInfo.ngoId,
  //           name: swInfo.ngoName,
  //         },
  //       ]);
  //     }
  //   }
  // }, [openNgo]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }

    if (active && swInfo) {
      // super admin & admin
      if (
        (swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
          swInfo.typeId === FlaskUserTypesEnum.ADMIN) &&
        successNgoList
      ) {
        const activeNgoList = ngoList.filter((ngo) => ngo.isActive);
        setOptionsNgo([
          {
            id: 0,
            name: t('ngo.allNgos'),
          },
          ...activeNgoList,
        ]);
      }
      // social worker
      else if (
        swInfo.typeId === FlaskUserTypesEnum.SOCIAL_WORKER ||
        swInfo.typeId === FlaskUserTypesEnum.NGO_SUPERVISOR
      ) {
        setOptionsNgo([
          {
            id: swInfo.ngoId,
            name: swInfo.ngoName,
          },
        ]);
      }
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList, swInfo]);

  // Autocomplete Social worker
  useEffect(() => {
    let active = true;
    if (active && successSwAll) {
      // sort social worker
      const sortedSocialWorkers = swList.sort((a, b) => Number(b.is_active) - Number(a.is_active));
      setOptions([...sortedSocialWorkers]);
    }
    return () => {
      active = false;
    };
  }, [ngoId, successSwAll, open]);

  // social worker open
  useEffect(() => {
    if (!open || openNgo) {
      setOptions([]);
    } else if (open || !openNgo) {
      dispatch(fetchSocialWorkersList(ngoId));
    }
  }, [open, openNgo, ngoId]);
  // // fetch needs
  // useEffect(() => {
  //   if (swInfo && !loadingNgo) {
  //     if (successNgoList) {
  //       dispatch(fetchSocialWorkersList());
  //     }
  //   }
  // }, [ngoId, open, openNgo, ngoId, swInfo, successNgoList]);

  // check for similar SAY name
  useEffect(() => {
    if (watch('sayname_translations_en') && watch('sayname_translations_fa')) {
      const sayNameTranslations = JSON.stringify({
        en: watch('sayname_translations_en'),
        fa: watch('sayname_translations_fa'),
      });
      dispatch(checkSimilarNames(sayNameTranslations));
    }
  }, [watch('sex')]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      AddChild({
        ngo_id: ngoId,
        id_social_worker: swId,
        sayname_translations: JSON.stringify({
          en: data.sayname_translations_en,
          fa: data.sayname_translations_fa,
        }),
        bio_translations: JSON.stringify({
          en: data.bio_translations_en,
          fa: data.bio_translations_fa,
        }),
        bio_summary_translations: JSON.stringify({
          en: data.bio_summary_translations_en,
          fa: data.bio_summary_translations_fa,
        }),
        gender: sex !== 1, // true:male | false:female
        cityId: 1,
        phoneNumber: data.phoneNumber,
        birthDate,
        awakeAvatarUrl: finalAvatarFile,
        sleptAvatarUrl: finalSleptAvatarFile,
        voiceUrl: uploadVoice,
        birthPlaceId: data.birthPlace,
        address: data.address,
        familyCount: parseInt(data.familyCount, 10),
        education: parseInt(education, 10),
        school_type: data.school_type,
        housingStatus: parseInt(data.housingStatus, 10),
        firstName_translations: JSON.stringify({
          en: data.firstName_translations_en,
          fa: data.firstName_translations_fa,
        }),
        lastName_translations: JSON.stringify({
          en: data.lastName_translations_en,
          fa: data.lastName_translations_fa,
        }),
        // country: parseInt(data.country, 10),
        country: 98,
        // state: parseInt(data.state, 10),  no state in flask server
        // city: parseInt(data.city, 10),
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
      console.log(e.target.files[0]);
      console.log(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveAvatar = () => {
    console.log('removed not implemented...');
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
      <Grid container spacing={2} justifyContent="center">
        <Grid item md={3} xs={12}>
          {swInfo && (
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
              getOptionLabel={(option) => `${option > 0 ? option.id : ''} - ${option.name}`}
              options={optionsNgo}
              loading={loadingNgo}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('ngo.title')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingNgo ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        </Grid>
        <Grid item>
          {ngoId >= 0 && (
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
              onChange={(e, value) => setSwId(value && value.is_active && value.id)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) =>
                option.is_active
                  ? `${option.id} - ${option.firstName}`
                  : `${option.id} - ${option.firstName}`
              }
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.is_active ? (
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
              options={options || []}
              loading={loadingSwAll}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('socialWorker.title')}
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
          )}
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

                  <Grid item lg={10} md={12} xs={12} sx={{ m: 'auto' }}>
                    {/*  Child voice */}
                    <Card sx={{ p: 3, textAlign: 'center' }}>
                      <Grid container sx={{ m: 'auto' }}>
                        <Grid item xs={6} sx={{ width: '100%' }}>
                          <VoiceBar url={uploadVoice} />
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
                              <MenuItem value={1}>Female</MenuItem>
                              <MenuItem value={2}>Male</MenuItem>
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
                                  {t(`child.educationCondition.${name}`)}
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
                              {getAge(birthDate)} {t('child.years')}
                            </Typography>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <CustomFormLabel htmlFor="birthDate">
                              {t('child.birthDate')}
                            </CustomFormLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                              <DesktopDatePicker
                                id="birthDate"
                                inputFormat="MM/dd/yyyy"
                                value={birthDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                                error={!!errors.birthDate}
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
                              defaultValue=""
                              sx={{ width: '100%' }}
                              error={!!errors.birthPlace}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {countries &&
                                countries.map((country) => (
                                  <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                  </MenuItem>
                                ))}
                            </CustomSelect>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} container spacing={1} justifyContent="center">
                        <Grid item md={4} xs={12}>
                          <FormControl sx={{ width: '100%' }}>
                            <CustomFormLabel htmlFor="country">
                              {t('child.country')}
                            </CustomFormLabel>
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
                                  <MenuItem key={country.id} value={country.id}>
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
                                  <MenuItem key={state.id} value={state.id}>
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
                                  <MenuItem
                                    key={name}
                                    value={Object.values(HousingStatusEnum)[index]}
                                  >
                                    {t(`child.housingCondition.${name}`)}
                                  </MenuItem>
                                ))}
                              </CustomSelect>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <LoadingButton
                        loading={loadingAddChild}
                        color="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        sx={{ mt: 4 }}
                      >
                        {t('child.button.add')}
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

export default ChildrenAddOld;
