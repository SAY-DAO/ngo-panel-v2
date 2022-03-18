import React, { useEffect } from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { fetchSocialWorkerById, updateSwIsActive } from '../../redux/actions/socialWorkerAction';

const SocialWorkerProfileEdit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const swById = useSelector((state) => state.swById);
  const { result, loading: loadingSwById, success: successSwById } = swById;

  const swStatus = useSelector((state) => state.swStatus);
  const { status } = swStatus;

  useEffect(() => {
    dispatch(fetchSocialWorkerById(id));
  }, [dispatch, status]);

  useEffect(() => {
    console.log(result);
    if (result && result.isActive) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [successSwById]);

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 62,
    height: 62,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    if (checked && result.isActive) {
      dispatch(updateSwIsActive(result.id, 'deactivate'));
    } else if (!checked && !result.isActive) {
      dispatch(updateSwIsActive(result.id, 'activate'));
    }
  };
  return (
    <PageContainer title="Customer Edit" description="this is Customer Edit page">
      {loadingSwById ? (
        <CircularProgress />
      ) : (
        result && (
          <>
            <Breadcrumb title="Edit page" subtitle="Customer" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Button onClick={handleClickOpen}>
                        <SmallAvatar
                          alt="ID card"
                          src={result.idCardUrl}
                          sx={{ boxShadow: '3px 4px #888888' }}
                        />
                      </Button>
                    }
                  >
                    <Avatar
                      alt="photo"
                      src={result && result.avatarUrl}
                      sx={{ width: 110, height: 110 }}
                    />
                  </Badge>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {result && `${result.firstName} ${result.lastName}`}
                  </Typography>
                  <Typography variant="body2"> {result && result.typeName}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={userInfo.id === result.id}
                        id="isActive"
                        variant="outlined"
                        defaultValue={result.isActive}
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        label="hi"
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
                                : result.status === 'Pending'
                                ? (theme) => theme.palette.warning.main
                                : result.status === 'Completed'
                                ? (theme) => theme.palette.primary.main
                                : result.status === 'Cancel'
                                ? (theme) => theme.palette.error.main
                                : (theme) => theme.palette.secondary.main,
                            borderRadius: '100%',
                            height: '10px',
                            width: '10px',
                          }}
                        />
                        <Typography sx={{ display: 'inline-block' }}>
                          {t('socialWorker.isActive')}
                        </Typography>
                      </Grid>
                    }
                  />

                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2">{result && result.email}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body2">{result && result.phoneNumber}</Typography>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    Edit Details
                  </Typography>
                  <form>
                    <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel>
                    <CustomTextField
                      id="firstName"
                      variant="outlined"
                      defaultValue={result.firstName}
                      fullWidth
                      size="small"
                    />
                    <CustomFormLabel htmlFor="lastName">Last Name</CustomFormLabel>
                    <CustomTextField
                      id="lastName"
                      variant="outlined"
                      defaultValue={result.lastName}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="Email">Email</CustomFormLabel>
                    <CustomTextField
                      id="Email"
                      variant="outlined"
                      defaultValue={result.email}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
                    <CustomFormLabel htmlFor="country">Country</CustomFormLabel>
                    <CustomTextField
                      id="country"
                      variant="outlined"
                      defaultValue={result.country}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="city">City</CustomFormLabel>
                    <CustomTextField
                      id="city"
                      variant="outlined"
                      defaultValue={result.city}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="postalAddress">Address</CustomFormLabel>
                    <CustomTextField
                      id="postalAddress"
                      variant="outlined"
                      defaultValue={result.postalAddress}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="birthDate">birthDate</CustomFormLabel>
                    <CustomTextField
                      id="birthDate"
                      variant="outlined"
                      defaultValue={result.birthDate}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="telegramId">telegramId</CustomFormLabel>
                    <CustomTextField
                      id="telegramId"
                      variant="outlined"
                      defaultValue={result.telegramId}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="idNumber">idNumber</CustomFormLabel>
                    <CustomTextField
                      id="idNumber"
                      variant="outlined"
                      defaultValue={result.idNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="typeId">typeId</CustomFormLabel>
                    <CustomTextField
                      id="typeId"
                      variant="outlined"
                      defaultValue={result.typeId}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="gender">gender</CustomFormLabel>
                    <CustomTextField
                      id="gender"
                      variant="outlined"
                      defaultValue={result.gender}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="phoneNumber">phoneNumber</CustomFormLabel>
                    <CustomTextField
                      id="phoneNumber"
                      variant="outlined"
                      defaultValue={result.phoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="emergencyPhoneNumber">
                      emergencyPhoneNumber
                    </CustomFormLabel>
                    <CustomTextField
                      id="emergencyPhoneNumber"
                      variant="outlined"
                      defaultValue={result.emergencyPhoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="username">username</CustomFormLabel>
                    <CustomTextField
                      id="username"
                      variant="outlined"
                      defaultValue={result.username}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <Button color="primary" variant="contained">
                      Update
                    </Button>
                  </form>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {result && `${result.firstName} ${result.lastName}`}
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'scroll',
                    width: 400,
                    height: 300,
                    backgroundColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                >
                  <img
                    alt="social worker ID"
                    src={result.idCardUrl}
                    style={{
                      position: 'absolute',
                      padding: '2px',
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )
      )}
    </PageContainer>
  );
};

export default SocialWorkerProfileEdit;
