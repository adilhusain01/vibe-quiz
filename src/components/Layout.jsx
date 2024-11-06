import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

const Layout = () => {
  return (
    <main className='flex flex-col bg-gradient-to-br from-red-900 via-red-800 to-red-900'>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
