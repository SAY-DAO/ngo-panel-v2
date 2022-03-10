import React, { useEffect } from 'react';
import { Box, MenuItem, Typography, Avatar, Divider, Card, CardActions } from '@mui/material';
import FeatherIcon from 'feather-icons-react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchSocialWorkerProfile } from '../../../redux/actions/socialWorkerAction';

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo, success: successSwDetails } = swDetails;

  useEffect(() => {
    if (!successSwDetails) {
      dispatch(fetchSocialWorkerProfile());
    }
  }, [successSwDetails]);

  const handleClick = () => {
    navigate(`/sw/edit`);
  };
  return (
    <Box>
      <Box
        sx={{
          pb: 3,
          mt: 3,
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            src={swInfo && swInfo.avatarUrl}
            alt="Social worker avatar"
            sx={{
              width: '90px',
              height: '90px',
            }}
          />
          <Box
            sx={{
              ml: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                lineHeight: '1.235',
              }}
            >
              {swInfo && `${swInfo.firstName} ${swInfo.lastName}`}
            </Typography>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {swInfo && swInfo.typeName}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                color="textSecondary"
                display="flex"
                alignItems="center"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                  mr: 1,
                }}
              >
                <FeatherIcon icon="mail" width="18" />
              </Typography>
              <Typography color="textSecondary" variant="h6">
                {swInfo && swInfo.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      />

      <Card>
        <CardActions onClick={handleClick}>
          <MenuItem
            sx={{
              pt: 3,
              pb: 3,
            }}
          >
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    lineHeight: '1.235',
                  }}
                >
                  Edit Profile
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  Account Settings
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ProfileDropdown;
