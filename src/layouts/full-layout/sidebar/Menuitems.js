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
    subheader: 'Social Worker',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Dashboard',
    admin: false,
  },
  {
    title: 'My Page',
    icon: 'user',
    href: '/profile/view',
    admin: false,
  },

  {
    title: 'Children',
    icon: <ChildCareIcon />,
    href: '/children',
    collapse: true,
    admin: false,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/children/list',
      },
      {
        title: 'Add',
        icon: 'edit',
        href: '/children/add',
      },
    ],
  },
  {
    title: 'Needs',
    icon: <InterestsIcon />,
    href: '/need',
    admin: false,
    collapse: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/need/list',
      },
      {
        title: 'Add',
        icon: 'edit',
        href: '/need/add',
      },
    ],
  },

  {
    title: 'MileStone',
    icon: <RouteIcon />,
    href: '/dao/milestone',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/dao/milestone/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/dao/milestone/add',
      },
    ],
  },
  {
    title: 'Reports',
    icon: <MenuBookIcon />,
    href: '/report/needs/paid',
    collapse: true,
    admin: false,
  },
  // Admin
  {
    navlabel: true,
    subheader: 'ADMIN',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Reports',
    admin: true,
  },
  {
    title: 'NGOs',
    icon: <HouseIcon />,
    href: '/ngo',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/ngo/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/ngo/add',
      },
    ],
  },
  {
    title: 'Providers',
    icon: <StorefrontIcon />,
    href: '/provider',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/provider/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/provider/add',
      },
    ],
  },
  {
    title: 'Social Workers',
    icon: 'users',
    href: '/sw',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/sw/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/sw/add',
      },
      {
        title: 'Migrate',
        icon: <MoveDownIcon />,
        href: '/sw/migrate',
      },
    ],
  },
  {
    title: 'Catagories',
    icon: <HiveIcon />,
    href: '/admin/catagories',
    collapse: true,
    admin: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/categories/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/categories/add',
      },
    ],
  },
  {
    navlabel: true,
    subheader: 'DAO',
    href: 'DAO',
    admin: true,
  },
  {
    title: 'Dashboard',
    icon: <HubIcon />,
    href: '/dao',
    admin: true,
  },
];

export default Menuitems;
