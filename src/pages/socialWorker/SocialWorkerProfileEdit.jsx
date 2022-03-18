import React, { useEffect } from 'react';
import {
  Avatar,
  Card,
  Grid,
  Typography,
  Button,
  Autocomplete,
  CircularProgress,
  Badge,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { fetchSocialWorkerProfile } from '../../redux/actions/socialWorkerAction';

const Teams = [
  {
    id: 'eric',
    label: 'Eric',
  },
  {
    id: 'joao',
    label: 'Joao',
  },
  {
    id: 'tushly',
    label: 'Tushly',
  },
  {
    id: 'pnaji',
    label: 'Pnaji',
  },
];
const SocialWorkerProfileEdit = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, loading: loadingSwDetails, success: successSwDetails } = swDetails;

  useEffect(() => {
    if (!successSwDetails) {
      dispatch(fetchSocialWorkerProfile());
    }
  }, [successSwDetails]);

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 62,
    height: 62,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <PageContainer title="Customer Edit" description="this is Customer Edit page">
      {loadingSwDetails ? (
        <CircularProgress />
      ) : (
        swInfo && (
          <>
            <Breadcrumb title="Edit page" subtitle="Customer" />
            <Grid container spacing={0}>
              <Grid item lg={4} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Button onClick={handleClickOpen}>
                        <SmallAvatar
                          alt="ID card"
                          src={swInfo.idCardUrl}
                          sx={{ boxShadow: '3px 4px #888888' }}
                        />
                      </Button>
                    }
                  >
                    <Avatar
                      alt="Travis Howard"
                      src={swInfo && swInfo.avatarUrl}
                      sx={{ width: 110, height: 110 }}
                    />
                  </Badge>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {swInfo && `${swInfo.firstName} ${swInfo.lastName}`}
                  </Typography>
                  <Typography variant="body2"> {swInfo && swInfo.typeName}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2">{swInfo && swInfo.email}</Typography>
                  <Typography variant="h6" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body2">{swInfo && swInfo.phoneNumber}</Typography>
                </Card>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                    Edit Details
                  </Typography>
                  <form>
                    <CustomFormLabel htmlFor="firstName">First Name</CustomFormLabel>
                    <CustomTextField
                      id="firstName"
                      variant="outlined"
                      defaultValue={swInfo.firstName}
                      fullWidth
                      size="small"
                    />
                    <CustomFormLabel htmlFor="lastName">Last Name</CustomFormLabel>
                    <CustomTextField
                      id="lastName"
                      variant="outlined"
                      defaultValue={swInfo.lastName}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <CustomFormLabel htmlFor="Email">Email</CustomFormLabel>
                    <CustomTextField
                      id="Email"
                      variant="outlined"
                      defaultValue={swInfo.email}
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <CustomFormLabel htmlFor="project">Project Name</CustomFormLabel>
                    <CustomTextField
                      id="project"
                      variant="outlined"
                      defaultValue="Hosting Press HTML"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <CustomFormLabel htmlFor="project-details">Project Description</CustomFormLabel>
                    <CustomTextField
                      id="project-details"
                      variant="outlined"
                      multiline
                      rows={4}
                      defaultValue="Sard about this site or you have been to it, but you cannot figure out what it is or what it can do. 
                        MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. which makes it much easier for someone to find what they are looking for if "
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <CustomFormLabel>Users</CustomFormLabel>

                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={Teams}
                      getOptionLabel={(option) => option.label}
                      defaultValue={[Teams[1]]}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          placeholder="users"
                          size="small"
                          aria-label="users"
                          sx={{
                            mb: 3,
                          }}
                        />
                      )}
                    />
                    <CustomFormLabel htmlFor="week">Week</CustomFormLabel>
                    <CustomTextField
                      id="week"
                      variant="outlined"
                      defaultValue="40"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <CustomFormLabel htmlFor="Budget">Budget</CustomFormLabel>
                    <CustomTextField
                      id="Budget"
                      variant="outlined"
                      defaultValue="$2.4K"
                      fullWidth
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <Button color="primary" variant="contained">
                      Update
                    </Button>
                  </form>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" sx={{ margin: 'auto' }}>
                {swInfo && `${swInfo.firstName} ${swInfo.lastName}`}
              </DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'scroll',
                    width: 400,
                    height: 300,
                    backgroundColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                >
                  <img
                    alt="social worker ID"
                    src={swInfo.idCardUrl}
                    style={{
                      position: 'absolute',
                      padding: '2px',
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )
      )}
    </PageContainer>
  );
};

export default SocialWorkerProfileEdit;
