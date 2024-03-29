import React, { useEffect, useState } from 'react';
import {
  Fab,
  Drawer,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import i18next from 'i18next';
import { useSelector, useDispatch } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';

import { setTheme, setDir, setDarkMode } from '../../../redux/actions/custumizerAction';
import CustomRadio from '../../../components/forms/custom-elements/CustomRadio';

const SidebarWidth = '320px';

const Customizer = () => {
  const { t } = useTranslation();
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state) => state.CustomizerReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (customizer.activeDir === 'ltr') {
      i18next.changeLanguage('en');
    } else {
      i18next.changeLanguage('fa');
    }
  }, [customizer]);

  const thColors = [
    {
      id: 1,
      bgColor: '#1a9bfc',
      disp: 'BLUE_THEME',
    },
    {
      id: 2,
      bgColor: '#00cec3',
      disp: 'GREEN_THEME',
    },
    {
      id: 3,
      bgColor: '#7352ff',
      disp: 'PURPLE_THEME',
    },
    {
      id: 4,
      bgColor: '#ff5c8e',
      disp: 'RED_THEME',
    },
    {
      id: 5,
      bgColor: '#1e4db7',
      disp: 'INDIGO_THEME',
    },
    {
      id: 6,
      bgColor: '#fb9678',
      disp: 'ORANGE_THEME',
    },
  ];
  return (
    <div>
      <Tooltip title="Settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: 'fixed', right: '15px', bottom: '15px' }}
          onClick={() => setShowDrawer(true)}
        >
          <FeatherIcon icon="settings" />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        <Box p={2}>
          <Typography variant="h3">{t('settings.title')}</Typography>
        </Box>
        <Divider />
        <Box p={2}>
          {/* ------------ Dark light theme setting ------------- */}
          <Typography variant="h4" gutterBottom>
            {t('settings.themeOption')}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="theme"
              name="theme"
              value={customizer.activeMode}
              onChange={(event) => dispatch(setDarkMode(event.target.value))}
            >
              <FormControlLabel
                value="light"
                control={<CustomRadio />}
                label={t('settings.light')}
              />
              <FormControlLabel value="dark" control={<CustomRadio />} label={t('settings.dark')} />
            </RadioGroup>
          </FormControl>
          <Box pt={3} />
          {/* ------------ RTL theme setting -------------*/}
          <Typography variant="h4" gutterBottom>
            {t('settings.themeDirection')}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="themedir"
              name="themedir"
              value={customizer.activeDir}
              onChange={(event) => dispatch(setDir(event.target.value))}
            >
              <FormControlLabel value="ltr" control={<CustomRadio />} label={t('settings.ltr')} />
              <FormControlLabel value="rtl" control={<CustomRadio />} label={t('settings.rtl')} />
            </RadioGroup>
          </FormControl>
          <Box pt={3} />
          {/* ------------ Navbar Color setting ------------- */}
          <Typography variant="h4" gutterBottom>
            {t('settings.themeColors')}
          </Typography>
          {thColors.map((thcolor) => (
            <Tooltip title={thcolor.disp} placement="top" key={thcolor.id}>
              <Fab
                color="primary"
                style={{ backgroundColor: thcolor.bgColor }}
                sx={{ marginRight: '3px' }}
                size="small"
                onClick={() => dispatch(setTheme(thcolor.disp))}
                aria-label={thcolor.bgcolor}
              >
                {customizer.activeTheme === thcolor.disp ? (
                  <FeatherIcon icon="check" size="16" />
                ) : (
                  ''
                )}
              </Fab>
            </Tooltip>
          ))}

          <Box pt={3} />
        </Box>
      </Drawer>
    </div>
  );
};

export default Customizer;
