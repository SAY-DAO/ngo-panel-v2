import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Tooltip } from '@mui/material';

export default function ConfirmNeedDialog({ open, setOpen, dialogValues }) {
  //   const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  console.log(dialogValues);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {t('need.needDialogue.confirm.dialogTitle')}
        </DialogTitle>
        <DialogContent>
          <List sx={{ width: '100%', minWidth: 340, maxWidth: 360, bgcolor: 'background.paper' }}>
            {dialogValues &&
              dialogValues.map((d) => (
                <Grid key={d.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Need Icon" src={d.imageUrl && d.imageUrl} sx={{ mb: 1 }} />
                      <Box display="flex" alignItems="center">
                        <Tooltip
                          title={
                            d.unpayable === false && !d.isDone ? (
                              <Typography sx={{ fontSize: 12 }}>{t('need.payable')}</Typography>
                            ) : d.unpayable === true && !d.isDone ? (
                              <Typography sx={{ fontSize: 12 }}>{t('need.unpayable')}</Typography>
                            ) : (
                              <Typography sx={{ fontSize: 12 }}>{t('need.fullyPaid')}</Typography>
                            )
                          }
                        >
                          <Box
                            sx={{
                              display: 'inline-block',
                              m: '2px',
                              backgroundColor:
                                d.unpayable === false && !d.isDone
                                  ? () => theme.palette.success.main
                                  : d.unpayable === true && !d.isDone
                                  ? () => theme.palette.error.main
                                  : () => theme.palette.info.main,
                              borderRadius: '100%',
                              height: '10px',
                              width: '10px',
                            }}
                          />
                        </Tooltip>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: 12 }}>{t('need.isConfirmed')}</Typography>
                          }
                        >
                          <Box
                            sx={{
                              display: 'inline-block',
                              m: '2px',
                              backgroundColor:
                                d.isConfirmed === true
                                  ? () => theme.palette.success.main
                                  : () => theme.palette.error.main,
                              borderRadius: '10%',
                              height: '10px',
                              width: '10px',
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={d.name}
                      secondary={
                        <>
                          <Typography
                            sx={{
                              display: 'inline',
                            }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {d.title}
                          </Typography>
                          <Typography sx={{ display: 'block' }} component="span">
                            {d.childSayName}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Grid>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConfirmNeedDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.array,
};
