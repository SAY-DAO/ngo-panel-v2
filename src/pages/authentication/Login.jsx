import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Link as Link2,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';
import backImage from '../../resources/images/login/intro.png';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { login } from '../../redux/actions/userAction';
import Message from '../../components/Message';
import { fetchSocialWorkerDetails } from '../../redux/actions/socialWorkerAction';
import { CHILDREN_LIST, HOME } from '../../routes/RouteConstants';
import NgoRegisterDialog from '../../components/dialogs/NgoRegisterDialog';

const trainees = process.env.REACT_APP_TRAINEE_IDS
  ? process.env.REACT_APP_TRAINEE_IDS.split(',').map(Number)
  : [];

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [value, setValue] = useState(1);

  const userLogin = useSelector((state) => state.userLogin);
  const { loading: loadingLogin, error: errorLogin, success: successLogin } = userLogin;

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, loading: loadingSwDetails, success: successSwDetails } = swDetails;

  const redirect =
    swInfo && location.search && !trainees.includes(swInfo.id)
      ? // eslint-disable-next-line no-restricted-globals
        `/${location.search.split('redirect=')[1]}`
      : swInfo && !location.search && !trainees.includes(swInfo.id)
      ? HOME
      : CHILDREN_LIST;

  useEffect(() => {
    if (successLogin && successSwDetails) {
      navigate(`${redirect}`);
    }
  }, [redirect, successLogin, successSwDetails]);

  useEffect(() => {
    if (successLogin) {
      dispatch(fetchSocialWorkerDetails());
    }
  }, [successLogin]);

  // loading button
  useEffect(() => {
    if (loadingLogin || loadingSwDetails) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingLogin, loadingSwDetails]);

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
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
                  {t('login.title')}
                </Typography>

                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={t('login.tab1')} {...a11yProps(0)} />
                    <Tab label={t('login.tab2')} {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Box alignItems="center">
                    <Typography fontSize={13} fontWeight="300" variant="subtitle2">
                      {t('login.ngo.intro1')}
                    </Typography>
                    <Typography fontSize={13} fontWeight="300" variant="subtitle2">
                      {t('login.ngo.intro2')}.
                      <Link2
                        href="https://docs.saydao.org"
                        underline="none"
                        target="_blank"
                        sx={{ p: 1 }}
                      >
                        {t('login.ngo.intro3')}.
                      </Link2>
                    </Typography>
                    <Box sx={{ textAlign: 'center', width: '100%', mt: 2 }}>
                      <LoadingButton onClick={handleClickOpen} variant="outlined" sx={{ m: 2 }}>
                        {t('login.ngo.register')}
                      </LoadingButton>
                    </Box>
                  </Box>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <CustomFormLabel htmlFor="email"> {t('login.username')}</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleChangeEmail}
                    variant="outlined"
                    fullWidth
                  />
                  <CustomFormLabel htmlFor="password"> {t('login.password')}</CustomFormLabel>
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
                        label={t('login.remember')}
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
                        {t('login.forgotPassword')}
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
                    {t('button.login')}
                  </LoadingButton>
                </CustomTabPanel>

                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {errorLogin && (
                    <Message backError={errorLogin} variant="standard" severity="error" />
                  )}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  {modal && <NgoRegisterDialog handleClose={handleClose} open={modal} />}
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
