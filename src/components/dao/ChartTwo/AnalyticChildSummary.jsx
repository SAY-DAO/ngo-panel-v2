import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildrenAnalytics } from '../../../redux/actions/analyticAction';

const AnalyticChildSummary = () => {
  const dispatch = useDispatch();

  const childNeedsAnalytics = useSelector((state) => state.childNeedsAnalytics);
  const { childrenResult } = childNeedsAnalytics;

  useEffect(() => {
    dispatch(fetchChildrenAnalytics());
  }, []);

  return (
    <Card
      sx={{
        pb: 0,
        pl: 0,
        pr: 0,
      }}
    >
      {!childrenResult ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <CardContent
          sx={{
            paddingLeft: '30px',
            paddingRight: '30px',
          }}
        >
          <Grid container spacing={1} justifyContent="space-between">
            <Grid
              container
              item
              xs={2}
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Typography
                variant="h5"
                color="textSecondary"
                sx={{
                  marginBottom: '0',
                }}
              >
                Children
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  mt: '1px',
                  mb: '0px',
                }}
              >
                {childrenResult.allChildren}
              </Typography>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography>
                <TagFacesIcon fontSize="medium" />
              </Typography>
              <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                {childrenResult.confirmed}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                Confirmed
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography>
                <MoodBadIcon fontSize="medium" />
              </Typography>
              <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                {childrenResult.dead}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                Passed Away
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography>
                <TagFacesIcon fontSize="medium" />
              </Typography>
              <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                {childrenResult.noNeeds || '0'}/{childrenResult.alivePresent}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                No needs/ Present
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography>
                <SentimentVeryDissatisfiedIcon fontSize="medium" />
              </Typography>
              <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                {childrenResult.aliveGone}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                Gone
              </Typography>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography>
                <SentimentDissatisfiedIcon fontSize="medium" />
              </Typography>
              <Typography
                variant="h4"
                fontWeight="600"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                {childrenResult.tempGone}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                fontWeight="400"
                sx={{
                  lineHeight: '1.2',
                }}
              >
                Temp Gone
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  );
};

export default AnalyticChildSummary;
