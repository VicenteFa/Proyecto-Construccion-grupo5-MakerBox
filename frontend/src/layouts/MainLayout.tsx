import { Layout as AntLayout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../shared/hooks/useAuth';

const { Header, Content, Footer } = AntLayout;

const layoutStyles = { minHeight: '100vh' };

const headerStyles = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%',
} as const; //as const previene un warning molesto cuando se usa styles={headerStyles}

const contentStyles = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const footerStyles = { textAlign: 'center' } as const;
const menuStyles = { flex: 1, minWidth: 0 };

export const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { key: ROUTES.HOME.path, label: <Link to={ROUTES.HOME.path}>Home</Link> },
    ...(!isAuthenticated
      ? [
          { key: ROUTES.LOGIN.path, label: <Link to={ROUTES.LOGIN.path}>Login</Link> },
          { key: ROUTES.SIGN_UP.path, label: <Link to={ROUTES.SIGN_UP.path}>Sign Up</Link> },
        ]
      : []),
    ...(isAuthenticated && ROUTES.ADMIN.isVisible
      ? [{ key: ROUTES.ADMIN.path, label: <Link to={ROUTES.ADMIN.path}>Admin</Link> }]
      : []),
  ];

  return (
    <AntLayout style={layoutStyles}>
      <Header style={headerStyles}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={menuStyles}
        />
      </Header>

      <Content style={contentStyles}>
        <Outlet />
      </Content>

      <Footer style={footerStyles}>Footer</Footer>
    </AntLayout>
  );
};
