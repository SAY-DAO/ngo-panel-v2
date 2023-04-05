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
  Stack,
  Snackbar,
  Alert,
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
import LinearNeedStats from '../analytics/LinearNeedStats';
import PieChart from '../analytics/PieChart';
import {
  deleteNeed,
  fetchAllNeeds,
  fetchChildNeeds,
  fetchSwNeedList,
} from '../../redux/actions/needsAction';
import CustomCheckbox from '../forms/custom-elements/CustomCheckbox';
import { fetchSwOrNgoChildList } from '../../redux/actions/socialWorkerAction';
import { getDuplicateChildNeeds, getOrganizedNeeds } from '../../utils/helpers';
import { RolesEnum } from '../../utils/types';
import {
  ALL_NEEDS_RESET,
  UPDATE_NEED_CONFIRM_RESET,
  UPDATE_ONE_NEED_RESET,
} from '../../redux/constants/needConstant';
import { dateConvertor } from '../../utils/persianToEnglish';
import ConfirmNeedDialog from '../dialogs/ConfirmNeedDialog';

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
  } else if (orderBy === 'unpayable' && (!b.paid || !a.paid)) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
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
      id: 'selectCheckbox',
      numeric: false,
      disablePadding: false,
      label: '',
    },
    {
      id: 'update',
      numeric: false,
      disablePadding: true,
      label: t('need.update'),
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
      width: '150px',
    },
    {
      id: 'link',
      numeric: false,
      disablePadding: false,
      label: t('need.link'),
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
      id: 'created',
      numeric: false,
      disablePadding: false,
      label: t('need.created'),
      width: '200px',
    },
    {
      id: 'created_by_id',
      numeric: false,
      disablePadding: false,
      label: t('need.socialWorker'),
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
      title: t('BCrumb.home'),
    },
    {
      title: t('BCrumb.needsList'),
    },
  ];

  const [needsData, setNeedsData] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('isConfirmed');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [toastOpen, setToastOpen] = useState(false);
  const [openDialog, setDialogOpen] = useState(false);
  const [dialogValues, setDialogValues] = useState();
  const [theTableNeeds, setTheTableNeeds] = useState();
  const [theTableMaxNeeds, setTheTableMaxNeeds] = useState();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo && optionsNgo.length === 0;
  const [take, setTake] = useState(100);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;
  const [ngo, setNgo] = useState(
    swInfo &&
      (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.SUPER_ADMIN
        ? {
            id: 2,
            name: 'مهر و ماه',
          }
        : {
            id: swInfo.ngoId,
            name: swInfo.ngoName,
          }),
  );

  const [child, setChild] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    sayName: t('child.all'),
    isConfirmed: true,
  });

  const CustomizerReducer = useSelector((state) => state.CustomizerReducer);
  const { activeDir } = CustomizerReducer;

  const childNeeds = useSelector((state) => state.childNeeds);
  const { theNeeds, loading: loadingChildNeeds, success: successChildNeeds } = childNeeds;

  const childOneNeed = useSelector((state) => state.childOneNeed);
  const { oneNeed, deleted } = childOneNeed;

  const childrenByNgo = useSelector((state) => state.childrenByNgo);
  const { childList, loading: loadingChildren, success: successNgoChildren } = childrenByNgo;

  const allNeeds = useSelector((state) => state.allNeeds);
  const { needs, loading: loadingAllNeeds, success: successAllNeeds } = allNeeds;

  const swNeedList = useSelector((state) => state.swNeedList);
  const { needs: swNeeds, loading: loadingSwNeeds, success: successSwNeeds } = swNeedList;

  // for social worker with limited permission
  const swById = useSelector((state) => state.swById);
  const { children: swChildren, loading: loadingSw } = swById;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, loading: loadingNgoList, success: successNgoList } = ngoAll;

  const childById = useSelector((state) => state.childById);
  const { result } = childById;

  const needUpdate = useSelector((state) => state.needUpdate);
  const { success: successUpdateNeed } = needUpdate;

  // child open
  useEffect(() => {
    if (swInfo && ngo) {
      // super admin & admin
      if (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN) {
        console.log('fetchChildrenByNgo');
        dispatch(fetchChildrenByNgo({ ngoId: ngo.id }));
      } else if (swInfo.typeId === RolesEnum.NGO_SUPERVISOR) {
        // backend will filter all ngo children
        dispatch(fetchSwOrNgoChildList());
        console.log('fetchٔNgoChildList');
      } else if (swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        // backend will filter only sw children
        dispatch(fetchSwOrNgoChildList());
        console.log('fetchSwChildList');
      }
    }
  }, [ngo, swInfo]);

  // fetch needs
  useEffect(() => {
    if (swInfo) {
      if (
        swInfo.typeId === RolesEnum.SUPER_ADMIN ||
        swInfo.typeId === RolesEnum.ADMIN ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        if (child && child.id > 0) {
          console.log('fetchChildNeeds');
          dispatch(fetchChildNeeds(child.id, take));
        } else if (ngo || (child && child.id < 0)) {
          console.log('fetchAllNeeds');
          dispatch(fetchAllNeeds(ngo.id, take));
        }
      }
      if (swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        if (child && child.id > 0) {
          console.log('fetchChildNeeds');
          dispatch(fetchChildNeeds(child.id));
        } else {
          dispatch(fetchSwNeedList(take));
          console.log('fetchSwNeedList');
        }
      }
    }
  }, [swInfo, child, deleted, ngo, take]);

  // filter needs for the table
  useEffect(() => {
    let tableNeeds;
    // one children
    if (swInfo && theNeeds && child && child.id > 0) {
      if (
        (theNeeds && swInfo.typeId === RolesEnum.SUPER_ADMIN) ||
        swInfo.typeId === RolesEnum.ADMIN ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        tableNeeds = theNeeds.needs;
        setTheTableNeeds(tableNeeds);
        setTheTableMaxNeeds(theNeeds.total_count);
      }
      if (theNeeds && swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        tableNeeds = theNeeds.needs.filter((n) => swInfo.id === n.createdBy);
        console.log('table = the sw child needs');
        setTheTableMaxNeeds(theNeeds.total_count);
        setTheTableNeeds(tableNeeds);
      }
      // all children
    } else if (swInfo && needs && child && child.id === 0) {
      if (
        swInfo.typeId === RolesEnum.SUPER_ADMIN ||
        swInfo.typeId === RolesEnum.ADMIN ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        tableNeeds = needs.needs;
        console.log('table = all needs');
        setTheTableMaxNeeds(needs.all_needs_count);
        setTheTableNeeds(tableNeeds);
      }
    } else if (swInfo && swNeeds) {
      if (swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        tableNeeds = swNeeds;
        console.log('table = swNeeds');
        setTheTableMaxNeeds(swNeeds.length); // TODO: all needs count is needed
        setTheTableNeeds(tableNeeds);
      }
    }
  }, [swInfo, successChildNeeds, successAllNeeds, successSwNeeds]);

  // sort needs for statics
  useEffect(() => {
    if (swInfo && !open) {
      // admins and Ngo supervisors vs. social workers
      if (
        swInfo.typeId === RolesEnum.SUPER_ADMIN ||
        swInfo.typeId === RolesEnum.ADMIN ||
        swInfo.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        if (successChildNeeds) {
          const needData = getOrganizedNeeds(theNeeds);
          console.log('need data 1');
          setNeedsData(needData);
        }
        if (successAllNeeds && child && child.id === 0) {
          const needData = getOrganizedNeeds(needs);
          console.log('need data 2');
          setNeedsData(needData);
        }
        if (successSwNeeds) {
          const needData = getOrganizedNeeds(swNeeds);
          console.log('need data 3');
          setNeedsData(needData);
        }
      } else if (swInfo.typeId === RolesEnum.SOCIAL_WORKER) {
        if (successChildNeeds) {
          console.log(theNeeds);
          const filteredChildNeeds = theNeeds.needs.filter((n) => swInfo.id === n.createdBy);
          console.log(filteredChildNeeds);
          const needData = getOrganizedNeeds(filteredChildNeeds);
          console.log('need data 4');
          setNeedsData(needData);
        }
        if (successSwNeeds && child && child.id === 0) {
          const needData = getOrganizedNeeds(swNeeds);
          console.log('need data 5');
          setNeedsData(needData);
        }
      }
    }
  }, [successChildNeeds, successAllNeeds, successSwNeeds, open]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }

    if (active && swInfo) {
      // super admin & admin
      if (
        (swInfo.typeId === RolesEnum.SUPER_ADMIN || swInfo.typeId === RolesEnum.ADMIN) &&
        successNgoList
      ) {
        setOptionsNgo([...ngoList]);
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

  // Autocomplete children
  useEffect(() => {
    let active = true;
    if (loadingChildren) {
      return undefined;
    }
    // super admin & admin
    if (active && successNgoChildren) {
      // sort children
      const sortedChildren = childList.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptions([
        { id: 0, firstName: '', lastName: '', sayName: t('child.all'), isConfirmed: true },
        ...sortedChildren,
      ]);
    }
    // social worker
    if (active && swChildren) {
      // sort swChildren
      const sortedChildren = swChildren.children.sort(
        (a, b) => Number(b.isConfirmed) - Number(a.isConfirmed),
      );
      setOptions([
        { id: 0, firstName: '', lastName: '', sayName: t('child.all'), isConfirmed: true },
        ...sortedChildren,
      ]);
    }
    return () => {
      active = false;
    };
  }, [loadingChildren, successNgoChildren, swChildren, ngo]);

  // when click on Breadcrumb use the state to retrieve the child
  useEffect(() => {
    if (!child && theChildId) {
      dispatch(fetchMyChildById(theChildId));
    }
  }, [theChildId]);

  // toast
  useEffect(() => {
    if (successUpdateNeed) {
      setToastOpen(true);
    }
  }, [successUpdateNeed]);

  const onNgoOpen = () => {
    setOpenNgo(true);
  };

  const onChildOpen = () => {
    dispatch({ type: ALL_NEEDS_RESET });
    setOpen(true);
  };
  const onNgoSet = (value) => {
    setNgo(value);
    setChild({
      id: 0,
      firstName: '',
      lastName: '',
      sayName: t('child.all'),
      isConfirmed: true,
    });
  };
  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = theNeeds.needs.map((n) => n.id);
  //     setSelected(newSelecteds);
  //     console.log(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
    dispatch({ type: SW_BY_ID_RESET });
    dispatch({ type: UPDATE_ONE_NEED_RESET });

    // refresh need edit and back to list
    setChild({
      id: 0,
      firstName: '',
      lastName: '',
      sayName: t('child.all'),
      isConfirmed: true,
    });
    navigate(`/need/edit/${row.child_id || child.id || (result && result.id)}/${row.id}`);
  };

  const handleDialog = (row) => {
    dispatch({ type: UPDATE_NEED_CONFIRM_RESET });
    const duplicates = getDuplicateChildNeeds(theTableNeeds, row);
    setDialogValues({ duplicates, theNeed: row });
    setDialogOpen(true);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && (needs || theNeeds || swNeeds)
      ? Math.max(0, (1 + page) * rowsPerPage - (needs || theNeeds || swNeeds).needs.length)
      : 0;

  return (
    <PageContainer title="Needs Table" sx={{ maxWidth: '100%' }}>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Autocomplete
            value={ngo && ngo.id && ngo}
            id="asynchronous-ngo"
            sx={{ width: 300 }}
            open={openNgo}
            onOpen={() => onNgoOpen()}
            onClose={() => {
              setOpenNgo(false);
            }}
            onChange={(e, value) => onNgoSet(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            options={optionsNgo}
            loading={loadingSw || loadingNgo || loadingNgoList}
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
        {child && (
          <Grid item>
            <Autocomplete
              value={child}
              id="asynchronous-children"
              sx={{ width: 300 }}
              open={open}
              onOpen={() => {
                onChildOpen();
              }}
              onClose={() => {
                setOpen(false);
              }}
              onChange={(e, value) => setChild(value)}
              isOptionEqualToValue={(option, value) => option && option.id === value.id}
              getOptionLabel={(option) =>
                option &&
                (option.isConfirmed && option.id > 0
                  ? `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName})`
                  : !option.isConfirmed && option.id > 0
                  ? `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName})`
                  : `(${option.sayName})`)
              }
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option && option.isConfirmed ? (
                    <>
                      <FeatherIcon color="green" icon="check" width="18" />
                      <Typography>
                        {option &&
                          (option.id > 0
                            ? `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName}) `
                            : `(${option.sayName})`)}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <FeatherIcon color="red" icon="x" width="18" />
                      <Typography>
                        {option &&
                          (option.id > 0
                            ? `${option.id} - ${option.firstName} ${option.lastName}- (${option.sayName}) `
                            : `(${option.sayName})`)}
                      </Typography>
                    </>
                  )}
                </Box>
              )}
              options={successNgoList || swChildren ? options : []}
              loading={loadingSw || loadingChildren}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('child.title')}
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
        )}
      </Grid>
      {loadingSw || loadingSwNeeds || loadingAllNeeds || loadingChildNeeds ? (
        <Grid sx={{ margin: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        needsData &&
        theTableNeeds && (
          <Card sx={{ maxWidth: '100%' }}>
            <Grid container direction="row">
              <Grid item xs={12} md={4}>
                <LinearNeedStats needsData={needsData} totalNeeds={theTableNeeds.length} />
              </Grid>
              <Grid item xs={12} md={8}>
                <PieChart
                  setTake={setTake}
                  take={take}
                  donaNeeds={needsData[5]}
                  allNeeds={theTableNeeds}
                  totalNeeds={theTableNeeds.length}
                  maxCount={theTableMaxNeeds}
                  child={child}
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
                        rowCount={theTableNeeds.length}
                      />
                      <TableBody>
                        {stableSort(theTableNeeds, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `${row.id}`;

                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                              >
                                <TableCell
                                  padding="checkbox"
                                  onClick={(event) => handleClick(event, row.id)}
                                >
                                  <CustomCheckbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputprops={{
                                      'aria-labelledby': labelId,
                                    }}
                                  />
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
                                <TableCell padding="checkbox">
                                  <Typography color="textSecondary" variant="h6" fontWeight="400">
                                    {labelId}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Switch
                                    disabled={
                                      swInfo.typeId === RolesEnum.SOCIAL_WORKER ||
                                      swInfo.typeId === RolesEnum.NGO_SUPERVISOR
                                    }
                                    checked={
                                      oneNeed && row.id === oneNeed.id
                                        ? oneNeed.isConfirmed
                                        : row.isConfirmed
                                    }
                                    onChange={() => handleDialog(row)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Tooltip
                                      title={
                                        row.unpayable === false && !row.isDone ? (
                                          <Typography sx={{ fontSize: 12 }}>
                                            {t('need.payable')}
                                          </Typography>
                                        ) : row.unpayable === true && !row.isDone ? (
                                          <Typography sx={{ fontSize: 12 }}>
                                            {t('need.unpayable')}
                                          </Typography>
                                        ) : (
                                          <Typography sx={{ fontSize: 12 }}>
                                            {t('need.fullyPaid')}
                                          </Typography>
                                        )
                                      }
                                    >
                                      <Box
                                        sx={{
                                          backgroundColor:
                                            row.unpayable === false && !row.isDone
                                              ? (theme) => theme.palette.success.main
                                              : row.unpayable === true && !row.isDone
                                              ? (theme) => theme.palette.error.main
                                              : (theme) => theme.palette.info.main,
                                          borderRadius: '100%',
                                          height: '10px',
                                          width: '10px',
                                        }}
                                      />
                                    </Tooltip>
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
                                  <Box display="flex" alignItems="center">
                                    <Avatar
                                      src={row.imageUrl && row.imageUrl}
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
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.link && (
                                      <Link href={row.link} target="_blank">
                                        Link
                                      </Link>
                                    )}
                                  </Typography>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.affiliateLinkUrl && (
                                      <Link href={row.affiliateLinkUrl} target="_blank">
                                        Affiliate
                                      </Link>
                                    )}
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
                                    {row.created
                                      ? activeDir === 'rtl'
                                        ? dateConvertor(row.created)
                                        : row.created
                                      : '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.created_by_id || row.createdBy}
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
                                    {row.confirmDate
                                      ? activeDir === 'rtl'
                                        ? dateConvertor(row.confirmDate)
                                        : row.confirmDate
                                      : '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.updated
                                      ? activeDir === 'rtl'
                                        ? dateConvertor(row.updated)
                                        : row.updated
                                      : '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    fontWeight="400"
                                  >
                                    {row.doneAt
                                      ? activeDir === 'rtl'
                                        ? dateConvertor(row.doneAt)
                                        : row.doneAt
                                      : '-'}
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
                                    {row.child_delivery_date
                                      ? activeDir === 'rtl'
                                        ? dateConvertor(row.child_delivery_date)
                                        : row.child_delivery_date
                                      : '-'}
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
                    count={theTableNeeds.length}
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
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
                <Alert
                  onClose={handleCloseToast}
                  variant="filled"
                  severity="success"
                  sx={{ width: '100%' }}
                >
                  {successUpdateNeed && t('socialWorker.updated')}
                </Alert>
              </Snackbar>
            </Stack>
            {dialogValues && (
              <ConfirmNeedDialog
                open={openDialog}
                setOpen={setDialogOpen}
                dialogValues={dialogValues}
              />
            )}
          </Card>
        )
      )}
    </PageContainer>
  );
};

export default NeedTable;
