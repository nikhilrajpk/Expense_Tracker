import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';
import { fetchUser } from './store/authSlice';
import Loader from './utils/Loader'
import Toast from './utils/Toast';
import { logout } from './store/authSlice';
import { selectToast } from './store/toastSlice';
const Login = lazy(()=> import('./Components/Login'))
const Register = lazy(()=> import('./Components/Register'))
const Dashboard = lazy(()=> import('./Components/Dashboard'))
const ExpenseDetail = lazy(()=> import('./Components/ExpenseDetail'))
const Admin = lazy(()=> import('./Components/Admin'))


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const toast = useSelector(selectToast);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader/>}>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-emerald-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Expense-Tracker</Link>
            <div className="space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                  {user?.is_staff && (
                    <>
                      <Link to="/admin/" className="hover:underline">Admin</Link>
                    </>
                  )}
                  <Link
                    to="/"
                    className="hover:underline"
                    onClick={() => {
                      dispatch(logout());
                      // dispatch(showToast({ message: 'Logged out successfully!', type: 'success' }));
                    }}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:underline">Login</Link>
                  <Link to="/register" className="hover:underline">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/expense/:id" element={isAuthenticated ? <ExpenseDetail /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isAuthenticated && user?.is_staff ? <Admin /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
         {toast.isVisible && <Toast message={toast.message} type={toast.type} duration={toast.duration} />}
      </div>
    </Suspense>
  );
}

export default App;