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
  Autocomplete,
  TextField,
  CircularProgress,
  Collapse,
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
import { fetchChildrenByNgo, fetchMyChildById } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import { fetchChildNeeds } from '../../redux/actions/needsAction';

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
      id: 'sayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
      width: '150px',
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('need.name.en'),
      width: '200px',
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

  const [needsData, setNeedsData] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('isConfirmed');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [ngoId, setNgoId] = useState();
  const [childId, setChildId] = useState();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo.length === 0;

  const childNeeds = useSelector((state) => state.childNeeds);
  const { theNeeds, loading: loadingChildrenNeeds, success: successChildrenNeeds } = childNeeds;

  const childrenByNgo = useSelector((state) => state.childrenByNgo);
  const { childList, success: successChildren } = childrenByNgo;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const childById = useSelector((state) => state.childById);
  const { result, success: successChild } = childById;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // needs
  useEffect(() => {
    if (childId || (result && result.id)) {
      dispatch(fetchChildNeeds(childId || result.id));
    }
  }, [childId, result]);

  // sort needs
  // urgent ==> index 0
  // growth 0 ==> index 1
  // joy 1 ==> index 2
  // health 2 ==> index 3
  // surroundings 3 ==> index 4
  // isDone ==> index 5
  // isConfirmed ==> index 6
  // unpayable ==> index 7
  useEffect(() => {
    if (successChildrenNeeds) {
      const needData = [[], [], [], [], [], [], [], []];
      for (let i = 0; i < theNeeds.needs.length; i += 1) {
        if (theNeeds.needs[i].isUrgent) {
          needData[0].push(theNeeds.needs[i]);
        } else if (theNeeds.needs[i].isDone) {
          needData[5].push(theNeeds.needs[i]);
        } else if (theNeeds.needs[i].isConfirmed) {
          needData[6].push(theNeeds.needs[i]);
        } else if (theNeeds.needs[i].unpayable) {
          needData[7].push(theNeeds.needs[i]);
        }
        needData[theNeeds.needs[i].category + 1].push(theNeeds.needs[i]);
      }
      setNeedsData(needData);
    }
  }, [childId, successChildrenNeeds]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }
    if (active && successNgoList) {
      setOptionsNgo([...ngoList]);
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList]);

  // ngo open
  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    } else {
      dispatch(fetchNgoList());
    }
  }, [openNgo]);

  // Autocomplete children
  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    if (active && successChildren) {
      // sort children
      const sortedChildren = childList.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptions([...sortedChildren]);
    }
    return () => {
      active = false;
    };
  }, [loading, successChildren, ngoId]);

  // child open
  useEffect(() => {
    if (!open || openNgo) {
      setOptions([]);
    } else if (open || !openNgo) {
      dispatch(fetchChildrenByNgo({ ngoId }));
    }
  }, [open, openNgo, ngoId]);

  // when click on Breadcrumb use the state to retrieve the child
  useEffect(() => {
    if (!childId && theChildId) {
      dispatch(fetchMyChildById(theChildId));
    }
  }, [theChildId]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = theNeeds.needs.map((n) => n.id);
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
          // onClick={(event) => handleClick(event, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          selected={isItemSelected}
          sx={{ '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setAccOpen(!accOpen)}>
              {accOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.childSayName}
          </TableCell>
          <TableCell align="left">{row.name}</TableCell>
          <TableCell align="right">{row.title}</TableCell>
          <TableCell align="right">{row.paid}</TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="right">{row.type}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={accOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
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
                  {/* <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.customerId}</TableCell>
                        <TableCell align="right">{historyRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(historyRow.amount * row.price * 100) / 100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
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
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number,
          customerId: PropTypes.string,
          date: PropTypes.string,
        }),
      ),
    }),
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - theNeeds.needs.length) : 0;
  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Autocomplete
            id="asynchronous-ngo"
            sx={{ width: 300 }}
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
        <Grid item>
          <Autocomplete
            id="asynchronous-children"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={(e, value) => setChildId(value && value.id)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              option.isConfirmed
                ? `${option.id} - ${option.sayName}`
                : `${option.id} - ${option.sayName}`
            }
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.isConfirmed ? (
                  <>
                    <FeatherIcon color="green" icon="check" width="18" />
                    <Typography>{`${option.id} - ${option.sayName}`}</Typography>
                  </>
                ) : (
                  <>
                    <FeatherIcon color="red" icon="x" width="18" />
                    <Typography>{`${option.id} - ${option.sayName} `}</Typography>
                  </>
                )}
              </Box>
            )}
            options={successNgoList && ngoId ? options : []}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Children"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      {loadingChildrenNeeds ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        needsData &&
        (successChildren || successChild) &&
        successChildrenNeeds && (
          <Card sx={{ maxWidth: '100%' }}>
            <CardContent>
              <Box>
                <Paper sx={{ mb: 2 }}>
                  {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
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
                        rowCount={theNeeds.needs.length}
                      />
                      <TableBody>
                        {stableSort(theNeeds.needs, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            return <Row key={row.id} row={row} />;
                          })}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 53) * emptyRows,
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
                    count={theNeeds.needs.length}
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
