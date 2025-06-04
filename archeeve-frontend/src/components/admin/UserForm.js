import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserForm = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState = (null); 
  const isEditMode = !!user;

  useEffect(() => {
    if (isEditMode && user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation(''); 
      setRole('user');
    }
  }, [user, isEditMode]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const userData = {
      name,
      email,
      role,
    };

    if (password) {
      userData.password = password;
      userData.password_confirmation = passwordConfirmation;
    }

    try {
      if (isEditMode) {
        await api.put(`/admin/users/${user.id}`, userData);
        setSuccess('User updated successfully!');
      } else {
        await api.post('/admin/users', userData);
        setSuccess('User created successfully!');
      }
      onSave();
    } catch (err) {
      const errorMsg = err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(' ') || 'Operation failed.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit User' : 'Add New User'}</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div className="mb-4">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password ({isEditMode ? 'Leave blank to keep current' : 'Required'}):</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={!isEditMode} />
      </div>
      <div className="mb-6">
        <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
        <input type="password" id="passwordConfirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={!isEditMode} />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Add User')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;