import React, { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SidebarWidth } from '../../../resources/global/Theme-variable';
import { Menuitems, CollaboratorItems } from './Menuitems';
import Scrollbar from '../../../components/custom-scroll/Scrollbar';
import { FlaskUserTypesEnum } from '../../../utils/types';
import collaborators from '../../../utils/temp';

const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const { pathname } = useLocation();

  const [myMenuItems, setMyMenuItems] = useState('');
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const CustomizerReducer = useSelector((state) => state.CustomizerReducer);
  const { activeDir } = CustomizerReducer;

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  useEffect(() => {
    if (swInfo) {
      if (collaborators.includes(swInfo.id)) {
        setMyMenuItems(CollaboratorItems);
      } else if (
        swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN
      ) {
        setMyMenuItems(Menuitems);
      } else {
        const adminMenuitems = Menuitems.filter((m) => m.admin === false);
        setMyMenuItems(adminMenuitems);
      }
    }
  }, [Menuitems, swInfo]);

  const SidebarContent = (
    <Scrollbar style={{ height: 'calc(100vh - 5px)' }}>
      <Box sx={{ p: 2 }}>
        <Box>
          <List>
            {myMenuItems &&
              myMenuItems.map((item, index) => {
                // {/********SubHeader**********/}
                if (item.subheader) {
                  return (
                    <li key={item.subheader}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="500"
                        sx={{ my: 2, mt: 0, opacity: '0.4' }}
                      >
                        {t(item.subheader)}
                      </Typography>
                    </li>
                  );
                  // {/********If Sub Menu**********/}
                  /* eslint no-else-return: "off" */
                } else if (item.children) {
                  return (
                    <React.Fragment key={item.title}>
                      <ListItem
                        button
                        component="li"
                        onClick={() => handleClick(index)}
                        selected={pathWithoutLastPart === item.href}
                        sx={{
                          mb: 1,
                          ...(pathWithoutLastPart === item.href && {
                            color: 'white',
                            backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ...(pathWithoutLastPart === item.href && {
                              color: 'white',
                            }),
                          }}
                        >
                          {typeof item.icon === 'string' ? (
                            <FeatherIcon icon={item.icon} width="20" height="20" />
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        <ListItemText
                          sx={{
                            '&.MuiListItemText-root': {
                              '&	.MuiListItemText-primary': {
                                fontWeight: 800,
                              },
                            },
                          }}
                        >
                          {t(item.title)}
                        </ListItemText>
                        {index === open || pathWithoutLastPart === item.href ? (
                          <FeatherIcon icon="chevron-down" size="16" />
                        ) : (
                          <FeatherIcon
                            icon={activeDir === 'rtl' ? 'chevron-left' : 'chevron-right'}
                            size="16"
                          />
                        )}
                      </ListItem>
                      <Collapse in={index === open} timeout="auto" unmountOnExit>
                        {swInfo === FlaskUserTypesEnum.ADMIN ||
                        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN ? (
                          <List component="li" disablePadding>
                            {item.children.map((child) => {
                              return (
                                <ListItem
                                  key={child.title}
                                  button
                                  component={NavLink}
                                  to={child.href}
                                  onClick={onSidebarClose}
                                  selected={pathDirect === child.href}
                                  sx={{
                                    mb: 1,
                                    ...(pathDirect === child.href && {
                                      color: 'primary.main',
                                      backgroundColor: 'transparent!important',
                                    }),
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      svg: { width: '16px', marginLeft: '3px' },
                                      ...(pathDirect === child.href && {
                                        color: 'primary.main',
                                      }),
                                    }}
                                  >
                                    {typeof child.icon === 'string' ? (
                                      <FeatherIcon icon={child.icon} width="20" height="20" />
                                    ) : (
                                      child.icon
                                    )}
                                  </ListItemIcon>
                                  <ListItemText
                                    sx={{
                                      '&.MuiListItemText-root': {
                                        '&	.MuiListItemText-primary': {
                                          fontSize: '0.8rem !important',
                                        },
                                      },
                                    }}
                                  >
                                    {t(child.title)}
                                  </ListItemText>
                                </ListItem>
                              );
                            })}
                          </List>
                        ) : (
                          <List component="li" disablePadding>
                            {item.children
                              .filter((c) => !c.admin)
                              .map((child) => {
                                return (
                                  <ListItem
                                    key={child.title}
                                    button
                                    component={NavLink}
                                    to={child.href}
                                    onClick={onSidebarClose}
                                    selected={pathDirect === child.href}
                                    sx={{
                                      mb: 1,
                                      ...(pathDirect === child.href && {
                                        color: 'primary.main',
                                        backgroundColor: 'transparent!important',
                                      }),
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        svg: { width: '16px', marginLeft: '3px' },
                                        ...(pathDirect === child.href && {
                                          color: 'primary.main',
                                        }),
                                      }}
                                    >
                                      {typeof child.icon === 'string' ? (
                                        <FeatherIcon icon={child.icon} width="20" height="20" />
                                      ) : (
                                        child.icon
                                      )}
                                    </ListItemIcon>
                                    <ListItemText
                                      sx={{
                                        '&.MuiListItemText-root': {
                                          '&	.MuiListItemText-primary': {
                                            fontSize: '0.8rem !important',
                                          },
                                        },
                                      }}
                                    >
                                      {t(child.title)}
                                    </ListItemText>
                                  </ListItem>
                                );
                              })}
                          </List>
                        )}
                      </Collapse>
                    </React.Fragment>
                  );
                  // {/********If Sub No Menu**********/}
                } else {
                  return (
                    <List component="li" disablePadding key={item.title}>
                      <ListItem
                        onClick={() => handleClick(index)}
                        button
                        component={NavLink}
                        to={item.href}
                        selected={pathDirect === item.href}
                        sx={{
                          mb: 1,
                          ...(pathDirect === item.href && {
                            color: 'white',
                            backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                          }),
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ...(pathDirect === item.href && { color: 'white' }),
                          }}
                        >
                          {typeof item.icon === 'string' ? (
                            <FeatherIcon icon={item.icon} width="20" height="20" />
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        <ListItemText
                          onClick={onSidebarClose}
                          sx={{
                            '&.MuiListItemText-root': {
                              '&	.MuiListItemText-primary': {
                                fontWeight: 800,
                              },
                            },
                          }}
                        >
                          {t(item.title)}
                        </ListItemText>
                      </ListItem>
                    </List>
                  );
                }
              })}
          </List>
        </Box>
      </Box>
    </Scrollbar>
  );
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: SidebarWidth,
            top: lgUp ? '100px' : '0px',
            left: lgUp ? '30px' : '',
            borderRadius: lgUp ? '9px' : '0',
            border: '0',
            height: 'calc(100vh - 130px)',
            boxShadow: '0px 7px 30px 0px rgb(90 114 123 / 11%)',
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
          border: '0 !important',
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default Sidebar;
