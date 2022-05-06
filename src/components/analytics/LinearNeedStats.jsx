import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import WidgetCard from '../WidgetCard';

const LinearNeedStats = ({ needsData, totalNeeds }) => {
  const { t } = useTranslation();

  const [stats, setStats] = useState();

  useEffect(() => {
    console.log(needsData);
    if (needsData) {
      setStats([
        {
          id: '0',
          digit: needsData[0].length,
          category: t('childData.needCategory.urgent'),
          percent: Math.round((needsData[0].length / totalNeeds) * 100),
          color: 'error',
        },
        {
          id: '1',
          digit: needsData[1].length,
          category: t('childData.needCategory.growth'),
          percent: Math.round((needsData[1].length / totalNeeds) * 100),
          color: 'success',
        },
        {
          id: '2',
          digit: needsData[2].length,
          category: t('childData.needCategory.joy'),
          percent: Math.round((needsData[2].length / totalNeeds) * 100),
          color: 'primary',
        },
        {
          id: '3',
          digit: needsData[3].length,
          category: t('childData.needCategory.health'),
          percent: Math.round((needsData[3].length / totalNeeds) * 100),
          color: 'secondary',
        },
        {
          id: '4',
          digit: needsData[4].length,
          category: t('childData.needCategory.surroundings'),
          percent: Math.round((needsData[4].length / totalNeeds) * 100),
          color: 'warning',
        },
      ]);
    }
  }, [needsData]);

  return (
    <Card
      sx={{
        pb: 0,
        mb: 4,
      }}
    >
      {stats && (
        <CardContent>
          <WidgetCard title="Needs stats" />
          <Box sx={{ mt: -1 }}>
            {stats.map((stat) => (
              <Box
                key={stat.id}
                sx={{
                  pb: 1,
                  pt: 1,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    lineHeight: '1.235',
                  }}
                >
                  {stat.digit}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    pb: '3px',
                  }}
                >
                  <Typography color="textSecondary" variant="h6">
                    {stat.category}
                  </Typography>
                  <Box
                    sx={{
                      ml: 'auto',
                    }}
                  >
                    <Typography color="textSecondary" variant="h6" fontWeight="400">
                      {stat.percent}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  value={stat.percent}
                  variant="determinate"
                  sx={{
                    '& span': {
                      backgroundColor:
                        stat.color === 'secondary'
                          ? (theme) => theme.palette.secondary.main
                          : stat.color === 'error'
                          ? (theme) => theme.palette.error.main
                          : stat.color === 'warning'
                          ? (theme) => theme.palette.warning.main
                          : stat.color === 'success'
                          ? (theme) => theme.palette.success.main
                          : stat.color === 'primary'
                          ? (theme) => theme.palette.primary.main
                          : (theme) => theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

export default LinearNeedStats;

LinearNeedStats.propTypes = {
  needsData: PropTypes.array.isRequired,
  totalNeeds: PropTypes.number.isRequired,
};
