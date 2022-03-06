import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const CardTemplate = ({ children, style, pathTo }) => (
  <Card sx={{ width: 180, ...style }}>
    <CardActionArea sx={{ height: '100%' }} component={Link} to={pathTo || '#'}>
      <Grid
        container
        justifyContent="space-between"
        direction="column"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        {children}
      </Grid>
    </CardActionArea>
  </Card>
);

CardTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  pathTo: PropTypes.string,
};

export default CardTemplate;
