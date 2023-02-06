import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Menu,
  Typography,
  Avatar,
  Button,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import PropTypes from 'prop-types';
// Dropdown Component
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ProfileDropdown from './ProfileDropdown';
import LogoIcon from '../logo/LogoIcon';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import { logout } from '../../../redux/actions/userAction';
import { fetchSocialWorkerDetails } from '../../../redux/actions/socialWorkerAction';
import { SW_DETAILS_RESET, SW_LIST_RESET } from '../../../redux/constants/socialWorkerConstants';
import { RolesEnum } from '../../../utils/helpers';
import {
  CHILDREN_ADD,
  DAO_HOME,
  MILESTONE_ADD,
  MILESTONE_LIST,
  NGO_LIST,
  NEED_EDIT,
  PROFILE_VIEW,
  NEED_ADD,
  PROVIDER_LIST,
  SW_LIST,
} from '../../../routes/RouteConstants';
import { fetchNgoList } from '../../../redux/actions/ngoAction';
import {
  ALL_NEEDS_RESET,
  ALL_REPORT_NEEDS_RESET,
  CHILD_NEEDS_RESET,
  CHILD_ONE_NEED_RESET,
} from '../../../redux/constants/needConstant';
import { MY_PAGE_RESET } from '../../../redux/constants/userConstants';
import { NGO_BY_ID_RESET, NGO_LIST_RESET } from '../../../redux/constants/ngoConstants';
import { CHILDREN_BY_NGO_RESET, CHILD_ACTIVE_LIST_RESET, CHILD_BY_ID_RESET, CHILD_LIST_RESET } from '../../../redux/constants/childrenConstants';

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, loading: loadingswDetails, success: successSwDetails, error: errorSwDetails } = swDetails;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { loading: loadingNgoList, success: successNgoList } = ngoAll;

  const userLogin = useSelector((state) => state.userLogin);
  const { success: successLogin } = userLogin;

  // do not let non admin user to navigate to the folloing pages
  useEffect(() => {
    if (swInfo && swInfo.typeId !== RolesEnum.ADMIN && swInfo.typeId !== RolesEnum.SUPER_ADMIN) {
      if (
        location.pathname === DAO_HOME ||
        location.pathname === SW_LIST ||
        location.pathname === PROVIDER_LIST ||
        location.pathname === NGO_LIST ||
        location.pathname === CHILDREN_ADD ||
        location.pathname === MILESTONE_LIST ||
        location.pathname === MILESTONE_ADD
      ) {
        navigate(PROFILE_VIEW);
      }
      console.log(location.pathname);
    }
  }, [swInfo, location]);

  useEffect(() => {
    if (!successLogin) {
      navigate('/auth/login');
    }
    if (errorSwDetails && errorSwDetails.status === 403) {
      navigate('/auth/login');
    }
  }, [successLogin, location, errorSwDetails]);

  useEffect(() => {
    if (!successSwDetails && !loadingswDetails) {
      dispatch(fetchSocialWorkerDetails());
    }
    if (
      location.pathname !== PROFILE_VIEW &&
      location.pathname !== NEED_EDIT &&
      location.pathname !== NEED_ADD
    ) {
      if (
        !successNgoList &&
        !loadingNgoList &&
        swInfo &&
        (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN)
      ) {
        dispatch(fetchNgoList());
      }
    }
  }, [successSwDetails, successNgoList, loadingNgoList,successLogin, location]);

  // if not active log out
  useEffect(() => {
    if (successSwDetails && !swInfo.isActive) {
      dispatch(logout());
    }
  }, [successSwDetails]);

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  // 4
  const [anchorEl4, setAnchorEl4] = useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const handleLogOut = () => {
    dispatch({ type: SW_DETAILS_RESET });
    dispatch({ type: CHILD_ONE_NEED_RESET });
    dispatch({ type: ALL_NEEDS_RESET });
    dispatch({ type: MY_PAGE_RESET });
    dispatch({ type: ALL_REPORT_NEEDS_RESET });
    dispatch({ type: NGO_BY_ID_RESET });
    dispatch({ type: NGO_LIST_RESET });
    dispatch({ type: CHILDREN_BY_NGO_RESET });
    dispatch({ type: CHILD_ACTIVE_LIST_RESET });
    dispatch({ type: CHILD_LIST_RESET });
    dispatch({ type: SW_LIST_RESET });
    dispatch({ type: CHILD_BY_ID_RESET });
    dispatch({ type: CHILD_NEEDS_RESET });
    dispatch(logout());
  };

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar>
        {mdUp ? <LogoIcon /> : ''}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: 'flex',
              xs: 'none',
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          aria-controls="search-menu"
          aria-haspopup="true"
          onClick={() => setShowDrawer2(true)}
          size="large"
        >
          <FeatherIcon icon="search" width="20" height="20" />
        </IconButton>
        {/* <Alert severity="info">
          <Typography variant="body2">
            <strong>{t('alert.title')} </strong>— {t('alert.body')}
          </Typography>
        </Alert> */}
        <Drawer
          anchor="top"
          open={showDrawer2}
          onClose={() => setShowDrawer2(false)}
          sx={{
            '& .MuiDrawer-paper': {
              padding: '15px 30px',
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <CustomTextField
              id="tb-search"
              size="small"
              placeholder="Search here"
              fullWidth
              inputProps={{ 'aria-label': 'Search here' }}
            />
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <IconButton
                color="inherit"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                }}
                onClick={handleDrawerClose2}
              >
                <FeatherIcon icon="x-circle" />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />

        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
        <Button
          aria-label="menu"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClick4}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              src={swInfo && swInfo.avatarUrl}
              alt="Social worker avatar"
              sx={{
                width: '30px',
                height: '30px',
              }}
            />
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                alignItems: 'center',
              }}
            >
              <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ ml: 1 }}>
                {t('profile.settings.hi')},
              </Typography>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  ml: 1,
                }}
              >
                {swInfo && swInfo.firstName}
              </Typography>
              <FeatherIcon icon="chevron-down" width="20" height="20" />
            </Box>
          </Box>
        </Button>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl4}
          keepMounted
          open={Boolean(anchorEl4)}
          onClose={handleClose4}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                {t('profile.settings.title')}
              </Typography>
            </Box>
          </Box>

          <ProfileDropdown />
          <Link
            style={{
              textDecoration: 'none',
            }}
            to="/auth/login"
          >
            <LoadingButton
              onClick={handleLogOut}
              sx={{
                mt: 2,
                display: 'block',
                width: '100%',
              }}
              variant="contained"
              color="primary"
            >
              {t('profile.settings.logOut')}
            </LoadingButton>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
