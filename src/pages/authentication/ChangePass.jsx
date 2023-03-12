import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import img1 from '../../assets/images/backgrounds/login-bg.svg';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
// import Message from '../../components/Message';
import PageContainer from '../../components/container/PageContainer';

// import { changePassword } from '../../redux/actions/userAction';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

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
    console.log('I am clicked');
    console.log(currentPass, newPass, confirmNewPass);
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
                    onChange={handleChangeConfirmNewPass}
                    value={confirmNewPass}
                    variant="outlined"
                    fullWidth
                  />

                  <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    onClick={handleChangePass}
                    sx={{
                      pt: '10px',
                      pb: '10px',
                      mt: 4,
                    }}
                  >
                    {t('profile.settings.changePass')}
                  </Button>
                </Box>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {/* {errorLogin && (
                    <Message backError={errorLogin} variant="standard" severity="error" />
                  )} */}
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
