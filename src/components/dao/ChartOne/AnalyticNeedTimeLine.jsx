/* eslint-disable object-shorthand */
import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../DashboardCard';
import AnalyticSelect from './AnalyticSelect';
import { NeedTypeEnum } from '../../../utils/types';
import TaskCard from '../../my-profile/TaskCard';
import { fetchChildOneNeed } from '../../../redux/actions/needsAction';
import { fetchMyChildById } from '../../../redux/actions/childrenAction';
import { fetchNeedAnalytics } from '../../../redux/actions/analyticAction';

const AnalyticNeedTimeLine = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [modifiedNeed, setModifiedNeed] = useState();
  const [cardSelected, setCardSelected] = useState();
  const [chartValues, setChartValues] = useState();
  const { blue } = theme.palette.charts;
  const { purple } = theme.palette.charts;
  const { red } = theme.palette.charts;
  const { yellow } = theme.palette.charts;
  const { green } = theme.palette.charts;
  const { darkRed } = theme.palette.charts;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed } = childOneNeed;

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails } = swDetails;

  const childNeedsAnalytics = useSelector((state) => state.childNeedsAnalytics);
  const { needsResult } = childNeedsAnalytics;

  const childById = useSelector((state) => state.childById);
  const { result } = childById;

  const { swInfo } = useSelector((state) => state.swDetails);

  useEffect(() => {
    dispatch(fetchNeedAnalytics(0));
  }, []);

  useEffect(() => {
    if (oneNeed) {
      dispatch(fetchMyChildById(oneNeed.child_id));
    }
  }, [oneNeed]);

  useEffect(() => {
    if (oneNeed && result) {
      setModifiedNeed({ ...oneNeed, child: result });
    }
  }, [result, oneNeed]);

  useEffect(() => {
    setChartValues({
      optionsTimeLine: {
        grid: {
          show: true,
          borderColor: 'rgba(0, 0, 0, .2)',
          color: '#777e89',
          strokeDashArray: 2,
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        needsLabels: {
          enabled: false,
        },
        chart: {
          events: {
            click: (event, chartContext, config) => {
              dispatch(fetchChildOneNeed(needsResult[0][config.dataPointIndex].id));
            },
          },
          fontFamily: 'DM Sans',
          foreColor: '#adb0bb',
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        colors: [blue, green, yellow, red, purple, darkRed],

        xaxis: {
          categories: needsResult && needsResult[0].map((n) => n.name_translations.en),
        },
        markers: {
          size: [4, 4],
          strokeColors: '#fff',
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          shape: 'circle',
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          showNullneedsPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3,
          },
        },
        tooltip: {
          // x: {
          //   format: 'dd/MM/yy HH:mm',
          // },
          theme: 'dark',
          shared: false,
          intersect: true,
        },
        legend: {
          show: true,
        },
      },
      seriesTimeLine: [
        {
          name: 'Confirmed',
          data:
            needsResult &&
            needsResult[0].map((n) => moment(n.confirmDate).diff(moment(n.created), 'hours')),
        },
        {
          name: 'Paid',
          data:
            needsResult &&
            needsResult[0].map((n) => moment(n.doneAt).diff(moment(n.confirmDate), 'hours')),
        },
        {
          name: 'Purchased / Money Transfer',
          data:
            needsResult &&
            needsResult[0].map((n) =>
              n.type === NeedTypeEnum.PRODUCT
                ? moment(n.purchase_date).diff(moment(n.doneAt), 'hours')
                : moment(n.ngo_delivery_date).diff(moment(n.doneAt), 'hours'),
            ),
        },
        {
          name: 'Ngo Delivery',
          data:
            needsResult &&
            needsResult[0].map((n) =>
              moment(n.ngo_delivery_date).diff(moment(n.purchase_date), 'hours'),
            ),
        },
        {
          name: 'Child Delivery',
          data:
            needsResult &&
            needsResult[0].map((n) =>
              moment(n.child_delivery_date).diff(moment(n.ngo_delivery_date), 'hours'),
            ),
        },
        {
          name: 'Total',
          data:
            needsResult &&
            needsResult[0].map((n) =>
              moment(n.child_delivery_date).diff(moment(n.created), 'hours'),
            ),
        },
      ],
    });
  }, [needsResult]);
  return (
    <>
      {!needsResult || loadingSwDetails ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={8}>
            <DashboardCard custompadding="1" title="Timeline" action={<AnalyticSelect />}>
              {/* chart */}
              <Chart
                options={chartValues.optionsTimeLine}
                series={chartValues.seriesTimeLine}
                type="line"
                height="300"
                style={{ direction: 'ltr' }}
              />
            </DashboardCard>
          </Grid>

          <Grid item xs={4}>
            {modifiedNeed && swInfo && (
              <TaskCard
                need={modifiedNeed}
                swNewDetails={swInfo}
                setCardSelected={setCardSelected}
                cardSelected={cardSelected}
              />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AnalyticNeedTimeLine;
