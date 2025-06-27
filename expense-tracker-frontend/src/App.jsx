import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect } from 'react';
import { fetchUser } from './store/authSlice';
import Loader from './utils/Loader'
const Login = lazy(()=> import('./Components/Login'))
const Register = lazy(()=> import('./Components/Register'))
const Dashboard = lazy(()=> import('./Components/Dashboard'))
const ExpenseDetail = lazy(()=> import('./Components/ExpenseDetail'))
const Admin = lazy(()=> import('./Components/Admin'))

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/expense/:id" element={isAuthenticated ? <ExpenseDetail /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated && user?.is_staff ? <Admin /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Suspense>
  );
}

export default App;