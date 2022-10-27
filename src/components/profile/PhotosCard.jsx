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
      <ImageList cols={3} gap={1}>
        {myChildren
          .filter((child) => child.isConfirmed)
          .map((child) => (
            <Card key={child.id} elevation={5} sx={{ minWidth: '40px', m: 1 }}>
              <ImageListItem>
                <img
                  srcSet={`${child.awakeAvatarUrl} 1x, ${child.awakeAvatarUrl} 2x`}
                  alt={child.awakeAvatarUrl}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
              </ImageListItem>
              <Typography variant="subtitle1">SW</Typography>
              <Typography variant="subtitle1">SW</Typography>
              <Typography variant="subtitle1">SW</Typography>
            </Card>
          ))}
      </ImageList>
    </CardContent>
  </Card>
);

PhotosCard.propTypes = {
  myChildren: PropTypes.array,
};
export default PhotosCard;
