import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    ShopOutlined,
    ShoppingOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import { Button, Layout, Menu, theme } from 'antd';
  const { Header, Sider, Content } = Layout;
  import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProfileLayout = () => {
    const user = useSelector((state)=> state.auth.user);
   // console.log('user in layout',user);
    const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  return (
    <>
    <Layout style={{height:'100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['statics']}
          onClick={({ key }) => {
            if (key == "signout") {
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: 'detail',
              icon: <UserOutlined />,
              label: 'User Profile',
            },
            {
              key: 'myOrder',
              icon: <ShoppingOutlined />,
              label: 'My Order',
            },
            {
              key: 'statics',
              icon: <PieChartOutlined />,
              label: 'Total Expendature',
            },
            {
                key: '/',
                icon: <ShopOutlined />,
                label: 'Go to Store',
              },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            paddingLeft:'16px',
            paddingRight:'16px',
            height:64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
                    <div className="d-flex gap-3 align-items-center">
            <img
              className="rounded"
              style={{ height: '32px', width: '32px' }}
              src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
            <div style={{ lineHeight: 0 }}>
              <h5 className="text-dark" style={{ fontSize: '14px' }}>
                {user.email} 
              </h5>
              <p className="mb-0" style={{ fontSize: '13px' }}>
                {'(User)'}
              </p>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            //height:'100vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
    </>
  )
}

export default ProfileLayout;