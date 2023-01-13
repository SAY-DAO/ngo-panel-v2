/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  ListItem,
  Grid,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {
  PaymentStatusEnum,
  getAge,
  NeedTypeEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
} from '../../utils/helpers';

const TaskCard = ({ need }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
          maxHeight: '300px',
          '&:hover': {
            maxHeight: '700px',
          },
          border: 'solid',
          borderColor: (theme) => theme.palette.secondary.light,
          borderWidth: '0.1em',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Box
              // src=
              sx={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background: need.awakeAvatarUrl
                  ? `url(${need.awakeAvatarUrl})`
                  : `url(${need.imageUrl})`,
                '&:hover': {
                  background: `url(${need.imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                },
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
            <Box
              sx={{
                ml: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{
                  whiteSpace: 'nowrap',
                  fontSize: 12,
                }}
              >
                {need.childFirstName} {need.childLastName}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="200" sx={{ fontSize: 10 }}>
                {need.childSayName}
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
                <MenuItem onClick={() => navigate(`/children/edit/${need.child_id}`)}>
                  Edit Child
                </MenuItem>
                <MenuItem onClick={() => navigate(`/need/edit/${need.child_id}/${need.id}`)}>
                  Edit Need
                </MenuItem>
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
            fontWeight="600"
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
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            Duration: {need.duration || '-'}
          </Typography>
        </CardContent>
        {need.affiliateLinkUrl && (
          <Link href={need.affiliateLinkUrl} underline="none" target="_blank">
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              Affiliate
            </Typography>
          </Link>
        )}
        {need.link && (
          <Link href={need.link} underline="none" target="_blank">
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              Link
            </Typography>
          </Link>
        )}

        <Box sx={{ position: 'relative' }}>
          <ListItem
            sx={{
              position: 'absolute',
            }}
          >
            {need.unpayable && (
              <Chip
                sx={{
                  color: '#000000',
                  backgroundColor: '#ff0000',
                }}
                label="unpayable"
                size="small"
              />
            )}
            {!need.isConfirmed && (
              <Chip
                sx={{
                  color: '#000000',
                  backgroundColor: '#ff0000',
                }}
                label="Not Confirmed"
                size="small"
              />
            )}
          </ListItem>
          <ListItem
            sx={{
              mt: (need.unpayable || !need.isConfirmed) && '30px',
              position: 'absolute',
            }}
          >
            <Chip
              sx={{
                color: '#000000',
                backgroundColor: need.type === NeedTypeEnum.PRODUCT ? '#ff9d23' : '#0397ff',
              }}
              label={need.type_name}
              size="small"
            />
            <Chip
              sx={{
                m: 1,
                color: '#000000',
                backgroundColor:
                  need.status === PaymentStatusEnum.PARTIAL_PAY
                    ? '#ddf96a'
                    : need.status === PaymentStatusEnum.COMPLETE_PAY
                    ? '#00ffb8'
                    : need.status === PaymentStatusEnum.NOT_PAID
                    ? '#f331a6'
                    : '#00ffb8',
              }}
              label={
                need.status === PaymentStatusEnum.PARTIAL_PAY
                  ? 'Partial Pay'
                  : need.status === PaymentStatusEnum.NOT_PAID
                  ? 'Not Paid'
                  : 'Complete Pay'
              }
              size="small"
            />
          </ListItem>
          {((need.type === NeedTypeEnum.PRODUCT && need.status === ProductStatusEnum.DELIVERED) ||
            (need.type === NeedTypeEnum.SERVICE &&
              need.status === ServiceStatusEnum.DELIVERED)) && (
            <ListItem
              sx={{
                mt: '40px',
                position: 'absolute',
              }}
            >
              <Chip
                sx={{
                  color: '#000000',
                  backgroundColor: '#1bf500',
                }}
                label="Delivered"
                size="small"
              />
            </ListItem>
          )}
          <img
            style={{ opacity: '50%', minHeight: '100px' }}
            srcSet={`${need.img} 1x, ${need.img} 2x`}
            alt={need.img}
            width="100%"
          />
          <Grid container sx={{ p: 1 }}>
            {need.created && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                created: {moment().diff(moment(need.created), 'days')} days ago
                <br />
              </Typography>
            )}
            {need.updated && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                updated: {moment().diff(moment(need.updated), 'days')} days ago
                <br />
              </Typography>
            )}
            {need.confirmDate && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                confirmed: {moment().diff(moment(need.confirmDate), 'days')} days ago
                <br />
              </Typography>
            )}
            {need.purchase_date && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                Purchased: {moment().diff(moment(need.purchase_date), 'days')} days ago
              </Typography>
            )}
            {need.ngo_delivery_date && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                Ngo Delivery: {moment().diff(moment(need.ngo_delivery_date), 'days')} days ago
              </Typography>
            )}
            {need.child_delivery_date && (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                Child Delivery: {moment().diff(moment(need.child_delivery_date), 'days')} days ago
              </Typography>
            )}
          </Grid>
        </Box>
      </Card>
      {/* <Box
        sx={{
          display: {
            sm: 'flex',
            xs: 'block',
            lg: 'flex',
          },
          alignItems: 'center',
          pl: '20px',
          pr: '20px',
          pb: '20px',
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
      </Box> */}
    </Box>
  );
};

export default TaskCard;

TaskCard.propTypes = {
  need: PropTypes.object,
};
