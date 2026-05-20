import { Layout as AntLayout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const { Header, Content, Footer } = AntLayout;

// Capitalize function pq javascript es incapaz de tener un built-in para esto TODO: mover esta función a un utils
const formatNavLabel = (key: string) => {
  return key
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

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

  const menuItems = Object.entries(ROUTES).map(([key, path]) => ({
    key: path,
    label: <Link to={path}>{formatNavLabel(key)}</Link>,
  }));

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
