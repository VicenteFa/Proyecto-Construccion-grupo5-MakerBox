import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

const layoutStyles = { minHeight: '100vh' };
const headerStyles = {
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
} as const;

const footerStyles = { textAlign: 'center' } as const;
const menuStyles = { flex: 1, minWidth: 0 };

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN.path);
  };

  const menuItems = [{ key: ROUTES.HOME.path, label: <Link to={ROUTES.HOME.path}>Home</Link> }];

  const dropdownItems = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Cerrar sesión',
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated && usuario ? (
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Text style={{ color: 'white' }}>{usuario.correo}</Text>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              </div>
            </Dropdown>
          ) : (
            <Link to={ROUTES.LOGIN.path}>
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: '#ffffff33', cursor: 'pointer' }}
              />
            </Link>
          )}
        </div>
      </Header>

      <Content style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </Content>

      <Footer style={footerStyles}>Footer</Footer>
    </AntLayout>
  );
};
