import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import { animated, useSpring } from 'react-spring';
import { Card, CircularProgress, Collapse, Grid, Typography } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../container/PageContainer';
import { fetchChildAnalytics, fetchNgosAnalytics } from '../../../redux/actions/analyticAction';

function MinusSquare(props) {
  return (
    <>
      <FeatherIcon icon="folder-minus" style={{ width: 15, height: 15 }} {...props} />
    </>
  );
}

function PlusSquare(props) {
  return (
    <>
      <FeatherIcon icon="folder-plus" style={{ width: 15, height: 15 }} {...props} />
    </>
  );
}

function CloseSquare(props) {
  return (
    <>
      <FeatherIcon icon="folder" style={{ width: 15, height: 15 }} {...props} />
    </>
  );
}

function TransitionComponent(props) {
  const styles = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div>
      <Collapse {...props} style={styles} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const NgoTreeview = () => {
  const dispatch = useDispatch();

  const childNeedsAnalytics = useSelector((state) => state.childNeedsAnalytics);
  const { needsResult, childrenResult, childResult } = childNeedsAnalytics;

  const ngosAnalytics = useSelector((state) => state.ngosAnalytics);
  const { ngosResult } = ngosAnalytics;

  useEffect(() => {
    if (needsResult && childrenResult) {
      dispatch(fetchNgosAnalytics());
    }
  }, [childrenResult, needsResult]);

  const child = childResult && childResult.child;
  const needs = childResult && childResult.childNeedsStats;
  return (
    <PageContainer title="NgoTreeview" description="this is NgoTreeview page">
      {!ngosResult ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={8}>
            <Card>
              <TreeView
                aria-label="customized"
                defaultExpanded={['1']}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
              >
                <StyledTreeItem nodeId="1" label="NGOs">
                  {ngosResult &&
                    ngosResult.map((n) => (
                      <StyledTreeItem key={n.id} nodeId={n.id.toString() + n.name} label={n.name}>
                        {n.children.map((c) => (
                          <StyledTreeItem
                            key={c.id}
                            nodeId={c.id.toString() + c.sayname_translations.en}
                            label={c.sayname_translations.en}
                            onClick={() => dispatch(fetchChildAnalytics(c.id))}
                          />
                        ))}
                      </StyledTreeItem>
                    ))}
                </StyledTreeItem>
              </TreeView>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ height: 425 }}>
              {needs && (
                <>
                  <Typography>Child Id: {child.id}</Typography>
                  <Typography>Child: {child.sayname_translations.en}</Typography>
                  <Typography>Child: {`${child.isConfirmed}`}</Typography>
                  <br />
                  <Typography>Child All Needs: {needs.all}</Typography>
                  <Typography>Confirmed: {needs.confirmed}</Typography>
                  <Typography>UnConfirmed: {needs.unConfirmed}</Typography>
                  <Typography>ConfirmedNotPaid: {needs.confirmedNotPaid}</Typography>
                  <Typography>CompletePay: {needs.completePay}</Typography>
                  <Typography>PartialPay: {needs.partialPay}</Typography>
                  <Typography>Purchased: {needs.purchased}</Typography>
                  <Typography>MoneyToNgo: {needs.moneyToNgo}</Typography>
                  <Typography>DeliveredNgo: {needs.deliveredNgo}</Typography>
                  <Typography>DeliveredChild: {needs.deliveredChild}</Typography>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      )}
    </PageContainer>
  );
};

export default NgoTreeview;
