// src/pages/user/ChangePasswordPage.js
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LockClosedIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (newPassword !== newPasswordConfirmation) {
      setError({ new_password_confirmation: ['New password confirmation does not match.'] });
      return;
    }
    if (newPassword.length < 8) {
        setError({ new_password: ['New password must be at least 8 characters.']});
        return;
    }

    setLoading(true);
    try {
      // PERBAIKAN: Kirim sebagai FormData atau tambahkan _method jika mengirim objek JSON
      // Jika backend Anda mengharapkan x-www-form-urlencoded atau multipart/form-data untuk _method spoofing:
      // const formData = new FormData();
      // formData.append('current_password', currentPassword);
      // formData.append('new_password', newPassword);
      // formData.append('new_password_confirmation', newPasswordConfirmation);
      // formData.append('_method', 'PUT'); // Untuk memberitahu Laravel ini adalah request PUT
      // await api.post('/user/change-password', formData);

      // Alternatif jika Anda mengirim JSON dan backend Anda mengharapkan PUT:
      // Langsung gunakan api.put atau pastikan Axios instance 'api' dikonfigurasi
      // untuk mengirim _method jika Anda tetap menggunakan .post
      // Untuk konsistensi dengan update profil yang menggunakan FormData dan _method, mari kita gunakan itu.
      // Namun, untuk change password, biasanya tidak ada file, jadi JSON biasa lebih umum.
      // Mari kita coba dengan mengirim _method dalam payload JSON (ini tidak standar untuk semua backend, tapi Laravel bisa menghandle-nya
      // jika Anda menggunakan Route::post di backend dan mengecek _method, atau lebih baik gunakan Route::put)

      // Solusi paling umum jika backend route adalah PUT:
      // Langsung gunakan api.put jika backend Anda didefinisikan dengan Route::put()
      // atau, jika Anda harus menggunakan POST dari frontend karena alasan tertentu dan route backend adalah PUT,
      // Anda bisa mengirim _method sebagai bagian dari data jika backend Anda (misalnya melalui middleware)
      // menghandle method spoofing dari body.
      // Untuk kasus API Laravel, jika route di api.php adalah Route::put(), maka Axios harus mengirim PUT.

      // Mari asumsikan route backend Anda adalah `Route::put('/user/change-password', ...)`
      // maka frontend harus mengirim request PUT.
      await api.put('/user/change-password', { // <--- UBAH api.post MENJADI api.put
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });

      setLoading(false);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');
      
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to change password. Please try again.';
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else if (err.response?.data?.error) {
        setError({ current_password: [err.response.data.error] });
      }
      else {
        setError({ general: [errorMessage] });
      }
      console.error("Change password error:", err.response || err);
    }
  };

  // Helper untuk menampilkan error per field (tetap sama)
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <p className="mt-1 text-xs text-red-600">{error[fieldName][0]}</p>;
    }
    return null;
  };

  // JSX return (tetap sama seperti sebelumnya)
  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8 md:mb-10">
        <ShieldCheckIcon className="mx-auto h-16 w-16 text-yellow-500 mb-3" /> {/* Ganti warna tema */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Change Your Password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a strong password and don't reuse it for other accounts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200 space-y-6">
        {error && error.general && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error.general[0]}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{success}</p>
          </div>
        )}

        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="current_password"
              name="current_password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                         focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
              placeholder="Enter your current password"
            />
          </div>
          {displayError('current_password')}
        </div>

        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                         focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
              placeholder="Minimum 8 characters"
            />
          </div>
          {displayError('new_password')}
        </div>

        <div>
          <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="new_password_confirmation"
              name="new_password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                         focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
              placeholder="Re-type your new password"
            />
          </div>
          {displayError('new_password_confirmation')}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'}
                        transition-colors duration-300`} // Ganti warna tema
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Password...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
