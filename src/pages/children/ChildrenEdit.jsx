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
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import {
  updateChild,
  fetchMyChildById,
  updateChildIsActive,
} from '../../redux/actions/childrenAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import UploadImage from '../../components/UploadImage';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { CHILD_BY_ID_RESET } from '../../redux/constants/childrenConstants';

const BCrumb = [
  {
    to: '/children/list',
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

  const [activeChecked, setActiveChecked] = useState(false);
  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openIdImageDialog, setOpenIdImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [birthDate, setBirthDate] = useState(new Date());
  const [values, setValues] = useState({});

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChildById, success: successChildById } = childById;

  const childUpdate = useSelector((state) => state.childUpdate);
  const {
    success: successChildUpdate,
    loading: loadingChildUpdate,
    error: errorChildUpdate,
  } = childUpdate;

  useEffect(() => {
    if (!successChildById && id) {
      dispatch(fetchMyChildById(id));
    }
  }, [successChildUpdate, id]);

  // isActive
  useEffect(() => {
    if (result && result.isActive) {
      setActiveChecked(true);
    } else {
      setActiveChecked(false);
    }
  }, [successChildById]);

  // awakeAvatarUrl(pin):"https://api.sayapp.company/files/40-child/40-avatar_0010010013.png"
  // sleptAvatarUrl(pin):"https://api.sayapp.company/files/40-child/40-sleptAvatar_0010010013.png"
  // voiceUrl(pin):"https://api.sayapp.company/files/40-child/40-voice_0010010013.mp3"
  // avatarUrl(pin):"https://api.sayapp.company/files/40-child/40-sleptAvatar_0010010013.png"

  useEffect(() => {
    if (result) {
      setBirthDate(result.birthDate);
      setValues({
        ...values,
        id_ngo: result.id_ngo,
        id_social_worker: result.id_social_worker,
        firstName: result.firstName,
        lastName: result.lastName,
        sayName: result.sayName,
        phoneNumber: result.phoneNumber,
        nationality: result.nationality,
        country: result.country,
        city: result.city,
        bio: result.bio,
        bioSummary: result.bioSummary,
        sayFamilyCount: result.sayFamilyCount,
        birthPlace: result.birthPlace,
        address: result.address,
        housingStatus: result.housingStatus,
        familyCount: result.familyCount,
        education: result.education,
        status: result.status,
        existence_status: result.existence_status,
        isDeleted: result.isDeleted,
        isConfirmed: result.isConfirmed,
        confirmUser: result.confirmUser,
        confirmDate: result.confirmDate,
        generatedCode: result.generatedCode,
        isMigrated: result.isMigrated,
        migratedId: result.migratedId,
        migrateDate: result.migrateDate,
        is_gone: result.is_gone,
        done_needs_count: result.done_needs_count,
        spent_credit: result.spent_credit.firstName_translations,
        firstName_translations: result.firstName_translations,
        sayname_translations: result.sayname_translations,
        bio_translations: result.bio_translations,
        bio_summary_translations: result.bio_summary_translations,
        lastName_translations: result.lastName_translations,
        gender: result.gender,
        child_id: result.child_id,
        logoUrl: result.logoUrl,
      });
    }
  }, [dispatch, result, userInfo]);

  const handleChangeActive = () => {
    if (activeChecked && result.isActive) {
      dispatch(updateChildIsActive(result.id, 'deactivate'));
    } else if (!activeChecked && !result.isActive) {
      dispatch(updateChildIsActive(result.id, 'activate'));
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter your first name'),
    country: Yup.string().required('Please enter your country'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    postalAddress: Yup.string().required('Please enter your postalAddress'),
    emailAddress: Yup.string()
      // .min(3, 'must be at least 3 characters long')
      .email('Please enter your email')
      .required('Email is required'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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
        logoUrl: finalImageFile,
      }),
    );
    dispatch({ type: CHILD_BY_ID_RESET });
  };

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageDialog(true);
  };
  const handleImageClose = () => {
    setOpenImageDialog(false);
  };

  const handleIdImageClose = () => {
    setOpenIdImageDialog(false);
  };

  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleChangeInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <PageContainer title="CHILD Edit" description="this is CHILD Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!id || loadingChildById || loadingChildUpdate ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <>
            <Breadcrumb title="Edit page" subtitle="Child" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
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
                      alt="user photo"
                      sx={{ width: 110, height: 110 }}
                      src={
                        finalImageFile
                          ? URL.createObjectURL(finalImageFile) // image preview
                          : values.logoUrl
                      }
                    />
                  </Badge>

                  <Typography variant="h2" sx={{ mt: 4 }}>
                    {result && `${result.name}`}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isActive"
                        variant="outlined"
                        defaultValue={result.isActive}
                        checked={activeChecked}
                        onChange={handleChangeActive}
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
                          {t('child.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('child.emailAddress')}
                  </Typography>
                  <Typography variant="body2">{result && result.emailAddress}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    {t('child.phoneNumber')}
                  </Typography>
                  <Typography variant="body2">{result && result.phoneNumber}</Typography>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('child.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="generatedCode">
                      {' '}
                      {t('child.generatedCode')}
                    </CustomFormLabel>
                    <TextField
                      required
                      id="generatedCode"
                      variant="outlined"
                      defaultValue={result.generatedCode}
                      fullWidth
                      size="small"
                      onChange={handleChangeInput('generatedCode')}
                      control={control}
                      {...register('generatedCode')}
                      error={!!errors.generatedCode}
                    />
                    <CustomFormLabel htmlFor="birthDate">{t('child.birthDate')}</CustomFormLabel>
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
                    <CustomFormLabel htmlFor="Email">{t('child.emailAddress')}</CustomFormLabel>
                    <TextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.emailAddress}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('emailAddress')}
                      control={control}
                      {...register('emailAddress')}
                      error={!!errors.emailAddress}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.emailAddress && errors.emailAddress.message}
                    </FormHelperText>

                    <CustomFormLabel htmlFor="country">{t('child.country')}</CustomFormLabel>
                    <CustomSelect
                      labelId="country-controlled-open-select-label"
                      id="country-controlled-open-select"
                      defaultValue={1}
                      onChange={handleChangeInput('country')}
                      control={control}
                      register={{ ...register('country') }}
                    >
                      <MenuItem value={result.country || 1}>{t('child.countries.one')}</MenuItem>
                    </CustomSelect>
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.country && errors.country.message}
                    </FormHelperText>
                    <CustomFormLabel htmlFor="city">{t('child.city')}</CustomFormLabel>
                    <CustomSelect
                      labelId="city-controlled-open-select-label"
                      id="city-controlled-open-select"
                      defaultValue={result.city || 1}
                      onChange={handleChangeInput('city')}
                      control={control}
                      register={{ ...register('city') }}
                    >
                      <MenuItem value={1}>{t('child.cities.one')}</MenuItem>
                    </CustomSelect>

                    <CustomFormLabel htmlFor="postalAddress">
                      {t('child.postalAddress')}
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
                      onChange={handleChangeInput('postalAddress')}
                      control={control}
                      register={{ ...register('postalAddress') }}
                    />
                    <CustomFormLabel htmlFor="phoneNumber">
                      {t('child.phoneNumber')}
                    </CustomFormLabel>
                    <TextField
                      id="phoneNumber"
                      variant="outlined"
                      defaultValue={result.phoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('phoneNumber')}
                      control={control}
                      {...register('phoneNumber')}
                      error={!!errors.phoneNumber}
                    />
                    <LoadingButton
                      // loading={loadingChildUpdate}
                      color="primary"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      variant="contained"
                      sx={{ mt: 4 }}
                    >
                      {t('child.button.update')}
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
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
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
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            {/* Social Worker ID Image */}
            <Dialog
              open={openIdImageDialog}
              onClose={handleIdImageClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.name} ${result.lastName}`}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleImageClose}>Close</Button>
              </DialogActions>
            </Dialog>
            <Grid>
              {(successChildUpdate || errorChildUpdate) && (
                <Message
                  severity={successChildUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addChild"
                  backError={errorChildUpdate}
                  sx={{ width: '100%' }}
                >
                  {successChildUpdate && t('child.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default ChildrenEdit;
