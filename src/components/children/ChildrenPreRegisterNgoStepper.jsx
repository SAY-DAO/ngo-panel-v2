import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import FeatherIcon from 'feather-icons-react';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import {
  EducationEnum,
  FlaskUserTypesEnum,
  HousingStatusEnum,
  SchoolTypeEnum,
  SexEnum,
} from '../../utils/types';
import { daysDifference, getAge } from '../../utils/helpers';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import VoiceBar from '../VoiceBar';
import { fetchSocialWorkersList } from '../../redux/actions/socialWorkerAction';
import { assignPreRegisterChild } from '../../redux/actions/childrenAction';
import { CHILDREN_PRE_REGISTER_LIST } from '../../routes/RouteConstants';
import { PRE_REGISTER_CHILD_LIST_RESET } from '../../redux/constants/childrenConstants';

const steps = ['child.steps.first', 'child.steps.second', 'child.steps.third'];

export default function ChildrenPreRegisterNgoStepper() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [birthDate, setBirthDate] = useState(new Date());
  const [uploadVoice, setUploadVoice] = useState();
  const [nextDisable, setNextDisable] = useState(true);
  const [ngoId, setNgoId] = useState();
  const [swId, setSwId] = useState();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo && optionsNgo.length === 0;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, cities, success: successCountryList } = countryList;

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading: loadingSwAll, success: successSwAll } = swAll;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const { loading, assigned, error } = useSelector((state) => state.childPreRegister);

  const validationSchema = Yup.object().shape({
    housingStatus: Yup.string().required('Please enter child housing'),
    address: Yup.string().required('Please enter child address'),
    phoneNumber: Yup.string().required('Please enter guardian phone number'),
    sex: Yup.string().required('Please enter the sex'),
    education: Yup.number().required('Please enter the education'),
    schoolType: Yup.number().required('Please enter the school type'),
    familyCount: Yup.string().required('Please enter the familyCount'),
    birthPlace: Yup.string().required('Please enter the birthPlace'),
    city: Yup.string().required('Please enter the city'),
    state: Yup.string().required('Please enter the state'),
    country: Yup.string().required('Please enter the country'),
    // lastName_translations_en: Yup.string().required('Please enter your address'),
    lastName_translations_fa: Yup.string().required('Please enter your address'),
    firstName_translations_fa: Yup.string().required('Please enter your address'),
    // firstName_translations_en: Yup.string().required('Please enter your address'),
    // sayname_translations_fa: Yup.string().required('Please enter your address'),
    // sayname_translations_en: Yup.string().required('Please enter your address'),
    // bio_translations_en: Yup.string().required('Please enter your address'),
    bio_translations_fa: Yup.string().required('Please enter your address'),
    // bio_summary_translations_en: Yup.string().required('Please enter your address'),
    // bio_summary_translations_fa: Yup.string().required('Please enter your address'),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (activeStep === 0) {
      dispatch({ type: PRE_REGISTER_CHILD_LIST_RESET });
    }
  }, [activeStep]);

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

  // enable/disable next button
  useEffect(() => {
    const values = getValues();
    if (activeStep === 0) {
      if (
        values.firstName_translations_fa &&
        values.lastName_translations_fa &&
        values.bio_translations_fa &&
        values.sex &&
        values.education &&
        values.schoolType &&
        values.familyCount &&
        values.familyCount > 0
      ) {
        setNextDisable(false);
      } else {
        setNextDisable(true);
      }
    }
    if (activeStep === 1) {
      if (
        birthDate &&
        daysDifference(birthDate, new Date()) > 5 &&
        values.birthPlace &&
        values.city &&
        values.state &&
        values.country &&
        values.housingStatus &&
        values.address &&
        values.phoneNumber
      ) {
        setNextDisable(false);
      } else {
        setNextDisable(true);
      }
    }
    if (activeStep === 2) {
      if (uploadVoice) {
        setNextDisable(false);
      } else {
        setNextDisable(true);
      }
    }
  }, [
    activeStep,
    watch('firstName_translations_fa'),
    watch('lastName_translations_fa'),
    watch('bio_translations_fa'),
    watch('sex'),
    watch('education'),
    watch('schoolType'),
    watch('familyCount'),
    watch('birthPlace'),
    watch('city'),
    watch('state'),
    watch('country'),
    watch('housingStatus'),
    watch('address'),
    watch('phoneNumber'),
    birthDate,
    uploadVoice,
  ]);

  useEffect(() => {
    if (assigned) {
      navigate(CHILDREN_PRE_REGISTER_LIST);
    }
  }, [assigned]);

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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  const onVoiceChange = (e) => {
    if (e.target.files[0]) {
      setUploadVoice(e.target.files[0]);
    }
  };

  const onSubmit = async (data) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      assignPreRegisterChild({
        ngoId,
        swId,
        bio: data.bio_translations_fa,
        sex: Number(data.sex),
        phoneNumber: data.phoneNumber,
        birthDate,
        voiceFile: uploadVoice,
        birthPlaceId: Number(data.birthPlace),
        address: data.address,
        familyCount: Number(data.familyCount),
        educationLevel: Number(data.education),
        schoolType: Number(data.schoolType),
        housingStatus: Number(data.housingStatus),
        firstName: data.firstName_translations_fa,
        lastName: data.lastName_translations_fa,
        country: Number(data.country),
        state: Number(data.state), // no state in flask server
        city: Number(data.city),
      }),
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{t(label)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <>
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ paddingBottom: '50px' }}>
          <Card elevation={5} sx={{ minHeight: 410 }}>
            {activeStep === 0 && (
              <Grid container spacing={2} justifyContent="center" sx={{ pt: 4 }}>
                <Card sx={{ p: 3, m: 0, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12 }} color="secondary">
                    {t('child.voiceIntro')}
                  </Typography>
                </Card>
                <Grid item md={6} xs={12}>
                  {swInfo && (
                    <Autocomplete
                      id="asynchronous-ngo"
                      sx={{ width: '100%' }}
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
                <Grid item md={6} xs={12}>
                  {ngoId >= 0 && (
                    <Autocomplete
                      id="asynchronous-social-worker"
                      sx={{ width: '100%' }}
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
                          ? `${option.id} - ${option.firstName} - ${option.lastName}`
                          : `${option.id} - ${option.firstName} - ${option.lastName}`
                      }
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          {option.is_active ? (
                            <>
                              <FeatherIcon color="green" icon="check" width="18" />
                              <Typography>{`${option.id} - ${option.firstName} - ${option.lastName}`}</Typography>
                            </>
                          ) : (
                            <>
                              <FeatherIcon color="red" icon="x" width="18" />
                              <Typography>{`${option.id} - ${option.firstName} - ${option.lastName} `}</Typography>
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
                                {loadingSwAll ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
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
            )}

            {swId && successCountryList && activeStep === 0 && (
              <Grid container>
                {/* First Name */} {/* Last Name */}
                <Grid item container spacing={2} justifyContent="center" alignItems="center">
                  <Grid item md={6} xs={12}>
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
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
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
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
                <Grid item container spacing={2} justifyContent="center">
                  <Grid item xs={12}>
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
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                </Grid>
                <Grid item container spacing={2} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: '100%' }}>
                      <CustomFormLabel id="sex">{t('child.sex')}</CustomFormLabel>
                      <CustomSelect
                        labelId="sex-controlled-open-select-label"
                        id="sex"
                        control={control}
                        value={watch('sex') || ''}
                        register={{ ...register('sex') }}
                        error={!!errors.sex}
                      >
                        <MenuItem value={SexEnum.FEMALE}>{t(`child.sexKind.female`)}</MenuItem>
                        <MenuItem value={SexEnum.MALE}>{t(`child.sexKind.male`)}</MenuItem>
                      </CustomSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: '100%' }}>
                      <CustomFormLabel id="education">{t('child.education')}</CustomFormLabel>
                      <CustomSelect
                        labelId="education-controlled-open-select-label"
                        id="education"
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
                  <Grid item xs={12} md={6}>
                    <FormControl sx={{ width: '100%' }}>
                      <CustomFormLabel id="schoolType">{t('child.schoolType')}</CustomFormLabel>
                      <CustomSelect
                        labelId="schoolType-controlled-open-select-label"
                        id="schoolType"
                        control={control}
                        value={watch('schoolType') || ''}
                        register={{ ...register('schoolType') }}
                        error={!!errors.schoolType}
                      >
                        {Object.keys(SchoolTypeEnum).map((name, index) => (
                          <MenuItem key={name} value={Object.values(SchoolTypeEnum)[index]}>
                            {t(`child.schoolTypeCondition.${name.toLowerCase()}`)}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container justifyContent="center">
                  <Grid item xs={6}>
                    <CustomFormLabel htmlFor="familyCount">
                      {t('child.familyCount')}
                    </CustomFormLabel>
                    <TextField
                      id="familyCount"
                      variant="outlined"
                      type="number"
                      size="small"
                      sx={{ m: 'auto', width: '100%' }}
                      control={control}
                      {...register('familyCount')}
                      error={!!errors.familyCount}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {swId && successCountryList && activeStep === 1 && (
              <Grid container>
                <Grid item xs={12} container spacing={1} justifyContent="center">
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
                      {getAge(birthDate) === 0 ? '--' : getAge(birthDate)} {t('child.years')}
                    </Typography>
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <CustomFormLabel htmlFor="birthDate">{t('child.birthDate')}</CustomFormLabel>
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
                    <CustomFormLabel htmlFor="birthPlace">{t('child.birthPlace')}</CustomFormLabel>
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
                              value={String(Object.values(HousingStatusEnum)[index])}
                            >
                              {t(`child.housingCondition.${name}`)}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {swId && successCountryList && activeStep === 2 && (
              <Grid container sx={{ minHeight: 420 }}>
                <Grid item xs={10} sx={{ m: 'auto', mb: 0 }}>
                  <Card sx={{ p: 3, m: 0, textAlign: 'center' }}>
                    <Typography>{t('child.voiceInfo')}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={10} sx={{ m: 'auto', mt: 0 }}>
                  <Card sx={{ p: 3, m: 0, mt: 1, textAlign: 'center' }}>
                    <Grid container sx={{ m: 'auto' }}>
                      <Grid item xs={12} sx={{ width: '100%' }}>
                        <VoiceBar url={uploadVoice && URL.createObjectURL(uploadVoice)} />
                      </Grid>
                      <Grid item xs={12} sx={{ m: 'auto', width: '100%' }}>
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
                              m: 2,
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
                </Grid>
              </Grid>
            )}
          </Card>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <LoadingButton
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              {t('button.back')}
            </LoadingButton>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep !== steps.length - 1 && (
              <LoadingButton loading={loading} disabled={nextDisable} onClick={handleNext}>
                {t('button.next')}
              </LoadingButton>
            )}
            {activeStep === steps.length - 1 && (
              <LoadingButton
                disabled={!uploadVoice}
                loading={loading}
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                {t('button.finish')}
              </LoadingButton>
            )}
          </Box>
        </form>
      </>
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
