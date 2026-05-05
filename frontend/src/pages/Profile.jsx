import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../api/profileApi';

const fmt = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', address: '',
  });

  useEffect(() => {
    profileApi.get()
      .then((res) => {
        setProfile(res.data);
        setForm({
          firstName: res.data.firstName ?? '',
          lastName:  res.data.lastName  ?? '',
          phone:     res.data.phone     ?? '',
          address:   res.data.address   ?? '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => { setSaved(false); setError(''); setEditing(true); };

  const cancelEdit = () => {
    setForm({
      firstName: profile.firstName ?? '',
      lastName:  profile.lastName  ?? '',
      phone:     profile.phone     ?? '',
      address:   profile.address   ?? '',
    });
    setEditing(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await profileApi.update({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        phone:     form.phone.trim()   || null,
        address:   form.address.trim() || null,
      });
      setProfile(res.data);
      setEditing(false);
      setSaved(true);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-6xl text-brand-ink">
            MY <span className="text-brand-purple">PROFILE</span>
          </h1>
          {profile && (
            <p className="text-brand-ink/40 text-sm mt-2">
              Member since {fmt(profile.createdAt)}
            </p>
          )}
        </div>

        {saved && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 text-sm font-bold rounded-2xl px-5 py-3 mb-6">
            Profile updated successfully!
          </div>
        )}

        {/* Email card — never editable */}
        <div className="bg-white rounded-3xl border-2 border-brand-ink p-6 mb-4">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/40 mb-1">Email</p>
          <p className="font-bold text-brand-ink">{profile?.email}</p>
          <p className="text-xs text-brand-ink/30 mt-1">Email cannot be changed</p>
        </div>

        {/* Editable info */}
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-3xl border-2 border-brand-ink p-6 flex flex-col gap-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="First Name"
                value={form.firstName}
                editing={editing}
                onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
              />
              <Field
                label="Last Name"
                value={form.lastName}
                editing={editing}
                onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
              />
            </div>

            <Field
              label="Phone"
              value={form.phone}
              editing={editing}
              placeholder="Not set"
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            />

            <Field
              label="Address"
              value={form.address}
              editing={editing}
              placeholder="Not set"
              textarea
              onChange={(v) => setForm((f) => ({ ...f, address: v }))}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              {editing ? (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-brand-lime text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple hover:text-white transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border-2 border-brand-ink text-brand-ink font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-ink hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startEdit}
                  className="px-8 py-3 bg-brand-ink text-brand-lime font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-purple transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Quick links */}
        <div className="mt-6 flex gap-3">
          <Link
            to="/orders"
            className="flex-1 py-4 text-center bg-white rounded-2xl border-2 border-brand-ink font-bold text-sm tracking-widest uppercase hover:border-brand-purple hover:text-brand-purple transition-colors"
          >
            My Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 py-4 text-center bg-brand-lime rounded-2xl border-2 border-brand-ink font-bold text-sm tracking-widest uppercase hover:bg-brand-purple hover:text-white transition-colors"
          >
            Shop Now
          </Link>
        </div>

      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange, placeholder = '', textarea = false }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold tracking-widest uppercase text-brand-ink/40">{label}</p>
      {editing ? (
        textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            placeholder={placeholder}
            className="border-2 border-brand-ink/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple transition-colors resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-2 border-brand-ink/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-purple transition-colors"
          />
        )
      ) : (
        <p className={`text-sm font-bold ${value ? 'text-brand-ink' : 'text-brand-ink/30 italic'}`}>
          {value || placeholder || 'Not set'}
        </p>
      )}
    </div>
  );
}
