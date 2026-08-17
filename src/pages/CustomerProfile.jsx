import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User as UserIcon, MapPin, Lock, Bell } from 'lucide-react';
import {
  getMyProfile, updateMyProfile, changeMyPassword, updateMyNotifications,
  addMyAddress, updateMyAddress, deleteMyAddress, setDefaultAddress, uploadImage,
} from '../api/myBackendApi';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'info', label: 'Personal Info', icon: UserIcon },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function CustomerProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

 if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

if (loading) {
  return (
    <div>
      <div className="mb-6">
        <SkeletonLine className="h-7 w-40 mb-2" />
        <SkeletonLine className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <SkeletonLine className="h-64 w-full rounded-xl" />
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, addresses, and preferences</p>
        </div>
        <Link to="/" className="text-sm text-green-700 hover:underline font-medium">
          ← Back to Store
        </Link>
      </div>

      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <PersonalInfoTab profile={profile} setProfile={setProfile} updateUser={updateUser} />
      )}
      {activeTab === 'addresses' && (
        <AddressesTab profile={profile} setProfile={setProfile} />
      )}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'notifications' && (
        <NotificationsTab profile={profile} setProfile={setProfile} />
      )}
    </div>
  );
}

// --- Personal Info Tab ---
function PersonalInfoTab({ profile, setProfile, updateUser }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(profile.profilePicture || '');
  const [saving, setSaving] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let profilePicture = profile.profilePicture || '';
      if (imageFile) {
        profilePicture = await uploadImage(imageFile);
      }
      const updated = await updateMyProfile({ name, phone, profilePicture });
      setProfile(updated);
      updateUser({ name: updated.name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-semibold text-gray-400">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <label className="text-sm text-green-700 font-medium cursor-pointer hover:underline">
            Change photo
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">First & Last Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            value={profile.email}
            disabled
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full bg-gray-50 text-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold mt-6 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// --- Addresses Tab ---
function AddressesTab({ profile, setProfile }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', postalCode: '', country: '' });

  function resetForm() {
    setForm({ label: 'Home', street: '', city: '', state: '', postalCode: '', country: '' });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(address) {
    setForm(address);
    setEditingId(address._id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const addresses = editingId
        ? await updateMyAddress(editingId, form)
        : await addMyAddress(form);
      setProfile((prev) => ({ ...prev, addresses }));
      toast.success(editingId ? 'Address updated' : 'Address added');
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this address?')) return;
    try {
      const addresses = await deleteMyAddress(id);
      setProfile((prev) => ({ ...prev, addresses }));
      toast.info('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSetDefault(id) {
    try {
      const addresses = await setDefaultAddress(id);
      setProfile((prev) => ({ ...prev, addresses }));
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-green-700 font-medium hover:underline"
          >
            + Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4 space-y-3">
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="Label (e.g. Home, Office)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
          />
          <input
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            placeholder="Street address"
            required
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City"
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="State"
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
            <input
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              placeholder="Postal Code"
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Country"
              required
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {editingId ? 'Update' : 'Save'} Address
            </button>
            <button type="button" onClick={resetForm} className="text-gray-500 text-sm px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {profile.addresses.length === 0 && !showForm && (
          <p className="text-sm text-gray-400">No addresses saved yet.</p>
        )}
        {profile.addresses.map((address) => (
          <div key={address._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">{address.label}</span>
                {address.isDefault && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              {!address.isDefault && (
                <button onClick={() => handleSetDefault(address._id)} className="text-gray-500 hover:text-gray-800">
                  Set Default
                </button>
              )}
              <button onClick={() => startEdit(address)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(address._id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Security Tab ---
function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await changeMyPassword({ currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-md space-y-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-2">Change Password</h2>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current password"
        required
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        required
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm new password"
        required
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
      >
        {saving ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}

// --- Notifications Tab ---
function NotificationsTab({ profile, setProfile }) {
  const [prefs, setPrefs] = useState(profile.notifications || {
    emailNotifications: true, orderUpdates: true, promotions: false,
  });
  const [saving, setSaving] = useState(false);

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateMyNotifications(prefs);
      setProfile(updated);
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const LABELS = {
    emailNotifications: 'Email Notifications',
    orderUpdates: 'Order Status Updates',
    promotions: 'Promotional Offers',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-md">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        {Object.keys(LABELS).map((key) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700">{LABELS[key]}</span>
            <input
              type="checkbox"
              checked={prefs[key]}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-green-600"
            />
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold mt-6 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}

export default CustomerProfile;