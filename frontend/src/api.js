const API = import.meta.env.VITE_API_URL;

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    throw new Error(data.error || 'Request failed');
  }
  return data;
}
