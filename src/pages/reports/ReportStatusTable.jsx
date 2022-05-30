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
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { fetchMyChildById } from '../../redux/actions/childrenAction';
import { fetchAllNeeds, fetchSwNeedList } from '../../redux/actions/needsAction';

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

  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
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
      label: t('need.img'),
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
      id: 'paid',
      numeric: false,
      disablePadding: false,
      label: t('need.paid'),
    },

    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: t('need.status'),
    },
    {
      id: 'type_name',
      numeric: false,
      disablePadding: false,
      label: t('need.type_name'),
    },
    {
      id: 'isUrgent',
      numeric: false,
      disablePadding: false,
      label: t('need.isUrgent'),
    },
    {
      id: 'category',
      numeric: false,
      disablePadding: false,
      label: t('need.category'),
    },
  ];
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
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
  const location = useLocation();
  const theChildId = location.state;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('isConfirmed');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const allNeeds = useSelector((state) => state.allNeeds);
  const { needs, loading: loadingAllNeeds, success: successAllNeeds } = allNeeds;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // needs
  useEffect(() => {
    // super admin
    if (swInfo.typeId === 1) {
      dispatch(fetchAllNeeds(true, 2, 1, 2));
    } else {
      dispatch(fetchSwNeedList());
    }
  }, [swInfo]);

  // when click on Breadcrumb use the state to retrieve the child
  useEffect(() => {
    if (theChildId) {
      dispatch(fetchMyChildById(theChildId));
    }
  }, [theChildId]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = needs.needs.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, id) => {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   setSelected(newSelected);
  // };

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

  function Row(props) {
    const { row } = props;
    const [accOpen, setAccOpen] = React.useState(false);
    const isSelected = (name) => selected.indexOf(name) !== -1;

    const isItemSelected = isSelected(row.id);

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
          <TableCell align="right">{row.title}</TableCell>
          <TableCell align="right">{row.paid}</TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="right">{row.type}</TableCell>
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
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={row.created}>
                      <TableCell component="th" scope="row">
                        {row.created}
                      </TableCell>
                      <TableCell>{row.created_by_id}</TableCell>
                      <TableCell align="right">{row.cost}</TableCell>
                      <TableCell align="right">
                        {Math.round(row.cost * row.cost * 100) / 100}
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
      cost: PropTypes.number,
    }),
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - needs.needs.length) : 0;
  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {loadingAllNeeds ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        successAllNeeds && (
          <Card sx={{ maxWidth: '100%' }}>
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={needs.needs}
              getOptionLabel={(option) => option.title}
              defaultValue={[needs.needs[0], needs.needs[2]]}
              renderInput={(params) => (
                <TextField {...params} label="Filter" placeholder="Favorites" />
              )}
              sx={{ width: '500px' }}
            />
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
