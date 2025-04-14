import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/services';
import { RegisterRequest, RegisterResponse } from '../types/auth';

interface RegisterForm extends RegisterRequest {
  confirmPassword: string;
}

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate: register } = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (data) => {
      return await authApi.register(data);
    },
    onSuccess: () => {
      message.success('注册成功，请登录');
      navigate('/login');
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        message.error('用户名已存在，请选择其他用户名');
      } else {
        message.error(error.response?.data?.message || '注册失败，请稍后重试');
      }
    },
  });

  const onFinish = (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = values;
    register(registerData, {
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)'
    }}>
      <div style={{
        width: '50%',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>
            专业的后台管理系统，为您提供最佳的用户体验
          </p>
        </div>
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>简单易用的操作界面</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span>安全可靠的数据存储</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>高效的文件管理</span>
          </div>
        </div>
      </div>

      <div style={{
        width: '50%',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'white',
        borderRadius: '16px 0 0 16px',
        boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            创建账号
          </h2>
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                style={{ 
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
                style={{ 
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                style={{ 
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                style={{ 
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  backgroundColor: '#2563eb',
                  border: 'none'
                }}
              >
                注册
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
                已有账号？立即登录
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register; 