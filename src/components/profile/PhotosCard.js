import React from 'react';
import { Box, Card, CardContent, Typography, ImageList, ImageListItem } from '@mui/material';
import PropTypes from 'prop-types';

const PhotosCard = ({ myChildren }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Typography variant="h3" fontWeight="500">
          Photos
        </Typography>
      </Box>
      <ImageList cols={3} gap={20}>
        {myChildren.filter((child)=> child.isConfirmed).map((child) => (
          <ImageListItem key={child.id}>
            <img
              srcSet={`${child.awakeAvatarUrl} 1x, ${child.awakeAvatarUrl} 2x`}
              alt={child.awakeAvatarUrl}
              loading="lazy"
              style={{ borderRadius: 8 }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </CardContent>
  </Card>
);

PhotosCard.propTypes = {
  myChildren: PropTypes.object,
};
export default PhotosCard;
