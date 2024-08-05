/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Collapse,
  Avatar,
  Link,
  Switch,
  FormControlLabel,
  FormGroup,
  Tooltip,
} from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { prepareConfirmNeeds, massNeedConfirm } from '../../redux/actions/needsAction';
import {
  categoryToString,
  getCurrentStatusString,
  getSimilarityPercentage,
  prepareUrl,
  urlSimilarityPercentage,
} from '../../utils/helpers';
import { dateConvertor } from '../../utils/persianToEnglish';
import { colorChoices, Colors } from '../../utils/types';

const NeedConfirmTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { result, loading } = useSelector((state) => state.needPrepareConfirm);
  const { loading: loadingMassConfirm } = useSelector((state) => state.needMassConfirm);
  const [checked, setChecked] = useState(false);
  const [manualIds, setManualIds] = useState([]);
  const [totalMissMatch, setTotalMissMatch] = useState(0);
  const [confirmCandidate, setConfirmCandidate] = useState();

  const BCrumb = [
    {
      to: '/',
      title: t('BCrumb.home'),
    },
    {
      title: t('BCrumb.needsList'),
    },
  ];

  useEffect(() => {
    if (!loading) {
      dispatch(prepareConfirmNeeds());
    }
  }, []);

  function Row(props) {
    const { row } = props;

    const [open, setOpen] = React.useState(false);

    const handleManualConfirm = (id) => {
      const newList = manualIds.find((i) => id === i)
        ? manualIds
        : manualIds && manualIds[0]
        ? [...manualIds, id]
        : [id];
      setManualIds(newList);
    };
    const handleManualRemove = (id) => {
      const newList = manualIds.filter((i) => i !== id);
      setManualIds(newList);
    };
    return (
      <>
        <TableRow
          sx={{
            '& > *': {
              borderBottom: 'unset',
              // opacity: row.errorMsg ? 0.45 : row.possibleMissMatch.length ? 0.5 : 1,
              backgroundColor:
                !manualIds.find((i) => i === row.need.flaskId) &&
                row.possibleMissMatch.length > 0 &&
                !row.errorMsg
                  ? '#7f5c1b'
                  : !manualIds.find((i) => i === row.need.flaskId) && row.errorMsg
                  ? '#8f4646'
                  : !manualIds.find((i) => i === row.need.flaskId) &&
                    !row.errorMsg &&
                    row.validCount
                  ? '#695b19'
                  : manualIds.find((i) => i === row.need.flaskId) && '#235053',
            },
          }}
        >
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            {(row.errorMsg ||
              (row.validCount && row.validCount > 0) ||
              row.possibleMissMatch.length > 0) && (
              <Tooltip title="Manually add to to be confirmed list">
                {!manualIds.find((i) => i === row.need.flaskId) ? (
                  <Grid>
                    {row.ticket ? (
                      <FlagOutlinedIcon
                        sx={{
                          m: 'auto',
                          color:
                            row.ticket.color === Colors.YELLOW
                              ? colorChoices[1].code
                              : row.ticket.color === Colors.BLUE
                              ? colorChoices[0].code
                              : row.ticket.color === Colors.RED && colorChoices[2].code,
                        }}
                      />
                    ) : (
                      <IconButton
                        disabled={checked}
                        onClick={() => handleManualConfirm(row.need.flaskId)}
                      >
                        <AddCircleRoundedIcon color="success" sx={{ display: checked && 'none' }} />
                      </IconButton>
                    )}
                  </Grid>
                ) : (
                  <IconButton onClick={() => handleManualRemove(row.need.flaskId)}>
                    <RemoveCircleIcon color="danger" />
                  </IconButton>
                )}
              </Tooltip>
            )}
          </TableCell>
          <TableCell component="th" scope="row">
            <RouterLink
              style={{ textDecoration: 'none', color: '#e6e5e8', display: `flex` }}
              to={`/need/edit/${row.need.child.flaskId}/${row.need.flaskId}`}
              target="_blank"
            >
              <EditIcon sx={{ width: 20, height: 20, mr: 1 }} />
            </RouterLink>
          </TableCell>

          <TableCell component="th" scope="row">
            {row.need.flaskId}
          </TableCell>
          <TableCell align="center">
            <Grid container direction="column">
              <Avatar
                sx={{ border: '1px solid grey', m: 'auto' }}
                src={prepareUrl(row.need.imageUrl)}
              />
              <Typography sx={{ fontSize: 10 }}>
                Valid Dups: {row.duplicates ? `${row.validCount} / ${row.duplicates.length}` : 0}
              </Typography>
              <Typography sx={{ fontSize: 10 }}>
                MissMatch: {(row.possibleMissMatch && row.possibleMissMatch.length) || 0}
              </Typography>
              <Typography
                sx={{
                  maxWidth: '120px !important',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  height: '1.2em',
                  whiteSpace: 'nowrap',
                  // fontWeight: 200,
                }}
              >
                {row.need.child.ngo && row.need.child.ngo.name}
              </Typography>
            </Grid>
          </TableCell>
          <TableCell
            sx={{
              maxWidth: '120px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 200,
            }}
            align="center"
          >
            {row.need.nameTranslations.en}
            <br />
            {row.need.title}
          </TableCell>
          <TableCell align="center" sx={{ fontWeight: 200 }}>
            {row.need.child.sayNameTranslations.en}
          </TableCell>
          <TableCell align="center">
            {row.need.link && <Link href={row.need.link}>Link </Link>}
            <Typography sx={{ fontSize: 10 }}>{row.need.provider.name}</Typography>
          </TableCell>
          <TableCell align="center">{t(categoryToString(row.need.category))}</TableCell>
          <TableCell
            sx={{
              maxWidth: '200px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 150,
            }}
            align="center"
          >
            {row.need.descriptionTranslations.en}
          </TableCell>
          <TableCell>{row.need.cost.toLocaleString()}</TableCell>
          <TableCell>{dateConvertor(row.need.created)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, mb: 8 }}>
                <Typography variant="h5" gutterBottom component="div">
                  Duplicates Validation
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: row.errorMsg ? '#8f4646' : row.validCount ? '#695b19' : '#557d55' }}
                >
                  {row.errorMsg ||
                    (row.validCount && row.validCount > 0 && `${row.validCount} Valid Dup(s)`) ||
                    'All good!'}
                </Typography>
                <br />
                <Typography variant="h6" gutterBottom component="div">
                  Possible MissMatch
                </Typography>
                {row.possibleMissMatch.length > 0 ? (
                  row.possibleMissMatch.map((o) => (
                    <div key={o.needId}>
                      <RouterLink
                        style={{ textDecoration: 'none', color: '#e6e5e8', display: `flex` }}
                        to={`/need/edit/${o.childId}/${o.needId}`}
                        target="_blank"
                      >
                        Need - {t(categoryToString(o.category))} -{' '}
                        {t(`need.needStatus.${getCurrentStatusString(o)}`)}
                      </RouterLink>
                    </div>
                  ))
                ) : (
                  <Typography variant="subtitle2" gutterBottom color="secondary">
                    None
                  </Typography>
                )}

                {row && row.duplicates && row.duplicates.length > 0 && (
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Id</TableCell>
                        <TableCell align="center">Icon</TableCell>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">Child</TableCell>
                        <TableCell align="center">Link</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Description</TableCell>
                        <TableCell align="center">Price (T)</TableCell>
                        <TableCell align="center">Created</TableCell>
                        <TableCell align="center">Confirmed</TableCell>
                        <TableCell align="center">Validation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.duplicates.map((d) => (
                        <TableRow
                          key={d.id}
                          sx={{
                            backgroundColor:
                              d.validation && d.validation.isValidDuplicate ? '#557d55' : '#8f4646',
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {d.id}
                          </TableCell>
                          <TableCell align="right">
                            <Avatar
                              variant="square"
                              sx={{ border: '1px solid lightGrey' }}
                              src={prepareUrl(d.imageUrl)}
                            />
                            {d.imageUrl &&
                              row.need.imageUrl &&
                              urlSimilarityPercentage(
                                prepareUrl(d.imageUrl),
                                prepareUrl(row.need.imageUrl),
                              )}
                            %
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              sx={{
                                maxWidth: '140px !important',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                height: '3em',
                                whiteSpace: 'nowrap',
                                fontWeight: 200,
                              }}
                            >
                              {getSimilarityPercentage(
                                `${d.name_translations.en}`,
                                `${row.need.nameTranslations.en}`,
                              )}
                              % - {d.name_translations.en}
                              <br />
                              {d.validation.titleResult}% - {d.title}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 200 }}>
                            {/* {d.child.sayNameTranslations.en}{' '} */}
                          </TableCell>
                          <TableCell align="center">
                            <Link href={d.link}>Link</Link>
                          </TableCell>
                          <TableCell align="center">{t(categoryToString(d.category))}</TableCell>
                          <TableCell
                            sx={{
                              maxWidth: '200px !important',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              height: '1.2em',
                              whiteSpace: 'nowrap',
                              fontWeight: 200,
                            }}
                            align="center"
                          >
                            {d.description_translations.en} {' - '}
                            {getSimilarityPercentage(
                              `${d.description_translations.en}`,
                              `${row.need.descriptionTranslations.en}`,
                            )}
                            %
                          </TableCell>
                          <TableCell>{d._cost.toLocaleString()}</TableCell>
                          <TableCell>{dateConvertor(d.created)}</TableCell>
                          <TableCell>
                            {d.confirmDate ? dateConvertor(d.confirmDate) : '-'}
                          </TableCell>
                          <TableCell>{d.validation && d.validation.msg}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  const handleMassConfirm = () => {
    if (process.env.REACT_APP_NODE_ENV === 'production') {
      if (checked) {
        const needIds = result.list
          .filter((n) => !n.errorMsg)
          .filter((n) => !n.validCount)
          .map((r) => r.need.flaskId);
        dispatch(massNeedConfirm(needIds));
      } else {
        const needs = result.list.filter((n) => !n.errorMsg);
        const needIds = needs
          .filter((n) => n.possibleMissMatch.length < 1)
          .filter((n) => !n.validCount)
          .map((r) => r.need.flaskId);
        dispatch(massNeedConfirm([...needIds, ...manualIds]));
      }
    } else {
      console.log('only confirm in production');
      const needs = result.list.filter((n) => !n.errorMsg);
      const needIds = needs
        .filter((n) => n.possibleMissMatch.length < 1)
        .filter((n) => !n.validCount)
        .map((r) => r.need.flaskId);
      console.log([...needIds, manualIds]);
    }
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    let counter = 0;
    if (result) {
      for (let i = 0; i < result.list.length; i++) {
        if (result.list[i].possibleMissMatch.length > 0 && !result.list[i].errorMsg) {
          counter += 1;
          setTotalMissMatch(counter);
        }
      }
    }
  }, [result]);

  useEffect(() => {
    if (result && result.list) {
      setConfirmCandidate(
        result.list.filter((n) => !n.errorMsg && !n.validCount).length -
          (!checked ? totalMissMatch : 0) +
          manualIds.length,
      );
    }
  }, [result, checked, manualIds, totalMissMatch]);

  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}

      {loading ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        result && (
          <Card sx={{ maxWidth: '100%' }}>
            <CardContent>
              <Box>
                <LoadingButton
                  disabled={confirmCandidate < 1}
                  loading={loadingMassConfirm}
                  variant="outlined"
                  onClick={handleMassConfirm}
                >
                  Confirm {confirmCandidate} of {result.list.length} Needs
                </LoadingButton>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checked}
                        color="warning"
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="include MissMatch"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        defaultChecked
                        color="error"
                        disabled
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="exclude Error"
                  />
                </FormGroup>
                <Paper sx={{ mb: 2 }}>
                  <TableContainer sx={{ maxHeight: 850 }}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell align="center">Edit</TableCell>
                          <TableCell align="center">Add</TableCell>
                          <TableCell align="center">Id</TableCell>
                          <TableCell sx={{ minWidth: 150 }} align="center">
                            Icon
                          </TableCell>
                          <TableCell align="center">Title</TableCell>
                          <TableCell align="center">Child</TableCell>
                          <TableCell sx={{ minWidth: 150 }} align="center">
                            Provider
                          </TableCell>
                          <TableCell align="center">Category</TableCell>
                          <TableCell align="center">Description</TableCell>
                          <TableCell align="center">Price (T)</TableCell>
                          <TableCell align="center">Created</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result && result.list.map((r) => <Row key={r.need.flaskId} row={r} />)}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </PageContainer>
  );
};

export default NeedConfirmTable;
