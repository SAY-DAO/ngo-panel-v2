/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar, Grid, ImageList, ImageListItem } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { prepareUrl } from '../../utils/helpers';
import { fetchUserChildren } from '../../redux/actions/userAction';
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

  const { userChildren } = useSelector((state) => state.userChildrenList);

  useEffect(() => {
    dispatch(fetchUserChildren(dialogValues.user.id));
    return () => {
      dispatch({ type: USER_CHILDREN_RESET });
    };
  }, []);

  const handleClose = () => {
    setDialogValues({});
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={dialogValues.open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {dialogValues.user.id}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid
            container
            direction="column"
            sx={{ textAlign: 'center' }}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Avatar
                alt="Remy Sharp"
                src={prepareUrl(dialogValues.user.avatarUrl)}
                sx={{ width: '100px', height: '100px' }}
              />
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>
                {dialogValues.user.firstName ? dialogValues.user.firstName : '-'}
                {dialogValues.user.lastName ? dialogValues.user.lastName : '-'}
              </Typography>
              <Typography gutterBottom sx={{ minHeight: '40px', lineHeight: 2.5 }}>
                {dialogValues.user.userName ? dialogValues.user.userName : '-'}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{ textAlign: 'center', bgcolor: '#313131', borderRadius: 10, padding: 2 }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={2} sx={{ minHeight: '40px', lineHeight: 2.5 }}>
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>Email</Typography>
            </Grid>
            <Grid item xs={10} sx={{ minHeight: '40px', lineHeight: 2.5 }}>
              <Typography sx={{ direction: 'rtl', minHeight: '40px', lineHeight: 2.5 }}>
                {dialogValues.user.is_email_verified && (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1, mr: 1, width: 20, height: 20, color: 'lightBlue' }}
                  />
                )}
                {dialogValues.user.emailAddress ? dialogValues.user.emailAddress : '-'}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ minHeight: '40px', lineHeight: 2.5 }}>
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>Phone</Typography>
            </Grid>
            <Grid item xs={10} sx={{ direction: 'rtl', minHeight: '40px', lineHeight: 2.5 }}>
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>
                {dialogValues.user.is_phonenumber_verified && (
                  <CheckCircleOutlineIcon
                    sx={{ ml: 1, mr: 1, width: 20, height: 20, color: 'lightBlue' }}
                  />
                )}
                {dialogValues.user.phone_number ? dialogValues.user.phone_number : '-'}
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{ minHeight: '40px', lineHeight: 2.5 }}>
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>Birth Date</Typography>
            </Grid>
            <Grid item xs={10} sx={{ minHeight: '40px' }}>
              <Typography sx={{ minHeight: '40px', lineHeight: 2.5 }}>
                {dialogValues.user.birthDate ? dialogValues.user.birthDate : '-'}
              </Typography>
            </Grid>
            {!userChildren || !userChildren[0] ? (
              <Typography sx={{ p: 10, m: 'auto', textAlign: 'center' }}>No Children :(</Typography>
            ) : (
              <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {userChildren.map((c) => (
                  <ImageListItem
                    key={c.id}
                    sx={{
                      borderRadius: 15,
                      boxShadow: 20,
                      p: 2,
                      m: 1,
                      textAlign: 'center',
                      alignItems: 'center',
                      bgcolor: 'grey',
                    }}
                  >
                    <Avatar
                      alt={c.firstName_translations.en}
                      src={prepareUrl(c.awakeAvatarUrl)}
                      sx={{ width: '50px', height: '50px', bgcolor: 'lightGrey' }}
                    />
                    <Typography sx={{ lineHeight: 2.5, fontSize: 14 }}>
                      {c.firstName_translations.fa
                        ? c.firstName_translations.fa
                        : c.firstName_translations.en
                        ? c.firstName_translations.en
                        : '-'}{' '}
                      {c.lastName_translations.fa
                        ? c.lastName_translations.fa
                        : c.lastName_translations.en
                        ? c.lastName_translations.en
                        : '-'}
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                      ({c.sayname_translations.fa ? c.sayname_translations.fa : '-'})
                    </Typography>
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
