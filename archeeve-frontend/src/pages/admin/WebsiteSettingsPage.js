import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api'; // Sesuaikan path jika perlu
import { Cog6ToothIcon, PhotoIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const WebsiteSettingsPage = () => {
  const [settings, setSettings] = useState({
    site_title: '',
    seo_description: '',
    seo_keywords: '',
    // Tambahkan field lain jika ada, misal: site_favicon, contact_email, dll.
  });
  const [currentLogoUrl, setCurrentLogoUrl] = useState('');
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [loading, setLoading] = useState(true); // Loading untuk fetch data awal
  const [saving, setSaving] = useState(false); // Loading untuk proses save
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const fileInputRef = useRef(null);
  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Asumsi endpoint API untuk mengambil settings adalah /admin/settings
        const response = await api.get('/admin/settings');
        const fetchedSettings = response.data.settings || response.data || {}; // Sesuaikan dengan struktur API
        setSettings({
          site_title: fetchedSettings.site_title || '',
          seo_description: fetchedSettings.seo_description || '',
          seo_keywords: Array.isArray(fetchedSettings.seo_keywords) 
                          ? fetchedSettings.seo_keywords.join(', ') 
                          : (fetchedSettings.seo_keywords || ''),
          // ... set field lain
        });
        if (fetchedSettings.site_logo_url) {
          // Pastikan URL lengkap
          const fullLogoUrl = fetchedSettings.site_logo_url.startsWith('http')
            ? fetchedSettings.site_logo_url
            : `${LARAVEL_API_URL.replace(/\/+$/, '')}/${fetchedSettings.site_logo_url.replace(/^\/+/, '')}`;
          setCurrentLogoUrl(fullLogoUrl);
          setLogoPreview(fullLogoUrl); // Set preview dengan logo saat ini
        }
      } catch (err) {
        setError('Failed to load website settings. Please try again.');
        console.error("Error fetching settings:", err.response?.data || err.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [LARAVEL_API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setSuccess('');
      setError(null);
    }
  };

  const handleRemoveLogoPreview = () => {
    setNewLogoFile(null);
    setLogoPreview(currentLogoUrl); // Kembali ke preview logo saat ini (jika ada)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    const formData = new FormData();
    formData.append('site_title', settings.site_title);
    formData.append('seo_description', settings.seo_description);
    formData.append('seo_keywords', settings.seo_keywords); // Kirim sebagai string, backend bisa memprosesnya
    
    if (newLogoFile) {
      formData.append('site_logo', newLogoFile);
    }
    // Jika Anda ingin opsi untuk menghapus logo yang ada tanpa mengganti:
    // if (logoPreview === '' && currentLogoUrl !== '' && !newLogoFile) {
    //   formData.append('remove_logo', '1');
    // }

    // Laravel biasanya mengharapkan _method untuk PUT via POST dengan FormData
    formData.append('_method', 'POST'); // Atau PUT jika API Anda langsung support PUT dengan FormData

    try {
      // Asumsi endpoint API untuk update settings adalah /admin/settings
      // Laravel akan menghandle method spoofing jika route adalah PUT/PATCH dan Anda mengirim _method
      const response = await api.post('/admin/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSaving(false);
      setSuccess('Website settings updated successfully!');
      
      // Update URL logo saat ini jika berubah
      if (response.data.settings?.site_logo_url) {
        const updatedLogoUrl = response.data.settings.site_logo_url;
        const fullUpdatedLogoUrl = updatedLogoUrl.startsWith('http')
            ? updatedLogoUrl
            : `${LARAVEL_API_URL.replace(/\/+$/, '')}/${updatedLogoUrl.replace(/^\/+/, '')}`;
        setCurrentLogoUrl(fullUpdatedLogoUrl);
        setLogoPreview(fullUpdatedLogoUrl);
      }
      setNewLogoFile(null); // Reset file input

    } catch (err) {
      setSaving(false);
      const errorMsg = err.response?.data?.message || 'Failed to update settings. Please try again.';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().join(' ');
        setError(messages || errorMsg);
      } else {
        setError(errorMsg);
      }
      console.error("Settings update error:", err.response || err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center space-x-3">
        <Cog6ToothIcon className="h-8 w-8 text-yellow-500" /> {/* Ganti warna tema */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Website Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start" role="alert">
            <XCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <div><p className="font-bold">Error</p><p>{error}</p></div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start" role="alert">
            <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <div><p className="font-bold">Success</p><p>{success}</p></div>
          </div>
        )}

        {/* General Settings Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-1">
              Site Title
            </label>
            <input
              type="text"
              name="site_title"
              id="site_title"
              value={settings.site_title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
              placeholder="Your Awesome Website Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Logo
            </label>
            <div className="mt-2 flex items-center space-x-6">
              <div className="shrink-0">
                {logoPreview ? (
                  <img className="h-16 w-auto object-contain rounded-md shadow" src={logoPreview} alt="Site logo preview" />
                ) : (
                  <div className="h-16 w-32 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 bg-gray-50">
                    <PhotoIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="site_logo_upload"
                  name="site_logo_upload"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg, image/gif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors" // Ganti warna tema
                >
                  {logoPreview && logoPreview !== currentLogoUrl ? 'Change Logo' : (currentLogoUrl ? 'Change Logo' : 'Upload Logo')}
                </button>
                {logoPreview && logoPreview !== currentLogoUrl && ( // Tampilkan tombol remove hanya jika ada preview dari file baru
                  <button
                    type="button"
                    onClick={handleRemoveLogoPreview}
                    className="ml-3 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Cancel Change
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-500">Recommended: PNG, SVG. Max 1MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings Section */}
        <div className="space-y-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
            <div>
                <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
                </label>
                <textarea
                name="seo_description"
                id="seo_description"
                rows="3"
                value={settings.seo_description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
                placeholder="A brief description of your website for search engines."
                />
            </div>

            <div>
                <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
                </label>
                <input
                type="text"
                name="seo_keywords"
                id="seo_keywords"
                value={settings.seo_keywords}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
                placeholder="keyword1, keyword2, keyword3 (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-500">Separate keywords with a comma.</p>
            </div>
        </div>
        
        {/* Tombol Save */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex justify-center py-2.5 px-8 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white 
                        ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'}
                        transition-colors duration-300`} // Ganti warna tema
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSettingsPage;
