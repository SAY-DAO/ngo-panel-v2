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
    title: 'Children',
    icon: 'users',
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
    icon: 'users',
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
    navlabel: true,
    subheader: 'MY REPORTS',
    icon: 'mdi mdi-dots-horizontal',
    href: 'Reports',
  },
  {
    title: 'Reports',
    icon: 'users',
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
    title: 'Social Worker',
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
        icon: 'edit',
        href: '/admin/sws/add',
      },
    ],
  },
  {
    title: 'Catagories',
    icon: 'pie-chart',
    href: '/admin/catagories',
  },
  {
    title: 'NGOs',
    icon: 'pie-chart',
    href: '/admin/ngos',
  },
];

export default Menuitems;
