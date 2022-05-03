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
  Avatar,
  Link,
  Grid,
  Autocomplete,
  TextField,
  CircularProgress,
  Switch,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { SW_BY_ID_RESET } from '../../redux/constants/socialWorkerConstants';
import { fetchChildList, fetchChildNeeds } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';

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

  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'isConfirmed',
      numeric: false,
      disablePadding: false,
      label: t('need.isConfirmed'),
    },
    {
      id: 'unpayable',
      numeric: false,
      disablePadding: true,
      label: t('need.unpayable'),
    },
    {
      id: 'update',
      numeric: false,
      disablePadding: true,
      label: t('need.update'),
    },
    {
      id: 'imageUrl',
      numeric: false,
      disablePadding: false,
      label: t('need.imageUrl'),
    },
    {
      id: 'childSayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('need.name'),
    },
    {
      id: 'title',
      numeric: false,
      disablePadding: false,
      label: t('need.title'),
    },

    {
      id: 'cost',
      numeric: false,
      disablePadding: false,
      label: t('need.cost'),
    },
    {
      id: 'paid',
      numeric: false,
      disablePadding: false,
      label: t('need.paid'),
    },
    {
      id: 'progress',
      numeric: false,
      disablePadding: false,
      label: t('need.progress'),
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
      id: 'urgent',
      numeric: false,
      disablePadding: false,
      label: t('need.isUrgent'),
    },
    {
      id: 'information',
      numeric: false,
      disablePadding: false,
      label: t('need.information'),
    },
    {
      id: 'details',
      numeric: false,
      disablePadding: false,
      label: t('need.details'),
    },
    {
      id: 'category',
      numeric: false,
      disablePadding: false,
      label: t('need.category'),
    },
    {
      id: 'description',
      numeric: false,
      disablePadding: false,
      label: t('need.description'),
    },
    {
      id: 'link',
      numeric: false,
      disablePadding: false,
      label: t('need.link'),
    },
    {
      id: 'affiliateLinkUrl',
      numeric: false,
      disablePadding: false,
      label: t('need.affiliateLinkUrl'),
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: t('need.created'),
    },
    {
      id: 'confirmUser',
      numeric: false,
      disablePadding: false,
      label: t('need.confirmUser'),
    },
    {
      id: 'confirmDate',
      numeric: false,
      disablePadding: false,
      label: t('need.confirmDate'),
    },
    {
      id: 'updated',
      numeric: false,
      disablePadding: false,
      label: t('need.updated'),
    },
    {
      id: 'doneAt',
      numeric: false,
      disablePadding: false,
      label: t('need.doneAt'),
    },
    {
      id: 'child_delivery_date',
      numeric: false,
      disablePadding: false,
      label: t('need.child_delivery_date'),
    },
  ];
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
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

const NeedTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const childAll = useSelector((state) => state.childAll);
  const { childList, success: successChildren } = childAll;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // needs
  useEffect(() => {
    if (childId) {
      dispatch(fetchChildNeeds(childId));
    }
  }, [childId]);

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
      setOptions([...childList.children]);
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
      dispatch(fetchChildList({ ngoId }));
    }
  }, [open, openNgo, ngoId]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = theNeeds.needs.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
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

  const handleEdit = (row) => {
    dispatch({ type: SW_BY_ID_RESET });
    navigate(`/needs/edit/${row.id}`);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - theNeeds.needs.length) : 0;
  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={2}>
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
            getOptionLabel={(option) => `${option.id} - ${option.sayName}`}
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
        successChildren &&
        successChildrenNeeds && (
          <Card sx={{ maxWidth: '100%' }}>
            <CardContent>
              <Box>
                <Paper sx={{ mb: 2 }}>
                  <EnhancedTableToolbar numSelected={selected.length} />
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={dense ? 'small' : 'medium'}
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
                          .map((row, index) => {
                            const isItemSelected = isSelected(row.name);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                onClick={(event) => handleClick(event, row.name)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <CustomCheckbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputprops={{
                                      'aria-labelledby': labelId,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Switch
                                    checked={row.isConfirmed}
                                    // onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Box
                                      sx={{
                                        backgroundColor:
                                          row.unpayable === true
                                            ? (theme) => theme.palette.success.main
                                            : (theme) => theme.palette.error.main,
                                        borderRadius: '100%',
                                        height: '10px',
                                        width: '10px',
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => handleEdit(row)}
                                    color="primary"
                                    aria-label="update need"
                                  >
                                    <EditOutlinedIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Avatar
                                      src={row.imageUrl}
                                      alt="sw photo"
                                      width="35"
                                      sx={{
                                        borderRadius: '100%',
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {row.childSayName}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={row.title} placement="top-end">
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
                                      {row.title}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.cost.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.paid.toLocaleString()}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body2"
                                    fontWeight="600"
                                  >
                                    {row.progress}%
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.status}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.type_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.isUrgent ? 'true' : 'false'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.information}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.details}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.category}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={row.description} placement="top-end">
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        maxWidth: '400px',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        width: '160px',
                                        height: '1.2em',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {row.description}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.link && <Link href={row.link}>Link</Link>}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.affiliateLinkUrl && (
                                      <Link href={row.affiliateLinkUrl}>Affiliate</Link>
                                    )}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.created}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.confirmUser}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.confirmDate}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.updated}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.doneAt}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.child_delivery_date}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
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

export default NeedTable;
