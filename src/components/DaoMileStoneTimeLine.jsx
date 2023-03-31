import React from 'react';
import { Menu, MenuItem, IconButton, Typography, Box, Tooltip, Grid } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import DashboardCard from './dao/DashboardCard';

const options = ['Action', 'Another Action', 'Something else here'];

const activities = [
  {
    time: '09.50',
    color: 'success.main',
    text: 'Meeting with John',
  },
  {
    time: '09.46',
    color: 'secondary.main',
    text: 'Payment received of $385.90',
  },
  {
    time: '09.47',
    color: 'primary.main',
    text: 'Project Meeting',
  },
  {
    time: '09.48',
    color: 'warning.main',
    text: 'New Sale recorded #ML-3467',
  },
  {
    time: '09.49',
    color: 'error.main',
    text: 'Payment was made to Michael Anderson',
  },
];

const DaoMileStoneTimeLine = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Grid container direction="row" justifyContent="space-around" alignItems="center" spacing={4}>
      <Grid item xs={5}>
        <DashboardCard
          title="Atousa"
          action={
            <Box>
              <Tooltip title="Action">
                <IconButton
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  size="large"
                  aria-label="action"
                >
                  <FeatherIcon icon="more-horizontal" />
                </IconButton>
              </Tooltip>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          }
        >
          <Timeline
            sx={{
              p: 0,
              mb: 0,
              mt: 0,
            }}
          >
            {activities.map((activity) => (
              <TimelineItem key={activity.time}>
                <TimelineOppositeContent
                  sx={{
                    flex: '0',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="700">
                    {activity.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    sx={{
                      borderColor: activity.color,
                    }}
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent color="text.secondary" variant="h6">
                  {activity.text}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DashboardCard>
      </Grid>
      <Grid item xs={5}>
        <DashboardCard
          title="MileStone Steps  "
          action={
            <Box>
              <Tooltip title="Action">
                <IconButton
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  size="large"
                  aria-label="action"
                >
                  <FeatherIcon icon="more-horizontal" />
                </IconButton>
              </Tooltip>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          }
        >
          <Timeline
            sx={{
              p: 0,
              mb: 0,
              mt: 0,
            }}
          >
            {activities.map((activity) => (
              <TimelineItem key={activity.time}>
                <TimelineOppositeContent
                  sx={{
                    flex: '0',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="700">
                    {activity.time}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    variant="outlined"
                    sx={{
                      borderColor: activity.color,
                    }}
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent color="text.secondary" variant="h6">
                  {activity.text}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default DaoMileStoneTimeLine;
