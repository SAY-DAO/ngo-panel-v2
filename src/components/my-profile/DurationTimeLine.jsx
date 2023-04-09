import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Grid, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { NeedTypeEnum } from '../../utils/types';

export default function DurationTimeLine({ need }) {
  const { t } = useTranslation();
  const { ipfs } = useSelector((state) => state.signature);
  const theIpfs = need.ipfs || ipfs;

  // for analytics we get different variables
  const theNeed = need;
  if (theNeed.child_delivery_date) {
    theNeed.childDeliveryDate = need.child_delivery_date;
  }
  if (theNeed.expected_delivery_date) {
    theNeed.expectedDeliveryDate = need.expected_delivery_date;
  }
  if (theNeed.purchase_date) {
    theNeed.purchaseDate = need.purchase_date;
  }
  if (theNeed.ngo_delivery_date) {
    theNeed.ngoDeliveryDate = need.ngo_delivery_date;
  }

  return (
    <Timeline position="alternate" sx={{ pt: 4, pl: 0, pr: 0 }}>
      {theIpfs && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(
              moment(theIpfs.createdAt).diff(moment(theNeed.childDeliveryDate), 'days'),
              10,
            ) > 1
              ? `${moment(theIpfs.createdAt).diff(moment(theNeed.childDeliveryDate), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theIpfs.createdAt).diff(moment(theNeed.childDeliveryDate), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{theIpfs.createdAt}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.childDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.type === NeedTypeEnum.PRODUCT && theNeed.childDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(
              moment(theNeed.childDeliveryDate).diff(moment(theNeed.ngoDeliveryDate), 'days'),
              10,
            ) > 1
              ? `${moment(theNeed.childDeliveryDate).diff(
                  moment(theNeed.ngoDeliveryDate),
                  'days',
                )} ${t('myPage.taskCard.date.days')}`
              : `${moment(theNeed.childDeliveryDate).diff(
                  moment(theNeed.ngoDeliveryDate),
                  'hours',
                )} ${t('myPage.taskCard.date.hours')}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{theNeed.childDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.childDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.type === NeedTypeEnum.PRODUCT && theNeed.ngoDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(
              moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.purchaseDate), 'days'),
              10,
            ) > 1
              ? `${moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.purchaseDate), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.purchaseDate), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{theNeed.ngoDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.ngoDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.type === NeedTypeEnum.SERVICE && theNeed.childDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(
              moment(theNeed.childDeliveryDate).diff(moment(theNeed.ngoDeliveryDate), 'days'),

              10,
            ) > 1
              ? `${moment(theNeed.childDeliveryDate).diff(
                  moment(theNeed.ngoDeliveryDate),
                  'days',
                )} ${t('myPage.taskCard.date.days')}`
              : `${moment(theNeed.childDeliveryDate).diff(
                  moment(theNeed.ngoDeliveryDate),
                  'hours',
                )} ${t('myPage.taskCard.date.hours')}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{theNeed.childDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.childDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.type === NeedTypeEnum.PRODUCT && theNeed.purchaseDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(moment(theNeed.purchaseDate).diff(moment(theNeed.doneAt), 'days'), 10) > 1
              ? `${moment(theNeed.purchaseDate).diff(moment(theNeed.doneAt), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theNeed.purchaseDate).diff(moment(theNeed.doneAt), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{theNeed.purchaseDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.purchased')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.type === NeedTypeEnum.SERVICE && theNeed.ngoDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.doneAt), 'days'), 10) > 1
              ? `${moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.doneAt), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theNeed.ngoDeliveryDate).diff(moment(theNeed.doneAt), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{theNeed.ngoDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.moneyToNgo')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.doneAt && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(moment(theNeed.doneAt).diff(moment(theNeed.confirmDate), 'days'), 10) > 1
              ? `${moment(theNeed.doneAt).diff(moment(theNeed.confirmDate), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theNeed.doneAt).diff(moment(theNeed.confirmDate), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{theNeed.doneAt}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>{t('myPage.taskCard.date.paid')}</TimelineContent>
        </TimelineItem>
      )}
      {theNeed.confirmDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(moment(theNeed.confirmDate).diff(moment(theNeed.created), 'days'), 10) > 1
              ? `${moment(theNeed.confirmDate).diff(moment(theNeed.created), 'days')} ${t(
                  'myPage.taskCard.date.days',
                )}`
              : `${moment(theNeed.confirmDate).diff(moment(theNeed.created), 'hours')} ${t(
                  'myPage.taskCard.date.hours',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{theNeed.confirmDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>
            {theNeed.confirmDate && t('myPage.taskCard.date.confirmed')}
          </TimelineContent>
        </TimelineItem>
      )}
      {theNeed.created && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary" fontSize={12}>
            {parseInt(moment().diff(moment(theNeed.created), 'days'), 10) > 1
              ? `${moment().diff(moment(theNeed.created), 'days')} ${t(
                  'myPage.taskCard.date.daysAgo',
                )}`
              : `${moment().diff(moment(theNeed.created), 'hours')} ${t(
                  'myPage.taskCard.date.hoursAgo',
                )}`}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{theNeed.created}</Typography>}>
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent fontSize={12}>
            {theNeed.created && t('myPage.taskCard.date.created')}
          </TimelineContent>
        </TimelineItem>
      )}
      <Grid container direction="column">
        <Grid item sx={{ textAlign: 'center' }}>
          <Typography color="textSecondary" variant="h5" fontWeight="600">
            {t('myPage.taskCard.duration')}:{' '}
            {moment(theNeed.childDeliveryDate).diff(moment(theNeed.doneAt), 'days') || '-'}
            {t('myPage.taskCard.date.days')}
          </Typography>
        </Grid>
        <Grid item sx={{ textAlign: 'center' }}>
          <Typography color="textSecondary" variant="h6" fontWeight="400">
            {t('myPage.taskCard.durationEstimate')}: {theNeed.doingDuration || '-'}
            {t('myPage.taskCard.date.days')}
          </Typography>
        </Grid>
        <Grid item>
          {theNeed.updated && (
            <Grid item xs={12} sx={{ pt: 1, textAlign: 'center' }}>
              <Typography color="textSecondary" fontSize={10} fontWeight="400">
                <strong>{`${t('myPage.taskCard.date.updated')}: `} </strong>
                {moment().diff(moment(theNeed.updated), 'days')}
                {` ${t('myPage.taskCard.date.daysAgo')}`}
                <br />
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Timeline>
  );
}

DurationTimeLine.propTypes = {
  need: PropTypes.object,
};
