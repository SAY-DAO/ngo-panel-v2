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
  MenuItem,
  FormControlLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import UploadIdImage from '../../components/UploadImage';
import { updateNeed, fetchExampleNeeds, fetchChildOneNeed } from '../../redux/actions/needsAction';
import { CHILD_ONE_NEED_RESET } from '../../redux/constants/needConstant';
import { fetchChildList, fetchMyChildById } from '../../redux/actions/childrenAction';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';

const BCrumb = [
  {
    to: '/need/list',
    title: 'Needs List',
  },
  {
    title: 'Add',
  },
];

const NeedAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [isAffChecked, setIsAffChecked] = useState(false);
  const [isUrgentChecked, setIsUrgentChecked] = useState(false);

  const [openPreNeed, setOpenPreNeed] = useState(false);
  const [optionsPreNeed, setOptionsPreNeed] = useState([]);
  const isLoadingPreNeed = openPreNeed && optionsPreNeed.length === 0;
  const [theNeed, setTheNeed] = useState();

  const [openChildren, setOpenChildren] = useState(false);
  const [optionsChildren, setOptionsChildren] = useState([]);
  const isLoadingChildren = openChildren && optionsChildren.length === 0;
  const [childId, setChildId] = useState();

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);

  const needAdd = useSelector((state) => state.needAdd);
  const { success: successAddNeed, loading: loadingAddNeed, error: errorAddNeed } = needAdd;

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChild, success: successChild } = childById;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren, loading: loadingChildren, success: successChildren } = childAll;

  const childExampleNeeds = useSelector((state) => state.childExampleNeeds);
  const { exampleNeeds, success: successNeedEx } = childExampleNeeds;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed, loading: loadingOneNeed, success: successOneNeed } = childOneNeed;

  // one need
  useEffect(() => {
    if (!successOneNeed && theNeed && theNeed.id) {
      dispatch(fetchChildOneNeed(theNeed.id));
    }
  }, [theNeed]);

  // Autocomplete my Children
  useEffect(() => {
    let active = true;
    if (!isLoadingChildren) {
      return undefined;
    }
    if (active && successChildren) {
      // sort myChildren
      const sortedChildren = myChildren.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptionsChildren([...sortedChildren]);
    }
    return () => {
      active = false;
    };
  }, [isLoadingChildren, successChildren, childId]);

  // child open
  useEffect(() => {
    if (!openChildren) {
      setOptionsChildren([]);
    } else if (openChildren) {
      dispatch(fetchChildList());
    }
  }, [openChildren, setOpenChildren, childId]);

  // Autocomplete pre need
  useEffect(() => {
    let active = true;
    if (!isLoadingPreNeed) {
      return undefined;
    }
    if (active && successNeedEx) {
      // sort my children
      const sortedNeeds = exampleNeeds.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptionsPreNeed([...sortedNeeds]);
    }
    return () => {
      active = false;
    };
  }, [isLoadingPreNeed, successNeedEx]);

  // preNeed open
  useEffect(() => {
    if (!openPreNeed) {
      setOptionsPreNeed([]);
    } else if (openPreNeed) {
      dispatch(fetchExampleNeeds());
    }
  }, [openPreNeed]);

  // theChild
  useEffect(() => {
    if (childId) {
      dispatch(fetchMyChildById(childId));
    }
  }, [childId]);

  //

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter needs name'),
  });

  const {
    setValue,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (successNeedEx && theNeed) {
      setValue('name_fa', theNeed.cost.toLocaleString());
    }
  }, [successNeedEx, theNeed]);

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      updateNeed({
        name: data.name,
        emailAddress: data.emailAddress,
        country: data.country,
        city: data.city,
        phoneNumber: data.phoneNumber,
        postalAddress: data.postalAddress,
        website: data.website,
        logoUrl: finalImageFile,
      }),
    );
    dispatch({ type: CHILD_ONE_NEED_RESET });
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

  const handleChangeInput = () => () => {
    // setValues({ ...values, [prop]: event.target.value });
  };

  const handleAffChange = (e) => {
    setIsAffChecked(e.target.checked);
  };

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
          <Autocomplete
            id="asynchronous-myChildren"
            sx={{ width: 300 }}
            open={openChildren}
            onOpen={() => {
              setOpenChildren(true);
            }}
            onClose={() => {
              setOpenChildren(false);
            }}
            onChange={(e, value) => setChildId(value && value.id)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${option.id} - ${option.sayName}`}
            options={optionsChildren}
            loading={isLoadingChildren}
            renderInput={(params) => (
              <TextField
                {...params}
                label="My Children"
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
        </Grid>
      </Grid>
      {loadingChild || loadingChildren ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {successChild && childId && (
            <>
              <Grid container spacing={0}>
                <Grid item lg={4} md={12} xs={12}>
                  <Card sx={{ p: 3 }}>
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
                            <Avatar
                              variant="circle"
                              alt="user photo"
                              src={
                                finalImageFile
                                  ? URL.createObjectURL(finalImageFile) // image preview
                                  : null
                              }
                            >
                              <Typography sx={{ padding: 1 }}>Icon</Typography>
                            </Avatar>
                          </Badge>
                        }
                      >
                        <Avatar
                          variant="square"
                          alt="user photo"
                          sx={{ width: 110, height: 110 }}
                          src={result.avatarUrl}
                        />
                      </Badge>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item lg={8} md={12} xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                      {t('socialWorker.titleAdd')}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <Autocomplete
                        id="asynchronous-myChildren"
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
                          `${option.id} - ${option.name} - ${option.title}`
                        }
                        options={optionsPreNeed}
                        loading={isLoadingPreNeed}
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
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-end"
                        spacing={2}
                      >
                        <Grid item xs={6}>
                          <CustomFormLabel htmlFor="name_fa">{t('need.name.fa')}</CustomFormLabel>
                          <TextField
                            id="name_fa"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('name_fa', { required: true })}
                            error={!!errors.name_fa}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomFormLabel htmlFor="name_en">{t('need.name.en')}</CustomFormLabel>
                          <TextField
                            id="name_en"
                            variant="outlined"
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
                        <Grid item xs={3}>
                          <CustomFormLabel htmlFor="type">{t('need.type_name')}</CustomFormLabel>
                          <CustomSelect
                            sx={{ width: '100%' }}
                            labelId="type-controlled-open-select-label"
                            id="type-controlled-open-select"
                            defaultValue={1}
                            onChange={handleChangeInput('type')}
                            control={control}
                            register={{ ...register('type') }}
                          >
                            <MenuItem value={0}>{t('need.types.service')}</MenuItem>
                            <MenuItem value={1}>{t('need.types.product')}</MenuItem>
                          </CustomSelect>
                        </Grid>
                        <Grid item xs={3}>
                          <CustomFormLabel htmlFor="category">{t('need.category')}</CustomFormLabel>
                          <CustomSelect
                            sx={{ width: '100%' }}
                            labelId="category-controlled-open-select-label"
                            id="category-controlled-open-select"
                            defaultValue={1}
                            onChange={handleChangeInput('category')}
                            control={control}
                            register={{ ...register('category') }}
                          >
                            <MenuItem value={0}>{t('need.categories.growth')}</MenuItem>
                            <MenuItem value={1}>{t('need.categories.joy')}</MenuItem>
                            <MenuItem value={2}>{t('need.categories.health')}</MenuItem>
                            <MenuItem value={3}>{t('need.categories.surroundings')}</MenuItem>
                          </CustomSelect>
                        </Grid>
                        <Grid item xs={3}>
                          <CustomFormLabel htmlFor="cost">{t('need.cost')}</CustomFormLabel>
                          <TextField
                            sx={{ width: '100%' }}
                            id="cost"
                            type="number"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('cost', { required: true })}
                            error={!!errors.cost}
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
                            label={`${t('need.isUrgent')}?`}
                          />
                        </Grid>
                      </Grid>
                      {isUrgentChecked && (
                        <>
                          <CustomFormLabel htmlFor="isUrgentDesc">
                            {t('need.isUrgentDesc')}
                          </CustomFormLabel>
                          <CustomTextField
                            id="isUrgentDesc"
                            variant="outlined"
                            multiline
                            rows={4}
                            size="small"
                            sx={{ mb: 2 }}
                            fullWidth
                            control={control}
                            register={{ ...register('isUrgentDesc') }}
                          />
                        </>
                      )}

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
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-end"
                        spacing={2}
                        mb={2}
                      >
                        <Grid item xs={6}>
                          <CustomFormLabel htmlFor="link">{t('need.link')}</CustomFormLabel>
                          <TextField
                            id="link"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('link', { required: true })}
                            error={!!errors.link}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <CustomCheckbox
                                color="primary"
                                checked={isAffChecked}
                                onChange={handleAffChange}
                              />
                            }
                            label={`${t('need.affiliateLinkUrl')}?`}
                          />
                        </Grid>
                      </Grid>

                      {isAffChecked && (
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
                      )}
                      <CustomFormLabel htmlFor="doing_duration">
                        {t('need.doing_duration')}
                      </CustomFormLabel>
                      <TextField
                        id="doing_duration"
                        variant="outlined"
                        fullWidth
                        size="small"
                        control={control}
                        {...register('doing_duration', { required: true })}
                        error={!!errors.doing_duration}
                      />
                      <CustomFormLabel htmlFor="details">{t('need.details')}</CustomFormLabel>
                      <CustomTextField
                        id="details"
                        variant="outlined"
                        multiline
                        rows={4}
                        size="small"
                        sx={{ mb: 2 }}
                        fullWidth
                        control={control}
                        register={{ ...register('details') }}
                      />
                      <LoadingButton
                        loading={loadingAddNeed}
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
              {/* Need Icon */}
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
                {(successAddNeed || errorAddNeed) && (
                  <Message
                    severity={successAddNeed ? 'success' : 'error'}
                    variant="filled"
                    input="addSw"
                    backError={errorAddNeed}
                    sx={{ width: '100%' }}
                  >
                    {successAddNeed && t('socialWorker.updated')}
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

export default NeedAdd;
