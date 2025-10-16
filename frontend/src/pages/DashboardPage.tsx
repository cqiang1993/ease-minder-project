import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { api } from '../api/client';

export const DashboardPage = () => {
  const { data: summary } = useQuery({
    queryKey: ['finance', 'summary'],
    queryFn: async () => {
      const { data } = await api.get('/finance/summary');
      return data as {
        total_units: number;
        occupied_units: number;
        total_rent_due: number;
        total_rent_collected: number;
        arrears: number;
      };
    }
  });

  const { data: cashflow } = useQuery({
    queryKey: ['finance', 'cashflow'],
    queryFn: async () => {
      const { data } = await api.get('/finance/cashflow');
      return data as { month: string; collected: string }[];
    }
  });

  return (
    <div className="page">
      <h2>仪表盘</h2>
      {summary ? (
        <div className="cards-grid">
          <div className="card">
            <h3>总房源</h3>
            <p>{summary.total_units}</p>
          </div>
          <div className="card">
            <h3>已出租</h3>
            <p>
              {summary.occupied_units} / {summary.total_units}
            </p>
          </div>
          <div className="card">
            <h3>本月应收租金</h3>
            <p>¥{summary.total_rent_due?.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>本月已收</h3>
            <p>¥{summary.total_rent_collected?.toLocaleString()}</p>
          </div>
          <div className="card">
            <h3>欠款</h3>
            <p>¥{summary.arrears?.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>加载中...</p>
      )}

      <section className="section">
        <h3>最近现金流</h3>
        <table>
          <thead>
            <tr>
              <th>月份</th>
              <th>收款</th>
            </tr>
          </thead>
          <tbody>
            {cashflow?.map((row) => (
              <tr key={row.month}>
                <td>{dayjs(row.month).format('YYYY年MM月')}</td>
                <td>¥{Number(row.collected).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
