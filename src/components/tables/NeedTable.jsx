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
import { useLocation, useNavigate } from 'react-router-dom';
import CustomSwitch from '../forms/custom-elements/CustomSwitch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../container/PageContainer';
import { SW_BY_ID_RESET } from '../../redux/constants/socialWorkerConstants';
import { fetchChildrenByNgo, fetchMyChildById } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import LinearNeedStats from '../analytics/LinearNeedStats';
import PieChart from '../analytics/PieChart';
import { deleteNeed, fetchChildNeeds, updateNeedConfirm } from '../../redux/actions/needsAction';
import CustomCheckbox from '../forms/custom-elements/CustomCheckbox';
import { fetchSwChildList } from '../../redux/actions/socialWorkerAction';
import { RolesEnum } from '../../utils/helpers';

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
      id: 'selectCheckbox',
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
      id: 'isConfirmed',
      numeric: false,
      disablePadding: false,
      label: t('need.isConfirmed'),
      width: '150px',
    },
    {
      id: 'unpayable',
      numeric: false,
      disablePadding: true,
      label: t('need.unpayable'),
      width: '150px',
    },
    {
      id: 'sayName',
      numeric: false,
      disablePadding: true,
      label: t('need.childSayName'),
      width: '150px',
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
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: t('need.name.fa'),
      width: '200px',
    },
    {
      id: 'title',
      numeric: false,
      disablePadding: false,
      label: t('need.etitle'),
      width: '200px',
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
      id: 'isUrgent',
      numeric: false,
      disablePadding: false,
      label: t('need.isUrgent'),
    },
    {
      id: 'informations',
      numeric: false,
      disablePadding: false,
      label: t('need.informations'),
      width: '200px',
    },
    {
      id: 'details',
      numeric: false,
      disablePadding: false,
      label: t('need.details'),
      width: '250px',
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
      width: '200px',
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
      width: '200px',
    },
    {
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: t('need.created'),
      width: '200px',
    },
    {
      id: 'confirmUser',
      numeric: false,
      disablePadding: false,
      label: t('need.confirmUser'),
      width: '200px',
    },
    {
      id: 'confirmDate',
      numeric: false,
      disablePadding: false,
      label: t('need.confirmDate'),
      width: '200px',
    },
    {
      id: 'updated',
      numeric: false,
      disablePadding: false,
      label: t('need.updated'),
      width: '200px',
    },
    {
      id: 'doneAt',
      numeric: false,
      disablePadding: false,
      label: t('need.doneAt'),
      width: '200px',
    },
    {
      id: 'doing_duration',
      numeric: false,
      disablePadding: false,
      label: t('need.doing_duration'),
      width: '180px',
    },
    {
      id: 'child_delivery_date',
      numeric: false,
      disablePadding: false,
      label: t('need.child_delivery_date'),
      width: '200px',
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
  const dispatch = useDispatch();
  const { numSelected, selected } = props;

  const handleDelete = () => {
    console.log(selected);
    dispatch(deleteNeed(selected[0]));
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
      {numSelected > 0 && (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} selected
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <FeatherIcon icon="trash-2" width="18" />
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


const NeedTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const theChildId = location.state;


  const BCrumb = [
    {
      to: '/',
      title: t("BCrumb.home"),
    },
    {
      title: t("BCrumb.needsList"),
    },
  ];

  const [needsData, setNeedsData] = useState();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('updated');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [ngoId, setNgoId] = useState();
  const [childId, setChildId] = useState();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo.length === 0;


  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const childNeeds = useSelector((state) => state.childNeeds);
  const { theNeeds, loading: loadingChildrenNeeds, success: successChildrenNeeds } = childNeeds;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { confirmed, deleted } = childOneNeed;

  const childrenByNgo = useSelector((state) => state.childrenByNgo);
  const { childList, loading: loadingChildren, success: successChildren } = childrenByNgo;

  // for social worker with limited permission
  const swById = useSelector((state) => state.swById);
  const { children, loading: loadingSw, success: successSwChildren } = swById;

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
  }, [childId, result, confirmed, deleted]);

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
    } else if (swInfo) {
      // super admin & admin
      if ((swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN)) {
        dispatch(fetchNgoList());
      } else if (swInfo.typeId !== RolesEnum.SOCIAL_WORKER || RolesEnum.NGO_SUPERVISOR || RolesEnum.NGO_SUPERVISOR) {
        setOptionsNgo([{
          id: swInfo.ngoId,
          name: swInfo.ngoName
        }])
      }

    }

  }, [openNgo]);

  // Autocomplete children
  useEffect(() => {
    let active = true;
    if (loadingChildren) {
      return undefined;
    }
    // super admin & admin
    if (active && successChildren) {
      // sort children
      const sortedChildren = childList.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptions([...sortedChildren]);
    }
    // social worker
    if (active && children) {
      // sort children
      const sortedChildren = children.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      console.log(children)

      setOptions([...sortedChildren]);
    }
    return () => {
      active = false;
    };
  }, [loadingChildren, successChildren, children, ngoId]);

  // child open
  useEffect(() => {
    if (!open || openNgo) {
      setOptions([]);
    } else if (ngoId && (open || !openNgo)) {
      // super admin & admin
      if ((swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN)) {
        dispatch(fetchChildrenByNgo({ ngoId }));
      } else if (swInfo.typeId !== RolesEnum.SOCIAL_WORKER || RolesEnum.NGO_SUPERVISOR) {
        dispatch(fetchSwChildList());
        setOptions([{
          id: swInfo.ngoId,
          name: swInfo.ngoName
        }])
      }
    }
  }, [open, openNgo, ngoId, swInfo]);

  // when click on Breadcrumb use the state to retrieve the child
  useEffect(() => {
    if (!childId && theChildId) {
      dispatch(fetchMyChildById(theChildId));
    }
  }, [theChildId]);

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = theNeeds.needs.map((n) => n.id);
  //     setSelected(newSelecteds);
  //     console.log(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, id) => {
    // const selectedIndex = selected.indexOf(id);
    // const newSelected = [];

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

    if (selected[0] === id) {
      setSelected([])
    } else {
      setSelected([id]);

    }
  };
  // console.log(selected)

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
    navigate(`/need/edit/${childId || (result && result.id)}/${row.id}`);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
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
            loading={loadingSw || loadingNgo}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("ngo.title")}
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
                ? `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName})`
                : `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName})`
            }
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.isConfirmed ? (
                  <>
                    <FeatherIcon color="green" icon="check" width="18" />
                    <Typography>
                      {`${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName}) `}
                    </Typography>
                  </>
                ) : (
                  <>
                    <FeatherIcon color="red" icon="x" width="18" />
                    <Typography> {`${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName}) `}</Typography>
                  </>
                )}
              </Box>
            )}
            options={(successNgoList && ngoId) || children ? options : []}
            loading={loadingSw || loadingChildren}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("child.title")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingChildren ? <CircularProgress color="inherit" size={20} /> : null}
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
        (successChildren || successChild || successSwChildren) &&
        successChildrenNeeds && (
          <Card sx={{ maxWidth: '100%' }}>
            <Grid container direction="row">
              <Grid item xs={12} md={4}>
                <LinearNeedStats
                  needsData={needsData}
                  totalNeeds={parseInt(theNeeds.total_count, 10)}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <PieChart
                  donaNeeds={needsData[5]}
                  allNeeds={theNeeds.needs}
                  totalNeeds={parseInt(theNeeds.total_count, 10)}
                />
              </Grid>
            </Grid>

            <CardContent>
              <Box>
                <Paper sx={{ mb: 2 }}>
                  <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
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
                        // onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={theNeeds.needs.length}
                      />
                      <TableBody>
                        {stableSort(theNeeds.needs, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `${row.id}`;

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
                                <TableCell padding="checkbox">
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {labelId}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Switch
                                    checked={row.isConfirmed}
                                    onChange={() => dispatch(updateNeedConfirm(row.id))}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Box
                                      sx={{
                                        backgroundColor:
                                          row.unpayable === false
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
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.childSayName || (result && result.sayName)}
                                  </Typography>
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
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title={row.title ? row.title : ''} placement="top-end">
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
                                    {`${row.isUrgent}`}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Tooltip
                                    title={row.informations ? row.informations : ''}
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
                                      {row.informations}
                                    </Typography>
                                  </Tooltip>

                                </TableCell>
                                <TableCell>
                                  <Tooltip
                                    title={row.details ? row.details : ''}
                                    placement="top-end"
                                  >
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
                                      {row.details}
                                    </Typography>
                                  </Tooltip>
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
                                  <Tooltip
                                    title={row.description ? row.description : ''}
                                    placement="top-end"
                                  >
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
                                    {row.doing_duration}
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
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage={t('table.rowCount')}
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
                  label={t('table.dense')}
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
