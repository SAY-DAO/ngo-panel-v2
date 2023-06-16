import React from 'react';
import {
  Box,
  MenuItem,
  MenuList,
  ListItemIcon,
  Typography,
  Avatar,
  Divider,
  Card,
} from '@mui/material';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FeatherIcon from 'feather-icons-react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const handleEdit = () => {
    navigate(`/sw/edit/${swInfo.id}`);
  };
  const handleChangePass = () => {
    navigate('/profile/changePass');
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
        <MenuList disablePadding>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditRoundedIcon />
            </ListItemIcon>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  lineHeight: '1.235',
                }}
              >
                {t('profile.settings.edit')}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                {t('profile.settings.settings')}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleChangePass}>
            <ListItemIcon>
              <LockResetRoundedIcon />
            </ListItemIcon>
            <Box>{t('profile.settings.changePass')}</Box>
          </MenuItem>
          <MenuItem onClick={() => window.open(`https://docs.saydao.org`)} sx={{ mt: 4 }}>
            <Box sx={{ m: 'auto' }}>{t('profile.settings.docs')}</Box>
          </MenuItem>
        </MenuList>
      </Card>
    </Box>
  );
};

export default ProfileDropdown;
