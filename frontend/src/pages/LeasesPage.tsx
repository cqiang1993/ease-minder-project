import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import dayjs from 'dayjs';
import { api } from '../api/client';

type Lease = {
  id: number;
  unit_id: number;
  tenant_name: string;
  tenant_email: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  security_deposit: number;
  status: 'active' | 'pending' | 'ended';
  unit_number?: string;
  building_name?: string;
};

type UnitOption = { id: number; unit_number: string; building_name?: string };

export const LeasesPage = () => {
  const queryClient = useQueryClient();
  const { data: leases } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data } = await api.get('/leases');
      return data as Lease[];
    }
  });

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data } = await api.get('/units');
      return data as UnitOption[];
    }
  });

  const [form, setForm] = useState<Omit<Lease, 'id' | 'unit_number' | 'building_name'>>({
    unit_id: 0,
    tenant_name: '',
    tenant_email: '',
    start_date: dayjs().format('YYYY-MM-DD'),
    end_date: dayjs().add(1, 'year').format('YYYY-MM-DD'),
    rent_amount: 0,
    security_deposit: 0,
    status: 'pending'
  });

  const createLease = useMutation({
    mutationFn: async (payload: typeof form) => {
      await api.post('/leases', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      setForm({
        unit_id: 0,
        tenant_name: '',
        tenant_email: '',
        start_date: dayjs().format('YYYY-MM-DD'),
        end_date: dayjs().add(1, 'year').format('YYYY-MM-DD'),
        rent_amount: 0,
        security_deposit: 0,
        status: 'pending'
      });
    }
  });

  return (
    <div className="page">
      <h2>房租管理</h2>
      <div className="two-column">
        <section>
          <h3>新增租约</h3>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.unit_id) {
                alert('请选择房源');
                return;
              }
              createLease.mutate(form);
            }}
          >
            <label>
              房源
              <select value={form.unit_id} onChange={(e) => setForm({ ...form, unit_id: Number(e.target.value) })}>
                <option value={0}>请选择房源</option>
                {units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.building_name} - {unit.unit_number}
                  </option>
                ))}
              </select>
            </label>
            <label>
              租客姓名
              <input value={form.tenant_name} onChange={(e) => setForm({ ...form, tenant_name: e.target.value })} required />
            </label>
            <label>
              租客邮箱
              <input value={form.tenant_email} onChange={(e) => setForm({ ...form, tenant_email: e.target.value })} required />
            </label>
            <div className="row">
              <label>
                起租日
                <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </label>
              <label>
                到期日
                <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </label>
            </div>
            <div className="row">
              <label>
                月租
                <input
                  type="number"
                  min={0}
                  value={form.rent_amount}
                  onChange={(e) => setForm({ ...form, rent_amount: Number(e.target.value) })}
                />
              </label>
              <label>
                押金
                <input
                  type="number"
                  min={0}
                  value={form.security_deposit}
                  onChange={(e) => setForm({ ...form, security_deposit: Number(e.target.value) })}
                />
              </label>
            </div>
            <label>
              状态
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Lease['status'] })}>
                <option value="pending">待生效</option>
                <option value="active">进行中</option>
                <option value="ended">已结束</option>
              </select>
            </label>
            <button type="submit" disabled={createLease.isPending}>
              {createLease.isPending ? '提交中...' : '保存'}
            </button>
          </form>
        </section>
        <section>
          <h3>租约列表</h3>
          <table>
            <thead>
              <tr>
                <th>房源</th>
                <th>租客</th>
                <th>租期</th>
                <th>租金</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {leases?.map((lease) => (
                <tr key={lease.id}>
                  <td>
                    {lease.building_name} {lease.unit_number}
                  </td>
                  <td>{lease.tenant_name}</td>
                  <td>
                    {dayjs(lease.start_date).format('YYYY/MM/DD')} - {dayjs(lease.end_date).format('YYYY/MM/DD')}
                  </td>
                  <td>¥{lease.rent_amount}</td>
                  <td>{lease.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
