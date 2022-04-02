import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Error = Loadable(lazy(() => import('../pages/authentication/Error')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
const SocialWorkerList = Loadable(lazy(() => import('../pages/socialWorker/SocialWorkerList')));
const SocialWorkerEdit = Loadable(lazy(() => import('../pages/socialWorker/SocialWorkerEdit')));
const SocialWorkerAdd = Loadable(lazy(() => import('../pages/socialWorker/SocialWorkerAdd')));
const SocialWorkerMigrate = Loadable(
  lazy(() => import('../pages/socialWorker/SocialWorkerMigrate')),
);
const SocialWorkerProfile = Loadable(
  lazy(() => import('../pages/socialWorker/SocialWorkerProfile')),
);
const NgoList = Loadable(lazy(() => import('../pages/ngo/NgoList')));
const NgoEdit = Loadable(lazy(() => import('../pages/ngo/NgoEdit')));

/* ****Routes***** */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboards/starter" /> },
      { path: '/dashboards/starter', exact: true, element: <Dashboard /> },
      { path: '/profile/view', exact: true, element: <SocialWorkerProfile /> },
      { path: '/profile/edit', exact: true, element: <SocialWorkerEdit /> },
      { path: '/sw/list', exact: true, element: <SocialWorkerList /> },
      { path: '/sw/edit/:id', exact: true, element: <SocialWorkerEdit /> },
      { path: '/sw/add', exact: true, element: <SocialWorkerAdd /> },
      { path: '/sw/migrate', exact: true, element: <SocialWorkerMigrate /> },
      { path: '/ngo/list', exact: true, element: <NgoList /> },
      { path: '/ngo/edit/:id', exact: true, element: <NgoEdit /> },
      // { path: '/ngo/add', exact: true, element: <SocialWorkerAdd /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
