/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
  AvatarGroup,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LoadingButton } from '@mui/lab';
import { ethers } from 'ethers';
import {
  PaymentStatusEnum,
  NeedTypeEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
  RolesEnum,
} from '../../utils/types';
import { getAge } from '../../utils/helpers';
import ReportImage from '../report/ReportImage';
import ReceiptImage from './ReceiptImage';
import { connectWallet, signTransaction } from '../../redux/actions/blockchainAction';
import DurationTimeLine from './DurationTimeLine';

const TaskCard = ({ need }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const wallet = useSelector((state) => state.wallet);
  const { myWallet, loading: loadingWallet } = wallet;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleWallet = () => {
    dispatch(connectWallet());
  };
  const handleSignature = () => {
    dispatch(signTransaction(need));
  };
  return (
    <Box>
      <Card
        sx={{
          p: 0,
          maxHeight: '300px',
          '&:hover': {
            maxHeight: '1200px',
            borderColor: (theme) => theme.palette.secondary.dark,
          },
          border: 'solid',
          borderColor: (theme) => theme.palette.secondary.light,
          borderWidth: '0.1em',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                background: need.child.awakeAvatarUrl
                  ? `url(${need.child.awakeAvatarUrl})`
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
                {need.child.firstName} {need.child.lastName}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight="200" sx={{ fontSize: 11 }}>
                {need.child.sayName}
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
                {(swInfo.typeId === RolesEnum.ADMIN || swInfo.typeId === RolesEnum.SUPER_ADMIN) && (
                  <MenuItem onClick={() => navigate(`/children/edit/${need.child.id}`)}>
                    {t('myPage.taskCard.menu.updateChild')}
                  </MenuItem>
                )}

                <MenuItem onClick={() => navigate(`/need/edit/${need.child.id}/${need.id}`)}>
                  {t('myPage.taskCard.menu.updateٔNeed')}
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
              mb: 1,
            }}
          >
            {need.name}
          </Typography>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            {t('myPage.taskCard.paid')}: {need.paid.toLocaleString()}
          </Typography>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            {t('myPage.taskCard.cost')}: {need.cost.toLocaleString()}
          </Typography>
          <Grid item xs={12}>
            {need.receipts_ && need.receipts_[0] ? (
              <AvatarGroup>
                {need.receipts_.map((r) => (
                  <ReceiptImage receipt={r} key={r.id} />
                ))}
              </AvatarGroup>
            ) : (
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                {t('myPage.taskCard.noReceipt')}
              </Typography>
            )}
          </Grid>
        </CardContent>

        <Grid container>
          {need.affiliateLinkUrl && (
            <Link href={need.affiliateLinkUrl} underline="none" target="_blank">
              <Typography
                color="textSecondary"
                variant="span"
                fontWeight="400"
                sx={{ textAlign: 'center', p: 1 }}
              >
                Affiliate
              </Typography>
            </Link>
          )}
          {need.link && (
            <Link href={need.link} underline="none" target="_blank">
              <Typography
                color="textSecondary"
                variant="span"
                fontWeight="400"
                sx={{ textAlign: 'center', p: 1 }}
              >
                Link
              </Typography>
            </Link>
          )}
        </Grid>

        <Box sx={{ position: 'relative' }}>
          <ListItem
            sx={{
              position: 'absolute',
            }}
          >
            {need.type === NeedTypeEnum.PRODUCT &&
              need.status < ProductStatusEnum.PURCHASED_PRODUCT &&
              need.unpayable && (
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
                backgroundColor: need.type === NeedTypeEnum.PRODUCT ? '#9d59a8' : '#5888e3',
              }}
              label={need.type === NeedTypeEnum.PRODUCT ? 'Product' : 'Service'}
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
          {/* dates */}
          <Grid container sx={{ p: 0 }}>
            <Grid item xs={12}>
              <DurationTimeLine need={need} />
            </Grid>
          </Grid>
          <Grid container>
         
            {need.updated && (
              <Grid item xs={12}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  <strong>{t('myPage.taskCard.date.updated')}:</strong>
                  {moment().diff(moment(need.updated), 'days')} {t('myPage.taskCard.date.daysAgo')}
                  <br />
                </Typography>
              </Grid>
            )}
           
        
            {need.ngoDeliveryDate && (
              <Grid item xs={12}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  <strong>{t('myPage.taskCard.date.ngoDelivery')}: </strong>
                  {moment().diff(moment(need.ngoDeliveryDate), 'days')}{' '}
                  {t('myPage.taskCard.date.daysAgo')}
                  <br />
                </Typography>
              </Grid>
            )}
            {need.childDeliveryDate && (
              <Grid item xs={12}>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  <strong>{t('myPage.taskCard.date.childDelivery')}: </strong>
                  {moment().diff(moment(need.childDeliveryDate), 'days')}{' '}
                  {t('myPage.taskCard.date.daysAgo')}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid item sx={{ textAlign: 'center', mt: 3 }} xs={12}>
            {!myWallet ? (
              <LoadingButton onClick={handleWallet}>Connect Wallet</LoadingButton>
            ) : (
              <LoadingButton onClick={handleSignature}>Sign</LoadingButton>
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
