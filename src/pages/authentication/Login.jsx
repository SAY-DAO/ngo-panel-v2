import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, FormGroup, FormControlLabel } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';
import backImage from '../../assets/images/login/intro.png';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { login } from '../../redux/actions/userAction';
import Message from '../../components/Message';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search
    ? // eslint-disable-next-line no-restricted-globals
      location.search.split('redirect=')[1]
    : '/';

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: loadingLogin, error: errorLogin, success: successLogin } = userLogin;

  useEffect(() => {
    if (successLogin) {
      navigate(`/${redirect}`);
    }
  }, [redirect, successLogin]);

  // loading button
  useEffect(() => {
    if (loadingLogin) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingLogin]);

  // // disable button
  useEffect(() => {
    if (!email || !password) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [email, password, successLogin]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  return (
    <PageContainer title="Login" description="this is Login page">
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
                src={backImage}
                alt="bg"
                style={{
                  width: '70%',
                  maxWidth: '812px',
                }}
              />
            </Box>

            <Box
              sx={{
                p: 4,
                position: 'absolute',
                top: '0',
              }}
            >
              <LogoIcon />
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
                <Typography fontWeight="700" variant="h2">
                  Welcome to SAY Social Gateway
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="500"
                    sx={{
                      mr: 1,
                    }}
                  >
                    Do not have an account?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/register"
                    fontWeight="500"
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Create an account
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleChangeEmail}
                    variant="outlined"
                    fullWidth
                  />
                  <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    variant="outlined"
                    fullWidth
                    sx={{
                      mb: 3,
                    }}
                  />
                  <Box
                    sx={{
                      display: {
                        xs: 'block',
                        sm: 'flex',
                        lg: 'flex',
                      },
                      alignItems: 'center',
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<CustomCheckbox defaultChecked />}
                        label="Remeber this Device"
                        sx={{
                          mb: 2,
                        }}
                      />
                    </FormGroup>
                    <Box
                      sx={{
                        ml: 'auto',
                      }}
                    >
                      <Typography
                        component={Link}
                        to="/auth/reset-password"
                        fontWeight="500"
                        sx={{
                          display: 'block',
                          textDecoration: 'none',
                          mb: '16px',
                          color: 'primary.main',
                        }}
                      >
                        Forgot Password ?
                      </Typography>
                    </Box>
                  </Box>

                  <LoadingButton
                    disabled={isDisabled}
                    loading={isLoading}
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      pt: '10px',
                      pb: '10px',
                    }}
                    onClick={handleLogin}
                  >
                    Sign In
                  </LoadingButton>
                </Box>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {errorLogin && (
                    <Message backError={errorLogin} variant="standard" severity="error" />
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
