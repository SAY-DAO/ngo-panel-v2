import React from 'react';
import { Box, MenuItem, Typography, Avatar, Divider, AvatarGroup, Tooltip } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getUserSAYRoleString } from '../../../utils/helpers';

const NotificationDropdown = ({ unReads }) => {
  const { t } = useTranslation();
  return (
    <Box>
      {unReads &&
        unReads.map((ticket) => (
          <Box key={ticket.id}>
            <MenuItem
              sx={{
                pt: 2,
                pb: 2,
                borderRadius: '0px',
              }}
            >
              <Box display="flex" alignItems="center">
                <AvatarGroup max={2}>
                  {ticket.contributors.map((c) => (
                    <Tooltip
                      title={`${c.firstName} - ${t(`roles.${getUserSAYRoleString(c.typeId)}`)}`}
                      key={c.id}
                    >
                      <Avatar
                        alt={c.firstName}
                        src={c.avatarUrl}
                        sx={{
                          width: '30px',
                          height: '30px',
                          backgroundColor: (theme) => theme.palette.grey.A200,
                        }}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
                <Box
                  sx={{
                    ml: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    noWrap
                    sx={{
                      width: '240px',
                    }}
                  >
                    {ticket.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      width: '240px',
                    }}
                    noWrap
                  >
                    {ticket.ticket}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {ticket.updatedAt}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <Divider
              style={{
                marginTop: 0,
                marginBottom: 0,
              }}
            />
          </Box>
        ))}
    </Box>
  );
};

export default NotificationDropdown;

NotificationDropdown.propTypes = {
  unReads: PropTypes.array,
};
