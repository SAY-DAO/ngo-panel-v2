import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  IconButton,
  Tooltip,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Collapse,
  Autocomplete,
  TextField,
  Avatar,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import CircleIcon from '@mui/icons-material/Circle';
import FeatherIcon from 'feather-icons-react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LoadingButton } from '@mui/lab';
import CustomSwitch from '../forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { fetchAllNeeds, fetchSwNeedList } from '../../redux/actions/needsAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import convertor from '../../utils/persianToEnglish';
import { fetchNeedReceipts } from '../../redux/actions/reportAction';
import ReportImage from '../report/ReportImage';
import { signTransaction } from '../../redux/actions/dao/DaoAction';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { t } = useTranslation();

  const [headCells, setHeadCells] = useState();
  const { order, orderBy, onRequestSort, typeId } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCellsProduct = [
    {
      id: '#',
      numeric: false,
      disablePadding: false,
      label: '',
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('need.id'),
    },
    {
      id: 'img',
      numeric: false,
      disablePadding: false,
      label: t('need.img.product'),
      width: '250px',
    },
    {
      id: 'sayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
      width: '150px',
    },
    {
      id: 'title',
      numeric: false,
      disablePadding: false,
      label: t('need.title'),
      width: '200px',
    },
    {
      id: 'socialWorker',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.roles.SOCIAL_WORKER'),
      width: '200px',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: t('need.status'),
    },
    {
      id: 'paid',
      numeric: false,
      disablePadding: false,
      label: t('need.paid'),
      width: '150px',
    },
  ];

  const headCellsService = [
    {
      id: '#',
      numeric: false,
      disablePadding: false,
      label: '',
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('need.id'),
    },
    {
      id: 'img',
      numeric: false,
      disablePadding: false,
      label: t('need.img.service'),
      width: '250px',
    },
    {
      id: 'sayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
      width: '150px',
    },
    {
      id: 'socialWorker',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.roles.SOCIAL_WORKER'),
      width: '200px',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: t('need.status'),
    },
    {
      id: 'paid',
      numeric: false,
      disablePadding: false,
      label: t('need.paid'),
      width: '250px',
    },
  ];

  useEffect(() => {
    if (typeId === 1) {
      setHeadCells(headCellsProduct);
    }
    if (typeId === 0) {
      setHeadCells(headCellsService);
    }
  }, [typeId]);

  return (
    <TableHead>
      <TableRow>
        {headCells &&
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ minWidth: headCell.width }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <Typography variant="subtitle1" fontWeight="500">
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  typeId: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Filter
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <FeatherIcon icon="trash-2" width="18" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FeatherIcon icon="filter" width="18" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Needs Table',
  },
];

const ReportStatusTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [ngoId, setNgoId] = useState();
  const [typeId, setTypeId] = useState(1);
  const [statusId, setStatusId] = useState(2);
  const [optionStatus, setOptionStatus] = useState();

  const [openType, setOpenType] = useState(false);
  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo.length === 0;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('isConfirmed');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const allNeeds = useSelector((state) => state.allNeeds);
  const { needs, loading: loadingAllNeeds } = allNeeds;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading: loadingNgoList, success: successNgoList } = ngoAll;

  /*   ---- PAYMENT-----
  partial payment status = 1
  complete payment status = 2

  ---- PRODUCT -----
  complete purchase for product status = 3
  complete delivery for product to NGO status = 4
  complete delivery to child status = 5

  ----- SERVICE -----
  complete money transfer to NGO for service status = 3
  complete delivery to child for service status = 4
 */

  const optionsType = [
    { id: 0, title: 'Service' },
    { id: 1, title: 'Product' },
  ];

  const optionsProduct = [
    { id: 1, title: t('need.needStatus.1') },
    { id: 2, title: t('need.needStatus.2') },
    { id: 3, title: t('need.needStatus.p3') },
    { id: 4, title: t('need.needStatus.p4') },
    { id: 5, title: t('need.needStatus.p5') },
  ];

  const optionsService = [
    { id: 1, title: t('need.needStatus.1') },
    { id: 2, title: t('need.needStatus.2') },
    { id: 3, title: t('need.needStatus.s3') },
    { id: 4, title: t('need.needStatus.s4') },
  ];

  // set Service or Product titles
  useEffect(() => {
    if (typeId === 1) {
      setOptionStatus(optionsProduct);
    }
    if (typeId === 0) {
      setOptionStatus(optionsService);
    }
  }, [typeId, openType]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }

    if (active && successNgoList) {
      const activeNgoList = ngoList.filter((ngo) => ngo.isActive);
      setOptionsNgo([...activeNgoList]);
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList]);

  // ngo LIST
  useEffect(() => {
    dispatch(fetchNgoList());
  }, []);

  // for the very first load
  useEffect(() => {
    if (!ngoId && ngoList) {
      setNgoId(ngoList.filter((ngo) => ngo.isActive)[0].id);
    }
  }, [ngoList]);

  // fetch needs
  useEffect(() => {
    if (successNgoList) {
      // super admin
      if (ngoId && swInfo.typeId === 1) {
        dispatch(fetchAllNeeds(true, ngoId, typeId, statusId));
      } else if (swInfo.typeId !== 1) {
        dispatch(fetchSwNeedList());
      }
    }
  }, [ngoId, typeId, statusId, swInfo, successNgoList]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = needs.needs.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - needs.needs.length) : 0;

  function Row(props) {
    const { row } = props;
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const [accOpen, setAccOpen] = useState(false);
    const isItemSelected = isSelected(row.id);

    // fetch needs receipt when open accordion
    useEffect(() => {
      if (accOpen && ((typeId === 1 && statusId > 3) || (typeId === 0 && statusId > 3))) {
        dispatch(fetchNeedReceipts(row.id));
      }
    }, [accOpen]);

    const signReport = () => {
      dispatch(signTransaction(row.id, swInfo.id));
    };

    return (
      <>
        <TableRow
          hover
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          selected={isItemSelected}
          sx={{ '& > *': { borderBottom: 'unset' }, height: '100px' }}
        >
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setAccOpen(!accOpen)}>
              {accOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Avatar
                src={row.img}
                alt={row.img}
                sx={{
                  borderRadius: '10px',
                  height: '70px',
                  width: '90px',
                }}
              />
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Typography sx={{ color: 'gray' }} variant="h5" fontWeight="600">
                  {row.name}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.childSayName}
          </TableCell>
          {typeId === 1 && <TableCell align="center">{row.title}</TableCell>}
          <TableCell align="center">{row.created_by_id}</TableCell>
          <TableCell align="center">
            <Box alignItems="center">
              <IconButton aria-label="attachment" size="small">
                <Avatar
                  src={
                    row.status === 2 // Complete payment
                      ? '/image/hand-orange.svg'
                      : row.status === 3 && typeId === 1 // Purchased Product
                      ? '/image/package-orange.svg'
                      : (row.status === 4 && typeId === 1) || (row.status === 3 && typeId === 0) // Sent product to NGO
                      ? '/image/package-orange.svg'
                      : '/image/child-orange.svg' // Delivered to Child
                  }
                  alt="icon"
                  sx={{
                    p: 1,
                    m: 'auto',
                    border: '1px solid #665a49',
                    borderRadius: '50px',
                    height: '40px',
                    width: '40px',
                  }}
                />
              </IconButton>
              <Box>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
                  {row.status === 2 ? (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                    </>
                  ) : row.status === 3 && typeId === 1 ? (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                    </>
                  ) : (row.status === 4 && typeId === 1) || (row.status === 3 && typeId === 0) ? (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                    </>
                  ) : (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                    </>
                  )}
                </Stack>
              </Box>
            </Box>
          </TableCell>
          <TableCell align="center">
            <Typography sx={{ color: 'gray' }} variant="h6" fontWeight="400">
              {row.paid.toLocaleString()} / {row.cost.toLocaleString()}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={accOpen} timeout="auto" unmountOnExit>
              <Box sx={{ mb: 5 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  sx={{
                    mt: 2,
                    backgroundColor: (theme) => theme.palette.grey.A700,
                    p: '5px 15px',
                    color: (theme) =>
                      `${
                        theme.palette.mode === 'dark'
                          ? theme.palette.grey.A200
                          : 'rgba(0, 0, 0, 0.87)'
                      }`,
                  }}
                >
                  {t('report.history.title')}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Receipt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.confirmDate')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.confirmDate}
                      </TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.created')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.created}
                      </TableCell>
                      <TableCell align="right"> - </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.updated')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.updated}
                      </TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    {/* 2   Complete payment	*/}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.needStatus.2')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.doneAt}
                      </TableCell>
                      <TableCell align="right">
                        {row.payments[0] && (
                          <Tooltip
                            title={row.payments.map((payment, index) => {
                              if (payment.gateway_track_id && payment.verified) {
                                return (
                                  <Typography variant="subtitle2" key={payment.id}>{`${
                                    index + 1
                                  }: ${
                                    payment.gateway_track_id
                                  } - ${payment.total_amount.toLocaleString()}`}</Typography>
                                );
                              }
                              return (
                                <Typography variant="subtitle2" key={payment.id}>{`${
                                  index + 1
                                }: SAY- ${payment.total_amount.toLocaleString()}`}</Typography>
                              );
                            })}
                            placement="top-end"
                          >
                            <Typography color="textSecondary" variant="body1">
                              {row.payments.length} {t('need.payers')}
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                    {/* 3 Product delivered to NGO - Money transferred to the NGO */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {typeId === 1 ? t('need.needStatus.p3') : t('need.needStatus.s3')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {typeId === 1 ? row.purchase_date : row.ngo_delivery_date}
                      </TableCell>
                      <TableCell align="right">
                        {row.dkc &&
                          parseInt(convertor(row.dkc), 10)
                            .toLocaleString('en-US')
                            .replace(/,/g, '-')}
                        {typeId === 0 &&
                          statusId > 2 &&
                          row.bank_track_id &&
                          parseInt(convertor(row.bank_track_id), 10)
                            .toLocaleString('en-US')
                            .replace(/,/g, '-')}
                      </TableCell>
                    </TableRow>
                    {/* 4 Product delivered to NGO - service delivery to child */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {typeId === 1 ? t('need.needStatus.p4') : t('need.needStatus.s4')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {typeId === 1 ? row.ngo_delivery_date : row.child_delivery_date}
                      </TableCell>
                      <TableCell align="right">
                        {((typeId === 1 && statusId > 3) || (typeId === 0 && statusId > 3)) && (
                          <ReportImage row={row} statusId={statusId} />
                        )}
                      </TableCell>
                    </TableRow>
                    {/* 5 product delivery to child */}
                    {typeId === 1 && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {t('need.needStatus.p5')}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.child_delivery_date}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {statusId > 4 && <ReportImage row={row} statusId={statusId} />}
                        </TableCell>
                      </TableRow>
                    )}
                    {/* Signature */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.needStatus.signature')}
                      </TableCell>
                      <TableCell component="th" scope="row" />
                      <TableCell component="th" scope="row">
                        <LoadingButton
                          onClick={() => signReport()}
                          disabled={
                            (typeId === 1 && statusId !== 5) || (typeId === 0 && statusId !== 4)
                          }
                          variant="outlined"
                          fullWidth
                        >
                          {(typeId === 1 && statusId !== 5) || (typeId === 0 && statusId !== 4)
                            ? t('need.needStatus.pending')
                            : t('need.needStatus.sign')}
                        </LoadingButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      id: PropTypes.number,
      childSayName: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      paid: PropTypes.number,
      status: PropTypes.number,
      type: PropTypes.number,
      img: PropTypes.string,
      amount: PropTypes.number,
      created_by_id: PropTypes.number,
      created: PropTypes.string,
      updated: PropTypes.string,
      confirmDate: PropTypes.string,
      child_delivery_date: PropTypes.string,
      ngo_delivery_date: PropTypes.string,
      purchase_date: PropTypes.string,
      doneAt: PropTypes.string,
      cost: PropTypes.number,
      bank_track_id: PropTypes.string,
      dkc: PropTypes.string,
      payments: PropTypes.array,
    }),
  };

  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {ngoList && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item md={3} xs={12}>
            <Autocomplete
              defaultValue={ngoList.filter((ngo) => ngo.isActive)[0]} // only active one
              id="asynchronous-ngo"
              open={openNgo}
              onOpen={() => {
                setOpenNgo(true);
              }}
              onClose={() => {
                setOpenNgo(false);
              }}
              onChange={(e, value) => setNgoId(value && value.id)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => `${option.id} - ${option.name}`}
              options={optionsNgo}
              loading={loadingNgo}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ngo"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingNgo ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Autocomplete
              defaultValue={optionsType[1]}
              id="type"
              open={openType}
              onOpen={() => setOpenType(true) && setOptionStatus()}
              onClose={() => {
                setOpenType(false);
              }}
              onChange={(e, value) => setTypeId(value && value.id)}
              getOptionLabel={(option) => `${option.title}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={optionsType}
              renderInput={(params) => <TextField {...params} label="Service/Product" />}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            {optionsType && optionStatus && (
              <Autocomplete
                defaultValue={optionStatus[1]}
                id="status"
                onChange={(e, value) => setStatusId(value && value.id)}
                getOptionLabel={(option) => `${option.id} - ${option.title}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={optionStatus}
                renderInput={(params) => <TextField {...params} label="Status" />}
              />
            )}
          </Grid>
        </Grid>
      )}

      {loadingAllNeeds || loadingNgoList ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        needs &&
        needs.needs.length > 0 && (
          <Card sx={{ maxWidth: '100%' }}>
            <CardContent>
              <Box>
                <Paper sx={{ mb: 2 }}>
                  <TableContainer sx={{ maxHeight: 850 }}>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={dense ? 'small' : 'medium'}
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={needs.needs.length}
                        typeId={typeId}
                      />
                      <TableBody>
                        {stableSort(needs.needs, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            return <Row key={row.id} row={row} />;
                          })}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 80) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={needs.needs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                <FormControlLabel
                  control={<CustomSwitch checked={dense} onChange={handleChangeDense} />}
                  label="Dense padding"
                />
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </PageContainer>
  );
};

export default ReportStatusTable;
