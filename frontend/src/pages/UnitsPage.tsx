import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';

type Unit = {
  id: number;
  building_id: number;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  market_rent: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  building_name?: string;
};

type Building = { id: number; name: string };

export const UnitsPage = () => {
  const queryClient = useQueryClient();
  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data } = await api.get('/units');
      return data as Unit[];
    }
  });

  const { data: buildings } = useQuery({
    queryKey: ['buildings'],
    queryFn: async () => {
      const { data } = await api.get('/buildings');
      return data as Building[];
    }
  });

  const [form, setForm] = useState<Omit<Unit, 'id' | 'building_name'>>({
    building_id: 0,
    unit_number: '',
    bedrooms: 1,
    bathrooms: 1,
    square_feet: 50,
    market_rent: 0,
    status: 'vacant'
  });

  const createUnit = useMutation({
    mutationFn: async (payload: typeof form) => {
      await api.post('/units', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setForm({ building_id: 0, unit_number: '', bedrooms: 1, bathrooms: 1, square_feet: 50, market_rent: 0, status: 'vacant' });
    }
  });

  return (
    <div className="page">
      <h2>房源管理</h2>
      <div className="two-column">
        <section>
          <h3>新增房源</h3>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.building_id) {
                alert('请选择楼栋');
                return;
              }
              createUnit.mutate(form);
            }}
          >
            <label>
              所属楼栋
              <select value={form.building_id} onChange={(e) => setForm({ ...form, building_id: Number(e.target.value) })}>
                <option value={0}>请选择楼栋</option>
                {buildings?.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              房号
              <input value={form.unit_number} onChange={(e) => setForm({ ...form, unit_number: e.target.value })} required />
            </label>
            <div className="row">
              <label>
                卧室
                <input
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                />
              </label>
              <label>
                卫生间
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                />
              </label>
              <label>
                面积(㎡)
                <input
                  type="number"
                  min={0}
                  value={form.square_feet}
                  onChange={(e) => setForm({ ...form, square_feet: Number(e.target.value) })}
                />
              </label>
            </div>
            <label>
              市场租金
              <input
                type="number"
                min={0}
                value={form.market_rent}
                onChange={(e) => setForm({ ...form, market_rent: Number(e.target.value) })}
              />
            </label>
            <label>
              状态
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Unit['status'] })}>
                <option value="vacant">空置</option>
                <option value="occupied">已入住</option>
                <option value="maintenance">维护中</option>
              </select>
            </label>
            <button type="submit" disabled={createUnit.isPending}>
              {createUnit.isPending ? '提交中...' : '保存'}
            </button>
          </form>
        </section>
        <section>
          <h3>房源列表</h3>
          <table>
            <thead>
              <tr>
                <th>楼栋</th>
                <th>房号</th>
                <th>户型</th>
                <th>租金</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {units?.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.building_name}</td>
                  <td>{unit.unit_number}</td>
                  <td>
                    {unit.bedrooms}室{unit.bathrooms}卫
                  </td>
                  <td>¥{unit.market_rent}</td>
                  <td>{unit.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
