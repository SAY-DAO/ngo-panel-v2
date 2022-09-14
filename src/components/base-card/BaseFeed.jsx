import React from 'react';
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

const BaseFeed = ({ img, firstName, ngoName, children }) => {
  return (
    <Card
      sx={{
        mb: 4,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            mb: 3,
          }}
        >
          <Avatar
            src={img}
            sx={{
              borderRadius: '10px',
              width: '50px',
              height: '50px',
            }}
          />
          <Box
            sx={{
              ml: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              {firstName}
            </Typography>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {ngoName}
            </Typography>
          </Box>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

BaseFeed.propTypes = {
  img: PropTypes.string,
  firstName: PropTypes.string,
  ngoName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default BaseFeed;
