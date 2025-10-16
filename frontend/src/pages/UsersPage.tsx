import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';

type User = {
  id: number;
  email: string;
  role: 'manager' | 'accountant' | 'maintenance';
  name: string;
  created_at: string;
};

export const UsersPage = () => {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data as User[];
    }
  });

  const [form, setForm] = useState({ email: '', password: '', role: 'maintenance', name: '' });

  const createUser = useMutation({
    mutationFn: async (payload: typeof form) => {
      await api.post('/auth/register', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setForm({ email: '', password: '', role: 'maintenance', name: '' });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? '创建失败';
      alert(message);
    }
  });

  return (
    <div className="page">
      <h2>人员权限</h2>
      <div className="two-column">
        <section>
          <h3>新增账户</h3>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              createUser.mutate(form);
            }}
          >
            <label>
              姓名
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              邮箱
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              初始密码
              <input
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>
            <label>
              角色
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}>
                <option value="manager">物业经理</option>
                <option value="accountant">财务</option>
                <option value="maintenance">维修</option>
              </select>
            </label>
            <button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? '提交中...' : '保存'}
            </button>
          </form>
        </section>
        <section>
          <h3>账户列表</h3>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
