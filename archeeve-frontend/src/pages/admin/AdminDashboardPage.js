import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Sesuaikan path jika perlu

// Ikon dari Heroicons (pastikan sudah diinstal: npm install @heroicons/react)
import {
  UserGroupIcon,
  DocumentTextIcon,
  EyeIcon,
  ChatBubbleLeftEllipsisIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, iconBgColor = 'bg-yellow-100', iconTextColor = 'text-yellow-600', linkTo }) => {
  const cardContent = (
    <>
      <div className={`p-3 rounded-full ${iconBgColor} mr-4 flex-shrink-0`}>
        <Icon className={`h-7 w-7 ${iconTextColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-800">{value}</p>
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 flex items-center"> {/* Ganti hover:border-yellow-400 */}
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 flex items-center">
      {cardContent}
    </div>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    publishedArticles: 0,
    pendingComments: 0,
  });
  const [mostViewedArticles, setMostViewedArticles] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingStats(true);
      setLoadingArticles(true);
      try {
        // Ganti dengan endpoint API Anda yang sebenarnya
        const statsResponse = await api.get('/admin/dashboard-stats'); 
        setStats({
          totalUsers: statsResponse.data.totalUsers || 0,
          totalArticles: statsResponse.data.totalArticles || 0,
          publishedArticles: statsResponse.data.publishedArticles || 0,
          pendingComments: statsResponse.data.pendingComments || 0,
        });

        // Asumsi API untuk artikel terpopuler
        const articlesResponse = await api.get('/admin/most-viewed-articles'); // Ganti endpoint jika perlu
        setMostViewedArticles(articlesResponse.data.data || articlesResponse.data || []);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Tambahkan penanganan error untuk ditampilkan di UI jika perlu
      } finally {
        setLoadingStats(false);
        setLoadingArticles(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    { label: 'Manage Users', to: '/admin/users', icon: UsersIcon, color: 'text-blue-600' },
    { label: 'Manage All Articles', to: '/admin/articles', icon: ArchiveBoxIcon, color: 'text-green-600' },
    { label: 'Moderate Comments', to: '/admin/comments', icon: ChatBubbleBottomCenterTextIcon, color: 'text-red-600' },
    { label: 'Website Settings', to: '/admin/settings', icon: Cog6ToothIcon, color: 'text-gray-600' },
  ];

  // Fungsi untuk menampilkan placeholder saat loading
  const SkeletonText = ({ className = "h-4 bg-gray-200 rounded w-3/4" }) => <div className={`animate-pulse ${className}`}></div>;


  return (
    // Padding halaman sudah diatur oleh <main> di App.js
    // font-sans juga seharusnya sudah diatur di App.js atau body
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
            <>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 flex items-center">
                        <div className="p-3 rounded-full bg-gray-100 mr-4 h-12 w-12 animate-pulse"></div>
                        <div>
                            <SkeletonText className="h-4 bg-gray-200 rounded w-24 mb-2" />
                            <SkeletonText className="h-8 bg-gray-300 rounded w-12" />
                        </div>
                    </div>
                ))}
            </>
        ) : (
            <>
                <StatCard title="Total Users" value={stats.totalUsers} icon={UserGroupIcon} iconBgColor="bg-blue-100" iconTextColor="text-blue-600" linkTo="/admin/users" />
                <StatCard title="Total Articles" value={stats.totalArticles} icon={DocumentTextIcon} iconBgColor="bg-green-100" iconTextColor="text-green-600" linkTo="/admin/articles" />
                <StatCard title="Published Articles" value={stats.publishedArticles} icon={EyeIcon} iconBgColor="bg-purple-100" iconTextColor="text-purple-600" />
                <StatCard title="Pending Comments" value={stats.pendingComments} icon={ChatBubbleLeftEllipsisIcon} iconBgColor="bg-red-100" iconTextColor="text-red-600" linkTo="/admin/comments"/>
            </>
        )}
      </div>

      {/* Bagian Konten Tengah (Quick Actions & Most Viewed Articles) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`w-full flex items-center p-3 rounded-lg text-base font-medium
                              bg-gray-50 hover:bg-yellow-100 text-gray-700 hover:text-yellow-700 
                              border border-gray-200 hover:border-yellow-300
                              transition-all duration-200 ease-in-out group`} // Ganti warna tema
                >
                  <Icon className={`h-6 w-6 mr-3 ${action.color} group-hover:text-yellow-600 transition-colors`} /> {/* Ganti warna tema */}
                  {action.label}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-auto text-gray-400 group-hover:text-yellow-500 transition-colors" /> {/* Ganti warna tema */}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Most Viewed Articles */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">Most Viewed Articles</h2>
          {loadingArticles ? (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="py-3 border-b border-gray-100 last:border-b-0">
                        <SkeletonText className="h-5 bg-gray-200 rounded w-5/6 mb-1" />
                        <SkeletonText className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                ))}
            </div>
          ) : mostViewedArticles.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {mostViewedArticles.slice(0, 5).map((article) => ( // Tampilkan maks 5
                <li key={article.id} className="py-3 flex justify-between items-center">
                  <Link to={`/articles/${article.slug}`} className="text-gray-800 hover:text-yellow-600 hover:underline font-medium transition-colors text-base"> {/* Ganti warna tema */}
                    {article.title}
                  </Link>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{article.views_count || 0} views</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No article view data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

