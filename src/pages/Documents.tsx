import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Document {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Documents: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const queryClient = useQueryClient();

  // 获取文档列表
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/documents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
  });

  // 添加/更新文档
  const mutation = useMutation({
    mutationFn: async (values: Partial<Document>) => {
      const token = localStorage.getItem('token');
      if (editingDocument) {
        return axios.put(`http://localhost:3001/documents/${editingDocument.id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        return axios.post('http://localhost:3001/documents', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    },
    onSuccess: () => {
      message.success(editingDocument ? '文档更新成功' : '文档创建成功');
      setIsModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      message.error('操作失败：' + (error as Error).message);
    }
  });

  // 删除文档
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      return axios.delete(`http://localhost:3001/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      message.success('文档删除成功');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      message.error('删除失败：' + (error as Error).message);
    }
  });

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Document) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDocument(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个文档吗？"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      mutation.mutate(values);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingDocument(null);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDocument(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          新建文档
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={documents}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title={editingDocument ? '编辑文档' : '新建文档'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={mutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入文档标题' }]}
          >
            <Input placeholder="请输入文档标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择文档分类' }]}
          >
            <Select placeholder="请选择文档分类">
              <Select.Option value="notice">通知公告</Select.Option>
              <Select.Option value="policy">政策文件</Select.Option>
              <Select.Option value="guide">使用指南</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入文档内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入文档内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Documents; 