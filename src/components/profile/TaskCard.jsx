import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import getAge from '../../utils/helpers';

const options = ['Action', 'Another Action', 'Something else here'];

const TaskCard = ({ need }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  console.log(need);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Card
        sx={{
          p: 0,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar
              src={need.child.awakeAvatarUrl}
              sx={{
                borderRadius: '50%',
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
                fontWeight="600"
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                {need.child.sayName}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="200">
                {getAge(need.child.birthDate)} yrs
              </Typography>
            </Box>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <Tooltip title="Action">
                <IconButton
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <FeatherIcon icon="more-horizontal" width="18" />
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
          </Box>
        </CardContent>
        <CardContent
          sx={{
            p: '20px',
            pt: 0,
          }}
        >
          <Typography
            color="textSecondary"
            variant="h5"
            fontWeight="400"
            sx={{
              mt: 1,
            }}
          >
            {need.title}
          </Typography>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Paid: {need.paid.toLocaleString()}
          </Typography>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Cost: {need.cost.toLocaleString()}
          </Typography>
        </CardContent>

        <Box sx={{ position: 'relative' }}>
          <Chip
            sx={{
              position: 'absolute',
              m: 1,
              color: '#00e8fd',
              backgroundColor: '#006B75',
            }}
            label={need.typeName}
            size="small"
          />
          <img
            style={{ opacity: '50%' }}
            srcSet={`${need.needRetailerImg} 1x, ${need.needRetailerImg} 2x`}
            alt={need.needRetailerImg}
            width="100%"
          />
        </Box>

        <Link href={need.affiliateLinkUrl} underline="none">
          Affiliate
        </Link>
        <Box
          sx={{
            display: {
              sm: 'flex',
              xs: 'block',
              lg: 'flex',
            },
            alignItems: 'center',
            pl: '20px',
            pr: '20px',
            pt: '20px',
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              m: 'auto',
            }}
          >
            <Link href="/" color="inherit" underline="none">
              <Typography variant="h6" fontWeight="600">
                6 Comments
              </Typography>
            </Link>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  need: PropTypes.object,
};
