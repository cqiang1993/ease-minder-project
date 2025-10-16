import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import dayjs from 'dayjs';
import { api } from '../api/client';

type Payment = {
  id: number;
  lease_id: number;
  amount: number;
  paid_on: string;
  method: 'cash' | 'check' | 'transfer';
  reference: string | null;
  tenant_name?: string;
  unit_number?: string;
  building_name?: string;
};

type LeaseOption = { id: number; tenant_name: string; unit_number?: string; building_name?: string };

export const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data } = await api.get('/payments');
      return data as Payment[];
    }
  });

  const { data: leases } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data } = await api.get('/leases');
      return data as LeaseOption[];
    }
  });

  const [form, setForm] = useState<Omit<Payment, 'id' | 'tenant_name' | 'unit_number' | 'building_name'>>({
    lease_id: 0,
    amount: 0,
    paid_on: dayjs().format('YYYY-MM-DD'),
    method: 'transfer',
    reference: null
  });

  const createPayment = useMutation({
    mutationFn: async (payload: typeof form) => {
      await api.post('/payments', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setForm({ lease_id: 0, amount: 0, paid_on: dayjs().format('YYYY-MM-DD'), method: 'transfer', reference: null });
    }
  });

  return (
    <div className="page">
      <h2>财务统计</h2>
      <div className="two-column">
        <section>
          <h3>登记收款</h3>
          <form
            className="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!form.lease_id) {
                alert('请选择租约');
                return;
              }
              createPayment.mutate(form);
            }}
          >
            <label>
              租约
              <select value={form.lease_id} onChange={(e) => setForm({ ...form, lease_id: Number(e.target.value) })}>
                <option value={0}>请选择租约</option>
                {leases?.map((lease) => (
                  <option key={lease.id} value={lease.id}>
                    {lease.building_name} {lease.unit_number} - {lease.tenant_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              收款日期
              <input type="date" value={form.paid_on} onChange={(e) => setForm({ ...form, paid_on: e.target.value })} />
            </label>
            <label>
              金额
              <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </label>
            <label>
              支付方式
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value as Payment['method'] })}>
                <option value="cash">现金</option>
                <option value="check">支票</option>
                <option value="transfer">转账</option>
              </select>
            </label>
            <label>
              备注/流水号
              <input
                value={form.reference ?? ''}
                onChange={(e) => setForm({ ...form, reference: e.target.value || null })}
              />
            </label>
            <button type="submit" disabled={createPayment.isPending}>
              {createPayment.isPending ? '提交中...' : '保存'}
            </button>
          </form>
        </section>
        <section>
          <h3>收款记录</h3>
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>租客</th>
                <th>房源</th>
                <th>金额</th>
                <th>方式</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((payment) => (
                <tr key={payment.id}>
                  <td>{dayjs(payment.paid_on).format('YYYY/MM/DD')}</td>
                  <td>{payment.tenant_name}</td>
                  <td>
                    {payment.building_name} {payment.unit_number}
                  </td>
                  <td>¥{payment.amount}</td>
                  <td>{payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
