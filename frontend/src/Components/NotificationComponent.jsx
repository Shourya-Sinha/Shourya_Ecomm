import { notification } from 'antd';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const NotificationComponent = () => {
    const antNotification = useSelector(state => state.userInfo.antNotification);

    useEffect(() => {
        if (antNotification.open) {
          notification[antNotification.severity]({
            message: antNotification.message,
          });
        }
      }, [antNotification]);
  return null;
}

export default NotificationComponent;