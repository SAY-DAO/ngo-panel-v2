import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import img1 from '../../assets/images/backgrounds/login-bg.svg';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';

import PageContainer from '../../components/container/PageContainer';

const ResetPassword = () => {
  const { t } = useTranslation();
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
                  <CustomTextField id="current-pass" variant="outlined" fullWidth />

                  <CustomFormLabel htmlFor="new-pass">
                    {t('changePassword.newPassword')}
                  </CustomFormLabel>
                  <CustomTextField id="new-pass" variant="outlined" fullWidth />

                  <CustomFormLabel htmlFor="confirm-pass">
                    {t('changePassword.confirmNewPassword')}
                  </CustomFormLabel>
                  <CustomTextField id="confirm-pass" variant="outlined" fullWidth />

                  <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    to="/"
                    sx={{
                      pt: '10px',
                      pb: '10px',
                      mt: 4,
                    }}
                  >
                    {t('profile.settings.changePass')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ResetPassword;
