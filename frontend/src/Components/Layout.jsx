import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Fotter from './Fotter.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { LoginWithCookies } from '../Feature/Auth/AuthSlice.jsx';
import { notification } from 'antd';

const Layout = () => {
  // const antNotification  = useSelector((state) => state.auth.antNotification);

  // useEffect(() => {
  //   if (antNotification.open) {
  //     notification[antNotification.severity]({
  //       message: 'Notification',
  //       description: antNotification.message,
  //     });
  //   }
  // }, [antNotification]);

  

  return (
    <>
    <Header />
    <Outlet />
    <Fotter/>
    </>

  )
}

export default Layout;