import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';

const initialForm = {
  name: '',
  address: '',
  city: '',
  state: 'CA',
  zip_code: '',
  total_units: 0
};

type Building = typeof initialForm & { id: number };

export const BuildingsPage = () => {
  const queryClient = useQueryClient();
  const { data: buildings } = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      const { data } = await api.get('/buildings');
      return data as Building[];
    }
  });
  const [form, setForm] = useState(initialForm);

  const createMutation = useMutation({
    mutationFn: async (payload: typeof initialForm) => {
      await api.post('/buildings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      setForm(initialForm);
    }
  });

  return (
    <div className="page">
      <h2>楼栋管理</h2>
      <div className="two-column">
        <section>
          <h3>新增楼栋</h3>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate(form);
            }}
            className="form"
          >
            <label>
              名称
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              地址
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </label>
            <div className="row">
              <label>
                城市
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </label>
              <label>
                州/省
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} maxLength={2} required />
              </label>
              <label>
                邮编
                <input value={form.zip_code} onChange={(e) => setForm({ ...form, zip_code: e.target.value })} required />
              </label>
            </div>
            <label>
              总户数
              <input
                type="number"
                value={form.total_units}
                onChange={(e) => setForm({ ...form, total_units: Number(e.target.value) })}
                min={0}
              />
            </label>
            <button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? '提交中...' : '保存'}
            </button>
          </form>
        </section>
        <section>
          <h3>楼栋列表</h3>
          <table>
            <thead>
              <tr>
                <th>名称</th>
                <th>地址</th>
                <th>总户数</th>
              </tr>
            </thead>
            <tbody>
              {buildings?.map((building) => (
                <tr key={building.id}>
                  <td>{building.name}</td>
                  <td>
                    {building.address}, {building.city} {building.state} {building.zip_code}
                  </td>
                  <td>{building.total_units}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
