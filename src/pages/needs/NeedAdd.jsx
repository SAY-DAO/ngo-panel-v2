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
import { updateNeed, fetchExampleNeeds } from '../../redux/actions/needsAction';
import { CHILD_ONE_NEED_RESET } from '../../redux/constants/needConstant';
import { fetchChildList, fetchMyChildById } from '../../redux/actions/childrenAction';

const BCrumb = [
  {
    to: '/need/list',
    title: 'Needs List',
  },
  {
    title: 'Add',
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

const NeedAdd = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();

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
  const [values, setValues] = React.useState({
    name: '',
  });
  const needAdd = useSelector((state) => state.needAdd);
  const { success: successAddNeed, loading: loadingAddNeed, error: errorAddNeed } = needAdd;

  const childById = useSelector((state) => state.childById);
  const { result, loading: loadingChild, success: successChild } = childById;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren, loading: loadingChildren, success: successChildren } = childAll;

  const childExampleNeeds = useSelector((state) => state.childExampleNeeds);
  const { exampleNeeds, success: successNeedEx } = childExampleNeeds;

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
      // sort myChildren
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

  useEffect(() => {
    if (successNeedEx && theNeed) {
      setValues({
        ...values,
        name: theNeed.name,
      });
    }
  }, [successNeedEx, theNeed]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter needs name'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: values.name,
    },
    mode: 'onChange',
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
                      <CustomFormLabel htmlFor="name">Need Name</CustomFormLabel>
                      <TextField
                        required
                        id="name"
                        variant="outlined"
                        fullWidth
                        size="small"
                        control={control}
                        value={values.name}
                        {...register('name')}
                        error={!!errors.name}
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
