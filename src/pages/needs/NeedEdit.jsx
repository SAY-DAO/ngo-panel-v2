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
import UploadIdImage from '../../components/UploadImage';
import { fetchChildOneNeed, updateNeed } from '../../redux/actions/needsAction';
import { CHILD_ONE_NEED_RESET } from '../../redux/constants/needConstant';
import { fetchMyChildById } from '../../redux/actions/childrenAction';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';

const NeedEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { needId, childId } = useParams();
  const BCrumb = [
    {
      to: '/need/list',
      title: 'Needs List',
      state: childId,
    },
    {
      title: 'Edit',
    },
  ];

  const [isAffChecked, setIsAffChecked] = useState(false);
  const [isUrgentChecked, setIsUrgentChecked] = useState(false);

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChild, success: successChild } = childById;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed } = childOneNeed;

  // one need
  useEffect(() => {
    dispatch(fetchChildOneNeed(needId));
  }, []);

  // theChild
  useEffect(() => {
    if (childId) {
      dispatch(fetchMyChildById(childId));
    }
  }, [childId]);

  const validationSchema = Yup.object().shape({
    name_fa: Yup.string().required('Please enter needs name'),
    name_en: Yup.string().required('Please enter needs name'),
    cost: Yup.number().required('Please enter needs cost'),
    type: Yup.string().required('Please enter needs name'),
    doing_duration: Yup.number().required('Please enter estimated finishing time'),
    category: Yup.string().required('Please enter needs category'),
    link: Yup.string().url().required('Please enter needs link'),
    imageUrl: Yup.string().required('Please choose an icon'),
    // isUrgentDesc: Yup.string().required('Please enter urgency details'),
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
    if (oneNeed) {
      setValue('name_fa', oneNeed.name_translations.fa);
      setValue('name_en', oneNeed.name_translations.en);
      setValue('type', oneNeed.type);
      setValue('category', oneNeed.category);
      setValue('isUrgent', oneNeed.isUrgent);
      setValue('desc_fa', oneNeed.description_translations.fa);
      setValue('desc_en', oneNeed.description_translations.en);
      setValue('informations', oneNeed.informations);
      setValue('details', oneNeed.details); // social worker note on app
      setValue('link', oneNeed.link);
      setValue('affiliateLinkUrl', oneNeed.affiliateLinkUrl);
      setValue('imageUrl', oneNeed.imageUrl);
      setValue('cost', oneNeed.cost);
      if (oneNeed.isUrgent) {
        setIsUrgentChecked(true);
      } else {
        setIsUrgentChecked(false);
      }
    }
  }, [oneNeed]);

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
        details: data.details,
        information: data.informations,
        needId: oneNeed.id,
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
      if (e.target.files[0].name) {
        setValue('imageUrl', e.target.files[0].name);
      }
    }
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
      {loadingChild ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {successChild && childId && (
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
                              alt="icon image"
                              src={
                                finalImageFile
                                  ? URL.createObjectURL(finalImageFile) // image preview
                                  : oneNeed && oneNeed.imageUrl
                              }
                              sx={{
                                backgroundColor: 'white',
                                width: 50,
                                height: 50,
                                boxShadow: '0px 7px 30px 0px',
                              }}
                            >
                              <Typography sx={{ padding: 1 }}>Icon</Typography>
                            </Avatar>
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
                </Grid>
                <Grid item lg={8} md={12} xs={12}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                      {t('need.titleAdd')}
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
                          <CustomFormLabel htmlFor="name_fa">{t('need.name.fa')}</CustomFormLabel>
                          <TextField
                            id="name_fa"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('name_fa', { required: true })}
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
                            native
                            sx={{ width: '100%', color: 'gray' }}
                            labelId="type-controlled-open-select-label"
                            id="type-controlled-open-select"
                            control={control}
                            register={{ ...register('type', { required: true }) }}
                          >
                            <option value={0}>{t('need.types.service')}</option>
                            <option value={1}>{t('need.types.product')}</option>
                          </CustomSelect>
                        </Grid>
                        <Grid item xs={3}>
                          <CustomFormLabel htmlFor="category">{t('need.category')}</CustomFormLabel>
                          <CustomSelect
                            native
                            sx={{ width: '100%', color: 'gray' }}
                            labelId="category-controlled-open-select-label"
                            id="category-controlled-open-select"
                            control={control}
                            register={{ ...register('category', { required: true }) }}
                          >
                            <option value={0}>{t('need.categories.growth')}</option>
                            <option value={1}>{t('need.categories.joy')}</option>
                            <option value={2}>{t('need.categories.health')}</option>
                            <option value={3}>{t('need.categories.surroundings')}</option>
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
                        type="number"
                        size="small"
                        control={control}
                        {...register('doing_duration', { required: true })}
                        error={!!errors.doing_duration}
                      />
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="flex-end"
                        spacing={2}
                      >
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
                          <CustomFormLabel htmlFor="informations">
                            {t('need.informations')}
                          </CustomFormLabel>
                          <CustomTextField
                            id="informations"
                            variant="outlined"
                            multiline
                            rows={4}
                            size="small"
                            sx={{ mb: 2 }}
                            fullWidth
                            control={control}
                            register={{ ...register('informations') }}
                          />
                        </Grid>
                      </Grid>
                      <LoadingButton
                        // loading={loadingAddNeed}
                        color="primary"
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        variant="contained"
                        sx={{ mt: 4 }}
                      >
                        {t('need.button.add')}
                      </LoadingButton>
                      <ul>
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
                      </ul>
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
              {/* <Grid>
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
              </Grid> */}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default NeedEdit;
