import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Autocomplete, Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function StatusDialog({ need, statusDialog, setStatusDialog }) {
  const { t } = useTranslation();

  const [openStatus, setOpenStatus] = useState(false);
  const [optionsStatus, setOptionsStatus] = useState([]);
  const [currentStatus, setCurrentStatus] = useState();
  const [statusId, setStatusId] = useState();

  // Autocomplete my Children
  useEffect(() => {
    if (need.type === 0) {
      if (need.status === 2) {
        setCurrentStatus(t('need.needDialogue.service.2'));
      } else if (need.status === 3) {
        setCurrentStatus(t('need.needDialogue.service.3'));
      } else if (need.status === 4) {
        setCurrentStatus(t('need.needDialogue.service.4'));
      }
      setOptionsStatus([
        { title: t('need.needDialogue.service.2'), id: 2 },
        { title: t('need.needDialogue.service.3'), id: 3 },
        { title: t('need.needDialogue.service.4'), id: 4 },
      ]);
    } else if (need.type === 1) {
      if (need.status === 2) {
        setCurrentStatus(t('need.needDialogue.product.2'));
      } else if (need.status === 3) {
        setCurrentStatus(t('need.needDialogue.product.3'));
      } else if (need.status === 4) {
        setCurrentStatus(t('need.needDialogue.product.4'));
      } else if (need.status === 5) {
        setCurrentStatus(t('need.needDialogue.product.4'));
      }
      setOptionsStatus([
        { title: t('need.needDialogue.product.2'), id: 2 },
        { title: t('need.needDialogue.product.3'), id: 3 },
        { title: t('need.needDialogue.product.4'), id: 4 },
        { title: t('need.needDialogue.product.5'), id: 5 },
      ]);
    }
  }, [need, statusId, currentStatus]);

  const handleClose = () => {
    setStatusDialog(false);
  };
  return (
    <div>
      {currentStatus && (
        <Dialog open={statusDialog} onClose={handleClose}>
          <DialogTitle sx={{ p: 2, textAlign: 'center', fontSize: '1.2rem' }}>
            {t('need.needStatus_title')}{' '}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ p: 2, textAlign: 'center' }}>{need.title}</DialogContentText>
            <Typography>From</Typography>
            <TextField
              sx={{ p: 2 }}
              disabled
              id="outlined-disabled"
              defaultValue={`${need.status} - ${currentStatus}`}
            />
            <Typography>To</Typography>
            <Grid container spacing={2} sx={{ p: 2 }} justifyContent="center">
              <Grid item>
                {optionsStatus && (
                  <Autocomplete
                    id="asynchronous"
                    sx={{ minWidth: '220px' }}
                    open={openStatus}
                    onOpen={() => {
                      setOpenStatus(true);
                    }}
                    onClose={() => {
                      setOpenStatus(false);
                    }}
                    options={optionsStatus}
                    onChange={(e, value) => setStatusId(value && value.id)}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => `${option.id} - ${option.title} `}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <>
                          <Typography>{`${option.id} - ${option.title} `}</Typography>
                        </>
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label="New Status..." />}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Update</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

StatusDialog.propTypes = {
  need: PropTypes.object,
  statusDialog: PropTypes.bool,
  setStatusDialog: PropTypes.func,
};
