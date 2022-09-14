import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PageContainer from '../container/PageContainer';
import BaseFeed from '../base-card/BaseFeed';
import SocialWorkerChildMigrate from './SocialWorkerChildMigrate';

const SocialWorkerCard = ({ fromSw, toSw }) => {
  console.log(fromSw, toSw);
  return (
    <PageContainer title="Migration" description="this is migration page">
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        {/* From */}
        {fromSw && fromSw.result && (
          <Grid item lg={5} md={12} xs={12}>
            <BaseFeed
              img={fromSw.result.avatarUrl}
              firstName={fromSw.result.firstName || ''}
              ngoName={fromSw.result.ngoName}
            >
              {fromSw.children && (
                <SocialWorkerChildMigrate swChildren={fromSw.children.children} />
              )}
            </BaseFeed>
          </Grid>
        )}
        {fromSw && toSw && (
          <Grid item xs={1} sx={{ mt: 10 }}>
            <ArrowRightAltIcon fontSize="large" />
          </Grid>
        )}
        {/* To */}
        {toSw && toSw.result && (
          <Grid item lg={5} md={12} xs={12}>
            <BaseFeed
              img={toSw.result.avatarUrl}
              username={toSw.result.firstName || ''}
              time={toSw.result.ngoName}
            >
              {toSw.children && <SocialWorkerChildMigrate swChildren={toSw.children.children} />}
            </BaseFeed>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};

export default SocialWorkerCard;
SocialWorkerCard.propTypes = {
  toSw: PropTypes.object,
  fromSw: PropTypes.object,
};
