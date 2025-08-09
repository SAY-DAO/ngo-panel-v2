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
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Autocomplete,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  FormControl,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FeatherIcon from 'feather-icons-react';
import Stack from '@mui/material/Stack';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import UploadImage from '../../components/UploadImage';
import {
  AddNeed,
  fetchExampleNeeds,
  fetchChildOneNeed,
  fetchChildNeeds,
  fetchUnconfirmedCount,
} from '../../redux/actions/needsAction';
import {
  CHILD_EXAMPLE_NEEDS_RESET,
  CHILD_ONE_NEED_RESET,
  ADD_ONE_NEED_RESET,
} from '../../redux/constants/needConstant';
import { fetchActiveChildList, fetchMyChildById } from '../../redux/actions/childrenAction';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import LinearNeedStats from '../../components/analytics/LinearNeedStats';
import { fetchProviderList } from '../../redux/actions/providerAction';
import { apiDao } from '../../env';
import { convertFlaskToSayRoles, getAge, getOrganizedNeeds } from '../../utils/helpers';
import { fetchSwOrNgoChildList } from '../../redux/actions/socialWorkerAction';
import {
  ChildExistenceEnum,
  FlaskUserTypesEnum,
  NeedCategoryEnum,
  NeedTypeEnum,
  SAYPlatformRoles,
} from '../../utils/types';
import ProviderDialog from '../../components/dialogs/ProviderDialog';
import { UNCONFIRMED_NEEDS_THRESHOLD } from '../../utils/configs';
import collaborators from '../../utils/temp';

const NeedAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/need/list',
      title: t('BCrumb.needsList'),
    },
    {
      title: t('BCrumb.add'),
    },
  ];

  const [openProvider, setOpenProvider] = useState(false);
  // const [isAffChecked, setIsAffChecked] = useState(false);
  const [isUrgentChecked, setIsUrgentChecked] = useState(false);
  const [needsData, setNeedsData] = useState();

  const [openPreNeed, setOpenPreNeed] = useState(false);
  const [optionsPreNeed, setOptionsPreNeed] = useState([]);
  const [theNeed, setTheNeed] = useState();

  const [openProviderSelect, setOpenProviderSelect] = useState(false);
  const [theProvider, setTheProvider] = useState();

  const [openChildren, setOpenChildren] = useState(false);
  const [optionsChildren, setOptionsChildren] = useState([]);
  const isLoadingChildren = openChildren && optionsChildren.length === 0;

  const [childId, setChildId] = useState();

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, loading: loadingSw } = swDetails;

  const needAdd = useSelector((state) => state.needAdd);
  const { success: successAddNeed, loading: loadingAddNeed, error: errorAddNeed } = needAdd;

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChild, success: successChild } = childById;

  const childAllActives = useSelector((state) => state.childAllActives);
  const {
    activeChildren,
    loading: loadingActiveChildren,
    success: successActiveChildren,
  } = childAllActives;

  const providerAll = useSelector((state) => state.providerAll);
  const { providerList, loading: loadingProviderAll } = providerAll;

  const childExampleNeeds = useSelector((state) => state.childExampleNeeds);
  const { exampleNeeds, loading: loadingNeedEx, success: successNeedEx } = childExampleNeeds;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed } = childOneNeed;

  const childNeeds = useSelector((state) => state.childNeeds);
  const { theNeeds, success: successChildrenNeeds } = childNeeds;

  const swById = useSelector((state) => state.swById);
  const { children } = swById;

  const needUnConfirmCount = useSelector((state) => state.needUnConfirmCount);
  const { unconfirmed } = needUnConfirmCount;

  const isLoadingPreNeed = loadingNeedEx && openPreNeed && optionsPreNeed.length === 0;

  const providerAdd = useSelector((state) => state.providerAdd);
  const { success: successAddProvider } = providerAdd;

  useEffect(() => {
    if (successAddNeed) {
      navigate(`/need/list`);
    }
  }, [successAddNeed]);

  useEffect(() => {
    dispatch(fetchProviderList());
    dispatch(fetchUnconfirmedCount());
    dispatch({ type: ADD_ONE_NEED_RESET });
  }, []);

  useEffect(() => {
    dispatch(fetchProviderList());
  }, [successAddProvider]);

  // one need
  useEffect(() => {
    if (theNeed && theNeed.id) {
      dispatch(fetchChildOneNeed(theNeed.id));
    }
  }, [theNeed]);

  // needs
  useEffect(() => {
    if (childId) {
      dispatch(fetchChildNeeds(childId));
    }
  }, [childId]);

  // Autocomplete my Children
  useEffect(() => {
    let active = true;
    if (!isLoadingChildren) {
      return undefined;
    }
    if (active && (successActiveChildren || (children && children.children))) {
      // sort activeChildren
      const sortedChildren = (activeChildren || children.children).sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptionsChildren([...sortedChildren]);
    }
    return () => {
      active = false;
    };
  }, [isLoadingChildren, successActiveChildren, childId, children]);

  // child open
  useEffect(() => {
    if (unconfirmed < UNCONFIRMED_NEEDS_THRESHOLD) {
      if (!openChildren) {
        setOptionsChildren([]);
      } else if (!activeChildren && openChildren) {
        if (swInfo) {
          // super admin & admin
          if (
            swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ||
            swInfo.typeId === FlaskUserTypesEnum.ADMIN
          ) {
            dispatch(fetchActiveChildList());
          } else if (
            swInfo.typeId === FlaskUserTypesEnum.SOCIAL_WORKER ||
            swInfo.typeId === FlaskUserTypesEnum.NGO_SUPERVISOR
          ) {
            dispatch(fetchSwOrNgoChildList());
          }
        }
      }
    }
  }, [openChildren, setOpenChildren, childId, swInfo]);

  // Autocomplete pre need
  useEffect(() => {
    if (successNeedEx) {
      setOptionsPreNeed(exampleNeeds);
    }
  }, [isLoadingPreNeed, successNeedEx, openPreNeed]);

  // preNeed open
  useEffect(() => {
    if (!openPreNeed) {
      setOptionsPreNeed([]);
      dispatch({ type: CHILD_EXAMPLE_NEEDS_RESET });
    } else if (openPreNeed) {
      dispatch(fetchExampleNeeds(childId));
    }
  }, [openPreNeed, childId]);

  // theChild
  useEffect(() => {
    if (childId) {
      dispatch(fetchMyChildById(childId));
    }
  }, [childId]);

  // sort needs
  useEffect(() => {
    if (successChildrenNeeds) {
      const needData = getOrganizedNeeds(theNeeds);
      setNeedsData(needData);
    }
  }, [childId, successChildrenNeeds]);

  const validationSchema = Yup.object().shape({
    name_fa: Yup.string().required('Please enter needs name'),
    name_en: Yup.string().required('Please enter needs name'),
    cost: Yup.number().required('Please enter needs cost').moreThan(0, 'Cost can not be zero'),
    type: Yup.string().required('Please enter type'),
    // doing_duration: Yup.number()
    //   .required('Please enter estimated finishing time')
    //   .moreThan(0, 'Cost can not be zero'),
    category: Yup.number().required('Please enter needs category'),
    link:
      theProvider &&
      theProvider.type === NeedTypeEnum.PRODUCT &&
      Yup.string().url().required('Please enter needs link'),
    // imageUrl: Yup.string().required('Please choose an icon'),
  });

  const {
    setValue,
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (successNeedEx && oneNeed) {
      setValue('name_fa', oneNeed.name_translations.fa);
      setValue('name_en', oneNeed.name_translations.en);
      // setValue('category', oneNeed.category);
      setValue('isUrgent', oneNeed.isUrgent);
      setValue('desc_fa', oneNeed.description_translations.fa);
      setValue('desc_en', oneNeed.description_translations.en);
      // setValue('informations', oneNeed.informations);
      // setValue('details', oneNeed.details); // social worker note on app
      // setValue('link', oneNeed.link);
      // setValue('affiliateLinkUrl', oneNeed.affiliateLinkUrl);
      // setValue('cost', oneNeed.cost);
      setValue('doing_duration', oneNeed.doing_duration);
    }
  }, [successNeedEx, oneNeed]);

  // set type when provider is changed
  useEffect(() => {
    if (theProvider) {
      setValue('type', theProvider.type);
    }
  }, [theProvider]);

  useEffect(() => {
    if (successAddProvider) {
      setOpenProvider(false);
    }
  }, [successAddProvider]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);

    if (Number(data.type) === NeedTypeEnum.PRODUCT && (!data.link || data.link.length < 10)) {
      setError('link', {
        message: 'لینک را اضافه کنید',
        type: 'required',
      });
    }
    if (
      (!finalImageFile || finalImageFile.length < 3) &&
      (!oneNeed || (oneNeed.imageUrl && oneNeed.imageUrl.split('company/')[1].length < 3))
    ) {
      setError('imageUrl', {
        message: 'آیکون را اضافه کنید',
        type: 'required',
      });
    } else {
      dispatch(
        AddNeed(
          {
            name: JSON.stringify({ en: data.name_en, fa: data.name_fa }),
            description: JSON.stringify({ en: data.desc_en, fa: data.desc_fa }),
            isUrgent: isUrgentChecked,
            cost: data.cost,
            type: data.type,
            category: data.category,
            imageUrl: finalImageFile || (oneNeed && oneNeed.imageUrl.split('company/')[1]),
            details: data.details,
            information: data.informations,
            doing_duration: data.doing_duration,
            link: data.link,
            affiliateLinkUrl: '',
            childId,
          },
          theProvider.id,
        ),
      );
      dispatch({ type: CHILD_ONE_NEED_RESET });
    }
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
      if (e.target.files[0].name) {
        setValue('imageUrl', e.target.files[0].name);
      }
    }
  };

  // const handleAffChange = (e) => {
  //   setIsAffChecked(e.target.checked);
  // };

  const handleUrgentChange = (e) => {
    setIsUrgentChecked(e.target.checked);
  };

  return (
    <PageContainer title="Need Add" description="this is Need Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          {((swInfo && unconfirmed != null && unconfirmed < UNCONFIRMED_NEEDS_THRESHOLD) ||
            (swInfo && convertFlaskToSayRoles(swInfo.typeId) === SAYPlatformRoles.AUDITOR)) && (
            <Autocomplete
              disabled={
                (unconfirmed === null || unconfirmed > UNCONFIRMED_NEEDS_THRESHOLD) &&
                convertFlaskToSayRoles(swInfo.typeId) !== SAYPlatformRoles.AUDITOR
              }
              id="asynchronous-activeChildren"
              sx={{ minWidth: '340px' }}
              open={openChildren}
              onOpen={() => {
                setOpenChildren(true);
              }}
              onClose={() => {
                setOpenChildren(false);
              }}
              options={optionsChildren}
              onChange={(e, value) => setChildId(value && value.id)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) =>
                `${option.id} - ${option.sayname_translations.fa} - ${option.firstName_translations.fa} ${option.lastName_translations.fa}`
              }
              loading={loadingSw || !children}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...props}
                  key={option.id}
                >
                  {option.isConfirmed &&
                  option.existence_status === ChildExistenceEnum.aliveAndPresent ? (
                    <>
                      <FeatherIcon color="green" icon="check" width="18" />
                      <Typography variant="body1" sx={{ fontSize: 13 }}>
                        {`${option.id} - ${option.firstName_translations.fa} ${option.lastName_translations.fa}- (${option.sayname_translations.fa}) `}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <FeatherIcon color="red" icon="x" width="18" />
                      <Typography>{`${option.id}  - ${option.firstName_translations.fa} ${option.lastName_translations.fa}- (${option.sayname_translations.fa})`}</Typography>
                    </>
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('socialWorker.myChildren')}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingChildren ? <CircularProgress color="inherit" size={20} /> : null}
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
      {loadingChild || loadingActiveChildren ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {successChild && childId ? (
            <>
              <Grid container spacing={0}>
                <Grid item lg={4} md={12} xs={12}>
                  <Card sx={{ pb: 6 }}>
                    <Grid container spacing={0}>
                      <Badge
                        sx={{ margin: 'auto' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Badge
                            sx={{ margin: 'auto' }}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            overlap="circular"
                            badgeContent={
                              <div className="upload__image-wrapper">
                                <Grid
                                  sx={{
                                    position: 'relative',
                                    display: 'none',
                                  }}
                                >
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
                            {!finalImageFile && oneNeed ? (
                              <Avatar
                                id="imageUrl"
                                variant="circle"
                                alt="user photo"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  boxShadow: '0px 7px 30px 0px',
                                }}
                                src={oneNeed.imageUrl}
                              />
                            ) : (
                              <Avatar
                                variant="circle"
                                alt="icon image"
                                src={
                                  finalImageFile && URL.createObjectURL(finalImageFile) // image preview
                                }
                                sx={{
                                  width: 50,
                                  height: 50,
                                  boxShadow: '0px 7px 30px 0px',
                                }}
                              >
                                <Typography sx={{ padding: 1 }}>Icon</Typography>
                              </Avatar>
                            )}
                          </Badge>
                        }
                      >
                        <Avatar
                          variant="circle"
                          alt="user photo"
                          sx={{ width: 110, height: 110 }}
                          src={result.avatarUrl}
                        />
                      </Badge>
                    </Grid>
                  </Card>
                  <Card sx={{ textAlign: 'center' }}>
                    <Typography component="span" sx={{ textAlign: 'center' }}>
                      {result.firstName}{' '}
                    </Typography>
                    <Typography component="span" sx={{ textAlign: 'center' }}>
                      {result.lastName}
                    </Typography>
                    <Typography sx={{ textAlign: 'center', fontSize: 12 }}>
                      ({result.sayName})
                    </Typography>
                    <Typography sx={{ textAlign: 'center', fontSize: 12 }}>
                      {getAge(result.birthDate)} {t('child.years')}
                    </Typography>
                  </Card>
                  <Card sx={{ p: 1 }}>
                    <Grid item xs={12}>
                      {needsData && successChildrenNeeds ? (
                        <Grid item xs={12}>
                          <LinearNeedStats
                            needsData={needsData}
                            totalNeeds={parseInt(theNeeds.total_count, 10)}
                          />
                        </Grid>
                      ) : (
                        <Grid sx={{ textAlign: 'center' }}>
                          <CircularProgress />
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                </Grid>
                <Grid item lg={8} md={12} xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                      {t('need.titleAdd')}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <Autocomplete
                        sx={{ maxWidth: '500px', m: 'auto' }}
                        id="asynchronous-preNeed"
                        open={openPreNeed}
                        onOpen={() => {
                          setOpenPreNeed(true);
                        }}
                        onClose={() => {
                          setOpenPreNeed(false);
                        }}
                        onChange={(e, value) => setTheNeed(value)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) =>
                          option.type === NeedTypeEnum.PRODUCT
                            ? `${option.id} - ${option.title} - ${option.name}`
                            : `${option.id} - ${option.name}`
                        }
                        options={optionsPreNeed}
                        loading={isLoadingPreNeed}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...props}
                            key={option.id}
                          >
                            {/* <Avatar
                              src={option.imageUrl}
                              sx={{
                                borderRadius: '10px',
                                width: '50px',
                                height: '50px',
                                m: 1,
                              }}
                            /> */}
                            <Typography
                              sx={{
                                maxWidth: '400px',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '360px',
                                height: '1.2em',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {option.id} - {option.title} - {option.name}
                            </Typography>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('need.preNeed')}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isLoadingPreNeed ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {theNeed && (
                        <>
                          <Card sx={{ p: 4 }} elevation={5}>
                            <Grid
                              container
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="flex-end"
                              spacing={2}
                            >
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="name_fa">
                                  {t('need.name.fa')}
                                </CustomFormLabel>
                                <TextField
                                  id="name_fa"
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  size="small"
                                  control={control}
                                  {...register('name_fa', { required: true })}
                                  error={!!errors.name_fa}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="name_en">
                                  {t('need.name.en')}
                                </CustomFormLabel>
                                <TextField
                                  id="name_en"
                                  variant="outlined"
                                  disabled
                                  fullWidth
                                  size="small"
                                  control={control}
                                  {...register('name_en', { required: true })}
                                  error={!!errors.name_en}
                                />
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="flex-end"
                              mb={2}
                              mt={2}
                              spacing={2}
                            >
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="category">
                                  {t('need.category')}
                                </CustomFormLabel>
                                <CustomSelect
                                  native
                                  sx={{ width: '100%', color: 'gray' }}
                                  labelId="category-controlled-open-select-label"
                                  id="category-controlled-open-select"
                                  control={control}
                                  register={{ ...register('category', { required: true }) }}
                                  error={!!errors.category}
                                >
                                  <option value="">-</option>
                                  <option value={NeedCategoryEnum.GROWTH}>
                                    {t('need.categories.growth')}
                                  </option>
                                  <option value={NeedCategoryEnum.JOY}>
                                    {t('need.categories.joy')}
                                  </option>
                                  <option value={NeedCategoryEnum.HEALTH}>
                                    {t('need.categories.health')}
                                  </option>
                                  <option value={NeedCategoryEnum.SURROUNDING}>
                                    {t('need.categories.surroundings')}
                                  </option>
                                </CustomSelect>
                              </Grid>

                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="cost">{t('need.cost')}</CustomFormLabel>
                                <OutlinedInput
                                  sx={{ width: '100%' }}
                                  id="cost"
                                  type="number"
                                  variant="outlined"
                                  fullWidth
                                  control={control}
                                  {...register('cost', { required: true })}
                                  error={!!errors.cost}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {t('currency.toman')}
                                    </InputAdornment>
                                  }
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <FormControlLabel
                                  control={
                                    <CustomCheckbox
                                      color="primary"
                                      checked={isUrgentChecked}
                                      onChange={handleUrgentChange}
                                    />
                                  }
                                  label={t('need.isUrgent')}
                                />
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="flex-end"
                              spacing={2}
                            >
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="desc_fa">
                                  {t('need.descriptions.fa')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id="desc_fa"
                                  disabled
                                  variant="outlined"
                                  multiline
                                  rows={4}
                                  size="small"
                                  sx={{ mb: 2 }}
                                  fullWidth
                                  control={control}
                                  register={{ ...register('desc_fa') }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="desc_en">
                                  {t('need.descriptions.en')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id="desc_en"
                                  variant="outlined"
                                  disabled
                                  multiline
                                  rows={4}
                                  size="small"
                                  sx={{ mb: 2 }}
                                  fullWidth
                                  control={control}
                                  register={{ ...register('desc_en') }}
                                />
                              </Grid>
                            </Grid>
                          </Card>
                          <Card sx={{ p: 4 }} elevation={5}>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="flex-end"
                              spacing={4}
                              mb={2}
                            >
                              <Grid item lg={8} xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <FormControl sx={{ m: 1, width: '100%' }}>
                                    <Autocomplete
                                      sx={{ width: '100%', m: 'auto' }}
                                      id="asynchronous-provider"
                                      open={openProviderSelect}
                                      onOpen={() => {
                                        setOpenProviderSelect(true);
                                      }}
                                      onClose={() => {
                                        setOpenProviderSelect(false);
                                      }}
                                      onChange={(e, value) => setTheProvider(value)}
                                      isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                      }
                                      getOptionLabel={(option) => `${option.name}`}
                                      options={providerList || []}
                                      loading={loadingProviderAll}
                                      renderOption={(props, option) => (
                                        <Box
                                          component="li"
                                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                          {...props}
                                          key={option.id}
                                        >
                                          <Grid container>
                                            <Grid
                                              item
                                              xs={2}
                                              sx={{
                                                m: 'auto',
                                              }}
                                            >
                                              <Avatar
                                                alt={option.name}
                                                src={
                                                  option.logoUrl &&
                                                  `${apiDao}/providers/images/${option.logoUrl}`
                                                }
                                                sx={{
                                                  width: 25,
                                                  height: 25,
                                                }}
                                              />
                                            </Grid>
                                            <Grid item xs={4}>
                                              <Typography variant="body2">{option.name}</Typography>
                                            </Grid>
                                            <Grid
                                              item
                                              sx={{
                                                m: 'auto',
                                                fontSize: 12,
                                              }}
                                            >
                                              (
                                              {option.type === NeedTypeEnum.PRODUCT
                                                ? t('need.providers.product')
                                                : t('need.providers.service')}
                                              )
                                            </Grid>
                                          </Grid>
                                        </Box>
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label={t('need.provider')}
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <>
                                                {isLoadingPreNeed ? (
                                                  <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                              </>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Stack>
                              </Grid>
                              <Grid item lg={4} xs={12}>
                                <CustomFormLabel variant="body2" htmlFor="type">
                                  {t('need.type_name')}
                                </CustomFormLabel>
                                <Typography
                                  disabled
                                  sx={{
                                    width: '100%',
                                    color: errors.type
                                      ? (theme) => theme.palette.error.dark
                                      : 'gray',
                                  }}
                                  id="type-controlled-open-select"
                                >
                                  {theProvider ? theProvider.typeName : t('need.providerSelect')}
                                </Typography>
                              </Grid>
                              {theProvider && theProvider.type === NeedTypeEnum.PRODUCT && (
                                <Grid item xs={12}>
                                  <CustomFormLabel htmlFor="link">{t('need.link')}</CustomFormLabel>
                                  <TextField
                                    id="link"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    placeholder={t('need.placeholder.link')}
                                    control={control}
                                    {...register('link', { required: true })}
                                    error={!!errors.link}
                                  />
                                </Grid>
                              )}

                              {/* <Grid item xs={6}>
                                <FormControlLabel
                                  control={
                                    <CustomCheckbox
                                      color="primary"
                                      checked={isAffChecked}
                                      onChange={handleAffChange}
                                    />
                                  }
                                  label={t('need.affiliateLinkUrl')}
                                />
                              </Grid> */}
                            </Grid>

                            {/* {isAffChecked && (
                              <>
                                <CustomFormLabel htmlFor="affiliateLinkUrl">
                                  {t('need.affiliateLinkUrl')}
                                </CustomFormLabel>
                                <TextField
                                  id="affiliateLinkUrl"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  control={control}
                                  {...register('affiliateLinkUrl', { required: true })}
                                  error={!!errors.affiliateLinkUrl}
                                />
                              </>
                            )} */}
                          </Card>
                          <Card sx={{ p: 2 }} elevation={5}>
                            {/* <CustomFormLabel htmlFor="doing_duration">
                              {t('need.doing_duration')}
                            </CustomFormLabel>
                            <TextField
                              id="doing_duration"
                              defaultValue={5}
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              control={control}
                              {...register('doing_duration', { required: true })}
                              error={!!errors.doing_duration}
                            /> */}
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="flex-end"
                              spacing={2}
                            >
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="details">
                                  {t('need.details')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id="details" // یادداشت مددکار
                                  variant="outlined"
                                  multiline
                                  rows={4}
                                  size="small"
                                  sx={{ mb: 2 }}
                                  fullWidth
                                  placeholder={t('need.placeholder.details')}
                                  control={control}
                                  register={{ ...register('details') }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <CustomFormLabel htmlFor="informations">
                                  {t('need.informations')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id="informations" // اطلاعات بیشتر
                                  variant="outlined"
                                  multiline
                                  rows={4}
                                  placeholder={t('need.placeholder.information')}
                                  size="small"
                                  sx={{ mb: 2 }}
                                  fullWidth
                                  control={control}
                                  register={{ ...register('informations') }}
                                />
                              </Grid>
                            </Grid>
                          </Card>
                          <LoadingButton
                            loading={loadingAddNeed}
                            color="primary"
                            type="submit"
                            disabled={successAddNeed || collaborators.includes(swInfo.id)}
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            sx={{ mt: 4 }}
                          >
                            {t('need.button.add')}
                          </LoadingButton>
                        </>
                      )}

                      {/* <ul>
                        {errors && errors.name_fa && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.name_fa?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.name_en && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.name_en?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.cost && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.cost?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.type && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.type?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.category && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.category?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.imageUrl && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.imageUrl?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.link && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.link?.message}
                            </Typography>
                          </li>
                        )}
                        {errors && errors.doing_duration && (
                          <li>
                            <Typography color="error" variant="span">
                              {errors && errors.doing_duration?.message}
                            </Typography>
                          </li>
                        )}
                      </ul> */}
                    </form>
                  </Card>
                </Grid>
              </Grid>
              {/* Need Icon */}
              <Dialog
                open={openImageDialog}
                onClose={handleImageClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <Box>
                    <UploadImage
                      uploadImage={uploadImage}
                      handleImageClose={handleImageClose}
                      setFinalImageFile={setFinalImageFile}
                    />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleImageClose}>{t('button.close')}</Button>
                </DialogActions>
              </Dialog>
              {/* Need Provider */}
              <ProviderDialog open={openProvider} setOpen={setOpenProvider} />
              <Grid>
                {(successAddNeed || errorAddNeed) && (
                  <Message
                    severity={successAddNeed ? 'success' : 'error'}
                    variant="filled"
                    input="needAdd"
                    backError={errorAddNeed}
                    sx={{ width: '100%' }}
                  >
                    {successAddNeed && t('need.updatedNeed')}
                  </Message>
                )}
              </Grid>
            </>
          ) : (
            unconfirmed > UNCONFIRMED_NEEDS_THRESHOLD && (
              <Box
                sx={{
                  width: 300,
                  height: 150,
                  m: 'auto',
                  mt: 5,
                  p: 3,
                  backgroundColor: (theme) => theme.palette.background.paper,
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item>
                    <Typography sx={{ display: 'inline-flex', textAlign: 'center', pb: 4 }}>
                      {t('alert.needThreshold.body1')}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="body1" sx={{ fontSize: 12, p: 1 }}>
                      {t('alert.needThreshold.threshold')}
                      {': '}
                      {UNCONFIRMED_NEEDS_THRESHOLD}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" sx={{ fontSize: 12, p: 1 }}>
                      {t('alert.needThreshold.unconfirmed')}
                      {': '}
                      {unconfirmed}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )
          )}
        </>
      )}
    </PageContainer>
  );
};

export default NeedAdd;
