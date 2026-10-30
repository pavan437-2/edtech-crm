import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard() {
  const [rows, setRows] = useState([]);
  const [category, setCategory] = useState('');
  const [userType, setUserType] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (userType) qs.set('user_type', userType);
    if (debounced) qs.set('search', debounced);
    api(`/inquiries?${qs}`, { auth: true }).then(setRows).catch((e) => setError(e.message));
  }, [category, userType, debounced]);

  const updateStatus = async (id, status) => {
    const updated = await api(`/inquiries/${id}/status`, { method: 'PATCH', body: { status }, auth: true });
    setRows((r) => r.map((x) => (x.id === id ? updated : x)));
  };

  const logout = () => { localStorage.removeItem('token'); nav('/admin/login'); };

  return (
    <div className="dash">
      <header>
        <h1>Inquiries ({rows.length})</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option>Scholarship</option><option>Concert</option>
          <option>Admission</option><option>General Query</option>
        </select>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">All User Types</option>
          <option>Parent</option><option>Student</option><option>School</option>
        </select>
        <input placeholder="Search name or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <p className="err">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Email</th><th>User Type</th><th>Category</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} title={r.message}>
                <td>{r.name}</td><td>{r.phone}</td><td>{r.email}</td>
                <td>{r.user_type}</td><td>{r.category}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                    <option>New</option><option>In Progress</option><option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" style={{ textAlign: 'center' }}>No inquiries found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
