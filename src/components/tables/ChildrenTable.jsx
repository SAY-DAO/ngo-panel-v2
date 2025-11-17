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
  CircularProgress,
  Grid,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import FeatherIcon from 'feather-icons-react';
import { useTranslation } from 'react-i18next';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import ChildStatusDialog from '../dialogs/ChildStatusDialog';
import CustomSwitch from '../forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { ChildExistenceEnum, FlaskUserTypesEnum } from '../../utils/types';
import { getAge, prepareUrl } from '../../utils/helpers';
import SelectCheckBox from '../children/SelectCheckBox';
import { fetchChildList } from '../../redux/actions/childrenAction';

const trainees = process.env.REACT_APP_TRAINEE_IDS
  ? process.env.REACT_APP_TRAINEE_IDS.split(',').map(Number)
  : [];

function descendingComparator(a, b, orderBy) {
  if (
    orderBy === 'updated' ||
    orderBy === 'created' ||
    orderBy === 'birthDate' ||
    orderBy === 'confirmDate'
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

  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = [
    {
      id: 'edit',
      numeric: true,
      disablePadding: false,
      label: t('child.edit'),
    },
    {
      id: 'id',
      numeric: true,
      disablePadding: false,
      label: t('child.id'),
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: false,
      label: t('child.status'),
      width: '200px',
    },
    {
      id: 'updateStatus',
      numeric: false,
      disablePadding: false,
      label: t('child.updateStatus'),
      width: '200px',
    },

    {
      id: 'generatedCode',
      numeric: false,
      disablePadding: false,
      label: t('child.generatedCode'),
    },
    {
      id: 'awakeAvatarUrl',
      numeric: false,
      disablePadding: false,
      label: t('child.awakeAvatarUrl'),
      width: '180px',
    },
    {
      id: 'sleptAvatarUrl',
      numeric: false,
      disablePadding: false,
      label: t('child.sleptAvatarUrl'),
      width: '180px',
    },
    {
      id: 'birthDate',
      numeric: false,
      disablePadding: false,
      label: t('child.age'),
    },
    {
      id: 'education',
      numeric: false,
      disablePadding: false,
      label: t('child.education'),
    },
    {
      id: 'bio',
      numeric: false,
      disablePadding: false,
      label: t('child.bio'),
    },
    {
      id: 'bioSummaryTranslations',
      numeric: false,
      disablePadding: false,
      label: t('child.bioSummaryTranslations'),
      width: '180px',
    },
    {
      id: 'birthPlace',
      numeric: true,
      disablePadding: false,
      label: t('child.birthPlace'),
      width: '150px',
    },
    {
      id: 'city',
      numeric: true,
      disablePadding: false,
      label: t('child.city'),
    },
    {
      id: 'country',
      numeric: true,
      disablePadding: false,
      label: t('child.country'),
    },
    {
      id: 'confirmDate',
      numeric: false,
      disablePadding: false,
      label: t('child.confirmDate'),
      width: '10px',
    },
    {
      id: 'confirmUser',
      numeric: false,
      disablePadding: false,
      label: t('child.confirmUser'),
      width: '150px',
    },
    {
      id: 'id_ngo',
      numeric: true,
      disablePadding: false,
      label: t('child.id_ngo'),
      width: '100px',
    },
    {
      id: 'familyCount',
      numeric: true,
      disablePadding: false,
      label: t('child.familyCount'),
      width: '150px',
    },

    {
      id: 'id_social_worker',
      numeric: true,
      disablePadding: false,
      label: t('child.id_social_worker'),
    },
    {
      id: 'nationality',
      numeric: false,
      disablePadding: false,
      label: t('child.nationality'),
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: t('child.created'),
      width: '150px',
    },
    {
      id: 'updated',
      numeric: false,
      disablePadding: false,
      label: t('child.updated'),
      width: '150px',
    },
    {
      id: 'voiceUrl',
      numeric: false,
      disablePadding: false,
      label: t('child.voiceUrl'),
      width: '150px',
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputprops={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
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
  // numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  // onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  // rowCount: PropTypes.number.isRequired,
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

const ChildrenTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { swInfo } = useSelector((state) => state.swDetails);
  const childAll = useSelector((state) => state.childAll);
  const { myChildren, success: successMyChildren } = childAll;

  const swById = useSelector((state) => state.swById);
  const { children, success: successChildren } = swById;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList } = ngoAll;

  const BCrumb = [
    {
      to: '/',
      title: t('BCrumb.home'),
    },
    {
      title: t('BCrumb.childrenList'),
    },
  ];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('status');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [dialogValues, setDialogValues] = useState();
  const [childList, setChildList] = useState([]);
  const [filters, setFilters] = useState({
    statuses: [],
    isConfirmed: null,
  });

  // fetch children
  useEffect(() => {
    if (swInfo) {
      dispatch(fetchChildList(page, rowsPerPage, filters));
    }
  }, [swInfo, page, rowsPerPage, filters]);

  useEffect(() => {
    if ((children && children[0]) || (myChildren && myChildren.data[0])) {
      setChildList(children ? children.children : myChildren && myChildren.data);
    }
  }, [children, myChildren]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = childList.map((n) => n.firstName);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, id) => {
    // const selectedIndex = selected.indexOf(firstName);
    // let newSelected = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, firstName);
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

    if (selected[0] === id) {
      setSelected([]);
    } else {
      setSelected([id]);
    }
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
    navigate(`/children/edit/${row.id}`);
  };
  const isSelected = (firstName) => selected.indexOf(firstName) !== -1;

  const handleStatusDialog = (childId, currentStatus) => {
    setStatusDialogOpen(true);
    setDialogValues({
      childId,
      currentStatus,
    });
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid>
        <SelectCheckBox setFilters={setFilters} />
      </Grid>
      {!swInfo || (!successChildren && !successMyChildren) || childList.length <= 0 ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Box>
              <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
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
                      // onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={childList.length}
                    />
                    <TableBody>
                      {stableSort(childList, getComparator(order, orderBy)).map((row) => {
                        const isItemSelected = isSelected(row.firstName);
                        // const labelId = `enhanced-table-checkbox-${index}`;

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
                            {/* <TableCell padding="checkbox">
                                <CustomCheckbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputprops={{
                                    'aria-labelledby': labelId,
                                  }}
                                />
                              </TableCell> */}
                            <TableCell align="center">
                              <IconButton
                                onClick={() => handleEdit(row)}
                                color="primary"
                                aria-label="update child"
                              >
                                <EditOutlinedIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="h6" fontWeight="600">
                                {row.id}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
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
                                  {t(
                                    `child.statuses.${Object.keys(ChildExistenceEnum).find(
                                      (k) => ChildExistenceEnum[k] === row.existence_status,
                                    )}`,
                                  )}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
                                    backgroundColor:
                                      row.isConfirmed === true
                                        ? (theme) => theme.palette.success.main
                                        : (theme) => theme.palette.error.main,
                                    borderRadius: '100%',
                                    height: '5px',
                                    width: '5px',
                                  }}
                                />
                                <Typography
                                  color="textSecondary"
                                  variant="body1"
                                  fontWeight="200"
                                  sx={{
                                    ml: 1,
                                  }}
                                >
                                  {t('child.isConfirmed')}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
                                    backgroundColor:
                                      row.isDeleted === false
                                        ? (theme) => theme.palette.success.main
                                        : (theme) => theme.palette.error.main,
                                    borderRadius: '100%',
                                    height: '5px',
                                    width: '5px',
                                  }}
                                />
                                <Typography
                                  color="textSecondary"
                                  variant="body1"
                                  fontWeight="200"
                                  sx={{
                                    ml: 1,
                                  }}
                                >
                                  {t('child.isDeleted')}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="h6" fontWeight="600">
                                <LoadingButton
                                  disabled={
                                    (swInfo.typeId !== FlaskUserTypesEnum.ADMIN &&
                                      swInfo.typeId !== FlaskUserTypesEnum.SUPER_ADMIN) ||
                                    trainees.includes(swInfo.id)
                                  }
                                  variant="outlined"
                                  onClick={() => handleStatusDialog(row.id, row.existence_status)}
                                >
                                  {t('child.updateStatus')}
                                </LoadingButton>
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="h6" fontWeight="600">
                                {row.generatedCode}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={prepareUrl(row.awakeAvatarUrl)}
                                  alt="child logo"
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
                                    {row.firstName_translations.fa}
                                  </Typography>
                                  <Typography variant="h6" fontWeight="600">
                                    {row.lastName_translations.fa}
                                  </Typography>
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    ({row.sayname_translations.fa})
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={prepareUrl(row.sleptAvatarUrl)}
                                  alt="child logo"
                                  width="35"
                                  sx={{
                                    borderRadius: '100%',
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="h6" fontWeight="400">
                                {getAge(row.birthDate)} {t('child.years')}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="h6" fontWeight="600">
                                {row.education}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip
                                title={row.bio_translations.fa ? row.bio_translations.fa : ''}
                                placement="top-end"
                              >
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
                                  {row.bio_translations.fa}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip
                                title={
                                  row.bio_summary_translations.fa
                                    ? row.bio_summary_translations.fa
                                    : ''
                                }
                                placement="top-end"
                              >
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
                                  {row.bio_summary_translations.fa}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="h6">{row.birthPlace}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.city}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.country}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.confirmDate}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.confirmUser}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                color="textSecondary"
                                variant="body1"
                                fontWeight="400"
                                sx={{
                                  maxWidth: '140px',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  height: '1.2em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {ngoList
                                  ? ngoList.find((n) => n.id === row.id_ngo).name
                                  : swInfo && swInfo.ngoName}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.familyCount}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.id_social_worker}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.nationality}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.created}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.updated}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography color="textSecondary" variant="body1" fontWeight="400">
                                {row.voiceUrl && (
                                  <Link target="_blank" href={prepareUrl(row.voiceUrl)}>
                                    Link
                                  </Link>
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  labelRowsPerPage={t('table.rowCount')}
                  component="div"
                  count={
                    children ? children.children.length : myChildren && myChildren.meta.totalItems
                  }
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
      )}

      {statusDialogOpen && (
        <ChildStatusDialog
          open={statusDialogOpen}
          setOpen={setStatusDialogOpen}
          dialogValues={dialogValues}
        />
      )}
    </PageContainer>
  );
};
export default ChildrenTable;
