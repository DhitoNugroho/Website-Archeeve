import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const TagManagementPage = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null); // Tag yang sedang di-edit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags'); // Admin bisa melihat semua tag (public endpoint)
      setTags(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tags.');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingTag) {
        await api.put(`/admin/tags/${editingTag.id}`, { name: newTagName });
        setSuccess('Tag updated successfully!');
        setEditingTag(null);
      } else {
        await api.post('/admin/tags', { name: newTagName });
        setSuccess('Tag created successfully!');
      }
      setNewTagName(''); // Reset input
      fetchTags(); // Refresh daftar tag
    } catch (err) {
      const errorMsg = err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(' ') || 'Operation failed.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag? All associated articles will be affected.')) {
      try {
        await api.delete(`/admin/tags/${tagId}`);
        fetchTags();
        alert('Tag deleted successfully!');
      } catch (err) {
        setError('Failed to delete tag.');
        console.error(err);
      }
    }
  };

  const handleEditClick = (tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return <div className="text-center text-xl mt-8 text-gray-600">Loading tags...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Tag Management</h1>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingTag ? 'Edit Tag' : 'Add New Tag'}</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingTag ? 'Update Tag' : 'Add Tag')}
          </button>
          {editingTag && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {tags.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {tag.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleEditClick(tag)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 italic">No tags found.</p>
      )}
    </div>
  );
};

export default TagManagementPage;