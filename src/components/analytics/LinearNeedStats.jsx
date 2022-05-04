import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import WidgetCard from '../WidgetCard';

const LinearNeedStats = ({ needsArray, totalNeeds }) => {
  const { t } = useTranslation();

  const [needsData, setNeedsData] = useState();
  // const [sortedNeeds, setSortedNeeds] = useState([]);
  const [stats, setStats] = useState();

  // sort needs
  // urgent ==> index 0
  // growth 0 ==> index 1
  // joy 1 ==> index 2
  // health 2 ==> index 3
  // surroundings 3 ==> index 4
  // done ==> index 5

  useEffect(() => {
    if (needsArray) {
      const needData = [[], [], [], [], [], []];
      for (let i = 0; i < needsArray.length; i += 1) {
        if (needsArray[i].isUrgent) {
          needData[0].push(needsArray[i]);
        } else {
          needData[needsArray[i].category + 1].push(needsArray[i]);
        }
      }
      setNeedsData(needData);
    }
  }, [needsArray]);

  useEffect(() => {
    console.log(needsData);
    if (needsData) {
      setStats([
        {
          id: '0',
          digit: needsData[0].length,
          country: t('childData.needCategory.urgent'),
          percent: Math.round((needsData[0].length / totalNeeds) * 100),
          color: 'error',
        },
        {
          id: '1',
          digit: needsData[1].length,
          country: t('childData.needCategory.growth'),
          percent: Math.round((needsData[1].length / totalNeeds) * 100),
          color: 'success',
        },
        {
          id: '2',
          digit: needsData[2].length,
          country: t('childData.needCategory.joy'),
          percent: Math.round((needsData[2].length / totalNeeds) * 100),
          color: 'primary',
        },
        {
          id: '3',
          digit: needsData[3].length,
          country: t('childData.needCategory.health'),
          percent: Math.round((needsData[3].length / totalNeeds) * 100),
          color: 'secondary',
        },
        {
          id: '4',
          digit: needsData[4].length,
          country: t('childData.needCategory.surroundings'),
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
        <CardContent
          sx={{
            pb: 0,
          }}
        >
          <WidgetCard title="Needs stats" />
          <Box sx={{ mt: -1 }}>
            {stats.map((visit) => (
              <Box
                key={visit.id}
                sx={{
                  pb: 2,
                  pt: 1,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    lineHeight: '1.235',
                  }}
                >
                  {visit.digit}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    pb: '3px',
                  }}
                >
                  <Typography color="textSecondary" variant="h6">
                    From {visit.country}
                  </Typography>
                  <Box
                    sx={{
                      ml: 'auto',
                    }}
                  >
                    <Typography color="textSecondary" variant="h6" fontWeight="400">
                      {visit.percent}%
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  value={visit.percent}
                  variant="determinate"
                  sx={{
                    '& span': {
                      backgroundColor:
                        visit.color === 'secondary'
                          ? (theme) => theme.palette.secondary.main
                          : visit.color === 'error'
                          ? (theme) => theme.palette.error.main
                          : visit.color === 'warning'
                          ? (theme) => theme.palette.warning.main
                          : visit.color === 'success'
                          ? (theme) => theme.palette.success.main
                          : visit.color === 'primary'
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
  needsArray: PropTypes.array.isRequired,
  totalNeeds: PropTypes.number.isRequired,
};
