import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUser } from '../store/authSlice';
import { AlertCircle, Edit, Trash2 } from 'lucide-react';
import { showToast } from '../store/toastSlice';

function Admin() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ start_date: '', end_date: '', category: '', user: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalCount: 0, totalPages: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.is_staff) {
      fetchExpenses();
      fetchUsers();
    }
  }, [filters, user?.is_staff, pagination.currentPage]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ ...filters, page: pagination.currentPage }).toString();
      const response = await axios.get(`/api/expenses/?${params}`, { withCredentials: true });
      setExpenses(response.data.results);
      setPagination({
        currentPage: pagination.currentPage,
        totalCount: response.data.count,
        totalPages: Math.ceil(response.data.count / 10),
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users/', { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch users');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`/api/expenses/${id}/`, { withCredentials: true });
        dispatch(showToast({ message: 'Expense deleted successfully.', type: 'success' }));
        fetchExpenses();
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete expense');
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  if (!user?.is_staff) return <div className="text-center p-4">Access denied. Admins only.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">All Expenses</h2>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">All</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="utilities">Utilities</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">User</label>
              <select
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                className="w-full p-3 border rounded-xl"
              >
                <option value="">All</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={fetchExpenses}
            className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl"
          >
            Apply Filters
          </button>
          {loading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="p-3">Title</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-t">
                        <td className="p-3">{expense.title}</td>
                        <td className="p-3">₹{expense.amount}</td>
                        <td className="p-3">{expense.category}</td>
                        <td className="p-3">{expense.date}</td>
                        <td className="p-3">{expense.username}</td>
                        <td className="p-3">
                          <button
                            onClick={() => navigate(`/expense/${expense.id}`)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-xl disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-xl disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;