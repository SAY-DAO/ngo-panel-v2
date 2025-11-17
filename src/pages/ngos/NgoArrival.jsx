import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18next';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Grid, IconButton, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { fetchNgoArrivals, updateNgoArrival } from '../../redux/actions/ngoAction';
import { dateConvertor } from '../../utils/persianToEnglish';
import { daysDifference } from '../../utils/helpers';
import TodayCard from '../../components/TodayCard';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';

const trainees = process.env.REACT_APP_TRAINEE_IDS
  ? process.env.REACT_APP_TRAINEE_IDS.split(',').map(Number)
  : [];

export default function NgoArrival() {
  const dispatch = useDispatch();

  const [edit, setEdit] = useState();
  const [arrivalCode, setArrivalCode] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const ngoArrivals = useSelector((state) => state.ngoArrivals);
  const { arrivals, updatedCode } = ngoArrivals;

  useEffect(() => {
    dispatch(fetchNgoArrivals());
    setEdit();
  }, [updatedCode]);

  const handleChange = (e) => {
    setArrivalCode(e.target.value);
  };

  const handleNewCode = (deliveryCode) => {
    dispatch(updateNgoArrival(deliveryCode, arrivalCode));
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 950, m: 'auto' }}>
      <TodayCard />

      <Table sx={{ minWidth: 800 }} size="small" aria-label="retailer codes table">
        <TableHead>
          <TableRow>
            <TableCell>{t('ngo.name')}</TableCell>
            <TableCell align="left">{t('ngo.deliveryCode')}</TableCell>
            <TableCell align="left">{t('ngo.deliveryItems')}</TableCell>
            <TableCell align="left">{t('ngo.arrivalDate')}</TableCell>
            <TableCell align="left">{t('button.update')}</TableCell>
            <TableCell align="left">{t('ngo.arrivalCode')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrivals &&
            arrivals.map((a) => (
              <TableRow
                key={a.deliveryCode}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  opacity: daysDifference(new Date(), new Date(a.maxDate)) + 1 > 1 ? 1 : 0.4,
                }}
              >
                <TableCell align="left" sx={{ fontSize: 12 }}>
                  <Typography
                    sx={{
                      maxWidth: '150px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '160px',
                      height: '1.2em',
                      whiteSpace: 'nowrap',
                      fontSize: 12,
                    }}
                  >
                    {a.ngoName}
                  </Typography>
                </TableCell>
                <TableCell align="left">{a.deliveryCode}</TableCell>
                <TableCell component="th" scope="row">
                  {a.itemCount}
                </TableCell>
                <TableCell align="left">
                  <Typography
                    sx={{
                      fontSize: 12,
                    }}
                  >
                    {a.maxDate && dateConvertor(new Date(a.maxDate).toUTCString())}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  {edit !== a.deliveryCode ? (
                    <IconButton
                      disabled={trainees.includes(swInfo.id)}
                      onClick={() => setEdit(a.deliveryCode)}
                    >
                      <ModeEditOutlineIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleNewCode(a.deliveryCode)}>
                      <CheckIcon color="success" />
                    </IconButton>
                  )}
                </TableCell>
                {edit !== a.deliveryCode ? (
                  <TableCell align="left">{a.arrivalCode}</TableCell>
                ) : (
                  <TableCell align="left">
                    <Grid container direction="row" justifyContent="space-between">
                      <Grid item xs={9}>
                        <CustomTextField
                          size="small"
                          placeholder={t('placeholder.enterArrivalCode')}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs sx={{ m: 'auto' }}>
                        <IconButton onClick={() => setEdit()}>
                          <CloseIcon color="error" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
