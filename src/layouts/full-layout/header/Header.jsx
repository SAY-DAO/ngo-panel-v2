import React, { useState, useEffect, useContext } from 'react';
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
  Badge,
  Chip,
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
import { RolesEnum } from '../../../utils/types';
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
import {
  CHILDREN_BY_NGO_RESET,
  CHILD_ACTIVE_LIST_RESET,
  CHILD_BY_ID_RESET,
  CHILD_LIST_RESET,
} from '../../../redux/constants/childrenConstants';
import { fetchTicketList, openTicketing } from '../../../redux/actions/ticketAction';
import { UPDATE_TICKET_COLOR_RESET } from '../../../redux/constants/ticketConstants';
import FullScreenDialog from '../../../components/dialogs/FullScreenDialog';
import NotificationDropdown from './NotificationDropdown';
import { socketHttp, WebsocketContext } from '../../../contexts/WebsocketContext';

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [unReads, setUnReads] = useState();
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [anchorNotify, setAnchorNotify] = useState(null);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);

  const swDetails = useSelector((state) => state.swDetails);
  const {
    swInfo,
    loading: loadingSwDetails,
    success: successSwDetails,
    error: errorSwDetails,
  } = swDetails;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { loading: loadingNgoList, success: successNgoList } = ngoAll;

  const userLogin = useSelector((state) => state.userLogin);
  const { success: successLogin } = userLogin;

  const myTickets = useSelector((state) => state.myTickets);
  const {
    tickets,
    isTicketingOpen,
    loading: loadingTicketList,
    success: successTicketList,
  } = myTickets;

  useEffect(() => {
    if (!successTicketList && !loadingTicketList) {
      dispatch(fetchTicketList());
    }
  }, [successTicketList]);

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
    if (!successSwDetails && !loadingSwDetails) {
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
  }, [successSwDetails, successNgoList, loadingNgoList, successLogin, location]);

  // if not active log out
  useEffect(() => {
    if (successSwDetails && !swInfo.isActive) {
      dispatch(logout());
    }
  }, [successSwDetails]);

  const socket = useContext(WebsocketContext);

  // socket receiver
  useEffect(() => {
    if (swInfo) {
      socket.on('connect', () => {
        console.log('Connected!');
      });
      socket.on(`onUnReadTickets${swInfo.id}`, ({ ...data }) => {
        console.log('onUnReadTickets received!');
        let myList = [];
        console.log(data);
        for (let i = 0; i < data.newTickets.length; i++) {
          const ticket = tickets.find((tik) => tik.id === data.newTickets[i].id);
          myList = [...myList, ticket];
        }
        setUnReads(myList);
        return () => {
          console.log('Server-Off');
          socket.off('connect');
          socket.off(`onUnReadTickets${swInfo.id}`);
        };
      });
    }
  }, [anchorNotify, swInfo]);

  const checkNotifications = () => {
    // socket emits
    socketHttp.emit('ticketNotifications', { flaskUserId: swInfo.id });
    console.log('emitted ticket notification update!');
  };

  useEffect(() => {
    if (swInfo && tickets)
      // socket emits
      setInterval(checkNotifications, 15000);
  }, [swInfo, tickets]);

  const handleClickNotify = (event) => {
    setAnchorNotify(event.currentTarget);
    checkNotifications();
  };

  const handleClickProfile = (event) => {
    setAnchorProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorProfile(null);
  };
  const handleDrawerClose2 = () => {
    setShowSearchDrawer(false);
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

  const handleCloseNotifies = () => {
    setAnchorNotify(null);
  };
  const handleOpenTicketing = () => {
    handleCloseNotifies();
    dispatch({ type: UPDATE_TICKET_COLOR_RESET });
    dispatch(openTicketing(true));
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
          aria-label="show search"
          color="inherit"
          aria-controls="search-menu"
          aria-haspopup="true"
          onClick={() => setShowSearchDrawer(true)}
          size="large"
        >
          <FeatherIcon icon="search" width="20" height="20" />
        </IconButton>
        {/* <Alert severity="warning">
          <Typography variant="body2">
            <strong>{t('alert.title')} </strong>— {t('alert.body')}
          </Typography>
        </Alert> */}
        <Drawer
          anchor="top"
          open={showSearchDrawer}
          onClose={() => setShowSearchDrawer(false)}
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
        {/* Messages Dropdown */}
        {/* ------------------------------------------- */}
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          onClick={handleClickNotify}
        >
          <Badge color="secondary" badgeContent={unReads && unReads.length}>
            <FeatherIcon icon="message-square" width="20" height="20" />
          </Badge>
        </IconButton>
        <Menu
          id="msgs-menu"
          anchorEl={anchorNotify}
          keepMounted
          open={Boolean(anchorNotify)}
          onClose={handleCloseNotifies}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
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
                {t('profile.message.messages')}
              </Typography>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Chip
                  size="small"
                  label={`${unReads && unReads.length} ${t('ticket.new')}`}
                  sx={{
                    borderRadius: '6px',
                    pl: '5px',
                    pr: '5px',
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    color: '#fff',
                  }}
                />
              </Box>
            </Box>
          </Box>
          <NotificationDropdown unReads={unReads} />
          <Button
            sx={{
              mt: 2,
              display: 'block',
              width: '100%',
            }}
            variant="outlined"
            color="primary"
            onClick={handleOpenTicketing}
          >
            {t('profile.message.more')}
          </Button>
        </Menu>
        {/* ------------------------------------------- */}
        {/* End Messages Dropdown */}
        {/* ------------------------------------------- */}
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
        <Button
          aria-label="menu"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClickProfile}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              src={swInfo && swInfo.avatarUrl}
              alt="Social worker avatar"
              sx={{
                width: '30px',
                height: '30px',
                backgroundColor: (theme) => theme.palette.background.ripple,
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
          anchorEl={anchorProfile}
          keepMounted
          open={Boolean(anchorProfile)}
          onClose={handleCloseProfile}
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
      {isTicketingOpen && <FullScreenDialog />}
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
