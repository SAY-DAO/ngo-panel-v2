import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import img1 from '../../assets/images/backgrounds/login-bg.svg';
import contents from '../../inputsValidation/Contents';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import PageContainer from '../../components/container/PageContainer';
import ValidatePassword from '../../inputsValidation/ValidatePassword';

import { changeUserPassword } from '../../redux/actions/userAction';

const ResetPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const changePassword = useSelector((state) => state.changePassword);
  const { loading, error } = changePassword;

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [currentPassErr, setCurrentPassErr] = useState(false);
  const [newPassErr, setNewPassErr] = useState(false);
  const [repeatPassErr, setRepeatPassErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading button
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  // Handle disable button
  useEffect(() => {
    if (!currentPass || !newPass || !confirmNewPass || newPassErr || repeatPassErr || !isValid) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [currentPass, newPass, confirmNewPass, newPassErr, repeatPassErr]);

  // Handle API error
  useEffect(() => {
    setErrorMsg('');
    setCurrentPassErr(false);
    if (error) {
      if (error.status === 400) {
        setErrorMsg(t(contents.invalidPassword));
      } else if (error.status === 600) {
        setCurrentPassErr(true);
        setErrorMsg(t(contents.wrongCurrentPassword));
      } else {
        setErrorMsg(t(contents.sthIsWrong));
      }
    }
  }, [error]);

  // Handle fields error
  useEffect(() => {
    setNewPassErr(false);
    setRepeatPassErr(false);
    if (!isValid) {
      setNewPassErr(true);
      setRepeatPassErr(true);
    }
  }, [newPass, confirmNewPass, isValid]);

  const handleChangeCurrentPass = (e) => {
    setCurrentPass(e.target.value);
  };
  const handleChangeNewPass = (e) => {
    setNewPass(e.target.value);
  };
  const handleChangeConfirmNewPass = (e) => {
    setConfirmNewPass(e.target.value);
  };
  const handleChangePass = (e) => {
    e.preventDefault();
    dispatch(changeUserPassword(currentPass, newPass));
  };

  return (
    <PageContainer title="Reset Password" description="this is Reset Password page">
      <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          sx={{
            background: (theme) => `${theme.palette.mode === 'dark' ? '#1c1f25' : '#ffffff'}`,
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                position: {
                  xs: 'relative',
                  lg: 'absolute',
                },
                height: { xs: 'auto', lg: '100vh' },
                right: { xs: 'auto', lg: '-50px' },
                margin: '0 auto',
              }}
            >
              <img
                src={img1}
                alt="bg"
                style={{
                  width: '100%',
                  maxWidth: '812px',
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={9} xl={6}>
              <Box
                sx={{
                  p: 4,
                }}
              >
                <Typography variant="h2" fontWeight="700">
                  {t('profile.settings.changePass')}
                </Typography>

                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <CustomFormLabel htmlFor="current-pass">
                    {t('changePassword.currentPassword')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="current-pass"
                    type="password"
                    error={currentPassErr}
                    onChange={handleChangeCurrentPass}
                    value={currentPass}
                    variant="outlined"
                    fullWidth
                  />

                  <CustomFormLabel htmlFor="new-pass">
                    {t('changePassword.newPassword')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="new-pass"
                    type="password"
                    error={newPassErr}
                    onChange={handleChangeNewPass}
                    value={newPass}
                    variant="outlined"
                    fullWidth
                  />

                  <CustomFormLabel htmlFor="confirm-pass">
                    {t('changePassword.confirmNewPassword')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="confirm-pass"
                    type="password"
                    error={repeatPassErr}
                    onChange={handleChangeConfirmNewPass}
                    value={confirmNewPass}
                    variant="outlined"
                    fullWidth
                  />

                  <LoadingButton
                    disabled={isDisabled}
                    loading={isLoading}
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleChangePass}
                    sx={{
                      pt: '10px',
                      pb: '10px',
                      mt: 4,
                    }}
                  >
                    {t('profile.settings.changePass')}
                  </LoadingButton>
                </Box>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {errorMsg && (
                    <Message variant="standard" severity="error">
                      {errorMsg}
                    </Message>
                  )}
                  <ValidatePassword
                    password={newPass}
                    confirmPassword={confirmNewPass}
                    setIsValid={setIsValid}
                  />
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ResetPassword;
