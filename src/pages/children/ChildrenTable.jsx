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
  Switch,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MuiAudioPlayer from 'mui-audio-player-plus';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomSwitch from '../../components/forms/custom-elements/CustomSwitch';
import { NGO_BY_ID_RESET } from '../../redux/constants/ngoConstants';

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
      id: 'existence_status',
      numeric: false,
      disablePadding: true,
      paragraph: false,
      label: t('child.existenceStatus'),
    },
    {
      id: 'isConfirmed',
      numeric: false,
      disablePadding: true,
      paragraph: false,
      label: t('common.isConfirmed'),
    },
    {
      id: 'update',
      numeric: false,
      disablePadding: true,
      paragraph: false,
      label: t('common.update'),
    },
    {
      id: 'generatedCode',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.generatedCode'),
    },

    {
      id: 'awakeAvatarUrl',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.awakeAvatarUrl'),
    },

    {
      id: 'sleptAvatarUrl',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.sleptAvatarUrl'),
    },
    {
      id: 'voiceUrl',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.voiceUrl'),
    },
    {
      id: 'firstName_translations.en',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.firstName.en'),
    },
    {
      id: 'lastName_translations.en',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.lastName.en'),
    },
    {
      id: 'firstName_translations.fa',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.firstName.fa'),
    },
    {
      id: 'lastName_translations.fa',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.lastName.fa'),
    },
    {
      id: 'sayname_translations.en',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.sayname.en'),
    },
    {
      id: 'sayname_translations.fa',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.sayname.fa'),
    },
    {
      id: 'done_needs_count',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.doneNeedsCount'),
    },
    {
      id: 'spent_credit',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.spentCredit'),
    },
    {
      id: 'birthDate',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.age'),
    },
    {
      id: 'gender',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.gender.title'),
    },
    {
      id: 'bio_translations.en',
      numeric: false,
      disablePadding: false,
      paragraph: true,
      label: t('child.bio.en'),
    },
    {
      id: 'bio_summary_translations.en',
      numeric: false,
      disablePadding: false,
      paragraph: true,
      label: t('child.bioSummary.en'),
    },
    {
      id: 'bio_translations.fa',
      numeric: false,
      disablePadding: false,
      paragraph: true,
      label: t('child.bio.fa'),
    },
    {
      id: 'bio_summary_translations.fa',
      numeric: false,
      disablePadding: false,
      paragraph: true,
      label: t('child.bioSummary.fa'),
    },
    {
      id: 'country',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.country'),
    },
    {
      id: 'city',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.city'),
    },
    {
      id: 'birthPlace',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.birthPlace'),
    },
    {
      id: 'nationality',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.nationality'),
    },
    {
      id: 'familyCount',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.familyCount'),
    },
    {
      id: 'sayFamilyCount',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.sayFamilyCount'),
    },
    {
      id: 'education',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.education'),
    },
    {
      id: 'housingStatus',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.housingStatus'),
    },
    {
      id: 'id_social_worker',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('child.socialWorker'),
    },
    {
      id: 'phoneNumber',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.phoneNumber'),
    },
    {
      id: 'address',
      numeric: false,
      disablePadding: false,
      paragraph: true,
      label: t('common.postalAddress'),
    },
    {
      id: 'confirmUser',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.confirmUser'),
    },

    {
      id: 'confirmDate',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.confirmDate'),
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.created'),
    },
    {
      id: 'updated',
      numeric: false,
      disablePadding: false,
      paragraph: false,
      label: t('common.updated'),
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
            // sx={{ width:  }}
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

const calculateAge = (dob1) => {
  const today = new Date();
  const birthDate = new Date(dob1); // create a date object directly from `dob1` argument
  let ageNow = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    ageNow--;
  }
  return ageNow;
};

const getGender = (x) => {
  const gender = x ? 'child.gender.male' : 'child.gender.female';

  return gender;
};

const ChildrenTable = ({ childList }) => {
  const { t } = useTranslation();
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
      const newSelecteds = childList.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    dispatch({ type: NGO_BY_ID_RESET });
    navigate(`/ngo/edit/${row.id}`);
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - childList.length) : 0;
  return (
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
                  rowCount={childList.length}
                />
                <TableBody>
                  {stableSort(childList, getComparator(order, orderBy))
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
                                    row.existence_status === 1
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
                            <Switch
                              checked={row.isConfirmed}
                              // onChange={handleChange}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
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
                            <Typography variant="h6">{row.generatedCode}</Typography>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={row.awakeAvatarUrl}
                              alt="Awake Avatar"
                              sx={{ width: 50, height: 50 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={row.sleptAvatarUrl}
                              alt="Slept Avatar"
                              sx={{ width: 50, height: 50 }}
                            />
                          </TableCell>
                          <TableCell>
                            <MuiAudioPlayer
                              id="inline-timeline"
                              display="timeline"
                              containerWidth={300}
                              inline
                              src={row.voiceUrl}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.firstName_translations.en}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.lastName_translations.en}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.firstName_translations.fa}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.lastName_translations.fa}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.sayname_translations.en}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="600">
                              {row.sayname_translations.fa}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{row.done_needs_count}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">
                              {row.spent_credit.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{calculateAge(row.birthDate)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {t(getGender(row.gender))}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={row.bio_translations.en} placement="top-end">
                              <Typography
                                color="textSecondary"
                                variant="body1"
                                fontWeight="400"
                                sx={{
                                  maxWidth: '400px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  width: '200px',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.bio_translations.en}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={row.bio_summary_translations.en} placement="top-end">
                              <Typography
                                color="textSecondary"
                                variant="body1"
                                fontWeight="400"
                                sx={{
                                  maxWidth: '400px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  width: '200px',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.bio_summary_translations.en}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={row.bio_translations.fa}
                              placement="top-end"
                              componentsProps={{ popper: { sx: { direction: 'rtl' } } }}
                            >
                              <Typography
                                color="textSecondary"
                                variant="body1"
                                fontWeight="400"
                                sx={{
                                  maxWidth: '400px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  width: '200px',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                  direction: 'rtl',
                                }}
                              >
                                {row.bio_translations.fa}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={row.bio_summary_translations.fa}
                              placement="top-end"
                              componentsProps={{ popper: { sx: { direction: 'rtl' } } }}
                            >
                              <Typography
                                color="textSecondary"
                                variant="body1"
                                fontWeight="400"
                                sx={{
                                  maxWidth: '400px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  width: '200px',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                  direction: 'rtl',
                                }}
                              >
                                {row.bio_summary_translations.fa}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {/* TODO: city/country api should connect */}
                              {Number(row.country) === 98 ? 'Iran' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {/* TODO: city/country api should connect */}
                              {Number(row.city) === 1
                                ? 'Tehran'
                                : Number(row.city) === 2
                                ? 'Karaj'
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.birthPlace}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {/* TODO: city/country api should connect */}
                              {Number(row.nationality) === 98
                                ? 'Iranian'
                                : Number(row.nationality) === 93
                                ? 'Afghan'
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{row.familyCount}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{row.sayFamilyCount}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.education}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.housingStatus === '0'
                                ? 'Homeless'
                                : row.housingStatus === '1'
                                ? 'Has Home'
                                : row.housingStatus === '2'
                                ? 'Maintenance Centers'
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.id_social_worker}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{row.phoneNumber}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color="textSecondary"
                              variant="body1"
                              fontWeight="400"
                              sx={{ width: 200 }}
                            >
                              {row.address}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.confirmUser}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="body1" fontWeight="400">
                              {row.confirmDate}
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
              count={childList.length}
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
  );
};

export default ChildrenTable;

ChildrenTable.propTypes = {
  childList: PropTypes.array.isRequired,
};
