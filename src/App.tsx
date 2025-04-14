import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UploadOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadPage from './pages/Upload';
import { useQueryClient } from '@tanstack/react-query';

const { Header, Content, Sider } = Layout;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
    window.location.href = '/login';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div className="text-xl font-bold text-blue-600">后台管理系统</div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            fontSize: '1rem',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          退出登录
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/dashboard">仪表盘</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UploadOutlined />}>
              <Link to="/upload">文件上传</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: 24, 
            margin: 0, 
            minHeight: 280,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {children}
          </Content>
        </Layout>
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <div>仪表盘内容</div>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UploadPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
