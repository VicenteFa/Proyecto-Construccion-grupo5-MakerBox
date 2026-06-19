import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { MenuProps } from 'antd';

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

  // Iniciamos el menu siempre boton Home
  const menuItems: MenuProps['items'] = [
    { key: ROUTES.HOME.path, label: <Link to={ROUTES.HOME.path}>Home</Link> },
  ];

  // Si el usuario esta logueado, agregamos su botón de "Mi Panel"
  if (isAuthenticated && usuario) {
    let dashboardPath = '';

    // Verificamos que rol tiene para mandarlo a la ruta correcta
    if (usuario.rol === 'ESTUDIANTE') dashboardPath = ROUTES.ESTUDIANTE.path;
    else if (usuario.rol === 'AYUDANTE') dashboardPath = ROUTES.AYUDANTE.path;
    else if (usuario.rol === 'PROFESOR') dashboardPath = ROUTES.PROFESOR.path;
    else if (usuario.rol === 'ADMIN') dashboardPath = ROUTES.ADMIN.path;

    if (dashboardPath) {
      menuItems.push({
        key: dashboardPath,
        label: <Link to={dashboardPath}>Mi Panel</Link>,
      });
    }
  }

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
        {/* El menu ahora recibe los items calculados dinamicamente */}
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

      <Content
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
        }}
      >
        <Outlet />
      </Content>

      <Footer style={footerStyles}>Footer</Footer>
    </AntLayout>
  );
};
