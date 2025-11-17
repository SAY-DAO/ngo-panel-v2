import ChildCareIcon from '@mui/icons-material/ChildCare';
import InterestsIcon from '@mui/icons-material/Interests';
import HouseIcon from '@mui/icons-material/House';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HubIcon from '@mui/icons-material/Hub';
import React from 'react';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import BurstModeOutlinedIcon from '@mui/icons-material/BurstModeOutlined';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import BuildIcon from '@mui/icons-material/Build';
import {
  PROFILE_VIEW,
  SW_LIST,
  SW_ADD,
  SW_MIGRATE,
  PROVIDER_LIST,
  PROVIDER_ADD,
  NGO_LIST,
  NGO_ARRIVALS,
  NGO_ADD,
  CHILDREN_LIST,
  CHILDREN_PRE_REGISTER,
  NEED_LIST,
  NEED_ADD,
  REPORTS,
  NEED_MIDJOURNEY,
  NEED_COMMENT,
  CONTRIBUTION,
  MY_SIGNATURES,
  DAO_HOME,
  CHILDREN_PRE_REGISTER_LIST,
  CAMPAIGN_MONTHLY,
  USER_SEARCH,
  USER_BUILDERS,
  USER_CHECKPOINTS,
  NEED_CONFIRM,
  CAMPAIGN_NEWSLETTER,
  PRE_REGISTER_NGO_LIST,
} from '../../../routes/RouteConstants';

export const Menuitems = [
  {
    navlabel: true,
    subheader: 'sidebar.daoHeader',
    href: 'DAO',
    admin: true,
    trainee: false,
  },
  {
    title: 'sidebar.dashboard',
    icon: <HubIcon />,
    href: DAO_HOME,
    admin: true,
    trainee: false,
  },
  {
    navlabel: true,
    subheader: 'sidebar.swHeader',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Dashboard',
    admin: false,
    trainee: true,
  },
  {
    title: 'sidebar.myPage',
    icon: 'user',
    href: PROFILE_VIEW,
    admin: false,
    trainee: true,
  },
  {
    title: 'sidebar.signatures',
    icon: <HandshakeOutlinedIcon />,
    href: MY_SIGNATURES,
    admin: false,
    trainee: false,
  },
  {
    title: 'sidebar.children.title',
    icon: <ChildCareIcon />,
    href: '/children',
    collapse: true,
    admin: false,
    trainee: true,
    children: [
      {
        title: 'sidebar.listConfirmedChildren',
        icon: 'list',
        href: CHILDREN_LIST,
      },
      // {
      //   title: 'sidebar.add',
      //   icon: 'plus-square',
      //   href: CHILDREN_ADD,
      // },
      {
        title: 'sidebar.preregister',
        icon: <HowToRegIcon />,
        href: CHILDREN_PRE_REGISTER,
      },
      {
        title: 'sidebar.preregisterList',
        icon: 'list',
        href: CHILDREN_PRE_REGISTER_LIST,
      },
    ],
  },
  {
    title: 'sidebar.needs.title',
    icon: <InterestsIcon />,
    href: '/need',
    admin: false,
    collapse: true,
    trainee: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: NEED_LIST,
      },
      {
        title: 'sidebar.add',
        icon: 'plus-square',
        href: NEED_ADD,
      },
      {
        title: 'sidebar.confirm',
        icon: <CheckCircleOutlineIcon />,
        href: NEED_CONFIRM,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.reports',
    icon: <MenuBookIcon />,
    href: REPORTS,
    collapse: true,
    admin: false,
    trainee: false,
  },
  // Admin
  {
    navlabel: true,
    subheader: 'sidebar.adminHeader',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Reports',
    admin: true,
    trainee: false,
  },
  {
    title: 'sidebar.ngos.title',
    icon: <HouseIcon />,
    href: '/ngo',
    collapse: true,
    admin: true,
    trainee: true,
    children: [
      {
        title: 'sidebar.ngos.preList',
        icon: 'list',
        href: PRE_REGISTER_NGO_LIST,
        admin: true,
    trainee: true,
      },
      {
        title: 'sidebar.ngos.list',
        icon: 'list',
        href: NGO_LIST,
        // admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus-square',
        href: NGO_ADD,
        admin: true,
      },
      {
        title: 'sidebar.ngos.arrivals',
        icon: <DeliveryDiningIcon />,
        href: NGO_ARRIVALS,
        // admin: true,
      },
    ],
  },
  {
    title: 'sidebar.providers.title',
    icon: <StorefrontIcon />,
    href: '/provider',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: PROVIDER_LIST,
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus-square',
        href: PROVIDER_ADD,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.socialWorkers.title',
    icon: 'users',
    href: '/sw',
    collapse: true,
    admin: true,
    trainee: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: SW_LIST,
        // admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus-square',
        href: SW_ADD,
        admin: true,
      },
      {
        title: 'sidebar.socialWorkers.migrate',
        icon: <MoveDownIcon />,
        href: SW_MIGRATE,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.users.title',
    icon: <EscalatorWarningIcon />,
    href: '/users',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.users.checkpoints',
        icon: <AirlineStopsIcon />,
        href: USER_CHECKPOINTS,
        admin: true,
      },
      {
        title: 'sidebar.users.builders',
        icon: <BuildIcon />,
        href: USER_BUILDERS,
        admin: true,
      },
      {
        title: 'sidebar.users.search',
        icon: 'search',
        href: USER_SEARCH,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.midjourney.title',
    icon: <BurstModeOutlinedIcon />,
    href: '/admin/midjourney',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: NEED_MIDJOURNEY,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.comment.title',
    icon: <MapsUgcOutlinedIcon />,
    href: '/admin/comment',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: NEED_COMMENT,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.contribution.title',
    icon: <GroupsOutlinedIcon />,
    href: '/admin/contribution',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: CONTRIBUTION,
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.campaign.title',
    icon: <MailOutlineIcon />,
    href: '/admin/campaign',
    collapse: true,
    admin: true,
    trainee: false,
    children: [
      {
        title: 'sidebar.campaign.type.report',
        icon: 'list',
        href: CAMPAIGN_MONTHLY,
        admin: true,
      },
      {
        title: 'sidebar.campaign.type.newsletter',
        icon: 'plus-square',
        href: CAMPAIGN_NEWSLETTER,
        admin: true,
      },
    ],
  },
];

export const TraineeItems = Menuitems.filter((item) => item.trainee);
