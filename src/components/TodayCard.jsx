import { Card, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { dateConvertor } from '../utils/persianToEnglish';

export default function TodayCard() {
  const { t } = useTranslation();
  return (
    <Card
      elevation={8}
      sx={{
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontSize: 16 }}>{t('need.today')} </Typography>
      <Typography sx={{ fontSize: 12, pl: 1, pr: 1 }} variant="body2">
        {dateConvertor(
          `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
        )}
      </Typography>
      <Typography sx={{ fontSize: 12, pl: 1, pr: 1 }} variant="body2">
        {`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`}
      </Typography>
    </Card>
  );
}
