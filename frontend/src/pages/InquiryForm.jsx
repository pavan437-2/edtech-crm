import { useState } from 'react';
import { api } from '../api';

const empty = { user_type: 'Parent', category: 'General Query', name: '', email: '', phone: '', message: '' };

export default function InquiryForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await api('/inquiries', { method: 'POST', body: form });
      setStatus({ type: 'ok', text: 'Thank you! Your inquiry has been submitted.' });
      setForm(empty);
    } catch (err) {
      setStatus({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Send us an Inquiry</h1>
      <form onSubmit={submit}>
        <label>I am a
          <select name="user_type" value={form.user_type} onChange={set}>
            <option>Parent</option><option>Student</option><option>School</option>
          </select>
        </label>
        <label>Category
          <select name="category" value={form.category} onChange={set}>
            <option>Scholarship</option><option>Concert</option>
            <option>Admission</option><option>General Query</option>
          </select>
        </label>
        <label>Name<input name="name" value={form.name} onChange={set} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={set} required /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={set} required /></label>
        <label>Message<textarea name="message" rows="4" value={form.message} onChange={set} required /></label>
        <button disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        {status.text && <p className={status.type}>{status.text}</p>}
      </form>
      <a href="/admin/login" className="link">Admin login</a>
    </div>
  );
}

