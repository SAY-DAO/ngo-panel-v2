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
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { fetchSocialWorkerProfile } from '../../redux/actions/socialWorkerAction';

const SocialWorkerProfileEdit = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, loading: loadingSwDetails, success: successSwDetails } = swDetails;

  useEffect(() => {
    if (!successSwDetails) {
      dispatch(fetchSocialWorkerProfile());
    }
  }, [successSwDetails]);

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

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <PageContainer title="Customer Edit" description="this is Customer Edit page">
      {loadingSwDetails ? (
        <CircularProgress />
      ) : (
        swInfo && (
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
                          src={swInfo.idCardUrl}
                          sx={{ boxShadow: '3px 4px #888888' }}
                        />
                      </Button>
                    }
                  >
                    <Avatar
                      alt="Travis Howard"
                      src={swInfo && swInfo.avatarUrl}
                      sx={{ width: 110, height: 110 }}
                    />
                  </Badge>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {swInfo && `${swInfo.firstName} ${swInfo.lastName}`}
                  </Typography>
                  <Typography variant="body2"> {swInfo && swInfo.typeName}</Typography>
                  <FormControlLabel
                    control={
                      <>
                        <Box
                          sx={{
                            backgroundColor:
                              swInfo.isActive === true
                                ? (theme) => theme.palette.success.main
                                : swInfo.status === 'Pending'
                                ? (theme) => theme.palette.warning.main
                                : swInfo.status === 'Completed'
                                ? (theme) => theme.palette.primary.main
                                : swInfo.status === 'Cancel'
                                ? (theme) => theme.palette.error.main
                                : (theme) => theme.palette.secondary.main,
                            borderRadius: '100%',
                            height: '10px',
                            width: '10px',
                          }}
                        />
                        <Switch
                          id="isActive"
                          variant="outlined"
                          defaultValue={swInfo.isActive}
                          checked={checked}
                          onChange={handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                          label="hi"
                        />
                      </>
                    }
                    label={t('socialWorker.isActive')}
                  />

                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2">{swInfo && swInfo.email}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body2">{swInfo && swInfo.phoneNumber}</Typography>
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
                      defaultValue={swInfo.firstName}
                      fullWidth
                      size="small"
                    />
                    <CustomFormLabel htmlFor="lastName">Last Name</CustomFormLabel>
                    <CustomTextField
                      id="lastName"
                      variant="outlined"
                      defaultValue={swInfo.lastName}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="Email">Email</CustomFormLabel>
                    <CustomTextField
                      id="Email"
                      variant="outlined"
                      defaultValue={swInfo.email}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    {/* ///////////////////////////////////////////////////////////////////////////////////////// */}
                    <CustomFormLabel htmlFor="country">Country</CustomFormLabel>
                    <CustomTextField
                      id="country"
                      variant="outlined"
                      defaultValue={swInfo.country}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="city">City</CustomFormLabel>
                    <CustomTextField
                      id="city"
                      variant="outlined"
                      defaultValue={swInfo.city}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="postalAddress">Address</CustomFormLabel>
                    <CustomTextField
                      id="postalAddress"
                      variant="outlined"
                      defaultValue={swInfo.postalAddress}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="birthDate">birthDate</CustomFormLabel>
                    <CustomTextField
                      id="birthDate"
                      variant="outlined"
                      defaultValue={swInfo.birthDate}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="telegramId">telegramId</CustomFormLabel>
                    <CustomTextField
                      id="telegramId"
                      variant="outlined"
                      defaultValue={swInfo.telegramId}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="idNumber">idNumber</CustomFormLabel>
                    <CustomTextField
                      id="idNumber"
                      variant="outlined"
                      defaultValue={swInfo.idNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="typeId">typeId</CustomFormLabel>
                    <CustomTextField
                      id="typeId"
                      variant="outlined"
                      defaultValue={swInfo.typeId}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="gender">gender</CustomFormLabel>
                    <CustomTextField
                      id="gender"
                      variant="outlined"
                      defaultValue={swInfo.gender}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="phoneNumber">phoneNumber</CustomFormLabel>
                    <CustomTextField
                      id="phoneNumber"
                      variant="outlined"
                      defaultValue={swInfo.phoneNumber}
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
                      defaultValue={swInfo.emergencyPhoneNumber}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="username">username</CustomFormLabel>
                    <CustomTextField
                      id="username"
                      variant="outlined"
                      defaultValue={swInfo.username}
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
                {swInfo && `${swInfo.firstName} ${swInfo.lastName}`}
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
                    src={swInfo.idCardUrl}
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
