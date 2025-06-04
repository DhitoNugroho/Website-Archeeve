import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const history = useHistory();
  const { register, login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (password !== passwordConfirmation) {
      setError({ password_confirmation: ['Password confirmation does not match.'] });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      await login(email, password);
      history.push('/dashboard'); // Arahkan ke dashboard
    } catch (err) {
      // Tangani error dari AuthContext atau API
      const errorMessage = err.message || 'Registration failed. Please try again.';
      if (err.errors) { // Jika backend mengembalikan objek errors (misalnya dari validasi Laravel)
        setError(err.errors);
      } else {
        setError({ general: [errorMessage] }); // Bungkus error generik dalam format yang sama
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menampilkan error per field
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <p className="mt-1 text-xs text-red-600">{error[fieldName][0]}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {/* Lebar kontainer untuk logo dan judul diubah ke sm:max-w-lg */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link to="/" className="flex justify-center items-center text-4xl font-extrabold text-gray-800 hover:text-yellow-500 transition-colors"> {/* Ganti hover:text-yellow-500 */}
          <span className="text-5xl mr-2 text-yellow-500">🧀</span> {/* Ganti text-yellow-500 */}
          Archeeve
        </Link>
        <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold text-gray-700">
          Create your account
        </h2>
      </div>

      {/* Lebar kontainer untuk kartu form diubah ke sm:max-w-lg */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && error.general && ( // Untuk error umum yang tidak terkait field spesifik
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">Registration Error</p>
                <p>{error.general[0]}</p>
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                             focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
                  placeholder="John Doe"
                />
              </div>
              {displayError('name')}
            </div>

            <div>
              <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1"> {/* ID email diubah agar unik */}
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email-register"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                             focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
                  placeholder="you@example.com"
                />
              </div>
              {displayError('email')}
            </div>

            <div>
              <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1"> {/* ID password diubah */}
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password-register"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                             focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
                  placeholder="Minimum 8 characters"
                />
              </div>
              {displayError('password')}
            </div>

            <div>
              <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password-confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 
                             focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors" // Ganti warna focus
                  placeholder="Re-type your password"
                />
              </div>
              {displayError('password_confirmation')}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400'}
                            transition-colors duration-300`} // Ganti warna tema
              >
                {loading ? (
                   <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-yellow-600 hover:text-yellow-500 hover:underline"> {/* Ganti warna tema */}
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
