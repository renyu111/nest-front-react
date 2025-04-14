import { useState, useEffect } from 'react';
import { Upload, Button, message, List, Card, Image, Modal, Tag, Tooltip } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, FilePdfOutlined, FileImageOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { uploadApi } from '../api/services';

interface FileItem {
  fileName: string;
  fileType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

const UploadPage = () => {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // 获取文件列表
  const { data: files, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/upload', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('获取文件列表失败');
      }
      const data = await response.json();
      return data;
    },
  });

  // 上传文件
  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadApi.uploadFile(file);
      return response;
    },
    onSuccess: () => {
      message.success('文件上传成功');
      refetch(); // 刷新文件列表
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '文件上传失败');
    },
  });

  // 删除文件
  const { mutate: deleteFile } = useMutation({
    mutationFn: async (fileId: string) => {
      await uploadApi.deleteFile(fileId);
    },
    onSuccess: () => {
      message.success('文件删除成功');
      refetch(); // 刷新文件列表
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '文件删除失败');
    },
  });

  // 处理预览
  const handlePreview = (file: FileItem) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  // 判断文件类型
  const isImage = (type: string | undefined) => type === 'image';
  const isPDF = (type: string | undefined) => type === 'pdf';
  const isVideo = (type: string | undefined) => type === 'video';

  // 获取文件图标
  const getFileIcon = (type: string | undefined) => {
    if (isImage(type)) return <FileImageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
    if (isPDF(type)) return <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />;
    if (isVideo(type)) return <PlayCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />;
    return <FileTextOutlined style={{ fontSize: '24px', color: '#722ed1' }} />;
  };

  // 获取文件类型标签颜色
  const getFileTypeColor = (type: string | undefined) => {
    if (isImage(type)) return 'blue';
    if (isPDF(type)) return 'red';
    if (isVideo(type)) return 'green';
    return 'purple';
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // 获取完整的文件URL
  const getFullUrl = (url: string) => {
    return `http://localhost:3001${url}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 className="text-2xl font-bold">文件上传</h2>
        <Upload
          multiple
          showUploadList={false}
          beforeUpload={(file) => {
            uploadFile(file);
            return false;
          }}
        >
          <Button 
            icon={<UploadOutlined />} 
            size="large"
            loading={isPending}
            style={{
              height: '48px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 500,
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.2)';
            }}
          >
            选择文件
          </Button>
        </Upload>
      </div>

      <div className="preview">
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={files || []}
          renderItem={(file: FileItem) => (
            <List.Item>
              <Card
                hoverable
                style={{ 
                  marginBottom: '16px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease'
                }}
                actions={[
                  <Tooltip title="预览">
                    <EyeOutlined key="preview" onClick={() => handlePreview(file)} style={{ fontSize: '16px', color: '#1890ff' }} />
                  </Tooltip>,
                  <Tooltip title="删除">
                    <DeleteOutlined key="delete" onClick={() => deleteFile(file.fileName)} style={{ fontSize: '16px', color: '#ff4d4f' }} />
                  </Tooltip>
                ]}
                cover={
                  (isImage(file.fileType) || isVideo(file.fileType)) && (
                    <div style={{ 
                      height: '180px', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      {isImage(file.fileType) ? (
                        <Image
                          src={getFullUrl(file.url)}
                          alt={file.fileName}
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'cover'
                          }}
                          preview={false}
                        />
                      ) : isVideo(file.fileType) ? (
                        <video
                          src={getFullUrl(file.url)}
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'cover'
                          }}
                          controls
                        />
                      ) : null}
                    </div>
                  )
                }
              >
                <Card.Meta
                  avatar={getFileIcon(file.fileType)}
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '70%'
                      }}>
                        {file.fileName}
                      </span>
                      <Tag color={getFileTypeColor(file.fileType)} style={{ margin: 0 }}>
                        {file.fileType}
                      </Tag>
                    </div>
                  }
                  description={
                    <div style={{ fontSize: '13px', color: '#8c8c8c' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ marginRight: '8px' }}>大小: {formatFileSize(file.size)}</span>
                      </div>
                      <div>上传时间: {formatDate(file.createdAt)}</div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* 预览模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getFileIcon(previewFile?.fileType)}
            <span style={{ marginLeft: '8px' }}>{previewFile?.fileName}</span>
          </div>
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={800}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {previewFile && (
          <div style={{ textAlign: 'center' }}>
            {isImage(previewFile.fileType) ? (
              <Image
                src={getFullUrl(previewFile.url)}
                alt={previewFile.fileName}
                style={{ maxWidth: '100%', maxHeight: '70vh' }}
              />
            ) : isPDF(previewFile.fileType) ? (
              <iframe
                src={getFullUrl(previewFile.url)}
                style={{ width: '100%', height: '70vh', border: 'none' }}
                title={previewFile.fileName}
              />
            ) : isVideo(previewFile.fileType) ? (
              <video
                src={getFullUrl(previewFile.url)}
                style={{ width: '100%', maxHeight: '70vh' }}
                controls
              />
            ) : (
              <div style={{ padding: '20px' }}>
                <p>此文件类型不支持预览</p>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => window.open(getFullUrl(previewFile.url), '_blank')}
                  style={{ marginTop: '16px' }}
                >
                  下载文件
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UploadPage; 