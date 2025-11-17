import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DashboardCard from '../base-card/DashboardCard';
import { fetchUserContribution } from '../../redux/actions/analyticAction';
import { persianMonthStringFarsi } from '../../utils/helpers';

const ContributionOverview = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const [graphData, setGraphData] = useState([]);
  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;
  const contributionAnalytics = useSelector((state) => state.contributionAnalytics);
  const { contribution } = contributionAnalytics;

  useEffect(() => {
    if (pageDetails) {
      dispatch(fetchUserContribution());
    }
  }, [pageDetails, dispatch]);

  // Ensure we always lead with the current month (safe date)
  useEffect(() => {
    if (!contribution || !contribution.inMonth) {
      setGraphData([]);
      return;
    }

    const { inMonth } = contribution;
    // parse keys as numbers 1..12
    const allKeys = Object.keys(inMonth)
      .map((k) => Number(k))
      .filter((k) => !Number.isNaN(k));

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1..12

    // Build a map for quick lookup
    const map = {};
    allKeys.forEach((k) => {
      map[k] = {
        created: Number(inMonth[k].created) || 0,
        confirmed: Number(inMonth[k].confirmed) || 0,
        deleted: Number(inMonth[k].deleted) || 0,
      };
    });

    // Always include currentMonth as first entry (zeroed if missing)
    const orderedMonths = [];
    // include currentMonth
    orderedMonths.push(currentMonth);
    // then previous months in descending order (current-1, current-2, ...)
    for (let i = 1; i < 6; i += 1) {
      const m = ((currentMonth - i - 1 + 12) % 12) + 1; // ensures 1..12
      orderedMonths.push(m);
    }

    // Build the list, keep months that have any data OR the current month (always)
    const list = orderedMonths.map((m) => {
      const entry = map[m] || { created: 0, confirmed: 0, deleted: 0 };
      return {
        [persianMonthStringFarsi(Number(m))]: {
          created: entry.created,
          confirmed: entry.confirmed,
          deleted: entry.deleted,
        },
      };
    });

    // Remove trailing months that are all zero except ensure currentMonth (first) stays
    const filtered = [...list];
    // keep first (currentMonth) no matter what
    for (let i = filtered.length - 1; i > 0; i -= 1) {
      const key = Object.keys(filtered[i])[0];
      const val = filtered[i][key];
      if (val.created === 0 && val.confirmed === 0 && val.deleted === 0) {
        filtered.pop();
      } else {
        break;
      }
    }

    setGraphData(filtered);
  }, [contribution]);

  // derive arrays for series from graphData (memoized)
  const { confirms, creations, deletions, categories } = useMemo(() => {
    const c = [];
    const cr = [];
    const d = [];
    const cats = [];

    graphData.forEach((g) => {
      const key = Object.keys(g)[0];
      const val = g[key] || { confirmed: 0, created: 0, deleted: 0 };
      cats.push(String(key));
      c.push(Number(val.confirmed) || 0);
      cr.push(Number(val.created) || 0);
      d.push(Number(val.deleted) || 0);
    });

    return {
      confirms: c,
      creations: cr,
      deletions: d,
      categories: cats,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  // compute y-axis maximum robustly
  const yMax = useMemo(() => {
    const allValues = [...confirms, ...creations, ...deletions].map((v) => Number(v) || 0);
    if (allValues.length === 0) return 5;
    const max = Math.max(...allValues);
    // add small headroom
    return Math.max(5, Math.ceil(max * 1.1));
  }, [confirms, creations, deletions]);

  const primary = theme.palette.primary.main;
  const secondary = theme.palette.warning.main;
  const deletedColor = theme.palette.error.main;

  const optionsContributionOverview = useMemo(() => {
    return {
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
        categories: categories.length ? categories : ['0', '0', '0', '0', '0', '0'],
        labels: {
          style: {
            cssClass: 'grey--text lighten-2--text fill-color',
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: yMax,
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
  }, [primary, secondary, deletedColor, categories, yMax]);

  const seriesContributionOverview = useMemo(() => {
    return [
      {
        name: t('myPage.countJobs.titleConfirmed'),
        data: [...confirms],
      },
      {
        name: t('myPage.countJobs.titleCreated'),
        data: [...creations],
      },
      {
        name: t('myPage.countJobs.titleDeleted'),
        data: [...deletions],
      },
    ];
  }, [confirms, creations, deletions, t]);

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
        {graphData && graphData.length > 0 && (
          <Chart
            options={optionsContributionOverview}
            series={seriesContributionOverview}
            type="bar"
            height="180px"
            width="350px"
          />
        )}
      </Box>
    </DashboardCard>
  );
};

export default ContributionOverview;
