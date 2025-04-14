import React, { useState, useEffect } from 'react';
import { Image, Spin, Empty, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import './Carousel.css';
import { uploadApi, ImageItem } from '../api/services';

const Carousel: React.FC = () => {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  // 获取图片数据
  const { data: items, isLoading, error, refetch } = useQuery<ImageItem[]>({
    queryKey: ['images'],
    queryFn: async () => {
      try {
        const response = await uploadApi.getFiles();
        return response.data;
      } catch (error) {
        console.error('Failed to fetch images:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (items) {
      // 过滤出图片文件
      const imageFiles = items.filter(item => 
        item.fileType === 'image'
      );
      setImageItems(imageFiles);
    }
  }, [items]);

  // 瀑布流布局配置
  const breakpointColumns = {
    default: 4,
    1400: 3,
    1100: 2,
    700: 1
  };

  // 获取完整的图片 URL
  const getFullUrl = (url: string) => {
    // 如果是相对路径，添加基础 URL
    if (url.startsWith('/')) {
      return `http://localhost:3001${url}`;
    }
    return url;
  };

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        gap: '16px'
      }}>
        <Empty description="加载图片失败" />
        <button 
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #1890ff',
            background: '#fff',
            color: '#1890ff',
            cursor: 'pointer'
          }}
        >
          重试
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (imageItems.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Empty description="暂无图片" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="masonry-grid">
        {imageItems.map(item => (
          <div key={item.fileName} className="masonry-item">
            <Image
              alt={item.fileName}
              src={getFullUrl(item.url)}
              style={{ 
                width: '100%',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
              loading="lazy"
              onError={() => {
                message.error(`加载图片失败: ${item.fileName}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel; 