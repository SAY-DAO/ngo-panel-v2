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
import { LoadingButton } from '@mui/lab';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Link, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchChildOneNeed, updateNeedConfirm } from '../../redux/actions/needsAction';
import Message from '../Message';
import DurationTimeLine from '../my-profile/DurationTimeLine';
import { isUnpayable } from '../../utils/helpers';
import { dateConvertor } from '../../utils/persianToEnglish';

export default function ConfirmNeedDialog({ open, setOpen, dialogValues }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const needConfirm = useSelector((state) => state.needConfirm);
  const { loading: loadingConfirm, success: successConfirm, error: errorConfirm } = needConfirm;

  useEffect(() => {
    if (successConfirm) {
      setOpen(false);
      dispatch(fetchChildOneNeed(dialogValues.theNeed.id));
    }
  }, [successConfirm]);

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    dispatch(updateNeedConfirm(dialogValues.theNeed.id));
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
          <List sx={{ width: '100%', minWidth: 30, maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start" sx={{ backgroundColor: '#1c1c1c' }}>
              <ListItemAvatar>
                {dialogValues && dialogValues.theNeed && (
                  <Tooltip title={<DurationTimeLine need={dialogValues.theNeed} />}>
                    <Avatar
                      alt="Need Icon"
                      src={`https://api.sayapp.company/${dialogValues.theNeed.imageUrl}`}
                      sx={{ mb: 1 }}
                    />
                  </Tooltip>
                )}

                <Box display="flex" alignItems="center">
                  <Tooltip
                    title={
                      isUnpayable(dialogValues.theNeed) === false &&
                      !dialogValues.theNeed.doneAt ? (
                        <Typography sx={{ fontSize: 12 }}>
                          {t('need.payable')}
                          {' - '}
                          {dateConvertor(dialogValues.theNeed.unavailable_from)}
                        </Typography>
                      ) : isUnpayable(dialogValues.theNeed) === true &&
                        !dialogValues.theNeed.doneAt ? (
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
                          isUnpayable(dialogValues.theNeed) === false &&
                          !dialogValues.theNeed.doneAt
                            ? () => theme.palette.success.main
                            : isUnpayable(dialogValues.theNeed) === true &&
                              !dialogValues.theNeed.doneAt
                            ? () => theme.palette.error.main
                            : () => theme.palette.info.main,
                        borderRadius: '100%',
                        height: '10px',
                        width: '10px',
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={<Typography sx={{ fontSize: 12 }}>{t('need.isConfirmed')}</Typography>}
                  >
                    <Box
                      sx={{
                        display: 'inline-block',
                        m: '2px',
                        backgroundColor:
                          dialogValues.theNeed.isConfirmed === true
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
                primary={
                  <Grid container justifyContent="space-between">
                    <Typography
                      sx={{
                        display: 'inline-block',
                      }}
                      component="span"
                      variant="subtitle1"
                      color="text.primary"
                    >
                      <Link
                        href={dialogValues.theNeed.link}
                        underline="none"
                        sx={{ pl: 1, pr: 1, fontSize: 12 }}
                        target="_blank"
                      >
                        {dialogValues.theNeed.name_translations.en}
                      </Link>
                    </Typography>

                    <Typography
                      sx={{
                        display: 'inline-block',
                        fontSize: 12,
                      }}
                      component="span"
                      variant="body2"
                      color="primary"
                    >
                      {t('need.id')}: {dialogValues.theNeed.id}
                    </Typography>
                  </Grid>
                }
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
                      {dialogValues.theNeed.title}
                    </Typography>
                    <Typography sx={{ display: 'block' }} component="span">
                      {dialogValues.theNeed.childSayName}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="middle" sx={{ borderColor: '#a36868' }} />

            {dialogValues &&
              dialogValues.duplicates.map((d) => (
                <Grid key={d.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Tooltip title={<DurationTimeLine need={d} />}>
                        <Avatar
                          alt="Need Icon"
                          src={d.imageUrl && `https://api.sayapp.company/${d.imageUrl}`}
                          sx={{ mb: 1 }}
                        />
                      </Tooltip>

                      <Box display="flex" alignItems="center">
                        <Tooltip
                          title={
                            isUnpayable(d) === false && !d.doneAt ? (
                              <Typography sx={{ fontSize: 12 }}>{t('need.payable')}</Typography>
                            ) : isUnpayable(d) === true && !d.doneAt ? (
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
                                isUnpayable(d) === false && !d.doneAt
                                  ? () => theme.palette.success.main
                                  : isUnpayable(d) === true && !d.doneAt
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
                      primary={
                        <Grid container justifyContent="space-between">
                          <Typography
                            sx={{
                              display: 'inline-block',
                            }}
                            component="span"
                            variant="subtitle1"
                            color="text.primary"
                          >
                            <Link
                              href={d.link}
                              underline="none"
                              sx={{
                                pl: 1,
                                pr: 1,
                                fontSize: 12,
                                color: theme.palette.secondary.dark,
                              }}
                              target="_blank"
                            >
                              {d.name_translations.en}
                            </Link>
                          </Typography>

                          <Typography
                            sx={{
                              display: 'inline-block',
                              fontSize: 12,
                            }}
                            component="span"
                            variant="body2"
                            color="secondary"
                          >
                            {t('need.id')}: {d.id}
                          </Typography>
                        </Grid>
                      }
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
          <LoadingButton
            loading={loadingConfirm}
            color="primary"
            variant="outlined"
            type="submit"
            onClick={handleConfirm}
            autoFocus
          >
            {t('button.confirm')}
          </LoadingButton>
          <Button
            color="secondary"
            variant="outlined"
            type="submit"
            autoFocus
            onClick={handleClose}
          >
            {t('button.cancel')}
          </Button>
        </DialogActions>
        <Grid container sx={{ p: 1 }}>
          {errorConfirm && (
            <Message
              severity="error"
              variant="filled"
              input="confirm"
              backError={errorConfirm}
              sx={{ width: '100%' }}
            />
          )}
        </Grid>
      </Dialog>
    </div>
  );
}

ConfirmNeedDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  dialogValues: PropTypes.object,
};
