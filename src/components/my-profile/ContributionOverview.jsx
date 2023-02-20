import React, { useState, useEffect } from 'react';
import { Typography, Box, Stack, CircularProgress, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardCard from '../base-card/DashboardCard';
import { RolesEnum } from '../../utils/types';

const ContributionOverview = ({ swNewDetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [graphData, setGraphData] = useState();

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, success: successProfile } = myPage;

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionsContributionOverview = {
    grid: {
      show: true,
      borderColor: 'transparent',
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: -13,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '42%',
        endingShape: 'rounded',
        borderRadius: 5,
      },
    },

    colors: [primary, secondary],
    fill: {
      type: 'solid',
      opacity: 1,
    },
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: '#adb0bb',
      fontFamily: "'DM Sans',sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: 'category',
      categories: [
        graphData && graphData[0] ? String(Object.keys(graphData[0])) : '0',
        graphData && graphData[1] ? String(Object.keys(graphData[1])) : '0',
        graphData && graphData[2] ? String(Object.keys(graphData[2])) : '0',
        graphData && graphData[3] ? String(Object.keys(graphData[3])) : '0',
        graphData && graphData[4] ? String(Object.keys(graphData[4])) : '0',
        graphData && graphData[5] ? String(Object.keys(graphData[5])) : '0',
      ],
      labels: {
        style: {
          cssClass: 'grey--text lighten-2--text fill-color',
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max:
        graphData &&
        graphData[0] &&
        Math.max(
          graphData && graphData[0] ? graphData[0][Object.keys(graphData[0])[0]].created : 0,
          graphData && graphData[1] ? graphData[1][Object.keys(graphData[1])[0]].created : 0,
          graphData && graphData[2] ? graphData[2][Object.keys(graphData[2])[0]].created : 0,
          graphData && graphData[3] ? graphData[3][Object.keys(graphData[3])[0]].created : 0,
          graphData && graphData[4] ? graphData[4][Object.keys(graphData[4])[0]].created : 0,
          graphData && graphData[5] ? graphData[5][Object.keys(graphData[5])[0]].created : 0,
          graphData && graphData[0] ? graphData[0][Object.keys(graphData[0])[0]].confirmed : 0,
          graphData && graphData[1] ? graphData[1][Object.keys(graphData[1])[0]].confirmed : 0,
          graphData && graphData[2] ? graphData[2][Object.keys(graphData[2])[0]].confirmed : 0,
          graphData && graphData[3] ? graphData[3][Object.keys(graphData[3])[0]].confirmed : 0,
          graphData && graphData[4] ? graphData[4][Object.keys(graphData[4])[0]].confirmed : 0,
          graphData && graphData[5] ? graphData[5][Object.keys(graphData[5])[0]].confirmed : 0,
        ),
      tickAmount: 3,
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: 'butt',
      colors: ['transparent'],
    },
    tooltip: {
      theme: 'dark',
    },
  };
  // set graph labels
  useEffect(() => {
    const myList = [];
    if (pageDetails && pageDetails.timeLine) {
      const keys = Object.keys(pageDetails.timeLine.inMonth);
      // those zero are later than 6 months
      keys.forEach((key) => {
        console.log(pageDetails.timeLine.inMonth[key]);
        if (
          pageDetails.timeLine.inMonth[key].created > 0 ||
          pageDetails.timeLine.inMonth[key].confirmed > 0
        ) {
          myList.push({
            [key]: {
              created: pageDetails.timeLine.inMonth[key].created,
              confirmed: pageDetails.timeLine.inMonth[key].confirmed,
            },
          });
        }
      });
      setGraphData(myList);
    }
    console.log('----------------');
    console.log(myList);
  }, [pageDetails]);

  const seriesContributionOverview = [
    {
      name: t('myPage.countJobs.titleConfirmed'),
      data: [
        graphData && graphData[0] ? graphData[0][Object.keys(graphData[0])[0]].confirmed : 0,
        graphData && graphData[1] ? graphData[1][Object.keys(graphData[1])[0]].confirmed : 0,
        graphData && graphData[2] ? graphData[2][Object.keys(graphData[2])[0]].confirmed : 0,
        graphData && graphData[3] ? graphData[3][Object.keys(graphData[3])[0]].confirmed : 0,
        graphData && graphData[4] ? graphData[4][Object.keys(graphData[4])[0]].confirmed : 0,
        graphData && graphData[5] ? graphData[5][Object.keys(graphData[5])[0]].confirmed : 0,
      ],
    },
    {
      name: t('myPage.countJobs.titleCreated'),
      data: [
        graphData && graphData[0] ? graphData[0][Object.keys(graphData[0])[0]].created : 0,
        graphData && graphData[1] ? graphData[1][Object.keys(graphData[1])[0]].created : 0,
        graphData && graphData[2] ? graphData[2][Object.keys(graphData[2])[0]].created : 0,
        graphData && graphData[3] ? graphData[3][Object.keys(graphData[3])[0]].created : 0,
        graphData && graphData[4] ? graphData[4][Object.keys(graphData[4])[0]].created : 0,
        graphData && graphData[5] ? graphData[5][Object.keys(graphData[5])[0]].created : 0,
      ],
    },
  ];

  return (
    <DashboardCard
      title=""
      subtitle="Ample Admin Vs Pixel Admin"
      customdisplay="block"
      custompadding="1px"
      action={
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: () => theme.palette.primary.main,
            }}
          >
            <Typography
              sx={{
                color: 'primary.main',
                '& svg': {
                  fill: () => theme.palette.primary.main,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            {t('myPage.countJobs.titleConfirmed')}
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: () => theme.palette.secondary.main,
            }}
          >
            <Typography
              sx={{
                color: 'secondary.main',
                '& svg': {
                  fill: () => theme.palette.secondary.main,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            {t('myPage.countJobs.titleCreated')}
          </Typography>
        </Stack>
      }
    >
      <Box>
        {graphData && graphData[0] && (
          <Chart
            options={optionsContributionOverview}
            series={seriesContributionOverview}
            type="bar"
            height="100px"
            width="320px"
            style={{ direction: 'ltr' }}
          />
        )}
      </Box>
      <Tooltip
        title={
          <>
            {swNewDetails.typeId === RolesEnum.ADMIN ||
            swNewDetails.typeId === RolesEnum.SUPER_ADMIN ? (
              <Typography>
                <strong>{t('myPage.countJobs.titleConfirmed')}</strong>
              </Typography>
            ) : (
              <Typography>
                <strong>{t('myPage.countJobs.titleCreated')}</strong>
              </Typography>
            )}
            {!successProfile ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.first')}: {pageDetails.timeLine.summary.inTwoDays}
              </Typography>
            )}
            {!successProfile ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.second')}: {pageDetails.timeLine.summary.inWeek}
              </Typography>
            )}
            {!successProfile ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.third')}: {pageDetails.timeLine.summary.inThirtyDays}
              </Typography>
            )}
          </>
        }
        arrow
      >
        <HelpOutlineIcon />
      </Tooltip>
    </DashboardCard>
  );
};

export default ContributionOverview;

ContributionOverview.propTypes = {
  swNewDetails: PropTypes.object,
};
