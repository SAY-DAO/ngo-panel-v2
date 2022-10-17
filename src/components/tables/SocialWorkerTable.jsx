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
import { SW_BY_ID_RESET } from '../../redux/constants/socialWorkerConstants';

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
      label: t('socialWorker.isActive'),
    },
    {
      id: 'update',
      numeric: false,
      disablePadding: true,
      label: t('socialWorker.update'),
    },
    {
      id: 'lastName',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.nameAndEmail'),
    },
    {
      id: 'generatedCode',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.generatedCode'),
    },

    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.userName'),
    },

    {
      id: 'typeName',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.typeName'),
    },
    {
      id: 'ngoName',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.ngoName'),
    },
    {
      id: 'idNumber',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.idNumber'),
    },
    {
      id: 'idCardUrl',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.idCardUrl'),
    },
    {
      id: 'birthDate',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.birthDate'),
    },
    {
      id: 'phoneNumber',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.phoneNumber'),
    },
    {
      id: 'emergencyPhoneNumber',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.emergencyPhoneNumber'),
    },
    {
      id: 'telegramId',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.telegramId'),
    },
    {
      id: 'postalAddress',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.address'),
    },
    {
      id: 'childCount',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.childCount'),
    },
    {
      id: 'needCount',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.needCount'),
    },
    {
      id: 'lastLoginDate',
      numeric: false,
      disablePadding: false,
      label: t('socialWorker.lastLoginDate'),
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
    title: 'Social Workers Table',
  },
];

const SocialWorkerTable = ({ swList }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('status');
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
      const newSelecteds = swList.map((n) => n.firstName);
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
    dispatch({ type: SW_BY_ID_RESET });
    navigate(`/sw/edit/${row.id}`);
  };
  const isSelected = (firstName) => selected.indexOf(firstName) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - swList.length) : 0;
  return (
    <PageContainer title="Social Worker Table">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <CardContent>
          <Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
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
                    rowCount={swList.length}
                  />
                  <TableBody>
                    {stableSort(swList, getComparator(order, orderBy))
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
                                aria-label="update social worker"
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={row.avatarUrl}
                                  alt="sw photo"
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
                                    {row.firstName} {row.lastName}
                                  </Typography>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {row.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="h6" fontWeight="400">
                                {row.generatedCode}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.username}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{row.typeName}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.ngoName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.idNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.idCardUrl && <Link href={row.idCardUrl}>Link</Link>}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.birthDate}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.phoneNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.emergencyPhoneNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.telegramId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.postalAddress}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{row.childCount}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{row.needCount}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.lastLoginDate}
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
                count={swList.length}
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

export default SocialWorkerTable;

SocialWorkerTable.propTypes = {
  swList: PropTypes.array.isRequired,
};
