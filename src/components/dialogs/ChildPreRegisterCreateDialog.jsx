import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import UploadImage from '../UploadImage';
import {
  checkSimilarNames,
  adminCreatePreRegisterChild,
  fetchChildrenSayNames,
} from '../../redux/actions/childrenAction';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import { SexEnum } from '../../utils/types';
import { shuffleArray } from '../../utils/helpers';
import { CHECK_SIMILAR_NAMES_RESET } from '../../redux/constants/childrenConstants';

export default function ChildPreRegisterCreateDialog({ open, setOpen, selected, setSelected }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  const [finalAvatarFile, setFinalAvatarFile] = useState();
  const [finalSleptAvatarFile, setFinalSleptAvatarFile] = useState();
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadAvatar, setUploadAvatar] = useState(location.state && location.state.newImage);
  const [uploadSleptAvatar, setUploadSleptAvatar] = useState(
    location.state && location.state.newImage,
  );
  const [options, setOptions] = useState([]);
  const [openNames, setOpenNames] = useState(false);
  const [whatSex, setWhatSex] = useState(SexEnum.MALE);

  const childPreRegister = useSelector((state) => state.childPreRegister);
  const {
    loading: loadingAdded,
    success: successAdded,
    error: errorPreRegister,
  } = childPreRegister;

  const childNameCheck = useSelector((state) => state.childNameCheck);
  const { result, loading: loadingCheckName } = childNameCheck;

  const { result: namesResult, loading: loadingNames } = useSelector(
    (state) => state.childAllNames,
  );

  const validationSchema = Yup.object().shape({
    sayname_translations_en: Yup.string().required('Please enter the name'),
    sex: Yup.string().required('Please enter the sex'),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (openNames) {
      dispatch(fetchChildrenSayNames());
    }
  }, [openNames]);

  // when say name selected if exists
  useEffect(() => {
    if (result && result.total > 0) {
      setError('duplicate');
    }
  }, [result]);

  useEffect(() => {
    const values = getValues();
    if (selected) {
      dispatch(checkSimilarNames(selected, 'fa'));
    }
    if (values.sayname_translations_en) {
      // dispatch(checkSimilarNames(values.sayname_translations_en, 'en'));
    }
    if (values.sex) {
      setWhatSex(Number(values.sex));
    }
  }, [watch('sayname_translations_en'), selected, watch('sex')]);

  useEffect(() => {
    if (successAdded) {
      setOpen(false);
    }
  }, [successAdded]);

  useEffect(() => {
    let active = true;
    if (loadingNames) {
      return undefined;
    }
    if (namesResult) {
      (async () => {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await sleep(1e3);
        if (active) {
          setOptions([...namesResult]);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [loadingNames, namesResult && namesResult[0]]);

  const handleClose = () => {
    setSelected();
    setOpen(false);
    clearErrors();
    dispatch({ type: CHECK_SIMILAR_NAMES_RESET });
  };
  console.log(errorPreRegister);

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

  const handleRemoveAvatar = () => {
    console.log('removed not implemented...');
  };

  const onSubmit = (data) => {
    dispatch(
      adminCreatePreRegisterChild({
        awakeFile: finalAvatarFile,
        sleptFile: finalSleptAvatarFile,
        sayName: { en: data.sayname_translations_en, fa: selected },
        sex: Number(data.sex),
      }),
    );
  };
  return (
    <Grid container>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>{t('child.existence_status')}</DialogTitle>
          <DialogContent>
            <Grid container>
              {/*  Child avatar */}
              <Grid item md={6} xs={12} sx={{ m: 'auto', mr: 0 }}>
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
              <Grid item md={6} xs={12}>
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
            </Grid>
            <Grid item xs={12} container spacing={4} justifyContent="center">
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <FormControl sx={{ minWidth: '60%' }}>
                  <CustomFormLabel id="sex">{t('child.sex')}</CustomFormLabel>
                  <CustomSelect
                    labelId="sex-controlled-open-select-label"
                    id="sex"
                    control={control}
                    value={watch('sex') || SexEnum.MALE}
                    register={{ ...register('sex') }}
                    error={!!errors.sex}
                  >
                    <MenuItem value={SexEnum.FEMALE}>{t(`child.sexKind.female`)}</MenuItem>
                    <MenuItem value={SexEnum.MALE}>{t(`child.sexKind.male`)}</MenuItem>
                  </CustomSelect>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="asynchronous-names"
                  sx={{ width: '100%' }}
                  open={openNames}
                  onOpen={() => {
                    setOpenNames(true);
                  }}
                  onClose={() => {
                    setOpenNames(false);
                  }}
                  isOptionEqualToValue={(option, value) => option[0] === value[0]}
                  getOptionLabel={(option) => option[0]}
                  onChange={(e, option) => option && setSelected(option[0])}
                  options={shuffleArray(options.filter((o) => o[1] === whatSex))}
                  loading={loadingNames}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '100%' }}
                      {...params}
                      label={t('child.sayname_translations.fa')}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingNames ? <CircularProgress color="inherit" size={15} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  id="sayname_translations_en"
                  placeholder={t('child.sayname_translations.en')}
                  variant="outlined"
                  size="large"
                  control={control}
                  {...register('sayname_translations_en')}
                  error={!!errors.sayname_translations_en}
                />
              </Grid>
            </Grid>
            {result && result.total > 0 && errors && errors.duplicate && (
              <Grid item xs={8} sx={{ m: 'auto' }}>
                <Alert severity="warning" sx={{ mr: 4, ml: 4, mt: 2 }}>
                  {result.total} نام مشابه ...
                </Alert>
                <Grid container sx={{ mt: 2 }}>
                  <ul>
                    {result.found &&
                      result.found.map((name) => (
                        <Typography key={name.en} component="li">
                          {name.fa}
                        </Typography>
                      ))}
                  </ul>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={handleClose}>
              {t('button.cancel')}
            </Button>
            <LoadingButton
              disabled={
                !selected || !whatSex || (result && result.found.find((n) => n.fa === selected))
              }
              loading={loadingAdded || loadingCheckName}
              color="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {t('child.button.add')}
            </LoadingButton>
          </DialogActions>
          {errorPreRegister && <Alert severity="error">{errorPreRegister}</Alert>}
        </Dialog>
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
      </Dialog>
    </Grid>
  );
}

ChildPreRegisterCreateDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
  selected: PropTypes.any,
  setSelected: PropTypes.func,
};
