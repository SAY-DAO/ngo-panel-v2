/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { autoConfirmNeeds } from '../../redux/actions/needsAction';
import { getSimilarityPercentage, prepareUrl, urlSimilarityPercentage } from '../../utils/helpers';
import { dateConvertor } from '../../utils/persianToEnglish';

const NeedConfirmTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { result, loading } = useSelector((state) => state.needAutoConfirm);

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
    dispatch(autoConfirmNeeds());
  }, []);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    console.log(result);
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.need.id}
          </TableCell>
          <TableCell align="justify">
            <Grid container direction="column">
              <Avatar sx={{ border: '1px solid grey' }} src={prepareUrl(row.need.imageUrl)} />
              <Typography sx={{ fontSize: 12 }}>Dup: {row.duplicates.length}</Typography>
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
            align="justify"
          >
            {row.need.name_translations.en}
            <br />
            {row.need.title}
          </TableCell>
          <TableCell align="justify" sx={{ fontWeight: 200 }}>
            {row.need.child.sayname_translations.en}
          </TableCell>
          <TableCell align="justify">
            <Link href={row.need.link}>Link</Link>
          </TableCell>
          <TableCell align="justify">{row.need.category}</TableCell>
          <TableCell
            sx={{
              maxWidth: '200px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 150,
            }}
            align="justify"
          >
            {row.need.description_translations.en}
          </TableCell>
          <TableCell>{row.need._cost.toLocaleString()}</TableCell>
          <TableCell>{dateConvertor(row.need.created)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, mb: 8 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Duplicates
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="justify">Id</TableCell>
                      <TableCell align="justify">Icon</TableCell>
                      <TableCell align="justify">Title</TableCell>
                      <TableCell align="justify">Child</TableCell>
                      <TableCell align="justify">Link</TableCell>
                      <TableCell align="justify">Category</TableCell>
                      <TableCell align="justify">Description</TableCell>
                      <TableCell align="justify">Price (T)</TableCell>
                      <TableCell align="justify">Confirmed</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.duplicates.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell component="th" scope="row">
                          {d.id}
                        </TableCell>
                        <TableCell align="right">
                          <Avatar
                            variant="square"
                            sx={{ border: '1px solid lightGrey' }}
                            src={prepareUrl(d.imageUrl)}
                          />
                          {d.imageUrl && row.need.imageUrl
                            ? urlSimilarityPercentage(
                                prepareUrl(d.imageUrl),
                                prepareUrl(row.need.imageUrl),
                              )
                            : '-'}
                          %
                        </TableCell>
                        <TableCell align="justify">
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
                              `${row.need.name_translations.en}`,
                            )}
                            % - {d.name_translations.en}
                            <br />
                            {getSimilarityPercentage(`${d.title}`, `${row.need.title}`)}% -{' '}
                            {d.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="justify" sx={{ fontWeight: 200 }}>
                          {d.child.sayname_translations.en}{' '}
                          {getSimilarityPercentage(
                            `${d.child.sayname_translations.en}`,
                            `${row.need.child.sayname_translations.en}`,
                          )}
                          %
                        </TableCell>
                        <TableCell align="justify">
                          <Link href={d.link}>Link</Link>
                        </TableCell>
                        <TableCell align="justify">{d.category}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: '200px !important',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            height: '1.2em',
                            whiteSpace: 'nowrap',
                            fontWeight: 200,
                          }}
                          align="justify"
                        >
                          {d.description_translations.en} -
                          {getSimilarityPercentage(
                            `${d.description_translations.en}`,
                            `${row.need.description_translations.en}`,
                          )}
                          %
                        </TableCell>
                        <TableCell>{d._cost.toLocaleString()}</TableCell>
                        <TableCell>{d.confirmDate ? dateConvertor(d.confirmDate) : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

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
                <Paper sx={{ mb: 2 }}>
                  <TableContainer sx={{ maxHeight: 850 }}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell align="justify">Id</TableCell>
                          <TableCell align="justify">Icon</TableCell>
                          <TableCell align="justify">Title</TableCell>
                          <TableCell align="justify">Child</TableCell>
                          <TableCell align="justify">Link</TableCell>
                          <TableCell align="justify">Category</TableCell>
                          <TableCell align="justify">Description</TableCell>
                          <TableCell align="justify">Price (T)</TableCell>
                          <TableCell align="justify">Created</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result && result.map((n) => <Row key={n.need.id} row={n} />)}
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
