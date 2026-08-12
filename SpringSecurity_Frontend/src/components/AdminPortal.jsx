import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPortal() {
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [newCust, setNewCust] = useState({
    name: '',
    emailId: '',
    password: '',
    dateOfBirth: '',
    street: '',
    city: ''
  });

  const [editCust, setEditCust] = useState({
    customerId: '',
    name: '',
    emailId: '',
    password: '',
    dateOfBirth: '',
    street: '',
    city: ''
  });

  const getAuthHeader = () => {
    const token = btoa(`${adminUser}:${adminPass}`);
    return { Authorization: `Basic ${token}` };
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8095/customers', {
        headers: getAuthHeader()
      });
      setCustomers(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setCustomers([]);
        setIsAuthenticated(true);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Invalid Admin Credentials');
        setIsAuthenticated(false);
      } else {
        setError(err.response?.data?.errorMessage || 'Connection Failed to port 8095');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete Customer #${id}?`)) return;
    try {
      await axios.delete(`http://localhost:8095/customers/${id}`, {
        headers: getAuthHeader()
      });
      fetchCustomers();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newCust.name,
        emailId: newCust.emailId,
        password: newCust.password,
        dateOfBirth: newCust.dateOfBirth,
        addressDTO: { street: newCust.street, city: newCust.city }
      };
      await axios.post('http://localhost:8095/customers', payload, {
        headers: getAuthHeader()
      });
      setShowAddModal(false);
      setNewCust({ name: '', emailId: '', password: '', dateOfBirth: '', street: '', city: '' });
      fetchCustomers();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.errorMessage || err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setEditCust({
      customerId: cust.customerId,
      name: cust.name || '',
      emailId: cust.emailId || '',
      password: '',
      dateOfBirth: cust.dateOfBirth || '',
      street: cust.addressDTO?.street || '',
      city: cust.addressDTO?.city || ''
    });
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editCust.name,
        emailId: editCust.emailId,
        password: editCust.password,
        dateOfBirth: editCust.dateOfBirth,
        addressDTO: { street: editCust.street, city: editCust.city }
      };
      await axios.put(`http://localhost:8095/customers/${editCust.customerId}`, payload, {
        headers: getAuthHeader()
      });
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
    (c.emailId && c.emailId.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md sm:max-w-lg bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Admin Sign In
          </h2>
          <p className="text-sm text-zinc-400">
            Enter credentials to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 text-sm border border-zinc-700 bg-zinc-950 text-zinc-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-300 font-medium mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
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
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
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
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white">
            Customer Directory
          </h2>
          <span className="text-xs text-zinc-400">
            Admin: {adminUser}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-4 bg-white text-black text-xs font-semibold rounded-md hover:bg-zinc-200 transition-colors"
          >
            + Add Customer
          </button>
          <button
            onClick={() => { setIsAuthenticated(false); setAdminUser(''); setAdminPass(''); }}
            className="py-2 px-3 border border-zinc-800 text-zinc-400 text-xs rounded-md hover:text-white hover:border-zinc-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 font-medium">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Date of Birth</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-zinc-500">
                  No customers found in database
                </td>
              </tr>
            ) : (
              filteredCustomers.map(cust => (
                <tr key={cust.customerId} className="border-b border-zinc-800/60 hover:bg-zinc-950/50">
                  <td className="py-3 px-4 text-zinc-500">#{cust.customerId}</td>
                  <td className="py-3 px-4 font-medium text-white">{cust.name}</td>
                  <td className="py-3 px-4 text-zinc-300">{cust.emailId}</td>
                  <td className="py-3 px-4 text-zinc-400">{cust.dateOfBirth || '-'}</td>
                  <td className="py-3 px-4 text-zinc-400">
                    {cust.addressDTO ? `${cust.addressDTO.street}, ${cust.addressDTO.city}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cust)}
                      className="py-1 px-3 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 rounded-md text-xs transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cust.customerId)}
                      className="py-1 px-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 rounded-md text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 space-y-4 rounded-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Name</label>
                <input type="text" required value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Email</label>
                <input type="email" required value={newCust.emailId} onChange={e => setNewCust({...newCust, emailId: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Password</label>
                <input type="password" required value={newCust.password} onChange={e => setNewCust({...newCust, password: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Date of Birth</label>
                <input type="date" required value={newCust.dateOfBirth} onChange={e => setNewCust({...newCust, dateOfBirth: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Street</label>
                <input type="text" required value={newCust.street} onChange={e => setNewCust({...newCust, street: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">City</label>
                <input type="text" required value={newCust.city} onChange={e => setNewCust({...newCust, city: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 text-xs sm:text-sm rounded-md">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 space-y-4 rounded-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white">Update Customer #{editCust.customerId}</h3>
            <form onSubmit={handleUpdateCustomer} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Name</label>
                <input type="text" value={editCust.name} onChange={e => setEditCust({...editCust, name: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Email</label>
                <input type="email" value={editCust.emailId} onChange={e => setEditCust({...editCust, emailId: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">New Password (Optional)</label>
                <input type="password" placeholder="Leave empty to keep current" value={editCust.password} onChange={e => setEditCust({...editCust, password: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Date of Birth</label>
                <input type="date" value={editCust.dateOfBirth} onChange={e => setEditCust({...editCust, dateOfBirth: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500 [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Street</label>
                <input type="text" value={editCust.street} onChange={e => setEditCust({...editCust, street: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">City</label>
                <input type="text" value={editCust.city} onChange={e => setEditCust({...editCust, city: e.target.value})} className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white focus:outline-none focus:border-zinc-500" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditingCustomer(null)} className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 text-xs sm:text-sm rounded-md">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-md">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
