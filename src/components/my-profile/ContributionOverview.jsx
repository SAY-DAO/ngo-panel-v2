import React, { useState, useEffect } from 'react';
import { Typography, Box, Stack, CircularProgress, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardCard from '../base-card/DashboardCard';
import { FlaskUserTypesEnum } from '../../utils/types';
import { fetchUserContribution } from '../../redux/actions/analyticAction';
import { persianMonthStringFarsi } from '../../utils/helpers';

const ContributionOverview = ({ swNewDetails }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const [graphData, setGraphData] = useState();
  const [values, setValues] = useState({
    confirms: [],
    creations: [],
    deletions: [],
  });

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  const contributionAnalytics = useSelector((state) => state.contributionAnalytics);
  const { contribution } = contributionAnalytics;

  useEffect(() => {
    if (pageDetails) {
      dispatch(fetchUserContribution());
    }
  }, [pageDetails]);

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.warning.main;
  const deletedColor = theme.palette.error.main;

  const optionsContributionOverview = {
    grid: {
      show: true,
      borderColor: 'transparent',
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 10,
        bottom: -10,
        top: -20,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '100%',
        columnWidth: '52%',
        endingShape: 'rounded',
        borderRadius: 1,
      },
    },

    colors: [primary, secondary, deletedColor],
    fill: {
      type: 'solid',
      opacity: 1,
    },
    chart: {
      // height: 880,
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
      size: 1,
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
      tickAmount: 5,
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
    if (contribution) {
      const keys = Object.keys(contribution.inMonth).map((k) => Number(k));

      // 1. Compute today’s month (1–12)
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // getMonth() is 0–11:contentReference[oaicite:2]{index=2}

      // 2. Sort in-place so that currentMonth comes first, then previous months
      keys.sort((a, b) => {
        const rankA = (currentMonth - a + 12) % 12;
        const rankB = (currentMonth - b + 12) % 12;
        return rankA - rankB; // ascending by rank
      });

      // those zero are later than 6 months
      keys.forEach((key) => {
        if (
          contribution.inMonth[key].created > 0 ||
          contribution.inMonth[key].confirmed > 0 ||
          contribution.inMonth[key].deleted > 0
        ) {
          myList.push({
            [persianMonthStringFarsi(Number(key))]: {
              created: contribution.inMonth[key].created,
              confirmed: contribution.inMonth[key].confirmed,
              deleted: contribution.inMonth[key].deleted,
            },
          });
        }
      });

      if (myList.length > 5) myList.reverse().shift();
      setGraphData(myList);
    }
  }, [contribution]);

  const confirms = [];
  const creations = [];
  const deletions = [];
  useEffect(() => {
    if (graphData) {
      // eslint-disable-next-line no-unused-expressions
      graphData &&
        graphData.forEach((d) => {
          if (d && d[Object.keys(d)[0]]) {
            confirms.push(d[Object.keys(d)[0]].confirmed);
            creations.push(d[Object.keys(d)[0]].created);
            deletions.push(d[Object.keys(d)[0]].deleted);
          }
          setValues({
            confirms,
            creations,
            deletions,
          });
        });
    }
  }, [graphData]);

  const seriesContributionOverview = [
    {
      name: t('myPage.countJobs.titleConfirmed'),
      data: [...values.confirms],
    },
    {
      name: t('myPage.countJobs.titleCreated'),
      data: [...values.creations],
    },
    {
      name: t('myPage.countJobs.titleDeleted'),
      data: [...values.deletions],
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
              color: primary,
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
              color: secondary,
            }}
          >
            <Typography
              sx={{
                color: 'secondary.main',
                '& svg': {
                  fill: secondary,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            {t('myPage.countJobs.titleCreated')}
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: deletedColor,
            }}
          >
            <Typography
              sx={{
                color: 'secondary.main',
                '& svg': {
                  fill: deletedColor,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            {t('myPage.countJobs.titleDeleted')}
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
            height="180px"
            width="350px"
          />
        )}
      </Box>
      <Tooltip
        title={
          <>
            {swNewDetails.typeId === FlaskUserTypesEnum.ADMIN ||
            swNewDetails.typeId === FlaskUserTypesEnum.SUPER_ADMIN ? (
              <Typography>
                <strong>{t('myPage.countJobs.titleConfirmed')}</strong>
              </Typography>
            ) : (
              <Typography>
                <strong>{t('myPage.countJobs.titleCreated')}</strong>
              </Typography>
            )}
            {!contribution ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.first')}: {contribution.summary.inTwoDays}
              </Typography>
            )}
            {!contribution ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.second')}: {contribution.summary.inWeek}
              </Typography>
            )}
            {!contribution ? (
              <CircularProgress size={15} />
            ) : (
              <Typography>
                {t('myPage.countJobs.count.third')}: {contribution.summary.inThirtyDays}
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
