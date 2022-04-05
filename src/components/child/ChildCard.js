import React from 'react';
import { CardContent, CardMedia, Typography, Grid } from '@mui/material';

import CardTemplate from '../base-card/CardTemplate';

const ChildCard = () => (
  <CardTemplate style={{ height: 290 }} pathTo="/ChildPage">
    <CardMedia component="img" src="#" title="child name" />
    <CardContent sx={{ width: '100%' }}>
      <Typography variant="h6" align="center" paragraph>
        Child name
      </Typography>
      <Typography variant="subtitle2">
        <Grid container justifyContent="space-between">
          <Grid item>Needs count:</Grid>
          <Grid item>54</Grid>
        </Grid>
      </Typography>
      <Typography variant="subtitle2">
        <Grid container justifyContent="space-between">
          <Grid item>Done needs:</Grid>
          <Grid item>0</Grid>
        </Grid>
      </Typography>
    </CardContent>
  </CardTemplate>
);

export default ChildCard;
