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
import { NeedTypeEnum } from '../../utils/types';

export default function DurationTimeLine({ need }) {
  const { t } = useTranslation();

  return (
    <Timeline position="alternate">
      {need.type === NeedTypeEnum.PRODUCT && need.childDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(
              moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'days'),
              10,
            ) > 1
              ? moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{need.childDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('myPage.taskCard.date.childDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {need.type === NeedTypeEnum.PRODUCT && need.ngoDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment(need.ngoDeliveryDate).diff(moment(need.purchaseDate), 'days'), 10) > 1
              ? moment(need.ngoDeliveryDate).diff(moment(need.purchaseDate), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.ngoDeliveryDate).diff(moment(need.purchaseDate), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.ngoDeliveryDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            {need.type === NeedTypeEnum.PRODUCT &&
              need.ngoDeliveryDate &&
              t('myPage.taskCard.date.ngoDelivery')}
          </TimelineContent>
        </TimelineItem>
      )}
      {need.type === NeedTypeEnum.SERVICE && need.childDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(
              moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'days'),
              10,
            ) > 1
              ? moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.childDeliveryDate).diff(moment(need.ngoDeliveryDate), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip
              title={<Typography sx={{ fontSize: 12 }}>{need.childDeliveryDate}</Typography>}
            >
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('myPage.taskCard.date.childDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {need.type === NeedTypeEnum.PRODUCT && need.purchaseDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment(need.purchaseDate).diff(moment(need.doneAt), 'days'), 10) > 1
              ? moment(need.purchaseDate).diff(moment(need.doneAt), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.purchaseDate).diff(moment(need.doneAt), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.purchaseDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('myPage.taskCard.date.purchased')}</TimelineContent>
        </TimelineItem>
      )}
      {need.type === NeedTypeEnum.SERVICE && need.ngoDeliveryDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment(need.ngoDeliveryDate).diff(moment(need.doneAt), 'days'), 10) > 1
              ? moment(need.ngoDeliveryDate).diff(moment(need.doneAt), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.ngoDeliveryDate).diff(moment(need.doneAt), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.ngoDeliveryDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('myPage.taskCard.date.ngoDelivery')}</TimelineContent>
        </TimelineItem>
      )}
      {need.isDone && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment(need.doneAt).diff(moment(need.confirmDate), 'days'), 10) > 1
              ? moment(need.doneAt).diff(moment(need.confirmDate), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.doneAt).diff(moment(need.confirmDate), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.doneAt}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t('myPage.taskCard.date.paid')}</TimelineContent>
        </TimelineItem>
      )}
      {need.confirmDate && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment(need.confirmDate).diff(moment(need.created), 'days'), 10) > 1
              ? moment(need.confirmDate).diff(moment(need.created), 'days') +
                t('myPage.taskCard.date.days')
              : moment(need.confirmDate).diff(moment(need.created), 'hours') +
                t('myPage.taskCard.date.hours')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.confirmDate}</Typography>}>
              <TimelineDot variant="outlined" color="primary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            {need.confirmDate && t('myPage.taskCard.date.confirmed')}
          </TimelineContent>
        </TimelineItem>
      )}
      {need.created && (
        <TimelineItem>
          <TimelineOppositeContent color="text.secondary">
            {parseInt(moment().diff(moment(need.created), 'days'), 10) > 1
              ? moment().diff(moment(need.created), 'days') + t('myPage.taskCard.date.daysAgo')
              : moment().diff(moment(need.created), 'hours') + t('myPage.taskCard.date.hoursAgo')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <Tooltip title={<Typography sx={{ fontSize: 12 }}>{need.created}</Typography>}>
              <TimelineDot variant="outlined" color="secondary" />
            </Tooltip>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{need.created && t('myPage.taskCard.date.created')}</TimelineContent>
        </TimelineItem>
      )}
      <Grid container>
        <Typography color="textSecondary" variant="h6" fontWeight="400">
          {t('myPage.taskCard.duration')}: {need.doingDuration || '-'}
          {t('myPage.taskCard.date.daysAgo')}
        </Typography>
      </Grid>
    </Timeline>
  );
}

DurationTimeLine.propTypes = {
  need: PropTypes.object,
};
