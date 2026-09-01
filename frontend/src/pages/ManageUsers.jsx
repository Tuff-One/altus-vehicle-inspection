import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getUsers, createUser, deactivateUser, reactivateUser } from '../services/userService.js';

function ManageUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('4');
  const [error, setError] = useState('');

  const isAdmin = user?.role_id === 1;

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [token]);

  async function refreshUsers() {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await createUser({ name, email, password, role_id: roleId }, token);
      setName('');
      setEmail('');
      setPassword('');
      refreshUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create user.');
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm('Deactivate this user? They will no longer be able to log in.')) return;
    try {
      await deactivateUser(id, token);
      refreshUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not deactivate user.');
    }
  }

  async function handleReactivate(id) {
    try {
      await reactivateUser(id, token);
      refreshUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Could not reactivate user.');
    }
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>Manage Users</h1>

      <div className="form-card">
        <h2>Add User</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Temporary Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <select id="role" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="4">Driver</option>
              <option value="3">Supervisor</option>
              {isAdmin && <option value="2">Boss</option>}
              {isAdmin && <option value="1">Admin</option>}
            </select>
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Add User</button>
        </form>
      </div>

      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role_name}</td>
              <td>{u.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                {u.id === user.id ? null : u.is_active === 1 ? (
                  <button onClick={() => handleDeactivate(u.id)}>Deactivate</button>
                ) : (
                  <button onClick={() => handleReactivate(u.id)}>Reactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;