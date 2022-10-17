import React, { useState } from 'react';
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
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomCheckbox from '../forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { NGO_BY_ID_RESET } from '../../redux/constants/ngoConstants';
import { deleteNgo } from '../../redux/actions/ngoAction';

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
      id: 'isActive',
      numeric: false,
      disablePadding: true,
      label: t('ngo.isActive'),
    },
    {
      id: 'update',
      numeric: false,
      disablePadding: true,
      label: t('ngo.update'),
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('ngo.name'),
    },

    {
      id: 'phoneNumber',
      numeric: false,
      disablePadding: false,
      label: t('ngo.phoneNumber'),
    },
    {
      id: 'country',
      numeric: false,
      disablePadding: false,
      label: t('ngo.country'),
    },
    {
      id: 'state',
      numeric: false,
      disablePadding: false,
      label: t('ngo.state'),
    },
    {
      id: 'city',
      numeric: false,
      disablePadding: false,
      label: t('ngo.city'),
    },
    {
      id: 'childrenCount',
      numeric: false,
      disablePadding: false,
      label: t('ngo.childrenCount'),
    },
    {
      id: 'currentChildrenCount',
      numeric: false,
      disablePadding: false,
      label: t('ngo.currentChildrenCount'),
    },
    {
      id: 'socialWorkerCount',
      numeric: false,
      disablePadding: false,
      label: t('ngo.socialWorkerCount'),
    },
    {
      id: 'currentSocialWorkerCount',
      numeric: false,
      disablePadding: false,
      label: t('ngo.currentSocialWorkerCount'),
    },
    {
      id: 'registerDate',
      numeric: false,
      disablePadding: false,
      label: t('ngo.registerDate'),
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: t('ngo.created'),
    },
    {
      id: 'updated',
      numeric: false,
      disablePadding: false,
      label: t('ngo.updated'),
    },
    {
      id: 'website',
      numeric: false,
      disablePadding: false,
      label: t('ngo.website'),
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
  const dispatch = useDispatch();
  const { numSelected, selected } = props;

  const handleDelete = () => {
    console.log(selected);
    dispatch(deleteNgo(selected[0]));
  };

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
          <IconButton onClick={handleDelete}>
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
  selected: PropTypes.array.isRequired,
};

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'NGOs Table',
  },
];

const NgoTable = ({ ngoList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('created');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ngoList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    // const selectedIndex = selected.indexOf(id);
    setSelected([]);
    // setSelected(selectedIndex);
    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }
    setSelected([id]);
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
    dispatch({ type: NGO_BY_ID_RESET });
    navigate(`/ngo/edit/${row.id}`);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ngoList.length) : 0;
  return (
    <PageContainer title="NGO Table" description="this is NGO page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <CardContent>
          <Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
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
                    rowCount={ngoList.length}
                  />
                  <TableBody>
                    {stableSort(ngoList, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
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
                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
                                    backgroundColor:
                                      row.isActive === true
                                        ? (theme) => theme.palette.success.main
                                        : (theme) => theme.palette.error.main,
                                    borderRadius: '100%',
                                    height: '10px',
                                    width: '10px',
                                  }}
                                />
                                <Typography
                                  color="textSecondary"
                                  variant="body1"
                                  fontWeight="400"
                                  sx={{
                                    ml: 1,
                                  }}
                                >
                                  {row.status}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleEdit(row)}
                                color="primary"
                                aria-label="update ngo"
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={row.logoUrl}
                                  alt="ngo logo"
                                  width="35"
                                  sx={{
                                    borderRadius: '100%',
                                  }}
                                />
                                <Box
                                  sx={{
                                    ml: 2,
                                  }}
                                >
                                  <Typography variant="h6" fontWeight="600">
                                    {row.name}
                                  </Typography>
                                  <Typography color="textSecondary" variant="h6" fontWeight="600">
                                    {row.emailAddress}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography
                                color="textSecondary"
                                variant="h6"
                                fontWeight="600"
                                sx={{
                                  maxWidth: '400px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  width: '160px',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.phoneNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.city.countryName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.city.stateName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.city.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{row.childrenCount}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{row.currentChildrenCount}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.socialWorkerCount}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.currentSocialWorkerCount}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.registerDate}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.created}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.updated}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.website && <Link href={row.website}>Link</Link>}
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
                count={ngoList.length}
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
    </PageContainer>
  );
};

export default NgoTable;

NgoTable.propTypes = {
  ngoList: PropTypes.array.isRequired,
};
