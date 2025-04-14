import React from 'react';
import { Card, Form, Input, Button, message, Switch, Space } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface SettingsForm {
  siteName: string;
  siteDescription: string;
  enableRegistration: boolean;
  enableComments: boolean;
  adminEmail: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: async (values: SettingsForm) => {
      const token = localStorage.getItem('token');
      return axios.put('http://localhost:3001/settings', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      message.success('设置保存成功');
    },
    onError: (error) => {
      message.error('保存失败：' + (error as Error).message);
    }
  });

  const handleSubmit = (values: SettingsForm) => {
    saveSettings(values);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="系统设置"
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            siteName: '后台管理系统',
            siteDescription: '一个现代化的后台管理系统',
            enableRegistration: true,
            enableComments: true,
            adminEmail: 'admin@example.com'
          }}
        >
          <Form.Item
            name="siteName"
            label="网站名称"
            rules={[{ required: true, message: '请输入网站名称' }]}
          >
            <Input placeholder="请输入网站名称" />
          </Form.Item>

          <Form.Item
            name="siteDescription"
            label="网站描述"
            rules={[{ required: true, message: '请输入网站描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入网站描述" />
          </Form.Item>

          <Form.Item
            name="adminEmail"
            label="管理员邮箱"
            rules={[
              { required: true, message: '请输入管理员邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入管理员邮箱" />
          </Form.Item>

          <Form.Item
            name="enableRegistration"
            label="允许注册"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="enableComments"
            label="允许评论"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isPending}>
                保存设置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 