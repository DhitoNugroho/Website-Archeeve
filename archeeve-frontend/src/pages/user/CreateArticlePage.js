// src/pages/user/CreateArticlePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable'; // Untuk input tags
import api from '../../services/api'; // Sesuaikan path
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path

// Contoh ikon dari Heroicons (opsional, bisa ditambahkan pada label atau tombol jika mau)
import { DocumentTextIcon, TagIcon, ListBulletIcon, PhotoIcon, CheckCircleIcon, XCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const CreateArticlePage = () => {
  const { id } = useParams(); // Akan ada jika mode edit
  const history = useHistory();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Format: [{ value: 'TagName', label: 'TagName' }, ...]
  const [image, setImage] = useState(null); // File object untuk upload baru
  const [imagePreview, setImagePreview] = useState(''); // URL string untuk preview gambar baru atau yang sudah ada
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // URL gambar yang sudah ada dari server (untuk edit mode)
  const [clearCurrentImage, setClearCurrentImage] = useState(false); // Flag untuk menghapus gambar yang sudah ada
  const [status, setStatus] = useState('draft');

  const [categories, setCategories] = useState([]);
  const [availableTagOptions, setAvailableTagOptions] = useState([]); // Opsi tag yang ada untuk CreatableSelect

  const [loading, setLoading] = useState(false); // Untuk loading submit form
  const [pageLoading, setPageLoading] = useState(true); // Untuk loading data awal
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  const LARAVEL_API_URL = process.env.REACT_APP_LARAVEL_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      setError(null);
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags')
        ]);

        const fetchedCategories = categoriesRes.data.data || categoriesRes.data;
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);

        const fetchedRawTags = tagsRes.data.data || tagsRes.data;
        if (Array.isArray(fetchedRawTags)) {
          setAvailableTagOptions(fetchedRawTags.map(tag => ({ value: tag.name, label: tag.name })));
        } else {
          setAvailableTagOptions([]);
        }

        if (isEditMode) {
          const response = await api.get(`/articles/${id}/edit`); // Endpoint untuk mengambil data artikel yang akan diedit
          const article = response.data.data || response.data;
          
          setTitle(article.title || '');
          setContent(article.content || '');
          setCategoryId(article.category_id ? String(article.category_id) : '');
          
          if (article.tags && Array.isArray(article.tags)) {
            setSelectedTags(article.tags.map(tag => ({ value: tag.name, label: tag.name })));
          }
          
          const imagePathFromApi = article.image_url || article.image;
          if (imagePathFromApi) {
            const fullImageUrl = imagePathFromApi.startsWith('http') ? imagePathFromApi : `${LARAVEL_API_URL.replace(/\/+$/, '')}/${imagePathFromApi.replace(/^\/+/, '')}`;
            setCurrentImageUrl(fullImageUrl);
            setImagePreview(fullImageUrl); // Set preview dengan gambar yang sudah ada
          }
          setStatus(article.status || 'draft');
        }
      } catch (err) {
        console.error('[CreateArticlePage] Error fetching initial data:', err.response?.data || err.message);
        setError('Failed to load initial data. Please try again.');
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode, LARAVEL_API_URL]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setClearCurrentImage(false); // Jika memilih file baru, jangan hapus gambar yang ada (jika ada) sampai disubmit
      setSuccess('');
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    setClearCurrentImage(true); // Tandai untuk menghapus gambar saat ini di server (jika edit mode)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  const handleTagChange = (newValue) => {
    setSelectedTags(newValue || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', status);
    if (categoryId) formData.append('category_id', categoryId);
    
    if (selectedTags && selectedTags.length > 0) {
      selectedTags.forEach(tagObject => formData.append('tags[]', tagObject.value));
    } else {
      formData.append('tags[]', ''); // Kirim array kosong jika tidak ada tag
    }

    if (image) { // Jika ada file gambar baru yang dipilih
      formData.append('image', image);
    } else if (isEditMode && clearCurrentImage) { // Jika edit mode dan ingin menghapus gambar yang ada
      formData.append('clear_image', '1');
    }
    // Jika tidak ada gambar baru dan tidak clear_image, backend tidak akan mengubah gambar yang ada

    const endpoint = isEditMode ? `/articles/${id}` : '/articles';
    const method = isEditMode ? 'POST' : 'POST'; // Laravel handle PUT via _method
    if (isEditMode) {
        formData.append('_method', 'PUT');
    }

    try {
      const response = await api({ // Menggunakan konfigurasi Axios langsung
        method: method,
        url: endpoint,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setLoading(false);
      setSuccess(isEditMode ? 'Article updated successfully!' : 'Article created successfully!');
      
      // Arahkan setelah beberapa saat
      setTimeout(() => {
        history.push(user?.role === 'admin' ? '/admin/articles' : '/articles/manage');
      }, 1500);

    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.message || 
                       (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : null) || 
                       'Operation failed. Please check console.';
      setError(errorMsg);
      console.error("Submit error:", err.response || err);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-yellow-500 font-sans"> {/* Ganti text-yellow-500 */}
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ganti text-yellow-500 */}
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Loading Form...</p>
      </div>
    );
  }

  return (
    // Padding halaman sudah diatur oleh <main> di App.js
    // font-sans juga seharusnya sudah diatur di App.js atau body
    <div className="max-w-4xl mx-auto"> {/* Kontainer untuk membatasi lebar form */}
      <div className="text-center mb-8 md:mb-10">
        <DocumentTextIcon className="mx-auto h-16 w-16 text-yellow-500 mb-3" /> {/* Ganti warna tema */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isEditMode ? 'Update the details of your article.' : 'Fill in the details to publish your new article.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 border border-gray-200 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start" role="alert">
            <XCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start" role="alert">
            <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
                <p className="font-bold">Success</p>
                <p>{success}</p>
            </div>
          </div>
        )}

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Article Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
            placeholder="Enter a catchy title"
          />
        </div>

        {/* Content Field (Textarea) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors" // Ganti warna tema
            placeholder="Write your article content here... (Supports HTML)"
          />
           <p className="mt-1 text-xs text-gray-500">You can use basic HTML tags for formatting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
            </label>
            <select
                id="category"
                name="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors bg-white" // Ganti warna tema
            >
                <option value="">Select a Category</option>
                {categories.map(cat => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
            </select>
            </div>

            {/* Status Select */}
            <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
            </label>
            <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:text-sm p-3 transition-colors bg-white" // Ganti warna tema
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                {/* Tambahkan 'archived' jika backend mendukung */}
                {/* <option value="archived">Archived</option> */}
            </select>
            </div>
        </div>

        {/* Tags Input (CreatableSelect) */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags <span className="text-xs text-gray-500">(Type to create new or select existing)</span>
          </label>
          <CreatableSelect
            isMulti
            id="tags"
            name="tags"
            options={availableTagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            placeholder="Add tags to your article..."
            className="mt-1 basic-multi-select text-gray-700"
            classNamePrefix="select" // Untuk styling internal react-select
            styles={{ // Contoh styling dasar untuk react-select agar lebih menyatu
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused ? '#FFD700' /* Ganti dengan warna cheese-yellow Anda */ : 'rgb(209 213 219)', // Tailwind gray-300
                    boxShadow: state.isFocused ? '0 0 0 1px #FFD700' /* Ganti dengan warna cheese-yellow Anda */ : baseStyles.boxShadow,
                    '&:hover': {
                        borderColor: state.isFocused ? '#FFD700' /* Ganti dengan warna cheese-yellow Anda */ : 'rgb(156 163 175)', // Tailwind gray-400
                    },
                    borderRadius: '0.5rem', // rounded-lg
                    padding: '0.25rem', // Sedikit padding internal
                }),
                multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: '#FEF3C7', // bg-yellow-100 (Ganti dengan warna tema yang lebih soft)
                    borderRadius: '0.375rem', // rounded-md
                }),
                multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    color: '#92400E', // text-yellow-700 (Ganti dengan warna tema)
                }),
                multiValueRemove: (baseStyles) => ({
                    ...baseStyles,
                    color: '#92400E', // text-yellow-700
                    ':hover': {
                        backgroundColor: '#FDE68A', // bg-yellow-200
                        color: '#78350F', // text-yellow-800
                    },
                }),
            }}
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Article Image
          </label>
          <div className="mt-2 flex items-center space-x-6">
            <div className="shrink-0">
              {imagePreview ? (
                <img className="h-24 w-36 object-cover rounded-md shadow" src={imagePreview} alt="Article preview" />
              ) : (
                <div className="h-24 w-36 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400">
                  <PhotoIcon className="h-12 w-12" />
                </div>
              )}
            </div>
            <div className="flex-1">
                <input
                    type="file"
                    id="article-image-upload"
                    name="article-image-upload"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors" // Ganti warna tema
                >
                    {imagePreview && !image ? 'Change Image' : 'Upload Image'}
                </button>
                {imagePreview && (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="ml-3 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                        Remove
                    </button>
                )}
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 2MB.</p>
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="pt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => history.goBack()}
            disabled={loading}
            className="bg-white py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors" // Ganti warna tema
          >
            <ArrowUturnLeftIcon className="h-5 w-5 inline mr-1.5 -ml-1"/>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || pageLoading}
            className={`inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                        ${(loading || pageLoading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'}
                        transition-colors duration-300`} // Ganti warna tema
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Article' : 'Create Article'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticlePage;
