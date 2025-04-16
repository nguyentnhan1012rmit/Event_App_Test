import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5001/api/admin/users');
    setUsers(res.data);
  };

  const fetchEvents = async () => {
    const res = await axios.get('http://localhost:5001/api/admin/events');
    setEvents(res.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5001/api/admin/user/${id}`);
    fetchUsers();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5001/api/admin/event/${id}`);
    fetchEvents();
  };

  const handleUpdateUser = async () => {
    await axios.put(`http://localhost:5001/api/admin/user/${editUser._id}`, {
      name: editName,
      password: editPassword,
    });
    setEditUser(null);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === 'all' || user.role === roleFilter)
  );

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'all' || event.type === typeFilter)
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">EVEMA Admin</div>
        <nav className="flex-1 p-4 space-y-3">
          <button className={`w-full text-left px-4 py-2 rounded ${tab === 'dashboard' ? 'bg-blue-700' : ''}`} onClick={() => setTab('dashboard')}>Dashboard</button>
          <button className={`w-full text-left px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-700' : ''}`} onClick={() => setTab('users')}>Users</button>
          <button className={`w-full text-left px-4 py-2 rounded ${tab === 'events' ? 'bg-blue-700' : ''}`} onClick={() => setTab('events')}>Events</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="flex justify-between items-center p-4 bg-white shadow-md">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <input type="text" placeholder="Search..." className="border rounded px-2 py-1" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded shadow text-center">
                <h2 className="text-lg font-semibold">Total Users</h2>
                <p className="text-4xl">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded shadow text-center">
                <h2 className="text-lg font-semibold">Total Events</h2>
                <p className="text-4xl">{events.length}</p>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Users</h2>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border px-3 py-1 rounded text-sm">
                  <option value="all">All Roles</option>
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>

              <table className="w-full table-auto border border-gray-200 bg-white shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Password</th>
                    <th className="border px-4 py-2">Role</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="border px-4 py-2">{user.name}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">{user.plainPassword}</td>
                      <td className="border px-4 py-2 capitalize">{user.role}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button onClick={() => { setEditUser(user); setEditName(user.name); setEditPassword(user.plainPassword); }} className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Events */}
          {tab === 'events' && (
            <>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Events</h2>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border px-3 py-1 rounded text-sm">
                  <option value="all">All Types</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <table className="w-full table-auto border border-gray-200 bg-white shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">Event Name</th>
                    <th className="border px-4 py-2">Created By</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event._id}>
                      <td className="border px-4 py-2">{event.eventName}</td>
                      <td className="border px-4 py-2">{event.createdBy?.name || 'Unknown'}</td>
                      <td className="border px-4 py-2 capitalize">{event.type}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => deleteEvent(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Edit User Modal */}
          {editUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Edit User: <span className="text-blue-600">{editUser.name}</span>
                </h2>
                <label className="block text-sm text-gray-700 mb-1">Username</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-2 w-full mb-4 rounded" placeholder="Enter new username" />
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input type="text" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="border p-2 w-full mb-4 rounded" placeholder="Enter new password" />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditUser(null)} className="px-3 py-1 bg-gray-400 rounded text-white">Cancel</button>
                  <button onClick={handleUpdateUser} className="px-3 py-1 bg-blue-600 rounded text-white">Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
