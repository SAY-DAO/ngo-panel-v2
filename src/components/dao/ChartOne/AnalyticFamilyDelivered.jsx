import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { fetchFamilyAnalytic } from '../../../redux/actions/analyticAction';

export default function AnalyticFamilyDelivered() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState();

  const familyAnalyitics = useSelector((state) => state.familyAnalyitics);
  const { roles } = familyAnalyitics;

  useEffect(() => {
    if (roles && roles.scattered) {
      setOptions({
        series: [
          {
            name: 'Father',
            data: roles.scattered.father,
          },
          {
            name: 'Mother',
            data: roles.scattered.mother,
          },
          {
            name: 'Amoo',
            data: roles.scattered.amoo,
          },
          {
            name: 'Khaleh',
            data: roles.scattered.khaleh,
          },
          {
            name: 'Daie',
            data: roles.scattered.daie,
          },
          {
            name: 'Amme',
            data: roles.scattered.amme,
          },
        ],
        chart: {
          // height: 750,
          type: 'scatter',
          zoom: {
            type: 'xy',
          },
        },
        dataLabels: {
          //   enabled: true,
        },
        grid: {
          xaxis: {
            lines: {
              // show: true,
            },
          },
          yaxis: {
            lines: {
              // show: true,
            },
          },
        },
        xaxis: {
          // max: 5,
          // type: 'datetime',
        },
        yaxis: {},
      });
    }
  }, [roles]);

  useEffect(() => {
    if (!roles) {
      dispatch(fetchFamilyAnalytic());
    }
  }, []);

  return (
    <div id="chart">
      <Typography sx={{ mt: 5, textAlign: 'center' }}>
        Sum of Delivered per Role (e.g: 2 Amo had delivered 29 needs each)
      </Typography>
      {options && (
        <ReactApexChart options={options} series={options.series} type="scatter" height={350} />
      )}
    </div>
  );
}
