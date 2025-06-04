import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import komponen utama UI
import Navbar from './components/Navbar';
import MobileHeader from './components/MobileHeader';

// Import halaman publik
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import CategoriesListPage from './pages/CategoriesListPage';
import CategoryPage from './pages/CategoryPage';
import TagsListPage from './pages/TagsListPage'; // <-- IMPORT KOMPONEN BARU
import TagPage from './pages/TagPage'; // Ini untuk /tags/:slug
import SearchResultsPage from './pages/SearchResultsPage';

// ... (sisa import halaman user dan admin tetap sama)
import PrivateRoute from './components/PrivateRoute';
import DashboardPage from './pages/user/DashboardPage';
import CreateArticlePage from './pages/user/CreateArticlePage';
import ManageArticlesPage from './pages/user/ManageArticlesPage';
import EditProfilePage from './pages/user/EditProfilePage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';
import UserArticlesPage from './pages/user/UserArticlesPage';

import AdminRoute from './components/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ArticleManagementPage from './pages/admin/ArticleManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import TagManagementPage from './pages/admin/TagManagementPage';
import CommentModerationPage from './pages/admin/CommentModerationPage';
import WebsiteSettingsPage from './pages/admin/WebsiteSettingsPage';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen bg-gray-100 font-sans">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-64 lg:ml-72 xl:ml-80`}>
            <MobileHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

            <main className="flex-grow p-4 md:px-6 lg:px-8">
              <Switch>
                {/* ... Rute lain tetap sama ... */}
                <Route exact path="/" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                
                <PrivateRoute path="/articles/create" component={CreateArticlePage} />
                <PrivateRoute path="/articles/manage" component={ManageArticlesPage} />
                <PrivateRoute path="/articles/edit/:id" component={CreateArticlePage} />
                <Route path="/articles/:slug" component={ArticleDetailPage} /> 

                <Route exact path="/categories" component={CategoriesListPage} />
                <Route path="/categories/:slug" component={CategoryPage} /> 
                
                {/* Rute untuk daftar semua tag */}
                <Route exact path="/tags" component={TagsListPage} /> {/* <-- TAMBAHKAN RUTE INI (dengan exact) */}
                
                {/* Rute untuk menampilkan artikel dalam satu tag (menggunakan :slug) */}
                <Route path="/tags/:slug" component={TagPage} /> 
                
                <Route path="/search" component={SearchResultsPage} />

                <PrivateRoute path="/dashboard" component={DashboardPage} />
                <PrivateRoute path="/profile/edit" component={EditProfilePage} />
                <PrivateRoute path="/profile/change-password" component={ChangePasswordPage} />
                <PrivateRoute path="/my-articles" component={UserArticlesPage} />

                <AdminRoute path="/admin/dashboard" component={AdminDashboardPage} />
                <AdminRoute path="/admin/users" component={UserManagementPage} />
                <AdminRoute path="/admin/articles" component={ArticleManagementPage} />
                <AdminRoute path="/admin/categories" component={CategoryManagementPage} />
                <AdminRoute path="/admin/tags" component={TagManagementPage} />
                <AdminRoute path="/admin/comments" component={CommentModerationPage} />
                <AdminRoute path="/admin/settings" component={WebsiteSettingsPage} />

                <Route path="*">
                  <div className="text-center py-20">
                    <h2 className="text-red-500 text-7xl font-extrabold mb-4">404</h2>
                    <p className="text-gray-700 text-2xl mb-8">Page Not Found</p>
                    <p>
                      <Link to="/" className="text-blue-600 hover:underline text-lg">Go to Homepage</Link>
                    </p>
                  </div>
                </Route>
              </Switch>
            </main>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;