/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {
  Avatar,
  Grid,
  ImageList,
  ImageListItem,
  Box,
  Stack,
  Divider,
  useMediaQuery,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { prepareUrl } from '../../utils/helpers';
import {
  fetchUserChildren,
  updateBuilderStatus,
  fetchFamilyMember,
} from '../../redux/actions/userAction';
import { USER_CHILDREN_RESET } from '../../redux/constants/userConstants';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function UserDialog({ setDialogValues, dialogValues }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const open = Boolean(dialogValues?.open);

  const { userChildren } = useSelector((state) => state.userChildrenList);
  const updateResult = useSelector((state) => state.userBuilderStatus?.updateResult);
  const dappUser = useSelector((state) => state.user?.dappUser);

  // --- NEW: community builder switch state ---

  useEffect(() => {
    dispatch(fetchFamilyMember(dialogValues.flaskUserId));
  }, [updateResult, dialogValues]);

  useEffect(() => {
    dispatch(fetchUserChildren(dialogValues.flaskUserId));
    return () => {
      dispatch({ type: USER_CHILDREN_RESET });
    };
    // keep dependency minimal and relevant
  }, [dispatch, dialogValues]);

  const handleClose = () => {
    setDialogValues({});
  };

  const handleToggleCommunityBuilder = () => {
    dispatch(updateBuilderStatus(dappUser.flaskUserId));
  };

  const childrenList = Array.isArray(userChildren) ? userChildren : null;

  // responsive cols for ImageList
  const cols = smUp ? 3 : 2;

  return (
    <>
      {dappUser && (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="user-dialog-title"
          open={open}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="user-dialog-title">
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="subtitle1" noWrap>
                {dappUser.id ?? '-'}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ color: (t) => t.palette.grey[500] }}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent dividers>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                alt={
                  `${dappUser.firstName ?? ''} ${dappUser.lastName ?? ''}`.trim() || 'User avatar'
                }
                src={prepareUrl(dappUser.avatarUrl)}
                sx={{ width: 100, height: 100 }}
              />

              <Typography variant="h6">
                {dappUser.firstName ? dappUser.firstName : '-'}{' '}
                {dappUser.lastName ? dappUser.lastName : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dappUser.userName ? dappUser.userName : '-'}
              </Typography>

              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={dappUser.isBuilder}
                      onChange={handleToggleCommunityBuilder}
                      size="small"
                      inputProps={{ 'aria-label': 'community builder toggle' }}
                    />
                  }
                  label="Community builder"
                />
              </Box>

              <Divider sx={{ width: '100%', my: 1 }} />

              <Grid container spacing={1} sx={{ width: '100%', px: 1 }}>
                <Grid item xs={4} sm={2}>
                  <Typography>Email</Typography>
                </Grid>
                <Grid item xs={8} sm={10}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ bgcolor: '#313131', borderRadius: 1, p: 1 }}
                  >
                    {dappUser.is_email_verified && (
                      <CheckCircleOutlineIcon
                        sx={{ ml: 1, mr: 1, width: 20, height: 20, color: 'lightBlue' }}
                      />
                    )}
                    <Typography sx={{ direction: 'rtl' }}>
                      {dappUser.emailAddress ? dappUser.emailAddress : '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4} sm={2}>
                  <Typography>Phone</Typography>
                </Grid>
                <Grid item xs={8} sm={10}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ p: 1 }}>
                    {dappUser.is_phonenumber_verified && (
                      <CheckCircleOutlineIcon
                        sx={{ ml: 1, mr: 1, width: 20, height: 20, color: 'lightBlue' }}
                      />
                    )}
                    <Typography sx={{ direction: 'rtl' }}>
                      {dappUser.phone_number ? dappUser.phone_number : '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={4} sm={2}>
                  <Typography>Birth Date</Typography>
                </Grid>
                <Grid item xs={8} sm={10}>
                  <Typography>{dappUser.birthDate ? dappUser.birthDate : '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ width: '100%', my: 2 }} />

              <Box sx={{ width: '100%', textAlign: 'center' }}>
                {!childrenList ? (
                  // loading or empty depending on fetch
                  userChildren === undefined ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Typography sx={{ p: 2 }}>No Children :(</Typography>
                  )
                ) : (
                  <ImageList cols={cols} gap={8} sx={{ width: '100%' }}>
                    {childrenList.map((c) => (
                      <ImageListItem
                        key={c.id}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 1,
                          bgcolor: 'grey',
                          boxShadow: 2,
                        }}
                      >
                        <Avatar
                          alt={c.firstName_translations?.en ?? ''}
                          src={prepareUrl(c.awakeAvatarUrl)}
                          sx={{ width: 50, height: 50, bgcolor: 'lightGrey', mb: 1 }}
                        />

                        <Typography sx={{ lineHeight: 1.2, fontSize: 14, textAlign: 'center' }}>
                          {c.firstName_translations?.fa
                            ? c.firstName_translations.fa
                            : c.firstName_translations?.en
                            ? c.firstName_translations.en
                            : '-'}{' '}
                          {c.lastName_translations?.fa
                            ? c.lastName_translations.fa
                            : c.lastName_translations?.en
                            ? c.lastName_translations.en
                            : '-'}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          ({c.sayname_translations?.fa ? c.sayname_translations.fa : '-'})
                        </Typography>
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      )}
    </>
  );
}
