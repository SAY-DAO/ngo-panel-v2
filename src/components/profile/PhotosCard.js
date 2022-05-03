import React from 'react';
import { Box, Card, CardContent, Typography, ImageList, ImageListItem } from '@mui/material';

import img1 from '../../assets/images/user2.svg';

const photos = [
  {
    img: img1,
    id: 1,
  },
  {
    img: img1,
    id: 2,
  },
  {
    img: img1,
    id: 3,
  },
  {
    img: img1,
    id: 4,
  },
  {
    img: img1,
    id: 5,
  },
  {
    img: img1,
    id: 6,
  },
  {
    img: img1,
    id: 7,
  },
  {
    img: img1,
    id: 8,
  },
  {
    img: img1,
    id: 9,
  },
];

const PhotosCard = () => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Typography variant="h3" fontWeight="500">
          Photos
        </Typography>
      </Box>
      <ImageList cols={3} gap={20}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <img
              srcSet={`${photo.img} 1x, ${photo.img} 2x`}
              alt={photo.img}
              loading="lazy"
              style={{ borderRadius: 8 }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </CardContent>
  </Card>
);

export default PhotosCard;
