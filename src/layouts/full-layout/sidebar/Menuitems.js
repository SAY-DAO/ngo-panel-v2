import ChildCareIcon from '@mui/icons-material/ChildCare';
import InterestsIcon from '@mui/icons-material/Interests';
import HouseIcon from '@mui/icons-material/House';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HiveIcon from '@mui/icons-material/Hive';
import HubIcon from '@mui/icons-material/Hub';
import RouteIcon from '@mui/icons-material/Route';
import React from 'react';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import BurstModeOutlinedIcon from '@mui/icons-material/BurstModeOutlined';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'sidebar.daoHeader',
    href: 'DAO',
    admin: true,
  },
  {
    title: 'sidebar.dashboard',
    icon: <HubIcon />,
    href: '/dao',
    admin: true,
  },
  {
    navlabel: true,
    subheader: 'sidebar.swHeader',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Dashboard',
    admin: false,
  },
  {
    title: 'sidebar.myPage',
    icon: 'user',
    href: '/page/view',
    admin: false,
  },
  {
    title: 'sidebar.signatures',
    icon: <HandshakeOutlinedIcon />,
    href: '/signatures/me',
    admin: false,
  },
  {
    title: 'sidebar.children.title',
    icon: <ChildCareIcon />,
    href: '/children',
    collapse: true,
    admin: false,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/children/list',
      },
      {
        title: 'sidebar.add',
        icon: 'edit',
        href: '/children/add',
      },
    ],
  },
  {
    title: 'sidebar.needs.title',
    icon: <InterestsIcon />,
    href: '/need',
    admin: false,
    collapse: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/need/list',
      },
      {
        title: 'sidebar.add',
        icon: 'edit',
        href: '/need/add',
      },
    ],
  },

  {
    title: 'sidebar.milestone.title',
    icon: <RouteIcon />,
    href: '/dao/milestone',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/dao/milestone/list',
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/dao/milestone/add',
      },
    ],
  },
  {
    title: 'sidebar.reports',
    icon: <MenuBookIcon />,
    href: '/report/needs/paid',
    collapse: true,
    admin: false,
  },
  // Admin
  {
    navlabel: true,
    subheader: 'sidebar.adminHeader',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Reports',
    admin: true,
  },
  {
    title: 'sidebar.ngos.title',
    icon: <HouseIcon />,
    href: '/ngo',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/ngo/list',
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/ngo/add',
        admin: true,
      },
      {
        title: 'sidebar.ngos.arrivals',
        icon: <DeliveryDiningIcon />,
        href: '/ngo/arrivals',
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.providers.title',
    icon: <StorefrontIcon />,
    href: '/provider',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/provider/list',
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/provider/add',
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
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/sw/list',
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/sw/add',
        admin: true,
      },
      {
        title: 'sidebar.socialWorkers.migrate',
        icon: <MoveDownIcon />,
        href: '/sw/migrate',
        admin: true,
      },
    ],
  },
  {
    title: 'sidebar.categories.title',
    icon: <HiveIcon />,
    href: '/admin/catagories',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/categories/list',
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/categories/add',
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
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/midjourney/list',
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
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/comment/list',
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
    children: [
      {
        title: 'sidebar.list',
        icon: 'list',
        href: '/contribution/list',
        admin: true,
      },
    ],
  },
];

export default Menuitems;
