import { BrowserRouter, Routes, Route, Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme } from 'antd';
import { 
  DashboardOutlined, 
  UploadOutlined, 
  PictureOutlined, 
  FileTextOutlined, 
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Carousel from './pages/Carousel';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

const { Header, Content, Sider } = Layout;

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 主布局组件
const MainLayout = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '1';
    if (path === '/upload') return '2';
    if (path === '/carousel') return '3';
    if (path === '/documents') return '4';
    if (path === '/settings') return '5';
    return '1';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: colorBgContainer,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: <Link to="/">仪表盘</Link>,
            },
            {
              key: '2',
              icon: <UploadOutlined />,
              label: <Link to="/upload">文件上传</Link>,
            },
            {
              key: '3',
              icon: <PictureOutlined />,
              label: <Link to="/carousel">图片瀑布</Link>,
            },
            {
              key: '4',
              icon: <FileTextOutlined />,
              label: <Link to="/documents">文档管理</Link>,
            },
            {
              key: '5',
              icon: <SettingOutlined />,
              label: <Link to="/settings">系统设置</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500 }}>后台管理系统</h1>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ 
              fontSize: '1rem',
              color: '#ff4d4f',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>仪表盘内容</div>} />
          <Route path="upload" element={<Upload />} />
          <Route path="carousel" element={<Carousel />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
