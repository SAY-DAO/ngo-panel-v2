import ChildCareIcon from '@mui/icons-material/ChildCare';
import InterestsIcon from '@mui/icons-material/Interests';
import HouseIcon from '@mui/icons-material/House';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HiveIcon from '@mui/icons-material/Hive';
import PublicIcon from '@mui/icons-material/Public';
import React from 'react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'DASHBOARDS',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Dashboard',
  },
  {
    title: 'Analytical',
    icon: 'pie-chart',
    href: '/dashboards/analytical',
  },
  {
    navlabel: true,
    subheader: 'MY PANEL',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Apps',
  },
  {
    title: 'My Page',
    icon: 'user',
    href: '/my-page',
    collapse: true,
    children: [
      {
        title: 'View',
        icon: 'eye',
        href: '/profile/view',
      },
      {
        title: 'Edit',
        icon: 'edit',
        href: '/profile/edit',
      },
    ],
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
        href: '/children/mine',
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
    href: '/needs',
    collapse: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/needs/list',
      },
      {
        title: 'Add',
        icon: 'edit',
        href: '/needs/add',
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
        title: 'Done',
        icon: 'list',
        href: '/reports/needs/done',
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
  {
    title: 'Countries',
    icon: <PublicIcon />,
    href: '/admin/countries',
    collapse: true,
    children: [
      {
        title: 'List',
        icon: 'list',
        href: '/countries/list',
      },
      {
        title: 'Add',
        icon: 'plus',
        href: '/countries/add',
      },
    ],
  },
];

export default Menuitems;
