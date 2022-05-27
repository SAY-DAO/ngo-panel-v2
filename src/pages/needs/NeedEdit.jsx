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
  FormHelperText,
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
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import UploadIdImage from '../../components/UploadImage';
import { fetchChildOneNeed, updateNeed } from '../../redux/actions/needsAction';
import { CHILD_ONE_NEED_RESET } from '../../redux/constants/needConstant';
import { fetchChildList } from '../../redux/actions/childrenAction';

const BCrumb = [
  {
    to: '/need/list',
    title: 'Needs List',
  },
  {
    title: 'Edit',
  },
];
// child_id *
// sw_id
// imageUrl
// name_translations  name_fa name_en
// description_translations desc_fa desc_en
// category *
// isUrgent *
// cost *
// type *
// link
// affiliateLinkUrl
// doing_duration
// details
// informations

// "name": "Need Name",
// "cost": "Cost",
// "link": "Link",
// "affiliateLinkUrl": "Aff. Link",
// "type_name": "Type",
// "isUrgent": "Urgent",
// "information": "Additional Info",
// "details": "Social Worker Notes",
// "category": "Category",
// "description": "Description",
// "created": "Created At",
// "isConfirmed": "Confirm",
// "confirmUser": "Confirmed By",
// "confirmDate": "Confirmed At",
// "updated": " Last Edit",
// "doneAt": "Done At",
// "child_delivery_date": "Delivery To Child"

const NeedEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

  const [openChildren, setOpenChildren] = useState(false);
  const [optionsChildren, setOptionsChildren] = useState([]);
  const loaded = openChildren && optionsChildren.length === 0;
  const [childId, setChildId] = useState();

  const [finalImageFile, setFinalImageFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    phoneNumber: '',
    emergencyPhoneNumber: '',
    postalAddress: '',
    email: '',
    userName: '',
    telegramId: '',
    typeId: 0,
    idCardFile: '',
    idNumber: '',
    childId: '',
    avatarFile: '',
  });

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed, loading: loadingOneNeed, success: successOneNeed } = childOneNeed;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren, loading: loadingChildren, success: successChildren } = childAll;

  const swUpdate = useSelector((state) => state.swUpdate);
  const { success: successSwUpdate, loading: loadingSwUpdate, error: errorSwUpdate } = swUpdate;

  useEffect(() => {
    if (!successOneNeed && id) {
      dispatch(fetchChildOneNeed(id));
    }
  }, [id]);


  // Autocomplete myChildren
  useEffect(() => {
    let active = true;
    if (!loaded) {
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
  }, [loaded, successChildren, childId]);

  // child open
  useEffect(() => {
    console.log(openChildren)
    if (!openChildren) {
      setOptionsChildren([]);
    } else if (openChildren || !openChildren) {
      console.log('hi')
      dispatch(fetchChildList());
    }
  }, [openChildren, setOpenChildren, childId]);

  useEffect(() => {
    if (oneNeed) {
      setValues({
        ...values,
        name: oneNeed.name,
        website: oneNeed.website,
        emailAddress: oneNeed.emailAddress,
        country: oneNeed.country,
        city: oneNeed.city,
        phoneNumber: oneNeed.phoneNumber,
        postalAddress: oneNeed.postalAddress,
        logoUrl: oneNeed.logoUrl,
      });
    }
  }, [dispatch, oneNeed, userInfo]);

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
      updateNeed({
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

  const handleChangeInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  return (
    <PageContainer title="Need Edit" description="this is Need Edit page">
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
            loading={loaded}
            renderInput={(params) => (
              <TextField
                {...params}
                label="My Children"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loaded ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      {!id || loadingOneNeed || loadingSwUpdate || loadingChildren ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        oneNeed && (
          <>
            <Breadcrumb title="Edit page" subtitle="Need" />
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
                            : values.avatarFile
                        }
                      />
                    </Badge>

                    <Typography variant="h2" sx={{ mt: 4 }}>
                      {oneNeed && `${oneNeed.name}`}
                    </Typography>
                  </Grid>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    {t('socialWorker.titleEdit')}
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel>
                    <TextField
                      required
                      id="firstName"
                      variant="outlined"
                      defaultValue={oneNeed.firstName}
                      fullWidth
                      size="small"
                      onChange={handleChangeInput('firstName')}
                      control={control}
                      {...register('firstName')}
                      error={!!errors.firstName}
                    />
                    <CustomFormLabel htmlFor="lastName">
                      {t('socialWorker.lastName')}
                    </CustomFormLabel>

                    <TextField
                      id="userName"
                      variant="outlined"
                      defaultValue={oneNeed.username}
                      fullWidth
                      size="small"
                      sx={{ mb: 1 }}
                      onChange={handleChangeInput('userName')}
                      control={control}
                      {...register('userName')}
                      error={!!errors.userName}
                    />
                    <FormHelperText sx={{ color: '#e46a76' }} id="component-error-text">
                      {errors && errors.userName && errors.userName.message}
                    </FormHelperText>
                    <LoadingButton
                      loading={loadingSwUpdate}
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
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {oneNeed && `${oneNeed.firstName} ${oneNeed.lastName}`}
              </DialogTitle>
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
              {(successSwUpdate || errorSwUpdate) && (
                <Message
                  severity={successSwUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addSw"
                  backError={errorSwUpdate}
                  sx={{ width: '100%' }}
                >
                  {successSwUpdate && t('socialWorker.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default NeedEdit;
