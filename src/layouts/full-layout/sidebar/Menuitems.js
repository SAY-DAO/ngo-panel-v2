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

const Menuitems = [
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
    href: '/profile/view',
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
        admin: true,
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
        admin: true,
      },
      {
        title: 'sidebar.add',
        icon: 'edit',
        href: '/need/add',
        admin: true,
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
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/ngo/add',
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
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/provider/add',
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
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/sw/add',
      },
      {
        title: 'sidebar.socialWorkers.migrate',
        icon: <MoveDownIcon />,
        href: '/sw/migrate',
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
      },
      {
        title: 'sidebar.add',
        icon: 'plus',
        href: '/categories/add',
      },
    ],
  },
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
];

export default Menuitems;
