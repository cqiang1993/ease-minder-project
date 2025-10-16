import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: '仪表盘' },
  { to: '/buildings', label: '楼栋管理' },
  { to: '/units', label: '房源管理' },
  { to: '/leases', label: '房租管理' },
  { to: '/payments', label: '财务统计' },
  { to: '/users', label: '人员权限' }
];

export const Layout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="logo">Ease Minder</h1>
        <nav>
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="user-card">
          <div>{user?.name}</div>
          <small>{user?.role}</small>
          <button onClick={logout}>退出</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
