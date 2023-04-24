import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { t } from 'i18next';
import { Card, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { dateConvertor } from '../../utils/persianToEnglish';
import { daysDifference } from '../../utils/helpers';
import TodayCard from '../../components/TodayCard';

export default function NgoArrivalSummery({ arrivals, dateList }) {
  const list = [];
  arrivals.sort((a, b) => {
    const fa = a.ngoName.toLowerCase();
    const fb = b.ngoName.toLowerCase();

    if (fa > fb) {
      return -1;
    }
    if (fa < fb) {
      return 1;
    }
    return 0;
  });

  return (
    <TableContainer component={Paper} sx={{ m: 'auto', width: '650px', textAlign: 'center' }}>
      <TodayCard />
      <>
        <Card elevation={2}>
          {arrivals.map((a) => (
            <div key={a.deliveryCode}>
              {!list.includes(a.ngoName) && (
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    mb: 1,
                    mt: 4,
                    textAlign: 'center',
                  }}
                >
                  {a.ngoName}
                </Typography>
              )}
              <Table size="small" aria-label="retailer codes table">
                <TableHead>
                  {!list.includes(a.ngoName) && list.push(a.ngoName) && (
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: 11,
                          border: '1px solid black',
                          fontWeight: 600,
                        }}
                        align="left"
                      >
                        {t('ngo.arrivalDate')}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 11,
                          border: '1px solid black',
                          fontWeight: 600,
                        }}
                        align="left"
                      >
                        {t('ngo.deliveryItems')}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 11,
                          border: '1px solid black',
                          fontWeight: 600,
                        }}
                        align="left"
                      >
                        {t('ngo.deliveryCode')}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 11,
                          border: '1px solid black',
                          fontWeight: 600,
                        }}
                        align="left"
                      >
                        {t('ngo.arrivalCode')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableHead>

                <TableBody>
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': { border: '1px solid black' },
                      opacity:
                        daysDifference(new Date().setHours(0, 0, 0, 0), new Date(a.maxDate)) >= 0
                          ? 1
                          : 0.4,
                      backgroundColor: theme => 
                        Math.min(...dateList) === a.maxDate ? theme.palette.success.dark: 'transparent',
                    }}
                  >
                    <TableCell sx={{ width: '140px', fontSize: 12 }} align="left">
                      {a.maxDate && dateConvertor(new Date(a.maxDate).toUTCString())}
                    </TableCell>
                    <TableCell sx={{ width: '80px', fontSize: 12 }} align="left">
                      {a.itemCount}
                    </TableCell>
                    <TableCell sx={{ width: '100px', fontSize: 12 }} align="left">
                      {a.deliveryCode}
                    </TableCell>
                    <TableCell sx={{ width: '120px', fontSize: 12 }} align="left">
                      {a.arrivalCode}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))}
        </Card>
      </>
    </TableContainer>
  );
}

NgoArrivalSummery.propTypes = {
  arrivals: PropTypes.array,
  dateList: PropTypes.array,
};
