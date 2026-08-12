import { useState } from 'react';
import axios from 'axios';

export default function CustomerPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [regData, setRegData] = useState({
    name: '',
    emailId: '',
    password: '',
    dateOfBirth: '',
    street: '',
    city: ''
  });

  const [editData, setEditData] = useState({
    name: '',
    emailId: '',
    password: '',
    dateOfBirth: '',
    street: '',
    city: ''
  });

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8095/customers/login', {
        emailId: loginEmail,
        password: loginPass
      });
      setCustomerProfile(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed: Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        name: regData.name,
        emailId: regData.emailId,
        password: regData.password,
        dateOfBirth: regData.dateOfBirth,
        addressDTO: { street: regData.street, city: regData.city }
      };
      await axios.post('http://localhost:8095/customers', payload);
      setMessage('Registration Successful');
      setIsLogin(true);
      setLoginEmail(regData.emailId);
      setRegData({ name: '', emailId: '', password: '', dateOfBirth: '', street: '', city: '' });
    } catch (err) {
      setMessage(err.response?.data?.errorMessage || err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      name: customerProfile.name || '',
      emailId: customerProfile.emailId || '',
      password: '',
      dateOfBirth: customerProfile.dateOfBirth || '',
      street: customerProfile.addressDTO?.street || '',
      city: customerProfile.addressDTO?.city || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editData.name,
        emailId: editData.emailId,
        password: editData.password,
        dateOfBirth: editData.dateOfBirth,
        addressDTO: { street: editData.street, city: editData.city }
      };
      await axios.put(`http://localhost:8095/customers/${customerProfile.customerId}`, payload);
      
      const updatedRes = await axios.get(`http://localhost:8095/customers/${customerProfile.customerId}`);
      setCustomerProfile(updatedRes.data);
      setShowEditModal(false);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (customerProfile) {
    return (
      <div className="w-full space-y-6">
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Customer Dashboard
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Welcome back, <span className="text-white font-medium">{customerProfile.name}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openEditModal}
              className="py-2 px-4 bg-white text-black font-semibold text-xs sm:text-sm rounded-md hover:bg-zinc-200 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={() => setCustomerProfile(null)}
              className="py-2 px-3 border border-zinc-800 text-zinc-400 text-xs sm:text-sm rounded-md hover:text-white hover:border-zinc-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-4 text-sm shadow-xl">
            <div className="text-zinc-400 font-medium border-b border-zinc-800 pb-3 text-base">Profile Overview</div>
            
            <div className="flex justify-between py-2.5 border-b border-zinc-800/60">
              <span className="text-zinc-500">Customer ID</span>
              <span className="text-white font-semibold">#{customerProfile.customerId}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-zinc-800/60">
              <span className="text-zinc-500">Full Name</span>
              <span className="text-white font-medium">{customerProfile.name}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-zinc-800/60">
              <span className="text-zinc-500">Email Address</span>
              <span className="text-white font-medium">{customerProfile.emailId}</span>
            </div>

            <div className="flex justify-between py-2.5">
              <span className="text-zinc-500">Date of Birth</span>
              <span className="text-white font-medium">{customerProfile.dateOfBirth || '-'}</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-4 text-sm shadow-xl">
            <div className="text-zinc-400 font-medium border-b border-zinc-800 pb-3 text-base">Address Details</div>

            <div className="flex justify-between py-2.5 border-b border-zinc-800/60">
              <span className="text-zinc-500">Street</span>
              <span className="text-white font-medium">
                {customerProfile.addressDTO ? customerProfile.addressDTO.street : '-'}
              </span>
            </div>

            <div className="flex justify-between py-2.5">
              <span className="text-zinc-500">City</span>
              <span className="text-white font-medium">
                {customerProfile.addressDTO ? customerProfile.addressDTO.city : '-'}
              </span>
            </div>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 space-y-4 rounded-lg shadow-2xl">
              <h3 className="text-lg font-bold text-white">Update Details</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Name</label>
                  <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Email</label>
                  <input type="email" value={editData.emailId} onChange={e => setEditData({...editData, emailId: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">New Password (Optional)</label>
                  <input type="password" placeholder="Leave empty to keep current" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Date of Birth</label>
                  <input type="date" value={editData.dateOfBirth} onChange={e => setEditData({...editData, dateOfBirth: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Street</label>
                  <input type="text" value={editData.street} onChange={e => setEditData({...editData, street: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">City</label>
                  <input type="text" value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 text-xs sm:text-sm rounded-md">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-md">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {isLogin ? 'Sign In' : 'Register'}
        </h2>
        <p className="text-sm text-zinc-400">
          {isLogin ? 'Enter credentials' : 'Create an account'}
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3.5 text-sm border border-zinc-700 bg-zinc-950 text-zinc-200 rounded-md">
          {message}
        </div>
      )}

      {isLogin ? (
        <form onSubmit={handleCustomerLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-300 font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold rounded-md transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleCustomerRegister} className="space-y-4 text-sm">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">Name</label>
            <input type="text" required value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Email</label>
            <input type="email" required value={regData.emailId} onChange={e => setRegData({...regData, emailId: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Password</label>
              <input type="password" required value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Date of Birth</label>
              <input type="date" required value={regData.dateOfBirth} onChange={e => setRegData({...regData, dateOfBirth: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 [color-scheme:dark]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Street</label>
              <input type="text" required value={regData.street} onChange={e => setRegData({...regData, street: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">City</label>
              <input type="text" required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-semibold rounded-md transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-zinc-800 text-sm text-zinc-400 flex justify-between items-center">
        <span>{isLogin ? 'Need an account?' : 'Have an account?'}</span>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
          className="text-white hover:underline font-semibold"
        >
          {isLogin ? 'Register' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
