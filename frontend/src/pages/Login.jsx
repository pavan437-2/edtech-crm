import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await api('/auth/login', { method: 'POST', body: { email, password } });
      localStorage.setItem('token', token);
      nav('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card small">
      <h1>Admin Login</h1>
      <form onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button>Login</button>
        {error && <p className="err">{error}</p>}
      </form>
    </div>
  );
}

