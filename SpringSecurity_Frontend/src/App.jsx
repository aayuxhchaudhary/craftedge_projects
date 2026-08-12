import React, { useState } from 'react';
import AdminPortal from './components/AdminPortal';
import CustomerPortal from './components/CustomerPortal';

export default function App() {
  const [tab, setTab] = useState('admin');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-start pt-10 sm:pt-16 pb-12 px-4">
      <div className="w-full max-w-md sm:max-w-lg mb-6 flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg">
        <button
          onClick={() => setTab('admin')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
            tab === 'admin' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Admin Portal
        </button>
        <button
          onClick={() => setTab('customer')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
            tab === 'customer' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Customer Portal
        </button>
      </div>

      <div className="w-full max-w-5xl flex justify-center">
        {tab === 'admin' ? <AdminPortal /> : <CustomerPortal />}
      </div>
    </div>
  );
}
