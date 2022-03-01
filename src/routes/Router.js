import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';
import SocialWorkerEdit from '../pages/socialWorker/SocialWorkerEdit';
import SocialWorkerAdd from '../pages/socialWorker/SocialWorkerAdd';
import SocialWorkerMigrate from '../pages/socialWorker/SocialWorkerMigrate';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Error = Loadable(lazy(() => import('../pages/authentication/Error')));

const ChildrenList = Loadable(lazy(() => import('../views/children/List')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
const SocialWorkersList = Loadable(lazy(() => import('../pages/socialWorker/SocialWorkersList')));
/* ****Routes***** */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboards/starter" /> },
      { path: '/dashboards/starter', exact: true, element: <Dashboard /> },
      { path: '/sw/list', exact: true, element: <SocialWorkersList /> },
      { path: '/sw/edit/:id', exact: true, element: <SocialWorkerEdit /> },
      { path: '/sw/add', exact: true, element: <SocialWorkerAdd /> },
      { path: '/sw/migrate', exact: true, element: <SocialWorkerMigrate /> },
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
  {
    path: 'children',
    element: <FullLayout />,
    children: [{ path: 'list', element: <ChildrenList /> }],
  },
];

export default Router;
