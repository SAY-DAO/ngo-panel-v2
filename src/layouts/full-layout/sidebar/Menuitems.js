import ChildCareIcon from '@mui/icons-material/ChildCare';
import InterestsIcon from '@mui/icons-material/Interests';
import HouseIcon from '@mui/icons-material/House';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HiveIcon from '@mui/icons-material/Hive';
import React from 'react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'DASHBOARDS',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Dashboard',
  },
  {
    title: 'My Page',
    icon: 'user',
    href: '/profile/view',
  },

  {
    title: 'Children',
    icon: <ChildCareIcon />,
    href: '/children',
    collapse: true,
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
    title: 'Reports',
    icon: <MenuBookIcon />,
    href: '/reports',
    collapse: true,
    children: [
      {
        title: 'Paid List',
        icon: 'list',
        href: '/report/needs/paid',
      },
      {
        title: 'Paid',
        icon: 'edit',
        href: '/reports/needs/paid',
      },
    ],
  },
  {
    navlabel: true,
    subheader: 'ADMIN',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Reports',
  },
  {
    title: 'NGOs',
    icon: <HouseIcon />,
    href: '/ngo',
    collapse: true,
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
    title: 'Social Workers',
    icon: 'users',
    href: '/sws',
    collapse: true,
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
        icon: 'shuffle',
        href: '/sw/migrate',
      },
    ],
  },
  {
    title: 'Catagories',
    icon: <HiveIcon />,
    href: '/admin/catagories',
    collapse: true,
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
  ];

export default Menuitems;
