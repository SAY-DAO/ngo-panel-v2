import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Snackbar,
  Alert,
  CardMedia,
  Link,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import CircleIcon from '@mui/icons-material/Circle';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LoadingButton } from '@mui/lab';
import CustomSwitch from '../forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { fetchReportNeeds } from '../../redux/actions/needsAction';
import { dateConvertor, numberConvertor } from '../../utils/persianToEnglish';
import { fetchNeedReceipts } from '../../redux/actions/reportAction';
import ReportImage from '../report/ReportImage';
import { signTransaction } from '../../redux/actions/blockchainAction';
import StatusDialog from '../dialogs/ReportStatusDialog';
import { NeedTypeEnum, ProductStatusEnum, RolesEnum, ServiceStatusEnum } from '../../utils/helpers';

function descendingComparator(a, b, orderBy) {
  if (
    orderBy === 'updated' ||
    orderBy === 'created' ||
    orderBy === 'doneAt' ||
    orderBy === 'confirmDate' ||
    orderBy === 'purchase_date' ||
    orderBy === 'status_updated_at' ||
    orderBy === 'expected_delivery_date' ||
    orderBy === 'ngo_delivery_date' ||
    orderBy === 'child_delivery_date'
  ) {
    if (new Date(b[orderBy]).getTime() < new Date(a[orderBy]).getTime()) {
      return -1;
    }
    if (new Date(b[orderBy]).getTime() > new Date(a[orderBy]).getTime()) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
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
      id: 'link',
      numeric: false,
      disablePadding: true,
      label: t('need.link'),
      width: '100px',
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
      label: t('need.etitle'),
      width: '200px',
    },
    {
      id: 'informations',
      numeric: false,
      disablePadding: false,
      label: t('need.informations'),
      width: '200px',
    },
    {
      id: 'ngo',
      numeric: false,
      disablePadding: false,
      label: t('ngo.title'),
      width: '180px',
    },
    {
      id: 'socialWorker',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.title'),
      width: '150px',
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
      width: '200px',
    },
    {
      id: 'expectedDelivary',
      numeric: false,
      disablePadding: false,
      label: t('need.expectedDeliveryToNgo'),
      width: '200px',
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
      numeric: true,
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
      id: 'link',
      numeric: false,
      disablePadding: true,
      label: t('need.link'),
      width: '100px',
    },
    {
      id: 'sayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
      width: '150px',
    },
    {
      id: 'ngo',
      numeric: false,
      disablePadding: false,
      label: t('ngo.title'),
      width: '180px',
    },
    {
      id: 'socialWorker',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.title'),
      width: '150px',
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
      width: '200px',
    },
  ];

  useEffect(() => {
    if (typeId === NeedTypeEnum.PRODUCT) {
      setHeadCells(headCellsProduct);
    }
    if (typeId === NeedTypeEnum.SERVICE) {
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

const ReportStatusTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const BCrumb = [
    {
      to: '/',
      title: t('BCrumb.home'),
    },
    {
      title: t('BCrumb.reportsList'),
    },
  ];

  /*   
  ---- PAYMENT-----
  partial payment status = 1
  complete payment status = 2
  ---- PRODUCT ---type = 1---
  complete purchase for product status = 3
  complete delivery for product to NGO status = 4
  complete delivery to child status = 5
  ----- SERVICE ---type = 0---
  complete money transfer to NGO for service status = 3
  complete delivery to child for service status = 4
 */

  const needTypes = [
    { id: 0, title: t('need.types.service') },
    { id: 1, title: t('need.types.product') },
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

  const [statusDialog, setStatusDialog] = useState(false);
  const [statusNeed, setStatusNeed] = useState();

  const [ngoId, setNgoId] = useState();
  const [typeId, setTypeId] = useState(1);
  const [theTypes, setTheTypes] = useState(needTypes);
  const [statusId, setStatusId] = useState(2);
  const [optionStatus, setOptionStatus] = useState();

  const [openType, setOpenType] = useState(false);
  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo && optionsNgo.length === 0;

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('doneAt');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [toastOpen, setToastOpen] = useState(false);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const CustomizerReducer = useSelector((state) => state.CustomizerReducer);
  const { activeDir } = CustomizerReducer;

  const allReportNeeds = useSelector((state) => state.allReportNeeds);
  const { needs, loading: loadingAllReportNeeds } = allReportNeeds;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading: loadingNgoList, success: successNgoList } = ngoAll;

  const needStatusUpdate = useSelector((state) => state.needStatusUpdate);
  const { error: errorStatusUpdate, success: successStatusUpdate } = needStatusUpdate;

  // set Service or Product titles
  useEffect(() => {
    setTheTypes(needTypes);
    if (typeId === NeedTypeEnum.PRODUCT) {
      setOptionStatus(optionsProduct);
    } else if (typeId === NeedTypeEnum.SERVICE) {
      setOptionStatus(optionsService);
    } else if (openType) {
      setStatusId();
    }
    if (openType) {
      setOptionStatus();
    }
  }, [typeId, openType]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }

    if (active && swInfo) {
      console.log(swInfo.typeId);
      // super admin & admin
      if (
        (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN) &&
        successNgoList
      ) {
        const activeNgoList = ngoList.filter((ngo) => ngo.isActive);
        setOptionsNgo([
          {
            id: '',
            name: t('ngo.allNgos'),
          },
          ...activeNgoList,
        ]);
      }
      // social worker
      else if (
        swInfo.typeId === RolesEnum.SOCIAL_WORKER ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        setOptionsNgo([
          {
            id: swInfo.ngoId,
            name: swInfo.ngoName,
          },
        ]);
      }
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList, swInfo]);

  // ngo open
  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    } else if (swInfo) {
      if (swInfo.typeId === RolesEnum.SOCIAL_WORKER || swInfo.typeId === RolesEnum.NGO_SUPERVISOR) {
        setOptionsNgo([
          {
            id: swInfo.ngoId,
            name: swInfo.ngoName,
          },
        ]);
      }
    }
  }, [openNgo]);

  // fetch needs
  useEffect(() => {
    if (swInfo && !loadingAllReportNeeds) {
      if (successNgoList) {
        // super admin & admin
        if (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN) {
          if (ngoId) {
            dispatch(fetchReportNeeds(true, ngoId, typeId, statusId));
          } else {
            dispatch(fetchReportNeeds(true, null, typeId, statusId));
          }
        }
      } else if (
        swInfo.typeId === RolesEnum.SOCIAL_WORKER ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        dispatch(fetchReportNeeds(true, swInfo.ngoId, typeId, statusId));
      }
    }
  }, [ngoId, typeId, statusId, swInfo, successNgoList, successStatusUpdate]);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
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

  const handleStatusChange = (row) => {
    setStatusDialog(true);
    setStatusNeed(row);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    needs && (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - needs.needs.length) : 0);

  function Row(props) {
    const { row } = props;
    const [accOpen, setAccOpen] = useState(false);

    // fetch needs receipt when open accordion
    useEffect(() => {
      if (
        accOpen &&
        ((typeId === NeedTypeEnum.PRODUCT && statusId > ProductStatusEnum.PURCHASED_PRODUCT) ||
          (typeId === NeedTypeEnum.SERVICE && statusId > ServiceStatusEnum.COMPLETE_PAY))
      ) {
        dispatch(fetchNeedReceipts(row.id));
      }
    }, [accOpen]);
    // set type name for status dialogue
    // useEffect(() => {
    //   if (statusDialog && row && needs.needs) {
    //     setStatusNeed(needs.needs.find((n) => n.id === row.id));
    //   }
    // }, [statusDialog, row, needs]);

    const signReport = () => {
      dispatch(signTransaction(row));
    };

    return (
      <>
        <TableRow
          hover
          role="checkbox"
          tabIndex={-1}
          sx={{ '& > *': { borderBottom: 'unset' }, height: '100px' }}
        >
          <TableCell align="center">
            <IconButton aria-label="expand row" size="small" onClick={() => setAccOpen(!accOpen)}>
              {accOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell align="center" component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell align="center">
            <Box display="flex" alignItems="center">
              <CardMedia
                component="img"
                image={row.img || row.imageUrl}
                alt={row.img || row.imageUrl}
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

          <TableCell>
            {row.link && (
              <Link href={row.link} target="_blank">
                Link
              </Link>
            )}
            <br />
            {row.affiliateLinkUrl && (
              <Link href={row.affiliateLinkUrl} target="_blank">
                affiliateLink
              </Link>
            )}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.childSayName}
          </TableCell>
          {typeId === NeedTypeEnum.PRODUCT && <TableCell align="center">{row.title}</TableCell>}
          {typeId === NeedTypeEnum.PRODUCT && (
            <TableCell>
              <Tooltip title={row.informations ? row.informations : ''} placement="top-end">
                <Typography
                  color="textSecondary"
                  variant="body1"
                  fontWeight="400"
                  sx={{
                    maxWidth: '400px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    width: '160px',
                    height: '1.2em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.informations}
                </Typography>
              </Tooltip>
            </TableCell>
          )}
          <TableCell align="center">{row.ngoId}</TableCell>
          <TableCell>{row.created_by_id}</TableCell>
          <TableCell align="center">
            <Box alignItems="center">
              <IconButton
                disabled={
                  (row.type === NeedTypeEnum.SERVICE &&
                    row.status === ServiceStatusEnum.DELIVERED) ||
                  (row.type === NeedTypeEnum.PRODUCT && row.status === ProductStatusEnum.DELIVERED)
                }
                aria-label="attachment"
                size="small"
                onClick={() => handleStatusChange(row)}
              >
                <Avatar
                  src={
                    row.status === ProductStatusEnum.COMPLETE_PAY // Complete payment
                      ? '/images/hand-orange.svg'
                      : row.status === ProductStatusEnum.PURCHASED_PRODUCT &&
                        typeId === NeedTypeEnum.PRODUCT // Purchased Product
                      ? '/images/package-orange.svg'
                      : (row.status === ProductStatusEnum.DELIVERED_TO_NGO &&
                          typeId === NeedTypeEnum.PRODUCT) ||
                        (row.status === ServiceStatusEnum.MONEY_TO_NGO &&
                          typeId === NeedTypeEnum.SERVICE) // Sent product to NGO
                      ? '/images/package-orange.svg'
                      : '/images/child-orange.svg' // Delivered to Child
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
                  {row.status === ProductStatusEnum.COMPLETE_PAY ? (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                    </>
                  ) : row.status === ProductStatusEnum.PURCHASED_PRODUCT &&
                    typeId === NeedTypeEnum.PRODUCT ? (
                    <>
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                      <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
                    </>
                  ) : (row.status === ProductStatusEnum.DELIVERED_TO_NGO &&
                      typeId === NeedTypeEnum.PRODUCT) ||
                    (row.status === ServiceStatusEnum.MONEY_TO_NGO &&
                      typeId === NeedTypeEnum.SERVICE) ? (
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
          <TableCell>
            <Typography sx={{ color: 'gray' }} variant="h6" fontWeight="400">
              {row.purchase_cost ? row.purchase_cost.toLocaleString() : row.paid.toLocaleString()} /
              {row.cost.toLocaleString()}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography sx={{ color: 'gray' }} variant="h6" fontWeight="400">
              {NeedTypeEnum.PRODUCT && row.status > ProductStatusEnum.COMPLETE_PAY
                ? activeDir === 'rtl'
                  ? dateConvertor(row.expected_delivery_date)
                  : row.expected_delivery_date
                : '-'}
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
                      <TableCell sx={{ fontWeight: 600 }}>{t('report.history.status')}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{t('report.history.date')}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {t('report.history.receipt')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.confirmDate')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.confirmDate
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.confirmDate)
                            : row.confirmDate
                          : '-'}
                      </TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.created')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.created
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.created)
                            : row.created
                          : '-'}
                      </TableCell>
                      <TableCell align="right"> - </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.updated')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.updated
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.updated)
                            : row.updated
                          : '-'}
                      </TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    {/* 2   Complete payment	*/}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {t('need.needStatus.2')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.doneAt
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.doneAt)
                            : row.doneAt
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {row.payments && row.payments[0] && (
                          <Tooltip
                            title={row.payments.map((p) => {
                              if (p.verified && p.gateway_track_id) {
                                return (
                                  <Grid key={p.id}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        backgroundColor: p.need_amount > 0 ? 'green' : 'red',
                                      }}
                                    >
                                      {`User:${p.id_user} Track Id:${p.gateway_track_id} => ${(
                                        p.total_amount -
                                        p.donation_amount -
                                        p.credit_amount
                                      ).toLocaleString()}`}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        backgroundColor: p.need_amount > 0 ? 'orange' : 'red',
                                      }}
                                    >
                                      {`Donation => ${p.donation_amount.toLocaleString()}`}
                                    </Typography>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        backgroundColor: p.need_amount > 0 ? 'orange' : 'red',
                                      }}
                                    >
                                      {`Wallet => ${p.credit_amount.toLocaleString()}`}
                                    </Typography>
                                  </Grid>
                                );
                              }
                              return (
                                <Typography variant="subtitle2" key={p.id}>
                                  {p.verified && `SAY ${p.total_amount.toLocaleString()}`}
                                </Typography>
                              );
                            })}
                            placement="top-end"
                          >
                            <Typography color="textSecondary" variant="body1">
                              {row.payments.filter((p) => p.verified).length} {t('need.payers')}
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                    {/* 3 Product delivered to NGO - Money transferred to the NGO */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {typeId === NeedTypeEnum.PRODUCT
                          ? t('need.needStatus.p3')
                          : t('need.needStatus.s3')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {typeId === NeedTypeEnum.PRODUCT && row.purchase_date
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.purchase_date)
                            : row.purchase_date
                          : typeId === NeedTypeEnum.SERVICE && row.ngo_delivery_date
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.ngo_delivery_date)
                            : row.ngo_delivery_date
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {row.dkc &&
                          parseInt(numberConvertor(row.dkc), 10)
                            .toLocaleString('en-US')
                            .replace(/,/g, '-')}
                        {typeId === NeedTypeEnum.SERVICE &&
                          statusId > 2 &&
                          row.bank_track_id &&
                          parseInt(numberConvertor(row.bank_track_id), 10)}
                      </TableCell>
                    </TableRow>
                    {/* 4 Product delivered to NGO - service delivery to child */}
                    <TableRow>
                      <TableCell component="th" scope="row">
                        {typeId === NeedTypeEnum.PRODUCT
                          ? t('need.needStatus.p4')
                          : t('need.needStatus.s4')}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {typeId === NeedTypeEnum.PRODUCT && row.ngo_delivery_date
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.ngo_delivery_date)
                            : row.ngo_delivery_date
                          : typeId === NeedTypeEnum.SERVICE && row.child_delivery_date
                          ? activeDir === 'rtl'
                            ? dateConvertor(row.child_delivery_date)
                            : row.child_delivery_date
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {typeId === NeedTypeEnum.SERVICE &&
                        (statusId === ServiceStatusEnum.MONEY_TO_NGO ||
                          statusId === ServiceStatusEnum.DELIVERED) ? (
                          <ReportImage row={row} statusId={statusId} />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                    {/* 5 product delivery to child */}
                    {typeId === NeedTypeEnum.PRODUCT && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {t('need.needStatus.p5')}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.child_delivery_date
                            ? activeDir === 'rtl'
                              ? dateConvertor(row.child_delivery_date)
                              : row.child_delivery_date
                            : '-'}
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
                          // loading={loadingOneNeed}
                          onClick={() => signReport()}
                          disabled={
                            (typeId === NeedTypeEnum.PRODUCT && statusId !== 5) ||
                            (typeId === NeedTypeEnum.SERVICE && statusId !== 4)
                          }
                          variant="outlined"
                          fullWidth
                        >
                          {(typeId === NeedTypeEnum.PRODUCT && statusId !== 5) ||
                          (typeId === NeedTypeEnum.SERVICE && statusId !== 4)
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
      child_id: PropTypes.number,
      childSayName: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      informations: PropTypes.string,
      paid: PropTypes.number,
      expected_delivery_date: PropTypes.string,
      purchase_cost: PropTypes.number,
      status: PropTypes.number,
      type: PropTypes.number,
      img: PropTypes.string,
      imageUrl: PropTypes.string,
      amount: PropTypes.number,
      ngoId: PropTypes.number,
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
      affiliateLinkUrl: PropTypes.string,
      link: PropTypes.string,
    }),
  };
  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {swInfo && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item md={3} xs={12}>
            <Autocomplete
              defaultValue={
                swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN
                  ? {
                      id: '',
                      name: t('ngo.allNgos'),
                    }
                  : {
                      id: swInfo.ngoId,
                      name: swInfo.ngoName,
                    }
              }
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
                  label={t('ngo.title')}
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
              defaultValue={theTypes[1]}
              id="type"
              open={openType}
              onOpen={() => setOpenType(true) && setOptionStatus()}
              onClose={() => {
                setOpenType(false);
              }}
              onChange={(e, value) => setTypeId(value && value.id)}
              getOptionLabel={(option) => `${option.title}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={theTypes}
              renderInput={(params) => <TextField {...params} label={t('need.autoCompleteType')} />}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            {theTypes && optionStatus && (
              <Autocomplete
                defaultValue={optionStatus && optionStatus[1]}
                id="status"
                onChange={(e, value) => setStatusId(value && value.id)}
                getOptionLabel={(option) => `${option.id} - ${option.title}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={optionStatus}
                renderInput={(params) => (
                  <TextField {...params} label={t('need.autoCompleteStatus')} />
                )}
              />
            )}
          </Grid>
        </Grid>
      )}

      {loadingAllReportNeeds || loadingNgoList ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        needs &&
        needs.needs &&
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
                        order={order}
                        orderBy={orderBy}
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
                    labelRowsPerPage={t('table.rowCount')}
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
                  label={t('table.dense')}
                />
              </Box>
            </CardContent>
          </Card>
        )
      )}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
          <Alert
            variant="filled"
            onClose={handleCloseToast}
            severity={errorStatusUpdate ? 'error' : 'success'}
            sx={{ width: '100%' }}
          >
            {(errorStatusUpdate && errorStatusUpdate) ||
              (successStatusUpdate && t('socialWorker.updated'))}
          </Alert>
        </Snackbar>
      </Stack>
      {statusNeed && (
        <StatusDialog
          need={statusNeed}
          statusDialog={statusDialog}
          setStatusDialog={setStatusDialog}
          setStatusNeed={setStatusNeed}
        />
      )}
    </PageContainer>
  );
};

export default ReportStatusTable;
