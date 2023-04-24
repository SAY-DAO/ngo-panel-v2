import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography>{t('footer.gateway')}</Typography>
    </Box>
  );
};

export default Footer;
