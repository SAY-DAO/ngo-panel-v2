import React from 'react';
import { Box, Typography, Card, Avatar, Badge, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SocialWorkerChildMigrate = ({ swChildren }) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        p: 0,
        mb: 4,
      }}
    >
      <Box sx={{ mt: -2 }}>
        {swChildren && swChildren[0] ? (
          swChildren.map((child) => (
            <Box key={child.id}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '0px',
                }}
              >
                <Box display="flex" alignItems="center">
                  <Badge variant="dot">
                    <Avatar
                      src={child.awakeAvatarUrl}
                      alt={child.awakeAvatarUrl}
                      sx={{
                        width: '45px',
                        height: '45px',
                      }}
                    />
                  </Badge>
                  <Box
                    sx={{
                      ml: 2,
                    }}
                  >
                    <Typography variant="h5">{child.sayName}</Typography>
                    <Typography color="textSecondary" variant="h6" fontWeight="400">
                      {child.lastName} {child.firstName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 10 }}>{t('socialWorker.noChildren')}</Typography>
        )}
      </Box>
    </Card>
  );
};

export default SocialWorkerChildMigrate;

SocialWorkerChildMigrate.propTypes = {
  swChildren: PropTypes.array,
};
