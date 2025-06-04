// src/pages/user/DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Sesuaikan path jika perlu

// Contoh impor ikon dari Heroicons (versi outline)
// Anda perlu instal @heroicons/react
// npm install @heroicons/react
// atau yarn add @heroicons/react
import {
  DocumentPlusIcon,
  FolderOpenIcon,
  EyeIcon,
  UserCircleIcon,
  KeyIcon,
  Cog6ToothIcon, // Contoh ikon untuk settings, jika ada
} from '@heroicons/react/24/outline'; // Gunakan /24/solid untuk versi solid

const DashboardPage = () => {
  const { user } = useAuth(); // Mengambil data user dari AuthContext

  const actions = [
    {
      label: 'Create New Article',
      to: '/articles/create', // Sesuaikan dengan path rute Anda
      icon: DocumentPlusIcon,
      bgColor: 'bg-yellow-500', // Ganti dengan bg-cheese-yellow
      hoverBgColor: 'hover:bg-yellow-600', // Ganti dengan hover:bg-cheese-yellow-dark (jika ada)
      textColor: 'text-white',
      description: 'Write and publish a new piece of content.',
    },
    {
      label: 'Manage My Articles',
      to: '/articles/manage', // Sesuaikan dengan path rute Anda
      icon: FolderOpenIcon,
      bgColor: 'bg-green-500',
      hoverBgColor: 'hover:bg-green-600',
      textColor: 'text-white',
      description: 'View, edit, or delete your existing articles.',
    },
    {
      label: 'My Published Articles', // Anda mungkin perlu logika/halaman berbeda untuk ini
      to: '/my-articles?status=published', // Contoh path, sesuaikan
      icon: EyeIcon,
      bgColor: 'bg-purple-500',
      hoverBgColor: 'hover:bg-purple-600',
      textColor: 'text-white',
      description: 'See all your articles that are live.',
    },
    {
      label: 'Edit Profile',
      to: '/profile/edit', // Sesuaikan dengan path rute Anda
      icon: UserCircleIcon,
      bgColor: 'bg-blue-500',
      hoverBgColor: 'hover:bg-blue-600',
      textColor: 'text-white',
      description: 'Update your personal information.',
    },
    {
      label: 'Change Password',
      to: '/profile/change-password', // Sesuaikan dengan path rute Anda
      icon: KeyIcon,
      bgColor: 'bg-red-500',
      hoverBgColor: 'hover:bg-red-600',
      textColor: 'text-white',
      description: 'Secure your account by updating your password.',
    },
    // Anda bisa menambahkan action lain jika perlu
    // { label: 'Account Settings', to: '/settings', icon: Cog6ToothIcon, bgColor: 'bg-gray-500', hoverBgColor: 'hover:bg-gray-600', textColor: 'text-white', description: 'Manage your account preferences.' },
  ];

  // Untuk konsistensi tema, kita bisa ubah warna tombol di atas menjadi variasi tema kuning
  // atau menggunakan pendekatan kartu yang lebih netral dengan aksen kuning.
  // Mari kita coba pendekatan kartu dengan latar putih dan aksen kuning.

  const themedActions = [
    {
      label: 'Create New Article',
      to: '/articles/create',
      icon: DocumentPlusIcon,
      description: 'Write and publish new content.',
      iconColor: 'text-yellow-500', // Ganti dengan text-cheese-yellow
    },
    {
      label: 'Manage My Articles',
      to: '/articles/manage',
      icon: FolderOpenIcon,
      description: 'View, edit, or delete your articles.',
      iconColor: 'text-green-500', // Bisa juga diganti dengan warna tema
    },
    {
      label: 'My Published Articles',
      to: '/my-articles?status=published',
      icon: EyeIcon,
      description: 'See all your articles that are live.',
      iconColor: 'text-purple-500', // Bisa juga diganti dengan warna tema
    },
    {
      label: 'Edit Profile',
      to: '/profile/edit',
      icon: UserCircleIcon,
      description: 'Update your personal information.',
      iconColor: 'text-blue-500', // Bisa juga diganti dengan warna tema
    },
    {
      label: 'Change Password',
      to: '/profile/change-password',
      icon: KeyIcon,
      description: 'Secure your account.',
      iconColor: 'text-red-500', // Bisa juga diganti dengan warna tema
    },
  ];


  return (
    // Padding halaman sudah diatur oleh <main> di App.js
    // font-sans juga seharusnya sudah diatur di App.js atau body
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Welcome, <span className="text-yellow-500">{user?.name || 'User'}</span>! {/* Ganti dengan text-cheese-yellow */}
        </h1>
        <p className="text-gray-600 text-lg">
          This is your personal dashboard. Here you can manage your articles and profile.
        </p>
      </div>

      {/* Action Cards Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themedActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 
                           p-6 flex flex-col items-center text-center 
                           transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-yellow-400" // Ganti hover:border-yellow-400
              >
                <IconComponent className={`h-12 w-12 mb-4 ${action.iconColor} group-hover:text-yellow-600 transition-colors`} strokeWidth={1.5} /> {/* Ganti warna ikon */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors">{action.label}</h3> {/* Ganti warna teks */}
                <p className="text-sm text-gray-500">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Account Information Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Account Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-lg text-gray-800">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-lg text-gray-800">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-lg text-gray-800 capitalize">{user?.role || 'N/A'}</p> {/* `capitalize` untuk membuat huruf awal besar */}
          </div>
          {/* Anda bisa menambahkan informasi lain jika perlu */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;