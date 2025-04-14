import { Card, Row, Col, Statistic } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/services';

const Dashboard = () => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => dashboardApi.getStatistics(),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">仪表盘</h2>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics?.totalUsers || 0}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总文件数"
              value={statistics?.totalFiles || 0}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="存储空间"
              value={statistics?.totalStorage || 0}
              suffix="MB"
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最近上传"
              value={statistics?.recentUploads || 0}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 